'use client';

import { MailIcon, PhoneIcon } from '@/components/icons';
import { useHydrated } from '@/hooks/useHydrated';
import { defaultSettings, useSettingsStore, type SiteSettings } from '@/store/settingsStore';

export default function ContactPage() {
  const hydrated = useHydrated();
  const live = useSettingsStore();
  const s: SiteSettings = hydrated ? live : defaultSettings;
  const cards = [
    s.phone && { key: 'phone', title: 'Call us', text: s.phone, href: `tel:${s.phone}`, icon: <PhoneIcon className="h-5 w-5" /> },
    s.email && { key: 'email', title: 'Email us', text: s.email, href: `mailto:${s.email}`, icon: <MailIcon className="h-5 w-5" /> },
  ].filter(Boolean) as { key: string; title: string; text: string; href: string; icon: React.ReactNode }[];

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Contact us</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">Our customer team replies during business hours, {s.supportHours}.</p>
      <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <a key={c.key} href={c.href} className="flex items-start gap-4 rounded-xl bg-surface p-6 shadow-card transition hover:shadow-lift">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-50 text-primary">{c.icon}</span>
            <div>
              <h2 className="font-display text-base font-bold">{c.title}</h2>
              <p className="mt-1 text-sm text-muted">{c.text}</p>
            </div>
          </a>
        ))}
        {s.address && (
          <div className="rounded-xl bg-surface p-6 shadow-card sm:col-span-2">
            <h2 className="font-display text-base font-bold">Office address</h2>
            <p className="mt-1 text-sm text-muted">{s.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}
