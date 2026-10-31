'use client';

import { ProductGrid } from '@/components/product/ProductGrid';
import { Skeleton } from '@/components/ui/Loading';
import { getProductBySlug } from '@/utils/catalog';
import { useCatalog } from '@/store/catalogStore';
import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settingsStore';
import { CountdownTimer } from './CountdownTimer';

export function FlashSale() {
  const catalog = useCatalog((s) => s.products);
  const hydrated = useHydrated();
  const remoteLoaded = useSettingsStore((s) => s.remoteLoaded);
  const sale = useSettingsStore((s) => s.flashSale);

  // ✅ FIX: skeleton mobile e choto
  if (!hydrated || !remoteLoaded) return <Skeleton className="h-40 rounded-xl sm:h-48" />;

  const end = sale.endsAt ? Date.parse(sale.endsAt) : NaN;
  const products = sale.productSlugs
    .map((slug) => getProductBySlug(catalog, slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (!sale.enabled || !(end > Date.now()) || products.length === 0) return null;

  return (
    // ✅ FIX: mobile e gap-5, sm+ e gap-8
    <section aria-labelledby="flash-sale-heading" className="flex w-full min-w-0 flex-col gap-5 sm:gap-8">
      {/* ✅ FIX: mobile e padding kom + gap kom */}
      <div className="overflow-hidden rounded-xl bg-primary p-4 text-white sm:p-6 md:p-10">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-xl min-w-0">
            {/* ✅ FIX: eyebrow text-xs on mobile */}
            <p className="text-xs font-semibold text-accent sm:text-sm">Limited time</p>

            {/* ✅ FIX: heading mobile e text-xl, smooth progression */}
            <h2
              id="flash-sale-heading"
              className="mt-1.5 text-xl font-extrabold leading-tight sm:mt-2 sm:text-2xl md:text-3xl lg:text-4xl"
            >
              {sale.title}
            </h2>

            {sale.subtitle && (
              <p className="mt-2 text-sm text-white/85 sm:mt-3 sm:text-base">{sale.subtitle}</p>
            )}
          </div>

          {/* ✅ FIX: timer block — mobile e row layout better */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <p className="text-xs font-medium text-white/80 sm:text-sm">Sale ends in</p>
            <CountdownTimer endsAt={end} />
          </div>
        </div>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}