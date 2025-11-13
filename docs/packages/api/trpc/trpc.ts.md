# trpc.ts

> Source: `trpc/trpc.ts`

**Package:** `@katalyst/api`

## Overview

This module is part of the `@katalyst/api` package.

## Dependencies

- `@trpc/server`
- `superjson`
- `./context`
- `zod`

## Exports

### `router`

<!-- TODO: Add detailed documentation for router -->

### `publicProcedure`

<!-- TODO: Add detailed documentation for publicProcedure -->

### `protectedProcedure`

<!-- TODO: Add detailed documentation for protectedProcedure -->

### `mergeRouters`

<!-- TODO: Add detailed documentation for mergeRouters -->

## Source Code

```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context';
import { ZodError } from 'zod';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

/**
 * Create a router
 */
export const router = t.router;

/**
 * Public procedure
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that checks if users are authenticated
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // Infers the `userId` as non-nullable
      userId: ctx.userId,
    },
  });
});

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Merge routers
 */
export const mergeRouters = t.mergeRouters;
```

---

*Generated documentation for @katalyst/api*
