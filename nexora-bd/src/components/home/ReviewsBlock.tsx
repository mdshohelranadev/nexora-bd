'use client';

import { Rating } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';
import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settingsStore';

export function ReviewsBlock() {
  const hydrated = useHydrated();
  const loaded = useSettingsStore((s) => s.remoteLoaded);
  const reviews = useSettingsStore((s) => s.reviews);

  if (!hydrated || !loaded) return <Skeleton className="h-40 rounded-xl" />;
  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews-heading" className="flex flex-col gap-6">
      <h2 id="reviews-heading" className="text-2xl font-extrabold tracking-tight md:text-3xl">What customers say</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((r, i) => (
          <figure key={i} className="flex flex-col gap-3 rounded-xl bg-surface p-6 shadow-card">
            <Rating value={r.rating} showCount={false} size="sm" />
            <blockquote className="text-sm leading-relaxed text-ink">&ldquo;{r.quote}&rdquo;</blockquote>
            <figcaption className="mt-auto text-xs text-muted">{r.name}{r.district ? `, ${r.district}` : ''}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
