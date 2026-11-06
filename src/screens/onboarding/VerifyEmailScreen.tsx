import { useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import {
  Button,
  Icon,
  Screen,
  ScreenHeader,
  Span,
  Tap,
  Text,
} from '../../components';
import { useNav, useParams } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';

/** 1.5 Verify code · email — design file: Onboard-OTPEmail.dc.html */
export default function VerifyEmailScreen() {
  const nav = useNav();
  // Opened from the screens index there is no address, so show the drawn one.
  const sentTo = useParams<'VerifyEmail'>()?.email ?? 'aarav@example.com';
  const [code, setCode] = useState('482719');

  return (
    <Screen header={<ScreenHeader />}>
      <View style={styles.body}>
        <Text style={type.h1} accessibilityRole="header">
          Enter the code
        </Text>
        <View style={styles.sent}>
          <Text style={[type.body, styles.sentText]}>
            Sent to <Span style={styles.sentTo}>{sentTo}</Span> ·
          </Text>
          <Tap
            accessibilityRole="link"
            accessibilityLabel="Edit email"
            onPress={() =>
              nav.navigate('EmailSignIn', undefined, { pop: true })
            }
            style={styles.edit}
          >
            <Text style={styles.editText}>{' Edit'}</Text>
          </Tap>
        </View>

        <Text style={[type.fieldLabel, styles.codeLabel]}>6-digit code</Text>
        <CodeInput value={code} onChange={setCode} />

        <View style={styles.note}>
          <Icon name="clock" size={16} color={colors.ink3} />
          <Text style={type.small}>
            Resend code in <Span style={styles.tabular}>0:24</Span>
          </Text>
        </View>

        <Button
          label="Verify & continue"
          style={styles.cta}
          onPress={() => nav.navigate('Location')}
        />

        <View style={[styles.note, styles.spam]}>
          <Icon name="mail" size={16} color={colors.ink3} />
          <Text style={type.small}>
            {"Check spam if it doesn't arrive in a minute"}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

/**
 * Six 48×56 code boxes (r14, 1px Line Strong; the next box to fill gets
 * 2px Forest Ink) over a transparent one-time-code input.
 */
function CodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const active = Math.min(value.length, 5);
  return (
    <View style={styles.code}>
      <View
        style={styles.codeRow}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View
            key={i}
            style={[styles.codeBox, i === active ? styles.codeBoxActive : null]}
          >
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
        caretHidden
        contextMenuHidden
        selectionColor="transparent"
        underlineColorAndroid="transparent"
        style={styles.codeInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: 20, paddingHorizontal: 20 },
  sent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
  },
  sentText: { flexShrink: 1 },
  sentTo: { ...ff('body', 600), color: colors.forestInk },
  edit: {
    minHeight: 44,
    marginVertical: -11,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    justifyContent: 'center',
  },
  editText: { ...type.body, ...ff('body', 600), color: colors.turmericDeep },
  codeLabel: { marginTop: 28, marginBottom: 8 },
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
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxActive: { borderWidth: 2, borderColor: colors.forestInk },
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
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  spam: { justifyContent: 'center' },
  tabular: { fontVariant: ['tabular-nums'] },
  cta: { marginTop: 28 },
});
