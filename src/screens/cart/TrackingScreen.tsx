import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import {
  BottomBar,
  Button,
  Icon,
  IconCircleButton,
  Kcal,
  Screen,
  ScreenHeader,
  Span,
  Tap,
  Text,
  type IconName,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors, shadows } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import {
  SuccessPill,
  Legend,
  ORDER_LINES,
  OrderItemRow,
  Pill,
  SectionTitle,
  SplitBar,
  ui,
} from './parts';

type StepState = 'done' | 'current' | 'next';

const STEPS: {
  title: string;
  sub: string;
  time: string;
  icon: IconName;
  state: StepState;
}[] = [
  {
    title: 'Order confirmed',
    sub: '2 kitchens + grocery accepted',
    time: '7:42 PM',
    icon: 'check',
    state: 'done',
  },
  {
    title: 'Being prepared',
    sub: '2 kitchens cooking · grocery packed',
    time: 'Now',
    icon: 'flame',
    state: 'current',
  },
  {
    title: 'Out for delivery',
    sub: 'Ravi picks up all 3 items',
    time: '~7:56 PM',
    icon: 'scooter',
    state: 'next',
  },
  {
    title: 'Delivered',
    sub: 'Home · Flat 402, HSR Layout',
    time: '~8:04 PM',
    icon: 'home',
    state: 'next',
  },
];

/** Free-cancellation window left when the board was drawn (0:48). */
const CANCEL_SECONDS = 48;

