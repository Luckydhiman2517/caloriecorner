/**
 * Font families. Each weight is its own static font file, named by its
 * PostScript name so the same string works on iOS and Android.
 *
 * Never combine these with `fontWeight` — pick the weight with `ff()`.
 */
export const fontFiles = {
  display: {
    500: 'SchibstedGrotesk-Medium',
    600: 'SchibstedGrotesk-SemiBold',
    700: 'SchibstedGrotesk-Bold',
    800: 'SchibstedGrotesk-ExtraBold',
  },
  body: {
    400: 'Inter-Regular',
    500: 'Inter-Medium',
    600: 'Inter-SemiBold',
    700: 'Inter-Bold',
  },
  mono: {
    500: 'JetBrainsMono-Medium',
    600: 'JetBrainsMono-SemiBold',
  },
} as const;

type Families = typeof fontFiles;
export type FontFamily = keyof Families;

/**
 * `ff('display', 800)` → `{ fontFamily: 'SchibstedGrotesk-ExtraBold' }`
 * display = Schibsted Grotesk, body = Inter, mono = JetBrains Mono.
 */
export function ff<F extends FontFamily>(
  family: F,
  weight: keyof Families[F],
): { fontFamily: string } {
  return { fontFamily: fontFiles[family][weight] as unknown as string };
}
