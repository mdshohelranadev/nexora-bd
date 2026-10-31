'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrderStore } from '@/store/orderStore';
import type { Order } from '@/types';

export function useAdminOrders(enabled: boolean) {
  const local = useOrderStore((s) => s.orders);
  const [remote, setRemote] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !supabase) return;
    supabase
      .from('orders')
      .select('id, data, status, consignment_id, tracking_code')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setRemote((data ?? []).map((row: any) => ({ ...(row.data as Order), status: row.status, consignmentId: row.consignment_id ?? undefined, trackingCode: row.tracking_code ?? undefined })));
      });
  }, [enabled]);

  if (!supabase) return { orders: local, error: null, loading: false };
  return { orders: remote ?? [], error, loading: remote === null && error === null };
}
