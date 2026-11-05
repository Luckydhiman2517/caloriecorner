import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Badge,
  BottomBar,
  Icon,
  PhotoPlaceholder,
  Screen,
  Span,
  Tap,
  Text,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';
import {
  AddBarButton,
  DetailSheet,
  DetailTitle,
  HeroButton,
  OptionRow,
  SectionTitle,
} from './detailParts';

const NAME = 'Paneer tikka millet bowl';

const PORTIONS = [
  { value: 'regular', title: 'Regular', kcal: '420', price: '₹249' },
  { value: 'large', title: 'Large', kcal: '560', price: '₹309' },
  { value: 'light', title: 'Light', subtitle: 'less millet', kcal: '330', price: '₹229' },
] as const;

type Portion = (typeof PORTIONS)[number]['value'];

const ADD_ONS = [
  { value: 'extra-paneer', title: 'Extra paneer', kcal: '+90', price: '₹60' },
  { value: 'mint-yogurt-dip', title: 'Mint yogurt dip', kcal: '+45', price: '₹30' },
  { value: 'roasted-seeds', title: 'Roasted seeds', kcal: '+60', price: '₹25' },
] as const;

const MACROS = [
  { value: '28 g', label: 'protein', valueColor: colors.proteinBlue, dot: colors.proteinBlue },
  { value: '38 g', label: 'carbs', valueColor: colors.forestInk, dot: colors.ink2 },
  { value: '17 g', label: 'fat', valueColor: colors.forestInk, dot: colors.turmeric },
  { value: '7 g', label: 'fibre', valueColor: colors.forestInk, dot: null },
] as const;

const INGREDIENTS = [
  'Foxtail millet',
  'Paneer',
  'Bell peppers',
  'Onion',
  'Mint chutney',
  'Cold-pressed mustard oil',
];

