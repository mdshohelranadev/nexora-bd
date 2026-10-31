'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCatalog } from '@/store/catalogStore';
import { CategoryIcon, ChevronDownIcon } from '@/components/icons';

export function MegaMenu() {
  const categories = useCatalog((s) => s.categories);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="flex h-12 items-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        All Categories
        <ChevronDownIcon className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-[720px] rounded-b-xl border border-line bg-surface p-6 shadow-lift">
          <div className="grid grid-cols-3 gap-6">
            {categories.map((c) => (
              <div key={c.slug} className="flex flex-col gap-3">
                <Link href={`/category/${c.slug}`} className="flex items-center gap-2 rounded-md font-display text-base font-bold text-ink hover:text-primary">
                  <CategoryIcon slug={c.slug} className="h-5 w-5 text-primary" />
                  {c.name}
                </Link>
                <ul className="flex flex-col gap-1">
                  {c.subcategories.map((sub) => (
                    <li key={sub}>
                      <Link href={`/category/${c.slug}?sub=${encodeURIComponent(sub)}`} className="inline-flex min-h-[32px] items-center text-sm text-muted hover:text-primary">
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
