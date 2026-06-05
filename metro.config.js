// Default Expo Metro config. Kept explicit so tooling recognises it extends
// "expo/metro-config" (path alias "@/" is handled by babel-plugin-module-resolver).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
