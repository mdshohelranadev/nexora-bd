export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s-]/g, '');
}

export function validatePhone(value: string): string | null {
  const phone = normalizePhone(value);
  if (!phone) return 'Enter your mobile number.';
  if (!BD_PHONE_REGEX.test(phone)) return 'Use an 11 digit number starting with 013 to 019.';
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Enter your email address.';
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address.';
  return null;
}
