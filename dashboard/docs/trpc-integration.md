# tRPC Integration Guide

This guide explains how to use tRPC for API communication across all components in the Katalyst project.

## Overview

tRPC provides end-to-end typesafe APIs, allowing you to build fully typesafe applications without the need for code generation or runtime overhead.

## Setup

The tRPC setup is already configured in the project with:

- **Server**: Located in `/api/trpc/`
- **Client**: Configured in `/shared/src/lib/trpc/client.ts`
- **Provider**: Available as `TRPCProvider` component

## Using tRPC in Components

### 1. Wrap Your App with TRPCProvider

```tsx
import { TRPCProvider } from '@katalyst-react/shared';

function App() {
  return (
    <TRPCProvider>
      {/* Your app content */}
    </TRPCProvider>
  );
}
```

### 2. Use tRPC Hooks

#### Direct tRPC Usage

```tsx
import { trpc } from '@katalyst-react/shared';

function MyComponent() {
  // Query
  const { data, isLoading } = trpc.user.getById.useQuery({ id: '123' });
  
  // Mutation
  const createPost = trpc.post.create.useMutation();
  
  const handleCreate = () => {
    createPost.mutate({
      title: 'New Post',
      content: 'Content here',
      published: true,
    });
  };
  
  return (
    // Your component UI
  );
}
```

#### Using Custom Hooks

```tsx
import { useUser, usePosts, useCreatePost } from '@katalyst-react/shared';

function MyComponent() {
  // Get current user
  const { user, isLoading, updateProfile } = useUser();
  
  // Get posts with infinite scroll
  const { posts, fetchNextPage, hasNextPage } = usePosts({ limit: 10 });
  
  // Create post with automatic cache invalidation
  const createPost = useCreatePost();
  
  return (
    // Your component UI
  );
}
```

## Available Routers

### User Router (`trpc.user.*`)

- `me` - Get current user (protected)
- `updateProfile` - Update user profile (protected)
- `getById` - Get user by ID (public)
- `list` - List users with pagination (public)

### Post Router (`trpc.post.*`)

- `create` - Create new post (protected)
- `update` - Update existing post (protected)
- `delete` - Delete post (protected)
- `getById` - Get single post (public)
- `list` - List posts with filters (public)
- `myPosts` - Get current user's posts (protected)

### AI Router (`trpc.ai.*`)

- `chat` - Chat completion (protected)
- `generateText` - Generate text content (protected)
- `analyzeSentiment` - Analyze text sentiment (public)
- `generateImagePrompt` - Generate optimized image prompts (protected)

### Analytics Router (`trpc.analytics.*`)

- `pageViews` - Get page view metrics (protected)
- `engagement` - Get user engagement metrics (protected)
- `conversions` - Get conversion metrics (protected)
- `activeUsers` - Get real-time active users (public)
- `trackEvent` - Track custom events (public)
- `topContent` - Get top performing content (protected)

## Authentication

Protected endpoints require authentication. The context includes `userId` from Clerk authentication.

```tsx
// In your procedures
export const protectedProcedure = t.procedure.use(isAuthed);

// The isAuthed middleware checks for userId
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});
```

## Error Handling

tRPC provides built-in error handling with proper TypeScript types:

```tsx
const { data, error, isError } = trpc.user.me.useQuery();

if (isError) {
  if (error.data?.code === 'UNAUTHORIZED') {
    // Handle unauthorized
  }
  // Handle other errors
}
```

## Optimistic Updates

Use mutations with optimistic updates for better UX:

```tsx
const utils = trpc.useUtils();
const updateProfile = trpc.user.updateProfile.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await utils.user.me.cancel();
    
    // Get current data
    const previousData = utils.user.me.getData();
    
    // Optimistically update
    utils.user.me.setData(undefined, (old) => ({
      ...old,
      ...newData,
    }));
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    utils.user.me.setData(undefined, context.previousData);
  },
  onSettled: () => {
    // Refetch after mutation
    utils.user.me.invalidate();
  },
});
```

## Adding New Endpoints

1. Create a new router in `/api/trpc/routers/`
2. Add it to the app router in `/api/trpc/routers/index.ts`
3. Use Zod for input validation
4. The types will be automatically inferred on the client

Example:

```typescript
// api/trpc/routers/product.ts
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const productRouter = router({
  list: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      // Fetch products
      return { products: [] };
    }),
});

// api/trpc/routers/index.ts
export const appRouter = router({
  // ... existing routers
  product: productRouter,
});
```

## Best Practices

1. **Use custom hooks** for common queries to encapsulate logic
2. **Leverage optimistic updates** for mutations that affect UI
3. **Use infinite queries** for paginated lists
4. **Invalidate related queries** after mutations
5. **Handle errors gracefully** with proper error boundaries
6. **Use Zod schemas** for robust input validation
7. **Keep procedures focused** - one procedure, one responsibility

## Testing

Mock tRPC in tests:

```typescript
import { createTRPCMsw } from 'msw-trpc';
import { type AppRouter } from '@/api/trpc/routers';

const trpcMsw = createTRPCMsw<AppRouter>();

// In your tests
server.use(
  trpcMsw.user.me.query(() => ({
    id: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
  }))
);
```

## Performance

- tRPC batches requests automatically
- Use React Query's caching strategies
- Implement proper stale-while-revalidate patterns
- Use selective query invalidation

## Migration from REST APIs

To migrate existing REST endpoints:

1. Create equivalent tRPC procedures
2. Update components to use tRPC hooks
3. Remove old API calls
4. Delete REST endpoint files

The type safety and auto-completion will help catch any issues during migration.