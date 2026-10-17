// app/(dashboard)/orders/page.tsx

'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Download, PackageCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { OrderDetailDialog } from '@/components/orders/order-detail-dialog';
import { makeOrderColumns } from '@/components/orders/order-columns';
import { useOrderStore } from '@/lib/store/order-store';
import { useSession } from 'next-auth/react';
import { downloadCSV } from '@/lib/export';
import type { Order, OrderStatus } from '@/lib/types';

type TabKey = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function OrdersPage() {
  const { data: session } = useSession();
  const { orders, updateStatus, cancel } = useOrderStore();

  const [tab, setTab] = useState<TabKey>('all');
  const [detail, setDetail] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      c[o.status] = (c[o.status] ?? 0) + 1;
    });
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    if (tab === 'all') return orders;
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  const columns = useMemo(
    () =>
      makeOrderColumns({
        onView: (o) => setDetail(o),
        onStatusChange: (o, status) => {
          updateStatus(o.id, status, session?.user?.email ?? 'system');
          toast.success(`Order ${o.orderNo} → ${status}`);
          if (status === 'delivered') {
            toast.info('Stock deducted');
          }
        },
        onCancel: (o) => setCancelTarget(o),
      }),
    [updateStatus, session]
  );

  const handleExport = () => {
    downloadCSV(
      filtered.map((o) => ({
        orderNo: o.orderNo,
        date: o.date,
        customer: o.customerName,
        phone: o.customerPhone,
        items: o.items.length,
        subtotal: o.subtotal,
        delivery: o.delivery,
        total: o.total,
        status: o.status,
        paymentMethod: o.paymentMethod,
        address: o.deliveryAddress,
      })),
      `orders-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${orders.length} total orders · ${counts.pending} pending · ${counts.delivered} delivered`}
        actions={
          <Button variant="outline" className="h-9" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="mb-4">
        <TabsList className="h-9 flex-wrap">
          <TabsTrigger value="all" className="text-xs">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            Pending ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="processing" className="text-xs">
            Processing ({counts.processing})
          </TabsTrigger>
          <TabsTrigger value="shipped" className="text-xs">
            Shipped ({counts.shipped})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="text-xs">
            Delivered ({counts.delivered})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs">
            Cancelled ({counts.cancelled})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              icon={PackageCheck}
              title={`No ${tab === 'all' ? '' : tab} orders`}
              description={
                tab === 'all'
                  ? 'Website orders will show up here as customers place them.'
                  : `No orders in ${tab} status right now.`
              }
            />
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          searchKey="customerName"
          searchPlaceholder="Search by customer, order no..."
          emptyTitle="No orders"
          pageSize={10}
        />
      )}

      <OrderDetailDialog
        order={detail}
        open={!!detail}
        onOpenChange={(v) => !v && setDetail(null)}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(v) => !v && setCancelTarget(null)}
        title="Cancel order?"
        description={`Order ${cancelTarget?.orderNo} will be marked as cancelled. ${
          cancelTarget?.status === 'delivered' ? 'Stock will be restored.' : ''
        }`}
        confirmLabel="Cancel Order"
        onConfirm={() => {
          if (cancelTarget) {
            cancel(cancelTarget.id, session?.user?.email ?? 'system');
            toast.success('Order cancelled');
            if (cancelTarget.status === 'delivered') {
              toast.info('Stock restored');
            }
            setCancelTarget(null);
          }
        }}
      />
    </div>
  );
}