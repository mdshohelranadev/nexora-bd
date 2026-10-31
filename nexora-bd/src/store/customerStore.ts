'use client';

import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { customerClient } from '@/lib/supabase';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

// A customer is any account created through the storefront signup (role stored in user_metadata).
export function customerInfo(session: Session | null): CustomerInfo | null {
  const user = session?.user;
  if (!user || user.user_metadata?.role !== 'customer') return null;
  return {
    name: String(user.user_metadata?.name ?? ''),
    email: user.email ?? '',
    phone: String(user.user_metadata?.phone ?? ''),
  };
}

// Only allow in-site redirects after login or signup.
export function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/account';
  return raw;
}

interface SignupInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface CustomerState {
  session: Session | null;
  ready: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (input: SignupInput) => Promise<{ error: string | null; hasSession: boolean }>;
  logout: () => Promise<void>;
}

let listening = false;

export const useCustomerStore = create<CustomerState>()((set) => ({
  session: null,
  ready: false,
  init: async () => {
    if (!customerClient) {
      set({ ready: true });
      return;
    }
    const { data } = await customerClient.auth.getSession();
    set({ session: data.session, ready: true });
    if (!listening) {
      listening = true;
      customerClient.auth.onAuthStateChange((_event, session) => set({ session }));
    }
  },
  login: async (email, password) => {
    if (!customerClient) return 'Supabase is not configured.';
    const { data, error } = await customerClient.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (!customerInfo(data.session)) {
      await customerClient.auth.signOut();
      return 'This account is not a customer account.';
    }
    set({ session: data.session });
    return null;
  },
  signup: async ({ name, email, phone, password }) => {
    if (!customerClient) return { error: 'Supabase is not configured.', hasSession: false };
    const { data, error } = await customerClient.auth.signUp({
      email,
      password,
      options: { data: { role: 'customer', name, phone } },
    });
    if (error) return { error: error.message, hasSession: false };
    if (data.session) set({ session: data.session });
    return { error: null, hasSession: Boolean(data.session) };
  },
  logout: async () => {
    await customerClient?.auth.signOut();
    set({ session: null });
  },
}));
