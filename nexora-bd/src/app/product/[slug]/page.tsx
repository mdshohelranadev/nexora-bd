'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { track } from '@/lib/pixel';
import { notFound } from 'next/navigation';
import { useCatalog } from '@/store/catalogStore';
import { getCategoryBySlug, getProductBySlug, getProductReviews, getRelatedProducts } from '@/utils/catalog';
import { Badge, Breadcrumb, Rating } from '@/components/ui';
import { ProductGallery } from '@/components/product/ProductGallery';
import { AddToCartPanel } from '@/components/product/AddToCartPanel';
import { DeliveryCard } from '@/components/product/DeliveryCard';
import { ProductTabs } from '@/components/product/ProductTabs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { formatBDT } from '@/utils/format';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const loaded = useCatalog((s) => s.loaded);
  const products = useCatalog((s) => s.products);
  const categories = useCatalog((s) => s.categories);
  const allReviews = useCatalog((s) => s.reviews);
  const current = getProductBySlug(products, params.slug);

  useEffect(() => {
    if (current) track('ViewContent', { content_ids: [current.id], content_type: 'product', content_name: current.name, value: current.price, currency: 'BDT' });
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!loaded) return <div className="container-x py-12 text-muted">Loading product...</div>;

  const product = getProductBySlug(products, params.slug);
  if (!product) notFound();

  const category = getCategoryBySlug(categories, product.category);
  const reviews = getProductReviews(allReviews, product.id);
  const related = getRelatedProducts(products, product);

  return (
    <div className="container-x py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category?.name ?? 'Shop', href: `/category/${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-muted">{product.brand}</p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Rating value={product.rating} count={product.reviewCount} />
              {product.badges?.map((b) => (
                <Badge key={b} variant="outline">{b}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 border-y border-line py-4">
            <span className="font-display text-3xl font-extrabold">{formatBDT(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-base text-muted line-through">{formatBDT(product.originalPrice)}</span>
            )}
            {product.discountPercent > 0 && <Badge variant="accent">Save {product.discountPercent}%</Badge>}
          </div>

          <p className="text-base leading-relaxed text-muted">{product.shortDescription}</p>

          <AddToCartPanel product={product} />

          <DeliveryCard />
        </div>
      </div>

      <div className="mt-16">
        <ProductTabs product={product} reviews={reviews} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 id="related-heading" className="text-2xl font-extrabold">You may also like</h2>
            {category && (
              <Link href={`/category/${category.slug}`} className="text-sm font-semibold text-primary hover:underline">
                More in {category.name}
              </Link>
            )}
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
