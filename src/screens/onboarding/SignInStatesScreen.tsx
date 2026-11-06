import { useState, type ReactNode } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  Button,
  Icon,
  Screen,
  ScreenHeader,
  Tap,
  Text,
  TextField,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';

/** 1.9 States · sign-in — design file: Onboard-States.dc.html */
export default function SignInStatesScreen() {
  const nav = useNav();
  const [code, setCode] = useState('482716');

  return (
    <Screen header={<ScreenHeader />} bottomGap={20}>
      <View style={styles.board}>
        <Text style={type.eyebrow}>STATES · SIGN-IN</Text>
        <Text style={[type.h2, styles.title]} accessibilityRole="header">
          Errors, loading & empty states
        </Text>

        <StateSection label="PHONE · EMPTY">
          <TextField
            label="Mobile number"
            containerStyle={styles.fieldTop}
            prefix={<PhonePrefix />}
            placeholder="10-digit mobile number"
            keyboardType="number-pad"
            autoComplete="tel-national"
            textContentType="telephoneNumber"
            accessibilityLabel="Mobile number"
            accessibilityHint="+91"
            style={styles.input}
          />
          <Button label="Get OTP" disabled style={styles.cta} />
        </StateSection>

        <StateSection label="PHONE · INVALID">
          <TextField
            label="Mobile number"
            containerStyle={styles.fieldTop}
            prefix={<PhonePrefix />}
            defaultValue="98XXX XX21"
            placeholder="10-digit mobile number"
            keyboardType="number-pad"
            autoComplete="tel-national"
            textContentType="telephoneNumber"
            accessibilityLabel="Mobile number"
            accessibilityHint="+91"
            error="Enter a 10-digit mobile number"
            style={styles.input}
          />
        </StateSection>

        <StateSection label="SENDING">
          <TextField
            label="Mobile number"
            containerStyle={styles.fieldTop}
            prefix={<PhonePrefix />}
            defaultValue="98XXX XX210"
            placeholder="10-digit mobile number"
            keyboardType="number-pad"
            autoComplete="tel-national"
            textContentType="telephoneNumber"
            accessibilityLabel="Mobile number"
            accessibilityHint="+91"
            style={styles.input}
          />
          <View
            accessible
            accessibilityRole="button"
            accessibilityState={{ disabled: true, busy: true }}
            style={[styles.busy, styles.cta]}
          >
            <SpinnerArt />
            <Text style={styles.busyText}>Sending code…</Text>
          </View>
        </StateSection>

        <StateSection label="CODE · WRONG">
          <Text style={[type.fieldLabel, styles.fieldTop, styles.labelGap]}>
            6-digit code
          </Text>
          <CodeInput value={code} onChange={setCode} />
          <FieldError message="That code didn't match. 2 tries left." />
          <View style={styles.resend}>
            <Text style={styles.resendText}>{"Didn't get it?"}</Text>
            <Tap hitSlop={{ left: 8, right: 8 }} style={styles.resendButton}>
              <Text style={styles.resendButtonText}>Resend code</Text>
            </Tap>
          </View>
        </StateSection>

        <StateSection label="EMAIL · INVALID">
          <TextField
            label="Email address"
            containerStyle={styles.fieldTop}
            defaultValue="aarav@example"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Email address"
            error="Enter a valid email, like name@example.com"
            style={styles.input}
          />
        </StateSection>

        <StateSection label="LOCATION · PERMISSION OFF">
          <View style={styles.banner} accessibilityLiveRegion="polite">
            <Icon name="pinOff" size={20} color={colors.chili} />
            <View style={styles.bannerBody}>
              <Text style={styles.bannerTitle}>
                Location is off — search your area instead
              </Text>
              <Tap
                accessibilityRole="link"
                hitSlop={{ left: 8, right: 8 }}
                style={styles.bannerLink}
              >
                <Text style={styles.bannerLinkText}>Open settings</Text>
              </Tap>
            </View>
          </View>
          <Tap
            accessibilityRole="link"
            onPress={() => nav.navigate('LocationConfirm')}
            style={styles.search}
          >
            <Icon name="search" size={20} color={colors.ink3} />
            <Text style={styles.searchText}>Search area, street or building</Text>
          </Tap>
        </StateSection>
      </View>
    </Screen>
  );
}

