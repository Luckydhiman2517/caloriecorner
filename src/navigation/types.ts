import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * One route per design artboard. Comment = the artboard file it recreates.
 */
export type RootStackParamList = {
  // 1 · Onboarding & sign-in
  Welcome: undefined; // Onboard-Welcome
  Login: undefined; // Onboard-Login
  EmailSignIn: undefined; // Onboard-Email
  VerifyPhone: undefined; // Onboard-OTP
  VerifyEmail: undefined; // Onboard-OTPEmail
  Location: undefined; // Onboard-Location
  LocationConfirm: undefined; // Onboard-LocationConfirm
  PickGoal: undefined; // Onboard-Goal
  SignInStates: undefined; // Onboard-States
  // 2 · Product
  Home: undefined; // Product-Home
  HomeGroceries: undefined; // Product-HomeGroceries
  Listing: undefined; // Product-Listing
  Kitchen: undefined; // Product-Kitchen
  Meal: undefined; // Product-Meal
  Item: undefined; // Product-Item
  ProductStates: undefined; // Product-States
  // 3 · Cart
  Cart: undefined; // Cart-Cart
  Checkout: undefined; // Cart-Checkout
  Tracking: undefined; // Cart-Tracking
  CartStates: undefined; // Cart-States
  // 4 · Account
  Account: undefined; // Account-Profile
  CompleteProfile: undefined; // Account-CompleteProfile
  Goal: undefined; // Account-Goal
  Orders: undefined; // Account-Orders
  // Dev-only index of every screen
  Screens: undefined;
};

export type RouteName = keyof RootStackParamList;

export type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Typed navigation hook: `const nav = useNav(); nav.navigate('Cart')`. */
export const useNav = () => useNavigation<Nav>();
