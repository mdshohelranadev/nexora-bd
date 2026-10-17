// lib/format.ts

import { format as formatDateFns, parseISO } from 'date-fns';

/**
 * Format currency in BDT style: ৳1,00,000
 * Uses Indian/Bangladeshi numbering (lakh/crore grouping)
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '৳0';
  const num = Math.round(amount);
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num).toString();
  // Indian grouping: last 3 digits, then 2 digits each
  let formatted: string;
  if (abs.length <= 3) {
    formatted = abs;
  } else {
    const last3 = abs.slice(-3);
    const rest = abs.slice(0, -3);
    formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  return `${sign}৳${formatted}`;
}

/** Format number with thousand separators (Western style) */
export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

/** Format date: 12 Oct 2026 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDateFns(d, 'dd MMM yyyy');
  } catch {
    return '—';
  }
}

/** Format date+time: 12 Oct 2026, 14:30 */
export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDateFns(d, 'dd MMM yyyy, HH:mm');
  } catch {
    return '—';
  }
}

/** Short date: 12 Oct */
export function formatDateShort(date: string | Date | undefined | null): string {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDateFns(d, 'dd MMM');
  } catch {
    return '—';
  }
}

/** ISO date string: 2026-10-12 */
export function toISODate(date: Date = new Date()): string {
  return date.toISOString();
}

/** Get initials from name */
export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Truncate long text */
export function truncate(text: string, len = 40): string {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '...' : text;
}

/** Percentage */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}