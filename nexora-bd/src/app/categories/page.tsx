'use client';

import Link from 'next/link';
import { useCatalog } from '@/store/catalogStore';

export default function AllCategoriesPage() {
  const categories = useCatalog((s) => s.categories);
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">All categories</h1>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/category/${c.slug}`} className="block rounded-lg border border-line bg-surface p-5 shadow-card transition-transform hover:-translate-y-1">
              <h2 className="text-lg font-bold">{c.name}</h2>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
