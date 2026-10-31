'use client';

import { LogoMark } from '@/components/icons';
import { defaultSettings, useSettingsStore } from '@/store/settingsStore';
import { useHydrated } from '@/hooks/useHydrated';

export function BrandMark({ markClass, textClass }: { markClass: string; textClass: string }) {
  const hydrated = useHydrated();
  const live = useSettingsStore();
  const s = hydrated ? live : defaultSettings;
  return (
    <>
      {s.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.logoUrl} alt="" className={markClass} />
      ) : (
        <LogoMark className={markClass} />
      )}
      <span className={textClass}>{s.storeName}</span>
    </>
  );
}
