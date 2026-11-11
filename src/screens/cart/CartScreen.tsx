import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
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
import {
  ADD_ON_IDS,
  DAY_EATEN,
  DAY_TARGET,
  DELIVERY_FEE,
  PRODUCTS,
  groupDigits,
  inr,
  orderSummary,
  plural,
  useCart,
  type CartLine,
} from '../../state/cart';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';
import { CouponSheet } from './CouponSheet';
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

/** A cart line in the shape the item row draws. */
function toItem(l: CartLine): CartItem {
  const meal = l.product.kind === 'meal';
  return {
    id: l.product.id,
    name: l.product.name,
    diet: l.product.diet,
    image: l.product.image,
    photoLabel: l.product.photoLabel,
    meta: l.product.meta,
    protein: meal ? `${l.protein} g protein` : undefined,
    portion: meal ? (l.isLight ? 'Light' : 'Regular') : undefined,
    editable: l.product.editable,
    notCounted: !meal,
    kcal: l.kcal,
    unit: l.product.unit,
    price: inr(l.price),
  };
}

/** 3.1 Cart — design file: Cart-Cart.dc.html */
export default function CartScreen() {
  const nav = useNav();
  const cart = useCart();
  const [couponsOpen, setCouponsOpen] = useState(false);

  const over = cart.dayLeft < 0;
  const leftLabel = over
    ? `${groupDigits(-cart.dayLeft)} over`
    : `${groupDigits(cart.dayLeft)} left`;
  const couponOn = !!cart.coupon && cart.couponShortfall === 0;
  const saving = cart.discount + (DELIVERY_FEE - cart.delivery);
  const swapLine = cart.meals.find(l => l.product.light);
  const addOns = PRODUCTS.filter(
    p => ADD_ON_IDS.includes(p.id) && cart.qtyOf(p.id) === 0,
  );

  if (!cart.items) {
    return (
      <Screen
        header={
          <ScreenHeader
            title="Your cart"
            subtitle="Nothing added yet"
            onBack={() => nav.navigate('Home')}
          />
        }
        contentStyle={styles.main}
      >
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Icon name="bag" size={24} color={colors.ink2} />
          </View>
          <Text style={[type.h2, styles.emptyTitle]} accessibilityRole="header">
            Your cart is empty
          </Text>
          <Text style={[type.body, styles.emptyBody]}>
            <Text style={styles.leftToday}>
              {groupDigits(DAY_TARGET - DAY_EATEN)} kcal left today
            </Text>{' '}
            — find a meal that fits.
          </Text>
          <Button
            label="Browse meals"
            style={styles.emptyCta}
            onPress={() => nav.navigate('Home')}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      header={
        <ScreenHeader
          title="Your cart"
          subtitle={orderSummary(cart)}
          onBack={() => nav.navigate('Home')}
        />
      }
      contentStyle={styles.main}
      bottomGap={20}
      footer={
        <BottomBar style={styles.payBar}>
          <View
            accessible
            accessibilityLabel={`${groupDigits(
              cart.mealKcal,
            )} kcal in meals, ${inr(cart.toPay)} to pay for ${plural(
              cart.items,
              'item',
              'items',
            )}`}
          >
            <View style={styles.payKcal}>
              <Text style={styles.payKcalNum} numberOfLines={1}>
                {groupDigits(cart.mealKcal)}
              </Text>
              <Text style={styles.payKcalUnit} numberOfLines={1}>
                kcal in meals
              </Text>
            </View>
            <Text style={[ui.price, styles.mt2]}>
              {inr(cart.toPay)} · {plural(cart.items, 'item', 'items')}
            </Text>
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
            <Text style={[styles.dayKcalNum, over ? styles.overText : null]}>
              {groupDigits(cart.mealKcal)}
            </Text>
            <Text style={styles.dayKcalLabel}>kcal in meals</Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.dayPct}>{cart.dayPct}%</Text>
            <Text style={ui.meta12}>of today’s target</Text>
          </View>
        </View>
        <SplitBar
          height={12}
          eaten={colors.ink2}
          order={over ? colors.chili : colors.turmeric}
          rest={colors.stone}
          restBorder={colors.mapLine}
          eatenPart={DAY_EATEN / DAY_TARGET}
          orderPart={cart.mealKcal / DAY_TARGET}
          accessibilityLabel={`Today: ${groupDigits(
            DAY_EATEN,
          )} kcal eaten, ${groupDigits(
            cart.mealKcal,
          )} kcal in this order, ${leftLabel} of ${groupDigits(DAY_TARGET)}`}
        />
        <Legend
          color={colors.ink2}
          eaten={colors.ink2}
          order={over ? colors.chili : colors.turmeric}
          rest={colors.stone}
          restBorder={colors.mapLine}
          labels={[
            `${groupDigits(DAY_EATEN)} eaten`,
            `${groupDigits(cart.mealKcal)} this order`,
            leftLabel,
          ]}
        />
        <View style={styles.fits}>
          <Icon
            name={over ? 'alertCircle' : 'check'}
            size={16}
            color={over ? colors.chili : colors.leaf}
          />
          <Text style={[styles.fitsText, over ? styles.overText : null]}>
            {over
              ? `${groupDigits(-cart.dayLeft)} kcal over today’s target`
              : `Fits your goal · ${groupDigits(cart.dayLeft)} kcal left today`}
          </Text>
        </View>
        {cart.mealUnits ? (
          <Text style={styles.protein}>
            {cart.protein} g protein · {cart.proteinPct}% of 120 g
          </Text>
        ) : null}
      </View>

      {/* Meals + groceries */}
      <View>
        {cart.meals.length ? (
          <>
            <SectionTitle
              title="Meals"
              meta={`From ${plural(cart.kitchens, 'kitchen', 'kitchens')}`}
            />
            <View style={ui.card}>
              {cart.meals.map((l, i) => (
                <CartItemRow
                  key={l.product.id}
                  item={toItem(l)}
                  qty={l.qty}
                  onQty={q => cart.setQty(l.product.id, q)}
                  first={i === 0}
                />
              ))}
            </View>
          </>
        ) : null}

        {cart.groceries.length ? (
          <>
            <Text
              style={[
                type.h3,
                styles.groceriesTitle,
                cart.meals.length ? null : styles.groceriesFirst,
              ]}
              accessibilityRole="header"
            >
              Groceries · arrives with your meals
            </Text>
            <View style={ui.card}>
              {cart.groceries.map((l, i) => (
                <CartItemRow
                  key={l.product.id}
                  item={toItem(l)}
                  qty={l.qty}
                  onQty={q => cart.setQty(l.product.id, q)}
                  first={i === 0}
                />
              ))}
            </View>
          </>
        ) : null}
      </View>

      {/* Swap & save */}
      {swapLine?.product.light ? (
        <SwapCard
          line={swapLine}
          onSwap={on => cart.setLight(swapLine.product.id, on)}
        />
      ) : null}

      {/* Add more */}
      {addOns.length ? (
        <View>
          <SectionTitle title="Add more" meta="Light add-ons" />
          <View style={styles.grid}>
            {addOns.map(a => (
              <View key={a.id} style={[ui.card, styles.addOn]}>
                <View style={styles.addOnTop}>
                  <Image
                    source={a.image}
                    accessibilityLabel={a.name}
                    resizeMode="cover"
                    style={styles.addOnImage}
                  />
                  <AddButton name={a.name} onPress={() => cart.add(a.id)} />
                </View>
                <View style={styles.addOnName}>
                  <ItemName
                    name={a.name}
                    diet={a.diet}
                    markTop={2}
                    textStyle={styles.addOnNameText}
                    header
                  />
                </View>
                <Text style={[ui.meta12, styles.mt2]}>{a.meta}</Text>
                <KcalRow
                  kcal={a.kcal}
                  unit={a.unit}
                  price={inr(a.price)}
                  gap={8}
                  style={styles.addOnPrice}
                />
              </View>
            ))}
            {addOns.length === 1 ? <View style={ui.flex} /> : null}
          </View>
        </View>
      ) : null}

      {/* Coupon + bill */}
      <View style={styles.billSection}>
        <Tap
          onPress={() => setCouponsOpen(true)}
          accessibilityLabel={
            cart.coupon ? `Coupon ${cart.coupon.code}, change` : 'Apply coupon'
          }
          style={[ui.card, styles.coupon]}
        >
          <Icon
            name="tag"
            size={20}
            color={couponOn ? colors.leaf : colors.turmericDeep}
          />
          {cart.coupon ? (
            <View style={ui.flex}>
              <Text style={styles.couponText}>{cart.coupon.code} applied</Text>
              <Text style={couponOn ? styles.couponSave : styles.couponShort}>
                {couponOn
                  ? `You save ${inr(saving)}`
                  : `Add ${inr(cart.couponShortfall)} more to use this code`}
              </Text>
            </View>
          ) : (
            <Text style={[styles.couponText, ui.flex]}>Apply coupon</Text>
          )}
          {cart.coupon ? (
            <Tap
              onPress={cart.removeCoupon}
              accessibilityLabel={`Remove coupon ${cart.coupon.code}`}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            >
              <Text style={styles.remove}>Remove</Text>
            </Tap>
          ) : (
            <Icon name="chevronRight" size={20} color={colors.ink3} />
          )}
        </Tap>
        <View style={[ui.card, ui.cardPad]}>
          <Text style={[type.h3, styles.billTitle]} accessibilityRole="header">
            Bill details
          </Text>
          <View style={styles.bill}>
            <BillRow label="Item total" value={inr(cart.itemTotal)} />
            {cart.discount ? (
              <BillRow
                label={`Coupon · ${cart.coupon?.code}`}
                value={`−${inr(cart.discount)}`}
                good
              />
            ) : null}
            <BillRow
              label="Delivery"
              value={cart.delivery ? inr(cart.delivery) : 'Free'}
              good={!cart.delivery}
            />
            <BillRow label="Platform fee" value={inr(cart.platform)} />
            <BillRow label="GST & charges" value={inr(cart.gst)} />
            <View style={styles.totalRow}>
              <Text style={styles.totalKey}>To pay</Text>
              <Text style={styles.totalValue}>{inr(cart.toPay)}</Text>
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

      <CouponSheet
        visible={couponsOpen}
        onClose={() => setCouponsOpen(false)}
      />
    </Screen>
  );
}

function BillRow({
  label,
  value,
  good = false,
}: {
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billText, styles.billKey]}>{label}</Text>
      <Text style={[styles.billText, good ? styles.billGood : null]}>
        {value}
      </Text>
    </View>
  );
}

