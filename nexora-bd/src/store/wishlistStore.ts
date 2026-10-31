'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const exists = get().ids.includes(id);
        set({ ids: exists ? get().ids.filter((i) => i !== id) : [...get().ids, id] });
        return !exists;
      },
      remove: (id) => set({ ids: get().ids.filter((i) => i !== id) }),
    }),
    { name: 'nexora-wishlist', storage: createJSONStorage(() => localStorage) },
  ),
);
