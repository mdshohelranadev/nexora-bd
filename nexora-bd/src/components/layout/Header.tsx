'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useHydrated } from '@/hooks/useHydrated';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { Badge, Button } from '@/components/ui';
import { CartIcon, HeartIcon, MenuIcon, SearchIcon } from '@/components/icons';
import { AccountButton } from './AccountButton';
import { SearchBox } from './SearchBox';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { useCatalog } from '@/store/catalogStore';

export function Header() {
  const categories = useCatalog((s) => s.categories);
  const hydrated = useHydrated();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlistStore((s) => s.ids.length);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const searchOpen = useUIStore((s) => s.searchOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const pathname = usePathname();
  
  useEffect(() => {
    setSearchOpen(false);
  }, [pathname, setSearchOpen]);

  return (
    <header className="sticky top-0 z-40 bg-surface shadow-sm">
      <div className="container-x flex h-16 items-center gap-3 lg:h-20 lg:gap-8">
        <Button variant="icon" className="lg:hidden" aria-label="Open navigation menu" onClick={() => setMobileMenuOpen(true)}>
          <MenuIcon className="h-6 w-6" />
        </Button>
        
        {/* ✅ FIX: Site name er jaygay image logo boshaano hoyeche */}
        <Link href="/" className="flex shrink-0 items-center rounded-md" aria-label="Nexora home">
          <Image
            src="https://i.postimg.cc/RZFP84QB/file-000000009eec8211aa6ba16c8ae2d815.png"
            alt="Nexora"
            width={200}
            height={60}
            className="h-9 w-auto object-contain sm:h-10 lg:h-12"
            priority
            unoptimized // ✅ External URL er jonno Next.js optimization skip korte hoy
          />
        </Link>
        
        <div className="ml-auto flex items-center gap-1">
          <Button variant="icon" aria-label="Search products" aria-expanded={searchOpen} aria-controls="search-panel" onClick={() => setSearchOpen(!searchOpen)}>
            <SearchIcon className="h-6 w-6" />
          </Button>
          <Link href="/wishlist" aria-label={`Wishlist, ${hydrated ? wishCount : 0} items`} className="relative grid h-11 w-11 place-items-center rounded-full text-ink transition hover:bg-canvas">
            <HeartIcon className="h-6 w-6" />
            {hydrated && wishCount > 0 && <Badge variant="danger" className="absolute -right-0.5 -top-0.5 h-5 min-w-[20px] justify-center rounded-full px-1 text-[10px]">{wishCount}</Badge>}
          </Link>
          <Button variant="icon" aria-label={`Open cart, ${hydrated ? cartCount : 0} items`} onClick={() => setCartOpen(true)} className="relative">
            <CartIcon className="h-6 w-6" />
            {hydrated && cartCount > 0 && <Badge variant="accent" className="absolute -right-0.5 -top-0.5 h-5 min-w-[20px] justify-center rounded-full px-1 text-[10px]">{cartCount}</Badge>}
          </Button>
          <AccountButton />
        </div>
      </div>
      
      {searchOpen && (
        <div id="search-panel" className="border-t border-line bg-surface shadow-card" onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); }}>
          <div className="container-x py-3">
            <Suspense fallback={null}>
              <SearchBox id="search-input" autoFocus className="w-full md:mx-auto md:max-w-xl" />
            </Suspense>
          </div>
        </div>
      )}
      
      <nav aria-label="Primary" className="hidden border-t border-line bg-primary lg:block">
        <div className="container-x flex items-center gap-1">
          <MegaMenu />
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="flex h-12 items-center rounded-md px-3 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white">
              {c.name}
            </Link>
          ))}
          <Link href="/help" className="ml-auto flex h-12 items-center rounded-md px-3 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white">
            Delivery and returns
          </Link>
        </div>
      </nav>
      
      <MobileNav />
    </header>
  );
}