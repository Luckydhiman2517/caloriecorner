import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomBar,
  Button,
  Icon,
  IconTile,
  Kcal,
  RadioRow,
  Screen,
  ScreenHeader,
  Tap,
  Text,
  TextLink,
  type IconName,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';

type Goal = 'lose' | 'gain' | 'muscle' | 'maintain' | 'healthier';

const GOALS: { value: Goal; title: string; subtitle: string; icon: IconName }[] = [
  {
    value: 'lose',
    title: 'Lose weight',
    subtitle: 'Calorie deficit, filling meals first',
    icon: 'trendingDown',
  },
  {
    value: 'gain',
    title: 'Gain weight',
    subtitle: 'Calorie surplus, wholesome & dense',
    icon: 'trendingUp',
  },
  {
    value: 'muscle',
    title: 'Build muscle',
    subtitle: 'High protein, 30 g+ per meal',
    icon: 'dumbbell',
  },
  {
    value: 'maintain',
    title: 'Maintain weight',
    subtitle: 'Balanced, steady energy',
    icon: 'maintain',
  },
  {
    value: 'healthier',
    title: 'Eat healthier',
    subtitle: 'Clean labels, no calorie target',
    icon: 'leaf',
  },
];

const DIETS = ['Veg', 'Egg', 'Non-veg', 'Vegan', 'Jain'] as const;
type Diet = (typeof DIETS)[number];

/** 1.8 Pick your goal — design file: Onboard-Goal.dc.html */
export default function PickGoalScreen() {
  const nav = useNav();
  const [goal, setGoal] = useState<Goal>('lose');
  const [diets, setDiets] = useState<Record<Diet, boolean>>({
    Veg: true,
    Egg: true,
    'Non-veg': false,
    Vegan: false,
    Jain: false,
  });
  const enterApp = () => nav.reset({ index: 0, routes: [{ name: 'Home' }] });

  return (
    <Screen
      header={<ScreenHeader />}
      footer={
        <BottomBar border={false} background={colors.paper} style={styles.footer}>
          <Button label="Show my food" onPress={enterApp} />
          <View style={styles.center}>
            <TextLink label="Skip for now" onPress={enterApp} style={styles.skip} />
          </View>
        </BottomBar>
      }
    >
      <View style={styles.body}>
        <Text style={type.eyebrow}>STEP 2 OF 2 · YOUR GOAL</Text>
        <View
          style={styles.steps}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View style={styles.step} />
          <View style={styles.step} />
        </View>

        <Text style={[type.h1, styles.title]} accessibilityRole="header">
          What are you eating for?
        </Text>
        <Text style={[type.body, styles.lede]}>
          {"We'll rank every meal and product for this. Change it any time."}
        </Text>
        <View
          style={styles.goals}
          accessibilityRole="radiogroup"
          accessibilityLabel="What are you eating for?"
        >
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

        <View style={styles.dietHead}>
          <Text style={type.h3} accessibilityRole="header">
            I eat
          </Text>
          <Text style={type.small}>Pick any</Text>
        </View>
        <View style={styles.diets} accessibilityLabel="I eat">
          {DIETS.map(d => (
            <DietToggle
              key={d}
              label={d}
              on={diets[d]}
              onPress={() => setDiets(s => ({ ...s, [d]: !s[d] }))}
            />
          ))}
        </View>

        <View style={styles.target}>
          <View style={styles.targetTile}>
            <Icon name="flame" size={20} color={colors.turmericDeep} />
          </View>
          <View style={styles.targetBody}>
            <Text style={type.fieldLabel}>Starting target</Text>
            <Kcal
              value="≈ 1,600"
              unit="kcal/day"
              size="L"
              style={styles.targetValue}
              unitStyle={styles.targetUnit}
            />
            <Text style={styles.targetNote}>
              Complete your profile later for an exact number — you can order
              right away.
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

/**
 * Diet toggle chip · 36px pill in a 44px hit, padding 0 14, 14px 500.
 * on: Forest Ink with a 16px check; off: white, 1px Line Strong.
 */
function DietToggle({
  label,
  on,
  onPress,
}: {
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <Tap
      accessibilityRole="togglebutton"
      accessibilityState={{ checked: on }}
      onPress={onPress}
      style={styles.chipHit}
    >
      <View style={[styles.chip, on ? styles.chipOn : styles.chipOff]}>
        {on ? <Icon name="check" size={16} color="#FFFFFF" /> : null}
        <Text style={[styles.chipText, on ? styles.chipTextOn : null]}>
          {label}
        </Text>
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: 12, paddingHorizontal: 20 },
  steps: { flexDirection: 'row', gap: 4, marginTop: 8 },
  step: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.turmeric,
  },
  title: { marginTop: 16 },
  lede: { marginTop: 8 },
  goals: { marginTop: 24, gap: 8 },
  dietHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  diets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    marginTop: 8,
  },
  chipHit: { height: 44, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipOn: { backgroundColor: colors.forestInk, borderColor: colors.forestInk },
  chipOff: { backgroundColor: colors.surface, borderColor: colors.lineStrong },
  chipText: { ...ff('body', 500), fontSize: 14, color: colors.forestInk },
  chipTextOn: { color: '#FFFFFF' },
  target: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.kcalCream,
  },
  targetTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetBody: { flex: 1, minWidth: 0 },
  targetValue: { marginTop: 2 },
  targetUnit: { ...ff('body', 700), fontSize: 12 },
  targetNote: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink2,
  },
  footer: { paddingTop: 28 },
  center: { alignItems: 'center', marginTop: 4 },
  skip: { alignSelf: 'center' },
});
