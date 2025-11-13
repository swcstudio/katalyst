# use-integration.ts

> Source: `src/use-integration.ts`

**Package:** `@katalyst/hooks`

## Overview

This module is part of the `@katalyst/hooks` package.

## Dependencies

- `react`
- `../types/index.ts`

## Exports

### `useIntegration`

<!-- TODO: Add detailed documentation for useIntegration -->

## Source Code

```typescript
import { useEffect, useState } from 'react';
import type { KatalystIntegration } from '../types/index.ts';

export function useIntegration(integrationName: string) {
  const [integration, setIntegration] = useState<KatalystIntegration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIntegration = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    loadIntegration();
  }, [integrationName]);

  return {
    integration,
    isLoading,
    error,
  };
}

```

---

*Generated documentation for @katalyst/hooks*
