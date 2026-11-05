import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';
import {
  Badge,
  BottomNav,
  DietMark,
  Icon,
  Kcal,
  Screen,
  Segmented,
  Span,
  Tap,
  Text,
} from '../../components';
import { useNav, type RouteName } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import { DashedOutline, InlineLink } from './parts';

type Filter = 'all' | 'meals' | 'groceries';
type Diet = 'veg' | 'nonveg';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'meals', label: 'Meals' },
  { value: 'groceries', label: 'Groceries' },
];

/** Bar heights are the design's px (96px = the 1,600 target line). */
const WEEK: {
  day: string;
  height: number;
  state: 'on' | 'over' | 'today';
  label?: string;
}[] = [
  { day: 'Mon', height: 85, state: 'on' },
  { day: 'Tue', height: 91, state: 'on' },
  { day: 'Wed', height: 81, state: 'on' },
  { day: 'Thu', height: 92, state: 'on' },
  { day: 'Fri', height: 107, state: 'over', label: '1,790' },
  { day: 'Sat', height: 76, state: 'on' },
  { day: 'Sun', height: 35, state: 'today', label: '580' },
];

type Order = {
  id: string;
  title: string;
  meta: string;
  status: 'out' | 'delivered';
  /** Which "Order type" tabs list this order. */
  types: Exclude<Filter, 'all'>[];
  /** Wrapped "mark + name" items (meal orders). */
  items?: { diet: Diet; name: string }[];
  /** One-per-line pack items with kcal (grocery orders). */
  packs?: { diet: Diet; name: string; size: string; kcal: string }[];
  kcal: number;
  kcalUnit?: string;
  price: string;
  note?: string;
  detailsLabel: string;
  action: {
    label: string;
    accessibilityLabel?: string;
    route: RouteName;
    variant: 'dark' | 'outline';
  };
};

const ORDERS: Order[] = [
  {
    id: 'today',
    title: 'Green Fork Kitchen + Protein Pot + Grocery',
    meta: 'Today · 7:42 PM · 3 items',
    status: 'out',
    types: ['meals', 'groceries'],
    items: [
      { diet: 'veg', name: 'Paneer tikka millet bowl' },
      { diet: 'nonveg', name: 'Egg white veggie omelette' },
      { diet: 'veg', name: 'Greek yogurt' },
    ],
    kcal: 680,
    price: '₹673',
    detailsLabel: 'Order details, today',
    action: { label: 'Track order', route: 'Tracking', variant: 'dark' },
  },
  {
    id: 'millet-mama',
    title: 'Millet Mama',
    meta: 'Yesterday · 8:15 PM · 2 items',
    status: 'delivered',
    types: ['meals'],
    items: [
      { diet: 'veg', name: 'Light dal khichdi' },
      { diet: 'veg', name: 'Moong sprout chaat' },
    ],
    kcal: 490,
    price: '₹352',
    detailsLabel: 'Order details, Millet Mama',
    action: {
      label: 'Reorder',
      accessibilityLabel: 'Reorder from Millet Mama',
      route: 'Cart',
      variant: 'outline',
    },
  },
  {
    id: 'grocery',
    title: 'Grocery',
    meta: 'Mon · 10:05 AM · 3 items',
    status: 'delivered',
    types: ['groceries'],
    packs: [
      { diet: 'veg', name: 'Greek yogurt', size: '400 g', kcal: '380' },
      { diet: 'veg', name: 'Blueberries', size: '125 g', kcal: '71' },
      { diet: 'nonveg', name: 'Eggs', size: '6 pcs', kcal: '420' },
    ],
    kcal: 871,
    kcalUnit: 'kcal in packs',
    price: '₹599',
    note: 'Not counted in your day',
    detailsLabel: 'Order details, Grocery',
    action: {
      label: 'Reorder',
      accessibilityLabel: 'Reorder groceries',
      route: 'Cart',
      variant: 'outline',
    },
  },
  {
    id: 'protein-pot',
    title: 'Protein Pot',
    meta: 'Sun · 1:10 PM · 2 items',
    status: 'delivered',
    types: ['meals'],
    items: [{ diet: 'nonveg', name: 'Egg white veggie omelette ×2' }],
    kcal: 520,
    price: '₹383',
    detailsLabel: 'Order details, Protein Pot',
    action: {
      label: 'Reorder',
      accessibilityLabel: 'Reorder from Protein Pot',
      route: 'Cart',
      variant: 'outline',
    },
  },
];

/** 4.4 Orders — design file: Account-Orders.dc.html */
export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const orders =
    filter === 'all' ? ORDERS : ORDERS.filter(o => o.types.includes(filter));

  return (
    <Screen
      header={
        <View style={[styles.header, { paddingTop: 16 + insets.top }]}>
          <Text style={type.h1} accessibilityRole="header">
            Orders
          </Text>
        </View>
      }
      bottomNav={<BottomNav active="orders" iconStrokeWidth={1.8} />}
      contentStyle={styles.main}
    >
      <WeekCard />

      <Segmented
        accessibilityLabel="Order type"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
        style={styles.tabs}
      />

      <View style={styles.list}>
        {orders.map(o => (
          <OrderCard key={o.id} order={o} />
        ))}
      </View>
    </Screen>
  );
}

