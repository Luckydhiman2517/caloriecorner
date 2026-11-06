import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Screen,
  ScreenHeader,
  Text,
  TextField,
  TextLink,
} from '../../components';
import { useNav } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { ff } from '../../theme/fonts';
import { type } from '../../theme/type';
import { emailError, normalizeEmail } from '../../utils/validation';

/** 1.3 Email sign-in — design file: Onboard-Email.dc.html */
export default function EmailSignInScreen() {
  const nav = useNav();
  const [email, setEmail] = useState('');
  /** Errors show after the field is left or Send code is tapped, then live. */
  const [touched, setTouched] = useState(false);
  const error = touched && email ? emailError(email) : null;

  const sendCode = () => {
    setTouched(true);
    if (!emailError(email)) {
      nav.navigate('VerifyEmail', { email });
    }
  };

  return (
    <Screen header={<ScreenHeader />}>
      <View style={styles.body}>
        <Text style={type.h1} accessibilityRole="header">
          Your email
        </Text>
        <Text style={[type.body, styles.lede]}>
          {"We'll send a 6-digit code. No password needed."}
        </Text>

        <TextField
          label="Email address"
          containerStyle={styles.field}
          value={email}
          onChangeText={text => setEmail(normalizeEmail(text))}
          onBlur={() => setTouched(true)}
          onSubmitEditing={sendCode}
          returnKeyType="send"
          maxLength={254}
          error={error ?? undefined}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email address"
          style={styles.input}
        />

        <Button
          label="Send code"
          style={styles.cta}
          disabled={!email}
          onPress={sendCode}
        />

        <View style={styles.alt}>
          <Text style={styles.altText}>Prefer phone?</Text>
          <TextLink
            label="Use mobile number"
            onPress={() => nav.navigate('Login', undefined, { pop: true })}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: 20, paddingHorizontal: 20 },
  lede: { marginTop: 8 },
  field: { marginTop: 28 },
  input: { ...ff('body', 400) },
  cta: { marginTop: 16 },
  alt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  altText: { fontSize: 14, lineHeight: 20, color: colors.ink2 },
});
