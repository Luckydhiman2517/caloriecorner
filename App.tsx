/**
 * Calorie Corner
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { CartProvider } from './src/state/cart';

function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </CartProvider>
    </SafeAreaProvider>
  );
}

export default App;
