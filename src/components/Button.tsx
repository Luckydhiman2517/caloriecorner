import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { ff } from '../theme/fonts';
import { type } from '../theme/type';
import { Icon } from './Icon';
import { Tap } from './Tap';
import { Text } from './Text';

type ButtonProps = {
  label?: string;
  /** Custom content instead of `label` (e.g. label + kcal + price). */
  children?: ReactNode;
  onPress?: () => void;
  /**
   * primary   · 52 r14 Forest Ink, white 16px 600
   * secondary · 52 r14 white, 1px Line Strong, Forest Ink 16px 600
   * accent    · 44 pill Turmeric, Forest Ink 15px 700 (on dark bars only)
   */
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  left?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

export function Button({
  label,
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  loadingLabel,
  left,
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  const v = VARIANTS[variant];
  return (
    <Tap
      onPress={loading ? undefined : onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      pressedBackground={variant === 'primary' ? colors.forestInkPressed : undefined}
      style={[styles.base, v.box, style]}
    >
      {loading ? <Spinner /> : left}
      {children ?? (
        <Text style={[v.text, textStyle]} numberOfLines={1}>
          {loading && loadingLabel ? loadingLabel : label}
        </Text>
      )}
    </Tap>
  );
}

/** 20px spinner · white ring, Turmeric arc (loading state). */
export function Spinner({ color = colors.turmeric }: { color?: string }) {
  return <ActivityIndicator size="small" color={color} />;
}

/** Text link · 14px 600 Turmeric Deep, 44px hit. */
export function TextLink({
  label,
  onPress,
  color = colors.turmericDeep,
  style,
  textStyle,
  right,
}: {
  label: string;
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  right?: ReactNode;
}) {
  return (
    <Tap
      accessibilityRole="link"
      onPress={onPress}
      style={[styles.link, style]}
      hitSlop={{ left: 8, right: 8 }}
    >
      <Text style={[type.link, { color }, textStyle]}>{label}</Text>
      {right}
    </Tap>
  );
}

/**
 * Back button · 44×44 white circle, 1px Line, 22px chevron.
 */
export function IconCircleButton({
  icon = 'chevronLeft',
  onPress,
  accessibilityLabel = 'Back',
  size = 22,
  style,
}: {
  icon?: Parameters<typeof Icon>[0]['name'];
  onPress?: () => void;
  accessibilityLabel?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[styles.circle, style]}
    >
      <Icon name={icon} size={size} color={colors.forestInk} />
    </Tap>
  );
}

const VARIANTS = {
  primary: StyleSheet.create({
    box: { height: 52, borderRadius: 14, backgroundColor: colors.forestInk },
    text: { ...ff('body', 600), fontSize: 16, color: '#FFFFFF' },
  }),
  secondary: StyleSheet.create({
    box: {
      height: 52,
      borderRadius: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.lineStrong,
    },
    text: { ...ff('body', 600), fontSize: 16, color: colors.forestInk },
  }),
  accent: StyleSheet.create({
    box: {
      height: 44,
      borderRadius: 999,
      paddingHorizontal: 20,
      backgroundColor: colors.turmeric,
    },
    text: { ...ff('body', 700), fontSize: 15, color: colors.forestInk },
  }),
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  link: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
