'use client';

import Image from 'next/image';
import { useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { cn } from '@/utils/cn';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const touchStart = useRef<number | null>(null);

  const go = (index: number) => setActive((index + images.length) % images.length);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-surface shadow-card"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        onTouchStart={(e: TouchEvent<HTMLDivElement>) => (touchStart.current = e.touches[0].clientX)}
        onTouchEnd={(e: TouchEvent<HTMLDivElement>) => {
          if (touchStart.current === null) return;
          const diff = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(diff) > 40) go(active + (diff < 0 ? 1 : -1));
          touchStart.current = null;
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} images`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(active + 1);
          if (e.key === 'ArrowLeft') go(active - 1);
        }}
      >
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name}, image ${active + 1} of ${images.length}`}
          fill
          priority
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-200 ease-out"
          style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide" role="list" aria-label="Thumbnails">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            role="listitem"
            aria-label={`Show image ${i + 1}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={cn(
              'relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-surface transition',
              i === active ? 'border-primary' : 'border-transparent hover:border-line',
            )}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
