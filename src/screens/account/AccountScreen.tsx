import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import {
  BottomNav,
  Button,
  DietMark,
  Icon,
  IconCircleButton,
  Screen,
  Tap,
  Text,
  type IconName,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';
import { DashedOutline, InlineLink } from './parts';

/** 4.1 Account — design file: Account-Profile.dc.html */
export default function AccountScreen() {
  const nav = useNav();
  const insets = useSafeAreaInsets();

  return (
    <Screen
      bottomNav={<BottomNav active="account" iconStrokeWidth={1.8} />}
      contentStyle={[styles.main, { paddingTop: 16 + insets.top }]}
    >
      <View style={styles.titleRow}>
        <Text style={type.h1} accessibilityRole="header">
          Account
        </Text>
        <IconCircleButton icon="sliders" size={20} accessibilityLabel="Settings" />
      </View>

      {/* Profile */}
      <View accessibilityLabel="Your profile" style={[styles.card, styles.profile]}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>AK</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.name}>Aarav K.</Text>
          <Text style={[styles.meta, styles.phone]}>+91 98XXX XX210</Text>
          <Text style={styles.meta}>aarav@example.com</Text>
        </View>
        <InlineLink label="Edit" accessibilityLabel="Edit profile" />
      </View>

      {/* Profile completion */}
      <View style={[styles.card, styles.completion]}>
        <View style={styles.completionHead}>
          <ProgressRing />
          <View style={styles.flex}>
            <Text style={styles.completionTitle} accessibilityRole="header">
              Your profile is 40% done
            </Text>
            <Text style={styles.completionBody}>
              Add age, height, weight & activity for an exact calorie target. You
              can keep ordering meanwhile.
            </Text>
          </View>
        </View>
        <View style={styles.steps}>
          <Step done label="Goal" value="Lose weight" />
          <Step done label="Diet" value="Veg + Egg" />
          <Step label="Age" value="Not added" />
          <Step label="Height & weight" value="Not added" />
          <Step label="Activity level" value="Not added" />
        </View>
        <Button
          onPress={() => nav.navigate('CompleteProfile')}
          style={styles.completeBtn}
        >
          <Text style={styles.completeBtnText} numberOfLines={1}>
            Complete profile
          </Text>
          <Icon name="chevronRight" size={20} color="#FFFFFF" />
        </Button>
      </View>

      {/* Goal */}
      <View style={styles.goal}>
        <Text style={[type.eyebrow, styles.onDarkEyebrow]} accessibilityRole="header">
          Your goal
        </Text>
        <Text style={styles.goalName}>Lose weight · 0.5 kg/week</Text>
        <View style={styles.goalNumbers}>
          <Text style={styles.goalKcal}>1,600</Text>
          <Text style={styles.goalUnit}>kcal/day</Text>
          <View style={styles.estimate}>
            <Text style={styles.estimateText}>estimate</Text>
          </View>
        </View>
        <View style={styles.macros}>
          <MacroChip label="Protein" value="120 g" />
          <MacroChip label="Carbs" value="160 g" />
          <MacroChip label="Fat" value="53 g" />
        </View>
        <View style={styles.goalFoot}>
          <Text style={styles.goalNote}>Exact once your profile is done</Text>
          <InlineLink
            label="Change goal"
            color={colors.turmeric}
            chevron
            onPress={() => nav.navigate('Goal')}
          />
        </View>
      </View>

      {/* Diet preference */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={type.h3} accessibilityRole="header">
            Diet preference
          </Text>
          <InlineLink label="Edit" accessibilityLabel="Edit diet preference" />
        </View>
        <View style={[styles.card, styles.diet]}>
          <DietMark type="veg" style={styles.dietMark} />
          <View style={styles.flex}>
            <Text style={styles.dietName}>Veg + Egg</Text>
            <Text style={[styles.meta, styles.dietSub]}>
              Veg and egg dishes only, everywhere in the app
            </Text>
          </View>
        </View>
      </View>

      {/* Settings list */}
      <View accessibilityLabel="Account settings" style={[styles.card, styles.menu]}>
        <MenuRow
          first
          icon="orders"
          label="My orders"
          trailing="1 on the way"
          onPress={() => nav.navigate('Orders')}
        />
        <MenuRow icon="pin" label="Saved addresses" />
        <MenuRow icon="card" label="Payment methods" />
        <MenuRow icon="bell" label="Notifications" />
        <MenuRow icon="help" label="Help & support" />
        <MenuRow icon="info" label="About Calorie Corner" />
      </View>

      <Tap
        accessibilityRole="link"
        onPress={() => nav.reset({ index: 0, routes: [{ name: 'Welcome' }] })}
        style={[styles.card, styles.row, styles.logout]}
      >
        <Icon name="logout" size={20} color={colors.chili} />
        <Text style={styles.logoutText}>Log out</Text>
      </Tap>

      <Text style={styles.version}>Calorie Corner · Version 1.0.0 (100)</Text>
    </Screen>
  );
}

/** 44px ring: 5px Stone track, Turmeric arc (40%), "40%" in the middle. */
function ProgressRing() {
  return (
    <Svg width={44} height={44} viewBox="0 0 44 44">
      <Circle
        cx={22}
        cy={22}
        r={19}
        fill="none"
        stroke={colors.stone}
        strokeWidth={5}
      />
      <Circle
        cx={22}
        cy={22}
        r={19}
        fill="none"
        stroke={colors.turmeric}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={[47.8, 119.4]}
        transform="rotate(-90 22 22)"
      />
      <SvgText
        x={22}
        y={26}
        textAnchor="middle"
        fontFamily={ff('display', 800).fontFamily}
        fontSize={12}
        fill={colors.forestInk}
      >
        40%
      </SvgText>
    </Svg>
  );
}

/** Checklist row: 20px Leaf "Done" disc or dashed "To do" ring. */
function Step({
  label,
  value,
  done = false,
}: {
  label: string;
  value: string;
  done?: boolean;
}) {
  return (
    <View style={styles.step}>
      {done ? (
        <View
          accessibilityRole="image"
          accessibilityLabel="Done"
          style={styles.doneMark}
        >
          <Icon name="check" size={16} strokeWidth={2.6} color="#FFFFFF" />
        </View>
      ) : (
        <View
          accessibilityRole="image"
          accessibilityLabel="To do"
          style={styles.todoMark}
        >
          <DashedOutline width={20} height={20} radius={10} color={colors.ink3} />
        </View>
      )}
      <Text style={styles.stepLabel}>{label}</Text>
      <Text style={[styles.stepValue, done ? styles.stepValueDone : null]}>
        {value}
      </Text>
    </View>
  );
}

/** 24px translucent pill on the goal card: "Protein 120 g". */
function MacroChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macro}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );
}

