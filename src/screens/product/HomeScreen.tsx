import { Fragment } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { images } from '../../assets/images';
import {
  BottomNav,
  Divider,
  Icon,
  PhotoPlaceholder,
  Rating,
  Screen,
  SectionHeader,
  Span,
  Tap,
  Text,
  type BadgeTone,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import {
  HomeHeader,
  MealCard,
  PillChip,
  SearchBarLink,
  ShopCartBar,
  ShopSegmented,
  type Diet,
  type Photo,
} from './parts';

/** 2.1 Home · Meals — design file: Product-Home.dc.html */
export default function HomeScreen() {
  const nav = useNav();
  return (
    <Screen floating={<ShopCartBar />} bottomNav={<BottomNav active="home" />}>
      <HomeHeader />
      <SearchBarLink />
      <ShopSegmented active="meals" />
      <GoalCard />
      <ProfileNudge />

      {/* Picked for your goal */}
      <View style={styles.picked}>
        <SectionHeader
          eyebrow="Most protein per kcal"
          title="Picked for your goal"
          action="See all"
          onAction={() => nav.navigate('Listing')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rail}
          contentContainerStyle={styles.railContent}
        >
          {PICKS.map(p => (
            <MealCard key={p.name} {...p} />
          ))}
        </ScrollView>
      </View>

      {/* Browse */}
      <View style={styles.browse}>
        <Text style={[type.h3, styles.browseTitle]} accessibilityRole="header">
          Browse
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRail}
          contentContainerStyle={styles.chipRailContent}
        >
          {BROWSE.map(b => (
            <PillChip
              key={b.label}
              label={b.label}
              accessibilityRole="link"
              accessibilityLabel={b.a11y}
              padLeft={b.icon ? 12 : 14}
              left={
                b.icon ? (
                  <Icon name={b.icon} size={16} color={colors.turmericDeep} />
                ) : undefined
              }
              onPress={() => nav.navigate('Listing')}
            />
          ))}
        </ScrollView>
      </View>

      {/* Kitchens near you */}
      <View style={styles.kitchens}>
        <SectionHeader
          title="Kitchens near you"
          action="See all"
          onAction={() => nav.navigate('Listing')}
        />
        <View style={styles.kitchenCard}>
          {KITCHENS.map((k, i) => (
            <Fragment key={k.name}>
              {i > 0 ? <Divider inset={16} /> : null}
              <KitchenRow {...k} />
            </Fragment>
          ))}
        </View>
      </View>
    </Screen>
  );
}

/* ───────────── Today's calories ───────────── */

function GoalCard() {
  const nav = useNav();
  return (
    <View accessibilityLabel="Today's calories" style={styles.goal}>
      <Text style={styles.goalEyebrow}>Your goal · Lose weight</Text>
      <View style={styles.goalRow}>
        <Text style={styles.goalNumber}>1,020</Text>
        <Text style={styles.goalLeft}>kcal left today</Text>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Calories eaten today"
        accessibilityValue={{ min: 0, max: 100, now: 36 }}
        style={styles.track}
      >
        <View style={styles.fill} />
      </View>
      <View style={styles.goalFoot}>
        <Text style={styles.goalMeta} numberOfLines={1}>
          580 eaten · 1,600 target · 36% eaten
        </Text>
        <Tap
          accessibilityRole="link"
          onPress={() => nav.navigate('Goal')}
          style={styles.editGoal}
        >
          <Text style={styles.editGoalText}>Edit goal</Text>
          <Icon name="chevronRight" size={16} color={colors.turmeric} />
        </Tap>
      </View>
    </View>
  );
}

/* ───────────── Profile 40% nudge ───────────── */

function ProfileNudge() {
  const nav = useNav();
  return (
    <Tap
      accessibilityRole="link"
      onPress={() => nav.navigate('CompleteProfile')}
      style={styles.nudge}
    >
      <Svg width={28} height={28} viewBox="0 0 28 28">
        <Circle cx={14} cy={14} r={11} fill="none" stroke={colors.stone} strokeWidth={4} />
        <Circle
          cx={14}
          cy={14}
          r={11}
          fill="none"
          stroke={colors.turmeric}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={[27.65, 69.12]}
          transform="rotate(-90 14 14)"
        />
      </Svg>
      <Text style={styles.nudgeText} numberOfLines={1}>
        <Span style={styles.bold}>Profile 40%</Span>
        <Span style={styles.ink2}> · get your exact calorie target</Span>
      </Text>
      <Icon name="chevronRight" size={16} color={colors.ink3} />
    </Tap>
  );
}

/* ───────────── Kitchen row ───────────── */

type Kitchen = {
  logo: 'warm' | 'green';
  name: string;
  rating: string;
  time: string;
  tagline: string;
};

function KitchenRow({ logo, name, rating, time, tagline }: Kitchen) {
  const nav = useNav();
  return (
    <Tap
      accessibilityRole="link"
      onPress={() => nav.navigate('Kitchen')}
      style={styles.kitchenRow}
    >
      <PhotoPlaceholder tone={logo} label="[logo]" style={styles.kitchenLogo} />
      <View style={styles.kitchenBody}>
        <Text style={styles.kitchenName}>{name}</Text>
        <Rating value={rating} meta={time} style={styles.mt2} />
        <Text style={styles.kitchenTag}>{tagline}</Text>
      </View>
      <Icon name="chevronRight" size={20} color={colors.ink3} />
    </Tap>
  );
}

