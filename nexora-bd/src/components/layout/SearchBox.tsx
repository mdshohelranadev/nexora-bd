'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';
import { useCatalog } from '@/store/catalogStore';
import { useSearchStore } from '@/store/searchStore';
import { useUIStore } from '@/store/uiStore';
import { formatBDT } from '@/utils/format';
import { SearchIcon } from '@/components/icons';

export function SearchBox({ className, id, autoFocus = false }: { className?: string; id: string; autoFocus?: boolean }) {
  const router = useRouter();
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const products = useCatalog((s) => s.products);
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    return products
      .filter((p) => [p.name, p.brand, p.category, p.subcategory].join(' ').toLowerCase().includes(term))
      .slice(0, 5);
  }, [query, products]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    setFocused(false);
    useUIStore.getState().setSearchOpen(false);
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  };

  return (
    <form role="search" onSubmit={submit} className={className}>
      <label htmlFor={id} className="sr-only">Search products</label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search panjabi, headphones, rice..."
          autoComplete="off"
          className="h-11 w-full rounded-full border border-line bg-canvas pl-10 pr-4 text-sm transition hover:border-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        {focused && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-lg border border-line bg-surface shadow-lift">
            {suggestions.map((p) => (
              <li key={p.id}>
                <Link href={`/product/${p.slug}`} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-canvas">
                  <span className="flex-1 font-medium">{p.name}</span>
                  <span className="text-muted">{formatBDT(p.price)}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/search?q=${encodeURIComponent(query.trim())}`} className="block px-4 py-3 text-sm font-semibold text-primary hover:bg-canvas">
                See all results for &ldquo;{query.trim()}&rdquo;
              </Link>
            </li>
          </ul>
        )}
      </div>
    </form>
  );
}
