import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, shadows } from '../theme/colors';
import { ff } from '../theme/fonts';
import { type } from '../theme/type';
import { Icon } from './Icon';
import { Tap } from './Tap';
import { Text } from './Text';

/* ───────────── Segmented (07.19) ───────────── */

/**
 * Track Stone, padding 4, height 48, r14. Active segment white r11 with e1,
 * 14px 600 Forest Ink; inactive Ink-2.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  height = 48,
  style,
  renderOption,
  accessibilityLabel,
}: {
  options: { value: T; label: string; icon?: Parameters<typeof Icon>[0]['name'] }[];
  value: T;
  onChange: (value: T) => void;
  height?: number;
  style?: StyleProp<ViewStyle>;
  renderOption?: (o: { value: T; label: string }, active: boolean) => ReactNode;
  accessibilityLabel?: string;
}) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { height }, style]}
    >
      {options.map(o => {
        const active = o.value === value;
        return (
          <Tap
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            pressScale={1}
            style={[styles.segment, active ? styles.segmentOn : null]}
          >
            {renderOption ? (
              renderOption(o, active)
            ) : (
              <>
                {o.icon ? (
                  <Icon
                    name={o.icon}
                    size={20}
                    color={active ? colors.forestInk : colors.ink2}
                  />
                ) : null}
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? colors.forestInk : colors.ink2 },
                  ]}
                >
                  {o.label}
                </Text>
              </>
            )}
          </Tap>
        );
      })}
    </View>
  );
}

/* ───────────── Radio / checkbox indicators · 24px ───────────── */

/** Radio · off: 1.5px Line Strong ring. on: Forest Ink disc, 14px check. */
export function RadioDot({ selected }: { selected: boolean }) {
  return selected ? (
    <View style={styles.radioOn}>
      <Icon name="check" size={14} color="#FFFFFF" strokeWidth={2.8} />
    </View>
  ) : (
    <View style={styles.radioOff} />
  );
}

/** Checkbox · off: r7, 1.5px Line Strong. on: Forest Ink fill, white check. */
export function CheckBox({ checked }: { checked: boolean }) {
  return checked ? (
    <View style={[styles.radioOn, styles.box]}>
      <Icon name="check" size={14} color="#FFFFFF" strokeWidth={2.8} />
    </View>
  ) : (
    <View style={[styles.radioOff, styles.box]} />
  );
}

/* ───────────── Radio row (07.19) ───────────── */

/**
 * 72px (60px for portion and payment) row, r18, 1px Line; 2px Forest Ink
 * when selected. Optional leading icon tile / content and trailing content.
 */
export function RadioRow({
  title,
  subtitle,
  selected,
  onPress,
  leading,
  trailing,
  minHeight = 72,
  indicator = 'radio',
  style,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress?: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  minHeight?: number;
  indicator?: 'radio' | 'checkbox' | 'none';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      accessibilityRole={indicator === 'checkbox' ? 'checkbox' : 'radio'}
      accessibilityState={
        indicator === 'checkbox' ? { checked: selected } : { selected }
      }
      onPress={onPress}
      pressScale={0.99}
      style={[
        styles.row,
        { minHeight },
        selected ? styles.rowOn : styles.rowOff,
        style,
      ]}
    >
      {leading}
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={type.small}>{subtitle}</Text> : null}
      </View>
      {trailing}
      {indicator === 'radio' ? <RadioDot selected={selected} /> : null}
      {indicator === 'checkbox' ? <CheckBox checked={selected} /> : null}
    </Tap>
  );
}

/** 44px Stone circle with a 22px icon — the goal-row leading tile. */
export function IconTile({
  icon,
  size = 44,
  iconSize = 22,
  background = colors.stone,
  color = colors.forestInk,
  radius = 999,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  size?: number;
  iconSize?: number;
  background?: string;
  color?: string;
  radius?: number;
}) {
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: radius, backgroundColor: background },
      ]}
    >
      <Icon name={icon} size={iconSize} color={color} />
    </View>
  );
}

/* ───────────── Text field (07.18) ───────────── */

type FieldProps = ComponentProps<typeof TextInput> & {
  label?: string;
  /** Trailing unit text, e.g. "years", "cm", "kg". */
  unit?: string;
  /** Leading prefix block, e.g. "+91". */
  prefix?: ReactNode;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Label 13px 600 Ink-2 above, 8px gap. Field 52px r14, 1px Line Strong,
 * 16px text. Focus: 2px Forest Ink. Error: 1.5px Chili + 13/18 message
 * with a 16px alert icon.
 */
export function TextField({
  label,
  unit,
  prefix,
  error,
  hint,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const border = error
    ? { borderWidth: 1.5, borderColor: colors.chili }
    : focused
    ? { borderWidth: 2, borderColor: colors.forestInk }
    : { borderWidth: 1, borderColor: colors.lineStrong };
  return (
    <View style={containerStyle}>
      {label ? <Text style={[type.fieldLabel, styles.label]}>{label}</Text> : null}
      <View style={[styles.field, border]}>
        {prefix}
        <TextInput
          placeholderTextColor={colors.ink3}
          style={[styles.input, style]}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {error ? (
        <View accessibilityRole="alert" style={styles.error}>
          <Icon name="alertCircle" size={16} color={colors.chili} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={[type.caption, styles.hint]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 14,
    backgroundColor: colors.stone,
  },
  segment: {
    flex: 1,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  segmentOn: { backgroundColor: colors.surface, boxShadow: shadows.e1 },
  segmentText: { ...ff('body', 600), fontSize: 14, lineHeight: 20 },
  radioOff: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
  },
  radioOn: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.forestInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: { borderRadius: 7 },
  tile: { alignItems: 'center', justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  rowOff: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowOn: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: colors.forestInk,
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { ...ff('body', 600), fontSize: 16, lineHeight: 22, color: colors.forestInk },
  label: { marginBottom: 8 },
  field: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    ...ff('body', 500),
    fontSize: 16,
    color: colors.forestInk,
  },
  unit: { paddingRight: 16, fontSize: 15, color: colors.ink3 },
  error: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { fontSize: 13, lineHeight: 18, color: colors.chili },
  hint: { marginTop: 6 },
});
