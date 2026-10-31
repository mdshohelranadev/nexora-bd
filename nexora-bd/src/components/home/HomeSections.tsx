'use client';

import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FlashSale } from '@/components/home/FlashSale';
import { HeroBanner } from '@/components/home/HeroBanner';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Skeleton } from '@/components/ui/Loading';
import { TrustSection } from '@/components/home/TrustSection';
import { getBestSellers, getFeaturedProducts, getProductBySlug } from '@/utils/catalog';
import { useCatalog } from '@/store/catalogStore';
import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore, type HomeSectionKey } from '@/store/settingsStore';
import type { Product } from '@/types';

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 sm:gap-6">
      <h2 id={id} className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

function pickProducts(list: Product[], slugs: string[], fallback: () => Product[], limit: number): Product[] {
  const chosen = slugs.map((slug) => getProductBySlug(list, slug)).filter((p): p is Product => Boolean(p));
  return (chosen.length ? chosen : fallback()).slice(0, limit);
}

export function HomeSections() {
  const hydrated = useHydrated();
  const loaded = useSettingsStore((s) => s.remoteLoaded);
  const order = useSettingsStore((s) => s.homeSections);
  const featuredSlugs = useSettingsStore((s) => s.featuredSlugs);
  const newSlugs = useSettingsStore((s) => s.newArrivalSlugs);
  const bestSlugs = useSettingsStore((s) => s.bestSellerSlugs);
  const products = useCatalog((s) => s.products);
  const catalogLoaded = useCatalog((s) => s.loaded);

  if (!hydrated || !loaded || !catalogLoaded) {
    return (
      <div className="container-x flex flex-col gap-4 py-4" aria-busy="true">
        <Skeleton className="h-[180px] w-full rounded-2xl sm:h-[240px]" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl sm:h-72" />
      </div>
    );
  }

  const featured = pickProducts(products, featuredSlugs, () => getFeaturedProducts(products, 8), 8);
  const newArrivals = pickProducts(products, newSlugs, () => [...products].slice(-4).reverse(), 4);
  const bestSellers = pickProducts(products, bestSlugs, () => getBestSellers(products, 4), 4);

  const render: Record<HomeSectionKey, () => ReactNode> = {
    hero: () => null,
    categories: () => null,
    flashSale: () => <FlashSale />,
    newArrivals: () => newArrivals.length > 0 && (
      <Block id="new-heading" title="New arrivals"><ProductGrid products={newArrivals} /></Block>
    ),
    featured: () => featured.length > 0 && (
      <Block id="featured-heading" title="Featured products"><ProductGrid products={featured} /></Block>
    ),
    bestSellers: () => bestSellers.length > 0 && (
      <Block id="best-heading" title="Best sellers"><ProductGrid products={bestSellers} /></Block>
    ),
  };

  const heroItem = order.find((o) => o.key === 'hero');
  const categoriesItem = order.find((o) => o.key === 'categories');

  return (
    <div className="flex w-full flex-col bg-canvas">
      
      {/* ✅ FIX: min-h bad diye normal flow kora hoyeche. pb-24 diyechi jate mobile nav er niche content na dhake */}
      <div className="flex w-full flex-col pb-24 lg:pb-6">
        
        {/* 1. Hero Banner */}
        {heroItem?.enabled && (
          <div className="container-x w-full shrink-0 pt-3 pb-1">
            <HeroBanner />
          </div>
        )}

        {/* 2. Category Section */}
        {categoriesItem?.enabled && (
          <div className="container-x w-full shrink-0 py-2">
            <section aria-labelledby="categories-heading" className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 id="categories-heading" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
                  <span className="h-5 w-1 rounded-full bg-primary"></span>
                  Shop by category
                </h2>
                <Link href="/categories" className="flex items-center text-xs font-semibold text-primary hover:underline">
                  See all <span aria-hidden>›</span>
                </Link>
              </div>
              <CategoryGrid />
            </section>
          </div>
        )}

        {/* 3. Trust Section */}
        <div className="container-x w-full shrink-0 mt-1">
          <TrustSection />
        </div>
        
      </div>

      {/* ✅ BAKI PAGE */}
      <div className="container-x flex w-full min-w-0 flex-col gap-8 overflow-x-hidden pt-4 pb-8 sm:gap-12 sm:pt-8 sm:pb-12">
        {order.map((item) => {
          if (item.key === 'hero' || item.key === 'categories') return null;
          return item.enabled && render[item.key] ? (
            <Fragment key={item.key}>{render[item.key]()}</Fragment>
          ) : null;
        })}
      </div>
    </div>
  );
}