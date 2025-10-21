# ConfigProvider.d.ts

> Source: `src/components/ConfigProvider.d.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Dependencies

- `react`

## Source Code

```typescript
import type { ReactNode } from 'react';
interface ConfigContextValue {
  theme: 'light' | 'dark' | 'system';
  variant: 'core' | 'remix' | 'nextjs';
  devMode: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setVariant: (variant: 'core' | 'remix' | 'nextjs') => void;
  toggleDevMode: () => void;
}
interface ConfigProviderProps {
  children: ReactNode;
}
export declare function ConfigProvider({
  children,
}: ConfigProviderProps): import('react/jsx-runtime').JSX.Element;
export declare function useConfigContext(): ConfigContextValue;

```

---

*Generated documentation for @katalyst/core*
