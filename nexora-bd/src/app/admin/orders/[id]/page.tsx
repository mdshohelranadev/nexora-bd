'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { adminToken, apiCall } from '@/lib/api';
import { useUIStore } from '@/store/uiStore';
import { formatBDT } from '@/utils/format';
import { Badge, Button, Input, Select } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';
import { districts } from '@/data/districts';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

interface OrderRow {
  id: string; order_number: string; created_at: string; total: number; status: string;
  consignment_id: string | null; tracking_code: string | null; customer_phone: string; data: any;
}

export default function AdminOrderDetail({ params }: { params: { id: string } }) {
  const pushToast = useUIStore((s) => s.pushToast);
  const [order, setOrder] = useState<OrderRow | null | undefined>(undefined);
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [ship, setShip] = useState({ fullName: '', phone: '', address: '', area: '', district: '', zone: 'insideDhaka' });
  const [shipError, setShipError] = useState('');

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('orders').select('*').eq('id', params.id).maybeSingle();
    if (error) pushToast(error.message, 'danger');
    setOrder((data as OrderRow) ?? null);
    if (data) {
      const s = (data as OrderRow).data.shipping;
      setShip({ fullName: s.fullName, phone: s.phone, address: s.address, area: s.area ?? '', district: s.district, zone: s.zone || 'insideDhaka' });
    }
  }, [params.id, pushToast]);

  useEffect(() => { void load(); }, [load]);

  if (order === undefined) return <div className="flex flex-col gap-4" aria-busy="true"><Skeleton className="h-32 rounded-xl" /><Skeleton className="h-64 rounded-xl" /></div>;
  if (order === null) return <p className="text-sm">Order not found. <Link href="/admin/orders" className="font-semibold text-primary">Back to orders</Link></p>;

  const locked = Boolean(order.consignment_id) || order.status === 'shipped' || order.status === 'delivered';

  const setStatus = async (status: string) => {
    setBusy(`status:${status}`);
    const token = await adminToken();
    const { ok, data } = await apiCall(`/api/admin/orders/${order.id}/status`, { method: 'POST', token, body: JSON.stringify({ status }) });
    setBusy(null);
    if (!ok) { pushToast(data.error || 'Status update failed', 'danger'); return; }
    pushToast(data.notified ? `Status: ${status}. Customer notified on WhatsApp.` : `Status: ${status}. WhatsApp not sent (check settings).`, data.notified ? 'success' : 'warning');
    void load();
  };

  const sendToCourier = async () => {
    if (!window.confirm('Send this order to Steadfast now?')) return;
    setBusy('courier');
    const token = await adminToken();
    const { ok, data } = await apiCall(`/api/admin/orders/${order.id}/courier`, { method: 'POST', token });
    setBusy(null);
    if (!ok) { pushToast(data.error || 'Courier request failed', 'danger'); return; }
    pushToast(`Booked. Consignment ID ${data.consignmentId}`);
    void load();
  };

  const saveShipping = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!/^01[3-9]\d{8}$/.test(ship.phone.replace(/\D/g, ''))) { setShipError('Enter a valid 11 digit mobile number.'); return; }
    if (!ship.fullName.trim() || !ship.address.trim()) { setShipError('Name and address are required.'); return; }
    setShipError('');
    setBusy('save');
    const phone = ship.phone.replace(/\D/g, '');
    const newData = { ...order.data, shipping: { ...order.data.shipping, ...ship, phone } };
    const { error } = await supabase.from('orders').update({ data: newData, customer_phone: phone }).eq('id', order.id);
    setBusy(null);
    if (error) { pushToast(error.message, 'danger'); return; }
    pushToast('Order details saved');
    setEditing(false);
    void load();
  };

  const setS = (k: keyof typeof ship, v: string) => setShip((s) => ({ ...s, [k]: v }));
  const items: any[] = order.data.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">← All orders</Link>
          <h2 className="mt-1 text-2xl font-extrabold">{order.order_number}</h2>
          <p className="text-sm text-muted">{new Date(order.created_at).toLocaleString('en-GB')}</p>
        </div>
        <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'default'}>{order.status}</Badge>
      </div>

      <section className="flex flex-col gap-3 rounded-xl bg-surface p-5 shadow-card" aria-labelledby="status-h">
        <h3 id="status-h" className="font-bold">Update status</h3>
        <p className="text-xs text-muted">Each change sends the customer a WhatsApp message.</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button key={s} size="sm" variant={order.status === s ? 'primary' : 'outline'} loading={busy === `status:${s}`} disabled={order.status === s || busy !== null} onClick={() => setStatus(s)}>
              {s}
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-xl bg-surface p-5 shadow-card" aria-labelledby="courier-h">
        <h3 id="courier-h" className="font-bold">Courier (Steadfast)</h3>
        {order.consignment_id ? (
          <p className="text-sm">Consignment ID <span className="font-semibold">{order.consignment_id}</span>{order.tracking_code ? ` · Tracking ${order.tracking_code}` : ''}</p>
        ) : (
          <p className="text-sm text-muted">Not sent to courier yet.</p>
        )}
        <Button className="w-fit" disabled={Boolean(order.consignment_id) || order.status === 'cancelled' || busy !== null} loading={busy === 'courier'} onClick={sendToCourier}>
          Send to Steadfast
        </Button>
      </section>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 shadow-card" aria-labelledby="ship-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="ship-h" className="font-bold">Customer and delivery</h3>
          {!editing && <Button variant="outline" size="sm" disabled={locked} onClick={() => setEditing(true)}>{locked ? 'Locked after courier booking' : 'Edit details'}</Button>}
        </div>

        {editing ? (
          <form onSubmit={saveShipping} noValidate className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={ship.fullName} onChange={(e) => setS('fullName', e.target.value)} />
            <Input label="Mobile number" value={ship.phone} onChange={(e) => setS('phone', e.target.value)} />
            <div className="sm:col-span-2"><Input label="Address" value={ship.address} onChange={(e) => setS('address', e.target.value)} /></div>
            <Input label="Area" value={ship.area} onChange={(e) => setS('area', e.target.value)} />
            <Select label="District" value={ship.district} onChange={(e) => setS('district', e.target.value)} options={districts.map((d) => ({ value: d, label: d }))} />
            {shipError && <p role="alert" className="text-sm text-danger sm:col-span-2">{shipError}</p>}
            <div className="flex justify-end gap-3 sm:col-span-2">
              <Button variant="ghost" type="button" onClick={() => { setEditing(false); setShipError(''); }}>Cancel</Button>
              <Button type="submit" loading={busy === 'save'}>Save details</Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-1 text-sm sm:grid-cols-2">
            <p><span className="text-muted">Name:</span> {order.data.shipping.fullName}</p>
            <p><span className="text-muted">Mobile:</span> {order.customer_phone}</p>
            <p className="sm:col-span-2"><span className="text-muted">Address:</span> {order.data.shipping.address}, {order.data.shipping.area}, {order.data.shipping.district}</p>
            <p><span className="text-muted">Payment:</span> {order.data.paymentMethod}</p>
            <p><span className="text-muted">Total:</span> {formatBDT(order.total)}</p>
          </div>
        )}
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-card" aria-labelledby="items-h">
        <h3 id="items-h" className="mb-3 font-bold">Items</h3>
        <ul className="divide-y divide-line text-sm">
          {items.map((i, idx) => (
            <li key={`${i.productId}-${idx}`} className="flex justify-between py-2">
              <span>{i.name} × {i.quantity}{i.size ? ` · ${i.size}` : ''}{i.color ? ` · ${i.color}` : ''}</span>
              <span>{formatBDT(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
