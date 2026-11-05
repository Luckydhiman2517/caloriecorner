import { StyleSheet, View } from 'react-native';
import { images } from '../../assets/images';
import {
  Badge,
  BottomNav,
  Icon,
  Screen,
  SectionHeader,
  Tap,
  Text,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';
import {
  HomeHeader,
  ProductPhoto,
  ProductRow,
  SearchBarLink,
  ShopCartBar,
  ShopSegmented,
  type Diet,
  type Photo,
} from './parts';

/** 2.2 Home · Groceries — design file: Product-HomeGroceries.dc.html */
export default function HomeGroceriesScreen() {
  const nav = useNav();
  return (
    <Screen floating={<ShopCartBar />} bottomNav={<BottomNav active="home" />}>
      <HomeHeader />
      <SearchBarLink />
      <ShopSegmented active="groceries" />
      <ShelfRules />

      {/* Shop by need */}
      <View style={styles.section}>
        <SectionHeader
          title="Shop by need"
          action="See all"
          onAction={() => nav.navigate('Listing')}
        />
        <View style={styles.grid}>
          {NEED_ROWS.map(row => (
            <View key={row[0].name} style={styles.gridRow}>
              {row.map(n => (
                <NeedTile key={n.name} {...n} />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Picked for your goal */}
      <View style={styles.section}>
        <SectionHeader
          eyebrow="Most protein per kcal"
          title="Picked for your goal"
          action="See all"
          onAction={() => nav.navigate('Listing')}
        />
        <View style={styles.list}>
          {PRODUCTS.map(p => (
            <ProductRow key={p.name} to="Item" {...p} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

/* ───────────── Shelf rules ───────────── */

const RULES = [
  ['No refined sugar', 'No palm oil'],
  ['No artificial sweeteners', 'No synthetic colours'],
];

function ShelfRules() {
  return (
    <View accessibilityLabel="Shelf rules" style={styles.shelf}>
      <View style={styles.shelfTop}>
        <Text style={styles.shelfEyebrow}>Shelf rules</Text>
        <Badge style={styles.deliveryBadge}>
          <Icon name="clock" size={16} color={colors.forestInk} />
          <Text style={styles.deliveryText} numberOfLines={1}>
            Delivery in 10 min
          </Text>
        </Badge>
      </View>
      <Text style={styles.shelfTitle}>Every product on our shelf:</Text>
      <View style={styles.rules}>
        {RULES.map(row => (
          <View key={row[0]} style={styles.rulesRow}>
            {row.map(rule => (
              <View key={rule} style={styles.rule}>
                <View style={styles.ruleIcon}>
                  <Icon name="check" size={16} color={colors.turmeric} />
                </View>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

/* ───────────── Shop-by-need tile ───────────── */

type Need = { photo: Photo; name: string; count: string };

function NeedTile({ photo, name, count }: Need) {
  const nav = useNav();
  return (
    <Tap
      accessibilityRole="link"
      onPress={() => nav.navigate('Listing')}
      style={styles.tile}
    >
      <ProductPhoto photo={photo} width="100%" height={76} label="[photo]" />
      <View style={styles.tileBody}>
        <Text style={styles.tileName}>{name}</Text>
        <Text style={styles.tileCount}>{count}</Text>
      </View>
    </Tap>
  );
}

/* ───────────── Data (as drawn) ───────────── */

const NEED_ROWS: Need[][] = [
  [
    { photo: images.eggsCarton, name: 'Dairy & eggs', count: '54 items' },
    { photo: images.blueberriesPunnet, name: 'Fruits', count: '31 items' },
    { photo: images.muesliBowlHero, name: 'Breakfast cereals', count: '22 items' },
  ],
  [
    { photo: 'warm', name: 'Millets & atta', count: '18 items' },
    { photo: 'green', name: 'Clean snacks', count: '47 items' },
    { photo: 'warm', name: 'Oils & ghee', count: '12 items' },
  ],
];

const PRODUCTS: {
  photo: Photo;
  diet: Diet;
  name: string;
  meta: string;
  protein: string;
  kcal: number;
  unit: string;
  price: string;
  initialQty: number;
}[] = [
  {
    photo: images.greekYogurtThumb,
    diet: 'veg',
    name: 'Unsweetened Greek yogurt',
    meta: '400 g · 380 kcal pack',
    protein: '9.5 g protein / 100 kcal',
    kcal: 95,
    unit: 'kcal/100 g',
    price: '₹180',
    initialQty: 1,
  },
  {
    photo: images.eggsThumb,
    diet: 'nonveg',
    name: 'Pasture-raised eggs',
    meta: '6 pcs · 420 kcal pack',
    protein: '8.6 g protein / 100 kcal',
    kcal: 70,
    unit: 'kcal/egg',
    price: '₹120',
    initialQty: 0,
  },
  {
    photo: images.moongSproutsThumb,
    diet: 'veg',
    name: 'Fresh moong sprouts',
    meta: '200 g · 120 kcal pack',
    protein: '8.3 g protein / 100 kcal',
    kcal: 60,
    unit: 'kcal/100 g',
    price: '₹45',
    initialQty: 0,
  },
  {
    photo: images.muesliBowlHero,
    diet: 'veg',
    name: 'No-added-sugar muesli',
    meta: '400 g · 1,520 kcal pack',
    protein: '2.6 g protein / 100 kcal',
    kcal: 152,
    unit: 'kcal/serving',
    price: '₹349',
    initialQty: 0,
  },
  {
    photo: images.blueberriesThumb,
    diet: 'veg',
    name: 'Blueberries',
    meta: '125 g · 71 kcal pack',
    protein: '1.8 g protein / 100 kcal',
    kcal: 57,
    unit: 'kcal/100 g',
    price: '₹299',
    initialQty: 0,
  },
];

const styles = StyleSheet.create({
  section: { marginTop: 28 },

  /* shelf rules */
  shelf: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: colors.forestInk,
    borderRadius: 20,
    padding: 16,
  },
  shelfTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  shelfEyebrow: { ...type.eyebrow, color: colors.turmeric },
  deliveryBadge: { backgroundColor: colors.turmeric },
  deliveryText: { ...ff('body', 600), fontSize: 12, lineHeight: 16, color: colors.forestInk },
  shelfTitle: { ...type.h3, marginTop: 8, color: '#FFFFFF' },
  rules: { marginTop: 10, gap: 8 },
  rulesRow: { flexDirection: 'row', gap: 12 },
  rule: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  ruleIcon: { marginTop: 1 },
  ruleText: { flexShrink: 1, fontSize: 13, lineHeight: 18, color: '#FFFFFF' },

  /* shop by need */
  grid: { marginTop: 12, paddingHorizontal: 20, gap: 12 },
  gridRow: { flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    overflow: 'hidden',
  },
  tileBody: {
    flexGrow: 1,
    paddingTop: 10,
    paddingRight: 8,
    paddingBottom: 12,
    paddingLeft: 10,
  },
  tileName: {
    ...ff('body', 600),
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: em(-0.01, 13),
  },
  tileCount: {
    marginTop: 'auto',
    paddingTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
  },

  /* product list */
  list: { marginTop: 12, paddingHorizontal: 20, gap: 12 },
});
