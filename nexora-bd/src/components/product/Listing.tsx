'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CategorySlug } from '@/types';
import { useCatalog } from '@/store/catalogStore';
import { Badge, Breadcrumb, Button, Checkbox, Drawer, EmptyState, Pagination, Radio, Select } from '@/components/ui';
import { GridIcon, ListIcon } from '@/components/icons';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slug';
import { ProductGrid } from './ProductGrid';

const PER_PAGE = 12;

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

interface ListingProps {
  mode: 'category' | 'search';
  category?: CategorySlug;
  title: string;
  description?: string;
}

export function Listing({ mode, category, title, description }: ListingProps) {
  const products = useCatalog((s) => s.products);
  const categories = useCatalog((s) => s.categories);
  const PRICE_CEILING = Math.ceil(Math.max(0, ...products.map((p) => p.price)) / 1000) * 1000;
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get('q') ?? '';
  const sub = params.get('sub') ?? '';
  const cat = (mode === 'category' ? category : (params.get('cat') as CategorySlug | null)) ?? undefined;
  const min = Number(params.get('min') ?? 0) || 0;
  const maxParam = params.get('max');
  const max = maxParam ? Number(maxParam) : undefined;
  const brands = (params.get('brands') ?? '').split(',').filter(Boolean);
  const minRating = Number(params.get('rating') ?? 0) || 0;
  const sort = params.get('sort') ?? 'featured';
  const view = params.get('view') === 'list' ? 'list' : 'grid';
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const queryKey = params.toString();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [queryKey]);

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === '') next.delete(key);
        else next.set(key, value);
      });
      if (!('page' in changes)) next.delete('page');
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const scope = useMemo(() => (mode === 'category' && category ? products.filter((p) => p.category === category) : products), [mode, category, products]);
  const brandOptions = useMemo(() => Array.from(new Set(scope.map((p) => p.brand))).sort(), [scope]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!sub || p.subcategory === sub) &&
        (mode === 'category' ? !category || p.category === category : true) &&
        p.price >= min &&
        (max === undefined || p.price <= max) &&
        (brands.length === 0 || brands.includes(p.brand)) &&
        p.rating >= minRating &&
        (!term || [p.name, p.brand, p.category, p.subcategory].join(' ').toLowerCase().includes(term)),
    );
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list = [...list].sort((a, b) => Number(b.badges?.includes('New')) - Number(a.badges?.includes('New')));
        break;
    }
    return list;
  }, [cat, sub, mode, category, min, max, brands.join(','), minRating, q, sort, products]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const crumbs = mode === 'category' && category
    ? [{ label: 'Home', href: '/' }, { label: categories.find((c) => c.slug === category)?.name ?? title }]
    : [{ label: 'Home', href: '/' }, { label: 'Search' }];

  const filterPanel = (
    <FilterSidebar
      mode={mode}
      cat={cat}
      sub={sub}
      brandOptions={brandOptions}
      brands={brands}
      min={min}
      max={max}
      minRating={minRating}
      ceiling={PRICE_CEILING}
      onChange={update}
      onClear={() => router.replace(pathname, { scroll: false })}
    />
  );

  return (
    <div className="container-x py-8">
      <Breadcrumb items={crumbs} />
      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
          {sub && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-muted">Subcategory:</span>
              <Badge variant="default">{sub}</Badge>
              <button type="button" onClick={() => update({ sub: null })} className="text-sm font-semibold text-primary hover:underline">Clear</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto rounded-lg bg-surface p-5 shadow-card scrollbar-hide">
            {filterPanel}
          </div>
        </aside>

        <section aria-label="Products">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              Filters
            </Button>
            <p className="text-sm text-muted" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </p>
            <div className="ml-auto flex items-end gap-2">
              <div className="w-48">
                <Select
                  label="Sort by"
                  value={sort}
                  onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}
                  options={sortOptions}
                  className="w-full"
                />
              </div>
              <div className="hidden items-center rounded-md border border-line bg-surface p-1 sm:flex" role="group" aria-label="View">
                <button
                  type="button"
                  aria-pressed={view === 'grid'}
                  aria-label="Grid view"
                  onClick={() => update({ view: null })}
                  className={cn('grid h-9 w-9 place-items-center rounded-sm', view === 'grid' ? 'bg-primary-50 text-primary' : 'text-muted')}
                >
                  <GridIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-pressed={view === 'list'}
                  aria-label="List view"
                  onClick={() => update({ view: 'list' })}
                  className={cn('grid h-9 w-9 place-items-center rounded-sm', view === 'list' ? 'bg-primary-50 text-primary' : 'text-muted')}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {!loading && filtered.length === 0 ? (
            <EmptyState
              icon={<GridIcon className="h-7 w-7" />}
              title="No products match these filters"
              description="Try a wider price range or remove a brand filter to see more products."
              action={<Button variant="outline" onClick={() => router.replace(pathname, { scroll: false })}>Clear all filters</Button>}
            />
          ) : (
            <ProductGrid products={pageItems} layout={view} loading={loading} />
          )}

          <div className="mt-10">
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={(p) => update({ page: p === 1 ? null : String(p) })} />
          </div>
        </section>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="left"
        title="Filters"
        footer={<Button fullWidth size="lg" onClick={() => setFiltersOpen(false)}>Show {filtered.length} products</Button>}
      >
        {filterPanel}
      </Drawer>
    </div>
  );
}

