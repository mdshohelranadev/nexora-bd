'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import { useHydrated } from '@/hooks/useHydrated';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { Badge, Button, Rating } from '@/components/ui';
import { HeartIcon } from '@/components/icons';
import { formatBDT } from '@/utils/format';
import { cn } from '@/utils/cn';

export function ProductCard({ product, layout = 'grid' }: { product: Product; layout?: 'grid' | 'list' }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const wished = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const pushToast = useUIStore((s) => s.pushToast);
  const hasOptions = Boolean(product.variants?.sizes || product.variants?.colors);
  const outOfStock = product.stock <= 0;
  const isWished = hydrated && wished;
  const isList = layout === 'list';

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-lg bg-surface shadow-sm border border-line/50 transition duration-200 hover:-translate-y-1 hover:shadow-md',
        isList ? 'flex-row gap-4 p-3' : 'flex-col',
      )}
    >
      {/* ✅ FIX: aspect-square er bodole aspect-[4/3] kora hoyeche jate height kom hoy */}
      <div className={cn('relative overflow-hidden rounded-t-md bg-canvas', isList ? 'aspect-square w-36 shrink-0 sm:w-48 rounded-md' : 'aspect-[4/3] w-full')}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes={isList ? '192px' : '(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw'}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.discountPercent > 0 && (
          <Badge variant="accent" className="absolute left-2 top-2 text-[10px] px-1.5 py-0.5">-{product.discountPercent}%</Badge>
        )}
        {!isList && (
          <button
            type="button"
            aria-pressed={isWished}
            aria-label={isWished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            onClick={() => {
              const added = toggleWishlist(product.id);
              pushToast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'success' : 'info');
            }}
            className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-surface/90 text-ink shadow-sm transition hover:text-danger"
          >
            <HeartIcon className={cn('h-4 w-4', isWished && 'fill-danger text-danger')} />
          </button>
        )}
      </div>

      {/* ✅ FIX: Padding komie p-2.5 kora hoyeche */}
      <div className={cn('flex flex-1 flex-col gap-1.5', isList ? 'py-1' : 'p-2.5 sm:p-3')}>
        <p className="text-[10px] sm:text-xs font-medium text-muted line-clamp-1">{product.brand}</p>
        <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold leading-tight">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">{product.name}</Link>
        </h3>
        
        {/* ✅ FIX: Mobile e Rating choto kora hoyeche jate jayga kom lage */}
        <div className="mt-0.5">
          <Rating value={product.rating} count={product.reviewCount} size="sm" />
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-1.5 pt-1">
          <span className="font-display text-sm sm:text-base font-bold text-primary">{formatBDT(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-muted line-through">{formatBDT(product.originalPrice)}</span>
          )}
        </div>

        {!isList && (
          <div className="relative z-10 mt-1">
            {/* ✅ FIX: Button height komate size="sm" ar custom padding deya hoyeche */}
            <Button
              size="sm"
              variant="outline"
              fullWidth
              disabled={outOfStock}
              className="h-8 text-xs"
              onClick={() => {
                if (hasOptions) {
                  router.push(`/product/${product.slug}`);
                  return;
                }
                addItem(product.id);
                pushToast(`Added to cart: ${product.name}`);
              }}
            >
              {outOfStock ? 'Out of stock' : hasOptions ? 'Choose options' : 'Add to cart'}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}