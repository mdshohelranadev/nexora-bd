'use client';

import { customerClient, supabase } from '@/lib/supabase';

// Calls to our own /api routes. Sends the logged-in user's token when present.
export async function customerToken(): Promise<string | null> {
  if (!customerClient) return null;
  const { data } = await customerClient.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function adminToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiCall<T = any>(path: string, init: RequestInit & { token?: string | null } = {}): Promise<{ ok: boolean; status: number; data: T & { error?: string; hint?: string; code?: string } }> {
  const { token, headers, ...rest } = init;
  const res = await fetch(path, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(headers ?? {}) },
  });
  const data = (await res.json().catch(() => ({}))) as any;
  return { ok: res.ok, status: res.status, data };
}
