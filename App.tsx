/**
 * Calorie Corner
 *
 * @format
 */

import { useMemo } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const palette = {
  light: {
    background: '#F7F9F4',
    surface: '#FFFFFF',
    text: '#1C2B1E',
    muted: '#5F6F61',
    accent: '#2E9E5B',
  },
  dark: {
    background: '#101611',
    surface: '#1A231C',
    text: '#EAF2EB',
    muted: '#9AAE9D',
    accent: '#4CC27E',
  },
};

type Colors = typeof palette.light;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HomeScreen colors={isDarkMode ? palette.dark : palette.light} />
    </SafeAreaProvider>
  );
}

function HomeScreen({ colors }: { colors: Colors }) {
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(colors, insets.top, insets.bottom),
    [colors, insets.top, insets.bottom],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Corner</Text>
      <Text style={styles.subtitle}>Track what you eat, one meal at a time.</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Today</Text>
        <Text style={styles.cardValue}>0 kcal</Text>
      </View>
    </View>
  );
}

function createStyles(colors: Colors, top: number, bottom: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 24,
      paddingTop: top + 24,
      paddingBottom: bottom + 24,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      color: colors.muted,
      fontSize: 16,
      marginTop: 8,
    },
    card: {
      backgroundColor: colors.surface,
      marginTop: 32,
      padding: 20,
      borderRadius: 16,
    },
    cardLabel: {
      color: colors.muted,
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    cardValue: {
      color: colors.accent,
      fontSize: 40,
      fontWeight: '700',
      marginTop: 4,
    },
  });
}

export default App;
