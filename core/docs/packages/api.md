# @katalyst/api

Shared tRPC API layer for Katalyst microfrontends with end-to-end type safety and efficient RPC communication.

## Overview

The `@katalyst/api` package provides a comprehensive tRPC-based API system designed to support storefronts, blogs, no-code builders, dashboards, admin panels, marketing sites, and member areas. All APIs are fully typed with automatic TypeScript inference and runtime validation using Zod schemas.

### Key Features

- 🔒 **Type-Safe APIs** - Full TypeScript type inference from server to client
- 🎯 **tRPC Integration** - Efficient RPC with automatic batching and caching
- 🌐 **Edge Function Support** - Deploy on Cloudflare Workers, Vercel Edge, etc.
- 🔐 **Authentication Middleware** - Built-in auth for protected procedures
- 📊 **AI Integration** - AI-powered features and agent coordination
- 🎮 **WebXR Support** - APIs for metaverse and XR experiences
- ⚡ **Performance** - Optimized queries with React Query integration
- 🛡️ **Runtime Validation** - Zod schemas for all inputs and outputs

## Installation

```bash
# Already available in the monorepo
import { createTRPCClient } from '@katalyst/api';
```

## Quick Start

### Client Setup

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@katalyst/api';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'https://api.katalyst.io/trpc',
      headers() {
        return {
          authorization: `Bearer ${getAuthToken()}`,
        };
      },
    }),
  ],
});

// Type-safe API calls
const products = await client.storefront.listProducts.query({
  category: 'electronics',
  limit: 20,
});
```

### React Integration

```tsx
import { trpc } from '@katalyst/api';

function ProductList() {
  const { data, isLoading } = trpc.storefront.listProducts.useQuery({
    category: 'electronics'
  });
  
  if (isLoading) return <Loading />;
  
  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## tRPC Configuration

### Creating a Router

```typescript
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@katalyst/api';
import { z } from 'zod';

export const myRouter = createTRPCRouter({
  // Public endpoint
  getPublicData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.getData(input.id);
    }),
  
  // Protected endpoint (requires auth)
  createItem: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      return await db.createItem({
        ...input,
        userId: ctx.user.id
      });
    }),
});
```

### Merging Routers

```typescript
import { createTRPCRouter } from '@katalyst/api';
import { authRouter } from '@katalyst/api/auth';
import { storefrontRouter } from '@katalyst/api/storefront';
import { cmsRouter } from '@katalyst/api/cms';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  storefront: storefrontRouter,
  cms: cmsRouter,
  // Add custom routers
  custom: myRouter,
});

export type AppRouter = typeof appRouter;
```

## API Routers

### Authentication Router

```typescript
// User registration
await client.auth.register.mutate({
  email: 'user@example.com',
  password: 'secure-password',
  name: 'John Doe'
});

// Login
const session = await client.auth.login.mutate({
  email: 'user@example.com',
  password: 'secure-password'
});

// Get current user
const user = await client.auth.me.query();
```

### Storefront Router

```typescript
// List products
const products = await client.storefront.listProducts.query({
  category: 'electronics',
  sortBy: 'price',
  order: 'asc',
  limit: 20
});

// Get product details
const product = await client.storefront.getProduct.query({
  id: 'prod_123'
});

// Create order
const order = await client.storefront.createOrder.mutate({
  items: [
    { productId: 'prod_123', quantity: 2 },
    { productId: 'prod_456', quantity: 1 }
  ],
  shippingAddress: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105'
  }
});
```

### CMS Router

```typescript
// Create article
const article = await client.cms.createArticle.mutate({
  title: 'Getting Started with Katalyst',
  content: '...',
  slug: 'getting-started',
  status: 'published'
});

// List articles
const articles = await client.cms.listArticles.query({
  status: 'published',
  limit: 10
});

// Update article
await client.cms.updateArticle.mutate({
  id: article.id,
  title: 'Updated Title'
});
```

### AI Router

```typescript
// Chat with AI agent
const response = await client.ai.chat.mutate({
  message: 'Help me build a component',
  agentId: 'code-assistant'
});

// Generate code
const code = await client.ai.generateCode.mutate({
  prompt: 'Create a login form component',
  language: 'typescript'
});

// Analyze code
const analysis = await client.ai.analyzeCode.mutate({
  code: 'const x = 1;',
  checks: ['quality', 'security', 'performance']
});
```

### WebXR Router

```typescript
// Create metaverse space
const space = await client.webxr.createSpace.mutate({
  name: 'My Virtual Office',
  template: 'office',
  settings: {
    maxUsers: 50,
    physics: true
  }
});

// Join space
await client.webxr.joinSpace.mutate({
  spaceId: space.id,
  avatarId: 'avatar_123'
});

// Update object
await client.webxr.updateObject.mutate({
  spaceId: space.id,
  objectId: 'obj_123',
  position: { x: 0, y: 1, z: 0 }
});
```

## Edge Functions

### Deploying to Edge

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@katalyst/api';

export default {
  async fetch(request: Request) {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      createContext: () => ({
        user: await getUser(request)
      }),
    });
  },
};
```

### Edge-Optimized Queries

```typescript
// Use edge caching
const products = await client.storefront.listProducts.query(
  { category: 'electronics' },
  {
    context: {
      skipBatch: true, // Don't batch for edge
      cache: 'force-cache' // Use edge cache
    }
  }
);
```

## Type Safety

### Input Validation with Zod

```typescript
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  description: z.string().optional(),
  category: z.enum(['electronics', 'clothing', 'books']),
  tags: z.array(z.string()).max(10),
  images: z.array(z.string().url()).min(1)
});

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      // input is fully typed and validated
      return await db.createProduct(input);
    })
});
```

### Type Inference

```typescript
// Type is automatically inferred
type Product = RouterOutputs['storefront']['getProduct'];
type ProductInput = RouterInputs['storefront']['createProduct'];

