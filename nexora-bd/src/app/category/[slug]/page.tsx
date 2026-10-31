'use client';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { useCatalog } from '@/store/catalogStore';
import { getCategoryBySlug } from '@/utils/catalog';
import { Listing } from '@/components/product/Listing';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const loaded = useCatalog((s) => s.loaded);
  const categories = useCatalog((s) => s.categories);

  if (!loaded) return <div className="container-x py-12 text-muted">Loading products...</div>;

  const category = getCategoryBySlug(categories, params.slug);
  if (!category) notFound();

  return (
    <Suspense fallback={<div className="container-x py-12 text-muted">Loading products...</div>}>
      <Listing mode="category" category={category.slug} title={category.name} description={category.description} />
    </Suspense>
  );
}
