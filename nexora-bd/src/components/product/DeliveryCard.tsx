'use client';

import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore, type SiteSettings } from '@/store/settingsStore';
import { Skeleton } from '@/components/ui/Loading';
import { describeCharge } from '@/utils/delivery';
import { TruckIcon, ReturnIcon } from '@/components/icons';

const rows = [
  { area: 'Inside Dhaka', key: 'insideDhaka' as const },
  { area: 'Outside Dhaka', key: 'outsideDhaka' as const },
];

export function DeliveryCard() {
  const hydrated = useHydrated();
  const live = useSettingsStore();
  if (!hydrated || !live.remoteLoaded) {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5" aria-busy="true">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    );
  }
  const s: SiteSettings = live;
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5">
      {rows.map((row) => {
        const z = s[row.key];
        return (
          <div key={row.key} className="flex gap-3">
            <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-semibold">{row.area}</p>
              <p className="text-muted">Arrives in {z.estimate}. {describeCharge(z)}.</p>
            </div>
          </div>
        );
      })}
      <div className="flex gap-3 border-t border-line pt-4">
        <ReturnIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-muted">Easy returns within 7 days for eligible items.</p>
      </div>
    </div>
  );
}
