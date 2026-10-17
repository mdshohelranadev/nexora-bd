// components/website/product-card.tsx

'use client';

import Link from 'next/link';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWebCart } from '@/lib/store/web-cart-store';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
  /** Show quick-add button on hover (default true) */
  quickAdd?: boolean;
  className?: string;
}

export function WebsiteProductCard({
  product,
  quickAdd = true,
  className,
}: Props) {
  const cart = useWebCart();
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= product.minStock;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    cart.add(product);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <Card
      className={cn(
        'overflow-hidden group hover:shadow-md transition-all flex flex-col',
        className
      )}
    >
      <Link href={`/product/${product.id}`} className="flex flex-col flex-1">
        {/* Image / placeholder */}
        <div className="relative aspect-square bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-indigo-500/10 flex items-center justify-center overflow-hidden">
          <div className="text-4xl font-bold text-indigo-500/30 select-none">
            {product.name.slice(0, 2).toUpperCase()}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {outOfStock && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-5">
                Out
              </Badge>
            )}
            {lowStock && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0.5 h-5 bg-amber-500/15 text-amber-700 dark:text-amber-400 border-0"
              >
                Low
              </Badge>
            )}
            {product.grade === 'A' && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0.5 h-5 bg-purple-500/15 text-purple-700 dark:text-purple-400 border-0"
              >
                Premium
              </Badge>
            )}
          </div>

          {/* Quick add */}
          {quickAdd && !outOfStock && (
            <Button
              size="icon"
              onClick={handleAdd}
              className={cn(
                'absolute bottom-2 right-2 h-9 w-9 rounded-full shadow-md',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {product.brand}
          </div>
          <div className="text-sm font-medium leading-snug line-clamp-2 mt-0.5 min-h-[2.4em] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </div>

          {/* Rating mock */}
          <div className="flex items-center gap-1 mt-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'h-3 w-3',
                  s <= 4
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground/40'
                )}
              />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">(24)</span>
          </div>

          {/* Stock info */}
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
            <Package className="h-3 w-3" />
            {outOfStock ? (
              <span className="text-red-500 font-medium">Out of stock</span>
            ) : (
              <span>
                {product.stock} {product.unit} available
              </span>
            )}
          </div>

          <div className="flex-1" />

          {/* Price + Add */}
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
            <div className="text-base font-bold tabular-nums">
              {formatCurrency(product.sellingPrice)}
            </div>
            {quickAdd && (
              <Button
                size="sm"
                variant={outOfStock ? 'outline' : 'default'}
                disabled={outOfStock}
                onClick={handleAdd}
                className="h-8 text-xs md:hidden"
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}