/**
 * "Swap & save": offers the lighter portion of a meal in the cart, and once
 * swapped shows what was saved with an Undo.
 */
function SwapCard({
  line,
  onSwap,
}: {
  line: CartLine;
  onSwap: (light: boolean) => void;
}) {
  const p = line.product;
  if (!p.light) {
    return null;
  }
  const saveKcal = (p.kcal - p.light.kcal) * line.qty;
  const savePrice = (p.price - p.light.price) * line.qty;
  const name = p.shortName ?? p.name;
  const swapped = line.isLight;
  return (
    <View style={[styles.swap, swapped ? styles.swapDone : null]}>
      <View style={ui.flex}>
        <Text
          style={[type.eyebrow, swapped ? styles.swapDoneLabel : null]}
          accessibilityRole="header"
        >
          {swapped ? 'Swapped' : 'Swap & save'}
        </Text>
        <Text style={styles.swapTitle}>
          {swapped
            ? `Your ${name} is now Light — saving ${saveKcal} kcal and ${inr(
                savePrice,
              )}`
            : `Make the ${name} Light — save ${saveKcal} kcal and ${inr(
                savePrice,
              )}`}
        </Text>
        <Text style={styles.swapSub}>
          {swapped
            ? `Regular was ${p.kcal} kcal · ${inr(p.price)}`
            : `Light portion: ${p.light.kcal} kcal · ${inr(p.light.price)}`}
        </Text>
      </View>
      <Tap
        onPress={() => onSwap(!swapped)}
        accessibilityLabel={
          swapped
            ? `Undo swap, back to Regular ${p.name}`
            : `Swap to Light portion of ${p.name}`
        }
        style={styles.swapBtn}
      >
        <Text style={styles.swapBtnText}>{swapped ? 'Undo' : 'Swap'}</Text>
      </Tap>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { paddingTop: 8, paddingHorizontal: 20, gap: 28 },
  mt2: { marginTop: 2 },
  shrink: { flexShrink: 1 },
  alignRight: { alignItems: 'flex-end' },
  overText: { color: colors.chili },

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
  dayKcalLabel: {
    ...ff('body', 600),
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink2,
  },
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
  groceriesFirst: { marginTop: 0 },

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
  swapDone: {
    backgroundColor: colors.leafMist,
    borderStyle: 'solid',
    borderColor: colors.leaf,
  },
  swapDoneLabel: { color: colors.leaf },
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
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  couponText: { ...ff('body', 600), fontSize: 15, color: colors.forestInk },
  couponSave: {
    ...ff('body', 600),
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: colors.leaf,
  },
  couponShort: {
    ...ff('body', 600),
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: colors.turmericDeep,
  },
  remove: { ...ff('body', 700), fontSize: 14, color: colors.turmericDeep },
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
  billGood: { ...ff('body', 600), color: colors.leaf },
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

  empty: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { marginTop: 16, textAlign: 'center' },
  emptyBody: { marginTop: 4, textAlign: 'center' },
  leftToday: { ...ff('body', 700), color: colors.turmericDeep },
  emptyCta: { marginTop: 24, alignSelf: 'stretch' },
});
