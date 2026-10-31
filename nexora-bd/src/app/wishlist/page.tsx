'use client';

import Link from 'next/link';
import { useCatalog } from '@/store/catalogStore';
import { useHydrated } from '@/hooks/useHydrated';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button, EmptyState } from '@/components/ui';
import { HeartIcon } from '@/components/icons';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function WishlistPage() {
  const products = useCatalog((s) => s.products);
  const hydrated = useHydrated();
  const ids = useWishlistStore((s) => s.ids);
  const items = hydrated ? products.filter((p) => ids.includes(p.id)) : [];

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Wishlist</h1>
      <p className="mt-2 text-sm text-muted">{hydrated ? `${items.length} saved ${items.length === 1 ? 'item' : 'items'}` : ' '}</p>
      <div className="mt-8">
        {hydrated && items.length === 0 ? (
          <EmptyState
            icon={<HeartIcon className="h-7 w-7" />}
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it here for later."
            action={<Link href="/"><Button>Browse products</Button></Link>}
          />
        ) : (
          <ProductGrid products={items} loading={!hydrated} />
        )}
      </div>
    </div>
  );
}
