/**
 * Pieces shared by the Cart screens (Cart, Checkout, Tracking, Cart states).
 * Every value is copied from the Cart-*.dc.html design files.
 */
import type { ReactNode } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  DietMark,
  Icon,
  Kcal,
  PhotoPlaceholder,
  Span,
  Tap,
  Text,
  type IconName,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';

/* ───────────── Shared styles ───────────── */

export const ui = StyleSheet.create({
  flex: { flex: 1 },
  /** White card · 1px Line · r18 */
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
  cardPad: { padding: 16 },
  /** 1px Line between list rows */
  rowTop: { borderTopWidth: 1, borderTopColor: colors.line },
  selfStart: { alignSelf: 'flex-start' },
  /** 13/18 Ink-3 meta line */
  meta13: { fontSize: 13, lineHeight: 18, color: colors.ink3 },
  /** 12/16 Ink-3 */
  meta12: { fontSize: 12, lineHeight: 16, color: colors.ink3 },
  /** Price · 14/20 600 Ink-2, tabular */
  price: { ...type.price, fontVariant: ['tabular-nums'] },
  tabular: { fontVariant: ['tabular-nums'] },
  /** Eyebrow in Ink-3 (state labels, "Order summary") */
  eyebrowMuted: { ...type.eyebrow, color: colors.ink3 },
});

/* ───────────── Link (14px 600 Turmeric Deep, 44px hit) ───────────── */

/**
 * Text link with an optional leading icon and an accessibility label
 * (the shared TextLink has no `accessibilityLabel` / leading slot).
 * Padding 0 8 / margin 0 −8 in the design → 8px side hit slop.
 */
export function Link({
  label,
  onPress,
  accessibilityLabel,
  left,
  color = colors.turmericDeep,
  textStyle,
  style,
}: {
  label: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  left?: ReactNode;
  color?: string;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={{ left: 8, right: 8 }}
      style={[s.link, style]}
    >
      {left}
      <Text style={[type.link, { color }, textStyle]}>{label}</Text>
    </Tap>
  );
}

/* ───────────── Pill · 24 (badges with a 6px icon gap) ───────────── */

/** 24 high, r999, padding 0 10, 12/16 600, 16px icon or 8px dot, gap 6. */
export function Pill({
  label,
  bg,
  fg,
  icon,
  dot,
  style,
}: {
  label: string;
  bg: string;
  fg: string;
  icon?: IconName;
  dot?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.pill, { backgroundColor: bg }, style]}>
      {icon ? <Icon name={icon} size={16} color={fg} /> : null}
      {dot ? <View style={[s.pillDot, { backgroundColor: dot }]} /> : null}
      <Text style={[s.pillText, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** "Not counted today" · Stone pill, Ink-3 text. */
export function NotCountedPill({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <Pill
      label="Not counted today"
      bg={colors.stone}
      fg={colors.ink3}
      style={[ui.selfStart, style]}
    />
  );
}

/** Leaf Mist pill with a check ("Fits your goal · …", "Paid ₹673 via UPI"). */
export function SuccessPill({
  label,
  style,
}: {
  label: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pill
      label={label}
      bg={colors.leafMist}
      fg={colors.leaf}
      icon="check"
      style={[ui.selfStart, style]}
    />
  );
}

/* ───────────── Section title row ───────────── */

/** H3 title + 13/18 Ink-3 meta, baseline-aligned, 12px below. */
export function SectionTitle({
  title,
  meta,
  style,
}: {
  title: string;
  meta?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.sectionTitle, style]}>
      <Text style={[type.h3, s.shrink]} accessibilityRole="header">
        {title}
      </Text>
      {meta ? <Text style={ui.meta13}>{meta}</Text> : null}
    </View>
  );
}

/* ───────────── Qty stepper · 44 (20px icons) ───────────── */

/**
 * The cart stepper: 44 high pill, 1.5px Forest Ink, 44×44 buttons with
 * 20px icons (the shared Stepper draws 16px icons). Trash at qty 1.
 */
export function QtyStepper({
  qty,
  onChange,
  name,
}: {
  qty: number;
  onChange: (qty: number) => void;
  name: string;
}) {
  const atOne = qty <= 1;
  return (
    <View style={s.stepper}>
      <View style={s.stepperRing} pointerEvents="none" />
      <Tap
        accessibilityLabel={atOne ? `Remove ${name}` : `Decrease ${name}`}
        onPress={() => onChange(qty - 1)}
        style={s.stepperBtn}
      >
        <Icon name={atOne ? 'trash' : 'minus'} size={20} color={colors.forestInk} />
      </Tap>
      <Text style={s.stepperCount}>{qty}</Text>
      <Tap
        accessibilityLabel={`Increase ${name}`}
        onPress={() => onChange(qty + 1)}
        style={s.stepperBtn}
      >
        <Icon name="plus" size={20} color={colors.forestInk} />
      </Tap>
    </View>
  );
}

/* ───────────── Item name with the diet mark ───────────── */

export type Diet = 'veg' | 'nonveg';

