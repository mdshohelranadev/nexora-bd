import { serviceClient, json } from '@/lib/server/supabase';
import { normalizeBdPhone } from '@/lib/server/phone';
import { getConsignmentStatus } from '@/lib/server/steadfast';
import { statusLabel, isOrderStatus } from '@/lib/server/orderStatus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Customer tracking: order number + phone must both match. Returns no personal data beyond status.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderNumber = (url.searchParams.get('order') || '').trim();
  const phone = normalizeBdPhone(url.searchParams.get('phone') || '');
  if (!orderNumber || !phone) return json({ error: 'Enter your order number and mobile number.' }, 400);

  const { data, error } = await serviceClient()
    .from('orders')
    .select('order_number, status, consignment_id, tracking_code, created_at')
    .eq('order_number', orderNumber)
    .eq('customer_phone', phone)
    .maybeSingle();
  if (error) return json({ error: 'Could not look up the order. Try again.' }, 500);
  if (!data) return json({ error: 'No order found for these details.' }, 404);

  const courierStatus = data.consignment_id ? await getConsignmentStatus(data.consignment_id) : null;
  const status = isOrderStatus(data.status) ? data.status : 'pending';
  return json({
    orderNumber: data.order_number,
    status,
    statusLabel: statusLabel[status],
    placedAt: data.created_at,
    consignmentId: data.consignment_id,
    trackingCode: data.tracking_code,
    courierStatus,
  });
}
