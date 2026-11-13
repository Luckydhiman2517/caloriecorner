import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { images } from '../../assets/images';
import {
  Badge,
  BottomNav,
  Button,
  Icon,
  Screen,
  ScreenHeader,
  Tap,
  Text,
} from '../../components';
import type { ProductId } from '../../state/cart';
import { useNav, type RouteName } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import {
  DietChip,
  PillChip,
  ProductRow,
  ShopCartBar,
  pillColor,
  type Diet,
  type Photo,
  type PillTone,
} from './parts';

type Kind = 'all' | 'meals' | 'groceries';

/** 2.3 Listing · High protein — design file: Product-Listing.dc.html */
export default function ListingScreen() {
  const nav = useNav();
  const [query, setQuery] = useState('protein');
  const [under500, setUnder500] = useState(true);
  const [protein20, setProtein20] = useState(false);
  const [tab, setTab] = useState<Kind>('all');

  const kcalTone: PillTone = under500 ? 'kcal' : 'off';
  const proteinTone: PillTone = protein20 ? 'on' : 'off';
  const results = RESULTS.filter(r => tab === 'all' || r.kind === tab);

  return (
    <Screen
      header={
        <ScreenHeader
          title="High protein"
          subtitle="17 picks · ranked for weight loss"
          onBack={() => nav.navigate('Home')}
        />
      }
      floating={<ShopCartBar />}
      bottomNav={<BottomNav active="search" />}
    >
      {/* Search field */}
      <View style={styles.searchBox}>
        <View style={styles.searchLabel}>
          <Icon name="search" size={20} color={colors.ink3} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Search meals, groceries, kitchens"
            returnKeyType="search"
            style={styles.searchInput}
          />
        </View>
        <Tap
          accessibilityLabel="Clear search"
          onPress={() => setQuery('')}
          style={styles.clear}
        >
          <View style={styles.clearDot}>
            <Icon name="x" size={16} color={colors.ink2} />
          </View>
        </Tap>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        accessibilityLabel="Filters"
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filterRow}
      >
        <DietChip active />
        <PillChip
          label="Under 500 kcal"
          tone={kcalTone}
          accessibilityRole="togglebutton"
          accessibilityState={{ checked: under500 }}
          left={<Icon name="flame" size={16} color={pillColor(kcalTone)} />}
          onPress={() => setUnder500(v => !v)}
        />
        <PillChip
          label="20 g+ protein"
          tone={proteinTone}
          accessibilityRole="togglebutton"
          accessibilityState={{ checked: protein20 }}
          onPress={() => setProtein20(v => !v)}
        />
      </ScrollView>

      {/* Result type tabs */}
      <View accessibilityRole="tablist" accessibilityLabel="Result type" style={styles.tabs}>
        {TABS.map(t => {
          const on = t.key === tab;
          return (
            <Tap
              key={t.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              pressScale={1}
              onPress={() => setTab(t.key)}
              style={[styles.tab, on ? styles.tabOn : null]}
            >
              <Text style={[styles.tabText, on ? styles.fgInk : styles.fgInk2]}>
                {t.label}
              </Text>
              <View style={[styles.count, on ? styles.countOn : styles.countOff]}>
                <Text style={[styles.countText, on ? styles.fgWhite : styles.fgInk2]}>
                  {t.count}
                </Text>
              </View>
            </Tap>
          );
        })}
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        <View style={styles.sortedBy}>
          <Icon name="flame" size={16} color={colors.ink3} />
          <Text style={type.small}>Sorted by protein per kcal</Text>
        </View>
        <Tap accessibilityLabel="Sort: protein per kcal. Change" style={styles.sortBtn}>
          <Text style={type.link}>Sort</Text>
          <Icon name="chevronDown" size={16} color={colors.turmericDeep} />
        </Tap>
      </View>

      {/* Results */}
      <View style={styles.list}>
        {results.map(r => (
          <ProductRow
            key={r.name}
            photo={r.photo}
            diet={r.diet}
            name={r.name}
            meta={r.meta}
            protein={r.protein}
            kcal={r.kcal}
            unit={r.unit}
            price={r.price}
            to={r.to}
            highlighted={r.best}
            badge={
              r.best ? (
                <Badge
                  label="Best protein per kcal"
                  tone="kcal"
                  icon="star"
                  style={styles.bestBadge}
                />
              ) : undefined
            }
            productId={r.productId}
          />
        ))}
      </View>

      <Button variant="secondary" style={styles.more}>
        <Text style={styles.moreText}>Show 10 more picks</Text>
        <Icon name="chevronDown" size={20} color={colors.forestInk} />
      </Button>
    </Screen>
  );
}

