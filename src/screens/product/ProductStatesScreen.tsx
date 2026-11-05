import { useState, type ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '../../assets/images';
import {
  AddOrStepper,
  Badge,
  Button,
  CartBar,
  Chip,
  DietMark,
  Icon,
  Kcal,
  PhotoPlaceholder,
  Screen,
  ScreenHeader,
  Tap,
  Text,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import { OptionRow } from './detailParts';

const DIETS = [
  { value: 'veg', title: 'Veg only', subtitle: 'No egg, meat or fish' },
  { value: 'veg-egg', title: 'Veg + Egg', subtitle: 'Veg dishes, plus eggs' },
  { value: 'all', title: 'Everything', subtitle: 'Includes chicken, meat and fish' },
] as const;

type Diet = (typeof DIETS)[number]['value'];

const MEAL = 'Paneer tikka millet bowl';

/** 2.7 Product states board — design file: Product-States.dc.html */
export default function ProductStatesScreen() {
  const nav = useNav();
  const [diet, setDiet] = useState<Diet>('veg-egg');

  return (
    <Screen header={<ScreenHeader />} contentStyle={styles.board} bottomGap={20}>
      <Text style={type.eyebrow}>States · Product</Text>
      <Text style={[type.h2, styles.h1]} accessibilityRole="header">
        Diet, add & availability states
      </Text>

      {/* Diet · choose — the diet sheet over the scrim */}
      <View style={styles.section}>
        <StateLabel>Diet · choose</StateLabel>
        <View style={styles.scrim}>
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <View style={styles.sheetHead}>
              <Text style={type.h3} accessibilityRole="header">
                Your diet
              </Text>
              <Tap accessibilityLabel="Close" style={styles.close}>
                <Icon name="x" size={20} color={colors.forestInk} />
              </Tap>
            </View>
            <Text style={styles.sheetSub}>Applies to every list, kitchen and search.</Text>
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Diet"
              style={styles.diets}
            >
              {DIETS.map(d => (
                <OptionRow
                  key={d.value}
                  title={d.title}
                  subtitle={d.subtitle}
                  subtitleGap={2}
                  minHeight={72}
                  checkStroke={2.4}
                  selected={diet === d.value}
                  onPress={() => setDiet(d.value)}
                />
              ))}
            </View>
            <Button label="Apply" style={styles.apply} />
          </View>
        </View>
      </View>

      {/* Add · added */}
      <View style={styles.section}>
        <StateLabel>Add · added</StateLabel>
        <View style={styles.pair}>
          <MealCard onOpen={() => nav.navigate('Meal')} initialQty={0} />
          <Note
            label="Before"
            text="ADD is a real button outside the card link, so a tap adds the dish without opening it."
          />
        </View>
        <View style={[styles.pair, styles.pairGap]}>
          <MealCard onOpen={() => nav.navigate('Meal')} initialQty={1} />
          <Note
            label="After"
            text="ADD becomes the compact stepper at 1 (trash removes). The cart bar pulses and a toast confirms."
          />
        </View>
        <View style={styles.bleed}>
          <View accessibilityLiveRegion="polite" style={styles.toast}>
            <Text style={styles.toastText}>Added · 420 kcal · 340 kcal left today</Text>
            <Tap
              accessibilityRole="link"
              onPress={() => nav.navigate('Cart')}
              hitSlop={{ left: 8, right: 8 }}
              style={styles.toastAction}
            >
              <Text style={styles.toastActionText}>View cart</Text>
            </Tap>
          </View>
          <CartBar sub="₹608 · 43% of today's target" />
        </View>
      </View>

      {/* Item · sold out */}
      <View style={styles.section}>
        <StateLabel>Item · sold out</StateLabel>
        <View style={styles.soldOut}>
          <Tap
            accessibilityRole="link"
            onPress={() => nav.navigate('Meal')}
            style={styles.soldOutLink}
          >
            <PhotoPlaceholder tone="green" style={styles.soldOutPhoto} />
            <View style={styles.flex}>
              <View style={styles.nameRow}>
                <DietMark type="veg" style={styles.mark3} />
                <Text style={styles.name15}>Light dal khichdi</Text>
              </View>
              <Text style={styles.kitchen}>Millet Mama</Text>
              <Text style={styles.proteinMeta}>3.9 g protein / 100 kcal</Text>
              <View style={styles.soldOutNumbers}>
                <Kcal value={310} />
                <Text style={type.price} numberOfLines={1}>
                  ₹169
                </Text>
              </View>
            </View>
          </Tap>
          <View style={styles.soldOutTag}>
            <Text style={styles.soldOutText}>Sold out</Text>
          </View>
        </View>
      </View>

      {/* Kitchen · closed */}
      <View style={styles.section}>
        <StateLabel>Kitchen · closed</StateLabel>
        <View accessibilityLiveRegion="polite" style={styles.closed}>
          <Icon name="clock" size={20} color={colors.chili} />
          <Text style={styles.closedText}>Closed now · opens 7:00 AM</Text>
        </View>
        <View style={styles.dishCard}>
          <Tap
            accessibilityRole="link"
            onPress={() => nav.navigate('Meal')}
            style={styles.dishLink}
          >
            <View style={styles.flex}>
              <View style={styles.nameRow}>
                <DietMark type="veg" style={styles.mark4} />
                <Text style={styles.name16}>Berry muesli yogurt bowl</Text>
              </View>
              <Text style={styles.dishDesc} numberOfLines={2}>
                Thick yogurt, no-added-sugar muesli, fresh berries and dates
              </Text>
              <View style={styles.dishNumbers}>
                <Kcal value={340} />
                <Text style={type.price} numberOfLines={1}>
                  ₹199
                </Text>
              </View>
              <Text style={styles.dishProtein}>14 g protein</Text>
            </View>
            <View style={styles.dishPhotoBox}>
              <Image
                source={images.berryMuesliBowl}
                style={styles.dishPhoto}
                resizeMode="cover"
              />
            </View>
          </Tap>
          <View style={styles.schedule}>
            <Tap
              accessibilityLabel="Schedule Berry muesli yogurt bowl"
              style={styles.scheduleHit}
            >
              <View style={styles.schedulePill}>
                <Text style={styles.scheduleText}>Schedule</Text>
              </View>
            </Tap>
          </View>
        </View>
      </View>

      {/* Search · no results */}
      <View style={styles.section}>
        <StateLabel>Search · no results</StateLabel>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Icon name="search" size={24} color={colors.ink2} />
          </View>
          <Text style={[type.h3, styles.emptyTitle]} accessibilityRole="header">
            No matches under 500 kcal
          </Text>
          <Text style={styles.emptySub}>Try fewer filters</Text>
          <Button
            variant="secondary"
            label="Remove kcal filter"
            left={<Icon name="x" size={20} color={colors.forestInk} />}
            style={styles.removeFilter}
          />
          <Text style={styles.orTry}>Or try</Text>
          <View style={styles.suggestions}>
            <Chip label="Paneer bowls" onPress={() => nav.navigate('Listing')} />
            <Chip label="Millet meals" onPress={() => nav.navigate('Listing')} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

/** State name · JetBrains Mono 11/14 600, 0.08em, caps, Ink-3. */
function StateLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.stateLabel}>{children}</Text>;
}

/** "Before" / "After" note beside a card. */
function Note({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.note}>
      <StateLabel>{label}</StateLabel>
      <Text style={styles.noteText}>{text}</Text>
    </View>
  );
}

/**
 * 200px meal card: photo + name link to the meal, ADD outside the link.
 * ADD turns into the compact stepper (and back at 0).
 */
function MealCard({
  onOpen,
  initialQty,
}: {
  onOpen: () => void;
  initialQty: number;
}) {
  return (
    <View style={styles.card}>
      <Tap accessibilityRole="link" onPress={onOpen} pressScale={0.99}>
        <View style={styles.cardPhoto}>
          <PhotoPlaceholder style={styles.cardPlaceholder} />
          <Badge tone="protein" label="28 g protein" style={styles.cardBadge} />
        </View>
        <View style={styles.cardText}>
          <View style={styles.cardName}>
            <View style={styles.nameRow}>
              <DietMark type="veg" style={styles.mark3} />
              <Text style={styles.name15}>{MEAL}</Text>
            </View>
          </View>
          <Text style={styles.kitchen} numberOfLines={1}>
            Green Fork Kitchen
          </Text>
        </View>
      </Tap>
      <View style={styles.cardFoot}>
        <View>
          <Kcal value={420} />
          <Text style={type.price} numberOfLines={1}>
            ₹249
          </Text>
        </View>
        <AddOrStepper initialQty={initialQty} name={MEAL} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { paddingTop: 20, paddingHorizontal: 20 },
  flex: { flex: 1, minWidth: 0 },
  h1: { marginTop: 4 },
  section: { marginTop: 32 },
  stateLabel: { ...type.eyebrow, color: colors.ink3 },

  // Diet sheet
  scrim: {
    marginTop: 12,
    marginHorizontal: -20,
    paddingTop: 40,
    backgroundColor: colors.scrim,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  grabber: {
    width: 36,
    height: 4,
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: colors.mapLine,
  },
  sheetHead: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  close: {
    width: 44,
    height: 44,
    marginRight: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetSub: { fontSize: 13, lineHeight: 18, color: colors.ink3 },
  diets: { marginTop: 16, gap: 12 },
  apply: { marginTop: 20 },

  // Add · added
  pair: { marginTop: 12, flexDirection: 'row', gap: 14 },
  pairGap: { marginTop: 16 },
  note: { flex: 1, minWidth: 0, paddingTop: 4 },
  noteText: { marginTop: 6, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  card: {
    width: 200,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardPhoto: { height: 112 },
  cardPlaceholder: { width: '100%', height: 112 },
  cardBadge: { position: 'absolute', left: 10, top: 10 },
  cardText: { paddingTop: 12, paddingHorizontal: 12 },
  cardName: { height: 40, overflow: 'hidden' },
  cardFoot: {
    marginTop: 'auto',
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  mark3: { marginTop: 3 },
  mark4: { marginTop: 4 },
  name15: {
    ...ff('body', 600),
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 20,
    color: colors.forestInk,
  },
  name16: {
    ...ff('body', 600),
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
    color: colors.forestInk,
  },
  kitchen: { marginTop: 2, fontSize: 13, lineHeight: 18, color: colors.ink3 },

  bleed: { marginTop: 16, marginHorizontal: -20 },
  toast: {
    marginHorizontal: 16,
    marginBottom: 12,
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.forestInk,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toastText: {
    ...ff('body', 500),
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  toastAction: { minHeight: 44, justifyContent: 'center', marginVertical: -12 },
  toastActionText: { ...ff('body', 600), fontSize: 14, lineHeight: 20, color: colors.turmeric },

  // Item · sold out
  soldOut: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
  },
  soldOutLink: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  soldOutPhoto: { width: 84, height: 84, borderRadius: 14, opacity: 0.5 },
  proteinMeta: {
    ...ff('body', 600),
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: colors.proteinBlue,
  },
  soldOutNumbers: { marginTop: 8 },
  soldOutTag: { position: 'absolute', right: 12, bottom: 12, height: 44, justifyContent: 'center' },
  soldOutText: { ...ff('body', 600), fontSize: 13, lineHeight: 18, color: colors.ink3 },

  // Kitchen · closed
  closed: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.chiliMist,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  closedText: {
    ...ff('body', 600),
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.chili,
  },
  dishCard: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
  dishLink: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, padding: 16 },
  dishDesc: { marginTop: 4, fontSize: 13, lineHeight: 18, color: colors.ink3 },
  dishNumbers: { marginTop: 10, flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  dishProtein: {
    ...ff('body', 600),
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: colors.proteinBlue,
  },
  dishPhotoBox: { width: 112, height: 130 },
  dishPhoto: { width: 112, height: 112, borderRadius: 14 },
  schedule: {
    position: 'absolute',
    top: 106,
    right: 16,
    width: 112,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scheduleHit: { height: 44, paddingVertical: 4, justifyContent: 'center' },
  schedulePill: {
    height: 36,
    minWidth: 88,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.forestInk,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleText: {
    ...ff('body', 700),
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0,
    color: colors.forestInk,
  },

  // Search · no results
  empty: { marginTop: 12, paddingTop: 24, paddingBottom: 8, alignItems: 'center' },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { marginTop: 16, textAlign: 'center' },
  emptySub: { marginTop: 4, fontSize: 14, lineHeight: 20, color: colors.ink2, textAlign: 'center' },
  removeFilter: { marginTop: 16, paddingHorizontal: 20 },
  orTry: { marginTop: 16, fontSize: 13, lineHeight: 18, color: colors.ink3, textAlign: 'center' },
  suggestions: { marginTop: 4, flexDirection: 'row', justifyContent: 'center', gap: 8 },
});
