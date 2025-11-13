# route.ts

> Source: `trpc/[trpc]/route.ts`

**Package:** `@katalyst/api`

## Overview

This module is part of the `@katalyst/api` package.

## Dependencies

- `@trpc/server/adapters/fetch`
- `../routers`
- `../context`

## Source Code

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../routers';
import { createContext } from '../context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ req, res: {} as any }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
```

---

*Generated documentation for @katalyst/api*
