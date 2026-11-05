/**
 * Pieces shared by the product detail screens (Meal, Item) and the
 * Product states board. Kept local to these three screens.
 */
import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type AccessibilityRole,
  type AccessibilityState,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DietMark, Icon, Kcal, Tap, Text, type IconName } from '../../components';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';

/* ───────────── Hero ───────────── */

/**
 * 44px white circle drawn over the hero photo (no border), at
 * top 12 + inset, 16 from the side.
 */
export function HeroButton({
  icon,
  iconSize = 22,
  side = 'left',
  onPress,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
}: {
  icon: IconName;
  iconSize?: number;
  side?: 'left' | 'right';
  onPress?: () => void;
  accessibilityLabel: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Tap
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      style={[
        styles.heroButton,
        side === 'left' ? styles.heroLeft : styles.heroRight,
        { top: 12 + insets.top },
      ]}
    >
      <Icon name={icon} size={iconSize} color={colors.forestInk} />
    </Tap>
  );
}

/**
 * Paper sheet that overlaps the hero by 24px: r24 top corners,
 * padding 24 20 <paddingBottom>.
 */
export function DetailSheet({
  children,
  paddingBottom,
}: {
  children: ReactNode;
  paddingBottom: number;
}) {
  return <View style={[styles.sheet, { paddingBottom }]}>{children}</View>;
}

/** Meta line (13/18 500 Ink-3), then the veg mark + H1 name. */
export function DetailTitle({ meta, title }: { meta: string; title: string }) {
  return (
    <>
      <Text style={styles.meta}>{meta}</Text>
      <View style={styles.titleRow}>
        <DietMark type="veg" style={styles.titleMark} />
        <Text style={[type.h1, styles.title]} accessibilityRole="header">
          {title}
        </Text>
      </View>
    </>
  );
}

/* ───────────── Section heading ───────────── */

/** H3 section title, optionally with a 13/18 Ink-3 hint on the right. */
export function SectionTitle({
  title,
  hint,
  style,
}: {
  title: string;
  hint?: string;
  style?: StyleProp<ViewStyle>;
}) {
  if (!hint) {
    return (
      <View style={style}>
        <Text style={type.h3} accessibilityRole="header">
          {title}
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.sectionTitleRow, style]}>
      <Text style={type.h3} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.sectionHint}>{hint}</Text>
    </View>
  );
}

/* ───────────── Radio / checkbox indicators ───────────── */

/**
 * 24px indicator. Radio off: 1.5px Line Strong ring; on: Forest Ink disc.
 * Checkbox: r7 (off ring / on fill). 14px white check at `checkStroke`.
 */
export function Indicator({
  kind,
  on,
  checkStroke,
}: {
  kind: 'radio' | 'checkbox';
  on: boolean;
  checkStroke: number;
}) {
  const shape = kind === 'checkbox' ? styles.indicatorBox : null;
  if (!on) {
    return <View style={[styles.indicatorOff, shape]} />;
  }
  return (
    <View style={[styles.indicatorOn, shape]}>
      <Icon name="check" size={14} color="#FFFFFF" strokeWidth={checkStroke} />
    </View>
  );
}

/* ───────────── Option row (portion / add-on / diet) ───────────── */

/**
 * Selectable row: white, r18, gap 14. Off: 1px Line, padding 14 16.
 * Selected radio: 2px Forest Ink, padding 13 15 (checkbox rows keep
 * the 1px Line border when checked). Optional kcal (72px, right) and
 * price (44px, right) columns, both tabular.
 */
export function OptionRow({
  title,
  subtitle,
  subtitleGap = 0,
  selected,
  onPress,
  kind = 'radio',
  checkStroke,
  minHeight = 60,
  kcal,
  price,
}: {
  title: string;
  subtitle?: string;
  subtitleGap?: number;
  selected: boolean;
  onPress?: () => void;
  kind?: 'radio' | 'checkbox';
  checkStroke?: number;
  minHeight?: number;
  kcal?: string;
  price?: string;
}) {
  const ring = selected && kind === 'radio';
  return (
    <Tap
      accessibilityRole={kind}
      accessibilityState={
        kind === 'checkbox' ? { checked: selected } : { selected }
      }
      onPress={onPress}
      pressScale={0.99}
      style={[styles.row, { minHeight }, ring ? styles.rowOn : styles.rowOff]}
    >
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, { marginTop: subtitleGap }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {kcal ? (
        <Kcal
          value={kcal}
          style={styles.rowKcal}
          unitStyle={styles.rowKcalUnit}
        />
      ) : null}
      {price ? <Text style={styles.rowPrice}>{price}</Text> : null}
      <Indicator
        kind={kind}
        on={selected}
        checkStroke={checkStroke ?? (kind === 'checkbox' ? 2.2 : 2.6)}
      />
    </Tap>
  );
}

/* ───────────── Bottom-bar add button ───────────── */

/**
 * Forest Ink 52px r14 link: label (Inter 600 white), then the kcal
 * (Schibsted 18/24 800 Turmeric, unit 12 700) 10px after, then the price
 * (14 500 On-dark muted) 6px after.
 */
export function AddBarButton({
  label,
  labelSize,
  kcal,
  unit = 'kcal',
  price,
  onPress,
  style,
}: {
  label: string;
  labelSize: number;
  kcal: string;
  unit?: string;
  price: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      accessibilityRole="link"
      onPress={onPress}
      pressedBackground={colors.forestInkPressed}
      style={[styles.addBar, style]}
    >
      <Text style={[styles.addBarLabel, { fontSize: labelSize }]} numberOfLines={1}>
        {label}
      </Text>
      <Kcal
        value={kcal}
        unit={unit}
        size="S"
        color={colors.turmeric}
        style={styles.addBarKcal}
      />
      <Text style={styles.addBarPrice} numberOfLines={1}>
        {price}
      </Text>
    </Tap>
  );
}

const styles = StyleSheet.create({
  heroButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLeft: { left: 16 },
  heroRight: { right: 16 },
  sheet: {
    zIndex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.paper,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  meta: { ...ff('body', 500), fontSize: 13, lineHeight: 18, color: colors.ink3 },
  titleRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  titleMark: { marginTop: 11 },
  title: { flexShrink: 1 },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionHint: { fontSize: 13, lineHeight: 18, color: colors.ink3 },
  indicatorOff: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
  },
  indicatorOn: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.forestInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorBox: { borderRadius: 7 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  rowOff: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowOn: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: colors.forestInk,
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { ...ff('body', 600), fontSize: 16, lineHeight: 22, color: colors.forestInk },
  rowSubtitle: { fontSize: 13, lineHeight: 18, color: colors.ink3 },
  rowKcal: { width: 72, textAlign: 'right', fontVariant: ['tabular-nums'] },
  // The unit inherits the number's −0.01em tracking here (not reset to 0).
  rowKcalUnit: { letterSpacing: em(-0.01, 20) },
  rowPrice: {
    ...ff('body', 600),
    width: 44,
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink2,
    fontVariant: ['tabular-nums'],
  },
  addBar: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.forestInk,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBarLabel: { ...ff('body', 600), color: '#FFFFFF' },
  addBarKcal: { marginLeft: 10 },
  addBarPrice: { ...ff('body', 500), marginLeft: 6, fontSize: 14, color: colors.onDarkMuted },
});
