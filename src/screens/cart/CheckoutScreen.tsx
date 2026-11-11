import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomBar,
  Button,
  Icon,
  IconTile,
  Kcal,
  Screen,
  ScreenHeader,
  Tap,
  Text,
  type IconName,
} from '../../components';
import { useNav } from '../../navigation/types';
import { groupDigits, inr, plural, useCart } from '../../state/cart';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import { DayPill, Link, OrderItemRow, Pill, ui, useOrderLines } from './parts';

type When = 'now' | 'schedule';
type Pay = 'gpay' | 'phonepe' | 'paytm' | 'card' | 'cod' | 'wallet';

const UPI_APPS: { value: Pay; title: string; subtitle: string }[] = [
  { value: 'gpay', title: 'Google Pay', subtitle: 'aarav@okaxis' },
  { value: 'phonepe', title: 'PhonePe', subtitle: 'Opens the PhonePe app' },
  { value: 'paytm', title: 'Paytm', subtitle: 'Opens the Paytm app' },
];

const OTHER_PAY: {
  value: Pay;
  title: string;
  subtitle: string;
  icon: IconName;
  disabled?: boolean;
}[] = [
  {
    value: 'card',
    title: 'Credit / debit card',
    subtitle: 'Visa, Mastercard, RuPay',
    icon: 'card',
  },
  { value: 'cod', title: 'Cash on delivery', subtitle: 'Pay at your door', icon: 'cash' },
  {
    value: 'wallet',
    title: 'Calorie Corner wallet',
    subtitle: '₹0 balance',
    icon: 'wallet',
    disabled: true,
  },
];

/** Names used in the pay button ("Pay ₹673 via Google Pay"). */
const PAY_NAMES: Record<Pay, string> = {
  gpay: 'Google Pay',
  phonepe: 'PhonePe',
  paytm: 'Paytm',
  card: 'Credit / debit card',
  cod: 'Cash on delivery',
  wallet: 'Calorie Corner wallet',
};

const INSTRUCTIONS = ['Leave at door', 'Don’t ring bell', 'Call on arrival'];

