'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';
import { customerClient } from '@/lib/supabase';
import { useHydrated } from '@/hooks/useHydrated';
import { customerInfo, useCustomerStore } from '@/store/customerStore';
import type { Order } from '@/types';
import { formatBDT } from '@/utils/format';

export default function AccountPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const ready = useCustomerStore((s) => s.ready);
  const session = useCustomerStore((s) => s.session);
  const logout = useCustomerStore((s) => s.logout);
  const user = customerInfo(session);
  const userId = session?.user.id;
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (hydrated && ready && !user) router.replace('/login?next=/account');
  }, [hydrated, ready, user, router]);

  useEffect(() => {
    if (!userId || !customerClient) return;
    customerClient
      .from('orders')
      .select('data')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => setOrders(error ? [] : (data ?? []).map((r) => r.data as Order)));
  }, [userId]);

  if (!hydrated || !ready || !user) {
    return (
      <div className="container-x py-8" aria-busy="true">
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container-x grid gap-6 py-8 md:grid-cols-[280px_minmax(0,1fr)] md:py-12">
      <aside className="flex h-fit flex-col gap-4 rounded-xl bg-surface p-6 shadow-card">
        <div>
          <p className="text-xs text-muted">Signed in as</p>
          <h1 className="mt-1 text-xl font-extrabold">{user.name || 'Customer'}</h1>
        </div>
        <dl className="flex flex-col gap-2 text-sm">
          <div><dt className="text-muted">Email</dt><dd className="break-all">{user.email}</dd></div>
          {user.phone && <div><dt className="text-muted">Mobile</dt><dd>{user.phone}</dd></div>}
        </dl>
        <Button
          variant="outline"
          fullWidth
          onClick={async () => {
            await logout();
            router.replace('/');
          }}
        >
          Log out
        </Button>
      </aside>

      <section aria-labelledby="orders-heading" className="flex flex-col gap-4">
        <h2 id="orders-heading" className="text-2xl font-extrabold tracking-tight">My orders</h2>
        {orders === null && <Skeleton className="h-32 rounded-xl" />}
        {orders !== null && orders.length === 0 && (
          <div className="rounded-xl bg-surface p-6 text-sm text-muted shadow-card">
            You have no orders yet. Orders placed while logged in appear here.
          </div>
        )}
        {orders?.map((o) => (
          <article key={o.id} className="rounded-xl bg-surface p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold">{o.orderNumber}</h3>
              <span className="font-display font-bold">{formatBDT(o.total)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{new Date(o.createdAt).toLocaleDateString('en-GB')}</p>
            <p className="mt-3 text-sm text-muted">{o.items.map((i) => `${i.name} x ${i.quantity}`).join(', ')}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
