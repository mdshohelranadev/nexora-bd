'use client';

import type { ReactNode } from 'react';
import { useHydrated } from '@/hooks/useHydrated';
import { defaultSettings, useSettingsStore, type SiteSettings } from '@/store/settingsStore';
import { describeCharge } from '@/utils/delivery';

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-32 rounded-xl bg-surface p-6 shadow-card">
      <h2 id={`${id}-heading`} className="text-xl font-extrabold">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function HelpPage() {
  const hydrated = useHydrated();
  const live = useSettingsStore();
  const s: SiteSettings = hydrated ? live : defaultSettings;

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Help and delivery</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">Everything about delivery, returns and payment in one place.</p>
      <div className="mt-8 grid gap-6">
        <Section id="delivery" title="Delivery information">
          <p>Inside Dhaka, orders arrive in {s.insideDhaka.estimate}. {describeCharge(s.insideDhaka)}.</p>
          <p>Outside Dhaka, orders arrive in {s.outsideDhaka.estimate} across all 64 districts. {describeCharge(s.outsideDhaka)}.</p>
        </Section>
        <Section id="returns" title="Returns and refunds">
          <p>Most items can be returned within 7 days of delivery if they are unused and in original packaging. Personal care items, food and opened products are not eligible.</p>
          <p>Refunds are issued by bank transfer or store credit after the returned item passes inspection.</p>
        </Section>
        <Section id="payment" title="Payment methods">
          <p>We accept Cash on Delivery only. Pay the courier in cash when your parcel arrives.</p>
        </Section>
      </div>
    </div>
  );
}
