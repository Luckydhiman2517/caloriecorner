import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNav, type RouteName } from '../navigation/types';
import { colors, shadows } from '../theme/colors';
import { ff } from '../theme/fonts';
import { em, type } from '../theme/type';
import { Button, IconCircleButton } from './Button';
import { Icon, type IconName } from './Icon';
import { Tap } from './Tap';
import { Text } from './Text';

/* ───────────── Screen ───────────── */

/**
 * Screen frame: Paper ground, an optional fixed `header`, a scrolling body,
 * then fixed bottom pieces in order: `floating` (cart bar / toast),
 * `footer` (BottomBar CTA) and `bottomNav`.
 *
 * Safe areas: ScreenHeader pads the top inset itself. With no header, pass
 * `padTop` so the body starts at 12 + inset (or handle it yourself, e.g.
 * a full-bleed photo). The last fixed bottom piece pads the bottom inset —
 * BottomBar/BottomNav do; with neither, the body pads it.
 */
export function Screen({
  header,
  children,
  footer,
  floating,
  bottomNav,
  scroll = true,
  padTop = false,
  background = colors.paper,
  contentStyle,
  bottomGap = 24,
}: {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  floating?: ReactNode;
  bottomNav?: ReactNode;
  scroll?: boolean;
  padTop?: boolean;
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  /** Space after the last body element (the design's min-height spacer). */
  bottomGap?: number;
}) {
  const insets = useSafeAreaInsets();
  const hasBottom = !!footer || !!bottomNav;
  const body = [
    padTop ? { paddingTop: insets.top + 12 } : null,
    { paddingBottom: bottomGap + (hasBottom || floating ? 0 : insets.bottom) },
    contentStyle,
  ];
  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {header}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, body]}>{children}</View>
      )}
      {floating}
      {footer}
      {bottomNav}
    </KeyboardAvoidingView>
  );
}

/* ───────────── Headers (07.17) ───────────── */

/**
 * Sub-screen header: padding (12 + inset) 20 8. Back 44×44, title H3 with
 * an optional 13px Ink-3 subtitle, optional right slot (44px icon button
 * or a text link). Tab screens pass `back={false}`.
 */
export function ScreenHeader({
  title,
  subtitle,
  back = true,
  onBack,
  backLabel = 'Back',
  right,
  children,
  style,
}: {
  title?: string;
  subtitle?: ReactNode;
  back?: boolean;
  onBack?: () => void;
  backLabel?: string;
  right?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const nav = useNav();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }, style]}>
      {back ? (
        <IconCircleButton
          accessibilityLabel={backLabel}
          onPress={onBack ?? (() => nav.canGoBack() && nav.goBack())}
        />
      ) : null}
      <View style={styles.headerBody}>
        {children ?? (
          <>
            {title ? (
              <Text style={type.h3} accessibilityRole="header" numberOfLines={1}>
                {title}
              </Text>
            ) : null}
            {typeof subtitle === 'string' ? (
              <Text style={type.small} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : (
              subtitle
            )}
          </>
        )}
      </View>
      {right}
    </View>
  );
}

/** Section heading row: optional eyebrow, H3 title, optional "See all". */
export function SectionHeader({
  eyebrow,
  title,
  action,
  onAction,
  style,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.flexShrink}>
        {eyebrow ? (
          <Text style={[type.eyebrow, styles.eyebrowGap]}>{eyebrow}</Text>
        ) : null}
        <Text style={type.h3} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {action ? (
        <Tap
          accessibilityRole="link"
          onPress={onAction}
          style={styles.sectionAction}
          hitSlop={{ left: 8, right: 8 }}
        >
          <Text style={type.link}>{action}</Text>
        </Tap>
      ) : null}
    </View>
  );
}

/* ───────────── Fixed bottom pieces ───────────── */

/**
 * White bottom bar with a 1px Line top border:
 * padding 12 20 (16 + inset). Holds the primary CTA.
 */
