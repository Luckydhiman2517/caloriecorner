import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Badge,
  BottomBar,
  Button,
  Icon,
  IconTile,
  RadioRow,
  Screen,
  ScreenHeader,
  Segmented,
  Span,
  Text,
  type IconName,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';
import { goBackOr } from './parts';

type Goal = 'lose' | 'gain' | 'muscle' | 'maintain' | 'healthier';
type Pace = '0.25' | '0.5' | '0.75';

const GOALS: { value: Goal; icon: IconName; title: string; subtitle: string }[] = [
  {
    value: 'lose',
    icon: 'trendingDown',
    title: 'Lose weight',
    subtitle: 'Calorie deficit, filling meals first',
  },
  {
    value: 'gain',
    icon: 'trendingUp',
    title: 'Gain weight',
    subtitle: 'Calorie surplus, wholesome & dense',
  },
  {
    value: 'muscle',
    icon: 'dumbbell',
    title: 'Build muscle',
    subtitle: 'High protein, 30 g+ per meal',
  },
  {
    value: 'maintain',
    icon: 'maintain',
    title: 'Maintain weight',
    subtitle: 'Balanced, steady energy',
  },
  {
    value: 'healthier',
    icon: 'leaf',
    title: 'Eat healthier',
    subtitle: 'Clean labels, no calorie target',
  },
];

const PACES: { value: Pace; label: string }[] = [
  { value: '0.25', label: '0.25' },
  { value: '0.5', label: '0.5' },
  { value: '0.75', label: '0.75' },
];

const USES: { icon: IconName; text: string }[] = [
  { icon: 'sortDown', text: 'Rank meals & products for this goal' },
  { icon: 'flame', text: 'Show kcal left today on Home' },
  { icon: 'flag', text: 'Flag items that go over your limit' },
];

