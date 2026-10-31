'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/Loading';
import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settingsStore';

const AUTOPLAY_MS = 4000;

export function HeroBanner() {
  const hydrated = useHydrated();
  const loaded = useSettingsStore((s) => s.remoteLoaded);
  const stored = useSettingsStore((s) => s.heroSlides) ?? [];
  const enabledSlides = stored.filter((s) => s.enabled && s.imageUrl);

  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const total = enabledSlides.length;

  const goTo = useCallback((i: number) => {
    if (total === 0) return;
    setActive(((i % total) + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % total);
      }, AUTOPLAY_MS);
    };
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) goTo(active + 1);
    if (diff < -50) goTo(active - 1);
    touchStartX.current = null;
    if (total > 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setActive((prev) => (prev + 1) % total), AUTOPLAY_MS);
    }
  };

  useEffect(() => { if (active >= total) setActive(0); }, [total, active]);

  if (!hydrated || !loaded) return <Skeleton className="h-[180px] w-full rounded-2xl sm:h-[240px]" />;
  if (total === 0) return null;

  return (
    <section
      aria-label="Featured banners"
      className="relative flex h-[180px] w-full flex-col overflow-hidden rounded-2xl sm:h-[240px]"
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full w-full">
        {enabledSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <img src={slide.imageUrl} alt={slide.alt || ''} className="h-full w-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            
            {/* ✅ FIX: Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* ✅ FIX: Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-start justify-end p-5 pb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Nexora</p>
              <h2 className="mt-1 max-w-[80%] font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                {slide.alt || 'Latest tech, best prices'}
              </h2>
              <Link
                href={slide.link || '/search'}
                className="mt-3 flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-600"
              >
                Shop Now <span aria-hidden>›</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {enabledSlides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}