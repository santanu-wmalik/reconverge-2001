export function isRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value) {
  return /^[+]?[\d\s-]{10,15}$/.test(value);
}

export function minLength(value, min) {
  return typeof value === 'string' && value.trim().length >= min;
}

export function maxLength(value, max) {
  return typeof value === 'string' && value.trim().length <= max;
}

export function validateField(value, rules) {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
}

export const required = (msg = 'This field is required') => (value) =>
  isRequired(value) ? null : msg;

export const email = (msg = 'Invalid email address') => (value) =>
  !value || isEmail(value) ? null : msg;

export const phone = (msg = 'Invalid phone number') => (value) =>
  !value || isPhone(value) ? null : msg;

export const min = (n, msg) => (value) =>
  !value || minLength(value, n) ? null : msg || `Must be at least ${n} characters`;

export const max = (n, msg) => (value) =>
  !value || maxLength(value, n) ? null : msg || `Must be at most ${n} characters`;
