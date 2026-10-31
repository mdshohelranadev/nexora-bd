import type { DeliveryZoneKey } from '@/types';
import { defaultSettings, type DeliveryZoneSettings, type SiteSettings } from '@/store/settingsStore';
import { formatBDT } from '@/utils/format';

export const DHAKA = 'Dhaka';

export function getZoneForDistrict(district: string): DeliveryZoneKey {
  return district === DHAKA ? 'insideDhaka' : 'outsideDhaka';
}

export function getDeliveryCharge(
  zone: DeliveryZoneKey | '',
  subtotal: number,
  settings: Pick<SiteSettings, DeliveryZoneKey> = defaultSettings,
): number {
  if (!zone) return 0;
  const z = settings[zone];
  if (z.freeAbove > 0 && subtotal >= z.freeAbove) return 0;
  return z.charge;
}

export function getDeliveryEstimate(
  zone: DeliveryZoneKey | '',
  settings: Pick<SiteSettings, DeliveryZoneKey> = defaultSettings,
): string {
  return zone ? settings[zone].estimate : '';
}

/** Human text for a zone's charge. The free-delivery clause only appears when admin enables a threshold. */
export function describeCharge(z: DeliveryZoneSettings): string {
  const base = z.charge > 0 ? `Charge ${formatBDT(z.charge)}` : 'No delivery charge';
  return z.freeAbove > 0 ? `${base}, free on orders over ${formatBDT(z.freeAbove)}` : base;
}
