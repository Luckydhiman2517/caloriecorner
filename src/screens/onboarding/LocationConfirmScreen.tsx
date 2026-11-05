import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Button,
  Icon,
  IconCircleButton,
  Screen,
  Span,
  Tap,
  Text,
  TextField,
  type IconName,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { em, type } from '../../theme/type';

type SaveAs = 'home' | 'work' | 'other';

const SAVE_AS: { value: SaveAs; label: string; icon: IconName }[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'work', label: 'Work', icon: 'briefcase' },
  { value: 'other', label: 'Other', icon: 'pin' },
];

/** 1.7 Confirm address — design file: Onboard-LocationConfirm.dc.html */
export default function LocationConfirmScreen() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const [flat, setFlat] = useState('Flat 402, Sunrise Apartments');
  const [landmark, setLandmark] = useState('');
  const [saveAs, setSaveAs] = useState<SaveAs>('home');

  return (
    <Screen
      background={colors.surface}
      bottomGap={0}
      contentStyle={styles.content}
    >
      {/* Full-bleed map, 420px */}
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Map with the pin on 27th Main, HSR Layout Sector 2"
        style={styles.map}
      >
        <MapArt />
        <View style={styles.hintWrap} pointerEvents="none">
          <View style={styles.hint}>
            <Icon name="move" size={16} color="#FFFFFF" />
            <Text style={styles.hintText} numberOfLines={1}>
              Move the map to adjust
            </Text>
          </View>
        </View>
      </View>

      <IconCircleButton
        onPress={() => nav.canGoBack() && nav.goBack()}
        style={[styles.back, { top: 12 + insets.top }]}
      />
      <IconCircleButton
        icon="locate"
        size={20}
        accessibilityLabel="Use my current location"
        style={styles.locate}
      />

      {/* Address sheet */}
      <View style={styles.sheet}>
        <Text style={type.eyebrow}>STEP 1 OF 2 · DELIVERY</Text>

        <View style={styles.place}>
          <View style={styles.placeTile}>
            <Icon name="pin" size={20} color={colors.turmericDeep} />
          </View>
          <View style={styles.placeBody}>
            <Text style={styles.placeTitle} accessibilityRole="header">
              HSR Layout Sector 2
            </Text>
            <Text style={type.small}>27th Main, Bengaluru 560102</Text>
          </View>
          <Tap
            accessibilityRole="link"
            accessibilityLabel="Change location"
            onPress={() => nav.navigate('Location', undefined, { pop: true })}
            hitSlop={{ left: 8, right: 8 }}
            style={styles.change}
          >
            <Text style={styles.changeText}>Change</Text>
          </Tap>
        </View>

        <TextField
          label="Flat / house no. & building"
          containerStyle={styles.flat}
          value={flat}
          onChangeText={setFlat}
          autoComplete="address-line1"
          textContentType="streetAddressLine1"
          accessibilityLabel="Flat / house no. & building"
          style={styles.input}
        />

        <Text style={[type.fieldLabel, styles.landmarkLabel]}>
          Landmark <Span style={styles.optional}>(optional)</Span>
        </Text>
        <TextField
          value={landmark}
          onChangeText={setLandmark}
          placeholder="e.g. Near BDA Complex"
          autoComplete="address-line2"
          textContentType="streetAddressLine2"
          accessibilityLabel="Landmark (optional)"
          style={styles.input}
        />

        <View
          style={styles.saveAs}
          accessibilityRole="radiogroup"
          accessibilityLabel="Save as"
        >
          <Text style={type.fieldLabel}>Save as</Text>
          <View style={styles.saveRow}>
            {SAVE_AS.map(o => (
              <RadioChip
                key={o.value}
                label={o.label}
                icon={o.icon}
                selected={saveAs === o.value}
                onPress={() => setSaveAs(o.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.spacer} />

        <Button
          label="Confirm location"
          onPress={() => nav.navigate('PickGoal')}
        />
      </View>
    </Screen>
  );
}

/**
 * Radio chip · 36px pill in a 44px hit, padding 0 14, 16px icon + 14px 500.
 * on: Forest Ink fill, white; off: white, 1px Line Strong.
 */
function RadioChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: IconName;
  selected: boolean;
  onPress: () => void;
}) {
  const fg = selected ? '#FFFFFF' : colors.forestInk;
  return (
    <Tap
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={styles.chipHit}
    >
      <View style={[styles.chip, selected ? styles.chipOn : styles.chipOff]}>
        <Icon name={icon} size={16} color={fg} />
        <Text style={[styles.chipText, { color: fg }]}>{label}</Text>
      </View>
    </Tap>
  );
}

/** Map illustration (390×420 viewBox). */
function MapArt() {
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox="0 0 390 420"
      preserveAspectRatio="xMidYMid slice"
    >
      <Rect x={236} y={150} width={78} height={44} rx={10} fill={colors.mapBlock} />
      <Rect x={58} y={226} width={70} height={30} rx={8} fill={colors.mapBlock} />
      <Rect x={62} y={160} width={58} height={36} rx={8} fill={colors.mapBlockLight} />
      <Rect x={246} y={66} width={62} height={36} rx={8} fill={colors.mapBlockLight} />
      <Rect x={58} y={300} width={58} height={40} rx={8} fill={colors.mapBlockLight} />
      <Rect x={250} y={270} width={70} height={40} rx={10} fill={colors.mapBlock} />
      <G fill="none" stroke={colors.stone} strokeWidth={6} strokeLinecap="round">
        <Path d="M-10 48H400" />
        <Path d="M-10 214H400" />
        <Path d="M-10 356H400" />
        <Path d="M44 -10V430" />
        <Path d="M228 -10V430" />
        <Path d="M326 -10V430" />
      </G>
      <G fill="none" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round">
        <Path d="M-10 128H400" />
        <Path d="M140 -10V430" />
        <Path d="M-10 300C100 268 250 330 400 262" />
      </G>
      <Ellipse
        cx={195}
        cy={216}
        rx={9}
        ry={3.5}
        fill={colors.forestInk}
        fillOpacity={0.25}
      />
      <G transform="translate(171 158)">
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
  content: { flexGrow: 1 },
  map: {
    height: 420,
    backgroundColor: colors.placeholderGreen,
    overflow: 'hidden',
  },
  hintWrap: {
    position: 'absolute',
    top: 112,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.forestInk,
  },
  hintText: {
    ...ff('body', 600),
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  back: { position: 'absolute', left: 16 },
  locate: { position: 'absolute', top: 340, right: 16 },
  sheet: {
    flexGrow: 1,
    marginTop: -24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surface,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  placeTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.kcalCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeBody: { flex: 1, minWidth: 0 },
  placeTitle: {
    ...ff('display', 700),
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: em(-0.01, 20),
    color: colors.forestInk,
  },
  change: { minHeight: 44, justifyContent: 'center' },
  changeText: { ...ff('body', 600), fontSize: 14, color: colors.turmericDeep },
  flat: { marginTop: 20 },
  input: { ...ff('body', 400) },
  landmarkLabel: { marginTop: 12, marginBottom: 8 },
  optional: { ...ff('body', 500), color: colors.ink3 },
  saveAs: { marginTop: 16 },
  saveRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
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
  chipText: { ...ff('body', 500), fontSize: 14 },
  spacer: { flexGrow: 1, minHeight: 16 },
});
