/* eslint-env jest */
// Native-module mocks for the test renderer.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

// The dev-menu "all screens" item needs the native DevSettings module.
jest.mock('react-native/Libraries/Utilities/DevSettings', () => ({
  __esModule: true,
  default: { addMenuItem: jest.fn(), reload: jest.fn() },
}));

// `-ccInitialRoute` launch argument is read through iOS Settings.
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    watchKeys: jest.fn(),
    clearWatch: jest.fn(),
  },
}));
