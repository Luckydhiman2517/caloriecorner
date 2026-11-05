import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Icon, Tap, Text } from '../../components';
import type { Nav, RouteName } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';

/** Go back if there is a screen to return to, else open `route`. */
export function goBackOr(nav: Nav, route: RouteName) {
  if (nav.canGoBack()) {
    nav.goBack();
  } else {
    nav.navigate(route);
  }
}

/**
 * Inline text link used across the account screens ("Edit", "Skip",
 * "Details", "Change goal"): 14px 600, min-height 44, padding 0 8 with a
 * −8 margin so the hit area grows without moving the text. Optional 16px
 * chevron 4px after the label.
 */
export function InlineLink({
  label,
  onPress,
  color = colors.turmericDeep,
  accessibilityLabel,
  chevron = false,
  style,
}: {
  label: string;
  onPress?: () => void;
  color?: string;
  accessibilityLabel?: string;
  chevron?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.link, style]}
    >
      <Text style={[styles.linkText, { color }]}>{label}</Text>
      {chevron ? (
        <Icon name="chevronRight" size={16} strokeWidth={1.8} color={color} />
      ) : null}
    </Tap>
  );
}

/**
 * A CSS `border: <w>px dashed <color>` drawn as an SVG overlay, because
 * React Native can't reliably draw dashed borders with rounded corners.
 * Dashes follow the browser pattern for thin borders (dash 3×, gap 2× the
 * width), with the gap evened out so the dashes close around the shape.
 * Place it inside a box of the same size; it fills it absolutely.
 */
export function DashedOutline({
  width,
  height,
  radius,
  color,
  strokeWidth = 1.5,
}: {
  width: number;
  height: number;
  /** One radius, or [top-left, top-right, bottom-right, bottom-left]. */
  radius: number | [number, number, number, number];
  color: string;
  strokeWidth?: number;
}) {
  const i = strokeWidth / 2;
  const [tl, tr, br, bl] = (
    typeof radius === 'number' ? [radius, radius, radius, radius] : radius
  ).map(r => Math.max(0, r - i));
  const x0 = i;
  const y0 = i;
  const x1 = width - i;
  const y1 = height - i;
  const d =
    `M${x0 + tl},${y0} H${x1 - tr} A${tr},${tr} 0 0 1 ${x1},${y0 + tr} ` +
    `V${y1 - br} A${br},${br} 0 0 1 ${x1 - br},${y1} ` +
    `H${x0 + bl} A${bl},${bl} 0 0 1 ${x0},${y1 - bl} ` +
    `V${y0 + tl} A${tl},${tl} 0 0 1 ${x0 + tl},${y0} Z`;
  const perimeter =
    2 * (x1 - x0) +
    2 * (y1 - y0) -
    2 * (tl + tr + br + bl) +
    (Math.PI / 2) * (tl + tr + br + bl);
  const dash = 3 * strokeWidth;
  const period = perimeter / Math.max(1, Math.round(perimeter / (5 * strokeWidth)));
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={[dash, period - dash]}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  link: {
    minHeight: 44,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  linkText: { ...ff('body', 600), fontSize: 14 },
});
