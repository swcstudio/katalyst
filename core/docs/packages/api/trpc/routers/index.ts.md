# index.ts

> Source: `trpc/routers/index.ts`

**Package:** `@katalyst/api`

## Overview

This module is part of the `@katalyst/api` package.

## Dependencies

- `../trpc`
- `./user`
- `./post`
- `./ai`
- `./analytics`
- `./auth`
- `./storefront`
- `./cms`
- `./builder`
- `./forms`
- `./membership`
- `./media`
- `./admin`

## Exports

### `appRouter`

<!-- TODO: Add detailed documentation for appRouter -->

### `AppRouter`

<!-- TODO: Add detailed documentation for AppRouter -->

## Source Code

```typescript
import { router } from '../trpc';

// Existing routers
import { userRouter } from './user';
import { postRouter } from './post';
import { aiRouter } from './ai';
import { analyticsRouter } from './analytics';

// New comprehensive routers
import { authRouter } from './auth';
import { storefrontRouter } from './storefront';
import { cmsRouter } from './cms';
import { builderRouter } from './builder';
import { formsRouter } from './forms';
import { membershipRouter } from './membership';
import { mediaRouter } from './media';
import { adminRouter } from './admin';

export const appRouter = router({
  // Core functionality
  auth: authRouter,
  user: userRouter,
  admin: adminRouter,
  
  // Content & Media
  cms: cmsRouter,
  media: mediaRouter,
  post: postRouter,
  
  // E-commerce & Business
  storefront: storefrontRouter,
  membership: membershipRouter,
  
  // Builder & Forms
  builder: builderRouter,
  forms: formsRouter,
  
  // AI & Analytics
  ai: aiRouter,
  analytics: analyticsRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
```

---

*Generated documentation for @katalyst/api*
