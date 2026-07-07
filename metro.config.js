// Default Expo Metro config. Kept explicit so tooling recognises it extends
// "expo/metro-config" (path alias "@/" is handled by babel-plugin-module-resolver).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Let Metro treat .wasm as an asset so the web SQLite engine (sql.js, used by
// src/db/database.web.ts) can load its WebAssembly binary via a served URL.
config.resolver.assetExts.push('wasm');

// @supabase/supabase-js's browser build (index.mjs) does an OPTIONAL dynamic
// `import('@opentelemetry/api')` for tracing, guarded by `.catch(() => null)`.
// Metro still tries to resolve it statically and fails the whole web bundle
// (500 -> blank page) because the package isn't installed. Stub it to an empty
// module; Supabase already handles it being absent.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@opentelemetry/api') {
    return { type: 'empty' };
  }
  // react-native-gifted-charts pulls in `react-native-linear-gradient`, a BARE
  // native module. Its web build evaluates `requireNativeComponent(...)` at
  // import time (undefined under react-native-web -> TypeError -> white screen),
  // and it also isn't included in Expo Go on native. Redirect it to Expo's
  // cross-platform `expo-linear-gradient`, which works on web + iOS + Android +
  // Expo Go and exposes the same `LinearGradient` export gifted-charts expects.
  if (moduleName === 'react-native-linear-gradient') {
    return (defaultResolveRequest ?? context.resolveRequest)(
      context,
      'expo-linear-gradient',
      platform
    );
  }
  return (defaultResolveRequest ?? context.resolveRequest)(
    context,
    moduleName,
    platform
  );
};

module.exports = config;
