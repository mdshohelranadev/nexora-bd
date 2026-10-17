// components/inventory/stock-form.tsx

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProductStore } from '@/lib/store/product-store';
import { useStockStore } from '@/lib/store/stock-store';
import { cn } from '@/lib/utils';
import type { MovementType } from '@/lib/types';

type Mode = 'stock-in' | 'stock-out' | 'adjustment';

interface Props {
  mode: Mode;
}

const COPY: Record<Mode, { title: string; subtitle: string; type: MovementType; signedLabel: string }> = {
  'stock-in': {
    title: 'Stock In',
    subtitle: 'Add incoming stock to a product.',
    type: 'stock-in',
    signedLabel: 'Quantity to add',
  },
  'stock-out': {
    title: 'Stock Out',
    subtitle: 'Remove stock from a product.',
    type: 'stock-out',
    signedLabel: 'Quantity to remove',
  },
  adjustment: {
    title: 'Stock Adjustment',
    subtitle: 'Set the final stock level to a specific number.',
    type: 'adjustment',
    signedLabel: 'New stock value',
  },
};

export function StockForm({ mode }: Props) {
  const products = useProductStore((s) => s.products);
  const record = useStockStore((s) => s.record);
  const copy = COPY[mode];

  const [productId, setProductId] = useState<string>('');
  const [qty, setQty] = useState<string>('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selected = products.find((p) => p.id === productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast.error('Select a product');
      return;
    }
    const q = Number(qty);
    if (!q || q <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    if (mode === 'stock-out' && q > selected.stock) {
      toast.error(`Only ${selected.stock} units available`);
      return;
    }
    if (mode === 'adjustment' && reason.trim().length < 3) {
      toast.error('Reason is required for adjustment');
      return;
    }

    setSubmitting(true);
    try {
      let delta = 0;
      if (mode === 'stock-in') delta = q;
      else if (mode === 'stock-out') delta = -q;
      else delta = q - selected.stock; // adjustment to target

      if (delta === 0) {
        toast.info('Stock level unchanged');
        setSubmitting(false);
        return;
      }

      record({
        productId: selected.id,
        type: copy.type,
        qty: delta,
        reference: reference.trim() || `${copy.type.toUpperCase()}-${Date.now().toString().slice(-6)}`,
        note: reason.trim() || undefined,
        user: 'current-user',
      });

      toast.success(`${copy.title} recorded for ${selected.name}`);
      setQty('');
      setReason('');
      setReference('');
      setProductId('');
    } catch {
      toast.error('Failed to record movement');
    } finally {
      setSubmitting(false);
    }
  };

  const Icon = mode === 'stock-in' ? ArrowDownToLine : mode === 'stock-out' ? ArrowUpFromLine : SlidersHorizontal;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon className="h-4 w-4 text-indigo-500" />
              {copy.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{copy.subtitle}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Product *</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span className="truncate">{p.name}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {p.stock} {p.unit}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selected && (
                <div className="rounded-lg border bg-muted/40 p-3 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-muted-foreground">SKU</div>
                    <div className="font-medium mt-0.5">{selected.sku}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Stock</div>
                    <div className="font-semibold tabular-nums mt-0.5">
                      {selected.stock} {selected.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Min Stock</div>
                    <div className="font-medium tabular-nums mt-0.5">
                      {selected.minStock}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="qty">
                    {copy.signedLabel} *
                  </Label>
                  <Input
                    id="qty"
                    type="number"
                    min={mode === 'adjustment' ? 0 : 1}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder={mode === 'adjustment' ? String(selected?.stock ?? 0) : '0'}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Optional e.g. INV-1234, ADJ-001"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reason">
                  {mode === 'adjustment' ? 'Reason *' : 'Note'}
                </Label>
                <Textarea
                  id="reason"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    mode === 'adjustment'
                      ? 'e.g. Damaged in transit / Found in stock count'
                      : 'Optional note'
                  }
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button type="submit" disabled={submitting || !selected}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Record {copy.title}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setProductId('');
                    setQty('');
                    setReason('');
                    setReference('');
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selected ? (
              <div className="text-xs text-muted-foreground text-center py-6">
                Select a product to preview
              </div>
            ) : (
              <>
                <div className="text-sm font-medium truncate">{selected.name}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Current</span>
                  <span className="tabular-nums font-medium">
                    {selected.stock} {selected.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Change</span>
                  <span
                    className={cn(
                      'tabular-nums font-medium',
                      (() => {
                        const q = Number(qty);
                        if (!q) return '';
                        let d = 0;
                        if (mode === 'stock-in') d = q;
                        else if (mode === 'stock-out') d = -q;
                        else d = q - selected.stock;
                        return d > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : d < 0
                          ? 'text-red-600 dark:text-red-400'
                          : '';
                      })()
                    )}
                  >
                    {(() => {
                      const q = Number(qty);
                      if (!q) return '—';
                      let d = 0;
                      if (mode === 'stock-in') d = q;
                      else if (mode === 'stock-out') d = -q;
                      else d = q - selected.stock;
                      return d > 0 ? `+${d}` : d;
                    })()}
                  </span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New stock</span>
                  <span className="tabular-nums font-bold">
                    {(() => {
                      const q = Number(qty);
                      if (!q) return selected.stock;
                      let next = selected.stock;
                      if (mode === 'stock-in') next += q;
                      else if (mode === 'stock-out') next -= q;
                      else next = q;
                      return Math.max(0, next);
                    })()}{' '}
                    {selected.unit}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}