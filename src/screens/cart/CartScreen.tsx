import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '../../assets/images';
import {
  AddButton,
  BottomBar,
  Button,
  Divider,
  Icon,
  Screen,
  ScreenHeader,
  Tap,
  Text,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';
import {
  CartItemRow,
  DeliveryCard,
  ItemName,
  KcalRow,
  Legend,
  SectionTitle,
  SplitBar,
  ui,
  type CartItem,
} from './parts';

const MEALS: CartItem[] = [
  {
    id: 'paneer',
    name: 'Paneer tikka millet bowl',
    diet: 'veg',
    photoLabel: 'Paneer tikka millet bowl, photo coming soon',
    meta: 'Green Fork Kitchen',
    protein: '28 g protein',
    portion: 'Regular',
    editable: true,
    kcal: 420,
    price: '₹249',
  },
  {
    id: 'omelette',
    name: 'Egg white veggie omelette',
    diet: 'nonveg',
    image: images.eggsThumb,
    photoLabel: 'Egg white veggie omelette',
    meta: 'Protein Pot · Contains egg',
    protein: '24 g protein',
    portion: 'Regular',
    kcal: 260,
    price: '₹179',
  },
];

const GROCERIES: CartItem[] = [
  {
    id: 'yogurt',
    name: 'Unsweetened Greek yogurt',
    diet: 'veg',
    image: images.greekYogurtThumb,
    photoLabel: 'Unsweetened Greek yogurt',
    meta: '400 g · 380 kcal pack',
    notCounted: true,
    kcal: 95,
    unit: 'kcal/100 g',
    price: '₹180',
  },
];

const ADD_ONS = [
  {
    name: 'Moong sprout chaat',
    image: images.moongSproutsThumb,
    meta: 'Millet Mama',
    kcal: 180,
    unit: undefined,
    price: '₹149',
  },
  {
    name: 'Blueberries',
    image: images.blueberriesThumb,
    meta: '125 g · 71 kcal pack',
    kcal: 57,
    unit: 'kcal/100 g',
    price: '₹299',
  },
];

const BILL = [
  ['Item total', '₹608'],
  ['Delivery', '₹25'],
  ['Platform fee', '₹9'],
  ['GST & charges', '₹31'],
] as const;

/** 3.1 Cart — design file: Cart-Cart.dc.html */
export default function CartScreen() {
  const nav = useNav();
  const [qty, setQty] = useState<Record<string, number>>({
    paneer: 1,
    omelette: 1,
    yogurt: 1,
  });
  const setItemQty = (id: string) => (q: number) =>
    setQty(prev => ({ ...prev, [id]: Math.max(0, q) }));
  const meals = MEALS.filter(m => qty[m.id] > 0);
  const groceries = GROCERIES.filter(g => qty[g.id] > 0);

  return (
    <Screen
      header={
        <ScreenHeader
          title="Your cart"
          subtitle="2 meals · 680 kcal + 1 grocery"
          onBack={() => nav.navigate('Home')}
        />
      }
      contentStyle={styles.main}
      bottomGap={20}
      footer={
        <BottomBar style={styles.payBar}>
          <View>
            <View style={styles.payKcal}>
              <Text style={styles.payKcalNum} numberOfLines={1}>
                680
              </Text>
              <Text style={styles.payKcalUnit} numberOfLines={1}>
                kcal in meals
              </Text>
            </View>
            <Text style={[ui.price, styles.mt2]}>₹673 · 3 items</Text>
          </View>
          <Button style={ui.flex} onPress={() => nav.navigate('Checkout')}>
            <Text style={styles.payCta}>Proceed to pay</Text>
            <Icon name="chevronRight" size={20} color="#FFFFFF" />
          </Button>
        </BottomBar>
      }
    >
      {/* Delivery details */}
      <DeliveryCard
        accessibilityLabel="Delivery details"
        title="Delivering to Home"
        address="Flat 402, 27th Main, HSR Layout Sector 2"
      >
        <Divider style={styles.divider} />
        <View style={styles.etaRow}>
          <Icon name="clock" size={20} color={colors.ink2} />
          <Text style={[styles.eta, ui.tabular]}>25–30 min</Text>
          <Text style={[ui.meta13, styles.shrink]}>
            · one delivery, groceries included
          </Text>
        </View>
      </DeliveryCard>

      {/* This order vs your day */}
      <View style={[ui.card, ui.cardPad]}>
        <Text style={type.eyebrow} accessibilityRole="header">
          This order vs your day
        </Text>
        <View style={styles.dayRow}>
          <View style={styles.dayKcal}>
            <Text style={styles.dayKcalNum}>680</Text>
            <Text style={styles.dayKcalLabel}>kcal in meals</Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.dayPct}>43%</Text>
            <Text style={ui.meta12}>of today’s target</Text>
          </View>
        </View>
        <SplitBar
          height={12}
          eaten={colors.ink2}
          order={colors.turmeric}
          rest={colors.stone}
          restBorder={colors.mapLine}
          accessibilityLabel="Today: 580 kcal eaten, 680 kcal in this order, 340 kcal left of 1,600"
        />
        <Legend
          color={colors.ink2}
          eaten={colors.ink2}
          order={colors.turmeric}
          rest={colors.stone}
          restBorder={colors.mapLine}
        />
        <View style={styles.fits}>
          <Icon name="check" size={16} color={colors.leaf} />
          <Text style={styles.fitsText}>Fits your goal · 340 kcal left today</Text>
        </View>
        <Text style={styles.protein}>52 g protein · 43% of 120 g</Text>
      </View>

      {/* Meals + groceries */}
      <View>
        <SectionTitle title="Meals" meta="From 2 kitchens" />
        {meals.length ? (
          <View style={ui.card}>
            {meals.map((m, i) => (
              <CartItemRow
                key={m.id}
                item={m}
                qty={qty[m.id]}
                onQty={setItemQty(m.id)}
                first={i === 0}
              />
            ))}
          </View>
        ) : null}

        {groceries.length ? (
          <>
            <Text style={[type.h3, styles.groceriesTitle]} accessibilityRole="header">
              Groceries · arrives with your meals
            </Text>
            <View style={ui.card}>
              {groceries.map((g, i) => (
                <CartItemRow
                  key={g.id}
                  item={g}
                  qty={qty[g.id]}
                  onQty={setItemQty(g.id)}
                  first={i === 0}
                />
              ))}
            </View>
          </>
        ) : null}
      </View>

      {/* Swap & save */}
      <View style={styles.swap}>
        <View style={ui.flex}>
          <Text style={type.eyebrow} accessibilityRole="header">
            Swap & save
          </Text>
          <Text style={styles.swapTitle}>
            Make the paneer bowl Light — save 90 kcal and ₹20
          </Text>
          <Text style={styles.swapSub}>Light portion: 330 kcal · ₹229</Text>
        </View>
        <Tap
          accessibilityLabel="Swap to Light portion of Paneer tikka millet bowl"
          style={styles.swapBtn}
        >
          <Text style={styles.swapBtnText}>Swap</Text>
        </Tap>
      </View>

      {/* Add more */}
      <View>
        <SectionTitle title="Add more" meta="Light add-ons" />
        <View style={styles.grid}>
          {ADD_ONS.map(a => (
            <View key={a.name} style={[ui.card, styles.addOn]}>
              <View style={styles.addOnTop}>
                <Image
                  source={a.image}
                  accessibilityLabel={a.name}
                  resizeMode="cover"
                  style={styles.addOnImage}
                />
                <AddButton name={a.name} />
              </View>
              <View style={styles.addOnName}>
                <ItemName
                  name={a.name}
                  diet="veg"
                  markTop={2}
                  textStyle={styles.addOnNameText}
                  header
                />
              </View>
              <Text style={[ui.meta12, styles.mt2]}>{a.meta}</Text>
              <KcalRow
                kcal={a.kcal}
                unit={a.unit}
                price={a.price}
                gap={8}
                style={styles.addOnPrice}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Coupon + bill */}
      <View style={styles.billSection}>
        <Tap style={[ui.card, styles.coupon]}>
          <Icon name="tag" size={20} color={colors.turmericDeep} />
          <Text style={styles.couponText}>Apply coupon</Text>
          <Icon name="chevronRight" size={20} color={colors.ink3} />
        </Tap>
        <View style={[ui.card, ui.cardPad]}>
          <Text style={[type.h3, styles.billTitle]} accessibilityRole="header">
            Bill details
          </Text>
          <View style={styles.bill}>
            {BILL.map(([k, v]) => (
              <View key={k} style={styles.billRow}>
                <Text style={[styles.billText, styles.billKey]}>{k}</Text>
                <Text style={styles.billText}>{v}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalKey}>To pay</Text>
              <Text style={styles.totalValue}>₹673</Text>
            </View>
          </View>
        </View>
        <View style={styles.note}>
          <Icon name="leaf" size={16} color={colors.leaf} />
          <Text style={[ui.meta12, styles.shrink]}>
            Fresh items come in an insulated tote. Paper bags only.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  main: { paddingTop: 8, paddingHorizontal: 20, gap: 28 },
  mt2: { marginTop: 2 },
  shrink: { flexShrink: 1 },
  alignRight: { alignItems: 'flex-end' },

  divider: { marginVertical: 12 },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eta: { ...ff('body', 600), fontSize: 13, lineHeight: 18 },

  dayRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  dayKcal: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  dayKcalNum: { ...type.numeralXL, color: colors.turmericDeep },
  dayKcalLabel: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: colors.ink2 },
  dayPct: {
    ...ff('display', 700),
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: em(-0.01, 20),
  },
  fits: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  fitsText: {
    ...ff('body', 600),
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.leaf,
  },
  protein: {
    ...ff('body', 600),
    marginTop: 4,
    marginLeft: 24,
    fontSize: 12,
    lineHeight: 16,
    color: colors.proteinBlue,
  },

  groceriesTitle: { marginTop: 24, marginBottom: 12 },

  swap: {
    backgroundColor: colors.kcalCream,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.turmeric,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  swapTitle: { ...ff('body', 600), marginTop: 6, fontSize: 14, lineHeight: 20 },
  swapSub: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink2,
    fontVariant: ['tabular-nums'],
  },
  swapBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.forestInk,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapBtnText: { ...ff('body', 700), fontSize: 14, color: colors.forestInk },

  grid: { flexDirection: 'row', gap: 12 },
  addOn: { flex: 1, padding: 12 },
  addOnTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  addOnImage: { width: 44, height: 44, borderRadius: 12 },
  addOnName: { marginTop: 10 },
  addOnNameText: { fontSize: 13, lineHeight: 18 },
  addOnPrice: { marginTop: 'auto', paddingTop: 8 },

  billSection: { gap: 12 },
  coupon: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  couponText: { ...ff('body', 600), flex: 1, fontSize: 15, color: colors.forestInk },
  billTitle: { marginBottom: 14 },
  bill: { gap: 10 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  billText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.forestInk,
    fontVariant: ['tabular-nums'],
  },
  billKey: { color: colors.ink2 },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  totalKey: {
    ...ff('body', 700),
    fontSize: 16,
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
  },
  totalValue: {
    ...ff('display', 700),
    fontSize: 16,
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
  },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },

  payBar: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  payKcal: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  payKcalNum: {
    ...ff('display', 800),
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: em(-0.01, 20),
    color: colors.turmericDeep,
  },
  payKcalUnit: {
    ...ff('body', 700),
    fontSize: 12,
    lineHeight: 16,
    color: colors.turmericDeep,
  },
  payCta: { ...ff('body', 600), fontSize: 16, color: '#FFFFFF' },
});
