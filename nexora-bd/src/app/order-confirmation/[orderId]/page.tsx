'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useHydrated } from '@/hooks/useHydrated';
import { useOrderStore } from '@/store/orderStore';
import { Button, EmptyState } from '@/components/ui';
import { CheckIcon, InfoIcon } from '@/components/icons';
import { formatBDT } from '@/utils/format';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = String(params.orderId ?? '');
  const hydrated = useHydrated();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === orderId));

  if (!hydrated) {
    return <div className="container-x py-12"><div className="h-80 animate-pulse rounded-xl bg-line" aria-hidden="true" /></div>;
  }

  if (!order) {
    return (
      <div className="container-x py-12">
        <EmptyState
          icon={<InfoIcon className="h-7 w-7" />}
          title="Order not found"
          description="This order is not saved on this device. Check the order number in your confirmation or continue shopping."
          action={<Link href="/"><Button>Continue shopping</Button></Link>}
        />
      </div>
    );
  }

  const paymentLabel = 'Cash on Delivery';

  return (
    <div className="container-x py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-success text-white">
            <CheckIcon className="h-8 w-8" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Thank you, your order is placed</h1>
          <p className="text-muted">
            Order number <span className="font-semibold text-ink">{order.orderNumber}</span>
          </p>
        </div>

        <div className="mt-10 grid gap-6 rounded-xl bg-surface p-6 shadow-card sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold">Delivering to</h2>
            <p className="mt-2 text-sm">{order.shipping.fullName}</p>
            <p className="text-sm text-muted">{order.shipping.phone}</p>
            <p className="text-sm text-muted">{order.shipping.address}, {order.shipping.area}, {order.shipping.district}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Payment</h2>
            <p className="mt-2 text-sm">{paymentLabel}</p>
            <p className="text-sm text-muted">Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        <ul className="mt-6 divide-y divide-line rounded-xl bg-surface shadow-card">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-canvas">
                <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted">Qty {item.quantity}{item.size ? ` | Size ${item.size}` : ''}{item.color ? ` | ${item.color}` : ''}</p>
              </div>
              <span className="text-sm font-semibold">{formatBDT(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-6 flex flex-col gap-3 rounded-xl bg-surface p-6 text-sm shadow-card">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatBDT(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{order.deliveryCharge === 0 ? 'Free' : formatBDT(order.deliveryCharge)}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><dt>Total</dt><dd className="font-display">{formatBDT(order.total)}</dd></div>
        </dl>

        <div className="mt-10 flex justify-center">
          <Link href="/"><Button size="lg">Continue shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
