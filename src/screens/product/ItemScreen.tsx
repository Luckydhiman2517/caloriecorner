import { useState } from 'react';
import { Image, StyleSheet, View, type TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets/images';
import {
  Badge,
  BottomBar,
  DietMark,
  Icon,
  Kcal,
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
  Indicator,
  SectionTitle,
} from './detailParts';

const PACKS = [
  { value: '400g', label: '400 g', kcal: '1,520', price: '₹349', servings: '≈10 servings' },
  { value: '750g', label: '750 g', kcal: '2,850', price: '₹599', servings: '≈19 servings' },
  { value: '1kg', label: '1 kg', kcal: '3,800', price: '₹749', servings: '≈25 servings' },
] as const;

type Pack = (typeof PACKS)[number]['value'];

/** Full nutrition table rows. Styles per cell are copied from the design. */
const NUTRITION: {
  name: string;
  per100: string;
  perServing: string;
  nameStyle: TextStyle;
  per100Style?: TextStyle;
  servingStyle?: TextStyle;
  indent?: boolean;
}[] = [
  {
    name: 'Energy',
    per100: '380 kcal',
    perServing: '152 kcal',
    nameStyle: ff('body', 600),
    servingStyle: { ...ff('body', 700), color: colors.turmericDeep },
  },
  {
    name: 'Protein',
    per100: '10 g',
    perServing: '4 g',
    nameStyle: ff('body', 500),
    servingStyle: { ...ff('body', 600), color: colors.proteinBlue },
  },
  { name: 'Carbohydrate', per100: '64 g', perServing: '25.6 g', nameStyle: ff('body', 500) },
  {
    name: 'of which sugars',
    per100: '16 g',
    perServing: '6.4 g',
    nameStyle: { ...ff('body', 400), color: colors.ink2 },
    per100Style: { color: colors.ink2 },
    servingStyle: { color: colors.ink2 },
    indent: true,
  },
  {
    name: 'Added sugar',
    per100: '0 g',
    perServing: '0 g',
    nameStyle: ff('body', 500),
    servingStyle: { ...ff('body', 600), color: colors.leaf },
  },
  { name: 'Fat', per100: '10 g', perServing: '4 g', nameStyle: ff('body', 500) },
  { name: 'Fibre', per100: '10 g', perServing: '4 g', nameStyle: ff('body', 500) },
  { name: 'Sodium', per100: '20 mg', perServing: '8 mg', nameStyle: ff('body', 500) },
];

const INGREDIENTS: { name: string; note?: string }[] = [
  { name: 'Rolled oats', note: 'whole grain, listed first' },
  { name: 'Dates', note: 'the only sweetener' },
  { name: 'Almonds' },
  { name: 'Pumpkin seeds' },
  { name: 'Raisins' },
  { name: 'Cinnamon' },
];

const LABEL_CHECKS = [
  'No refined sugar',
  'No palm oil',
  'No artificial sweetener',
  'No MSG',
  'No preservatives',
  'Whole grain first',
  'No synthetic colours',
];

const PAIRINGS = [
  {
    name: 'Unsweetened Greek yogurt',
    meta: '400 g · 380 kcal pack',
    kcal: '95',
    price: '₹180',
    image: images.greekYogurtThumb,
  },
  {
    name: 'Blueberries',
    meta: '125 g · 71 kcal pack',
    kcal: '57',
    price: '₹299',
    image: images.blueberriesThumb,
  },
];

/** 2.6 Grocery item — design file: Product-Item.dc.html */
export default function ItemScreen() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const [pack, setPack] = useState<Pack>('400g');

  return (
    <Screen
      bottomGap={0}
      footer={
        <BottomBar>
          <AddBarButton
            label="Add"
            labelSize={16}
            kcal="152"
            unit="kcal/serving"
            price="₹349"
            onPress={() => nav.navigate('Cart')}
            style={styles.addButton}
          />
        </BottomBar>
      }
    >
      {/* Hero photo with back + delivery pill over it */}
      <View style={styles.hero}>
        <Image
          source={images.muesliBowlHero}
          accessibilityLabel="Bowl of no-added-sugar muesli with yogurt, berries and dates"
          style={styles.heroImage}
          resizeMode="cover"
        />
        <HeroButton
          icon="chevronLeft"
          accessibilityLabel="Back"
          accessibilityRole="link"
          onPress={() => nav.navigate('Listing')}
        />
        <View style={[styles.delivery, { top: 16 + insets.top }]}>
          <Icon name="clock" size={16} color={colors.turmeric} />
          <Text style={styles.deliveryText} numberOfLines={1}>
            Delivery in 10 min
          </Text>
        </View>
      </View>

      <DetailSheet paddingBottom={20}>
        <DetailTitle
          meta="Daily Grain Co. · 400 g · 1,520 kcal pack"
          title="No-added-sugar muesli"
        />
        <View style={styles.badges}>
          <Badge tone="leaf" icon="check" label="Fits your goal" />
          <Badge tone="kcal" label="No added sugar" />
        </View>

        {/* Calories and price */}
        <View style={styles.kcalCard} accessibilityLabel="Calories and price">
          <View style={styles.kcalTop}>
            <View style={styles.kcalLeft}>
              <View style={styles.kcalNumber}>
                <Text style={styles.kcalBig}>152</Text>
                <Text style={styles.kcalUnit}>kcal/serving</Text>
                <Text style={styles.kcalBasis}>(40 g)</Text>
              </View>
              <Text style={styles.kcalPer100}>380 kcal/100 g</Text>
            </View>
            <View style={styles.kcalRight}>
              <Text style={styles.kcalPrice}>₹349</Text>
              <Text style={styles.kcalTaxes}>incl. taxes</Text>
            </View>
          </View>
          <View style={styles.kcalNote}>
            <Icon name="check" size={16} color={colors.leaf} />
            <Text style={styles.kcalNoteText}>
              One serving is <Span style={styles.strong}>10%</Span> of your 1,600 kcal
              day
            </Text>
          </View>
        </View>

        {/* Pack size */}
        <View accessibilityRole="radiogroup" style={styles.section}>
          <SectionTitle title="Pack size" />
          <View style={styles.packs}>
            {PACKS.map(p => {
              const on = pack === p.value;
              return (
                <Tap
                  key={p.value}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  onPress={() => setPack(p.value)}
                  pressScale={0.99}
                  style={[styles.pack, on ? styles.packOn : styles.packOff]}
                >
                  <View style={styles.packHead}>
                    <Text style={styles.packLabel}>{p.label}</Text>
                    <Indicator kind="radio" on={on} checkStroke={2.6} />
                  </View>
                  <Kcal
                    value={p.kcal}
                    size="S"
                    style={styles.packKcal}
                    unitStyle={styles.packKcalUnit}
                  />
                  <Text style={styles.packPrice}>{p.price}</Text>
                  <Text style={styles.packServings}>{p.servings}</Text>
                </Tap>
              );
            })}
          </View>
        </View>

        {/* Nutrition */}
        <View style={styles.section}>
          <SectionTitle title="Nutrition" />
          <Text style={styles.nutritionSummary}>
            Per serving:{' '}
            <Span style={styles.protein}>4 g protein</Span> · 0 g added sugar · 4 g
            fibre
          </Text>
          <View style={styles.table}>
            <View style={styles.tr}>
              <View style={[styles.cellName, styles.th]}>
                <Text style={styles.thText}>Full nutrition</Text>
              </View>
              <View style={[styles.cellPer100, styles.th]}>
                <Text style={[styles.thText, styles.right]}>Per 100 g</Text>
              </View>
              <View style={[styles.cellServing, styles.th]}>
                <Text style={[styles.thText, styles.right]}>Per serving</Text>
              </View>
            </View>
            {NUTRITION.map(r => (
              <View key={r.name} style={[styles.tr, styles.trBody]}>
                <View style={[styles.cellName, r.indent ? styles.indent : null]}>
                  <Text style={[styles.td, r.nameStyle]}>{r.name}</Text>
                </View>
                <View style={styles.cellPer100}>
                  <Text style={[styles.td, styles.right, r.per100Style]}>{r.per100}</Text>
                </View>
                <View style={styles.cellServing}>
                  <Text style={[styles.td, styles.right, r.servingStyle]}>
                    {r.perServing}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <SectionTitle title="Ingredients" />
          <View style={styles.wholeFoods}>
            <Icon name="check" size={16} color={colors.leaf} />
            <Text style={styles.wholeFoodsText}>All 6 ingredients are whole foods</Text>
          </View>
          <View style={styles.list}>
            {INGREDIENTS.map((ing, i) => (
              <View key={ing.name} style={[styles.li, i > 0 ? styles.liBorder : null]}>
                <Text style={styles.liNumber}>{i + 1}</Text>
                <View style={styles.liBody}>
                  <Text style={styles.liName}>{ing.name}</Text>
                  {ing.note ? <Text style={styles.liNote}>{ing.note}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Label check */}
        <View style={styles.section}>
          <View style={styles.labelHead}>
            <Text style={type.h3} accessibilityRole="header">
              Label check
            </Text>
            <Badge tone="dark" icon="check" label="7/7 passed" style={styles.passed} />
          </View>
          <View style={styles.checks}>
            {LABEL_CHECKS.map(c => (
              <View key={c} style={styles.check}>
                <Icon name="check" size={16} color={colors.leaf} />
                <Text style={styles.checkText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Goes well with — cards link to this same screen (no-op) */}
        <View style={styles.section}>
          <SectionTitle title="Goes well with" />
          <View style={styles.pairings}>
            {PAIRINGS.map(p => (
              <Tap key={p.name} accessibilityRole="link" style={styles.pairing}>
                <Image source={p.image} style={styles.pairingImage} resizeMode="cover" />
                <View style={styles.pairingName}>
                  <DietMark type="veg" style={styles.pairingMark} />
                  <Text style={styles.pairingNameText}>{p.name}</Text>
                </View>
                <Text style={styles.pairingMeta}>{p.meta}</Text>
                <View style={styles.pairingNumbers}>
                  <Kcal value={p.kcal} unit="kcal/100 g" />
                  <Text style={type.price}>{p.price}</Text>
                </View>
              </Tap>
            ))}
          </View>
        </View>
      </DetailSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { height: 300, backgroundColor: colors.placeholderWarm },
  heroImage: { width: '100%', height: '100%' },
  delivery: {
    position: 'absolute',
    right: 16,
    height: 36,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 999,
    backgroundColor: colors.forestInk,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryText: { ...ff('body', 600), fontSize: 13, lineHeight: 18, color: '#FFFFFF' },

  badges: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  kcalCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.kcalCream,
  },
  kcalTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  kcalLeft: { flexShrink: 1, minWidth: 0 },
  kcalNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    columnGap: 4,
  },
  kcalBig: {
    ...ff('display', 800),
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: em(-0.02, 44),
    color: colors.turmericDeep,
  },
  kcalUnit: { ...ff('body', 700), fontSize: 16, lineHeight: 20, color: colors.turmericDeep },
  kcalBasis: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: colors.ink2 },
  kcalPer100: { marginTop: 6, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  kcalRight: { flexShrink: 0, alignItems: 'flex-end', paddingTop: 12 },
  kcalPrice: { ...ff('body', 600), fontSize: 15, lineHeight: 20, color: colors.ink2 },
  kcalTaxes: { marginTop: 2, fontSize: 12, lineHeight: 16, color: colors.ink3 },
  kcalNote: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kcalNoteText: { flexShrink: 1, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  strong: { ...ff('body', 700), color: colors.forestInk },

  section: { marginTop: 28 },

  packs: { paddingTop: 12, flexDirection: 'row', gap: 8 },
  pack: { flex: 1, borderRadius: 18, backgroundColor: colors.surface },
  packOn: { padding: 11, borderWidth: 2, borderColor: colors.forestInk },
  packOff: { padding: 12, borderWidth: 1, borderColor: colors.line },
  packHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  packLabel: { ...ff('display', 700), fontSize: 16, lineHeight: 24, color: colors.forestInk },
  packKcal: { marginTop: 6, lineHeight: 22 },
  // The unit inherits the number's −0.01em tracking here (not reset to 0).
  packKcalUnit: { letterSpacing: em(-0.01, 18) },
  packPrice: { ...type.price, marginTop: 2 },
  packServings: { marginTop: 2, fontSize: 12, lineHeight: 16, color: colors.ink3 },

  nutritionSummary: { marginTop: 6, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  protein: { ...ff('body', 600), color: colors.proteinBlue },
  table: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
  tr: { flexDirection: 'row', alignItems: 'center' },
  trBody: { borderTopWidth: 1, borderTopColor: colors.line },
  // Column widths ≈ the HTML table's auto layout at 348px.
  cellName: { flex: 1, paddingVertical: 8, paddingLeft: 16, paddingRight: 8 },
  cellPer100: { width: 87, padding: 8 },
  cellServing: { width: 111, paddingVertical: 8, paddingLeft: 8, paddingRight: 16 },
  indent: { paddingLeft: 32 },
  th: { paddingTop: 12, paddingBottom: 8 },
  thText: { ...type.eyebrow, color: colors.ink3 },
  td: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.forestInk,
    fontVariant: ['tabular-nums'],
  },
  right: { textAlign: 'right' },

  wholeFoods: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 6 },
  wholeFoodsText: { flexShrink: 1, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  list: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
  li: {
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  liNumber: {
    ...ff('mono', 600),
    width: 16,
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
  },
  liBody: { flex: 1 },
  liName: { ...ff('body', 600), fontSize: 15, lineHeight: 20, color: colors.forestInk },
  liNote: { fontSize: 13, lineHeight: 18, color: colors.ink3 },

  labelHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passed: { backgroundColor: colors.leaf },
  checks: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  check: {
    height: 36,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 999,
    backgroundColor: colors.leafMist,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkText: { ...ff('body', 500), fontSize: 13, lineHeight: 18, color: colors.forestInk },

  pairings: { marginTop: 12, flexDirection: 'row', gap: 12 },
  pairing: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  pairingImage: { width: 56, height: 56, borderRadius: 12 },
  pairingName: {
    marginTop: 10,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  pairingMark: { marginTop: 3 },
  pairingNameText: {
    ...ff('body', 600),
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.forestInk,
  },
  pairingMeta: { marginTop: 2, fontSize: 12, lineHeight: 16, color: colors.ink3 },
  pairingNumbers: { marginTop: 8, flexDirection: 'row', alignItems: 'baseline', gap: 8 },

  addButton: { paddingHorizontal: 16 },
});
