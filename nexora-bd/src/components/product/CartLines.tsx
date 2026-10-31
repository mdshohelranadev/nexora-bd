'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useHydrated } from '@/hooks/useHydrated';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { getCartLines } from '@/utils/cart';
import { formatBDT } from '@/utils/format';
import { TrashIcon } from '@/components/icons';
import { QuantityStepper } from './QuantityStepper';
import { useCatalog } from '@/store/catalogStore';

export function CartLines({ compact = false }: { compact?: boolean }) {
  useCatalog((s) => s.products);
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const pushToast = useUIStore((s) => s.pushToast);
  if (!hydrated) return null;
  const lines = getCartLines(items);

  return (
    <ul className="flex flex-col divide-y divide-line">
      {lines.map(({ item, product, lineTotal }) => (
        <li key={item.lineKey} className="flex gap-4 py-4">
          <Link href={`/product/${product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-canvas sm:h-24 sm:w-24">
            <Image src={product.images[0]} alt={product.name} fill sizes="96px" className="object-cover" />
          </Link>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link href={`/product/${product.slug}`} className="text-sm font-semibold leading-snug hover:text-primary">{product.name}</Link>
                {(item.size || item.color) && (
                  <p className="text-xs text-muted">{[item.size && `Size: ${item.size}`, item.color && `Colour: ${item.color}`].filter(Boolean).join(' | ')}</p>
                )}
              </div>
              <button
                type="button"
                aria-label={`Remove ${product.name} from cart`}
                onClick={() => {
                  removeItem(item.lineKey);
                  pushToast('Removed from cart', 'info');
                }}
                className="grid h-11 w-11 -mr-2 -mt-2 shrink-0 place-items-center rounded-full text-muted transition hover:text-danger"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
              <QuantityStepper
                label={`Quantity for ${product.name}`}
                value={item.quantity}
                max={Math.min(99, product.stock)}
                onChange={(q) => updateQuantity(item.lineKey, q)}
              />
              <span className="font-display text-sm font-bold">{formatBDT(lineTotal)}</span>
            </div>
            {!compact && <p className="text-xs text-muted">{formatBDT(product.price)} each</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
