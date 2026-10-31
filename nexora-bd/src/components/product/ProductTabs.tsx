'use client';

import type { Product, Review } from '@/types';
import { Tabs, Rating } from '@/components/ui';

export function ProductTabs({ product, reviews }: { product: Product; reviews: Review[] }) {
  return (
    <Tabs
      items={[
        {
          id: 'description',
          label: 'Description',
          content: <p className="max-w-prose text-base leading-relaxed text-ink">{product.description}</p>,
        },
        {
          id: 'specifications',
          label: 'Specifications',
          content: (
            <dl className="grid max-w-2xl grid-cols-1 divide-y divide-line rounded-lg border border-line bg-surface sm:grid-cols-2 sm:divide-y-0">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between sm:gap-4 sm:border-b sm:border-line">
                  <dt className="text-sm text-muted">{key}</dt>
                  <dd className="text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          ),
        },
        {
          id: 'reviews',
          label: `Reviews (${reviews.length})`,
          content: (
            <ul className="flex max-w-3xl flex-col gap-4">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-lg border border-line bg-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Rating value={r.rating} showCount={false} />
                    <span className="text-xs text-muted">{r.date}</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
                  <p className="mt-3 text-xs font-medium text-ink">
                    {r.author}, {r.district}
                    {r.verified && <span className="ml-2 text-success">Verified buyer</span>}
                  </p>
                </li>
              ))}
            </ul>
          ),
        },
      ]}
    />
  );
}
