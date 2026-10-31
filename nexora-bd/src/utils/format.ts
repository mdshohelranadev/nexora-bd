export function formatBDT(amount: number): string {
  return `৳ ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