/* ───────────── This week ───────────── */

function WeekCard() {
  return (
    <View style={styles.card}>
      <View style={styles.weekHead}>
        <Text style={type.eyebrow} accessibilityRole="header">
          This week
        </Text>
        <Text style={styles.weekTarget}>Target 1,600 kcal/day</Text>
      </View>

      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Calories per day this week: Mon 1,420, Tue 1,510, Wed 1,350, Thu 1,540, Fri 1,790 over target, Sat 1,270, Sun 580 so far. Target 1,600."
        style={styles.chart}
      >
        <View style={styles.targetLine}>
          <Svg width="100%" height={1.5}>
            <Line
              x1={0}
              y1={0.75}
              x2="100%"
              y2={0.75}
              stroke={colors.ink3}
              strokeWidth={1.5}
              strokeDasharray={[4.5, 3]}
            />
          </Svg>
        </View>
        <Text style={styles.targetLabel}>1,600</Text>
        <View style={styles.bars}>
          {WEEK.map(d => (
            <View key={d.day} style={styles.barCol}>
              {d.label ? (
                <Text
                  style={[
                    styles.barLabel,
                    d.state === 'over' ? styles.barLabelOver : styles.barLabelToday,
                  ]}
                >
                  {d.label}
                </Text>
              ) : null}
              <Bar height={d.height} state={d.state} />
            </View>
          ))}
        </View>
      </View>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.days}
      >
        {WEEK.map(d => (
          <View key={d.day} style={styles.barCol}>
            <Text
              style={[styles.day, d.state === 'today' ? styles.dayToday : null]}
            >
              {d.day}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.avg}>
        Avg <Span style={styles.avgStrong}>1,480 kcal/day</Span> · 5 of 7 days
        on target
      </Text>
      <View style={styles.legend}>
        <LegendItem label="On target" swatch={<View style={styles.swatchOn} />} />
        <LegendItem label="Over" swatch={<View style={styles.swatchOver} />} />
        <LegendItem
          label="Today so far"
          swatch={
            <View style={styles.swatchToday}>
              <DashedOutline
                width={10}
                height={10}
                radius={3}
                color={colors.turmericDeep}
              />
            </View>
          }
        />
      </View>
    </View>
  );
}

/** 20px bar, radius 6 6 3 3. Today: Kcal Cream with a dashed outline. */
function Bar({
  height,
  state,
}: {
  height: number;
  state: 'on' | 'over' | 'today';
}) {
  if (state === 'today') {
    return (
      <View style={[styles.bar, styles.barToday, { height }]}>
        <DashedOutline
          width={20}
          height={height}
          radius={[6, 6, 3, 3]}
          color={colors.turmericDeep}
        />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.bar,
        state === 'over' ? styles.barOver : styles.barOn,
        { height },
      ]}
    />
  );
}

