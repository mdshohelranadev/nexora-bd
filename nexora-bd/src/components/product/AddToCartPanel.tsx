'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui';
import { QuantityStepper } from './QuantityStepper';
import { cn } from '@/utils/cn';

function OptionGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p id={`opt-${label}`} className="text-sm font-semibold">{label}: <span className="font-normal text-muted">{value}</span></p>
      <div role="radiogroup" aria-labelledby={`opt-${label}`} className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt)}
              className={cn(
                'min-h-[44px] min-w-[44px] rounded-md border px-4 text-sm font-medium transition',
                selected ? 'border-primary bg-primary-50 text-primary' : 'border-line bg-surface hover:border-muted',
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AddToCartPanel({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const pushToast = useUIStore((s) => s.pushToast);
  const [size, setSize] = useState(product.variants?.sizes?.[0] ?? '');
  const [color, setColor] = useState(product.variants?.colors?.[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const addToCart = () => {
    addItem(product.id, quantity, size || undefined, color || undefined);
    pushToast(`Added to cart: ${product.name}`);
  };

  return (
    <div className="flex flex-col gap-5">
      {product.variants?.colors && (
        <OptionGroup label="Colour" options={product.variants.colors} value={color} onChange={setColor} />
      )}
      {product.variants?.sizes && (
        <OptionGroup label="Size" options={product.variants.sizes} value={size} onChange={setSize} />
      )}
      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper label="Quantity" value={quantity} max={Math.min(99, Math.max(1, product.stock))} onChange={setQuantity} />
        <p className={cn('text-sm font-medium', outOfStock ? 'text-danger' : lowStock ? 'text-warning' : 'text-success')}>
          {outOfStock ? 'Out of stock' : lowStock ? `Only ${product.stock} left` : 'In stock'}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" variant="outline" disabled={outOfStock} onClick={addToCart}>Add to cart</Button>
        <Button
          size="lg"
          variant="secondary"
          disabled={outOfStock}
          onClick={() => {
            addItem(product.id, quantity, size || undefined, color || undefined);
            router.push('/checkout');
          }}
        >
          Buy now
        </Button>
      </div>
    </div>
  );
}
