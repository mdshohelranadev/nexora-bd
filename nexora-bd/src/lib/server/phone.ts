// Bangladesh mobile: 11 digits starting 013-019, or with country code 88 prefix.
export function normalizeBdPhone(raw: string): string | null {
  const digits = (raw || '').replace(/\D/g, '');
  const local = digits.startsWith('880') ? digits.slice(2) : digits.startsWith('88') ? digits.slice(2) : digits;
  if (!/^01[3-9]\d{8}$/.test(local)) return null;
  return local; // stored as 01XXXXXXXXX
}

// WhatsApp needs international format without +: 8801XXXXXXXXX
export function toWhatsAppNumber(local: string): string {
  return `88${local}`;
}
