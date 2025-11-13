# use-katalyst.ts

> Source: `src/hooks/use-katalyst.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Dependencies

- `react`
- `../stores/unified-katalyst-store.ts`
- `../types/index.ts`

## Exports

### `UseKatalystResult`

<!-- TODO: Add detailed documentation for UseKatalystResult -->

### `useKatalyst`

<!-- TODO: Add detailed documentation for useKatalyst -->

## Source Code

```typescript
/**
 * Core Katalyst hook for the Core package
 * This provides basic functionality until the full hooks package integration
 */

import { useState, useCallback } from 'react';
import { useKatalystStore } from '../stores/unified-katalyst-store.ts';
import type { KatalystConfig } from '../types/index.ts';

export interface UseKatalystResult {
  config: KatalystConfig;
  updateConfig: (updates: Partial<KatalystConfig>) => void;
  isInitialized: boolean;
}

/**
 * Basic Katalyst hook for Core package functionality
 * This will be enhanced when the full hooks package is integrated
 */
export function useKatalyst(initialConfig?: KatalystConfig): UseKatalystResult {
  const store = useKatalystStore();
  const [config, setConfig] = useState<KatalystConfig>(
    initialConfig || store.config.katalyst || {}
  );

  const updateConfig = useCallback((updates: Partial<KatalystConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    store.updateKatalystConfig(updates);
  }, [store]);

  return {
    config,
    updateConfig,
    isInitialized: store.system.isInitialized,
  };
}

```

---

*Generated documentation for @katalyst/core*
