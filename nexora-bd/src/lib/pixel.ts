'use client';

// Meta Pixel helper. Does nothing unless the pixel is enabled and loaded from Admin > Settings.
type Fbq = (...args: unknown[]) => void;

export function track(event: string, params?: Record<string, unknown>, eventID?: string) {
  if (typeof window === 'undefined') return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (!fbq) return;
  if (eventID) fbq('track', event, params ?? {}, { eventID });
  else fbq('track', event, params ?? {});
}
