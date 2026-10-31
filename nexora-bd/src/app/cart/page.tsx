'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useHydrated } from '@/hooks/useHydrated';
import { useCartStore } from '@/store/cartStore';
import { Button, EmptyState, Select } from '@/components/ui';
import { CartIcon } from '@/components/icons';
import { CartLines } from '@/components/product/CartLines';
import { districts } from '@/data/districts';
import { getCartLines, getSubtotal } from '@/utils/cart';
import { getDeliveryCharge, getDeliveryEstimate, getZoneForDistrict } from '@/utils/delivery';
import { defaultSettings, useSettingsStore } from '@/store/settingsStore';
import { formatBDT } from '@/utils/format';
import { useCatalog } from '@/store/catalogStore';

export default function CartPage() {
  useCatalog((s) => s.products);
  const hydrated = useHydrated();
  const liveSettings = useSettingsStore();
  const settings = hydrated ? liveSettings : defaultSettings;
  const items = useCartStore((s) => s.items);
  const [district, setDistrict] = useState('Dhaka');

  if (!hydrated) {
    return <div className="container-x py-12"><div className="h-80 animate-pulse rounded-xl bg-line" aria-hidden="true" /></div>;
  }

  const lines = getCartLines(items);
  const count = lines.reduce((n, l) => n + l.item.quantity, 0);
  const subtotal = getSubtotal(lines);
  const delivery = getDeliveryCharge(getZoneForDistrict(district), subtotal, settings);

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Shopping cart</h1>
      {lines.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<CartIcon className="h-7 w-7" />}
            title="Your cart is empty"
            description="Find something you like and add it here. Your cart is saved on this device."
            action={<Link href="/"><Button size="lg">Start shopping</Button></Link>}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl bg-surface p-5 shadow-card sm:p-6">
            <p className="mb-2 text-sm text-muted">{count} {count === 1 ? 'item' : 'items'}</p>
            <CartLines />
          </div>

          <aside aria-label="Cart summary" className="h-fit rounded-xl bg-surface p-6 shadow-card lg:sticky lg:top-32">
            <h2 className="text-lg font-bold">Order summary</h2>
            <div className="mt-4">
              <Select
                label="Estimate delivery to"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                options={districts.map((d) => ({ value: d, label: d }))}
                hint={`Arrives in ${getDeliveryEstimate(getZoneForDistrict(district), settings)}`}
              />
            </div>
            <dl className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatBDT(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{delivery === 0 ? 'Free' : formatBDT(delivery)}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><dt>Total</dt><dd className="font-display">{formatBDT(subtotal + delivery)}</dd></div>
            </dl>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/checkout"><Button fullWidth size="lg">Proceed to checkout</Button></Link>
              <Link href="/" className="text-center text-sm font-semibold text-primary hover:underline">Continue shopping</Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