/** 2.5 Meal detail — design file: Product-Meal.dc.html */
export default function MealScreen() {
  const nav = useNav();
  const [portion, setPortion] = useState<Portion>('regular');
  const [addOns, setAddOns] = useState<Record<string, boolean>>({});
  const [qty, setQty] = useState(1);

  return (
    <Screen
      bottomGap={0}
      footer={
        <BottomBar>
          <View style={styles.overBanner}>
            <Icon name="alertCircle" size={20} color={colors.chili} />
            <Text style={styles.overText}>
              Another bowl would put you{' '}
              <Span style={ff('body', 700)}>80 kcal over</Span>
              {" today's target"}
            </Text>
          </View>
          <View style={styles.barRow}>
            <View style={styles.inCart}>
              <Text style={styles.inCartLabel}>In cart: {qty}</Text>
              <BarStepper
                qty={qty}
                name={NAME}
                onChange={q => setQty(Math.max(0, q))}
              />
            </View>
            <AddBarButton
              label="Add another"
              labelSize={15}
              kcal="420"
              price="₹249"
              onPress={() => nav.navigate('Cart')}
              style={styles.addAnother}
            />
          </View>
        </BottomBar>
      }
    >
      {/* Hero: dish photo placeholder with back + favourite over it */}
      <View style={styles.hero}>
        <PhotoPlaceholder iconSize={24} style={styles.heroPhoto} />
        <HeroButton
          icon="chevronLeft"
          accessibilityLabel="Back"
          accessibilityRole="link"
          onPress={() => nav.navigate('Home')}
        />
        <HeroButton
          icon="heart"
          iconSize={20}
          side="right"
          accessibilityLabel="Save to favourites"
          accessibilityRole="togglebutton"
          accessibilityState={{ checked: false }}
        />
      </View>

      <DetailSheet paddingBottom={28}>
        <DetailTitle meta="Green Fork Kitchen · 25 min" title={NAME} />
        <Text style={[type.body, styles.lede]}>
          Smoky tandoori paneer on foxtail millet with charred peppers and a bright
          mint chutney.
        </Text>

        {/* Calories and macros */}
        <View style={styles.kcalCard} accessibilityLabel="Calories and macros">
          <View style={styles.kcalTop}>
            <View style={styles.kcalNumber}>
              <Text style={styles.kcalBig}>420</Text>
              <Text style={styles.kcalUnit}>kcal</Text>
              <Text style={styles.kcalBasis}>per bowl</Text>
            </View>
            <Text style={styles.kcalPrice}>₹249</Text>
          </View>
          <View
            accessible
            accessibilityRole="image"
            accessibilityLabel="Energy split: 27% protein, 36% carbs, 37% fat"
            style={styles.split}
          >
            <View style={[styles.splitPart, styles.splitProtein]} />
            <View style={[styles.splitPart, styles.splitCarbs]} />
            <View style={[styles.splitPart, styles.splitFat]} />
          </View>
          <View style={styles.macros}>
            {MACROS.map(m => (
              <View key={m.label} style={styles.macro}>
                <Text style={[styles.macroValue, { color: m.valueColor }]}>
                  {m.value}
                </Text>
                <View style={styles.macroLabelRow}>
                  <View
                    style={[
                      styles.macroDot,
                      m.dot ? { backgroundColor: m.dot } : styles.macroDotRing,
                    ]}
                  />
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Fits your goal */}
        <View style={styles.fit}>
          <View style={styles.fitIcon}>
            <Icon name="check" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.fitBody}>
            <Text style={styles.fitTitle}>
              <Span style={styles.fitStrong}>Fits your goal</Span>
              {' · 26% of your 1,600 kcal day'}
            </Text>
            <Text style={styles.fitSub}>
              1 already in your cart ·{' '}
              <Span style={styles.fitSubStrong}>340 kcal left today</Span> after
              your order
            </Text>
          </View>
        </View>

        {/* Choose portion */}
        <View accessibilityRole="radiogroup" style={styles.fieldset}>
          <SectionTitle title="Choose portion" hint="Pick 1" />
          <View style={styles.options}>
            {PORTIONS.map(p => (
              <OptionRow
                key={p.value}
                title={p.title}
                subtitle={'subtitle' in p ? p.subtitle : undefined}
                kcal={p.kcal}
                price={p.price}
                selected={portion === p.value}
                onPress={() => setPortion(p.value)}
              />
            ))}
          </View>
        </View>

        {/* Add-ons */}
        <View style={styles.fieldset}>
          <SectionTitle title="Add-ons" hint="Optional" />
          <View style={styles.options}>
            {ADD_ONS.map(a => (
              <OptionRow
                key={a.value}
                kind="checkbox"
                title={a.title}
                kcal={a.kcal}
                price={a.price}
                selected={!!addOns[a.value]}
                onPress={() => setAddOns(s => ({ ...s, [a.value]: !s[a.value] }))}
              />
            ))}
          </View>
        </View>

        {/* What's inside */}
        <View style={styles.fieldset}>
          <SectionTitle title="What's inside" />
          <View style={styles.ingredients}>
            {INGREDIENTS.map(i => (
              <Badge key={i} tone="stone" label={i} />
            ))}
          </View>
          <View style={styles.allergens}>
            <Text style={styles.allergensText}>
              <Span style={styles.allergensLabel}>Allergens:</Span> dairy
            </Text>
            <View style={styles.checked}>
              <Icon name="check" size={16} color={colors.leaf} />
              <Text style={styles.checkedText}>
                Calories checked by our nutritionist · per bowl, as served
              </Text>
            </View>
          </View>
        </View>
      </DetailSheet>
    </Screen>
  );
}

/**
 * Bottom-bar qty stepper: 52 high, 1.5px Forest Ink, r14, 48×49 buttons
 * with 20px icons (trash at 1).
 */
function BarStepper({
  qty,
  name,
  onChange,
}: {
  qty: number;
  name: string;
  onChange: (qty: number) => void;
}) {
  const atOne = qty <= 1;
  return (
    <View accessibilityLabel="Quantity in cart" style={styles.stepper}>
      <Tap
        accessibilityLabel={atOne ? `Remove ${name}` : `Decrease ${name}`}
        onPress={() => onChange(qty - 1)}
        style={styles.stepperBtn}
      >
        <Icon name={atOne ? 'trash' : 'minus'} size={20} color={colors.forestInk} />
      </Tap>
      <Text style={styles.stepperCount}>{qty}</Text>
      <Tap
        accessibilityLabel={`Increase ${name}`}
        onPress={() => onChange(qty + 1)}
        style={styles.stepperBtn}
      >
        <Icon name="plus" size={20} color={colors.forestInk} />
      </Tap>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 300 },
  heroPhoto: { height: 300, paddingBottom: 24, gap: 8 },
  lede: { marginTop: 8 },

  kcalCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.kcalCream,
  },
  kcalTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  kcalNumber: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  kcalBig: {
    ...ff('display', 800),
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: em(-0.02, 44),
    color: colors.turmericDeep,
  },
  kcalUnit: { ...ff('body', 700), fontSize: 16, lineHeight: 20, color: colors.turmericDeep },
  kcalBasis: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: colors.ink2 },
  kcalPrice: { ...ff('body', 600), fontSize: 15, lineHeight: 20, color: colors.ink2 },
  split: {
    marginTop: 16,
    height: 10,
    flexDirection: 'row',
    gap: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  splitPart: { height: 10 },
  splitProtein: { flex: 27, backgroundColor: colors.proteinBlue },
  splitCarbs: { flex: 36, backgroundColor: colors.ink2 },
  splitFat: { flex: 37, backgroundColor: colors.turmeric },
  macros: { marginTop: 14, flexDirection: 'row', gap: 8 },
  macro: { flex: 1 },
  macroValue: { ...ff('display', 700), fontSize: 16, lineHeight: 20 },
  macroLabelRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroDotRing: { borderWidth: 1.5, borderColor: colors.ink3 },
  macroLabel: { fontSize: 12, lineHeight: 16, color: colors.ink2 },

  fit: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.leafMist,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  fitIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fitBody: { flex: 1 },
  fitTitle: { ...ff('body', 500), fontSize: 15, lineHeight: 20, color: colors.forestInk },
  fitStrong: { ...ff('body', 700), color: colors.leaf },
  fitSub: { marginTop: 4, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  fitSubStrong: { ...ff('body', 700), color: colors.forestInk },

  fieldset: { marginTop: 28 },
  options: { paddingTop: 12, gap: 8 },

  ingredients: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  allergens: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  allergensText: { fontSize: 13, lineHeight: 18, color: colors.ink2 },
  allergensLabel: { ...ff('body', 600), color: colors.forestInk },
  checked: { marginTop: 8, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  checkedText: { flex: 1, fontSize: 12, lineHeight: 16, color: colors.ink3 },

  overBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.chiliMist,
  },
  overText: {
    ...ff('body', 500),
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.chili,
  },
  barRow: { marginTop: 12, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inCart: { gap: 4 },
  inCartLabel: { ...ff('body', 600), fontSize: 12, lineHeight: 16, color: colors.ink3 },
  addAnother: { flex: 1, minWidth: 0, paddingHorizontal: 10 },

  stepper: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.forestInk,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  stepperBtn: {
    width: 48,
    height: 49,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCount: {
    ...ff('display', 700),
    minWidth: 24,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    color: colors.forestInk,
  },
});
