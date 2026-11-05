import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { ff } from '../theme/fonts';
import { Icon } from './Icon';
import { Tap } from './Tap';
import { Text } from './Text';

type StepperProps = {
  qty: number;
  onChange: (qty: number) => void;
  /** Item name, for "Remove <item>" / "Increase <item>" labels. */
  name?: string;
  /**
   * compact  · cards: 36px visual pill in a 44px hit, 40px buttons
   * standard · 44×44 buttons, 1.5px Forest Ink pill
   * bar      · bottom bar: 52 high, r14, 48×52 buttons
   */
  size?: 'compact' | 'standard' | 'bar';
  style?: StyleProp<ViewStyle>;
};

/** Qty stepper (07.8). At qty 1 the minus becomes trash ("Remove <item>"). */
export function Stepper({
  qty,
  onChange,
  name = 'item',
  size = 'compact',
  style,
}: StepperProps) {
  const s = SIZES[size];
  const atOne = qty <= 1;
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={`${name}, quantity ${qty}`}
      style={[s.wrap, style]}
    >
      <View style={s.ring} pointerEvents="none" />
      <Tap
        accessibilityLabel={atOne ? `Remove ${name}` : `Decrease ${name}`}
        onPress={() => onChange(qty - 1)}
        style={s.btn}
      >
        <Icon name={atOne ? 'trash' : 'minus'} size={16} color={colors.forestInk} />
      </Tap>
      <Text style={styles.count}>{qty}</Text>
      <Tap
        accessibilityLabel={`Increase ${name}`}
        onPress={() => onChange(qty + 1)}
        style={s.btn}
      >
        <Icon name="plus" size={16} color={colors.forestInk} />
      </Tap>
    </View>
  );
}

/** ADD · 36px visual in a 44px hit, 1.5px Forest Ink, 13px 700 0.04em. */
export function AddButton({
  onPress,
  name = 'item',
  label = 'ADD',
  style,
}: {
  onPress?: () => void;
  name?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      accessibilityLabel={`Add ${name}`}
      onPress={onPress}
      style={[styles.addHit, style]}
    >
      <View style={styles.add}>
        <Text style={styles.addText}>{label}</Text>
      </View>
    </Tap>
  );
}

/**
 * ADD that turns into the compact stepper once added (07.9).
 * Manages its own quantity; starts at `initialQty`.
 */
export function AddOrStepper({
  initialQty = 0,
  name,
  onChange,
  style,
}: {
  initialQty?: number;
  name?: string;
  onChange?: (qty: number) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const [qty, setQty] = useState(initialQty);
  const update = (q: number) => {
    const next = Math.max(0, q);
    setQty(next);
    onChange?.(next);
  };
  if (qty === 0) {
    return <AddButton name={name} onPress={() => update(1)} style={style} />;
  }
  return <Stepper qty={qty} onChange={update} name={name} style={style} />;
}

const SIZES = {
  compact: StyleSheet.create({
    wrap: { height: 44, flexDirection: 'row', alignItems: 'center' },
    ring: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 4,
      bottom: 4,
      borderWidth: 1.5,
      borderColor: colors.forestInk,
      borderRadius: 999,
      backgroundColor: colors.surface,
    },
    btn: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  }),
  standard: StyleSheet.create({
    wrap: { height: 44, flexDirection: 'row', alignItems: 'center' },
    ring: {
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
    btn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  }),
  bar: StyleSheet.create({
    wrap: { height: 52, flexDirection: 'row', alignItems: 'center' },
    ring: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      borderWidth: 1.5,
      borderColor: colors.forestInk,
      borderRadius: 14,
      backgroundColor: colors.surface,
    },
    btn: { width: 48, height: 52, alignItems: 'center', justifyContent: 'center' },
  }),
};

const styles = StyleSheet.create({
  count: {
    ...ff('display', 700),
    minWidth: 24,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    color: colors.forestInk,
  },
  addHit: { height: 44, justifyContent: 'center' },
  add: {
    height: 36,
    minWidth: 64,
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
    letterSpacing: 13 * 0.04,
    color: colors.forestInk,
  },
});
