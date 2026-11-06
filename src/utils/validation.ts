/**
 * Sign-in field validation. Error copy follows the design's States board
 * (Onboard-States.dc.html): "Enter a 10-digit mobile number" and
 * "Enter a valid email, like name@example.com".
 */

// ── Mobile number (India, +91) ──────────────────────────────────────────

/**
 * Turns whatever was typed or pasted into at most 10 national digits.
 * Drops letters, spaces and symbols, a pasted +91 / 91 country code and a
 * leading 0 trunk prefix ("+91 98765 43210", "098765 43210" → "9876543210").
 */
export function normalizeMobile(text: string): string {
  let digits = text.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

/** "9876543210" → "98765 43210" (partial input is grouped the same way). */
export function formatMobile(digits: string): string {
  return digits.length > 5
    ? `${digits.slice(0, 5)} ${digits.slice(5)}`
    : digits;
}

/** Error message for a normalised number, or null when it is valid. */
export function mobileError(digits: string): string | null {
  if (!/^\d{10}$/.test(digits)) {
    return 'Enter a 10-digit mobile number';
  }
  if (!/^[6-9]/.test(digits)) {
    return 'Mobile numbers start with 6, 7, 8 or 9';
  }
  return null;
}

// ── Email ──────────────────────────────────────────────────────────────

/** Email addresses never contain whitespace, so it is dropped as typed. */
export function normalizeEmail(text: string): string {
  return text.replace(/\s/g, '');
}

const LOCAL_PART = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
const DOMAIN_LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

/**
 * Practical address check: one "@", a local part without leading, trailing
 * or doubled dots, and a domain of valid labels ending in a 2+ letter TLD.
 */
export function isValidEmail(email: string): boolean {
  if (email.length > 254) {
    return false;
  }
  const at = email.indexOf('@');
  if (at < 1 || at !== email.lastIndexOf('@')) {
    return false;
  }
  const local = email.slice(0, at);
  const labels = email.slice(at + 1).split('.');
  if (
    local.length > 64 ||
    !LOCAL_PART.test(local) ||
    local.startsWith('.') ||
    local.endsWith('.') ||
    local.includes('..')
  ) {
    return false;
  }
  return (
    labels.length >= 2 &&
    labels.every(label => DOMAIN_LABEL.test(label)) &&
    /^[A-Za-z]{2,}$/.test(labels[labels.length - 1])
  );
}

/** Error message for an email address, or null when it is valid. */
export function emailError(email: string): string | null {
  return isValidEmail(email)
    ? null
    : 'Enter a valid email, like name@example.com';
}
