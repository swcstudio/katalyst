# fast-refresh.ts

> Source: `src/integrations/fast-refresh.ts`

**Package:** `@katalyst/integrations`

## Overview

This module is part of the `@katalyst/integrations` package.

## Exports

### `FastRefreshIntegration`

<!-- TODO: Add detailed documentation for FastRefreshIntegration -->

## Source Code

```typescript
export class FastRefreshIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupFastRefresh() {
    return {
      name: 'fast-refresh',
      setup: () => ({
        react: true,
        overlay: true,
        hmr: true,
      }),
    };
  }

  async initialize() {
    return [await this.setupFastRefresh()];
  }
}

```

---

*Generated documentation for @katalyst/integrations*
