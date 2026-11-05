/**
 * Pieces shared by the product screens (Home, Home·Groceries, Listing,
 * Kitchen). Other product screens may import these — keep the exports
 * stable.
 */
import { useState, type ReactNode } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type AccessibilityRole,
  type AccessibilityState,
  type DimensionValue,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AddOrStepper,
  Badge,
  CartBar,
  DietMark,
  Icon,
  Kcal,
  PhotoPlaceholder,
  Segmented,
  Stepper,
  Tap,
  Text,
  type BadgeTone,
  type IconName,
} from '../../components';
import { useNav, type RouteName } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';

/* ───────────── Photos ───────────── */

/** A product photo: an image source, or a placeholder tile tone. */
export type Photo = ImageSourcePropType | 'warm' | 'green';

/**
 * Photo at a fixed size, `object-fit: cover`. Placeholder tones render the
 * "[dish photo]" tile (or `label`) at the same size and radius.
 */
export function ProductPhoto({
  photo,
  width,
  height,
  radius = 0,
  label = '[dish photo]',
  style,
}: {
  photo: Photo;
  width: DimensionValue;
  height: DimensionValue;
  radius?: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const box = { width, height, borderRadius: radius };
  if (photo === 'warm' || photo === 'green') {
    return <PhotoPlaceholder tone={photo} label={label} style={[box, style]} />;
  }
  return (
    <Image
      source={photo}
      resizeMode="cover"
      style={[box, style as StyleProp<ImageStyle>]}
    />
  );
}

/* ───────────── Pill chip (36 visual in a 44 hit) ───────────── */

export type PillTone = 'off' | 'on' | 'kcal' | 'leaf';

const PILL_TONES = {
  /** White, 1px Line Strong, Forest Ink text */
  off: { bg: colors.surface, border: 1, borderColor: colors.lineStrong, fg: colors.forestInk },
  /** Forest Ink, white text */
  on: { bg: colors.forestInk, border: 1, borderColor: colors.forestInk, fg: '#FFFFFF' },
  /** kcal filter on: Turmeric, Forest Ink text (no border, as drawn) */
  kcal: { bg: colors.turmeric, border: 0, borderColor: colors.turmeric, fg: colors.forestInk },
  /** Diet filter on: Leaf Mist, 1.5px Leaf, Leaf text */
  leaf: { bg: colors.leafMist, border: 1.5, borderColor: colors.leaf, fg: colors.leaf },
} as const;

/** Text colour of a pill tone (for icons drawn in `currentColor`). */
export const pillColor = (tone: PillTone) => PILL_TONES[tone].fg;

/**
 * Chip / filter / selector pill: 36px visual inside a 44px hit,
 * r999, gap 6, Inter 14/20 500. Padding defaults to 0 14.
 */
export function PillChip({
  label,
  tone = 'off',
  left,
  right,
  onPress,
  padLeft = 14,
  padRight = 14,
  textStyle,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityState,
  style,
}: {
  label: string;
  tone?: PillTone;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  padLeft?: number;
  padRight?: number;
  textStyle?: StyleProp<TextStyle>;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
  style?: StyleProp<ViewStyle>;
}) {
  const t = PILL_TONES[tone];
  return (
    <Tap
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      onPress={onPress}
      style={[styles.pillHit, style]}
    >
      <View
        style={[
          styles.pill,
          {
            backgroundColor: t.bg,
            borderWidth: t.border,
            borderColor: t.borderColor,
            paddingLeft: padLeft,
            paddingRight: padRight,
          },
        ]}
      >
        {left}
        <Text style={[styles.pillText, { color: t.fg }, textStyle]} numberOfLines={1}>
          {label}
        </Text>
        {right}
      </View>
    </Tap>
  );
}

/**
 * Diet selector "Veg + Egg" — padding 0 10 0 12, 13/18 600, veg mark and
 * a 16px chevron. `active` = the applied-filter look (Leaf Mist, 1.5px Leaf).
 */
export function DietChip({
  active = false,
  onPress,
  style,
}: {
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const tone: PillTone = active ? 'leaf' : 'off';
  return (
    <PillChip
      label="Veg + Egg"
      tone={tone}
      padLeft={12}
      padRight={10}
      textStyle={styles.dietText}
      accessibilityLabel="Diet: Veg + Egg. Change"
      left={<DietMark type="veg" />}
      right={<Icon name="chevronDown" size={16} color={pillColor(tone)} />}
      onPress={onPress}
      style={style}
    />
  );
}

/* ───────────── Home header, search, Meals/Groceries ───────────── */

/**
 * Home header (scrolls with the content, pads the top inset itself):
 * delivery location, diet chip and the "AK" account avatar.
 */
export function HomeHeader() {
  const insets = useSafeAreaInsets();
  const nav = useNav();
  return (
    <View style={[styles.homeHeader, { paddingTop: insets.top + 12 }]}>
      <Tap
        accessibilityLabel="Change delivery location: Home · HSR Layout, Bengaluru"
        style={styles.location}
      >
        <Icon name="pin" size={20} color={colors.turmericDeep} />
        <View style={styles.locationText}>
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationTitle}>Home</Text>
            <Icon name="chevronDown" size={16} color={colors.forestInk} />
          </View>
          <Text style={type.small} numberOfLines={1}>
            HSR Layout, Bengaluru
          </Text>
        </View>
      </Tap>
      <View style={styles.headerRight}>
        <DietChip />
        <Tap
          accessibilityRole="link"
          accessibilityLabel="Account"
          onPress={() => nav.navigate('Account')}
          style={styles.avatarHit}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AK</Text>
          </View>
        </Tap>
      </View>
    </View>
  );
}

/** Search bar link (52px, r14, 1px Line Strong) → Listing. */
export function SearchBarLink({ style }: { style?: StyleProp<ViewStyle> }) {
  const nav = useNav();
  return (
    <Tap
      accessibilityRole="link"
      onPress={() => nav.navigate('Listing')}
      style={[styles.search, style]}
    >
      <Icon name="search" size={20} color={colors.ink3} />
      <Text style={styles.searchText}>Search meals, groceries, kitchens</Text>
    </Tap>
  );
}

type Shop = 'meals' | 'groceries';

const SHOP_OPTIONS: { value: Shop; label: string; icon: IconName }[] = [
  { value: 'meals', label: 'Meals', icon: 'forkKnife' },
  { value: 'groceries', label: 'Groceries', icon: 'bag' },
];

/** "Shop" segmented nav: Meals → Home, Groceries → HomeGroceries. */
export function ShopSegmented({
  active,
  style,
}: {
  active: Shop;
  style?: StyleProp<ViewStyle>;
}) {
  const nav = useNav();
  return (
    <Segmented
      accessibilityLabel="Shop"
      options={SHOP_OPTIONS}
      value={active}
      onChange={v => {
        if (v !== active) {
          nav.navigate(v === 'meals' ? 'Home' : 'HomeGroceries');
        }
      }}
      style={[styles.shop, style]}
    />
  );
}

/** The cart bar with the product screens' copy. */
export function ShopCartBar({ last = false }: { last?: boolean }) {
  return (
    <CartBar
      kcal="680 kcal"
      label="in meals · 3 items"
      sub="₹608 · 43% of today's target"
      cta="View cart"
      last={last}
    />
  );
}

/* ───────────── kcal + price ───────────── */

/**
 * kcal-M number over the price (cards, rows), or side by side on the
 * baseline with a 10px gap (`inline`, kitchen menu rows).
 */
export function KcalPrice({
  kcal,
  unit = 'kcal',
  price,
  inline = false,
  style,
}: {
  kcal: number | string;
  unit?: string;
  price: string;
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[inline ? styles.kpInline : null, style]}>
      <Kcal value={kcal} unit={unit} />
      <Text style={type.price} numberOfLines={1}>
        {price}
      </Text>
    </View>
  );
}

