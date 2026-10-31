'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer({ endsAt }: { endsAt: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = Math.max(0, endsAt - now);
  const parts = [
    { label: 'Days', value: Math.floor(remaining / 86400000) },
    { label: 'Hours', value: Math.floor((remaining % 86400000) / 3600000) },
    { label: 'Minutes', value: Math.floor((remaining % 3600000) / 60000) },
    { label: 'Seconds', value: Math.floor((remaining % 60000) / 1000) },
  ];

  return (
    <div
      role="timer"
      aria-label="Time left in the flash sale"
      // ✅ FIX: mobile e gap kom + overflow hide (safety)
      className="flex gap-1.5 overflow-hidden sm:gap-2 md:gap-3"
    >
      {parts.map((p) => (
        <div
          key={p.label}
          // ✅ FIX: mobile e min-width 48px + padding kom, sm+ e boro
          className="flex min-w-[48px] flex-1 flex-col items-center rounded-md bg-white/10 px-1.5 py-1.5 sm:min-w-[56px] sm:flex-none sm:px-2.5 sm:py-2 md:min-w-[64px] md:px-3"
        >
          {/* ✅ FIX: number mobile e text-lg, sm+ e 2xl */}
          <span className="font-display text-lg font-extrabold tabular-nums text-white sm:text-xl md:text-2xl">
            {String(p.value).padStart(2, '0')}
          </span>
          {/* ✅ FIX: label mobile e text-[10px], sm+ e xs */}
          <span className="text-[10px] leading-none text-white/70 sm:text-xs">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}