// Use in components
function ProductCard({ product }: { product: Product }) {
  return <div>{product.name}</div>;
}
```

## Error Handling

```typescript
import { TRPCError } from '@trpc/server';

export const myRouter = createTRPCRouter({
  deleteItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const item = await db.getItem(input.id);
      
      if (!item) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Item not found'
        });
      }
      
      if (item.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this item'
        });
      }
      
      await db.deleteItem(input.id);
      return { success: true };
    })
});
```

## Examples

### Complete tRPC Setup

```typescript
// server.ts
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from '@katalyst/api';

const server = createHTTPServer({
  router: appRouter,
  createContext: ({ req, res }) => ({
    user: null, // Add auth logic
  }),
});

server.listen(3000);
```

```typescript
// client.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@katalyst/api';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});
```

### React Query Integration

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from './trpc';

const queryClient = new QueryClient();

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

## Integration with Other Packages

### With @katalyst/ai

```typescript
import { ClaudeAgent } from '@katalyst/ai';

export const aiRouter = createTRPCRouter({
  chat: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const agent = new ClaudeAgent({
        apiKey: ctx.user.apiKey
      });
      return await agent.chat(input.message);
    })
});
```

### With @katalyst/multithreading

```typescript
import { threadController } from '@katalyst/multithreading';

export const processRouter = createTRPCRouter({
  processLargeDataset: protectedProcedure
    .input(z.object({ data: z.array(z.number()) }))
    .mutation(async ({ input }) => {
      const pool = threadController.createThreadPool('processing');
      const result = await pool.map(input.data, 'transform');
      pool.destroy();
      return result;
    })
});
```

## Troubleshooting

### CORS Issues

```typescript
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

const server = createHTTPServer({
  middleware: cors({
    origin: 'http://localhost:3000',
    credentials: true
  }),
  router: appRouter,
});
```

### Type Errors

```typescript
// Ensure you're importing the router type correctly
import type { AppRouter } from '@katalyst/api';

// Not from the router instance
// import type { AppRouter } from './server';
```

## Best Practices

1. **Use procedures appropriately** - Queries for reads, mutations for writes
2. **Validate all inputs** - Use Zod schemas for runtime validation
3. **Handle errors properly** - Use TRPCError with appropriate codes
4. **Optimize queries** - Use batching and caching effectively
5. **Type everything** - Leverage TypeScript's type inference
6. **Test your APIs** - Write tests for all procedures
7. **Document procedures** - Add JSDoc comments for better DX

## Related Documentation

- [AI Package](./ai.md) - AI integration in APIs
- [Core Package](./core.md) - Using APIs in React components
- [Multithreading Package](./multithreading.md) - Parallel API processing

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
