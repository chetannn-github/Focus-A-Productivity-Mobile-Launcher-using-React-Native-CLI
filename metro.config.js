const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'png', 'jpg', 'jpeg', 'webp','avif'], // Ensure images are correctly loaded
  },
  transformer: {
    assetPlugins: [], // Disable default asset compression
  },
};

// Merge with Reanimated config
module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(defaultConfig, customConfig)
);
