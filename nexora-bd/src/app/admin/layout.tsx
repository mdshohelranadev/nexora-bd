'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { supabaseEnabled } from '@/lib/supabase';
import { Button } from '@/components/ui';
import { Spinner } from '@/components/ui/Loading';

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/home', label: 'Home page' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const session = useAdminStore((s) => s.session);
  const ready = useAdminStore((s) => s.ready);
  const init = useAdminStore((s) => s.init);
  const logout = useAdminStore((s) => s.logout);
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    if (ready && !session && !isLogin) router.replace('/admin/login');
  }, [ready, session, isLogin, router]);

  if (!supabaseEnabled) {
    return (
      <div className="container-x py-16 text-sm text-muted">
        Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (see SETUP.md).
      </div>
    );
  }
  if (isLogin) return <div className="container-x py-10">{children}</div>;
  if (!ready || !session) return <div className="container-x py-16"><Spinner label="Checking admin access..." /></div>;

  return (
    <div className="container-x py-6 md:py-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-line pb-4">
        <h1 className="mr-auto font-display text-lg font-extrabold text-primary md:text-xl">Admin Panel</h1>
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${pathname === n.href ? 'bg-primary text-white' : 'text-ink hover:bg-canvas'}`}
          >
            {n.label}
          </Link>
        ))}
        <Link href="/" className="rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-canvas">View store</Link>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await logout();
            router.replace('/admin/login');
          }}
        >
          Logout
        </Button>
      </div>
      {children}
    </div>
  );
}
