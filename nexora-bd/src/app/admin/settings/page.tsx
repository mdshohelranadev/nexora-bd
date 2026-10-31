'use client';

import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { defaultSettings, pickSettings, useSettingsStore, type DeliveryZoneSettings, type FlashSaleSettings, type SiteSettings } from '@/store/settingsStore';
import { supabase } from '@/lib/supabase';
import { uploadAsset } from '@/lib/upload';
import { useHydrated } from '@/hooks/useHydrated';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';

type ZoneKey = 'insideDhaka' | 'outsideDhaka';

function toLocalInput(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-card">
      <h2 className="font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function AdminSettingsPage() {
  const hydrated = useHydrated();
  const remoteLoaded = useSettingsStore((s) => s.remoteLoaded);
  const update = useSettingsStore((s) => s.update);
  const reset = useSettingsStore((s) => s.reset);
  const [draft, setDraft] = useState<SiteSettings>(defaultSettings);
  const [synced, setSynced] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [slugText, setSlugText] = useState('');

  useEffect(() => {
    if (remoteLoaded && !synced) {
      const initial = pickSettings(useSettingsStore.getState());
      setDraft(initial);
      setSlugText(initial.flashSale.productSlugs.join(', '));
      setSynced(true);
    }
  }, [remoteLoaded, synced]);

  if (!hydrated || !remoteLoaded || !synced) {
    return (
      <div className="flex max-w-3xl flex-col gap-6" aria-busy="true">
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  const setField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setMessage('');
  };
  const setZone = (key: ZoneKey, patch: Partial<DeliveryZoneSettings>) => {
    setDraft((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
    setMessage('');
  };
  const setFlash = (patch: Partial<FlashSaleSettings>) => {
    setDraft((d) => ({ ...d, flashSale: { ...d.flashSale, ...patch } }));
    setMessage('');
  };
  const num = (v: string) => Math.max(0, Number(v) || 0);

  const save = () => {
    update(draft);
    setMessage('Saved. Changes are live for all visitors.');
  };

  const uploadLogo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !supabase) return;
    setUploading(true);
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const path = `brand/logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('assets').upload(path, file, { cacheControl: '3600', upsert: true });
    setUploading(false);
    if (error) {
      setMessage(`Logo upload failed: ${error.message}`);
      return;
    }
    const { data } = supabase.storage.from('assets').getPublicUrl(path);
    setDraft((d) => ({ ...d, logoUrl: data.publicUrl }));
    update({ logoUrl: data.publicUrl });
    setMessage('Logo uploaded and saved.');
  };

  const uploadFavicon = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !supabase) return;
    setUploading(true);
    try {
      const url = await uploadAsset('brand', file);
      setDraft((d) => ({ ...d, faviconUrl: url }));
      update({ faviconUrl: url });
      setMessage('Favicon uploaded and saved.');
    } catch (err) {
      setMessage(`Favicon upload failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const zoneCard = (key: ZoneKey, title: string) => (
    <Section title={title}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input type="number" min={0} label="Delivery charge (৳)" value={draft[key].charge} onChange={(e) => setZone(key, { charge: num(e.target.value) })} />
        <Input type="number" min={0} label="Free delivery above (৳)" value={draft[key].freeAbove} onChange={(e) => setZone(key, { freeAbove: num(e.target.value) })} />
        <Input label="Delivery estimate" value={draft[key].estimate} onChange={(e) => setZone(key, { estimate: e.target.value })} />
      </div>
    </Section>
  );

  return (
    <div className="flex max-w-3xl flex-col gap-6 pb-24">
      <p className="text-sm text-muted">Edit anything below, then press Save. Changes apply to the whole storefront.</p>

      <Section title="Brand">
        <Input label="Store name" value={draft.storeName} onChange={(e) => setField('storeName', e.target.value)} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {draft.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.logoUrl} alt="Current logo" className="h-14 w-14 rounded-md border border-line object-contain" />
          ) : (
            <span className="text-sm text-muted">Using the default logo mark.</span>
          )}
          <label className="inline-flex min-h-[44px] cursor-pointer items-center rounded-md border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-50">
            {uploading ? 'Uploading...' : 'Upload new logo'}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" disabled={uploading} onChange={uploadLogo} />
          </label>
          {draft.logoUrl && (
            <Button variant="ghost" size="sm" onClick={() => setField('logoUrl', '')}>Use default logo</Button>
          )}
        </div>
      </Section>

      <Section title="Marketing: Facebook Pixel">
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input type="checkbox" className="h-5 w-5 accent-primary" checked={draft.facebookPixelEnabled} onChange={(e) => setField('facebookPixelEnabled', e.target.checked)} />
          Pixel enabled
        </label>
        <Input label="Pixel ID" value={draft.facebookPixelId} onChange={(e) => setField('facebookPixelId', e.target.value.replace(/\D/g, ''))} hint="Numbers only, from Meta Events Manager. Leave empty to turn off." />
        <p className="text-xs text-muted">Events sent: PageView, ViewContent (product page), InitiateCheckout, Purchase (after order placed). Check with Meta Pixel Helper before running ads.</p>
      </Section>

      <Section title="Favicon">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {draft.faviconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.faviconUrl} alt="Current favicon" className="h-10 w-10 rounded border border-line object-contain" />
          ) : (
            <span className="text-sm text-muted">No favicon set. Browser default is used.</span>
          )}
          <label className="inline-flex min-h-[44px] cursor-pointer items-center rounded-md border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-50">
            {uploading ? 'Uploading...' : 'Upload favicon'}
            <input type="file" accept="image/png,image/x-icon,image/svg+xml,image/webp" className="sr-only" disabled={uploading} onChange={uploadFavicon} />
          </label>
        </div>
      </Section>

      <Section title="Contact and support">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Support phone" value={draft.phone} onChange={(e) => setField('phone', e.target.value)} />
          <Input label="WhatsApp number" value={draft.whatsapp} onChange={(e) => setField('whatsapp', e.target.value)} hint="With country code, e.g. 8801XXXXXXXXX. Floating button shows only when filled." />
          <Input label="Support email" type="email" value={draft.email} onChange={(e) => setField('email', e.target.value)} />
        </div>
        <Input label="Office address" value={draft.address} onChange={(e) => setField('address', e.target.value)} />
        <Input label="Support hours" value={draft.supportHours} onChange={(e) => setField('supportHours', e.target.value)} />
      </Section>

      <Section title="Footer">
        <Input label="About text" value={draft.aboutText} onChange={(e) => setField('aboutText', e.target.value)} />
        <Input label="Copyright text" value={draft.copyrightText} onChange={(e) => setField('copyrightText', e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Facebook URL" value={draft.facebookUrl} onChange={(e) => setField('facebookUrl', e.target.value)} hint="Leave empty to hide" />
          <Input label="Instagram URL" value={draft.instagramUrl} onChange={(e) => setField('instagramUrl', e.target.value)} />
          <Input label="YouTube URL" value={draft.youtubeUrl} onChange={(e) => setField('youtubeUrl', e.target.value)} />
        </div>
      </Section>

      <Section title="Announcement bar">
        <Input label="Announcement text" value={draft.announcement} onChange={(e) => setField('announcement', e.target.value)} hint="Leave empty to hide the bar." />
      </Section>

      <Section title="Customer accounts">
        <label className="flex min-h-[44px] items-center gap-3 text-sm font-medium">
          <input type="checkbox" className="h-5 w-5 accent-primary" checked={draft.customerSignupEnabled} onChange={(e) => setField('customerSignupEnabled', e.target.checked)} />
          Allow customers to create accounts
        </label>
      </Section>

      <Section title="Flash sale">
        <label className="flex min-h-[44px] items-center gap-3 text-sm font-medium">
          <input type="checkbox" className="h-5 w-5 accent-primary" checked={draft.flashSale.enabled} onChange={(e) => setFlash({ enabled: e.target.checked })} />
          Show flash sale on the home page
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Sale title" value={draft.flashSale.title} onChange={(e) => setFlash({ title: e.target.value })} />
          <Input label="Sale subtitle" value={draft.flashSale.subtitle} onChange={(e) => setFlash({ subtitle: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="datetime-local"
            label="Sale ends at (your local time)"
            value={toLocalInput(draft.flashSale.endsAt)}
            onChange={(e) => setFlash({ endsAt: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            hint="The sale hides automatically after this time."
          />
          <Input
            label="Sale products (slugs, comma separated)"
            value={slugText}
            onChange={(e) => {
              setSlugText(e.target.value);
              setFlash({ productSlugs: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) });
            }}
            hint="Use the product URL part, e.g. cotton-panjabi-set-premium"
          />
        </div>
      </Section>

      {zoneCard('insideDhaka', 'Inside Dhaka delivery')}
      {zoneCard('outsideDhaka', 'Outside Dhaka delivery')}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted">{message}</p>
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Reset all settings to defaults?')) {
                  reset();
                  setSynced(false);
                  setMessage('');
                }
              }}
            >
              Reset
            </Button>
            <Button size="sm" onClick={save}>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
