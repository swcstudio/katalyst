# use-config.ts

> Source: `src/use-config.ts`

**Package:** `@katalyst/hooks`

## Overview

This module is part of the `@katalyst/hooks` package.

## Dependencies

- `react`
- `../types/index.ts`

## Exports

### `useConfig`

<!-- TODO: Add detailed documentation for useConfig -->

## Source Code

```typescript
import { useCallback, useState } from 'react';
import type { KatalystConfig } from '../types/index.ts';

export function useConfig(initialConfig: KatalystConfig) {
  const [config, setConfig] = useState<KatalystConfig>(initialConfig);

  const updateFeature = useCallback((name: string, enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.name === name ? { ...f, enabled } : f)),
    }));
  }, []);

  const updatePlugin = useCallback((name: string, config: Record<string, unknown>) => {
    setConfig((prev) => ({
      ...prev,
      plugins: prev.plugins.map((p) => (p.name === name ? { ...p, config } : p)),
    }));
  }, []);

  const updateIntegration = useCallback((name: string, enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      integrations: prev.integrations.map((i) => (i.name === name ? { ...i, enabled } : i)),
    }));
  }, []);

  return {
    config,
    updateFeature,
    updatePlugin,
    updateIntegration,
  };
}

```

---

*Generated documentation for @katalyst/hooks*
