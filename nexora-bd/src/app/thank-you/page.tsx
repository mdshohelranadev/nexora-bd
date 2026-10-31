'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useHydrated } from '@/hooks/useHydrated';
import { useOrderStore } from '@/store/orderStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui';
import { CheckIcon } from '@/components/icons';

function ThankYouContent() {
  const hydrated = useHydrated();
  const orderId = useSearchParams().get('order');
  const order = useOrderStore((s) => s.orders.find((o) => o.id === orderId));
  const phone = useSettingsStore((s) => s.phone);

  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="grid h-20 w-20 place-items-center rounded-full bg-success text-white"
      >
        <CheckIcon className="h-10 w-10" />
      </motion.div>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Thank you for your order!</h1>
      {hydrated && order && (
        <p className="mt-3 text-sm text-muted">
          Order number <span className="font-semibold text-ink">{order.orderNumber}</span>. We will confirm it shortly.
        </p>
      )}
      {hydrated && phone && <p className="mt-2 text-sm text-muted">Questions? Call us on {phone}.</p>}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {hydrated && order && (
          <Link href={`/order-confirmation/${order.id}`}><Button variant="outline">View order details</Button></Link>
        )}
        <Link href="/"><Button>Continue shopping</Button></Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="container-x py-16" aria-hidden="true" />}>
      <ThankYouContent />
    </Suspense>
  );
}
