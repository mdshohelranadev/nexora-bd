'use client';

import Link from 'next/link';
import { useCatalog } from '@/store/catalogStore';
import { CategoryIcon } from '@/components/icons';

export function CategoryGrid() {
  const categories = useCatalog((s) => s.categories);
  return (
    <div className="grid grid-cols-5 gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-5">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className="group flex min-w-0 flex-col items-center gap-1"
        >
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1.1rem] bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
            <CategoryIcon slug={c.slug} className="h-5 w-5 text-primary sm:h-7 sm:w-7" />
          </div>
          
          {/* ✅ FIX: text-[8.5px] diyechi jate 'Home & Living' pura fit hoy */}
          <span className="line-clamp-1 w-full text-center text-[8.5px] font-semibold tracking-tighter text-ink sm:text-xs">
            {c.name}
          </span>
        </Link>
      ))}
    </div>
  );
}