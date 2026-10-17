// components/dashboard/stat-card.tsx

'use client';

import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  value: number | string;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  /** Percentage change vs. previous period. Positive = up, negative = down */
  delta?: number;
  variant?: 'indigo' | 'emerald' | 'amber' | 'red' | 'blue' | 'purple' | 'cyan' | 'zinc';
  subtitle?: string;
  animate?: boolean;
  format?: 'currency' | 'number' | 'raw';
  className?: string;
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  red: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400' },
  zinc: { bg: 'bg-zinc-500/10', text: 'text-zinc-600 dark:text-zinc-400' },
};

/** Format Indian-style currency inline for count-up */
function formatBDT(n: number) {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded).toString();
  let formatted: string;
  if (abs.length <= 3) formatted = abs;
  else {
    const last3 = abs.slice(-3);
    const rest = abs.slice(0, -3);
    formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  return `${sign}৳${formatted}`;
}

function formatNum(n: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

export function StatCard({
  title,
  value,
  icon: Icon,
  prefix = '',
  suffix = '',
  delta,
  variant = 'indigo',
  subtitle,
  animate = true,
  format = 'currency',
  className,
}: Props) {
  const isNumeric = typeof value === 'number';
  const [display, setDisplay] = useState(isNumeric && animate ? 0 : value);

  useEffect(() => {
    if (!isNumeric || !animate) return;
    const target = value as number;
    const duration = 700;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, animate, isNumeric]);

  const styles = variantStyles[variant];

  const rendered = (() => {
    if (!isNumeric) return `${prefix}${value}${suffix}`;
    const n = typeof display === 'number' ? display : 0;
    if (format === 'currency') return formatBDT(n);
    if (format === 'number') return prefix + formatNum(n) + suffix;
    return `${prefix}${n}${suffix}`;
  })();

  return (
    <Card className={cn('overflow-hidden hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground truncate">
              {title}
            </div>
            <div className="mt-2 text-xl md:text-2xl font-bold tabular-nums tracking-tight truncate">
              {rendered}
            </div>
            {(subtitle || typeof delta === 'number') && (
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                {typeof delta === 'number' && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 font-medium',
                      delta >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {delta >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(delta).toFixed(1)}%
                  </span>
                )}
                {subtitle && (
                  <span className="text-muted-foreground truncate">{subtitle}</span>
                )}
              </div>
            )}
          </div>
          <div
            className={cn(
              'h-10 w-10 shrink-0 rounded-lg flex items-center justify-center',
              styles.bg
            )}
          >
            <Icon className={cn('h-5 w-5', styles.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}