/** 56px settings row: 20px icon, label, optional note, 16px chevron. */
function MenuRow({
  icon,
  label,
  trailing,
  first = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  trailing?: string;
  first?: boolean;
  onPress?: () => void;
}) {
  return (
    <Tap
      accessibilityRole="link"
      onPress={onPress}
      style={[styles.row, first ? null : styles.rowBorder]}
    >
      <Icon name={icon} size={20} color={colors.forestInk} />
      <Text style={styles.rowLabel}>{label}</Text>
      {trailing ? <Text style={styles.rowTrailing}>{trailing}</Text> : null}
      <Icon name="chevronRight" size={16} color={colors.ink3} />
    </Tap>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  main: { paddingHorizontal: 20 },
  titleRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
  profile: {
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...ff('display', 800), fontSize: 22, color: colors.forestInk },
  name: { ...ff('display', 700), fontSize: 18, lineHeight: 24 },
  meta: { fontSize: 13, lineHeight: 18, color: colors.ink3 },
  phone: { marginTop: 2 },
  completion: { marginTop: 16, padding: 16 },
  completionHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  completionTitle: { ...ff('display', 700), fontSize: 15, lineHeight: 20 },
  completionBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink2,
  },
  steps: { marginTop: 16, gap: 4 },
  step: { height: 26, flexDirection: 'row', alignItems: 'center', gap: 10 },
  doneMark: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoMark: { width: 20, height: 20 },
  stepLabel: { ...ff('body', 500), fontSize: 14, lineHeight: 20, flexShrink: 1 },
  stepValue: {
    marginLeft: 'auto',
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink3,
  },
  stepValueDone: { color: colors.ink2 },
  completeBtn: { marginTop: 16, gap: 6 },
  completeBtnText: { ...ff('body', 600), fontSize: 16, color: '#FFFFFF' },
  goal: {
    marginTop: 28,
    backgroundColor: colors.forestInk,
    borderRadius: 20,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  onDarkEyebrow: { color: colors.turmeric },
  goalName: {
    marginTop: 6,
    ...ff('display', 700),
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  goalNumbers: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
  },
  goalKcal: {
    ...ff('display', 800),
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: em(-0.02, 32),
    color: '#FFFFFF',
  },
  goalUnit: { fontSize: 14, lineHeight: 20, color: colors.onDarkMuted },
  estimate: {
    marginLeft: 4,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center',
  },
  estimateText: {
    ...ff('body', 600),
    fontSize: 12,
    lineHeight: 16,
    color: colors.onDarkMuted,
  },
  macros: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  macro: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.white08,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  macroLabel: { fontSize: 12, lineHeight: 16, color: colors.onDarkMuted },
  macroValue: {
    ...ff('body', 700),
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  goalFoot: {
    marginTop: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.white12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  goalNote: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    color: colors.onDarkMuted,
  },
  section: { marginTop: 28 },
  sectionHead: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diet: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  dietMark: { marginTop: 3 },
  dietName: { ...ff('body', 600), fontSize: 15, lineHeight: 20 },
  dietSub: { marginTop: 2 },
  menu: { marginTop: 28, overflow: 'hidden' },
  row: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  rowLabel: { flex: 1, ...ff('body', 500), fontSize: 15 },
  rowTrailing: { ...ff('body', 600), fontSize: 13, color: colors.turmericDeep },
  logout: { marginTop: 12 },
  logoutText: { ...ff('body', 600), fontSize: 15, color: colors.chili },
  version: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
  },
});
