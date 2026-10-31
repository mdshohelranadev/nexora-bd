'use client';

import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useHydrated } from '@/hooks/useHydrated';
import { CloseIcon, TruckIcon } from '@/components/icons';

export function AnnouncementBar() {
  const hydrated = useHydrated();
  const liveAnnouncement = useSettingsStore((s) => s.announcement);
  const remoteLoaded = useSettingsStore((s) => s.remoteLoaded);
  const visible = useUIStore((s) => s.announcementVisible);
  const dismiss = useUIStore((s) => s.dismissAnnouncement);
  if (!hydrated || !visible || (remoteLoaded && !liveAnnouncement.trim())) return null;
  return (
    <div className="relative bg-primary text-white">
      <div className="container-x flex min-h-[40px] items-center justify-center gap-2 py-2 pr-12 text-center text-sm sm:pr-4">
        <TruckIcon className="h-4 w-4 shrink-0 text-accent" />
        {remoteLoaded ? <p>{liveAnnouncement}</p> : <span aria-label="Loading announcement" className="h-4 w-64 max-w-full animate-pulse rounded bg-white/30" />}
        <button type="button" onClick={dismiss} aria-label="Dismiss announcement" className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full hover:bg-white/10 sm:right-4">
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
