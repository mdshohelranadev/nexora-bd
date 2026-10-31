'use client';

import Link from 'next/link';
import { useAdminOrders } from '@/lib/remote';
import { formatBDT } from '@/utils/format';
import { Skeleton } from '@/components/ui/Loading';
import { Badge } from '@/components/ui';

const statusVariant: Record<string, 'default' | 'accent' | 'success' | 'danger' | 'outline'> = {
  pending: 'accent', confirmed: 'default', shipped: 'default', delivered: 'success', cancelled: 'danger',
};

export default function AdminOrdersPage() {
  const { orders: list, error, loading } = useAdminOrders(true);

  if (error) return <p className="text-sm text-danger">Could not load orders: {error}</p>;
  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    );
  }
  if (list.length === 0) {
    return <p className="rounded-xl bg-surface p-6 text-sm text-muted shadow-card">No orders yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {list.map((o) => (
        <li key={o.id}>
          <Link href={`/admin/orders/${o.id}`} className="flex flex-col gap-2 rounded-xl bg-surface p-4 shadow-card transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-bold">{o.orderNumber}</p>
              <p className="truncate text-sm text-muted">{o.shipping.fullName} · {o.shipping.phone} · {o.shipping.district}</p>
              <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleString('en-GB')}</p>
            </div>
            <div className="flex items-center gap-3">
              {o.consignmentId && <span className="text-xs text-muted">CN: {o.consignmentId}</span>}
              <Badge variant={statusVariant[o.status ?? 'pending'] ?? 'default'}>{o.status ?? 'pending'}</Badge>
              <span className="font-display font-bold">{formatBDT(o.total)}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
