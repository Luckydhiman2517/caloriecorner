import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomBar,
  Button,
  Icon,
  RadioRow,
  Screen,
  ScreenHeader,
  Segmented,
  Span,
  Tap,
  Text,
  TextField,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors, shadows } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';
import { goBackOr, InlineLink } from './parts';

type Sex = 'female' | 'male' | 'other';
type Activity = 'sitting' | 'light' | 'active' | 'very-active';
type HeightUnit = 'cm' | 'ft';

const SEXES: { value: Sex; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
];

const ACTIVITIES: { value: Activity; title: string; subtitle: string }[] = [
  { value: 'sitting', title: 'Mostly sitting', subtitle: 'Desk job, little exercise' },
  { value: 'light', title: 'Lightly active', subtitle: 'Walks, 1–3 workouts a week' },
  { value: 'active', title: 'Active', subtitle: 'On your feet, 3–5 workouts a week' },
  {
    value: 'very-active',
    title: 'Very active',
    subtitle: 'Physical job or daily training',
  },
];

/** 4.2 Complete profile — design file: Account-CompleteProfile.dc.html */
export default function CompleteProfileScreen() {
  const nav = useNav();
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('28');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [height, setHeight] = useState('172');
  const [weight, setWeight] = useState('78');
  const [target, setTarget] = useState('72');
  const [activity, setActivity] = useState<Activity>('light');

  return (
    <Screen
      header={
        <ScreenHeader
          title="Complete profile"
          backLabel="Back to account"
          onBack={() => goBackOr(nav, 'Account')}
          right={<InlineLink label="Skip" onPress={() => nav.navigate('Home')} />}
        />
      }
      footer={
        <BottomBar>
          <Button
            label="Save & see my picks"
            onPress={() => nav.navigate('Home')}
          />
        </BottomBar>
      }
      contentStyle={styles.main}
    >
      <View style={styles.stepRow}>
        <Text style={type.eyebrow}>STEP 2 OF 2 · BODY & ACTIVITY</Text>
        <Text style={styles.stepTime}>About 1 min</Text>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Profile steps"
        accessibilityValue={{ min: 1, max: 2, now: 2 }}
        style={styles.steps}
      >
        <View style={styles.stepBar} />
        <View style={styles.stepBar} />
      </View>

      <Text style={[type.h2, styles.title]} accessibilityRole="header">
        A few numbers for an exact target
      </Text>
      <View style={styles.privacy}>
        <View style={styles.privacyIcon}>
          <Icon name="lock" size={16} strokeWidth={1.8} color={colors.leaf} />
        </View>
        <Text style={styles.privacyText}>
          Used only to calculate your calories. Never shown to anyone.
        </Text>
      </View>

      {/* Sex */}
      <View style={styles.sex}>
        <Text style={[type.fieldLabel, styles.label]}>Sex</Text>
        <Segmented
          accessibilityLabel="Sex"
          options={SEXES}
          value={sex}
          onChange={setSex}
        />
      </View>

      {/* Age */}
      <TextField
        label="Age"
        accessibilityLabel="Age"
        unit="years"
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        autoComplete="off"
        style={styles.num}
        containerStyle={styles.field}
      />

      {/* Height */}
      <View style={styles.field}>
        <View style={styles.heightHead}>
          <Text style={type.fieldLabel}>Height</Text>
          <UnitToggle value={heightUnit} onChange={setHeightUnit} />
        </View>
        <TextField
          accessibilityLabel="Height"
          unit="cm"
          value={height}
          onChangeText={setHeight}
          keyboardType="number-pad"
          autoComplete="off"
          style={styles.num}
          hint="In ft, you'll enter feet and inches separately (e.g. 5 ft 8 in)."
        />
      </View>

      {/* Weights */}
      <View style={[styles.field, styles.weights]}>
        <TextField
          label="Current weight"
          accessibilityLabel="Current weight"
          unit="kg"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          autoComplete="off"
          style={styles.num}
          containerStyle={styles.half}
        />
        <TextField
          label="Target weight"
          accessibilityLabel="Target weight"
          unit="kg"
          value={target}
          onChangeText={setTarget}
          keyboardType="decimal-pad"
          autoComplete="off"
          style={styles.num}
          containerStyle={styles.half}
        />
      </View>

      {/* Activity */}
      <View accessibilityRole="radiogroup" style={styles.activity}>
        <Text style={[type.h3, styles.legend]} accessibilityRole="header">
          How active are you?
        </Text>
        <View style={styles.rows}>
          {ACTIVITIES.map(a => (
            <RadioRow
              key={a.value}
              title={a.title}
              subtitle={a.subtitle}
              selected={activity === a.value}
              onPress={() => setActivity(a.value)}
            />
          ))}
        </View>
      </View>

      {/* Daily target */}
      <View accessibilityLiveRegion="polite" style={styles.result}>
        <View style={styles.resultHead}>
          <Text
            style={[type.eyebrow, styles.resultEyebrow]}
            accessibilityRole="header"
          >
            Your daily target
          </Text>
          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Updates as you type</Text>
          </View>
        </View>
        <View style={styles.kcalRow}>
          <Text style={styles.kcal}>1,600</Text>
          <Text style={styles.kcalUnit}>kcal/day</Text>
        </View>
        <Text style={styles.forecast}>
          Lose ~0.5 kg/week · reach 72 kg by mid-Feb (est.)
        </Text>
        <View style={styles.macros}>
          <Macro label="Protein" grams="120 g" share="30%" first />
          <Macro label="Carbs" grams="160 g" share="40%" />
          <Macro label="Fat" grams="53 g" share="30%" />
        </View>
      </View>
    </Screen>
  );
}

