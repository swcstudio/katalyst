# index.ts

> Source: `src/core/index.ts`

**Package:** `@katalyst/hooks`

## Overview

This module is part of the `@katalyst/hooks` package.

## Source Code

```typescript
/**
 * Core hooks - Foundational hooks for the Katalyst ecosystem
 * Re-exports all core hook functionality for easy consumption
 */

// Common React-like enhanced hooks
export * from './common-hooks';

// DOM and browser interaction hooks  
export * from './dom-hooks';

// Utility hooks for common patterns
export * from './utility-hooks';

// Default export for convenience
export {
  useState,
  useEffect, 
  useCallback,
  useMemo,
  useRef
} from './common-hooks';

export {
  useWindowSize,
  useMediaQuery,
  useLocalStorage,
  useClipboard
} from './dom-hooks';

export {
  useDebounce,
  useThrottle,
  useToggle,
  useFetch
} from './utility-hooks';

```

---

*Generated documentation for @katalyst/hooks*
