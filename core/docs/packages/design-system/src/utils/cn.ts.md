# cn.ts

> Source: `src/utils/cn.ts`

**Package:** `@katalyst/design-system`

## Overview

This module is part of the `@katalyst/design-system` package.

## Dependencies

- `clsx`
- `tailwind-merge`

## Exports

### `cn`

<!-- TODO: Add detailed documentation for cn -->

## Source Code

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

*Generated documentation for @katalyst/design-system*
