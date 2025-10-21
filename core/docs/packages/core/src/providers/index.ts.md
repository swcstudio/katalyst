# index.ts

> Source: `src/providers/index.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Exports

### `DesignProvider`

<!-- TODO: Add detailed documentation for DesignProvider -->

### `DataProvider`

<!-- TODO: Add detailed documentation for DataProvider -->

### `DevProviders`

<!-- TODO: Add detailed documentation for DevProviders -->

### `KatalystApp`

<!-- TODO: Add detailed documentation for KatalystApp -->

## Source Code

```typescript
/**
 * Providers - All context providers in one logical group
 * Instead of scattered individual provider files
 */

// ========================================
// 🏗️ CORE PROVIDERS
// ========================================

export { KatalystProvider, useKatalystContext } from '../components/KatalystProvider.tsx';
export { ConfigProvider } from '../components/ConfigProvider.tsx';
export { TRPCProvider } from '../components/TRPCProvider.tsx';
export { AccessibilityProvider } from '../components/AccessibilityProvider.tsx';

// ========================================
// 🎨 UI PROVIDERS
// ========================================

// Design system provider (consolidate theming)
export function DesignProvider({ children, theme = 'dark' }: { children: React.ReactNode, theme?: 'light' | 'dark' }) {
  return (
    <div data-theme={theme} className="katalyst-design-root">
      {children}
    </div>
  );
}

// ========================================
// 📊 DATA PROVIDERS  
// ========================================

// Consolidate all data-related providers
export function DataProvider({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      {children}
    </TRPCProvider>
  );
}

// ========================================
// 🔧 DEVELOPMENT PROVIDERS (dev only)
// ========================================

// All experimental runtime providers grouped together
export const DevProviders = {
  MultithreadingProvider: () => import('../components/MultithreadingProvider.tsx'),
  EMPRuntimeProvider: () => import('../components/EMPRuntimeProvider.tsx'),
  UmiRuntimeProvider: () => import('../components/UmiRuntimeProvider.tsx'),
  SailsRuntimeProvider: () => import('../components/SailsRuntimeProvider.tsx'),
  InspectorRuntimeProvider: () => import('../components/InspectorRuntimeProvider.tsx'),
  TapableRuntimeProvider: () => import('../components/TapableRuntimeProvider.tsx'),
  TypiaRuntimeProvider: () => import('../components/TypiaRuntimeProvider.tsx'),
};

// ========================================
// 🚀 MASTER PROVIDER - Single wrapper for everything
// ========================================

interface KatalystAppProps {
  children: React.ReactNode;
  config?: any;
  theme?: 'light' | 'dark';
  features?: {
    data?: boolean;
    accessibility?: boolean;
  };
}

/**
 * Single provider that wraps everything your app needs
 * No more nested provider hell
 */
export function KatalystApp({ 
  children, 
  config = {}, 
  theme = 'dark',
  features = { data: true, accessibility: true }
}: KatalystAppProps) {
  return (
    <KatalystProvider config={config}>
      <ConfigProvider>
        <DesignProvider theme={theme}>
          {features.accessibility && (
            <AccessibilityProvider enabled>
              {features.data ? (
                <DataProvider>
                  {children}
                </DataProvider>
              ) : children}
            </AccessibilityProvider>
          )}
          {!features.accessibility && (
            features.data ? (
              <DataProvider>
                {children}
              </DataProvider>
            ) : children
          )}
        </DesignProvider>
      </ConfigProvider>
    </KatalystProvider>
  );
}

/**
 * USAGE - Simple and clean:
 * 
 * // Basic app setup
 * <KatalystApp>
 *   <App />
 * </KatalystApp>
 * 
 * // With configuration
 * <KatalystApp 
 *   config={{ framework: 'remix' }}
 *   theme="light"
 *   features={{ data: true, accessibility: true }}
 * >
 *   <App />
 * </KatalystApp>
 */
```

---

*Generated documentation for @katalyst/core*
