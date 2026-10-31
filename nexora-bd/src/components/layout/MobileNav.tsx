'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCatalog } from '@/store/catalogStore';
import { useUIStore } from '@/store/uiStore';
import { Drawer } from '@/components/ui';
import { ChevronDownIcon } from '@/components/icons';

export function MobileNav() {
  const categories = useCatalog((s) => s.categories);
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <Drawer open={open} onClose={() => setOpen(false)} side="left" title="Menu">
      <nav aria-label="Mobile categories" className="flex flex-col">
        {categories.map((c) => {
          const isOpen = expanded === c.slug;
          return (
            <div key={c.slug} className="border-b border-line">
              <div className="flex items-center">
                <Link href={`/category/${c.slug}`} onClick={() => setOpen(false)} className="flex-1 py-4 text-base font-semibold">
                  {c.name}
                </Link>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`Show ${c.name} subcategories`}
                  onClick={() => setExpanded(isOpen ? null : c.slug)}
                  className="grid h-11 w-11 place-items-center"
                >
                  <ChevronDownIcon className={`h-5 w-5 transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {isOpen && (
                <ul className="flex flex-col pb-3 pl-3">
                  {c.subcategories.map((sub) => (
                    <li key={sub}>
                      <Link href={`/category/${c.slug}?sub=${encodeURIComponent(sub)}`} onClick={() => setOpen(false)} className="flex min-h-[44px] items-center text-sm text-muted">
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        <div className="flex flex-col py-4 text-sm font-medium">
          <Link href="/wishlist" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center">Wishlist</Link>
          <Link href="/cart" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center">Cart</Link>
          <Link href="/help" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center">Help and delivery</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center">About us</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center">Contact</Link>
        </div>
      </nav>
    </Drawer>
  );
}