/** 3.3 Order tracking — design file: Cart-Tracking.dc.html */
export default function TrackingScreen() {
  const nav = useNav();
  const [secs, setSecs] = useState(CANCEL_SECONDS);

  useEffect(() => {
    const t = secs > 0 ? setTimeout(() => setSecs(v => v - 1), 1000) : undefined;
    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
  }, [secs]);

  const countdown = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <Screen
      header={
        <ScreenHeader
          back={false}
          right={
            <IconCircleButton
              icon="helpAlt"
              accessibilityLabel="Get help with this order"
            />
          }
        >
          <Text style={type.h3}>Order #CC2481</Text>
          <Text style={[type.small, ui.tabular]}>Placed 7:42 PM · 3 items</Text>
        </ScreenHeader>
      }
      contentStyle={styles.main}
      bottomGap={20}
      footer={
        <BottomBar background={colors.paper} border={false}>
          <Button
            variant="secondary"
            label="Back to home"
            onPress={() => nav.reset({ index: 0, routes: [{ name: 'Home' }] })}
          />
        </BottomBar>
      }
    >
      {/* ETA */}
      <View style={styles.eta}>
        <Text style={type.h1} accessibilityRole="header">
          Arriving in 22 min
        </Text>
        <Text style={[type.body, styles.mt4]}>Being prepared · by 8:04 PM</Text>
        <SuccessPill label="Paid ₹673 via UPI" style={styles.mt12} />
        <Tap style={styles.cancel}>
          <Text style={styles.cancelText} accessibilityLiveRegion="polite">
            Cancel order ·{' '}
            <Span style={ui.tabular}>{countdown}</Span>
          </Text>
        </Tap>
        <Text style={[ui.meta12, styles.mt6]}>
          Free cancellation for 60 sec after ordering
        </Text>
      </View>

      {/* Map */}
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Map: rider is reaching the kitchen, route to Home in HSR Layout"
        style={styles.map}
      >
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 348 198"
          preserveAspectRatio="xMidYMid slice"
        >
          <Rect x={170} y={128} width={64} height={30} rx={6} fill={colors.leafMist} />
          <Path
            d="M0 40H348M0 110H348M0 170H348"
            stroke="#FFFFFF"
            strokeWidth={12}
            fill="none"
          />
          <Path
            d="M60 0V198M150 0V198M250 0V198M320 0V198"
            stroke="#FFFFFF"
            strokeWidth={12}
            fill="none"
          />
          <Path
            d="M0 75H348M105 0V198M200 0V110M290 110V198"
            stroke="#FFFFFF"
            strokeWidth={5}
            fill="none"
          />
          <Path
            d="M60 40V110H250V160H296"
            stroke={colors.forestInk}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Circle
            cx={60}
            cy={40}
            r={7}
            fill="#FFFFFF"
            stroke={colors.forestInk}
            strokeWidth={3}
          />
          <Circle cx={60} cy={78} r={16} fill={colors.turmeric} opacity={0.28} />
          <Circle
            cx={60}
            cy={78}
            r={9}
            fill={colors.turmeric}
            stroke="#FFFFFF"
            strokeWidth={3}
          />
          <G transform="translate(284 132)">
            <Path
              d="M12 28s-10-8.5-10-16a10 10 0 0 1 20 0c0 7.5-10 16-10 16z"
              fill={colors.forestInk}
            />
            <Circle cx={12} cy={12} r={4} fill="#FFFFFF" />
          </G>
        </Svg>
        <Pill
          label="Rider reaching kitchen · 3 min"
          bg={colors.surface}
          fg={colors.forestInk}
          dot={colors.turmeric}
          style={styles.mapPill}
        />
      </View>

      {/* Status + rider */}
      <View style={styles.statusGroup}>
        <View style={[ui.card, ui.cardPad]} accessibilityLabel="Order status">
          {STEPS.map((st, i) => {
            const last = i === STEPS.length - 1;
            const look = STEP_LOOK[st.state];
            return (
              <View key={st.title} style={styles.step}>
                <View style={styles.rail}>
                  <View style={[styles.dot, { backgroundColor: look.dotBg }]}>
                    <Icon
                      name={st.icon}
                      size={20}
                      color={look.dotFg}
                      strokeWidth={st.state === 'done' ? 2 : 1.8}
                    />
                  </View>
                  {last ? null : (
                    <View style={[styles.railLine, { backgroundColor: look.line }]} />
                  )}
                </View>
                <View style={[styles.stepBody, last ? null : styles.pb14]}>
                  <View style={styles.shrink}>
                    <Text style={[styles.stepTitle, look.title]}>{st.title}</Text>
                    <Text style={ui.meta13}>{st.sub}</Text>
                  </View>
                  <Text style={[styles.stepTime, look.time]}>{st.time}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={[ui.card, styles.rider]}>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>RS</Text>
          </View>
          <View style={ui.flex}>
            <Text style={styles.riderName}>Ravi S. is your rider</Text>
            <Text style={ui.meta13}>Carries an insulated tote</Text>
          </View>
          <Tap accessibilityLabel="Call rider" style={styles.call}>
            <Icon name="call" size={20} color={colors.leaf} />
          </Tap>
        </View>
      </View>

      {/* Today's calories */}
      <View style={styles.cal}>
        <Text style={[type.eyebrow, styles.calEyebrow]} accessibilityRole="header">
          Today’s calories
        </Text>
        <View style={styles.mt10}>
          <Kcal value={680} size="L" color={colors.turmeric} unitStyle={styles.calUnit} />
          <Text style={styles.calSub}>in meals, logged when delivered</Text>
        </View>
        <SplitBar
          height={10}
          eaten={colors.onDarkMuted}
          order={colors.turmeric}
          rest={colors.white14}
          accessibilityLabel="580 kcal eaten, 680 kcal from this order, 340 kcal left of 1,600"
        />
        <Legend
          color={colors.onDarkMuted}
          eaten={colors.onDarkMuted}
          order={colors.turmeric}
          rest={colors.white14}
          restBorder={colors.onDarkMuted}
        />
        <View style={styles.calFoot}>
          <Text style={styles.calLeft}>340 kcal left today</Text>
          <Text style={styles.calOf}>1,260 of 1,600</Text>
        </View>
      </View>

      {/* Your items */}
      <View>
        <SectionTitle title="Your items" meta="2 meals · 680 kcal + 1 grocery" />
        <View style={ui.card}>
          {ORDER_LINES.map((l, i) => (
            <OrderItemRow
              key={l.name}
              line={l}
              style={[styles.itemRow, i === 0 ? null : ui.rowTop]}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const STEP_LOOK = {
  done: {
    dotBg: colors.leaf,
    dotFg: '#FFFFFF',
    line: colors.leaf,
    ...StyleSheet.create({
      title: { color: colors.forestInk },
      time: { color: colors.ink2, fontVariant: ['tabular-nums'] },
    }),
  },
  current: {
    dotBg: colors.turmeric,
    dotFg: colors.forestInk,
    line: colors.line,
    ...StyleSheet.create({
      title: { ...ff('body', 700), color: colors.forestInk },
      time: { ...ff('body', 700), color: colors.turmericDeep },
    }),
  },
  next: {
    dotBg: colors.stone,
    dotFg: colors.ink3,
    line: colors.line,
    ...StyleSheet.create({
      title: { color: colors.ink2 },
      time: { color: colors.ink3, fontVariant: ['tabular-nums'] },
    }),
  },
};

const styles = StyleSheet.create({
  main: { paddingTop: 12, paddingHorizontal: 20, gap: 28 },
  mt4: { marginTop: 4 },
  mt6: { marginTop: 6 },
  mt10: { marginTop: 10 },
  mt12: { marginTop: 12 },
  pb14: { paddingBottom: 14 },
  shrink: { flexShrink: 1 },

  eta: { alignItems: 'flex-start' },
  cancel: {
    height: 44,
    marginTop: 16,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelText: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: colors.chili },

  map: {
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.stone,
    borderWidth: 1,
    borderColor: colors.line,
  },
  mapPill: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    boxShadow: shadows.e1,
  },

  statusGroup: { gap: 12 },
  step: { flexDirection: 'row', gap: 12 },
  rail: { width: 32, alignItems: 'center' },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railLine: { width: 2, flex: 1, minHeight: 10, marginVertical: 4 },
  stepBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepTitle: { ...ff('body', 600), fontSize: 15, lineHeight: 20 },
  stepTime: { fontSize: 13, lineHeight: 20 },

  rider: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...ff('body', 700), fontSize: 14, color: colors.forestInk },
  riderName: { ...ff('body', 600), fontSize: 15, lineHeight: 20 },
  call: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.leafMist,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cal: { backgroundColor: colors.forestInk, borderRadius: 18, padding: 18 },
  calEyebrow: { color: colors.turmeric },
  calUnit: { fontSize: 12 },
  calSub: { fontSize: 14, lineHeight: 20, color: colors.onDarkMuted },
  calFoot: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 14,
  },
  calLeft: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: '#FFFFFF' },
  calOf: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.onDarkMuted,
    fontVariant: ['tabular-nums'],
  },

  itemRow: { paddingVertical: 12, paddingHorizontal: 16 },
});
