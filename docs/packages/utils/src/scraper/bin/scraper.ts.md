# scraper.ts

> Source: `src/scraper/bin/scraper.ts`

**Package:** `@katalyst/utils`

## Overview

This module is part of the `@katalyst/utils` package.

## Dependencies

- `../cli/interactive-cli`

## Source Code

```typescript
#!/usr/bin/env node

/**
 * Web Scraper CLI Entry Point
 */

import { InteractiveScraper } from '../cli/interactive-cli';

const scraper = new InteractiveScraper();

scraper.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

```

---

*Generated documentation for @katalyst/utils*
