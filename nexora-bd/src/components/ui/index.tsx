'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store/uiStore';
import { AlertIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, InfoIcon, StarIcon, XCircleIcon } from '@/components/icons';

/* Button */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-600 shadow-sm',
  secondary: 'bg-accent text-ink hover:bg-accent-600',
  outline: 'border border-primary text-primary hover:bg-primary-50',
  ghost: 'text-ink hover:bg-canvas',
  danger: 'bg-danger text-white hover:bg-red-700',
  icon: 'text-ink hover:bg-canvas rounded-full',
};

const buttonSizes: Record<ButtonSize | 'icon', string> = {
  sm: 'h-11 px-3 text-sm min-w-[44px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-11 w-11',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'primary', size = 'md', loading = false, fullWidth = false, className, children, disabled, type = 'button', ...rest }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[variant === 'icon' ? 'icon' : size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
});

/* Badge */
type BadgeVariant = 'default' | 'accent' | 'success' | 'danger' | 'outline';
const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-primary-50 text-primary',
  accent: 'bg-accent text-ink',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
  outline: 'border border-line text-muted',
};

export function Badge({ variant = 'default', className, children }: { variant?: BadgeVariant; className?: string; children: ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-sm px-2 py-1 text-xs font-semibold', badgeVariants[variant], className)}>{children}</span>;
}

/* Rating */
export function Rating({ value, count, size = 'md', showCount = true }: { value: number; count?: number; size?: 'sm' | 'md'; showCount?: boolean }) {
  const filled = Math.round(value);
  const starClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex text-accent">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={cn(starClass, i < filled ? 'fill-accent' : 'fill-none text-line')} />
        ))}
      </div>
      {showCount && count !== undefined && <span className="text-xs text-muted">({count})</span>}
    </div>
  );
}

/* Input, Select, Textarea */
interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  id?: string;
}

