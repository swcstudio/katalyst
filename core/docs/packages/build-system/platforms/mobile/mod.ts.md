# mod.ts

> Source: `platforms/mobile/mod.ts`

**Package:** `@katalyst/build-system`

## Overview

This module is part of the `@katalyst/build-system` package.

## Source Code

```typescript
// @katalyst/mobile - Mobile-specific components and utilities
export * from './src/build-system/index.ts';
export * from './src/components/index.ts';
export * from './src/components/enhanced/index.ts';
export * from './src/components/repack/index.ts';
export * from './src/examples/MobileAppExample.tsx';

// Re-export core mobile components
export { SafeAreaView } from './src/components/SafeAreaView.tsx';
export { TouchableOpacity } from './src/components/TouchableOpacity.tsx';
export { HapticFeedback } from './src/components/HapticFeedback.tsx';
export { ErrorBoundary } from './src/components/ErrorBoundary.tsx';

// Repack integration
export { RepackProvider } from './src/components/repack/RepackProvider.tsx';
export { ModuleFederationLoader } from './src/components/repack/ModuleFederationLoader.tsx';
export { PerformanceMonitor } from './src/components/repack/PerformanceMonitor.tsx';
```

---

*Generated documentation for @katalyst/build-system*
