// components/website/navbar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Wrench,
  Package,
  Home,
  Info,
  Phone,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useWebCart } from '@/lib/store/web-cart-store';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Products', icon: Package },
  { href: '/my-orders', label: 'My Orders', icon: Wrench },
];

export function WebsiteNavbar() {
  const router = useRouter();
  const cart = useWebCart();
  const count = cart.count();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-14 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="ShopOS home"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight">ShopOS</div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                Construction Tools
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative flex-1 max-w-md ml-auto"
          >
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools, brands, SKU..."
              className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:bg-background"
            />
          </form>

          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => cart.setDrawerOpen(true)}
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex h-9"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden border-t border-border px-3 py-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools..."
                className="pl-9 pr-9 h-10"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-accent"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <span className="sr-only">Navigation menu</span>
          <div className="flex items-center gap-2 h-14 border-b border-border px-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">ShopOS</div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                Construction Tools
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
              >
                <l.icon className="h-4 w-4 text-muted-foreground" />
                {l.label}
              </Link>
            ))}
            <div className="border-t border-border my-2" />
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
            >
              <Info className="h-4 w-4 text-muted-foreground" />
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              Contact
            </Link>
          </nav>

          <div className="p-3 mt-auto border-t border-border">
            <Button
              asChild
              variant="outline"
              className="w-full h-10"
              onClick={() => setMobileOpen(false)}
            >
              <Link href="/login">Sign in to Dashboard</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}