function FilterSidebar({
  mode,
  cat,
  sub,
  brandOptions,
  brands,
  min,
  max,
  minRating,
  ceiling,
  onChange,
  onClear,
}: {
  mode: 'category' | 'search';
  cat?: CategorySlug;
  sub: string;
  brandOptions: string[];
  brands: string[];
  min: number;
  max?: number;
  minRating: number;
  ceiling: number;
  onChange: (changes: Record<string, string | null>) => void;
  onClear: () => void;
}) {
  const categories = useCatalog((s) => s.categories);
  const toggleBrand = (brand: string, checked: boolean) => {
    const next = checked ? [...brands, brand] : brands.filter((b) => b !== brand);
    onChange({ brands: next.length ? next.join(',') : null });
  };
  const hasFilters = Boolean(cat && mode === 'search') || Boolean(sub) || brands.length > 0 || min > 0 || max !== undefined || minRating > 0;

  return (
    <div className="flex flex-col gap-6">
      {mode === 'search' && (
        <fieldset className="flex flex-col gap-1">
          <legend className="mb-2 text-sm font-semibold">Category</legend>
          <Radio name="cat" value="" checked={!cat} onChange={() => onChange({ cat: null })} label="All categories" />
          {categories.map((c) => (
            <Radio key={c.slug} name="cat" value={c.slug} checked={cat === c.slug} onChange={(v) => onChange({ cat: v })} label={c.name} />
          ))}
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold">Price (BDT)</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted">
            Min
            <input type="number" inputMode="numeric" min={0} value={min || ''} placeholder="0" onChange={(e) => onChange({ min: e.target.value || null })} className="h-11 rounded-md border border-line bg-surface px-3 text-sm text-ink" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted">
            Max
            <input type="number" inputMode="numeric" min={0} value={max ?? ''} placeholder={String(ceiling)} onChange={(e) => onChange({ max: e.target.value || null })} className="h-11 rounded-md border border-line bg-surface px-3 text-sm text-ink" />
          </label>
        </div>
        <input
          type="range"
          aria-label="Maximum price"
          min={0}
          max={ceiling}
          step={100}
          value={max ?? ceiling}
          onChange={(e) => onChange({ max: Number(e.target.value) >= ceiling ? null : e.target.value })}
          className="h-11 w-full accent-primary"
        />
      </fieldset>

      <fieldset className="flex flex-col">
        <legend className="mb-1 text-sm font-semibold">Brand</legend>
        <div className="max-h-56 overflow-y-auto pr-1">
          {brandOptions.map((brand) => (
            <Checkbox key={brand} label={brand} checked={brands.includes(brand)} onChange={(checked) => toggleBrand(brand, checked)} id={`brand-${slugify(brand)}`} />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1">
        <legend className="mb-2 text-sm font-semibold">Customer rating</legend>
        {[0, 4, 3, 2].map((value) => (
          <Radio
            key={value}
            name="rating"
            value={String(value)}
            checked={minRating === value}
            onChange={(v) => onChange({ rating: v === '0' ? null : v })}
            label={value === 0 ? 'Any rating' : `${value} stars and up`}
          />
        ))}
      </fieldset>

      {hasFilters && (
        <Button variant="ghost" onClick={onClear} className="self-start">Clear all filters</Button>
      )}
    </div>
  );
}
