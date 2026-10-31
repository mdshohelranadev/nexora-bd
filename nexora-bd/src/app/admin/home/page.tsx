'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  defaultSettings,
  homeSectionLabels,
  pickSettings,
  useSettingsStore,
  type HeroSlide,
  type ReviewSettings,
  type SiteSettings,
} from '@/store/settingsStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';
import { HeroSlideEditor } from '@/components/home/HeroSlideEditor';

const emptyReview: ReviewSettings = { name: '', district: '', rating: 5, quote: '' };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-card">
      <h2 className="font-bold">{title}</h2>
      {children}
    </section>
  );
}

const parseSlugs = (text: string) => text.split(',').map((x) => x.trim()).filter(Boolean);

export default function AdminHomePage() {
  const hydrated = useHydrated();
  const remoteLoaded = useSettingsStore((s) => s.remoteLoaded);
  const update = useSettingsStore((s) => s.update);
  const [draft, setDraft] = useState<SiteSettings>(defaultSettings);
  const [slugs, setSlugs] = useState({ featured: '', newArrivals: '', bestSellers: '' });
  const [synced, setSynced] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (remoteLoaded && !synced) {
      const init = pickSettings(useSettingsStore.getState());
      setDraft(init);
      setSlugs({
        featured: init.featuredSlugs.join(', '),
        newArrivals: init.newArrivalSlugs.join(', '),
        bestSellers: init.bestSellerSlugs.join(', '),
      });
      setSynced(true);
    }
  }, [remoteLoaded, synced]);

  if (!hydrated || !remoteLoaded || !synced) {
    return (
      <div className="flex max-w-3xl flex-col gap-6" aria-busy="true">
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const changed = (fn: () => void) => { fn(); setMessage(''); };

  const setHeroSlides = (slides: HeroSlide[]) =>
    changed(() => setDraft((d) => ({ ...d, heroSlides: slides })));

  const setReview = (i: number, p: Partial<ReviewSettings>) =>
    changed(() => setDraft((d) => ({ ...d, reviews: d.reviews.map((r, k) => (k === i ? { ...r, ...p } : r)) })));
  const removeReview = (i: number) => changed(() => setDraft((d) => ({ ...d, reviews: d.reviews.filter((_, k) => k !== i) })));
  const addReview = () => changed(() => setDraft((d) => ({ ...d, reviews: [...d.reviews, { ...emptyReview }] })));

  const moveSection = (i: number, dir: -1 | 1) =>
    changed(() =>
      setDraft((d) => {
        const arr = [...d.homeSections];
        const j = i + dir;
        if (j < 0 || j >= arr.length) return d;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        return { ...d, homeSections: arr };
      }),
    );
  const toggleSection = (i: number, enabled: boolean) =>
    changed(() => setDraft((d) => ({ ...d, homeSections: d.homeSections.map((x, k) => (k === i ? { ...x, enabled } : x)) })));

  const save = () => {
    update({
      ...draft,
      featuredSlugs: parseSlugs(slugs.featured),
      newArrivalSlugs: parseSlugs(slugs.newArrivals),
      bestSellerSlugs: parseSlugs(slugs.bestSellers),
    });
    setMessage('Saved. Home page updated for all visitors.');
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6 pb-24">
      <p className="text-sm text-muted">Control what appears on the home page, in what order, and with which content.</p>

      <Section title="Hero banner (auto-slide images)">
        <HeroSlideEditor slides={draft.heroSlides} onChange={setHeroSlides} onMessage={setMessage} />
      </Section>

      <Section title="Section order and visibility">
        <ul className="flex flex-col gap-2">
          {draft.homeSections.map((sec, i) => (
            <li key={sec.key} className="flex items-center gap-3 rounded-lg border border-line p-3">
              <input
                type="checkbox"
                className="h-5 w-5 accent-primary"
                checked={sec.enabled}
                onChange={(e) => toggleSection(i, e.target.checked)}
                aria-label={`Show ${homeSectionLabels[sec.key]}`}
              />
              <span className="flex-1 text-sm font-medium">{homeSectionLabels[sec.key]}</span>
              <Button variant="outline" size="sm" disabled={i === 0} onClick={() => moveSection(i, -1)}>Up</Button>
              <Button variant="outline" size="sm" disabled={i === draft.homeSections.length - 1} onClick={() => moveSection(i, 1)}>Down</Button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Products on the home page">
        <Input
          label="Featured products (slugs, comma separated)"
          value={slugs.featured}
          onChange={(e) => { setSlugs({ ...slugs, featured: e.target.value }); setMessage(''); }}
          hint="Leave empty to show the automatic list."
        />
        <Input
          label="New arrivals (slugs, comma separated)"
          value={slugs.newArrivals}
          onChange={(e) => { setSlugs({ ...slugs, newArrivals: e.target.value }); setMessage(''); }}
          hint="Leave empty to show the latest products."
        />
        <Input
          label="Best sellers (slugs, comma separated)"
          value={slugs.bestSellers}
          onChange={(e) => { setSlugs({ ...slugs, bestSellers: e.target.value }); setMessage(''); }}
          hint="Leave empty to show the automatic list."
        />
      </Section>

      <Section title="Customer reviews">
        {draft.reviews.length === 0 && <p className="text-sm text-muted">No reviews yet. The reviews section stays hidden until you add one.</p>}
        {draft.reviews.map((r, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border border-line p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input label="Name" value={r.name} onChange={(e) => setReview(i, { name: e.target.value })} />
              <Input label="District" value={r.district} onChange={(e) => setReview(i, { district: e.target.value })} />
              <Input type="number" min={1} max={5} label="Rating (1 to 5)" value={r.rating} onChange={(e) => setReview(i, { rating: Math.min(5, Math.max(1, Number(e.target.value) || 1)) })} />
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Review text
              <textarea className="min-h-[80px] rounded-md border border-line bg-surface px-3 py-2 text-sm font-normal" value={r.quote} onChange={(e) => setReview(i, { quote: e.target.value })} />
            </label>
            <div className="flex justify-end">
              <Button variant="danger" size="sm" onClick={() => removeReview(i)}>Remove review</Button>
            </div>
          </div>
        ))}
        <div>
          <Button variant="outline" size="sm" onClick={addReview}>Add review</Button>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted">{message}</p>
          <Button size="sm" onClick={save}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}