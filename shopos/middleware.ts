// middleware.ts

import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';
import { getRoutePermission, can } from '@/lib/permissions';
import type { Role } from '@/lib/types';

// Edge-safe auth instance (no bcrypt, no mock users)
const { auth } = NextAuth(authConfig);

function isPublic(pathname: string): boolean {
  if (pathname === '/login' || pathname === '/register') return true;
  if (pathname.startsWith('/api/auth')) return true;
  return false;
}

/**
 * Public storefront routes.
 * NOTE: admin owns /products and /orders, so the storefront uses
 * /shop and /my-orders. Never add /products or /orders here,
 * otherwise the admin pages become public.
 */
function isWebsiteRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  if (pathname === '/no-access') return true;
  if (pathname === '/shop' || pathname.startsWith('/shop/')) return true;
  if (pathname.startsWith('/product/')) return true;
  if (pathname === '/cart' || pathname.startsWith('/cart/')) return true;
  if (pathname === '/checkout' || pathname.startsWith('/checkout/')) return true;
  if (pathname === '/my-orders' || pathname.startsWith('/my-orders/')) return true;
  if (pathname === '/register') return true;
  return false;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user as { role?: Role } | undefined;
  const role = user?.role;

  // Skip assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Public website
  if (isWebsiteRoute(pathname)) return NextResponse.next();

  // Public auth pages
  if (isPublic(pathname)) {
    if (pathname === '/login' && role) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Require auth
  if (!role) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Check route permission
  const required = getRoutePermission(pathname);
  if (required && !can(role, required)) {
    return NextResponse.redirect(new URL('/no-access', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
