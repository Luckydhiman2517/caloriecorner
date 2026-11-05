import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { ff } from '../theme/fonts';
import { Tap } from './Tap';
import { Text } from './Text';

/**
 * Chip · 36px visual inside a 44px hit (07.5).
 * off    · white + 1px Line Strong, Forest Ink 14px 500
 * on     · Forest Ink, white text
 * kcal   · kcal filter on: Turmeric with Forest Ink text
 */
export function Chip({
  label,
  state = 'off',
  left,
  right,
  onPress,
  style,
  accessibilityLabel,
}: {
  label: string;
  state?: 'off' | 'on' | 'kcal';
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const s = STATES[state];
  return (
    <Tap
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: state !== 'off' }}
      style={[styles.hit, style]}
    >
      <View
        style={[
          styles.chip,
          s.box,
          left ? styles.withLeft : null,
          right ? styles.withRight : null,
        ]}
      >
        {left}
        <Text style={[styles.text, s.text]} numberOfLines={1}>
          {label}
        </Text>
        {right}
      </View>
    </Tap>
  );
}

const STATES = {
  off: StyleSheet.create({
    box: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.lineStrong,
    },
    text: { color: colors.forestInk },
  }),
  on: StyleSheet.create({
    box: { backgroundColor: colors.forestInk, borderWidth: 1, borderColor: colors.forestInk },
    text: { color: '#FFFFFF' },
  }),
  kcal: StyleSheet.create({
    box: { backgroundColor: colors.turmeric, borderWidth: 1, borderColor: colors.turmeric },
    text: { color: colors.forestInk },
  }),
};

const styles = StyleSheet.create({
  hit: { height: 44, justifyContent: 'center' },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  withLeft: { paddingLeft: 12 },
  withRight: { paddingRight: 10 },
  text: { ...ff('body', 500), fontSize: 14, lineHeight: 20 },
});