/**
 * Small cm / ft switch: Stone track 32 high (padding 3, gap 2, r14);
 * 26px segments, min-width 40, r11; active white with e1. 44px hit.
 */
function UnitToggle({
  value,
  onChange,
}: {
  value: HeightUnit;
  onChange: (v: HeightUnit) => void;
}) {
  return (
    <View accessibilityLabel="Height unit" style={styles.unitTrack}>
      {(['cm', 'ft'] as const).map(u => {
        const on = u === value;
        return (
          <Tap
            key={u}
            accessibilityRole="togglebutton"
            accessibilityState={{ checked: on }}
            onPress={() => onChange(u)}
            pressScale={1}
            hitSlop={{ top: 9, bottom: 9 }}
            style={[styles.unitSeg, on ? styles.unitSegOn : null]}
          >
            <Text style={[styles.unitText, on ? styles.unitTextOn : null]}>
              {u}
            </Text>
          </Tap>
        );
      })}
    </View>
  );
}

/** One macro column on the dark card: "Protein / 120 g 30%". */
function Macro({
  label,
  grams,
  share,
  first = false,
}: {
  label: string;
  grams: string;
  share: string;
  first?: boolean;
}) {
  return (
    <View style={[styles.macro, first ? null : styles.macroDivided]}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>
        {grams} <Span style={styles.macroShare}>{share}</Span>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { paddingTop: 12, paddingHorizontal: 20 },
  stepRow: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTime: { fontSize: 12, lineHeight: 16, color: colors.ink3 },
  steps: { marginTop: 8, flexDirection: 'row', gap: 6 },
  stepBar: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.turmeric,
  },
  title: { marginTop: 24 },
  privacy: { marginTop: 8, flexDirection: 'row', gap: 8 },
  privacyIcon: { marginTop: 2 },
  privacyText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.ink2 },
  sex: { marginTop: 24 },
  label: { marginBottom: 8 },
  field: { marginTop: 20 },
  num: { fontVariant: ['tabular-nums'] },
  heightHead: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitTrack: {
    height: 32,
    padding: 3,
    gap: 2,
    borderRadius: 14,
    backgroundColor: colors.stone,
    flexDirection: 'row',
  },
  unitSeg: {
    height: 26,
    minWidth: 40,
    paddingHorizontal: 10,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitSegOn: { backgroundColor: colors.surface, boxShadow: shadows.e1 },
  unitText: { ...ff('body', 600), fontSize: 13, color: colors.ink2 },
  unitTextOn: { color: colors.forestInk },
  weights: { flexDirection: 'row', gap: 12 },
  half: { flex: 1, minWidth: 0 },
  activity: { marginTop: 28 },
  legend: { marginBottom: 12 },
  rows: { gap: 8 },
  result: {
    marginTop: 28,
    padding: 18,
    borderRadius: 20,
    backgroundColor: colors.forestInk,
  },
  resultHead: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultEyebrow: { color: colors.turmeric },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.turmeric,
  },
  liveText: { fontSize: 12, lineHeight: 16, color: colors.onDarkMuted },
  kcalRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  kcal: {
    ...ff('display', 800),
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: em(-0.02, 44),
    color: colors.turmeric,
  },
  kcalUnit: {
    ...ff('display', 700),
    fontSize: 16,
    lineHeight: 22,
    color: colors.turmeric,
  },
  forecast: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: colors.onDarkMuted,
  },
  macros: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.white12,
    flexDirection: 'row',
  },
  macro: { flex: 1, minWidth: 0 },
  macroDivided: {
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: colors.white12,
  },
  macroLabel: { fontSize: 12, lineHeight: 16, color: colors.onDarkMuted },
  macroValue: {
    marginTop: 2,
    ...ff('body', 700),
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  macroShare: { ...ff('body', 500), fontSize: 12, color: colors.onDarkMuted },
});
