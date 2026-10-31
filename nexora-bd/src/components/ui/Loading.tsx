import { cn } from '@/utils/cn';

export function Spinner({ label = 'Loading...', className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn('inline-flex items-center gap-3 text-sm text-muted', className)}>
      <svg className="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-line', className)} />;
}
