import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { ff } from '../theme/fonts';
import { em, type } from '../theme/type';
import { Icon } from './Icon';
import { Span, Text } from './Text';

/* ───────────── Veg / non-veg mark (07.2) ───────────── */

/**
 * 14px FSSAI mark. Veg = Leaf square + dot; non-veg = Chili square + triangle.
 * Inline before a name: 6px gap, 3px down (pass `style={{ marginTop: 3 }}`).
 */
export function DietMark({
  type: diet,
  style,
  size = 14,
}: {
  type: 'veg' | 'nonveg';
  style?: StyleProp<ViewStyle>;
  size?: number;
}) {
  const c = diet === 'veg' ? colors.leaf : colors.chili;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={diet === 'veg' ? 'Veg' : 'Non-veg'}
      style={[
        styles.mark,
        { borderColor: c, width: size, height: size },
        style,
      ]}
    >
      {diet === 'veg' ? (
        <View style={[styles.dot, { backgroundColor: c }]} />
      ) : (
        <Svg width={8} height={7} viewBox="0 0 8 7">
          <Path d="M4 0 L8 7 L0 7 Z" fill={c} />
        </Svg>
      )}
    </View>
  );
}

/* ───────────── kcal number (07.1) ───────────── */

const KCAL_SIZES = {
  /** kcal-M · 20/24 800 −0.01em, unit 12 700 */
  M: { fontSize: 20, lineHeight: 24, tracking: -0.01, unit: 12 },
  /** 18/24 800 (cart bar, pay bar) */
  S: { fontSize: 18, lineHeight: 24, tracking: -0.01, unit: 12 },
  /** Numeral-L · 32/36 */
  L: { fontSize: 32, lineHeight: 36, tracking: -0.02, unit: 14 },
  /** Numeral-XL · 44/44 */
  XL: { fontSize: 44, lineHeight: 44, tracking: -0.02, unit: 16 },
} as const;

/**
 * "420kcal" with the unit 12px 700 and a 2px gap.
 * `unit` can carry a basis: "kcal/100 g", "kcal/egg", "kcal/serving".
 */
export function Kcal({
  value,
  unit = 'kcal',
  size = 'M',
  color = colors.turmericDeep,
  unitStyle,
  style,
}: {
  value: string | number;
  unit?: string;
  size?: keyof typeof KCAL_SIZES;
  color?: string;
  unitStyle?: StyleProp<TextStyle>;
  style?: StyleProp<TextStyle>;
}) {
  const s = KCAL_SIZES[size];
  return (
    <Text
      style={[
        ff('display', 800),
        {
          fontSize: s.fontSize,
          lineHeight: s.lineHeight,
          letterSpacing: em(s.tracking, s.fontSize),
          color,
        },
        style,
      ]}
    >
      {value}
      {unit ? (
        <Span style={[styles.unit, { fontSize: s.unit }, unitStyle]}>
          {/* thin space ≈ the guideline's 2px gap at 12px */}
          {' '}
          {unit}
        </Span>
      ) : null}
    </Text>
  );
}

/* ───────────── Badge · 24 (07.3) ───────────── */

const BADGE_TONES = {
  protein: { bg: colors.proteinMist, fg: colors.proteinBlue },
  kcal: { bg: colors.kcalCream, fg: colors.turmericDeep },
  leaf: { bg: colors.leafMist, fg: colors.leaf },
  chili: { bg: colors.chiliMist, fg: colors.chili },
  stone: { bg: colors.stone, fg: colors.ink2 },
  white: { bg: colors.surface, fg: colors.turmericDeep },
  dark: { bg: colors.forestInk, fg: '#FFFFFF' },
} as const;

export type BadgeTone = keyof typeof BADGE_TONES;

/** Badge · 24 high, r999, padding 0 10, 12px 600, optional 16px icon. */
export function Badge({
  label,
  tone = 'protein',
  icon,
  style,
  children,
}: {
  label?: string;
  tone?: BadgeTone;
  icon?: Parameters<typeof Icon>[0]['name'];
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const t = BADGE_TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      {icon ? <Icon name={icon} size={16} color={t.fg} /> : null}
      {children ?? (
        <Text style={[styles.badgeText, { color: t.fg }]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </View>
  );
}

/* ───────────── Rating (Turmeric star, then the number) ───────────── */

export function Rating({
  value,
  meta,
  style,
}: {
  value: string;
  meta?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.rating, style]}>
      <Icon name="star" size={14} color={colors.turmeric} />
      <Text style={type.small}>
        <Span style={[ff('body', 600), { color: colors.forestInk }]}>
          {value}
        </Span>
        {meta ? ` · ${meta}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  unit: { ...ff('display', 700), letterSpacing: 0 },
  mark: {
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badge: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { ...ff('body', 600), fontSize: 12, lineHeight: 16 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
