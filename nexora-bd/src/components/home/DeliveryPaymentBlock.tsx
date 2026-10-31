'use client';

import { Skeleton } from '@/components/ui/Loading';
import { TruckIcon } from '@/components/icons';
import { useHydrated } from '@/hooks/useHydrated';
import { defaultSettings, useSettingsStore, type SiteSettings } from '@/store/settingsStore';
import { describeCharge } from '@/utils/delivery';

export function DeliveryPaymentBlock() {
  const hydrated = useHydrated();
  const live = useSettingsStore();

  // ✅ FIX: skeleton mobile e choto
  if (!hydrated || !live.remoteLoaded) return <Skeleton className="h-32 rounded-xl sm:h-40" />;

  const s: SiteSettings = live;
  const zones = [
    { title: 'Inside Dhaka', z: s.insideDhaka },
    { title: 'Outside Dhaka', z: s.outsideDhaka },
  ];

  return (
    // ✅ FIX: mobile e gap-4, sm+ e gap-6 + min-w-0
    <section aria-labelledby="delivery-heading" className="flex w-full min-w-0 flex-col gap-4 sm:gap-6">
      {/* ✅ FIX: heading mobile e text-xl, smooth progression */}
      <h2
        id="delivery-heading"
        className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl"
      >
        Delivery and payment
      </h2>

      {/* ✅ FIX: mobile e 1 column, sm+ e 2, md+ e 3 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
        {zones.map(({ title, z }) => (
          // ✅ FIX: card padding mobile e kom (p-4), sm+ e boro (p-6)
          <div
            key={title}
            className="flex gap-3 rounded-xl bg-surface p-4 shadow-card sm:p-5 md:p-6"
          >
            {/* ✅ FIX: icon mobile e choto */}
            <TruckIcon className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-muted">
                Arrives in {z.estimate}. {describeCharge(z)}.
              </p>
            </div>
          </div>
        ))}

        {/* ✅ FIX: payment card padding responsive */}
        <div className="rounded-xl bg-surface p-4 shadow-card text-sm sm:p-5 md:p-6">
          <p className="font-semibold">Payment</p>
          <p className="mt-1 text-muted">
            Cash on Delivery only.
          </p>
        </div>
      </div>
    </section>
  );
}