/* ───────────── Data (as drawn) ───────────── */

const TABS: { key: Kind; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: 17 },
  { key: 'meals', label: 'Meals', count: 11 },
  { key: 'groceries', label: 'Groceries', count: 6 },
];

const RESULTS: {
  kind: Exclude<Kind, 'all'>;
  to: RouteName;
  photo: Photo;
  diet: Diet;
  name: string;
  meta: string;
  protein: string;
  kcal: number;
  unit?: string;
  price: string;
  productId: ProductId;
  best?: boolean;
}[] = [
  {
    kind: 'groceries',
    to: 'Item',
    photo: images.greekYogurtThumb,
    diet: 'veg',
    name: 'Unsweetened Greek yogurt',
    meta: '400 g · 380 kcal pack',
    protein: '9.5 g protein / 100 kcal',
    kcal: 95,
    unit: 'kcal/100 g',
    price: '₹180',
    productId: 'yogurt',
    best: true,
  },
  {
    kind: 'meals',
    to: 'Meal',
    photo: images.eggsThumb,
    diet: 'nonveg',
    name: 'Egg white veggie omelette',
    meta: 'Protein Pot · Contains egg',
    protein: '9.2 g protein / 100 kcal',
    kcal: 260,
    price: '₹179',
    productId: 'omelette',
  },
  {
    kind: 'groceries',
    to: 'Item',
    photo: images.eggsCarton,
    diet: 'nonveg',
    name: 'Pasture-raised eggs',
    meta: '6 pcs · 420 kcal pack',
    protein: '8.6 g protein / 100 kcal',
    kcal: 70,
    unit: 'kcal/egg',
    price: '₹120',
    productId: 'eggs',
  },
  {
    kind: 'meals',
    to: 'Meal',
    photo: 'warm',
    diet: 'veg',
    name: 'Paneer tikka millet bowl',
    meta: 'Green Fork Kitchen',
    protein: '6.7 g protein / 100 kcal',
    kcal: 420,
    price: '₹249',
    productId: 'paneer',
  },
  {
    kind: 'meals',
    to: 'Meal',
    photo: images.moongSproutsThumb,
    diet: 'veg',
    name: 'Moong sprout chaat',
    meta: 'Millet Mama',
    protein: '6.1 g protein / 100 kcal',
    kcal: 180,
    price: '₹149',
    productId: 'chaat',
  },
  {
    kind: 'meals',
    to: 'Meal',
    photo: images.berryMuesliBowl,
    diet: 'veg',
    name: 'Berry muesli yogurt bowl',
    meta: 'Green Fork Kitchen',
    protein: '4.1 g protein / 100 kcal',
    kcal: 340,
    price: '₹199',
    productId: 'berryBowl',
  },
  {
    kind: 'meals',
    to: 'Meal',
    photo: 'green',
    diet: 'veg',
    name: 'Light dal khichdi',
    meta: 'Millet Mama',
    protein: '3.9 g protein / 100 kcal',
    kcal: 310,
    price: '₹169',
    productId: 'khichdi',
  },
];

const styles = StyleSheet.create({
  /* search field */
  searchBox: {
    marginTop: 8,
    marginHorizontal: 20,
    height: 52,
    paddingLeft: 16,
    paddingRight: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  searchLabel: {
    flex: 1,
    minWidth: 0,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: 48,
    padding: 0,
    ...ff('body', 500),
    fontSize: 16,
    color: colors.forestInk,
  },
  clear: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  clearDot: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* filters */
  filters: { marginTop: 8, flexGrow: 0 },
  filterRow: { paddingHorizontal: 20, gap: 8 },

  /* tabs */
  tabs: {
    marginTop: 4,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tab: {
    height: 44,
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabOn: { borderBottomColor: colors.forestInk },
  tabText: { ...ff('body', 600), fontSize: 14 },
  count: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countOn: { backgroundColor: colors.forestInk },
  countOff: { backgroundColor: colors.stone },
  countText: { ...ff('body', 600), fontSize: 12 },
  fgInk: { color: colors.forestInk },
  fgInk2: { color: colors.ink2 },
  fgWhite: { color: '#FFFFFF' },

  /* sort */
  sortRow: {
    marginTop: 4,
    paddingHorizontal: 20,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sortedBy: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  sortBtn: {
    height: 44,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  /* results */
  list: { marginTop: 4, paddingHorizontal: 20, gap: 12 },
  bestBadge: { marginBottom: 10 },

  /* show more */
  more: { marginTop: 16, marginHorizontal: 20, gap: 6 },
  moreText: { ...ff('body', 600), fontSize: 15, color: colors.forestInk },
});
