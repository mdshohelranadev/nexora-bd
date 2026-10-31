'use client';

import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settingsStore';

// Floating WhatsApp button. Number and store name come from Admin > Settings.
// Hidden until a number is saved. Sits above the mobile bottom nav.
export function WhatsAppFloat() {
  const hydrated = useHydrated();
  const number = useSettingsStore((s) => s.whatsapp);
  const storeName = useSettingsStore((s) => s.storeName);

  const digits = (number || '').replace(/\D/g, '');
  if (!hydrated || !digits) return null;

  const text = encodeURIComponent(`Hi ${storeName}, I need help with a product.`);

  return (
    <a
      href={`https://wa.me/${digits}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-[84px] right-4 z-40 lg:bottom-6 lg:right-6"
    >
      {/* Pulse ring (disabled when user prefers reduced motion) */}
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 motion-safe:animate-ping" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 group-hover:scale-110 motion-safe:animate-bounce">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21l1.6-4.7A9 9 0 1 1 8 19.6L3 21z" />
          <path d="M9 10.5c.4 1.6 1.9 3.6 4 4.5l1.2-1.2c.2-.2.5-.3.8-.2l1.7.8c.3.1.4.5.3.8-.4 1-1.4 1.6-2.5 1.4-3-.6-5.4-3-6-6-.2-1.1.4-2.1 1.4-2.5.3-.1.7 0 .8.3l.8 1.7c.1.3 0 .6-.2.8L9 10.5z" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink opacity-0 shadow-card transition-opacity group-hover:opacity-100 sm:block">
        Chat with us
      </span>
    </a>
  );
}