/* ───────────── Data (as drawn) ───────────── */

const PICKS: {
  photo: Photo;
  badge: { label: string; tone: BadgeTone };
  diet: Diet;
  name: string;
  meta: string;
  kcal: number;
  price: string;
  initialQty: number;
}[] = [
  {
    photo: images.eggsCarton,
    badge: { label: '24 g protein', tone: 'protein' },
    diet: 'nonveg',
    name: 'Egg white veggie omelette',
    meta: 'Protein Pot · Contains egg',
    kcal: 260,
    price: '₹179',
    initialQty: 1,
  },
  {
    photo: 'warm',
    badge: { label: '28 g protein', tone: 'protein' },
    diet: 'veg',
    name: 'Paneer tikka millet bowl',
    meta: 'Green Fork Kitchen',
    kcal: 420,
    price: '₹249',
    initialQty: 1,
  },
  {
    photo: 'green',
    badge: { label: 'Lightest · 180 kcal', tone: 'kcal' },
    diet: 'veg',
    name: 'Moong sprout chaat',
    meta: 'Millet Mama',
    kcal: 180,
    price: '₹149',
    initialQty: 0,
  },
  {
    photo: images.berryMuesliBowl,
    badge: { label: 'No added sugar', tone: 'leaf' },
    diet: 'veg',
    name: 'Berry muesli yogurt bowl',
    meta: 'Green Fork Kitchen',
    kcal: 340,
    price: '₹199',
    initialQty: 0,
  },
];

const BROWSE: { label: string; icon?: 'target'; a11y?: string }[] = [
  { label: 'Under 300 kcal' },
  { label: '300–500 kcal', icon: 'target', a11y: '300–500 kcal, fits your goal' },
  { label: '500+ kcal' },
  { label: 'High protein' },
  { label: 'Salads & bowls' },
  { label: 'Breakfast' },
  { label: 'Millet meals' },
  { label: 'Soups & light' },
  { label: 'Egg dishes' },
];

const KITCHENS: Kitchen[] = [
  {
    logo: 'green',
    name: 'Green Fork Kitchen',
    rating: '4.5',
    time: '25 min',
    tagline: 'Every dish under 550 kcal',
  },
  {
    logo: 'warm',
    name: 'Protein Pot',
    rating: '4.3',
    time: '30 min',
    tagline: '30 g+ protein bowls',
  },
  {
    logo: 'green',
    name: 'Millet Mama',
    rating: '4.6',
    time: '20 min',
    tagline: 'Millet-first home food',
  },
];

const styles = StyleSheet.create({
  mt2: { marginTop: 2 },
  bold: ff('body', 700),
  ink2: { color: colors.ink2 },

  /* goal card */
  goal: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: colors.forestInk,
    borderRadius: 20,
    padding: 16,
  },
  goalEyebrow: { ...type.eyebrow, color: colors.turmeric },
  goalRow: { marginTop: 6, flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  goalNumber: { ...type.numeralL, color: '#FFFFFF' },
  goalLeft: { fontSize: 14, lineHeight: 20, color: colors.onDarkMuted },
  track: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.white14,
    overflow: 'hidden',
  },
  fill: { width: '36%', height: 8, borderRadius: 999, backgroundColor: colors.turmeric },
  goalFoot: {
    marginTop: 10,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  goalMeta: { flexShrink: 1, fontSize: 12, lineHeight: 16, color: colors.onDarkMuted },
  editGoal: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 44,
    paddingHorizontal: 8,
    marginVertical: -12,
    marginHorizontal: -8,
  },
  editGoalText: { ...ff('body', 600), fontSize: 13, lineHeight: 20, color: colors.turmeric },

  /* profile nudge */
  nudge: {
    marginTop: 12,
    marginHorizontal: 20,
    height: 48,
    paddingLeft: 10,
    paddingRight: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nudgeText: { flex: 1, minWidth: 0, fontSize: 13, lineHeight: 18 },

  /* picked rail */
  picked: { marginTop: 24 },
  rail: { marginTop: 12, flexGrow: 0 },
  railContent: { paddingHorizontal: 20, gap: 12 },

  /* browse */
  browse: { marginTop: 28 },
  browseTitle: { paddingHorizontal: 20 },
  chipRail: { marginTop: 8, flexGrow: 0 },
  chipRailContent: { paddingHorizontal: 20, gap: 8 },

  /* kitchens */
  kitchens: { marginTop: 28 },
  kitchenCard: {
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
  kitchenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  kitchenLogo: { width: 56, height: 56, borderRadius: 14 },
  kitchenBody: { flex: 1, minWidth: 0 },
  kitchenName: { ...ff('body', 600), fontSize: 15, lineHeight: 20 },
  kitchenTag: {
    marginTop: 2,
    ...ff('body', 600),
    fontSize: 13,
    lineHeight: 18,
    color: colors.turmericDeep,
  },
});
