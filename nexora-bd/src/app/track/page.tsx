'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { apiCall } from '@/lib/api';
import { useSettingsStore } from '@/store/settingsStore';
import { formatDate } from '@/utils/format';

interface TrackResult {
  orderNumber: string;
  statusLabel: string;
  status: string;
  placedAt: string;
  consignmentId: string | null;
  trackingCode: string | null;
  courierStatus: string | null;
}

export default function TrackPage() {
  const whatsapp = useSettingsStore((s) => s.whatsapp);
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setResult(null);
    const qs = new URLSearchParams({ order: orderNumber.trim(), phone: phone.trim() });
    const { ok, data } = await apiCall<TrackResult>(`/api/track?${qs.toString()}`);
    setBusy(false);
    if (!ok) setError(data.error || 'Could not find this order.');
    else setResult(data as TrackResult);
  };

  return (
    <div className="container-x py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">Track your order</h1>
        <p className="mt-2 text-sm text-muted">Enter the order number and the mobile number you used at checkout.</p>

        <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-card">
          <Input label="Order number" placeholder="NX-251030-12345" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
          <Input label="Mobile number" inputMode="tel" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Button type="submit" size="lg" fullWidth loading={busy}>Track order</Button>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        </form>

        {result && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} aria-live="polite" className="mt-6 flex flex-col gap-3 rounded-xl bg-surface p-6 shadow-card">
            <p className="text-sm text-muted">Order {result.orderNumber}</p>
            <p className="text-xl font-extrabold text-primary">{result.statusLabel}</p>
            <p className="text-sm text-muted">Placed on {formatDate(result.placedAt)}</p>
            {result.consignmentId && (
              <p className="text-sm">Courier consignment ID: <span className="font-semibold">{result.consignmentId}</span></p>
            )}
            {result.courierStatus && <p className="text-sm">Courier status: {result.courierStatus}</p>}
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">
                Need more help? Chat on WhatsApp
              </a>
            )}
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
