'use client';

import Link from 'next/link';
import { useHydrated } from '@/hooks/useHydrated';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { Button, Drawer, EmptyState } from '@/components/ui';
import { CartIcon } from '@/components/icons';
import { CartLines } from '@/components/product/CartLines';
import { getCartLines, getSubtotal } from '@/utils/cart';
import { formatBDT } from '@/utils/format';
import { useCatalog } from '@/store/catalogStore';

export function CartDrawer() {
  useCatalog((s) => s.products);
  const hydrated = useHydrated();
  const open = useUIStore((s) => s.cartOpen);
  const setOpen = useUIStore((s) => s.setCartOpen);
  const items = useCartStore((s) => s.items);
  const lines = hydrated ? getCartLines(items) : [];
  const subtotal = getSubtotal(lines);
  const count = lines.reduce((n, l) => n + l.item.quantity, 0);

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title={`Your cart (${count})`}
      footer={
        lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-display text-lg font-bold">{formatBDT(subtotal)}</span>
            </div>
            <p className="text-xs text-muted">Delivery is calculated at checkout based on your district.</p>
            <Link href="/checkout" onClick={() => setOpen(false)}>
              <Button fullWidth size="lg">Checkout</Button>
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="text-center text-sm font-semibold text-primary hover:underline">View full cart</Link>
          </div>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          icon={<CartIcon className="h-7 w-7" />}
          title="Your cart is empty"
          description="Browse our categories and add something you like."
          action={<Link href="/" onClick={() => setOpen(false)}><Button>Start shopping</Button></Link>}
        />
      ) : (
        <CartLines compact />
      )}
    </Drawer>
  );
}