export function ItemName({
  name,
  diet,
  textStyle,
  markTop = 3,
  header = false,
}: {
  name: string;
  diet: Diet;
  textStyle?: StyleProp<TextStyle>;
  markTop?: number;
  header?: boolean;
}) {
  return (
    <View style={s.nameRow}>
      <DietMark type={diet} style={{ marginTop: markTop }} />
      <Text
        style={[s.name15, textStyle]}
        accessibilityRole={header ? 'header' : undefined}
      >
        {name}
      </Text>
    </View>
  );
}

/* ───────────── kcal + price ───────────── */

/** kcal (kcal-M) over the price, optionally right-aligned. */
export function KcalStack({
  kcal,
  unit,
  price,
  align = 'left',
}: {
  kcal: string | number;
  unit?: string;
  price: string;
  align?: 'left' | 'right';
}) {
  return (
    <View style={align === 'right' ? s.alignRight : null}>
      <Kcal value={kcal} unit={unit} />
      <Text style={ui.price}>{price}</Text>
    </View>
  );
}

/** kcal and price on one baseline (gap 10, or 8 on the add-on cards). */
export function KcalRow({
  kcal,
  unit,
  price,
  gap = 10,
  style,
}: {
  kcal: string | number;
  unit?: string;
  price: string;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.kcalRow, { gap }, style]}>
      <Kcal value={kcal} unit={unit} />
      <Text style={ui.price} numberOfLines={1}>
        {price}
      </Text>
    </View>
  );
}

/* ───────────── Thumbnails ───────────── */

/**
 * Photo thumbnail (cover) or the "[photo]" placeholder tile.
 * `label` = the design's alt / aria-label; omit for decorative images.
 */
export function Thumb({
  image,
  label,
  size,
  radius,
  placeholderLabel = '[photo]',
}: {
  image?: ImageSourcePropType;
  label?: string;
  size: number;
  radius: number;
  placeholderLabel?: string | null;
}) {
  const box = { width: size, height: size, borderRadius: radius };
  if (image) {
    return (
      <Image
        source={image}
        accessible={!!label}
        accessibilityLabel={label}
        resizeMode="cover"
        style={box}
      />
    );
  }
  return (
    <View
      accessible={!!label}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    >
      <PhotoPlaceholder
        tone="warm"
        label={placeholderLabel ?? undefined}
        showLabel={placeholderLabel !== null}
        style={box}
      />
    </View>
  );
}

/* ───────────── Cart item row (Cart, Cart states) ───────────── */

export type CartItem = {
  id: string;
  name: string;
  diet: Diet;
  image?: ImageSourcePropType;
  /** alt / aria-label of the photo */
  photoLabel: string;
  meta: string;
  protein?: string;
  portion?: string;
  /** Shows the "Edit" portion link (→ Meal) */
  editable?: boolean;
  notCounted?: boolean;
  kcal: number;
  unit?: string;
  price: string;
};

/** 72px thumb · name · meta lines · kcal/price + 44 stepper. Padding 16. */
export function CartItemRow({
  item,
  qty,
  onQty,
  first,
}: {
  item: CartItem;
  qty: number;
  onQty: (qty: number) => void;
  first: boolean;
}) {
  const nav = useNav();
  return (
    <View style={[s.itemRow, first ? null : ui.rowTop]}>
      <Thumb image={item.image} label={item.photoLabel} size={72} radius={14} />
      <View style={ui.flex}>
        <ItemName name={item.name} diet={item.diet} header />
        <Text style={[ui.meta13, s.mt2]}>{item.meta}</Text>
        {item.protein ? (
          <View style={[s.metaLine, s.mt2]}>
            <Text style={[ui.meta13, s.shrink]}>
              <Span style={s.protein}>{item.protein}</Span> · {item.portion}
              {item.editable ? ' ·' : ''}
            </Text>
            {item.editable ? (
              <Tap
                accessibilityRole="link"
                accessibilityLabel={`Edit portion of ${item.name}`}
                onPress={() => nav.navigate('Meal')}
                hitSlop={{ top: 13, bottom: 13, left: 8, right: 8 }}
                pressScale={1}
              >
                <Text style={[ui.meta13, s.editText]}> Edit</Text>
              </Tap>
            ) : null}
          </View>
        ) : null}
        {item.notCounted ? <NotCountedPill style={s.mt6} /> : null}
        <View style={s.itemBottom}>
          <KcalStack kcal={item.kcal} unit={item.unit} price={item.price} />
          <QtyStepper qty={qty} onChange={onQty} name={item.name} />
        </View>
      </View>
    </View>
  );
}

/* ───────────── Order summary row (Checkout, Tracking) ───────────── */

export type OrderLine = {
  name: string;
  diet: Diet;
  meta: string;
  notCounted?: boolean;
  kcal: number;
  unit?: string;
  price: string;
};

export const ORDER_LINES: OrderLine[] = [
  {
    name: 'Paneer tikka millet bowl',
    diet: 'veg',
    meta: 'Qty 1 · Green Fork Kitchen',
    kcal: 420,
    price: '₹249',
  },
  {
    name: 'Egg white veggie omelette',
    diet: 'nonveg',
    meta: 'Qty 1 · Protein Pot · Contains egg',
    kcal: 260,
    price: '₹179',
  },
  {
    name: 'Unsweetened Greek yogurt',
    diet: 'veg',
    meta: 'Qty 1 · 400 g · 380 kcal pack',
    notCounted: true,
    kcal: 95,
    unit: 'kcal/100 g',
    price: '₹180',
  },
];

