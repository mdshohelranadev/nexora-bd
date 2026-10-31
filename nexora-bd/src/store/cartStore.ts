'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';

export function makeLineKey(productId: string, size?: string, color?: string): string {
  return [productId, size ?? '', color ?? ''].join('|');
}

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, quantity = 1, size, color) => {
        const lineKey = makeLineKey(productId, size, color);
        const existing = get().items.find((i) => i.lineKey === lineKey);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.lineKey === lineKey ? { ...i, quantity: Math.min(i.quantity + quantity, 99) } : i,
            ),
          });
          return;
        }
        set({ items: [...get().items, { lineKey, productId, quantity, size, color }] });
      },
      updateQuantity: (lineKey, quantity) =>
        set({
          items: get().items.map((i) =>
            i.lineKey === lineKey ? { ...i, quantity: Math.max(1, Math.min(quantity, 99)) } : i,
          ),
        }),
      removeItem: (lineKey) => set({ items: get().items.filter((i) => i.lineKey !== lineKey) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'nexora-cart', storage: createJSONStorage(() => localStorage) },
  ),
);
