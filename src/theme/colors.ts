/**
 * Calorie Corner colour tokens — copied exactly from the brand guidelines
 * (Brand guidelines · 03 Colour). Names match the guideline names.
 */
export const colors = {
  // Core
  paper: '#F6F3EC', // App background
  surface: '#FFFFFF', // Cards, inputs, sheets
  stone: '#EFEBE1', // Segmented track, icon tiles, Stone pills
  line: '#E6E1D5', // Card borders and dividers only
  lineStrong: '#8E8676', // Input, chip-off and secondary borders; radio rings
  forestInk: '#17231C', // Primary text, primary buttons, dark cards
  forestInkPressed: '#24342B', // Dark buttons lift to this when pressed
  ink2: '#46524B', // Secondary text and prices
  ink3: '#5F6A63', // Meta text — the lightest grey allowed

  // Brand
  turmeric: '#E3A63A', // Accent CTAs, progress, selected chips, kcal on dark
  turmericDeep: '#8A5200', // kcal on light, eyebrows, links on light
  kcalCream: '#FCEFD6', // kcal tiles, info banners
  wordmarkTurmeric: '#D4951F', // Logo on light grounds only. Never text or UI

  // Nutrition
  proteinBlue: '#2B5797', // Protein numbers, focus ring
  proteinMist: '#E3ECF8', // Protein tile background
  proteinOnDark: '#7FA6E0',

  // Charts
  chartOnTarget: '#B57B16',
  chartOver: '#B3261E',

  // Diet & status
  leaf: '#1E7B3C', // Veg mark, success, Fits your goal
  leafMist: '#E3F1E7', // Fit badge, success banner, diet chip on
  chili: '#B3261E', // Non-veg mark, errors, over-limit
  chiliMist: '#FBE6E4', // Warning and error banners

  // On Forest Ink
  onDarkMuted: '#B9C2BC', // Secondary text on Forest Ink

  // Image placeholders ("[dish photo]", "[logo]")
  placeholderWarm: '#EFE6D2',
  placeholderGreen: '#E8EDE4',
  placeholderIcon: '#8C7A57',
  placeholderText: '#6E5F42',

  // Map illustration
  mapBlock: '#D6E3CF',
  mapBlockLight: '#E1E7DC',
  mapLine: '#CFC8B8',

  // Dark-theme tokens (from the guidelines; screens are drawn light)
  dark: {
    bg: '#0F1713',
    surface: '#17231C',
    raised: '#1F2D25',
    line: '#2E3D34',
    text: '#F6F3EC',
    text2: '#B9C2BC',
    text3: '#8E9A93',
    kcal: '#E3A63A',
    protein: '#7FA6E0',
    leaf: '#5FBF7A',
    chili: '#F08A80',
  },

  // Translucent values used in the designs
  white14: 'rgba(255,255,255,0.14)',
  white12: 'rgba(255,255,255,0.12)',
  white08: 'rgba(255,255,255,0.08)',
  scrim: 'rgba(23,35,28,0.45)',
} as const;

/** Elevation levels (08 · Interaction → Elevation). */
export const shadows = {
  e1: '0 1px 2px rgba(23,35,28,0.12)',
  e2: '0 8px 24px rgba(23,35,28,0.18)',
} as const;

export type ColorName = keyof typeof colors;
