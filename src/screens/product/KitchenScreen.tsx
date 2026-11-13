import { Fragment } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { images } from '../../assets/images';
import {
  Divider,
  Icon,
  IconCircleButton,
  PhotoPlaceholder,
  Screen,
  ScreenHeader,
  Span,
  Text,
} from '../../components';
import type { ProductId } from '../../state/cart';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import { DietChip, DishRow, PillChip, ShopCartBar, type Diet, type Photo } from './parts';

/** 2.4 Kitchen · Green Fork Kitchen — design file: Product-Kitchen.dc.html */
export default function KitchenScreen() {
  const nav = useNav();
  return (
    <Screen
      header={
        <ScreenHeader
          onBack={() => nav.navigate('Home')}
          right={
            <View style={styles.headerActions}>
              <IconCircleButton
                icon="search"
                size={20}
                accessibilityLabel="Search this menu"
              />
              <IconCircleButton icon="share" size={20} accessibilityLabel="Share kitchen" />
            </View>
          }
        />
      }
      floating={<ShopCartBar last />}
    >
      {/* Cover + logo */}
      <View style={styles.cover}>
        <PhotoPlaceholder
          tone="green"
          label="[kitchen cover photo]"
          iconSize={24}
          style={styles.coverPhoto}
        />
        <PhotoPlaceholder tone="warm" label="[logo]" style={styles.logo} />
      </View>

      {/* Name, rating, promise */}
      <View style={styles.info}>
        <Text style={type.h1} accessibilityRole="header">
          Green Fork Kitchen
        </Text>
        <View style={styles.metaRow}>
          <Icon name="star" size={14} color={colors.turmeric} />
          <Text style={styles.metaText}>
            <Span style={styles.metaStrong}>4.5</Span> · 25 min · HSR Layout
          </Text>
        </View>
        <View style={styles.banner}>
          <Icon name="leaf" size={20} color={colors.leaf} />
          <View style={styles.bannerBody}>
            <Text style={styles.bannerTitle}>Every dish under 550 kcal</Text>
            <Text style={styles.bannerSub}>Calories verified by our nutritionist</Text>
          </View>
        </View>
      </View>

      {/* Diet + sort */}
      <View style={styles.controls}>
        <DietChip />
        <PillChip
          label="Lowest kcal first"
          padLeft={12}
          padRight={12}
          accessibilityLabel="Sort: lowest kcal first. Change"
          left={<Icon name="flame" size={16} color={colors.turmericDeep} />}
          right={<Icon name="chevronDown" size={16} color={colors.forestInk} />}
        />
      </View>

      <MenuSection title="Bowls" count="3 dishes" dishes={BOWLS} style={styles.first} />
      <MenuSection title="Breakfast" count="2 dishes" dishes={BREAKFAST} style={styles.next} />
    </Screen>
  );
}

/* ───────────── Menu section ───────────── */

type Dish = {
  photo: Photo;
  diet: Diet;
  name: string;
  description: string;
  kcal: number;
  price: string;
  protein: string;
  productId: ProductId;
};

function MenuSection({
  title,
  count,
  dishes,
  style,
}: {
  title: string;
  count: string;
  dishes: Dish[];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionHead}>
        <Text style={type.h3} accessibilityRole="header">
          {title}
        </Text>
        <Text style={type.small}>{count}</Text>
      </View>
      <View style={styles.card}>
        {dishes.map((d, i) => (
          <Fragment key={d.name}>
            {i > 0 ? <Divider inset={16} /> : null}
            <DishRow {...d} />
          </Fragment>
        ))}
      </View>
    </View>
  );
}

/* ───────────── Data (as drawn) ───────────── */

const BOWLS: Dish[] = [
  {
    photo: images.berryMuesliBowl,
    diet: 'veg',
    name: 'Berry muesli yogurt bowl',
    description: 'Thick yogurt, no-added-sugar muesli, fresh berries and dates',
    kcal: 340,
    price: '₹199',
    protein: '14 g protein',
    productId: 'berryBowl',
  },
  {
    photo: 'green',
    diet: 'veg',
    name: 'Roasted veg hummus bowl',
    description: 'Roasted peppers and zucchini on herbed hummus with millet',
    kcal: 390,
    price: '₹229',
    protein: '15 g protein',
    productId: 'hummusBowl',
  },
  {
    photo: 'warm',
    diet: 'veg',
    name: 'Paneer tikka millet bowl',
    description: 'Tandoori paneer, foxtail millet, mint chutney, crisp salad',
    kcal: 420,
    price: '₹249',
    protein: '28 g protein',
    productId: 'paneer',
  },
];

const BREAKFAST: Dish[] = [
  {
    photo: 'warm',
    diet: 'veg',
    name: 'Masala oats upma',
    description: 'Rolled oats with mustard, curry leaves and garden veggies',
    kcal: 280,
    price: '₹149',
    protein: '9 g protein',
    productId: 'upma',
  },
  {
    photo: 'green',
    diet: 'veg',
    name: 'Ragi banana pancakes',
    description: 'Finger-millet pancakes, banana, curd dip. No refined sugar',
    kcal: 330,
    price: '₹189',
    protein: '10 g protein',
    productId: 'pancakes',
  },
];

const styles = StyleSheet.create({
  headerActions: { flexDirection: 'row', gap: 8 },

  /* cover */
  cover: { marginTop: 4, marginHorizontal: 20, height: 160 },
  coverPhoto: { height: 160, borderRadius: 18, gap: 6 },
  logo: {
    position: 'absolute',
    left: 16,
    bottom: -36,
    width: 72,
    height: 72,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.paper,
    gap: 2,
  },

  /* info */
  info: { paddingTop: 48, paddingHorizontal: 20 },
  metaRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 14, lineHeight: 20, color: colors.ink2 },
  metaStrong: { ...ff('body', 600), color: colors.forestInk },
  banner: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.leafMist,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bannerBody: { flexShrink: 1 },
  bannerTitle: { ...ff('body', 700), fontSize: 14, lineHeight: 20, color: colors.leaf },
  bannerSub: { marginTop: 2, fontSize: 13, lineHeight: 18, color: colors.ink2 },

  /* controls */
  controls: {
    marginTop: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  /* menu sections */
  section: { paddingHorizontal: 20 },
  first: { marginTop: 20 },
  next: { marginTop: 28 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  card: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
});
