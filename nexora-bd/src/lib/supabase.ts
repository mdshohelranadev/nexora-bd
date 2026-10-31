import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

// Admin client (used by /admin). Uses the default storage key.
export const supabase: SupabaseClient | null = supabaseEnabled ? createClient(url as string, anonKey as string) : null;

// Customer client (storefront login). Separate storage key so admin and customer sessions never clash.
export const customerClient: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, anonKey as string, { auth: { storageKey: 'nexora-customer' } })
  : null;
