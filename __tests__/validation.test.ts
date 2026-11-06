import {
  emailError,
  formatMobile,
  isValidEmail,
  mobileError,
  normalizeEmail,
  normalizeMobile,
} from '../src/utils/validation';

describe('normalizeMobile', () => {
  it('keeps digits only', () => {
    expect(normalizeMobile('98XXX rrrrXX210')).toBe('98210');
    expect(normalizeMobile('98765-43210')).toBe('9876543210');
  });

  it('drops a pasted +91 or 0 prefix', () => {
    expect(normalizeMobile('+91 98765 43210')).toBe('9876543210');
    expect(normalizeMobile('919876543210')).toBe('9876543210');
    expect(normalizeMobile('09876543210')).toBe('9876543210');
  });

  it('caps at 10 digits', () => {
    expect(normalizeMobile('98765432101')).toBe('9876543210');
  });
});

describe('formatMobile', () => {
  it('groups as 5 + 5', () => {
    expect(formatMobile('98765')).toBe('98765');
    expect(formatMobile('987654')).toBe('98765 4');
    expect(formatMobile('9876543210')).toBe('98765 43210');
  });
});

describe('mobileError', () => {
  it('accepts 10-digit numbers starting 6–9', () => {
    expect(mobileError('9876543210')).toBeNull();
    expect(mobileError('6000000000')).toBeNull();
  });

  it('rejects short numbers', () => {
    expect(mobileError('')).toBe('Enter a 10-digit mobile number');
    expect(mobileError('987654321')).toBe('Enter a 10-digit mobile number');
  });

  it('rejects numbers that cannot be Indian mobiles', () => {
    expect(mobileError('1234567890')).toBe(
      'Mobile numbers start with 6, 7, 8 or 9',
    );
    expect(mobileError('5876543210')).toBe(
      'Mobile numbers start with 6, 7, 8 or 9',
    );
  });
});

describe('email', () => {
  it.each([
    'aarav@example.com',
    'a.k+food@mail.co.in',
    'first_last@sub-domain.example.org',
    "o'neil@example.io",
  ])('accepts %s', email => {
    expect(isValidEmail(email)).toBe(true);
    expect(emailError(email)).toBeNull();
  });

  it.each([
    'rew',
    'aarav@example',
    'aarav@',
    '@example.com',
    'aarav@@example.com',
    'aa@rav@example.com',
    '.aarav@example.com',
    'aarav.@example.com',
    'aa..rav@example.com',
    'aarav@-example.com',
    'aarav@example..com',
    'aarav@example.c',
    'aarav@example.c0m',
    'aa rav@example.com',
  ])('rejects %s', email => {
    expect(isValidEmail(email)).toBe(false);
    expect(emailError(email)).toBe(
      'Enter a valid email, like name@example.com',
    );
  });

  it('strips spaces as you type', () => {
    expect(normalizeEmail(' aarav @example.com ')).toBe('aarav@example.com');
  });
});
