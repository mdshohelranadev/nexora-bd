'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface DeliveryZoneSettings {
  charge: number;
  freeAbove: number;
  estimate: string;
}

export interface FlashSaleSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  endsAt: string;
  productSlugs: string[];
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  link: string;
  alt: string;
  enabled: boolean;
}

// ✅ FIX: 'reviews' type theke remove kora hoyeche
export type HomeSectionKey =
  | 'hero' 
  | 'categories' 
  | 'flashSale' 
  | 'newArrivals' 
  | 'featured' 
  | 'bestSellers';

export interface HomeSectionSetting {
  key: HomeSectionKey;
  enabled: boolean;
}

export interface ReviewSettings {
  name: string;
  district: string;
  rating: number;
  quote: string;
}

// ✅ FIX: 'reviews' label remove kora hoyeche
export const homeSectionLabels: Record<HomeSectionKey, string> = {
  hero: 'Hero banner',
  categories: 'Category grid',
  flashSale: 'Flash sale and timer',
  newArrivals: 'New arrivals',
  featured: 'Featured products',
  bestSellers: 'Best sellers',
};

export interface SiteSettings {
  storeName: string;
  logoUrl: string;
  faviconUrl: string;
  facebookPixelId: string;
  facebookPixelEnabled: boolean;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  supportHours: string;
  announcement: string;
  aboutText: string;
  copyrightText: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  insideDhaka: DeliveryZoneSettings;
  outsideDhaka: DeliveryZoneSettings;
  flashSale: FlashSaleSettings;
  heroSlides: HeroSlide[];
  featuredSlugs: string[];
  newArrivalSlugs: string[];
  bestSellerSlugs: string[];
  reviews: ReviewSettings[]; // Admin panel e reviews edit korar jonno type ta rekhe deya holo
  homeSections: HomeSectionSetting[];
  customerSignupEnabled: boolean;
  trustBadges: { title: string; text: string }[];
  newsletterTitle: string;
  newsletterText: string;
}

export const defaultSettings: SiteSettings = {
  storeName: 'Nexora',
  logoUrl: '',
  faviconUrl: '',
  facebookPixelId: '',
  facebookPixelEnabled: false,
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  supportHours: 'Saturday to Thursday, 9 AM to 8 PM',
  announcement: '',
  aboutText: 'Authentic products, fast delivery across all 64 districts and easy returns.',
  copyrightText: 'All rights reserved.',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  insideDhaka: { charge: 60, freeAbove: 0, estimate: '1 to 2 business days' },
  outsideDhaka: { charge: 120, freeAbove: 0, estimate: '3 to 5 business days' },
  flashSale: { enabled: false, title: 'Flash Sale', subtitle: '', endsAt: '', productSlugs: [] },
  heroSlides: [],
  customerSignupEnabled: true,
  trustBadges: [
    { title: 'Fast delivery', text: 'Inside Dhaka in 1 to 2 days, and across all 64 districts.' },
    { title: 'Easy returns', text: '7-day return on eligible items.' },
    { title: 'Cash on Delivery', text: 'Pay in cash when your parcel arrives.' },
  ],
  newsletterTitle: 'Stay in the loop',
  newsletterText: 'Get weekly deals and new arrivals in your inbox.',
  featuredSlugs: [],
  newArrivalSlugs: [],
  bestSellerSlugs: [],
  reviews: [],
  // ✅ FIX: defaultSettings theke 'reviews' remove kora hoyeche
  homeSections: [
    { key: 'hero', enabled: true },
    { key: 'categories', enabled: true },
    { key: 'flashSale', enabled: true },
    { key: 'newArrivals', enabled: true },
    { key: 'featured', enabled: true },
    { key: 'bestSellers', enabled: true },
  ],
};

const settingKeys = Object.keys(defaultSettings) as (keyof SiteSettings)[];

export function pickSettings(s: SiteSettings): SiteSettings {
  return Object.fromEntries(settingKeys.map((k) => [k, s[k]])) as unknown as SiteSettings;
}

async function saveRemote(settings: SiteSettings): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, data: settings, updated_at: new Date().toISOString() });
  if (error) console.error('Settings save failed:', error.message);
}

interface SettingsState extends SiteSettings {
  remoteLoaded: boolean;
  update: (patch: Partial<SiteSettings>) => void;
  reset: () => void;
  syncFromRemote: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      remoteLoaded: false,
      update: (patch) => {
        set(patch);
        void saveRemote(pickSettings(get()));
      },
      reset: () => {
        set(defaultSettings);
        void saveRemote(defaultSettings);
      },
      syncFromRemote: async () => {
        try {
          if (supabase) {
            const { data, error } = await supabase.from('site_settings').select('data').eq('id', 1).maybeSingle();
            if (!error && data) {
              const remote = data.data as Partial<SiteSettings>;
              const validKeys: HomeSectionKey[] = ['hero', 'categories', 'flashSale', 'newArrivals', 'featured', 'bestSellers'];
              const merged: SiteSettings = {
                ...defaultSettings,
                ...remote,
                heroSlides: Array.isArray(remote.heroSlides) ? remote.heroSlides : [],
                // ✅ FIX: Purono DB theke 'reviews' ashleo seta filter hoye jabe
                homeSections: (remote.homeSections ?? defaultSettings.homeSections)
                  .filter((s) => validKeys.includes(s.key)),
              };
              set(merged);
            }
          }
        } finally {
          set({ remoteLoaded: true });
        }
      },
    }),
    {
      name: 'nexora-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => pickSettings(s),
    },
  ),
);