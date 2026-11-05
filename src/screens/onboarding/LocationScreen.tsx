import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Button,
  Divider,
  Icon,
  Screen,
  Tap,
  Text,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';

/** 1.6 Delivery location — design file: Onboard-Location.dc.html */
export default function LocationScreen() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const toConfirm = () => nav.navigate('LocationConfirm');

  return (
    <Screen contentStyle={[styles.body, { paddingTop: 24 + insets.top }]}>
      <Text style={type.eyebrow}>STEP 1 OF 2 · DELIVERY</Text>
      <View
        style={styles.steps}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={[styles.step, styles.stepOn]} />
        <View style={styles.step} />
      </View>
      <Text style={[type.h1, styles.title]} accessibilityRole="header">
        Where should we deliver?
      </Text>
      <Text style={[type.body, styles.lede]}>
        We show kitchens and stock near you.
      </Text>

      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Map with a pin on HSR Layout, Sector 2"
        style={styles.map}
      >
        <MapArt />
        <View style={styles.mapPillWrap} pointerEvents="none">
          <View style={styles.mapPill}>
            <Text style={styles.mapPillText} numberOfLines={1}>
              HSR Layout, Sector 2
            </Text>
          </View>
        </View>
      </View>

      <Button
        label="Use my current location"
        left={<Icon name="locate" size={20} color="#FFFFFF" />}
        style={styles.locate}
        onPress={toConfirm}
      />

      <Tap accessibilityRole="link" onPress={toConfirm} style={styles.search}>
        <Icon name="search" size={20} color={colors.ink3} />
        <Text style={styles.searchText}>Search area, street or building</Text>
      </Tap>

      <Text style={[type.h3, styles.h2]} accessibilityRole="header">
        Suggestions near you
      </Text>
      <View style={styles.card}>
        <Suggestion
          title="HSR Layout Sector 2"
          meta="0.3 km away · Bengaluru 560102"
          onPress={toConfirm}
        />
        <Divider style={styles.rowDivider} />
        <Suggestion
          title="Koramangala 5th Block"
          meta="2.1 km away · Bengaluru 560095"
          onPress={toConfirm}
        />
      </View>
    </Screen>
  );
}

function Suggestion({
  title,
  meta,
  onPress,
}: {
  title: string;
  meta: string;
  onPress: () => void;
}) {
  return (
    <Tap accessibilityRole="link" onPress={onPress} style={styles.row}>
      <View style={styles.rowTile}>
        <Icon name="pin" size={20} color={colors.turmericDeep} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={type.small}>{meta}</Text>
      </View>
      <Icon name="chevronRight" size={20} color={colors.ink3} />
    </Tap>
  );
}

/** Map illustration (350×260 viewBox, `xMidYMid slice`). */
function MapArt() {
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox="0 0 350 260"
      preserveAspectRatio="xMidYMid slice"
    >
      <Rect x={214} y={108} width={66} height={36} rx={10} fill={colors.mapBlock} />
      <Rect x={52} y={160} width={62} height={24} rx={8} fill={colors.mapBlock} />
      <Rect x={58} y={112} width={52} height={30} rx={8} fill={colors.mapBlockLight} />
      <Rect x={222} y={54} width={54} height={30} rx={8} fill={colors.mapBlockLight} />
      <G fill="none" stroke={colors.stone} strokeWidth={6} strokeLinecap="round">
        <Path d="M-10 40H360" />
        <Path d="M-10 152H360" />
        <Path d="M44 -10V270" />
        <Path d="M206 -10V270" />
        <Path d="M290 -10V270" />
        <Path d="M-10 240H124" />
      </G>
      <G fill="none" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round">
        <Path d="M-10 96H360" />
        <Path d="M124 -10V270" />
        <Path d="M-10 214C90 190 220 236 360 178" />
      </G>
      <Circle
        cx={175}
        cy={130}
        r={46}
        fill={colors.forestInk}
        fillOpacity={0.06}
        stroke={colors.forestInk}
        strokeOpacity={0.18}
        strokeWidth={1}
      />
      <Ellipse
        cx={175}
        cy={131}
        rx={9}
        ry={3.5}
        fill={colors.forestInk}
        fillOpacity={0.25}
      />
      <G transform="translate(151 72)">
        <Path
          d="M24 2C12.4 2 3 11.2 3 22.6 3 38 24 58 24 58s21-20 21-35.4C45 11.2 35.6 2 24 2z"
          fill={colors.forestInk}
          stroke="#FFFFFF"
          strokeWidth={2}
        />
        <Circle cx={24} cy={22.5} r={8} fill={colors.turmeric} />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20 },
  steps: { flexDirection: 'row', gap: 4, marginTop: 8 },
  step: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.stone,
  },
  stepOn: { backgroundColor: colors.turmeric },
  title: { marginTop: 16 },
  lede: { marginTop: 8 },
  map: {
    marginTop: 28,
    height: 260,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.placeholderGreen,
    overflow: 'hidden',
  },
  mapPillWrap: {
    position: 'absolute',
    top: 26,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  mapPillText: {
    ...ff('body', 600),
    fontSize: 13,
    lineHeight: 18,
    color: colors.forestInk,
  },
  locate: { marginTop: 16, gap: 10 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    marginTop: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  searchText: { flexShrink: 1, fontSize: 16, color: colors.ink3 },
  h2: { marginTop: 28, marginBottom: 12 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, minWidth: 0, gap: 2 },
  rowTitle: {
    ...ff('body', 600),
    fontSize: 15,
    lineHeight: 20,
    color: colors.forestInk,
  },
  rowDivider: { marginLeft: 68, marginRight: 16 },
});
