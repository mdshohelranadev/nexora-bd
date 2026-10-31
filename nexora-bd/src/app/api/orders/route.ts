import { randomUUID } from 'crypto';
import { optionalUser, serviceClient, json } from '@/lib/server/supabase';
import { normalizeBdPhone } from '@/lib/server/phone';
import { sendOrderWhatsApp } from '@/lib/server/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WHATSAPP_HINT = 'Need help? Contact us on WhatsApp for details.';

// Place an order. Prices, delivery charge and total are recomputed on the server.
// Gate: a phone number with an order still "pending" (not confirmed by admin) cannot place another order.
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const sb = serviceClient();
  const s = body?.shipping ?? {};
  // Cash on Delivery is the only payment method.
  const phone = normalizeBdPhone(s.phone);
  if (!phone) return json({ error: 'Enter a valid 11 digit mobile number.' }, 400);
  if (!s.fullName || !s.address || !s.district || !['insideDhaka', 'outsideDhaka'].includes(s.zone)) {
    return json({ error: 'Shipping details are incomplete.' }, 400);
  }
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
    return json({ error: 'Cart is empty.' }, 400);
  }

  // Gate: one open (pending) order per phone number
  const { count: openCount } = await sb
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('customer_phone', phone)
    .eq('status', 'pending');
  if ((openCount ?? 0) > 0) {
    return json({
      code: 'ORDER_PENDING',
      error: 'You already have an order waiting for confirmation. A new order can be placed after it is confirmed.',
      hint: WHATSAPP_HINT,
    }, 409);
  }

  // Server-side price check
  const ids: string[] = body.items.map((i: any) => String(i.productId));
  const { data: products, error: pErr } = await sb
    .from('products')
    .select('id, name, price, images, stock, is_active')
    .in('id', ids);
  if (pErr) return json({ error: 'Could not read products. Try again.' }, 500);
  const byId = new Map((products ?? []).map((p: any) => [p.id, p]));

  let subtotal = 0;
  const items = [];
  for (const i of body.items) {
    const p: any = byId.get(String(i.productId));
    const qty = Math.max(1, Math.min(99, Number(i.quantity) || 1));
    if (!p || !p.is_active) return json({ error: 'A product in your cart is no longer available.' }, 400);
    if (p.stock < qty) return json({ error: `Only ${p.stock} left for ${p.name}.` }, 400);
    subtotal += Number(p.price) * qty;
    items.push({
      productId: p.id, name: p.name, image: p.images?.[0] ?? '', price: Number(p.price),
      quantity: qty, size: i.size, color: i.color,
    });
  }

  const { data: settingsRow } = await sb.from('site_settings').select('data').eq('id', 1).maybeSingle();
  const zone = settingsRow?.data?.[s.zone] ?? { charge: 0, freeAbove: 0 };
  const deliveryCharge = zone.freeAbove > 0 && subtotal >= zone.freeAbove ? 0 : Number(zone.charge) || 0;
  const total = subtotal + deliveryCharge;

  const user = await optionalUser(req);
  const id = randomUUID();
  const orderNumber = `NX-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 89999)}`;
  const createdAt = new Date().toISOString();
  const shipping = { ...s, phone };
  const order = {
    id, orderNumber, createdAt, items, subtotal, deliveryCharge, total, shipping,
    paymentMethod: 'cod', status: 'pending',
  };

  const { error: insErr } = await sb.from('orders').insert({
    id,
    order_number: orderNumber,
    created_at: createdAt,
    total,
    zone: s.zone,
    data: order,
    user_id: user?.id ?? null,
    status: 'pending',
    customer_phone: phone,
  });
  if (insErr) return json({ error: 'Could not place the order. Please try again.' }, 500);

  // Decrement stock (best effort)
  for (const it of items) {
    const p: any = byId.get(it.productId);
    await sb.from('products').update({ stock: Math.max(0, p.stock - it.quantity) }).eq('id', it.productId);
  }

  await sendOrderWhatsApp(phone, [orderNumber, 'We received your order. We will confirm it shortly.', 'Track with your order number and phone']);

  return json({ id, orderNumber, total });
}