export function BottomBar({
  children,
  style,
  background = colors.surface,
  border = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  background?: string;
  border?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bottomBar,
        { paddingBottom: 16 + insets.bottom, backgroundColor: background },
        border ? styles.bottomBarBorder : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Convenience: BottomBar with one primary 52px button. */
export function BottomCTA({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <BottomBar>
      <Button label={label} onPress={onPress} disabled={disabled} />
    </BottomBar>
  );
}

const TABS: {
  key: 'home' | 'search' | 'orders' | 'account';
  label: string;
  icon: IconName;
  route: RouteName;
}[] = [
  { key: 'home', label: 'Home', icon: 'home', route: 'Home' },
  { key: 'search', label: 'Search', icon: 'search', route: 'Listing' },
  { key: 'orders', label: 'Orders', icon: 'orders', route: 'Orders' },
  { key: 'account', label: 'Account', icon: 'user', route: 'Account' },
];

/**
 * Bottom nav (07.16): 72px + inset, white, 1px Line top. Active: Forest Ink
 * + 24×3 Turmeric bar; inactive: Ink-3. 24px icons, 12px 600 labels.
 */
export function BottomNav({
  active,
  iconStrokeWidth = 1.6,
}: {
  active: 'home' | 'search' | 'orders' | 'account';
  /** Product screens draw the tab icons at 1.6, Account screens at 1.8. */
  iconStrokeWidth?: number;
}) {
  const insets = useSafeAreaInsets();
  const nav = useNav();
  return (
    <View
      accessibilityRole="tablist"
      style={[styles.nav, { height: 72 + insets.bottom, paddingBottom: 8 + insets.bottom }]}
    >
      {TABS.map(t => {
        const on = t.key === active;
        const c = on ? colors.forestInk : colors.ink3;
        return (
          <Tap
            key={t.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            pressScale={1}
            onPress={() => {
              if (!on) {
                nav.navigate(t.route);
              }
            }}
            style={styles.tab}
          >
            {on ? <View style={styles.tabBar} /> : null}
            <Icon name={t.icon} size={24} color={c} strokeWidth={iconStrokeWidth} />
            <Text style={[styles.tabText, { color: c }]}>{t.label}</Text>
          </Tap>
        );
      })}
    </View>
  );
}

/**
 * Cart bar (07.15): Forest Ink, r20, padding 10 10 10 18, shadow e2,
 * margin 0 16 12. "680 kcal" Schibsted 18 800 Turmeric, then 13px 600 white;
 * line two 12px On-dark muted. Accent "View cart" pill.
 */
export function CartBar({
  kcal = '680 kcal',
  label = 'in meals · 3 items',
  sub = '₹608 · 43% of today’s target',
  cta = 'View cart',
  onPress,
  last = false,
  style,
}: {
  kcal?: string;
  label?: string;
  sub?: string;
  cta?: string;
  onPress?: () => void;
  /** True when nothing sits below it (adds the bottom inset). */
  last?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const nav = useNav();
  return (
    <View
      style={[
        styles.cartBar,
        { marginBottom: 12 + (last ? insets.bottom : 0) },
        style,
      ]}
    >
      <View style={styles.cartBody}>
        <Text style={styles.cartLine} numberOfLines={1}>
          <Text style={styles.cartKcal}>{kcal}</Text>{' '}
          <Text style={styles.cartLabel}>{label}</Text>
        </Text>
        <Text style={styles.cartSub} numberOfLines={1}>
          {sub}
        </Text>
      </View>
      <Button
        variant="accent"
        label={cta}
        onPress={onPress ?? (() => nav.navigate('Cart'))}
      />
    </View>
  );
}

/**
 * Toast (07.20): Forest Ink, r14, min-height 48, padding 12 16, 14px 500
 * white; action Turmeric 14px 600 with a 44px hit. Shadow e2.
 */
export function Toast({
  message,
  action,
  onAction,
  style,
}: {
  message: ReactNode;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View accessibilityRole="alert" style={[styles.toast, style]}>
      <Text style={styles.toastText}>{message}</Text>
      {action ? (
        <Tap onPress={onAction} style={styles.toastAction} hitSlop={{ left: 8, right: 8 }}>
          <Text style={styles.toastActionText}>{action}</Text>
        </Tap>
      ) : null}
    </View>
  );
}

/* ───────────── Small pieces ───────────── */

/** 1px Line divider. */
export function Divider({ inset = 0, style }: { inset?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, { marginHorizontal: inset }, style]} />;
}

/** Rounded progress bar. */
export function ProgressBar({
  value,
  height = 8,
  track = colors.white14,
  fill = colors.turmeric,
  style,
}: {
  value: number; // 0–100
  height?: number;
  track?: string;
  fill?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: value }}
      style={[styles.progress, { height, backgroundColor: track }, style]}
    >
      <View
        style={[styles.progressFill, { width: `${value}%`, height, backgroundColor: fill }]}
      />
    </View>
  );
}

/**
 * Image placeholder used in the designs for photos that aren't supplied:
 * a tinted tile with a fork-knife icon and a mono "[dish photo]" label.
 */
export function PhotoPlaceholder({
  label = '[dish photo]',
  tone = 'warm',
  icon = 'forkKnife',
  iconSize = 20,
  showLabel = true,
  style,
}: {
  label?: string;
  tone?: 'warm' | 'green';
  icon?: IconName;
  iconSize?: number;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.placeholder,
        { backgroundColor: tone === 'warm' ? colors.placeholderWarm : colors.placeholderGreen },
        style,
      ]}
    >
      <Icon name={icon} size={iconSize} color={colors.placeholderIcon} />
      {showLabel ? <Text style={styles.placeholderText}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerBody: { flex: 1, minWidth: 0 },
  section: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionAction: { minHeight: 44, justifyContent: 'center', marginVertical: -10 },
  bottomBar: { paddingTop: 12, paddingHorizontal: 20 },
  bottomBarBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  nav: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabBar: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.turmeric,
  },
  tabText: { ...ff('body', 600), fontSize: 12, lineHeight: 16 },
  cartBar: {
    marginHorizontal: 16,
    backgroundColor: colors.forestInk,
    borderRadius: 20,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 18,
    boxShadow: shadows.e2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartBody: { flex: 1, minWidth: 0 },
  cartLine: { lineHeight: 24 },
  cartKcal: {
    ...ff('display', 800),
    fontSize: 18,
    letterSpacing: em(-0.01, 18),
    color: colors.turmeric,
  },
  cartLabel: { ...ff('body', 600), fontSize: 13, color: '#FFFFFF' },
  cartSub: { marginTop: 2, fontSize: 12, lineHeight: 16, color: colors.onDarkMuted },
  toast: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.forestInk,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: shadows.e2,
  },
  toastText: { flex: 1, ...ff('body', 500), fontSize: 14, lineHeight: 20, color: '#FFFFFF' },
  toastAction: { minHeight: 44, justifyContent: 'center', marginVertical: -12 },
  toastActionText: { ...ff('body', 600), fontSize: 14, color: colors.turmeric },
  divider: { height: 1, backgroundColor: colors.line },
  eyebrowGap: { marginBottom: 2 },
  progress: { borderRadius: 999, overflow: 'hidden' },
  progressFill: { borderRadius: 999 },
  placeholder: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  placeholderText: {
    ...ff('mono', 500),
    fontSize: 11,
    lineHeight: 14,
    color: colors.placeholderText,
  },
});
