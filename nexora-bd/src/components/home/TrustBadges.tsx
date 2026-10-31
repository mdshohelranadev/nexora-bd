'use client';

import { CheckIcon, InfoIcon, ReturnIcon, TruckIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/Loading';
import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settingsStore';

const icons = [TruckIcon, ReturnIcon, CheckIcon, InfoIcon];

export function TrustBadges() {
  const hydrated = useHydrated();
  const loaded = useSettingsStore((s) => s.remoteLoaded);
  const badges = useSettingsStore((s) => s.trustBadges);

  if (!hydrated || !loaded) return <Skeleton className="h-28 rounded-xl" />;
  if (badges.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {badges.map((b, i) => {
        const Icon = icons[i % icons.length];
        return (
          <div key={i} className="flex gap-3 rounded-xl bg-surface p-5 shadow-card">
            <Icon className="h-6 w-6 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">{b.title}</p>
              <p className="text-sm text-muted">{b.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
