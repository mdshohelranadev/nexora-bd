'use client';

import { useSettingsStore } from '@/store/settingsStore';
import { Rating } from '@/components/ui';

// Testimonials are managed in Admin > Settings (reviews list). Nothing hardcoded here.
export function Testimonials() {
  const reviews = useSettingsStore((s) => s.reviews);
  if (reviews.length === 0) return null;
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {reviews.map((t, i) => (
        <li key={`${t.name}-${i}`} className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6">
          <Rating value={t.rating} showCount={false} />
          <blockquote className="flex-1 text-sm leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
          <p className="text-sm font-semibold">{t.name} <span className="font-normal text-muted">| {t.district}</span></p>
        </li>
      ))}
    </ul>
  );
}
