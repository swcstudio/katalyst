# svgr.ts

> Source: `src/integrations/svgr.ts`

**Package:** `@katalyst/integrations`

## Overview

This module is part of the `@katalyst/integrations` package.

## Exports

### `SvgrIntegration`

<!-- TODO: Add detailed documentation for SvgrIntegration -->

## Source Code

```typescript
export class SvgrIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupSvgr() {
    return {
      name: 'svgr-plugin',
      setup: () => ({
        icons: new Map(),
        optimization: true,
        typescript: true,
      }),
    };
  }

  async initialize() {
    return [await this.setupSvgr()];
  }
}

```

---

*Generated documentation for @katalyst/integrations*
