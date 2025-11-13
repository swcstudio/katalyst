# index.ts

> Source: `src/plugins/index.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Dependencies

- `@shared/plugins`
- `@shared/plugins`

## Exports

### `LegacyBuilds`

<!-- TODO: Add detailed documentation for LegacyBuilds -->

### `KatalystBuildPresets`

<!-- TODO: Add detailed documentation for KatalystBuildPresets -->

### `BuildConfigs`

<!-- TODO: Add detailed documentation for BuildConfigs -->

## Source Code

```typescript
/**
 * Plugins - All build tool configurations in logical groups  
 * Instead of scattered technical plugin files
 */

// ========================================
// 🏗️ BUILD SYSTEMS - Production configurations only
// ========================================

// RSpack (primary - used in production)
export {
  RSpackPluginManager,
  type RSpackPluginConfig,
  type RSpackCompiler,
  type RSpackPluginFactory
} from './rspack-plugins.ts';

export {
  KatalystPluginManager
} from './katalyst-plugins.ts';

// RSpack config builder (actual business need)
export {
  createRspackConfig,
  createDevelopmentConfig,
  createProductionConfig,
  type BuildVariant
} from './rspack-config-builder.ts';

// ========================================
// 🔧 LEGACY BUILD TOOLS (conditional loading)
// ========================================

// These are only loaded when needed for specific projects
export const LegacyBuilds = {
  // Webpack (legacy projects only)
  webpack: () => import('./webpack-plugins.ts'),
  // Vite (not actively used but kept for migration)
  vite: () => import('./vite-plugins.ts'),
};

// ========================================
// 🎯 SPECIALIZED PLUGINS (feature-specific)
// ========================================

// Zephyr RSpack plugin (experimental - dev tools only)
export {
  ZephyrRspackPlugin,
  type ZephyrOptions
} from './zephyr-rspack-plugin.ts';

// ========================================
// 🚀 PRESET CONFIGURATIONS - Ready to use
// ========================================

/**
 * Production-ready build configurations for different use cases
 */
export class KatalystBuildPresets {
  /**
   * Core app build (minimal setup)
   * Used by: Basic React apps, marketing sites
   */
  static createCorePreset() {
    const manager = new KatalystPluginManager();
    return manager.generateRSpackConfig('core');
  }

  /**
   * Remix app build  
   * Used by: Full-stack Remix applications
   */
  static createRemixPreset() {
    const manager = new KatalystPluginManager();
    return manager.generateRSpackConfig('remix');
  }

  /**
   * Next.js app build
   * Used by: Next.js applications (if needed)
   */
  static createNextPreset() {
    const manager = new KatalystPluginManager();
    return manager.generateRSpackConfig('nextjs');
  }

  /**
   * Admin dashboard build
   * Used by: Data-heavy admin interfaces
   */
  static createAdminPreset() {
    const manager = new KatalystPluginManager();
    const config = manager.generateRSpackConfig('core');
    
    // Add admin-specific optimizations
    return {
      ...config,
      optimization: {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            tanstack: {
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              name: 'tanstack',
              chunks: 'all',
            }
          }
        }
      }
    };
  }
}

// ========================================
// 📦 OPTIMIZED EXPORTS - Simple usage patterns
// ========================================

/**
 * Quick access to most common configurations
 */
export const BuildConfigs = {
  // Most common - core React app
  core: () => KatalystBuildPresets.createCorePreset(),
  
  // Full-stack apps
  remix: () => KatalystBuildPresets.createRemixPreset(),
  
  // Admin dashboards  
  admin: () => KatalystBuildPresets.createAdminPreset(),
  
  // Custom configuration
  custom: (variant: 'core' | 'remix' | 'nextjs') => {
    const manager = new KatalystPluginManager();
    return manager.generateRSpackConfig(variant);
  }
};

/**
 * FOCUSED ON ACTUAL BUSINESS NEEDS:
 * 
 * ✅ RSpack configurations (production ready)
 * ✅ Preset builds for common use cases  
 * ✅ Katalyst plugin management
 * ✅ Build optimization strategies
 * 
 * REMOVED EXPERIMENTAL:
 * ❌ Scattered webpack configs
 * ❌ Unused Vite configurations  
 * ❌ One-off custom plugins
 * 
 * USAGE PATTERNS:
 * 
 * // Simple core app
 * import { BuildConfigs } from '@shared/plugins';
 * const config = BuildConfigs.core();
 * 
 * // Admin dashboard  
 * const adminConfig = BuildConfigs.admin();
 * 
 * // Custom Remix setup
 * import { KatalystBuildPresets } from '@shared/plugins';
 * const remixConfig = KatalystBuildPresets.createRemixPreset();
 * 
 * // Legacy project (conditional)
 * const { webpack } = await import('@shared/plugins').LegacyBuilds;
 * const webpackPlugins = await webpack();
 */
```

---

*Generated documentation for @katalyst/core*
