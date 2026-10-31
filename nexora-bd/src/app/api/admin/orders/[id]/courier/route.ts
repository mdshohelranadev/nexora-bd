import { requireAdmin, serviceClient, json } from '@/lib/server/supabase';
import { createConsignment } from '@/lib/server/steadfast';
import { sendOrderWhatsApp } from '@/lib/server/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// One click: send the order to Steadfast, save the consignment ID, notify the customer.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return json({ error: 'Not authorised.' }, 401);

  const sb = serviceClient();
  const { data: row, error } = await sb.from('orders').select('*').eq('id', params.id).maybeSingle();
  if (error || !row) return json({ error: 'Order not found.' }, 404);
  if (row.consignment_id) return json({ error: `Already sent. Consignment ID: ${row.consignment_id}` }, 409);
  if (row.status === 'cancelled') return json({ error: 'Cancelled orders cannot be sent.' }, 400);

  const s = row.data.shipping;
  const address = [s.address, s.area, s.district].filter(Boolean).join(', ');
  try {
    const cn = await createConsignment({
      invoice: row.order_number,
      recipientName: s.fullName,
      recipientPhone: row.customer_phone,
      recipientAddress: address,
      codAmount: Number(row.total),
      note: `Nexora order ${row.order_number}`,
    });

    const { error: upErr } = await sb.from('orders').update({
      consignment_id: cn.consignmentId,
      tracking_code: cn.trackingCode || null,
      courier_status: 'in_review',
      status: 'shipped',
    }).eq('id', params.id);
    if (upErr) return json({ error: 'Courier booked but could not save. Note ID: ' + cn.consignmentId }, 500);

    const notified = await sendOrderWhatsApp(row.customer_phone, [
      row.order_number,
      'Your order has been handed to the courier.',
      `Consignment ID: ${cn.consignmentId}`,
    ]);
    return json({ ok: true, consignmentId: cn.consignmentId, trackingCode: cn.trackingCode, notified });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Courier request failed.' }, 502);
  }
}