/** 4.3 Goal settings — design file: Account-Goal.dc.html */
export default function GoalScreen() {
  const nav = useNav();
  const [goal, setGoal] = useState<Goal>('lose');
  const [pace, setPace] = useState<Pace>('0.5');

  return (
    <Screen
      header={
        <ScreenHeader
          title="Your goal"
          subtitle="Shapes what we show you first"
          backLabel="Back to account"
          onBack={() => goBackOr(nav, 'Account')}
        />
      }
      footer={
        <BottomBar>
          <Button label="Save goal" onPress={() => goBackOr(nav, 'Account')} />
        </BottomBar>
      }
      contentStyle={styles.main}
    >
      {/* Goal */}
      <View accessibilityRole="radiogroup">
        <Text style={[type.fieldLabel, styles.legend]}>
          What are you aiming for?
        </Text>
        <View style={styles.rows}>
          {GOALS.map(g => (
            <RadioRow
              key={g.value}
              title={g.title}
              subtitle={g.subtitle}
              selected={goal === g.value}
              onPress={() => setGoal(g.value)}
              leading={<IconTile icon={g.icon} />}
            />
          ))}
        </View>
      </View>

      {/* Pace */}
      <View style={styles.pace}>
        <Text style={[type.fieldLabel, styles.paceLabel]}>
          Pace <Span style={styles.paceUnit}>· kg per week</Span>
        </Text>
        <Segmented
          accessibilityLabel="Pace, kg per week"
          options={PACES}
          value={pace}
          onChange={setPace}
          renderOption={(o, active) => (
            <Text style={[styles.paceText, active ? styles.paceTextOn : null]}>
              {o.label}
            </Text>
          )}
        />
        <Text style={styles.paceHint}>
          0.5 kg/week is a steady, sustainable pace
        </Text>
      </View>

      {/* Daily target */}
      <View style={styles.target}>
        <View style={styles.targetHead}>
          <Text style={type.eyebrow} accessibilityRole="header">
            Your daily target
          </Text>
          <Badge tone="white" label="Estimate" />
        </View>
        <View style={styles.kcalRow}>
          <Text style={styles.kcal}>1,600</Text>
          <Text style={styles.kcalUnit}>kcal/day</Text>
        </View>
        <Text style={styles.maintenance}>
          ≈ 500 kcal below your maintenance of 2,100
        </Text>
        <View style={styles.tiles}>
          <MacroTile
            label="Protein"
            value="120 g"
            dot={colors.proteinBlue}
            background={colors.proteinMist}
            labelColor={colors.proteinBlue}
            valueColor={colors.proteinBlue}
          />
          <MacroTile label="Carbs" value="160 g" dot={colors.turmeric} />
          <MacroTile label="Fat" value="53 g" dot={colors.ink2} />
        </View>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.split}
        >
          <View style={styles.splitProtein} />
          <View style={styles.splitCarbs} />
          <View style={styles.splitFat} />
        </View>
        <Text style={styles.splitNote}>
          Protein 30% · Carbs 40% · Fat 30% of calories
        </Text>
      </View>

      {/* How we'll use it */}
      <View style={styles.uses}>
        <Text style={type.h3} accessibilityRole="header">
          {"How we'll use it"}
        </Text>
        <View style={styles.useList}>
          {USES.map(u => (
            <View key={u.icon} style={styles.use}>
              <View style={styles.useIcon}>
                <Icon name={u.icon} size={20} color={colors.forestInk} />
              </View>
              <Text style={styles.useText}>{u.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

/** Macro tile: r14, padding 10 12; 8px dot + 12px 600 label, 20/24 800 value. */
function MacroTile({
  label,
  value,
  dot,
  background = colors.surface,
  labelColor = colors.ink2,
  valueColor = colors.forestInk,
}: {
  label: string;
  value: string;
  dot: string;
  background?: string;
  labelColor?: string;
  valueColor?: string;
}) {
  return (
    <View style={[styles.tile, { backgroundColor: background }]}>
      <View style={styles.tileHead}>
        <View style={[styles.tileDot, { backgroundColor: dot }]} />
        <Text style={[styles.tileLabel, { color: labelColor }]}>{label}</Text>
      </View>
      <Text style={[styles.tileValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { paddingTop: 12, paddingHorizontal: 20 },
  legend: { marginBottom: 10 },
  rows: { gap: 8 },
  pace: { marginTop: 28 },
  paceLabel: { marginBottom: 8 },
  paceUnit: { ...ff('body', 500), color: colors.ink3 },
  paceText: {
    ...ff('body', 600),
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink2,
    fontVariant: ['tabular-nums'],
  },
  paceTextOn: { color: colors.forestInk },
  paceHint: { marginTop: 8, fontSize: 12, lineHeight: 16, color: colors.ink3 },
  target: {
    marginTop: 28,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.kcalCream,
  },
  targetHead: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
    color: colors.turmericDeep,
  },
  kcalUnit: {
    ...ff('display', 700),
    fontSize: 16,
    lineHeight: 22,
    color: colors.turmericDeep,
  },
  maintenance: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink2,
  },
  tiles: { marginTop: 16, flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tileHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tileDot: { width: 8, height: 8, borderRadius: 999 },
  tileLabel: { ...ff('body', 600), fontSize: 12, lineHeight: 16 },
  tileValue: {
    marginTop: 2,
    ...ff('display', 800),
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: em(-0.01, 20),
  },
  split: {
    marginTop: 14,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 2,
  },
  splitProtein: { width: '30%', backgroundColor: colors.proteinBlue },
  splitCarbs: { width: '40%', backgroundColor: colors.turmeric },
  splitFat: { flex: 1, backgroundColor: colors.ink2 },
  splitNote: { marginTop: 8, fontSize: 12, lineHeight: 16, color: colors.ink2 },
  uses: { marginTop: 28 },
  useList: { marginTop: 12, gap: 10 },
  use: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  useIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useText: { ...type.ui, flexShrink: 1 },
});