/** One state: mono Ink-3 label, then the state as drawn. */
function StateSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[type.eyebrow, styles.sectionLabel]} accessibilityRole="header">
        {label}
      </Text>
      {children}
    </View>
  );
}

/** "+91" block before the phone input, 1px Line divider on its right. */
function PhonePrefix() {
  return (
    <View style={styles.prefix}>
      <Text style={styles.prefixText}>+91</Text>
    </View>
  );
}

/** Error message · 16px alert icon + 13/18 Chili. */
function FieldError({ message }: { message: string }) {
  return (
    <View accessibilityRole="alert" style={styles.error}>
      <View style={styles.errorIcon}>
        <Icon name="alertCircle" size={16} color={colors.chili} />
      </View>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

/** Six 48×56 code boxes in the error state (1.5px Chili) over a code input. */
function CodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.code}>
      <View
        style={styles.codeRow}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View key={i} style={styles.codeBox}>
            <Text style={styles.codeDigit}>{value.charAt(i)}</Text>
          </View>
        ))}
      </View>
      <TextInput
        value={value}
        onChangeText={t => onChange(t.replace(/[^0-9]/g, '').slice(0, 6))}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        maxLength={6}
        accessibilityLabel="6-digit code"
        accessibilityHint="That code didn't match. 2 tries left."
        caretHidden
        contextMenuHidden
        selectionColor="transparent"
        underlineColorAndroid="transparent"
        style={styles.codeInput}
      />
    </View>
  );
}

/** 20px spinner · white 35% ring, Turmeric arc. */
function SpinnerArt() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={9}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={0.35}
        strokeWidth={2.5}
      />
      <Path
        d="M12 3a9 9 0 0 1 9 9"
        fill="none"
        stroke={colors.turmeric}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  board: { paddingTop: 20, paddingHorizontal: 20 },
  title: { marginTop: 6 },
  section: { marginTop: 32 },
  sectionLabel: { color: colors.ink3 },
  fieldTop: { marginTop: 12 },
  labelGap: { marginBottom: 8 },
  input: { ...ff('body', 400) },
  cta: { marginTop: 16 },
  prefix: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  prefixText: { ...ff('body', 600), fontSize: 16, color: colors.forestInk },
  busy: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.forestInk,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  busyText: { ...ff('body', 600), fontSize: 16, color: '#FFFFFF' },
  code: { height: 56 },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
  },
  codeBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.chili,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeDigit: { ...ff('display', 700), fontSize: 22, color: colors.forestInk },
  codeInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'transparent',
    // Android ignores a transparent text colour on inputs, so hide the whole
    // field there (it still takes taps). iOS stops hit-testing at opacity 0.
    opacity: Platform.OS === 'android' ? 0 : 1,
    ...ff('body', 400),
    fontSize: 16,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
  },
  errorIcon: { marginTop: 1 },
  errorText: { flex: 1, fontSize: 13, lineHeight: 18, color: colors.chili },
  resend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  resendText: { fontSize: 14, lineHeight: 20, color: colors.ink2 },
  resendButton: { minHeight: 44, justifyContent: 'center' },
  resendButtonText: {
    ...ff('body', 600),
    fontSize: 14,
    color: colors.turmericDeep,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.chiliMist,
  },
  bannerBody: { flex: 1, minWidth: 0 },
  bannerTitle: {
    ...ff('body', 600),
    fontSize: 14,
    lineHeight: 20,
    color: colors.chili,
  },
  bannerLink: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  bannerLinkText: {
    ...ff('body', 600),
    fontSize: 14,
    color: colors.chili,
    textDecorationLine: 'underline',
  },
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
});
