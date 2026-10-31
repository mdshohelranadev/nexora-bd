'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSettingsStore } from '@/store/settingsStore';
import { track } from '@/lib/pixel';

// Meta Pixel loader + page view on every route change. Controlled from Admin > Settings.
// Also syncs the favicon from Admin > Settings.
export function Analytics() {
  const pixelId = useSettingsStore((s) => s.facebookPixelId);
  const enabled = useSettingsStore((s) => s.facebookPixelEnabled);
  const faviconUrl = useSettingsStore((s) => s.faviconUrl);
  const pathname = usePathname();
  const loadedFor = useRef<string | null>(null);

  const id = (pixelId || '').replace(/\D/g, '');
  const active = enabled && id.length > 0;

  useEffect(() => {
    if (!active || loadedFor.current === id) return;
    loadedFor.current = id;
    const w = window as any;
    if (!w.fbq) {
      const n: any = (w.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!w._fbq) w._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
    }
    w.fbq('init', id);
  }, [active, id]);

  useEffect(() => {
    if (active) track('PageView');
  }, [active, pathname]);

  useEffect(() => {
    if (!faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  return null;
}
