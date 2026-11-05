import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { images } from '../../assets/images';
import {
  AddButton,
  Button,
  Icon,
  Screen,
  ScreenHeader,
  Span,
  Tap,
  Text,
  Toast,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import {
  CartItemRow,
  DeliveryCard,
  ItemName,
  KcalRow,
  Link,
  Pill,
  SectionTitle,
  Thumb,
  ui,
  type CartItem,
} from './parts';

const OMELETTE: CartItem = {
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
};

const PICKS = [
  { name: 'Moong sprout chaat', image: images.moongSproutsThumb, kcal: 180, price: '₹149' },
  { name: 'Berry muesli yogurt bowl', image: images.berryMuesliBowl, kcal: 340, price: '₹199' },
  { name: 'Light dal khichdi', image: undefined, kcal: 310, price: '₹169' },
];

/** 3.4 Cart states — design file: Cart-States.dc.html */
export default function CartStatesScreen() {
  const nav = useNav();
  const [qty, setQty] = useState(1);

  return (
    <Screen header={<ScreenHeader />} contentStyle={styles.board} bottomGap={20}>
      <View>
        <Text style={type.eyebrow}>STATES · CART</Text>
        <Text style={[type.h2, styles.mt6]} accessibilityRole="header">
          Errors, undo & empty states
        </Text>
      </View>

      {/* Cart · item removed */}
      <View style={styles.section}>
        <Text style={[ui.eyebrowMuted, styles.label]}>CART · ITEM REMOVED</Text>
        <SectionTitle title="Meals" meta="From 1 kitchen" />
        <View style={ui.card}>
          <CartItemRow
            item={OMELETTE}
            qty={qty}
            onQty={q => setQty(Math.max(1, q))}
            first
          />
        </View>
        <Toast
          message="Removed Paneer tikka millet bowl · −420 kcal"
          action="Undo"
          style={styles.toast}
        />
      </View>

      {/* Cart · sold out */}
      <View style={styles.section}>
        <Text style={[ui.eyebrowMuted, styles.label]}>CART · SOLD OUT</Text>
        <View style={[ui.card, ui.cardPad]}>
          <View style={[styles.soldItem, styles.faded]}>
            <Thumb
              label="Paneer tikka millet bowl, photo coming soon"
              size={72}
              radius={14}
            />
            <View style={ui.flex}>
              <ItemName name="Paneer tikka millet bowl" diet="veg" header />
              <Text style={[ui.meta13, styles.mt2]}>Green Fork Kitchen</Text>
              <KcalRow kcal={420} price="₹249" style={styles.mt8} />
            </View>
          </View>
          <View style={styles.soldActions}>
            <Pill label="Sold out today" bg={colors.chiliMist} fg={colors.chili} />
            <Tap
              accessibilityLabel="Remove Paneer tikka millet bowl"
              hitSlop={{ left: 8, right: 8 }}
              style={styles.remove}
            >
              <Icon name="trash" size={20} color={colors.forestInk} />
              <Text style={styles.removeText}>Remove</Text>
            </Tap>
          </View>
          <Tap
            accessibilityLabel="Swap Paneer tikka millet bowl for Light dal khichdi, 310 kcal"
            style={styles.swap}
          >
            <Text style={styles.swapText} numberOfLines={1}>
              Swap: Light dal khichdi ·{' '}
              <Span style={styles.swapKcal}>310 kcal</Span>
            </Text>
          </Tap>
        </View>
      </View>

      {/* Address · out of zone */}
      <View style={styles.section}>
        <Text style={[ui.eyebrowMuted, styles.label]}>ADDRESS · OUT OF ZONE</Text>
        <DeliveryCard
          title="Delivering to Work"
          address="4th floor, 80 Feet Road, Koramangala"
        >
          <View accessibilityRole="alert" style={styles.alert}>
            <Icon name="alertCircle" size={20} color={colors.chili} />
            <View style={ui.flex}>
              <Text style={styles.alertTitle}>Protein Pot doesn’t deliver to Work</Text>
              <View style={styles.alertActions}>
                <Link
                  label="Change address"
                  color={colors.chili}
                  textStyle={styles.underline}
                  onPress={() => nav.navigate('Location')}
                />
                <Text
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                  style={styles.alertDot}
                >
                  ·
                </Text>
                <Tap hitSlop={{ left: 8, right: 8 }} style={styles.alertBtn}>
                  <Text style={[type.link, styles.alertBtnText]}>Remove 1 item</Text>
                </Tap>
              </View>
            </View>
          </View>
        </DeliveryCard>
      </View>

      {/* Payment · failed */}
      <View style={styles.section}>
        <Text style={[ui.eyebrowMuted, styles.label]}>PAYMENT · FAILED</Text>
        <View style={styles.scrim}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.failIcon}>
              <Icon name="alertCircle" size={24} color={colors.chili} />
            </View>
            <Text style={[type.h2, styles.mt16]} accessibilityRole="header">
              Payment didn’t go through
            </Text>
            <Text style={[type.body, styles.mt8]}>
              ₹673 not charged. If money left your account it’s refunded in 3–5 days.
            </Text>
            <Button label="Retry Google Pay" style={styles.mt24} />
            <Button variant="secondary" label="Pay another way" style={styles.mt12} />
          </View>
        </View>
      </View>

      {/* Cart · empty */}
      <View style={styles.section}>
        <Text style={[ui.eyebrowMuted, styles.label]}>CART · EMPTY</Text>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Icon name="bag" size={24} color={colors.ink2} />
          </View>
          <Text style={[type.h2, styles.mt16, styles.center]} accessibilityRole="header">
            Your cart is empty
          </Text>
          <Text style={[type.body, styles.mt4, styles.center]}>
            <Span style={styles.leftToday}>1,020 kcal left today</Span> — here are 3 picks
          </Text>
        </View>
        <View style={[ui.card, styles.mt16]}>
          {PICKS.map((p, i) => (
            <View key={p.name} style={[styles.pick, i === 0 ? null : ui.rowTop]}>
              <Tap
                accessibilityRole="link"
                onPress={() => nav.navigate('Meal')}
                pressScale={0.99}
                style={styles.pickLink}
              >
                <Thumb image={p.image} size={56} radius={12} placeholderLabel={null} />
                <View style={ui.flex}>
                  <ItemName name={p.name} diet="veg" />
                  <KcalRow kcal={p.kcal} price={p.price} style={styles.mt2} />
                </View>
              </Tap>
              <AddButton name={p.name} />
            </View>
          ))}
        </View>
        <Button
          label="Browse meals"
          style={styles.mt16}
          onPress={() => nav.navigate('Home')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  board: { paddingTop: 20, paddingHorizontal: 20 },
  section: { marginTop: 32 },
  label: { marginBottom: 12 },
  mt2: { marginTop: 2 },
  mt4: { marginTop: 4 },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
  center: { textAlign: 'center' },

  /* The board draws this toast flat (no elevation). */
  toast: { marginTop: 12, boxShadow: [] },

  soldItem: { flexDirection: 'row', gap: 12 },
  faded: { opacity: 0.5 },
  soldActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  remove: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  removeText: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: colors.forestInk },
  swap: {
    height: 44,
    marginTop: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.forestInk,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapText: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: colors.forestInk },
  swapKcal: { ...ff('body', 700), color: colors.turmericDeep },

  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.chiliMist,
  },
  alertTitle: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: colors.chili },
  alertActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 2 },
  alertDot: { fontSize: 14, lineHeight: 20, color: colors.chili },
  alertBtn: { minHeight: 44, justifyContent: 'center' },
  alertBtnText: { color: colors.chili, textDecorationLine: 'underline' },
  underline: { textDecorationLine: 'underline' },

  scrim: { marginHorizontal: -20, paddingTop: 40, backgroundColor: colors.scrim },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    marginBottom: 20,
    borderRadius: 999,
    backgroundColor: colors.mapLine,
  },
  failIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.chiliMist,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { alignItems: 'center', paddingTop: 8 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftToday: { ...ff('body', 700), color: colors.turmericDeep },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  pickLink: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
});
