'use client';

import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Only accounts marked as admin in app_metadata (set in SQL, see DEPLOY.md) count as admins.
export const isAdminSession = (s: Session | null) => s?.user?.app_metadata?.role === 'admin';

interface AdminState {
  session: Session | null;
  ready: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

let listening = false;

export const useAdminStore = create<AdminState>()((set) => ({
  session: null,
  ready: false,
  init: async () => {
    if (!supabase) {
      set({ ready: true });
      return;
    }
    const { data } = await supabase.auth.getSession();
    set({ session: isAdminSession(data.session) ? data.session : null, ready: true });
    if (!listening) {
      listening = true;
      supabase.auth.onAuthStateChange((_event, session) => set({ session: isAdminSession(session) ? session : null }));
    }
  },
  login: async (email, password) => {
    if (!supabase) return 'Supabase is not configured.';
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (!isAdminSession(data.session)) {
      await supabase.auth.signOut();
      return 'This account does not have admin access.';
    }
    set({ session: data.session });
    return null;
  },
  logout: async () => {
    await supabase?.auth.signOut();
    set({ session: null });
  },
}));
