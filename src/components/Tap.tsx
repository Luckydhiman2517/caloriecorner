import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Background while pressed (dark buttons lift to #24342B). */
  pressedBackground?: string;
  /** Scale on press — the guideline is .97 for everything tappable. */
  pressScale?: number;
};

/**
 * Pressable with the guideline press state: scale .97, and an optional
 * pressed background. Disabled controls dim to opacity .4.
 */
export function Tap({
  style,
  pressedBackground,
  pressScale = 0.97,
  disabled,
  accessibilityRole = 'button',
  hitSlop,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      disabled={disabled}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        style,
        disabled ? { opacity: 0.4 } : null,
        pressed && !disabled
          ? {
              transform: [{ scale: pressScale }],
              ...(pressedBackground ? { backgroundColor: pressedBackground } : null),
            }
          : null,
      ]}
      {...rest}
    />
  );
}
