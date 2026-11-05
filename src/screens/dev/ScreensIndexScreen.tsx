import { StyleSheet, View } from 'react-native';
import { Divider, Icon, Screen, ScreenHeader, Tap, Text } from '../../components';
import { useNav, type RouteName } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { type } from '../../theme/type';

/**
 * Dev-only index of every design artboard, opened from the dev menu
 * ("Calorie Corner: all screens"). Titles match the design canvas.
 */
const FLOWS: { title: string; screens: [string, RouteName][] }[] = [
  {
    title: '1 · Onboarding & sign-in flow',
    screens: [
      ['1.1 Welcome', 'Welcome'],
      ['1.2 Log in or sign up', 'Login'],
      ['1.3 Email sign-in', 'EmailSignIn'],
      ['1.4 Verify code · phone', 'VerifyPhone'],
      ['1.5 Verify code · email', 'VerifyEmail'],
      ['1.6 Delivery location', 'Location'],
      ['1.7 Confirm address', 'LocationConfirm'],
      ['1.8 Pick your goal', 'PickGoal'],
      ['1.9 States · sign-in', 'SignInStates'],
    ],
  },
  {
    title: '2 · Product flow — meals & groceries',
    screens: [
      ['2.1 Home · Meals', 'Home'],
      ['2.2 Home · Groceries', 'HomeGroceries'],
      ['2.3 Search & listing', 'Listing'],
      ['2.4 Kitchen menu', 'Kitchen'],
      ['2.5 Meal detail', 'Meal'],
      ['2.6 Grocery product detail', 'Item'],
      ['2.7 States · product', 'ProductStates'],
    ],
  },
  {
    title: '3 · Cart flow',
    screens: [
      ['3.1 Cart', 'Cart'],
      ['3.2 Checkout', 'Checkout'],
      ['3.3 Order placed & tracking', 'Tracking'],
      ['3.4 States · cart', 'CartStates'],
    ],
  },
  {
    title: '4 · Account flow',
    screens: [
      ['4.1 Account', 'Account'],
      ['4.2 Complete profile', 'CompleteProfile'],
      ['4.3 Goal settings', 'Goal'],
      ['4.4 Orders', 'Orders'],
    ],
  },
];

export default function ScreensIndexScreen() {
  const nav = useNav();
  return (
    <Screen header={<ScreenHeader title="All screens" subtitle="Calorie Corner App Screens" />}>
      {FLOWS.map(flow => (
        <View key={flow.title} style={styles.flow}>
          <Text style={[type.eyebrow, styles.flowTitle]}>{flow.title}</Text>
          <View style={styles.card}>
            {flow.screens.map(([label, route], i) => (
              <View key={route}>
                {i > 0 ? <Divider inset={16} /> : null}
                <Tap pressScale={0.99} onPress={() => nav.navigate(route)} style={styles.row}>
                  <Text style={[type.ui, styles.rowText]}>{label}</Text>
                  <Icon name="chevronRight" size={20} color={colors.ink3} />
                </Tap>
              </View>
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flow: { marginTop: 20, paddingHorizontal: 20 },
  flowTitle: { marginBottom: 8 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: { flex: 1 },
});
