import { useEffect } from 'react';
import { DevSettings, Platform, Settings } from 'react-native';
import {
  createNavigationContainerRef,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import type { RootStackParamList, RouteName } from './types';

import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import LoginScreen from '../screens/onboarding/LoginScreen';
import EmailSignInScreen from '../screens/onboarding/EmailSignInScreen';
import VerifyPhoneScreen from '../screens/onboarding/VerifyPhoneScreen';
import VerifyEmailScreen from '../screens/onboarding/VerifyEmailScreen';
import LocationScreen from '../screens/onboarding/LocationScreen';
import LocationConfirmScreen from '../screens/onboarding/LocationConfirmScreen';
import PickGoalScreen from '../screens/onboarding/PickGoalScreen';
import SignInStatesScreen from '../screens/onboarding/SignInStatesScreen';
import HomeScreen from '../screens/product/HomeScreen';
import HomeGroceriesScreen from '../screens/product/HomeGroceriesScreen';
import ListingScreen from '../screens/product/ListingScreen';
import KitchenScreen from '../screens/product/KitchenScreen';
import MealScreen from '../screens/product/MealScreen';
import ItemScreen from '../screens/product/ItemScreen';
import ProductStatesScreen from '../screens/product/ProductStatesScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';
import TrackingScreen from '../screens/cart/TrackingScreen';
import CartStatesScreen from '../screens/cart/CartStatesScreen';
import AccountScreen from '../screens/account/AccountScreen';
import CompleteProfileScreen from '../screens/account/CompleteProfileScreen';
import GoalScreen from '../screens/account/GoalScreen';
import OrdersScreen from '../screens/account/OrdersScreen';
import ScreensIndexScreen from '../screens/dev/ScreensIndexScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paper,
    card: colors.paper,
  },
};

/** Tab-like screens switch without the push animation. */
const tab = { animation: 'fade' as const };

const ROUTES: RouteName[] = [
  'Welcome',
  'Login',
  'EmailSignIn',
  'VerifyPhone',
  'VerifyEmail',
  'Location',
  'LocationConfirm',
  'PickGoal',
  'SignInStates',
  'Home',
  'HomeGroceries',
  'Listing',
  'Kitchen',
  'Meal',
  'Item',
  'ProductStates',
  'Cart',
  'Checkout',
  'Tracking',
  'CartStates',
  'Account',
  'CompleteProfile',
  'Goal',
  'Orders',
  'Screens',
];

/**
 * QA hook: launch straight into any screen with an iOS launch argument,
 * e.g. `xcrun simctl launch booted <bundle id> -ccInitialRoute Home`
 * (or add `-ccInitialRoute Home` to the Xcode scheme's arguments).
 */
function initialRoute(): RouteName {
  if (Platform.OS !== 'ios') {
    return 'Welcome';
  }
  try {
    const requested = Settings.get('ccInitialRoute');
    return ROUTES.includes(requested) ? requested : 'Welcome';
  } catch {
    return 'Welcome';
  }
}

export function RootNavigator() {
  useEffect(() => {
    if (__DEV__) {
      DevSettings.addMenuItem('Calorie Corner: all screens', () => {
        if (navigationRef.isReady()) {
          navigationRef.navigate('Screens');
        }
      });
    }
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <Stack.Navigator
        initialRouteName={initialRoute()}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
        }}
      >
        {/* 1 · Onboarding & sign-in */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmailSignIn" component={EmailSignInScreen} />
        <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen
          name="LocationConfirm"
          component={LocationConfirmScreen}
        />
        <Stack.Screen name="PickGoal" component={PickGoalScreen} />
        <Stack.Screen name="SignInStates" component={SignInStatesScreen} />
        {/* 2 · Product */}
        <Stack.Screen name="Home" component={HomeScreen} options={tab} />
        <Stack.Screen
          name="HomeGroceries"
          component={HomeGroceriesScreen}
          options={tab}
        />
        <Stack.Screen name="Listing" component={ListingScreen} options={tab} />
        <Stack.Screen name="Kitchen" component={KitchenScreen} />
        <Stack.Screen name="Meal" component={MealScreen} />
        <Stack.Screen name="Item" component={ItemScreen} />
        <Stack.Screen name="ProductStates" component={ProductStatesScreen} />
        {/* 3 · Cart */}
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="CartStates" component={CartStatesScreen} />
        {/* 4 · Account */}
        <Stack.Screen name="Account" component={AccountScreen} options={tab} />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
        />
        <Stack.Screen name="Goal" component={GoalScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={tab} />
        {/* Dev index */}
        <Stack.Screen name="Screens" component={ScreensIndexScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
