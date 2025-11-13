# index.ts

> Source: `src/types/index.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Exports

### `KatalystConfig`

<!-- TODO: Add detailed documentation for KatalystConfig -->

### `KatalystFeature`

<!-- TODO: Add detailed documentation for KatalystFeature -->

### `KatalystPlugin`

<!-- TODO: Add detailed documentation for KatalystPlugin -->

### `KatalystIntegration`

<!-- TODO: Add detailed documentation for KatalystIntegration -->

### `TanStackConfig`

<!-- TODO: Add detailed documentation for TanStackConfig -->

### `RSpackConfig`

<!-- TODO: Add detailed documentation for RSpackConfig -->

### `Web3Config`

<!-- TODO: Add detailed documentation for Web3Config -->

### `StyleXConfig`

<!-- TODO: Add detailed documentation for StyleXConfig -->

### `StorybookConfig`

<!-- TODO: Add detailed documentation for StorybookConfig -->

### `UnifiedAppBuilderConfig`

<!-- TODO: Add detailed documentation for UnifiedAppBuilderConfig -->

### `PlatformConfigs`

<!-- TODO: Add detailed documentation for PlatformConfigs -->

### `MultithreadingConfig`

<!-- TODO: Add detailed documentation for MultithreadingConfig -->

## Source Code

```typescript
export interface KatalystConfig {
  variant: 'core' | 'remix' | 'nextjs';
  theme?: 'light' | 'dark' | 'system';
  features: KatalystFeature[];
  plugins: KatalystPlugin[];
  integrations: KatalystIntegration[];
  unifiedAppBuilder?: UnifiedAppBuilderConfig;
  platformConfigs?: PlatformConfigs;
}

export interface KatalystFeature {
  name: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface KatalystPlugin {
  name: string;
  version: string;
  config?: Record<string, unknown>;
}

export interface KatalystIntegration {
  name: string;
  type:
    | 'bundler'
    | 'framework'
    | 'ui'
    | 'testing'
    | 'deployment'
    | 'development'
    | 'validation'
    | 'automation';
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface TanStackConfig {
  router: boolean;
  query: boolean;
  form: boolean;
  table: boolean;
  virtual: boolean;
}

export interface RSpackConfig {
  plugins: string[];
  optimization: Record<string, unknown>;
  performance: Record<string, unknown>;
}

export interface Web3Config {
  evmos: boolean;
  cosmos: boolean;
  ethereum: boolean;
  chains: string[];
}

export interface StyleXConfig {
  theme: Record<string, unknown>;
  tokens: Record<string, unknown>;
  plugins: string[];
}

export interface StorybookConfig {
  builder: 'rsbuild';
  addons: string[];
  features: Record<string, boolean>;
}

export interface UnifiedAppBuilderConfig {
  enabled: boolean;
  platforms: ('web' | 'desktop' | 'mobile' | 'metaverse')[];
  frameworks: {
    desktop: string;
    mobile: string;
    metaverse: string;
  };
  sharedComponents: boolean;
  rustBackend: boolean;
  features: {
    crossPlatformComponents: boolean;
    sharedStateManagement: boolean;
    unifiedBuildSystem: boolean;
    hotReload: boolean;
  };
}

export interface PlatformConfigs {
  desktop?: {
    tauri?: {
      enabled: boolean;
      features: string[];
    };
  };
  mobile?: {
    rspeedy?: {
      enabled: boolean;
      features: string[];
    };
  };
  metaverse?: {
    webxr?: {
      enabled: boolean;
      features: string[];
    };
  };
}

export interface MultithreadingConfig {
  autoInitialize?: boolean;
  workerThreads?: number;
  maxBlockingThreads?: number;
  enableProfiling?: boolean;
  enableReactIntegration?: boolean;
}

export * from './emp';
export * from './umi';
export * from './sails';
export * from './typia';
export * from './inspector';

```

---

*Generated documentation for @katalyst/core*
