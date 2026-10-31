import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui';
import { cn } from '@/utils/cn';

export function ProductGrid({ products, layout = 'grid', loading = false }: { products: Product[]; layout?: 'grid' | 'list'; loading?: boolean }) {
  const containerClass = layout === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-6';
  if (loading) {
    return (
      <div className={containerClass} aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={cn('flex overflow-hidden rounded-lg bg-surface shadow-card', layout === 'list' ? 'gap-4 p-3' : 'flex-col')}>
            <Skeleton className={cn('rounded-md', layout === 'list' ? 'h-36 w-36 shrink-0 sm:h-48 sm:w-48' : 'aspect-square w-full rounded-none')} />
            <div className="flex flex-1 flex-col gap-3 p-4">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="mt-auto h-5 w-2/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={containerClass}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} layout={layout} />
      ))}
    </div>
  );
}
