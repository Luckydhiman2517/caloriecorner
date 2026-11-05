import type { TextStyle } from 'react-native';
import { colors } from './colors';
import { ff } from './fonts';

/** CSS `em` letter-spacing → React Native px. */
export const em = (value: number, fontSize: number) => value * fontSize;

/**
 * Type scale from Brand guidelines · 04 Typography.
 * Sizes are fontSize / lineHeight · weight · tracking.
 */
export const type = {
  /** H1 · Schibsted 30/36 · 800 · −0.02em */
  h1: {
    ...ff('display', 800),
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: em(-0.02, 30),
    color: colors.forestInk,
  },
  /** H2 · Schibsted 22/28 · 700 · −0.01em */
  h2: {
    ...ff('display', 700),
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: em(-0.01, 22),
    color: colors.forestInk,
  },
  /** H3 · Schibsted 18/24 · 700 */
  h3: {
    ...ff('display', 700),
    fontSize: 18,
    lineHeight: 24,
    color: colors.forestInk,
  },
  /** Numeral-XL · 44/44 · 800 · −0.02em */
  numeralXL: {
    ...ff('display', 800),
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: em(-0.02, 44),
  },
  /** Numeral-L · 32/36 · 800 · −0.02em */
  numeralL: {
    ...ff('display', 800),
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: em(-0.02, 32),
  },
  /** kcal-M · 20/24 · 800 · −0.01em */
  kcalM: {
    ...ff('display', 800),
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: em(-0.01, 20),
    color: colors.turmericDeep,
  },
  /** kcal unit · 12px 700, 2px after the number */
  kcalUnit: {
    ...ff('display', 700),
    fontSize: 12,
    letterSpacing: 0,
  },
  /** Label · Inter 16/20 · 600 */
  label: {
    ...ff('body', 600),
    fontSize: 16,
    lineHeight: 20,
    color: colors.forestInk,
  },
  /** Body · Inter 15/22 · 400 */
  body: {
    ...ff('body', 400),
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink2,
  },
  /** UI · Inter 14/20 · 500 */
  ui: {
    ...ff('body', 500),
    fontSize: 14,
    lineHeight: 20,
    color: colors.forestInk,
  },
  /** Small · Inter 13/18 */
  small: {
    ...ff('body', 400),
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink3,
  },
  /** Caption · Inter 12/16 */
  caption: {
    ...ff('body', 400),
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
  },
  /** Eyebrow · JetBrains Mono 11/14 · 600 · 0.08em · caps */
  eyebrow: {
    ...ff('mono', 600),
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: em(0.08, 11),
    textTransform: 'uppercase',
    color: colors.turmericDeep,
  },
  /** Field label · Inter 13/18 · 600 · Ink-2 */
  fieldLabel: {
    ...ff('body', 600),
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink2,
  },
  /** Text link · Inter 14 · 600 · Turmeric Deep */
  link: {
    ...ff('body', 600),
    fontSize: 14,
    lineHeight: 20,
    color: colors.turmericDeep,
  },
  /** Price · Inter 14/20 · 600 · Ink-2 */
  price: {
    ...ff('body', 600),
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink2,
  },
} satisfies Record<string, TextStyle>;

/** Spacing (8px grid, 20px screen gutter). */
export const space = {
  half: 4,
  base: 8,
  item: 12,
  card: 16,
  gutter: 20,
  section: 28,
} as const;

/** Radius tokens. */
export const radius = {
  tile: 12, // Icon tiles, thumbnails under 64px
  control: 14, // Inputs, buttons, thumbnails ≥ 64px, toasts, banners
  card: 18, // Cards, radio rows
  float: 20, // Floating bars, goal card
  sheet: 24, // Sheet top corners
  pill: 999, // Chips, badges, pill buttons, steppers
} as const;
