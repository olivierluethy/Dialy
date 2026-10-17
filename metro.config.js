// Default Expo Metro config. Kept explicit so tooling recognises it extends
// "expo/metro-config" (path alias "@/" is handled by babel-plugin-module-resolver).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Let Metro treat .wasm as an asset so the web SQLite engine (sql.js, used by
// src/db/database.web.ts) can load its WebAssembly binary via a served URL.
config.resolver.assetExts.push('wasm');

// Optional native health modules (issue #21 §3 B, src/services/healthGlucose).
// They are only installed for a dev/EAS build; until then Metro can't resolve
// the literal `require(...)` and the whole bundle fails. Stub the ones that
// aren't installed to an empty module (the code guards by Platform + feature
// detection, so an empty module simply reads as "unavailable"). Once the
// package is installed, `require.resolve` succeeds and the real module loads.
const OPTIONAL_HEALTH_MODULES = ['@kingstinct/react-native-healthkit', 'react-native-health-connect'];
const missingHealthModules = new Set(
  OPTIONAL_HEALTH_MODULES.filter((name) => {
    try {
      require.resolve(name);
      return false;
    } catch {
      return true;
    }
  })
);

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
  // Optional health modules that aren't installed (see above).
  if (missingHealthModules.has(moduleName)) {
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