/** 3.2 Checkout — design file: Cart-Checkout.dc.html */
export default function CheckoutScreen() {
  const nav = useNav();
  const cart = useCart();
  const orderLines = useOrderLines();
  const [when, setWhen] = useState<When>('now');
  const [pay, setPay] = useState<Pay>('gpay');
  const [notes, setNotes] = useState<Record<string, boolean>>({
    'Leave at door': true,
  });

  return (
    <Screen
      header={
        <ScreenHeader
          title="Checkout"
          backLabel="Back to cart"
          onBack={() => nav.navigate('Cart')}
        />
      }
      contentStyle={styles.main}
      bottomGap={20}
      footer={
        <BottomBar>
          <View style={styles.secure}>
            <Icon name="lock" size={16} color={colors.ink3} />
            <Text style={ui.meta12}>Secured payment · Free cancellation for 60 sec</Text>
          </View>
          <Button
            label={`Pay ${inr(cart.toPay)} via ${PAY_NAMES[pay]}`}
            textStyle={ui.tabular}
            onPress={() => nav.navigate('Tracking')}
          />
        </BottomBar>
      }
    >
      {/* Deliver to */}
      <View>
        <Text style={[type.h3, styles.mb12]} accessibilityRole="header">
          Deliver to
        </Text>
        <View style={[ui.card, ui.cardPad, styles.addr]}>
          <IconTile
            icon="home"
            iconSize={20}
            background={colors.kcalCream}
            color={colors.turmericDeep}
          />
          <View style={ui.flex}>
            <Text style={styles.addrTitle}>Home</Text>
            <Text style={[styles.addrLine, styles.mt2]}>
              Flat 402, 27th Main, HSR Layout Sector 2, Bengaluru
            </Text>
            <Text style={[ui.meta13, ui.tabular, styles.mt2]}>
              Aarav K. · +91 98XXX XX210
            </Text>
          </View>
          <Link
            label="Change"
            accessibilityLabel="Change delivery address"
            onPress={() => nav.navigate('Location')}
          />
        </View>
        <Link
          label="Add new address"
          left={<Icon name="plus" size={20} color={colors.turmericDeep} />}
          onPress={() => nav.navigate('Location')}
          style={styles.addAddress}
        />
      </View>

      {/* When */}
      <View accessibilityRole="radiogroup">
        <Text style={[type.h3, styles.mb12]} accessibilityRole="header">
          When
        </Text>
        <View style={styles.stack}>
          <ChoiceRow
            title="Now"
            subtitle="25–30 min · one delivery"
            tabularSubtitle
            selected={when === 'now'}
            onPress={() => setWhen('now')}
            leading={<IconTile icon="clock" />}
          />
          <ChoiceRow
            title="Schedule"
            subtitle="Pick a slot"
            selected={when === 'schedule'}
            onPress={() => setWhen('schedule')}
            leading={<IconTile icon="calendar" />}
          />
        </View>
      </View>

      {/* Pay with */}
      <View accessibilityRole="radiogroup">
        <Text style={[type.h3, styles.mb12]} accessibilityRole="header">
          Pay with
        </Text>
        <View style={styles.stack}>
          <View style={[ui.card, styles.upi]}>
            <View style={styles.upiHead}>
              <IconTile icon="phone" />
              <View style={ui.flex}>
                <View style={styles.upiTitleRow}>
                  <Text style={styles.choiceTitle}>UPI</Text>
                  <Pill label="Instant" bg={colors.leafMist} fg={colors.leaf} />
                </View>
                <Text style={ui.meta13}>Pay from any UPI app</Text>
              </View>
            </View>
            <View style={styles.upiList}>
              {UPI_APPS.map(a => (
                <ChoiceRow
                  key={a.value}
                  title={a.title}
                  subtitle={a.subtitle}
                  selected={pay === a.value}
                  onPress={() => setPay(a.value)}
                  leading={<IconTile icon="phone" size={36} iconSize={20} />}
                  minHeight={60}
                  radius={14}
                  padV={10}
                />
              ))}
              <Tap style={styles.addUpi}>
                <View style={styles.addUpiIcon}>
                  <Icon name="plus" size={20} color={colors.turmericDeep} />
                </View>
                <Text style={type.link}>Add another UPI ID</Text>
              </Tap>
            </View>
          </View>

          {OTHER_PAY.map(p => (
            <ChoiceRow
              key={p.value}
              title={p.title}
              subtitle={p.subtitle}
              tabularSubtitle={p.value === 'wallet'}
              selected={pay === p.value}
              onPress={() => setPay(p.value)}
              leading={<IconTile icon={p.icon} />}
              minHeight={60}
              padV={10}
              disabled={p.disabled}
            />
          ))}
        </View>
      </View>

      {/* Order summary */}
      <View style={[ui.card, ui.cardPad]}>
        <View style={styles.sumHead}>
          <Text style={ui.eyebrowMuted} accessibilityRole="header">
            Order summary
          </Text>
          <Tap
            accessibilityRole="link"
            onPress={() => nav.navigate('Cart')}
            hitSlop={{ top: 14, bottom: 14, left: 4, right: 4 }}
          >
            <Text style={styles.editCart}>Edit cart</Text>
          </Tap>
        </View>
        <View style={styles.sumLine}>
          <View style={styles.sumLeft}>
            {cart.mealUnits ? (
              <>
                <Text style={styles.sumText} numberOfLines={1}>
                  {plural(cart.mealUnits, 'meal', 'meals')} ·
                </Text>
                <Kcal value={groupDigits(cart.mealKcal)} />
              </>
            ) : null}
            {cart.groceryUnits ? (
              <Text style={styles.sumText} numberOfLines={1}>
                {cart.mealUnits ? '+ ' : ''}
                {plural(cart.groceryUnits, 'grocery', 'groceries')}
              </Text>
            ) : null}
          </View>
          <Text style={ui.price} numberOfLines={1}>
            {inr(cart.toPay)}
          </Text>
        </View>
        <View style={styles.sumList}>
          {orderLines.map(l => (
            <OrderItemRow key={l.name} line={l} style={[styles.sumRow, ui.rowTop]} />
          ))}
        </View>
        <DayPill style={styles.mt4} />
      </View>

      {/* Delivery instructions */}
      <View>
        <Text style={[type.h3, styles.mb8]} accessibilityRole="header">
          Delivery instructions
        </Text>
        <View style={styles.chips}>
          {INSTRUCTIONS.map(label => (
            <ToggleChip
              key={label}
              label={label}
              on={!!notes[label]}
              onPress={() => setNotes(prev => ({ ...prev, [label]: !prev[label] }))}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

/* ───────────── Local pieces ───────────── */

/** 24px radio · on: Forest Ink disc + 14px check (stroke 2.6); off: 1.5px Line Strong. */
function RadioMark({ selected }: { selected: boolean }) {
  return selected ? (
    <View style={styles.radioOn}>
      <Icon name="check" size={14} color="#FFFFFF" strokeWidth={2.6} />
    </View>
  ) : (
    <View style={styles.radioOff} />
  );
}

/**
 * Radio row: white, 1px Line (2px Forest Ink when selected, padding −1),
 * leading tile, title 16/22 600, subtitle 13/18 Ink-3, radio at the end.
 */
function ChoiceRow({
  title,
  subtitle,
  tabularSubtitle,
  selected,
  onPress,
  leading,
  minHeight = 72,
  radius = 18,
  padV = 14,
  disabled,
}: {
  title: string;
  subtitle: string;
  tabularSubtitle?: boolean;
  selected: boolean;
  onPress: () => void;
  leading: ReactNode;
  minHeight?: number;
  radius?: number;
  padV?: number;
  disabled?: boolean;
}) {
  return (
    <Tap
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      pressScale={disabled ? 1 : 0.99}
      style={[
        styles.choice,
        selected ? styles.choiceOn : styles.choiceOff,
        {
          minHeight,
          borderRadius: radius,
          paddingVertical: selected ? padV - 1 : padV,
        },
        disabled ? styles.disabled : null,
      ]}
    >
      {leading}
      <View style={ui.flex}>
        <Text style={styles.choiceTitle}>{title}</Text>
        <Text style={[ui.meta13, tabularSubtitle ? ui.tabular : null]}>{subtitle}</Text>
      </View>
      <RadioMark selected={selected} />
    </Tap>
  );
}

/** Toggle chip · 36 visual in a 44 hit; on = Forest Ink with a 16px check. */
function ToggleChip({
  label,
  on,
  onPress,
}: {
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <Tap accessibilityState={{ selected: on }} onPress={onPress} style={styles.chipHit}>
      <View style={[styles.chip, on ? styles.chipOn : styles.chipOff]}>
        {on ? <Icon name="check" size={16} color="#FFFFFF" /> : null}
        <Text style={[styles.chipText, on ? styles.chipTextOn : null]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  main: { paddingTop: 8, paddingHorizontal: 20, gap: 28 },
  mt2: { marginTop: 2 },
  mt4: { marginTop: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  stack: { gap: 8 },

  addr: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addrTitle: { ...ff('body', 700), fontSize: 15, lineHeight: 20 },
  addrLine: { fontSize: 13, lineHeight: 18, color: colors.ink2 },
  addAddress: { marginTop: 4, alignSelf: 'flex-start' },

  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
  },
  choiceOff: { paddingHorizontal: 16, borderWidth: 1, borderColor: colors.line },
  choiceOn: { paddingHorizontal: 15, borderWidth: 2, borderColor: colors.forestInk },
  choiceTitle: {
    ...ff('body', 600),
    fontSize: 16,
    lineHeight: 22,
    color: colors.forestInk,
  },
  disabled: { opacity: 0.5 },
  radioOn: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.forestInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOff: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
  },

  upi: { paddingTop: 14, paddingHorizontal: 12, paddingBottom: 6 },
  upiHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 4,
  },
  upiTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  upiList: { gap: 8, marginTop: 12 },
  addUpi: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  addUpiIcon: { width: 36, alignItems: 'center' },

  sumHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  editCart: {
    ...ff('body', 600),
    fontSize: 12,
    lineHeight: 16,
    color: colors.turmericDeep,
  },
  sumLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  sumLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  sumText: { ...ff('body', 500), fontSize: 14, lineHeight: 20, color: colors.ink2 },
  sumList: { marginTop: 12 },
  sumRow: { paddingVertical: 12 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 8 },
  chipHit: { height: 44, justifyContent: 'center' },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipOn: { backgroundColor: colors.forestInk, borderColor: colors.forestInk },
  chipOff: { backgroundColor: colors.surface, borderColor: colors.lineStrong },
  chipText: { ...ff('body', 500), fontSize: 14, lineHeight: 20, color: colors.forestInk },
  chipTextOn: { color: '#FFFFFF' },

  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
});
