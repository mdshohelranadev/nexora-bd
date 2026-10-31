export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export const statusLabel: Record<OrderStatusValue, string> = {
  pending: 'Awaiting confirmation',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function isOrderStatus(v: unknown): v is OrderStatusValue {
  return typeof v === 'string' && (ORDER_STATUSES as readonly string[]).includes(v);
}
