import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { ff } from '../theme/fonts';
import { em } from '../theme/type';
import { Span, Text } from './Text';

/**
 * App mark: a Forest Ink tile with a Turmeric quarter-disc and an outlined
 * white "c" (Brand guidelines · 02 Logo). Never smaller than 24px.
 */
export function AppMark({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <ClipPath id="ccm">
          <Rect width={40} height={40} rx={12} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#ccm)">
        <Rect width={40} height={40} fill={colors.forestInk} />
        <Circle cx={40} cy={40} r={17} fill={colors.turmeric} />
      </G>
      <Path
        d="M21.6 14.4 A7.2 7.2 0 1 0 21.6 25.6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={4.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Lowercase wordmark: "calorie" + "corner".
 * Light grounds: Forest Ink + Wordmark Turmeric #D4951F.
 * Dark grounds: white + Turmeric #E3A63A.
 */
export function Wordmark({
  size = 20,
  onDark = false,
}: {
  size?: number;
  onDark?: boolean;
}) {
  return (
    <Text
      style={[
        styles.word,
        onDark ? styles.calorieDark : styles.calorieLight,
        {
          fontSize: size,
          lineHeight: Math.round(size * 1.2),
          letterSpacing: em(-0.03, size),
        },
      ]}
    >
      calorie
      <Span style={onDark ? styles.cornerDark : styles.cornerLight}>corner</Span>
    </Text>
  );
}

/** Mark + wordmark on a Paper pill — used over the Welcome photo. */
export function LogoPill({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.pill, style]}>
      <AppMark size={32} />
      <Wordmark size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  word: {
    ...ff('display', 800),
  },
  calorieLight: { color: colors.forestInk },
  calorieDark: { color: '#FFFFFF' },
  cornerLight: { color: colors.wordmarkTurmeric },
  cornerDark: { color: colors.turmeric },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingLeft: 6,
    paddingRight: 16,
    borderRadius: 999,
    backgroundColor: colors.paper,
    alignSelf: 'flex-start',
  },
});
