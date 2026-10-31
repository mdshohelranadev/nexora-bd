'use client';

import { create } from 'zustand';
import type { ToastItem, ToastVariant } from '@/types';
import { createId } from '@/utils/orders';

interface UIState {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  announcementVisible: boolean;
  toasts: ToastItem[];
  setCartOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  dismissAnnouncement: () => void;
  pushToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  announcementVisible: true,
  toasts: [],
  setCartOpen: (open) => set({ cartOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  dismissAnnouncement: () => set({ announcementVisible: false }),
  pushToast: (message, variant = 'success') => {
    const id = createId();
    set({ toasts: [...get().toasts, { id, message, variant }].slice(-4) });
    setTimeout(() => get().dismissToast(id), 2800);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
