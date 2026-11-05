import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  AppMark,
  Button,
  Icon,
  Screen,
  ScreenHeader,
  Span,
  Tap,
  Text,
  TextField,
  Wordmark,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';

/** 1.2 Log in or sign up — design file: Onboard-Login.dc.html */
export default function LoginScreen() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('98XXX XX210');
  const toLocation = () => nav.navigate('Location');

  return (
    <Screen
      header={
        <ScreenHeader right={<View style={styles.headerSpacer} />}>
          <View style={styles.logo}>
            <AppMark size={32} />
            <Wordmark size={20} />
          </View>
        </ScreenHeader>
      }
      footer={
        <Text style={[styles.legal, { paddingBottom: 24 + insets.bottom }]}>
          By continuing you agree to our <Span style={styles.legalLink}>Terms</Span>
          {' & '}
          <Span style={styles.legalLink}>Privacy Policy</Span>
        </Text>
      }
    >
      <View style={styles.body}>
        <Text style={type.h1} accessibilityRole="header">
          Log in or sign up
        </Text>
        <Text style={[type.body, styles.lede]}>
          No passwords — one tap with Google, Apple or Facebook.
        </Text>

        <View style={styles.social}>
          <SocialButton
            label="Continue with Google"
            logo={<GoogleLogo />}
            onPress={toLocation}
          />
          <SocialButton
            label="Continue with Apple"
            logo={<AppleLogo />}
            onPress={toLocation}
          />
          <SocialButton
            label="Continue with Facebook"
            logo={<FacebookLogo />}
            onPress={toLocation}
          />
        </View>

        <View
          style={styles.or}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View style={styles.orLine} />
          <Text style={type.small}>or</Text>
          <View style={styles.orLine} />
        </View>

        <TextField
          label="Mobile number"
          prefix={<PhonePrefix />}
          value={phone}
          onChangeText={setPhone}
          placeholder="10-digit mobile number"
          keyboardType="number-pad"
          autoComplete="tel-national"
          textContentType="telephoneNumber"
          accessibilityLabel="Mobile number"
          accessibilityHint="+91"
          style={styles.input}
        />

        <Button
          label="Get OTP"
          style={styles.otp}
          onPress={() => nav.navigate('VerifyPhone')}
        />

        <View style={styles.center}>
          <Tap
            accessibilityRole="link"
            onPress={() => nav.navigate('EmailSignIn')}
            hitSlop={{ left: 8, right: 8 }}
            style={styles.emailLink}
          >
            <Icon name="mail" size={20} color={colors.ink2} />
            <Text style={styles.emailLinkText}>Continue with email</Text>
          </Tap>
        </View>
      </View>
    </Screen>
  );
}

/** White 52px button, 1px Line Strong, brand logo pinned 17px from the left. */
function SocialButton({
  label,
  logo,
  onPress,
}: {
  label: string;
  logo: ReactNode;
  onPress: () => void;
}) {
  return (
    <Tap accessibilityRole="link" onPress={onPress} style={styles.socialButton}>
      <View style={styles.socialLogo}>{logo}</View>
      <Text style={styles.socialText}>{label}</Text>
    </Tap>
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

function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

function AppleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={colors.forestInk}
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      />
    </Svg>
  );
}

function FacebookLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={12} fill="#1877F2" />
      <Path
        fill="#FFFFFF"
        d="M16.7 15.5l.5-3.5h-3.3V9.8c0-1 .5-1.9 2-1.9h1.5v-3s-1.4-.2-2.7-.2c-2.8 0-4.6 1.7-4.6 4.7V12H7v3.5h3.1V24h3.8v-8.5z"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerSpacer: { width: 44 },
  body: { paddingTop: 20, paddingHorizontal: 20 },
  lede: { marginTop: 8 },
  social: { marginTop: 28, gap: 12 },
  socialButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLogo: {
    position: 'absolute',
    left: 17,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  socialText: { ...ff('body', 600), fontSize: 15, color: colors.forestInk },
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  orLine: { flex: 1, height: 1, backgroundColor: colors.line },
  prefix: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  prefixText: { ...ff('body', 600), fontSize: 16, color: colors.forestInk },
  input: { ...ff('body', 400) },
  otp: { marginTop: 16 },
  center: { alignItems: 'center', marginTop: 12 },
  emailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  emailLinkText: { ...ff('body', 600), fontSize: 15, color: colors.forestInk },
  legal: {
    paddingTop: 16,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink3,
  },
  legalLink: {
    ...ff('body', 600),
    color: colors.ink2,
    textDecorationLine: 'underline',
  },
});
