'use client';

import { MinusIcon, PlusIcon } from '@/components/icons';

export function QuantityStepper({ value, onChange, min = 1, max = 99, label }: { value: number; onChange: (value: number) => void; min?: number; max?: number; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex h-11 items-center rounded-md border border-line bg-surface">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="grid h-11 w-11 place-items-center rounded-l-md text-ink transition hover:bg-canvas disabled:opacity-40"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span aria-live="polite" className="min-w-[40px] text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid h-11 w-11 place-items-center rounded-r-md text-ink transition hover:bg-canvas disabled:opacity-40"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
