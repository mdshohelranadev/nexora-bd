// Steadfast Courier API. Credentials from Vercel env only.
// Env: STEADFAST_API_KEY, STEADFAST_SECRET_KEY, optional STEADFAST_BASE_URL.
// Check the endpoints against the current Steadfast API docs before going live.
const base = () => process.env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1';

function headers(): Record<string, string> {
  const key = process.env.STEADFAST_API_KEY;
  const secret = process.env.STEADFAST_SECRET_KEY;
  if (!key || !secret) throw new Error('Steadfast credentials not set (STEADFAST_API_KEY / STEADFAST_SECRET_KEY)');
  return { 'Api-Key': key, 'Secret-Key': secret, 'Content-Type': 'application/json', Accept: 'application/json' };
}

export interface ConsignmentInput {
  invoice: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  codAmount: number;
  note?: string;
}

export interface ConsignmentResult {
  consignmentId: string;
  trackingCode: string;
}

export async function createConsignment(input: ConsignmentInput): Promise<ConsignmentResult> {
  const res = await fetch(`${base()}/create_order`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      invoice: input.invoice,
      recipient_name: input.recipientName,
      recipient_phone: input.recipientPhone,
      recipient_address: input.recipientAddress,
      cod_amount: input.codAmount,
      note: input.note ?? '',
    }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.consignment) {
    throw new Error(body?.message || `Steadfast error ${res.status}`);
  }
  return {
    consignmentId: String(body.consignment.consignment_id),
    trackingCode: String(body.consignment.tracking_code ?? ''),
  };
}

export async function getConsignmentStatus(consignmentId: string): Promise<string | null> {
  try {
    const res = await fetch(`${base()}/status_by_cid/${encodeURIComponent(consignmentId)}`, { headers: headers(), cache: 'no-store' });
    const body = await res.json().catch(() => null);
    return body?.delivery_status ?? null;
  } catch {
    return null;
  }
}
