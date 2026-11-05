module.exports = {
  preset: '@react-native/jest-preset',
  // React Navigation and friends ship ESM, so let Babel transform them too.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-screens|react-native-svg|react-native-safe-area-context)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
