# index.ts

> Source: `src/core/index.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Source Code

```typescript
/**
 * @katalyst/core - Production-ready shared components
 * 
 * This is the ONLY shared code that applications should depend on.
 * Everything here is battle-tested and used in production.
 */

// ========================================
// 🏗️ CORE FRAMEWORK - Essential Only
// ========================================

// System Providers - What every app needs
export { KatalystProvider, useKatalystContext } from '../components/KatalystProvider.tsx';
export { ConfigProvider } from '../components/ConfigProvider.tsx';

// Design System - Production UI components only
export {
  Button,
  Card, 
  Input,
  Badge,
  Tabs,
  Icon
} from '../components/ui';

// Core Hooks - Proven and stable
export { useConfig } from '../hooks/use-config.ts';
export { useHydration } from '../hooks/use-hydration.ts';

// Essential Stores - Configuration and state management
export { 
  useConfigStore,
  type ConfigState,
  type ConfigActions 
} from '../stores/config-store.ts';

// ========================================
// 📐 DESIGN TOKENS & THEMING
// ========================================

export { 
  tokens,
  breakpoints,
  typography,
  colors,
  spacing
} from '../design-system/tokens.ts';

// ========================================
// 🔧 UTILITIES - Core helpers only
// ========================================

export { cn } from '../utils/cn.ts';
export { validateConfig } from '../utils/validation.ts';

/**
 * WHAT'S NOT INCLUDED (moved to separate packages):
 * 
 * ❌ Runtime Providers (EMPRuntimeProvider, UmiRuntimeProvider, etc.)
 * ❌ Build tool integrations (rspack, nx, webpack configs)
 * ❌ Experimental multithreading
 * ❌ Dev tools and demos
 * ❌ TanStack components (moved to @katalyst/data)
 * ❌ Payment providers (moved to @katalyst/commerce)
 * ❌ Mobile/WebXR components (experimental)
 * 
 * This core package is <50KB and contains only production essentials.
 */
```

---

*Generated documentation for @katalyst/core*
