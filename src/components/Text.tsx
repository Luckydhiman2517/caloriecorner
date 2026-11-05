import type { ComponentProps } from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import { colors } from '../theme/colors';
import { ff } from '../theme/fonts';

/**
 * Drop-in replacement for React Native's Text with the app defaults:
 * Inter 400, 15px, Forest Ink. Always use this instead of RN `Text`.
 * Pick weights with `ff()` — never `fontWeight`.
 */
export function Text({ style, ...rest }: ComponentProps<typeof RNText>) {
  return <RNText style={[styles.base, style]} {...rest} />;
}

/**
 * Inline span for text nested inside a `Text`. It inherits the parent's
 * font, size and colour (unlike `Text`, which resets to the defaults), so
 * only override what changes — e.g. `<Span style={ff('body', 700)}>`.
 */
export const Span = RNText;

const styles = StyleSheet.create({
  base: {
    ...ff('body', 400),
    fontSize: 15,
    color: colors.forestInk,
  },
});
