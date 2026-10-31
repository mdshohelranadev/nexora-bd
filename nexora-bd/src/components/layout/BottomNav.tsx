'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { MenuIcon, SearchIcon, CartIcon, UserIcon } from '@/components/icons';

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-primary-600 bg-primary pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-6px_18px_rgba(216,27,96,0.25)] lg:hidden">
      <div className="flex h-[64px] items-center justify-around px-1">
        
        {/* Home */}
        <Link 
          href="/" 
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/') ? 'text-white font-semibold' : 'text-white/75 hover:text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <span className="text-[11px]">Home</span>
          {isActive('/') && (
            <motion.div layoutId="active-nav-indicator" className="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t-full bg-white" />
          )}
        </Link>

        {/* Search */}
        <button 
          onClick={() => setSearchOpen(true)} 
          className="relative flex flex-col items-center justify-center w-full h-full gap-1 text-white/75 hover:text-white transition-all active:scale-95"
        >
          <SearchIcon className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-[11px]">Search</span>
        </button>

        {/* Cart */}
        <button 
          onClick={() => setCartOpen(true)} 
          className="relative flex flex-col items-center justify-center w-full h-full gap-1 text-white/75 hover:text-white transition-all active:scale-95"
        >
          <div className="relative">
            <CartIcon className="h-6 w-6" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-primary">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">Cart</span>
        </button>

        {/* Orders */}
        <Link 
          href="/account?tab=orders" 
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/account?tab=orders') ? 'text-white font-semibold' : 'text-white/75 hover:text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <span className="text-[11px]">Orders</span>
          {isActive('/account?tab=orders') && (
            <motion.div layoutId="active-nav-indicator" className="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t-full bg-white" />
          )}
        </Link>

        {/* Account */}
        <Link 
          href="/account" 
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/account') ? 'text-white font-semibold' : 'text-white/75 hover:text-white'}`}
        >
          <UserIcon className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-[11px]">Account</span>
          {isActive('/account') && (
            <motion.div layoutId="active-nav-indicator" className="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t-full bg-white" />
          )}
        </Link>

      </div>
    </div>
  );
}