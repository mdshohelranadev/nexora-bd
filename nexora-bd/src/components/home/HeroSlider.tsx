'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { unsplash } from '@/utils/images';
import { cn } from '@/utils/cn';

const slides = [
  {
    title: 'Next-gen phones, in your hand today',
    subtitle: 'Flagship smartphones with official warranty and fast delivery.',
    cta: 'Shop mobile',
    href: '/category/mobile',
    image: unsplash('1695048133142-1a20484d2569', 1600),
    alt: 'Smartphone on a clean background',
  },
  {
    title: 'Sound that moves you',
    subtitle: 'Premium headphones and earbuds with active noise cancellation.',
    cta: 'Shop audio',
    href: '/category/audio',
    image: unsplash('1618366712010-f4ae9c647dcb', 1600),
    alt: 'Black over-ear headphones',
  },
  {
    title: 'Power for work and play',
    subtitle: 'Laptops and gaming rigs built for speed, from top brands.',
    cta: 'Shop laptops',
    href: '/category/laptops',
    image: unsplash('1517336714731-489689fd1ca8', 1600),
    alt: 'Laptop on a desk',
  },
  {
    title: 'See everything in 4K',
    subtitle: 'Smart TVs and cameras for home cinema and creative work.',
    cta: 'Shop TV',
    href: '/category/tv',
    image: unsplash('1593359677879-a4bb92f829d1', 1600),
    alt: 'Large 4K television',
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      className="relative overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(diff) > 40) go(index + (diff < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      <div className="relative h-[460px] sm:h-[520px] lg:h-[560px]">
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== index}
            className={cn('absolute inset-0 transition-opacity duration-700', i === index ? 'z-10 opacity-100' : 'z-0 opacity-0')}
          >
            <Image src={slide.image} alt={slide.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-transparent" />
            <div className="container-x relative flex h-full items-center">
              <div className="max-w-xl text-white">
                <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{slide.title}</h1>
                <p className="mt-4 text-base text-white/85 sm:text-lg">{slide.subtitle}</p>
                <div className="mt-8">
                  <Link href={slide.href} tabIndex={i === index ? 0 : -1}>
                    <Button size="lg" variant="secondary">{slide.cta}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-card transition hover:bg-white"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-card transition hover:bg-white"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2" role="group" aria-label="Choose slide">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className="grid h-11 w-6 place-items-center"
            >
              <span className={cn('h-2 rounded-full transition-all', i === index ? 'w-8 bg-accent' : 'w-2 bg-white/60')} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