/* ───────────── ADD (wide) ───────────── */

/**
 * ADD → compact stepper, with a wider ADD (min-width 88) as drawn on the
 * kitchen menu rows. Manages its own quantity.
 */
export function AddOrStepperWide({
  initialQty = 0,
  name = 'item',
  minWidth = 88,
  onChange,
}: {
  initialQty?: number;
  name?: string;
  minWidth?: number;
  onChange?: (qty: number) => void;
}) {
  const [qty, setQty] = useState(initialQty);
  const update = (q: number) => {
    const next = Math.max(0, q);
    setQty(next);
    onChange?.(next);
  };
  if (qty === 0) {
    return (
      <Tap
        accessibilityLabel={`Add ${name}`}
        onPress={() => update(1)}
        style={styles.addHit}
      >
        <View style={[styles.add, { minWidth }]}>
          <Text style={styles.addText}>ADD</Text>
        </View>
      </Tap>
    );
  }
  return <Stepper qty={qty} onChange={update} name={name} />;
}

/* ───────────── Meal card (200 wide, horizontal rails) ───────────── */

export type Diet = 'veg' | 'nonveg';

/**
 * Meal card: 200px, r18, 1px Line. 112px photo with a badge at 10/10,
 * 2-line name box, meta line, then kcal/price and ADD or stepper.
 */
