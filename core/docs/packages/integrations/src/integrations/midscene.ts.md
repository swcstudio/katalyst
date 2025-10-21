# midscene.ts

> Source: `src/integrations/midscene.ts`

**Package:** `@katalyst/integrations`

## Overview

This module is part of the `@katalyst/integrations` package.

## Exports

### `MidsceneIntegration`

<!-- TODO: Add detailed documentation for MidsceneIntegration -->

## Source Code

```typescript
export class MidsceneIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupMidscene() {
    return {
      name: 'midscene-ai',
      setup: () => ({
        automation: true,
        ai: 'gpt-4o',
        browser: 'playwright',
      }),
    };
  }

  async initialize() {
    return [await this.setupMidscene()];
  }
}

```

---

*Generated documentation for @katalyst/integrations*