function LegendItem({ label, swatch }: { label: string; swatch: ReactNode }) {
  return (
    <View style={styles.legendItem}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {swatch}
      </View>
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

/* ───────────── Order card ───────────── */

function OrderCard({ order: o }: { order: Order }) {
  const nav = useNav();
  const action = (
    <PillButton
      label={o.action.label}
      accessibilityLabel={o.action.accessibilityLabel}
      variant={o.action.variant}
      onPress={() => nav.navigate(o.action.route)}
    />
  );
  const details = (
    <InlineLink label="Details" accessibilityLabel={o.detailsLabel} />
  );
  const totals = (
    <View style={styles.totals}>
      <Kcal value={o.kcal} unit={o.kcalUnit} />
      <Text style={styles.price}>{o.price}</Text>
    </View>
  );

  return (
    <View style={[styles.card, styles.order]}>
      <View style={styles.orderHead}>
        <View style={styles.flex}>
          <Text style={styles.orderTitle} accessibilityRole="header">
            {o.title}
          </Text>
          <Text style={styles.orderMeta}>{o.meta}</Text>
        </View>
        {o.status === 'out' ? (
          <Badge style={styles.badgeOut}>
            <Text style={[styles.badgeText, styles.badgeTextOut]}>
              Out for delivery
            </Text>
          </Badge>
        ) : (
          <Badge tone="leaf">
            <Icon name="check" size={16} strokeWidth={2.4} color={colors.leaf} />
            <Text style={[styles.badgeText, styles.badgeTextLeaf]}>Delivered</Text>
          </Badge>
        )}
      </View>

      {o.items ? (
        <View style={styles.items}>
          {o.items.map(it => (
            <View key={it.name} style={styles.item}>
              <DietMark type={it.diet} />
              <Text style={styles.itemText}>{it.name}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {o.packs ? (
        <View style={styles.packs}>
          {o.packs.map(p => (
            <View key={p.name} style={styles.pack}>
              <DietMark type={p.diet} />
              <Text style={[styles.itemText, styles.flex]}>
                {p.name}
                <Span style={styles.packMuted}> · {p.size}</Span>
              </Text>
              <Text style={styles.packKcal}>
                {p.kcal}
                <Span style={styles.packKcalUnit}> kcal</Span>
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {o.note ? (
        <View style={styles.foot}>
          {totals}
          <View style={styles.footNoteRow}>
            <Text style={styles.footNote}>{o.note}</Text>
            {details}
            {action}
          </View>
        </View>
      ) : (
        <View style={[styles.foot, styles.footRow]}>
          <View style={styles.flex}>{totals}</View>
          {details}
          {action}
        </View>
      )}
    </View>
  );
}

/** 44px pill: dark (Forest Ink, white) or outline (1.5px Forest Ink). 14px 700. */
function PillButton({
  label,
  accessibilityLabel,
  variant,
  onPress,
}: {
  label: string;
  accessibilityLabel?: string;
  variant: 'dark' | 'outline';
  onPress?: () => void;
}) {
  const dark = variant === 'dark';
  return (
    <Tap
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      pressedBackground={dark ? colors.forestInkPressed : undefined}
      style={[styles.pill, dark ? styles.pillDark : styles.pillOutline]}
    >
      <Text style={[styles.pillText, dark ? styles.pillTextDark : null]}>
        {label}
      </Text>
    </Tap>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  main: { paddingTop: 12, paddingHorizontal: 20 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 16,
  },

  /* This week */
  weekHead: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekTarget: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
    fontVariant: ['tabular-nums'],
  },
  chart: { marginTop: 16, height: 136 },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 44,
    bottom: 96,
    height: 1.5,
  },
  targetLabel: {
    position: 'absolute',
    right: 0,
    bottom: 89,
    ...ff('mono', 600),
    fontSize: 12,
    lineHeight: 14,
    color: colors.ink2,
    fontVariant: ['tabular-nums'],
  },
  bars: {
    position: 'absolute',
    left: 0,
    right: 44,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  /* 28px column; labels are wider, so they centre and overflow like CSS. */
  barCol: { width: 28, alignItems: 'center' },
  barLabel: {
    width: 56,
    marginBottom: 4,
    textAlign: 'center',
    ...ff('body', 700),
    fontSize: 12,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
  },
  barLabelOver: { color: colors.chili },
  barLabelToday: { color: colors.turmericDeep },
  bar: {
    width: 20,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  barOn: { backgroundColor: colors.chartOnTarget },
  barOver: { backgroundColor: colors.chartOver },
  barToday: { backgroundColor: colors.kcalCream },
  days: {
    marginTop: 8,
    marginRight: 44,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  day: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
  },
  dayToday: { ...ff('body', 600), color: colors.forestInk },
  avg: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink2,
    fontVariant: ['tabular-nums'],
  },
  avgStrong: { ...ff('body', 700), color: colors.forestInk },
  legend: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
    columnGap: 14,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontSize: 12, lineHeight: 16, color: colors.ink3 },
  swatchOn: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: colors.chartOnTarget,
  },
  swatchOver: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: colors.chartOver,
  },
  swatchToday: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: colors.kcalCream,
  },

  /* Tabs + list */
  tabs: { marginTop: 28 },
  list: { marginTop: 16, gap: 12 },

  /* Order card */
  order: { paddingBottom: 12 },
  orderHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  orderTitle: { ...ff('body', 600), fontSize: 15, lineHeight: 20 },
  orderMeta: { marginTop: 2, fontSize: 12, lineHeight: 16, color: colors.ink3 },
  badgeOut: { backgroundColor: colors.turmeric },
  badgeText: { ...ff('body', 600), fontSize: 12, lineHeight: 16 },
  badgeTextOut: { color: colors.forestInk },
  badgeTextLeaf: { color: colors.leaf },
  items: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
    columnGap: 12,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemText: { fontSize: 13, lineHeight: 18, color: colors.ink2 },
  packs: { marginTop: 10, gap: 4 },
  pack: { height: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  packMuted: { color: colors.ink3 },
  packKcal: {
    ...ff('body', 700),
    fontSize: 13,
    lineHeight: 18,
    color: colors.turmericDeep,
    fontVariant: ['tabular-nums'],
  },
  packKcalUnit: { ...ff('body', 500), color: colors.ink3 },
  foot: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  footRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  totals: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  price: { ...type.price, fontVariant: ['tabular-nums'] },
  footNoteRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footNote: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
  },
  pill: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillDark: { backgroundColor: colors.forestInk },
  pillOutline: {
    borderWidth: 1.5,
    borderColor: colors.forestInk,
    backgroundColor: colors.surface,
  },
  pillText: { ...ff('body', 700), fontSize: 14, color: colors.forestInk },
  pillTextDark: { color: '#FFFFFF' },
});
