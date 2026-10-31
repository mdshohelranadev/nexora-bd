'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order } from '@/types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders].slice(0, 50) }),
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'nexora-orders', storage: createJSONStorage(() => localStorage) },
  ),
);