export function MealCard({
  photo,
  badge,
  diet,
  name,
  meta,
  kcal,
  price,
  initialQty = 0,
  onQtyChange,
  onPress,
  action,
  style,
}: {
  photo: Photo;
  badge?: { label: string; tone: BadgeTone };
  diet: Diet;
  name: string;
  meta: string;
  kcal: number | string;
  price: string;
  initialQty?: number;
  onQtyChange?: (qty: number) => void;
  /** Defaults to opening Meal. */
  onPress?: () => void;
  /** Replaces the ADD / stepper slot. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const nav = useNav();
  return (
    <View style={[styles.mealCard, style]}>
      <Tap accessibilityRole="link" onPress={onPress ?? (() => nav.navigate('Meal'))}>
        <View style={styles.mealPhoto}>
          <ProductPhoto photo={photo} width="100%" height={112} />
          {badge ? (
            <Badge label={badge.label} tone={badge.tone} style={styles.mealBadge} />
          ) : null}
        </View>
        <View style={styles.mealBody}>
          <View style={styles.mealNameBox}>
            <View style={styles.nameRow}>
              <DietMark type={diet} style={styles.mark3} />
              <Text style={styles.name15}>{name}</Text>
            </View>
          </View>
          <Text style={[type.small, styles.mt2]} numberOfLines={1}>
            {meta}
          </Text>
        </View>
      </Tap>
      <View style={styles.mealFooter}>
        <KcalPrice kcal={kcal} price={price} />
        {action ?? (
          <AddOrStepper initialQty={initialQty} name={name} onChange={onQtyChange} />
        )}
      </View>
    </View>
  );
}

/* ───────────── Product row (84px thumb, vertical lists) ───────────── */

/**
 * Product / result row: padding 12, r18, 1px Line (Turmeric when
 * `highlighted`). Optional badge on top, 84px photo, name, meta, protein
 * line, kcal over price; ADD / stepper pinned bottom-right.
 */
export function ProductRow({
  photo,
  diet,
  name,
  meta,
  protein,
  kcal,
  unit = 'kcal',
  price,
  initialQty = 0,
  onQtyChange,
  to = 'Item',
  onPress,
  badge,
  highlighted = false,
  action,
  style,
}: {
  photo: Photo;
  diet: Diet;
  name: string;
  meta: string;
  protein: string;
  kcal: number | string;
  unit?: string;
  price: string;
  initialQty?: number;
  onQtyChange?: (qty: number) => void;
  /** Screen the row opens (Item for groceries, Meal for meals). */
  to?: RouteName;
  onPress?: () => void;
  /** Rendered above the row content (e.g. "Best protein per kcal"). */
  badge?: ReactNode;
  highlighted?: boolean;
  /** Replaces the ADD / stepper slot. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const nav = useNav();
  return (
    <View style={[styles.productRow, highlighted ? styles.productRowHi : null, style]}>
      {badge}
      <Tap
        accessibilityRole="link"
        onPress={onPress ?? (() => nav.navigate(to))}
        style={styles.productLink}
      >
        <ProductPhoto photo={photo} width={84} height={84} radius={14} />
        <View style={styles.productBody}>
          <View style={styles.nameRow}>
            <DietMark type={diet} style={styles.mark3} />
            <Text style={styles.name15}>{name}</Text>
          </View>
          <Text style={[type.small, styles.mt2]}>{meta}</Text>
          <Text style={[styles.protein, styles.mt2]}>{protein}</Text>
          <KcalPrice kcal={kcal} unit={unit} price={price} style={styles.mt8} />
        </View>
      </Tap>
      <View style={styles.productAction}>
        {action ?? (
          <AddOrStepper initialQty={initialQty} name={name} onChange={onQtyChange} />
        )}
      </View>
    </View>
  );
}

/* ───────────── Dish row (kitchen menu) ───────────── */

/**
 * Kitchen menu row: padding 16, gap 16. Name 16/22, 2-line description,
 * kcal + price on one line, protein; 112px photo on the right with the
 * wide ADD / stepper centred under it (top 106).
 */
export function DishRow({
  photo,
  diet,
  name,
  description,
  kcal,
  price,
  protein,
  initialQty = 0,
  onQtyChange,
  onPress,
  action,
}: {
  photo: Photo;
  diet: Diet;
  name: string;
  description: string;
  kcal: number | string;
  price: string;
  protein: string;
  initialQty?: number;
  onQtyChange?: (qty: number) => void;
  /** Defaults to opening Meal. */
  onPress?: () => void;
  /** Replaces the ADD / stepper slot. */
  action?: ReactNode;
}) {
  const nav = useNav();
  return (
    <View>
      <Tap
        accessibilityRole="link"
        onPress={onPress ?? (() => nav.navigate('Meal'))}
        style={styles.dishLink}
      >
        <View style={styles.dishBody}>
          <View style={styles.nameRow}>
            <DietMark type={diet} style={styles.mark4} />
            <Text style={styles.name16}>{name}</Text>
          </View>
          <Text style={[type.small, styles.mt4]} numberOfLines={2}>
            {description}
          </Text>
          <KcalPrice inline kcal={kcal} price={price} style={styles.mt10} />
          <Text style={[styles.protein, styles.mt2]}>{protein}</Text>
        </View>
        <View style={styles.dishPhotoBox}>
          <ProductPhoto photo={photo} width={112} height={112} radius={14} />
        </View>
      </Tap>
      <View style={styles.dishAction}>
        {action ?? (
          <AddOrStepperWide initialQty={initialQty} name={name} onChange={onQtyChange} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* pill */
  pillHit: { height: 44, justifyContent: 'center' },
  pill: {
    height: 36,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillText: { ...ff('body', 500), fontSize: 14, lineHeight: 20 },
  dietText: { ...ff('body', 600), fontSize: 13, lineHeight: 18 },

  /* home header */
  homeHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  location: {
    minWidth: 0,
    flexShrink: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: { minWidth: 0, flexShrink: 1 },
  locationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  locationTitle: { ...ff('body', 700), fontSize: 16, lineHeight: 22 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  avatarHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...ff('body', 700), fontSize: 14, color: colors.forestInk },

  /* search link */
  search: {
    marginTop: 12,
    marginHorizontal: 20,
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchText: { fontSize: 15, lineHeight: 22, color: colors.ink3 },

  /* shop segmented */
  shop: { marginTop: 12, marginHorizontal: 20 },

  /* kcal + price */
  kpInline: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },

  /* wide ADD */
  addHit: { height: 44, justifyContent: 'center' },
  add: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.forestInk,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    ...ff('body', 700),
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: em(0.04, 13),
    color: colors.forestInk,
  },

  /* shared name / text bits */
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  mark3: { marginTop: 3 },
  mark4: { marginTop: 4 },
  name15: { ...ff('body', 600), fontSize: 15, lineHeight: 20, flexShrink: 1 },
  name16: { ...ff('body', 600), fontSize: 16, lineHeight: 22, flexShrink: 1 },
  protein: { ...ff('body', 600), fontSize: 12, lineHeight: 16, color: colors.proteinBlue },
  mt2: { marginTop: 2 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt10: { marginTop: 10 },

  /* meal card */
  mealCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
  mealPhoto: { height: 112 },
  mealBadge: { position: 'absolute', left: 10, top: 10 },
  mealBody: { paddingTop: 12, paddingHorizontal: 12 },
  mealNameBox: { height: 40, overflow: 'hidden' },
  mealFooter: {
    marginTop: 'auto',
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  /* product row */
  productRow: {
    padding: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
  productRowHi: { borderColor: colors.turmeric },
  productLink: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  productBody: { flex: 1, minWidth: 0 },
  productAction: { position: 'absolute', right: 12, bottom: 12 },

  /* dish row */
  dishLink: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, padding: 16 },
  dishBody: { flex: 1, minWidth: 0 },
  dishPhotoBox: { width: 112, height: 130 },
  dishAction: {
    position: 'absolute',
    top: 106,
    right: 16,
    width: 112,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
