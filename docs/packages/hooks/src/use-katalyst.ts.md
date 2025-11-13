# use-katalyst.ts

> Source: `src/use-katalyst.ts`

**Package:** `@katalyst/hooks`

## Overview

This module is part of the `@katalyst/hooks` package.

## Dependencies

- `react`
- `../types/index.ts`

## Exports

### `useKatalyst`

<!-- TODO: Add detailed documentation for useKatalyst -->

## Source Code

```typescript
import { useEffect, useState } from 'react';
import type { KatalystConfig } from '../types/index.ts';

export function useKatalyst(initialConfig: KatalystConfig) {
  const [config, setConfig] = useState<KatalystConfig>(initialConfig);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeKatalyst = async () => {
      try {
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Katalyst:', error);
      }
    };

    initializeKatalyst();
  }, []);

  const updateConfig = (updates: Partial<KatalystConfig>) => {
    setConfig((prev: KatalystConfig) => ({ ...prev, ...updates }));
  };

  return {
    config,
    updateConfig,
    isInitialized,
  };
}

```

---

*Generated documentation for @katalyst/hooks*