/** Name 14/20 600 · meta 12/16 (indented 20) · right-aligned kcal/price. */
export function OrderItemRow({
  line,
  style,
}: {
  line: OrderLine;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.orderRow, style]}>
      <View style={ui.flex}>
        <ItemName name={line.name} diet={line.diet} textStyle={s.name14} />
        <Text style={[ui.meta12, s.indent, s.mt2]}>{line.meta}</Text>
        {line.notCounted ? <NotCountedPill style={[s.indent, s.mt6]} /> : null}
      </View>
      <KcalStack kcal={line.kcal} unit={line.unit} price={line.price} align="right" />
    </View>
  );
}

/* ───────────── Delivery address card (Cart, Cart states) ───────────── */

/** Pin · "Delivering to …" 14/20 700 · address 13/18 · Change link. */
export function DeliveryCard({
  title,
  address,
  children,
  accessibilityLabel,
}: {
  title: string;
  address: string;
  children?: ReactNode;
  accessibilityLabel?: string;
}) {
  const nav = useNav();
  return (
    <View style={[ui.card, ui.cardPad]} accessibilityLabel={accessibilityLabel}>
      <View style={s.addrRow}>
        <Icon name="pin" size={20} color={colors.turmericDeep} />
        <View style={ui.flex}>
          <Text style={s.addrTitle}>{title}</Text>
          <Text style={[ui.meta13, s.mt2]}>{address}</Text>
        </View>
        <Link
          label="Change"
          accessibilityLabel="Change delivery address"
          onPress={() => nav.navigate('Location')}
        />
      </View>
      {children}
    </View>
  );
}

/* ───────────── Day split bar + legend (Cart, Tracking) ───────────── */

/** 580 eaten of 1,600 = 36.25%; 680 this order = 42.5%; rest = left. */
export function SplitBar({
  height,
  eaten,
  order,
  rest,
  restBorder,
  accessibilityLabel,
}: {
  height: number;
  eaten: string;
  order: string;
  rest: string;
  restBorder?: string;
  accessibilityLabel: string;
}) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[s.bar, { height }]}
    >
      <View style={[s.barEaten, { backgroundColor: eaten }]} />
      <View style={[s.barOrder, { backgroundColor: order }]} />
      <View
        style={[
          ui.flex,
          { backgroundColor: rest },
          restBorder ? [s.border1, { borderColor: restBorder }] : null,
        ]}
      />
    </View>
  );
}

/** Wrapping legend: 8×8 r2 swatches, 12/16, tabular. Hidden from a11y. */
export function Legend({
  color,
  eaten,
  order,
  rest,
  restBorder,
}: {
  color: string;
  eaten: string;
  order: string;
  rest: string;
  restBorder: string;
}) {
  const items = [
    { label: '580 eaten', bg: eaten },
    { label: '680 this order', bg: order },
    { label: '340 left', bg: rest, border: restBorder },
  ];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={s.legend}
    >
      {items.map(i => (
        <View key={i.label} style={s.legendItem}>
          <View
            style={[
              s.swatch,
              { backgroundColor: i.bg },
              i.border ? [s.border1, { borderColor: i.border }] : null,
            ]}
          />
          <Text style={[s.legendText, { color }]}>{i.label}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  shrink: { flexShrink: 1 },
  border1: { borderWidth: 1 },
  mt2: { marginTop: 2 },
  mt6: { marginTop: 6 },
  indent: { marginLeft: 20 },
  alignRight: { alignItems: 'flex-end' },
  link: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillDot: { width: 8, height: 8, borderRadius: 999 },
  pillText: { ...ff('body', 600), fontSize: 12, lineHeight: 16 },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  stepper: { height: 44, flexDirection: 'row', alignItems: 'center' },
  stepperRing: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 1.5,
    borderColor: colors.forestInk,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCount: {
    ...ff('display', 700),
    minWidth: 24,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
    color: colors.forestInk,
  },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  name15: {
    ...ff('body', 600),
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 20,
    color: colors.forestInk,
  },
  name14: { fontSize: 14, lineHeight: 20 },
  kcalRow: { flexDirection: 'row', alignItems: 'baseline' },
  itemRow: { flexDirection: 'row', gap: 12, padding: 16 },
  metaLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  protein: { ...ff('body', 600), color: colors.proteinBlue },
  editText: { ...ff('body', 600), color: colors.turmericDeep },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  orderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  addrTitle: { ...ff('body', 700), fontSize: 14, lineHeight: 20 },
  bar: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 14,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barEaten: { width: '36.25%' },
  barOrder: { width: '42.5%' },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
    columnGap: 14,
    marginTop: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 8, height: 8, borderRadius: 2 },
  legendText: { fontSize: 12, lineHeight: 16, fontVariant: ['tabular-nums'] },
});
