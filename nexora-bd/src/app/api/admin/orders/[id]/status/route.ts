import { requireAdmin, serviceClient, json } from '@/lib/server/supabase';
import { isOrderStatus, statusLabel } from '@/lib/server/orderStatus';
import { sendOrderWhatsApp } from '@/lib/server/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const messages: Record<string, string> = {
  pending: 'Your order is awaiting confirmation.',
  confirmed: 'Your order is confirmed. Thank you for shopping with us.',
  shipped: 'Your order has been shipped.',
  delivered: 'Your order has been delivered. Thank you!',
  cancelled: 'Your order has been cancelled. Contact us on WhatsApp for help.',
};

// Admin changes order status. Every change sends the customer a WhatsApp update.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return json({ error: 'Not authorised.' }, 401);

  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!isOrderStatus(status)) return json({ error: 'Invalid status.' }, 400);

  const sb = serviceClient();
  const { data: order, error } = await sb.from('orders').select('order_number, customer_phone, consignment_id').eq('id', params.id).maybeSingle();
  if (error || !order) return json({ error: 'Order not found.' }, 404);

  const { error: upErr } = await sb.from('orders').update({ status }).eq('id', params.id);
  if (upErr) return json({ error: 'Could not update status.' }, 500);

  const sent = order.customer_phone
    ? await sendOrderWhatsApp(order.customer_phone, [
        order.order_number,
        `${statusLabel[status]}: ${messages[status]}`,
        order.consignment_id ? `Consignment ID: ${order.consignment_id}` : 'Use your order number and phone to track',
      ])
    : false;

  return json({ ok: true, status, notified: sent });
}
