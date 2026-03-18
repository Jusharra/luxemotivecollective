export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').substring(0, 10);
  if (d.length >= 7) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length >= 4) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length >= 1) return `(${d}`;
  return '';
}

export function normalizePhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  return d.length === 11 ? `+${d}` : `+1${d}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const d = phone.replace(/\D/g, '');
  return d.length === 10 || (d.length === 11 && d[0] === '1');
}