export function Input({ label, error, hint, id, className, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = [error ? `${inputId}-error` : null, hint ? `${inputId}-hint` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">{label}</label>
      <input
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={cn(
          'h-11 rounded-md border bg-surface px-3 text-sm text-ink placeholder:text-muted/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          error ? 'border-danger' : 'border-line hover:border-muted',
          className,
        )}
        {...rest}
      />
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-muted">{hint}</p>}
      {error && <p id={`${inputId}-error`} className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export function Select({ label, error, hint, id, options, placeholder, className, ...rest }: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder?: string }) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const describedBy = [error ? `${selectId}-error` : null, hint ? `${selectId}-hint` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-ink">{label}</label>
      <select
        id={selectId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={cn(
          'h-11 rounded-md border bg-surface px-3 text-sm text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          error ? 'border-danger' : 'border-line hover:border-muted',
          className,
        )}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && !error && <p id={`${selectId}-hint`} className="text-xs text-muted">{hint}</p>}
      {error && <p id={`${selectId}-error`} className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, id, className, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const areaId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={areaId} className="text-sm font-medium text-ink">{label}</label>
      <textarea
        id={areaId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${areaId}-error` : undefined}
        className={cn(
          'min-h-[120px] rounded-md border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          error ? 'border-danger' : 'border-line',
          className,
        )}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p id={`${areaId}-error`} className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

/* Checkbox and Radio */
export function Checkbox({ label, checked, onChange, id }: { label: string; checked: boolean; onChange: (checked: boolean) => void; id?: string }) {
  const autoId = useId();
  const boxId = id ?? autoId;
  return (
    <label htmlFor={boxId} className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-ink">
      <input id={boxId} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 cursor-pointer accent-primary" />
      {label}
    </label>
  );
}

export function Radio({ name, value, checked, onChange, label }: { name: string; value: string; checked: boolean; onChange: (value: string) => void; label: string }) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-ink">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="h-5 w-5 cursor-pointer accent-primary" />
      {label}
    </label>
  );
}

export function RadioCard({ name, value, checked, onChange, title, description, icon }: { name: string; value: string; checked: boolean; onChange: (value: string) => void; title: string; description: string; icon: ReactNode }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition hover:border-primary hover:shadow-card',
        checked ? 'border-primary bg-primary-50 ring-1 ring-primary' : 'border-line bg-surface',
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="mt-1 h-5 w-5 accent-primary" />
      <span className="flex flex-1 items-center gap-4">
        <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-surface">{icon}</span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink">{title}</span>
          <span className="text-xs text-muted">{description}</span>
        </span>
      </span>
    </label>
  );
}

/* Modal */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative w-full max-w-2xl rounded-xl bg-surface p-6 shadow-lift">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <Button ref={closeRef} variant="icon" aria-label="Close dialog" onClick={onClose}><CloseIcon className="h-5 w-5" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* Drawer */
export function Drawer({ open, onClose, side = 'right', title, children, footer }: { open: boolean; onClose: () => void; side?: 'left' | 'right'; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);
  return (
    <div className={cn('fixed inset-0 z-50', !open && 'pointer-events-none')} aria-hidden={!open}>
      <div className={cn('absolute inset-0 bg-ink/50 transition-opacity duration-200', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'absolute top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-lift transition-transform duration-300',
          side === 'right' ? 'right-0' : 'left-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <Button variant="icon" aria-label="Close panel" onClick={onClose}><CloseIcon className="h-5 w-5" /></Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4">{footer}</div>}
      </aside>
    </div>
  );
}

/* Tabs */
export function Tabs({ items }: { items: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const current = items.find((i) => i.id === active) ?? items[0];
  const onKey = (e: ReactKeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
    setActive(items[next].id);
  };
  return (
    <div>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-line scrollbar-hide">
        {items.map((item, index) => (
          <button
            key={item.id}
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={item.id === current?.id}
            aria-controls={`panel-${item.id}`}
            tabIndex={item.id === current?.id ? 0 : -1}
            onKeyDown={(e) => onKey(e, index)}
            onClick={() => setActive(item.id)}
            className={cn(
              'min-h-[44px] whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition',
              item.id === current?.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${current?.id}`} aria-labelledby={`tab-${current?.id}`} className="py-6">
        {current?.content}
      </div>
    </div>
  );
}

/* Dropdown */
export function Dropdown({ label, icon, children, align = 'right' }: { label: string; icon: ReactNode; children: ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div ref={ref} className="relative">
      <Button variant="icon" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {icon}
      </Button>
      {open && (
        <div role="menu" onClick={() => setOpen(false)} className={cn('absolute top-12 z-50 w-56 rounded-lg border border-line bg-surface p-2 shadow-lift', align === 'right' ? 'right-0' : 'left-0')}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} role="menuitem" className="flex min-h-[44px] items-center rounded-md px-3 text-sm text-ink hover:bg-canvas">
      {children}
    </Link>
  );
}

/* Toast */
const toastIcons = { success: CheckIcon, info: InfoIcon, warning: AlertIcon, danger: XCircleIcon };
const toastTone = {
  success: 'text-success',
  info: 'text-primary',
  warning: 'text-warning',
  danger: 'text-danger',
};

export function ToastViewport() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2">
      <AnimatePresence initial={false}>{toasts.map((t) => {
        const Icon = toastIcons[t.variant];
        return (
          <motion.div key={t.id} role="status" initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2 }} className="pointer-events-auto flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 shadow-lift">
            <Icon className={cn('h-5 w-5 shrink-0', toastTone[t.variant])} />
            <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="grid h-11 w-11 -mr-2 place-items-center rounded-full text-muted hover:text-ink">
              <CloseIcon className="h-4 w-4" />
            </button>
          </motion.div>
        );
      })}</AnimatePresence>
    </div>
  );
}

/* Skeleton */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />;
}

/* EmptyState */
export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-surface px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-50 text-primary">{icon}</div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* Breadcrumb */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.href ? <Link href={item.href} className="rounded-sm hover:text-primary">{item.label}</Link> : <span aria-current="page" className="font-medium text-ink">{item.label}</span>}
            {i < items.length - 1 && <ChevronRightIcon className="h-4 w-4" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* Pagination */
export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      {pages.map((p) => (
        <Button key={p} variant={p === page ? 'primary' : 'ghost'} size="sm" aria-current={p === page ? 'page' : undefined} aria-label={`Page ${p}`} onClick={() => onPageChange(p)}>
          {p}
        </Button>
      ))}
      <Button variant="outline" size="sm" aria-label="Next page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </nav>
  );
}

