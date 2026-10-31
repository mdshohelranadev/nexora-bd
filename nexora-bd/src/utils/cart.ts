import type { CartItem, Product } from '@/types';
import { getProductById } from '@/utils/catalog';
import { useCatalog } from '@/store/catalogStore';

export interface CartLine {
  item: CartItem;
  product: Product;
  lineTotal: number;
}

export function getCartLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = getProductById(useCatalog.getState().products, item.productId);
    if (!product) return [];
    return [{ item, product, lineTotal: product.price * item.quantity }];
  });
}

export function getSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}
