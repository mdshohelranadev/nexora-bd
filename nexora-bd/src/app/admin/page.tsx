'use client';

import Link from 'next/link';
import { useAdminOrders } from '@/lib/remote';
import { useSettingsStore } from '@/store/settingsStore';
import { formatBDT } from '@/utils/format';
import { Skeleton } from '@/components/ui/Loading';

export default function AdminDashboard() {
  const { orders, loading } = useAdminOrders(true);
  const settings = useSettingsStore();
  const revenue = orders.reduce((n, o) => n + o.total, 0);
  const cod = orders.filter((o) => o.paymentMethod === 'cod').length;

  const stats = [
    { label: 'Total orders', value: String(orders.length), pending: loading },
    { label: 'Revenue', value: formatBDT(revenue), pending: loading },
    { label: 'Cash on delivery', value: String(cod), pending: loading },
    { label: 'Inside Dhaka charge', value: formatBDT(settings.insideDhaka.charge), pending: !settings.remoteLoaded },
    { label: 'Outside Dhaka charge', value: formatBDT(settings.outsideDhaka.charge), pending: !settings.remoteLoaded },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-surface p-5 shadow-card">
            <p className="text-xs text-muted">{s.label}</p>
            {s.pending ? (
              <Skeleton className="mt-2 h-7 w-24" />
            ) : (
              <p className="mt-2 font-display text-xl font-extrabold">{s.value}</p>
            )}
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/orders" className="rounded-xl bg-surface p-6 shadow-card hover:shadow-lift">
          <h2 className="font-bold">Orders</h2>
          <p className="mt-1 text-sm text-muted">View every order with delivery zone and items.</p>
        </Link>
        <Link href="/admin/settings" className="rounded-xl bg-surface p-6 shadow-card hover:shadow-lift">
          <h2 className="font-bold">Store settings</h2>
          <p className="mt-1 text-sm text-muted">Change delivery charges, free-delivery limits, announcement bar and store details.</p>
        </Link>
      </div>
    </div>
  );
}
