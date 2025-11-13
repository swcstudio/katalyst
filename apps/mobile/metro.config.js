/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 */
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    alias: {
      '@': './src',
      '@/components': './src/components',
      '@/screens': './src/screens',
      '@/navigation': './src/navigation',
      '@/hooks': './src/hooks',
      '@/utils': './src/utils',
      '@/stores': './src/stores',
      '@/types': './src/types',
      '@/assets': './src/assets',
      '@/providers': './src/providers',
      '@katalyst/design-system': '../../packages/design-system/src',
      '@katalyst/shared': '../../shared/src',
    },
  },
  watchFolders: [
    '../../packages/design-system',
    '../../shared',
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
