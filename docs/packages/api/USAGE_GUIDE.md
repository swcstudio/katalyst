# API Package - Complete Usage Guide

> **Package:** `@katalyst/api`  
> **Purpose:** Backend API layer with tRPC, AI, and Edge functions  
> **Status:** ✅ Production Ready

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [tRPC Setup](#trpc-setup)
4. [API Routers](#api-routers)
5. [AI Integration](#ai-integration)
6. [Edge Functions](#edge-functions)
7. [Authentication](#authentication)
8. [Best Practices](#best-practices)

---

## Overview

`@katalyst/api` provides a complete, type-safe API layer built on tRPC with support for:

- **tRPC** - End-to-end typesafe APIs
- **AI Integration** - OpenAI streaming with Vercel AI SDK
- **Edge Runtime** - Optimized edge functions
- **WebXR** - Spatial computing APIs
- **Authentication** - Built-in auth middleware

### Architecture

```
@katalyst/api/
├── trpc/              # tRPC configuration
│   ├── trpc.ts        # Base tRPC setup
│   ├── context.ts     # Request context
│   └── routers/       # API routers
├── ai/                # AI integrations
│   └── chat.ts        # OpenAI chat streaming
├── edge/              # Edge runtime functions
│   └── runtime.ts     # Edge utilities
└── webxr/             # WebXR APIs
    └── session.ts     # XR session management
```

---

## Quick Start

### Installation

```bash
npm install @katalyst/api @trpc/server @trpc/client
# or
yarn add @katalyst/api @trpc/server @trpc/client
# or  
pnpm add @katalyst/api @trpc/server @trpc/client
```

### Basic tRPC Setup

**Backend (`app/api/trpc/[trpc]/route.ts`):**

```typescript
import { appRouter } from '@katalyst/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
```

**Frontend (`lib/trpc.ts`):**

```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@katalyst/api';
import superjson from 'superjson';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
});
```

**Using in Components:**

```typescript
import { trpc } from '@/lib/trpc';

async function getData() {
  const posts = await trpc.post.list.query();
  return posts;
}
```

---

## tRPC Setup

### Server Configuration

**File:** `trpc/trpc.ts`

```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError 
          ? error.cause.flatten() 
          : null,
      },
    };
  },
});

// Export utilities
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
```

### Creating Context

**File:** `trpc/context.ts`

```typescript
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { auth } from '@/lib/auth';

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await auth();

  return {
    userId: session?.user?.id,
    session,
    headers: opts.req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

### Creating Routers

**Basic Router Example:**

```typescript
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const postRouter = router({
  // Public endpoint
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const posts = await db.post.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      });
      
      return {
        items: posts,
        nextCursor: posts.length > input.limit 
          ? posts[input.limit].id 
          : undefined,
      };
    }),

  // Protected endpoint
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return await db.post.create({
        data: {
          ...input,
          authorId: ctx.userId,
        },
      });
    }),

  // Get single post
  byId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const post = await db.post.findUnique({
        where: { id: input },
      });
      
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }
      
      return post;
    }),
});
```

---

## API Routers

### Available Routers

The API package includes comprehensive routers for common use cases:

| Router | Purpose | Key Endpoints |
|--------|---------|---------------|
| **auth** | Authentication | `login`, `logout`, `register`, `session` |
| **user** | User management | `profile`, `update`, `delete` |
| **admin** | Admin operations | `users`, `analytics`, `settings` |
| **cms** | Content management | `pages`, `posts`, `categories` |
| **media** | Media handling | `upload`, `list`, `delete` |
| **post** | Blog/posts | `list`, `create`, `update`, `delete` |
| **storefront** | E-commerce | `products`, `cart`, `checkout` |
| **membership** | Subscriptions | `plans`, `subscribe`, `cancel` |
| **builder** | Page builder | `templates`, `save`, `publish` |
| **forms** | Form handling | `submit`, `list`, `responses` |
| **ai** | AI features | `chat`, `generate`, `analyze` |
| **analytics** | Analytics | `events`, `metrics`, `reports` |

### Router Structure

**File:** `trpc/routers/index.ts`

```typescript
import { router } from '../trpc';
import { userRouter } from './user';
import { postRouter } from './post';
// ... import other routers

export const appRouter = router({
  // Core
  auth: authRouter,
  user: userRouter,
  admin: adminRouter,
  
  // Content
  cms: cmsRouter,
  media: mediaRouter,
  post: postRouter,
  
  // Business
  storefront: storefrontRouter,
  membership: membershipRouter,
  
  // Features
  builder: builderRouter,
  forms: formsRouter,
  ai: aiRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
```

### Using Routers in Client

```typescript
// Query example
const posts = await trpc.post.list.query({
  limit: 10,
  cursor: undefined,
});

// Mutation example
const newPost = await trpc.post.create.mutate({
  title: 'Hello World',
  content: 'This is my first post',
});

// With React Query (recommended)
import { useTRPCQuery, useTRPCMutation } from '@/lib/trpc-react';

function Posts() {
  const { data, isLoading } = useTRPCQuery(['post.list'], {
    limit: 10,
  });

  const createMutation = useTRPCMutation(['post.create']);

  const handleCreate = () => {
    createMutation.mutate({
      title: 'New Post',
      content: 'Content here',
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.items.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button onClick={handleCreate}>Create Post</button>
    </div>
  );
}
```

---

## AI Integration

### OpenAI Chat Streaming

**File:** `ai/chat.ts`

**Server-Side (Edge Function):**

```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export default async function handler(req: Request) {
  const { messages, model = 'gpt-4-turbo-preview' } = await req.json();

  const response = await openai.createChatCompletion({
    model,
    messages,
    temperature: 0.7,
    stream: true,
    max_tokens: 2000,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

**Client-Side Usage:**

```typescript
import { useChat } from 'ai/react';

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/ai/chat',
  });

  return (
    <div>
      <div className="messages">
        {messages.map(m => (
          <div key={m.id}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

**With Custom Configuration:**

```typescript
const { messages, sendMessage } = useChat({
  api: '/api/ai/chat',
  body: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.9,
    maxTokens: 4000,
  },
  onResponse: (response) => {
    console.log('AI responded:', response);
  },
  onFinish: (message) => {
    console.log('Finished:', message);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});
```

### AI Router Integration

```typescript
// In trpc/routers/ai.ts
export const aiRouter = router({
  chat: protectedProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })),
      model: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Stream to client
      return await streamOpenAI(input);
    }),

  generate: protectedProcedure
    .input(z.object({
      prompt: z.string(),
      type: z.enum(['text', 'code', 'image']),
    }))
    .mutation(async ({ input }) => {
      // Generate content based on type
      return await generateContent(input);
    }),
});
```

---

## Edge Functions

### Edge Runtime Configuration

**File:** `edge/runtime.ts`

```typescript
export const edgeConfig = {
  runtime: 'edge',
  regions: ['iad1'], // US East (close to OpenAI)
  maxDuration: 30, // 30 seconds max
};

export async function runEdgeFunction(
  handler: (req: Request) => Promise<Response>,
  req: Request
) {
  try {
    return await handler(req);
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

### Creating Edge Functions

```typescript
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // Your edge function logic
  const data = await req.json();
  
  // Fast processing
  const result = processData(data);
  
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}
```

---

## Authentication

### Protected Procedures

```typescript
import { TRPCError } from '@trpc/server';

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

export const protectedProcedure = t.procedure.use(isAuthed);
```

### Role-Based Access

```typescript
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.userId || ctx.session?.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  
  return next({ ctx });
});

export const adminProcedure = t.procedure.use(isAdmin);
```

### Usage in Routers

```typescript
export const adminRouter = router({
  users: adminProcedure
    .query(async () => {
      return await db.user.findMany();
    }),

  deleteUser: adminProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await db.user.delete({ where: { id: input } });
    }),
});
```

---

## Best Practices

### ✅ DO: Use Input Validation

```typescript
import { z } from 'zod';

export const postRouter = router({
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1),
      tags: z.array(z.string()).max(10),
    }))
    .mutation(async ({ input }) => {
      // Input is validated and type-safe
      return await createPost(input);
    }),
});
```

### ✅ DO: Handle Errors Properly

```typescript
import { TRPCError } from '@trpc/server';

byId: publicProcedure
  .input(z.string())
  .query(async ({ input }) => {
    const item = await db.item.findUnique({
      where: { id: input },
    });
    
    if (!item) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Item ${input} not found`,
      });
    }
    
    return item;
  }),
```

### ✅ DO: Use Pagination

```typescript
list: publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(10),
    cursor: z.string().optional(),
  }))
  .query(async ({ input }) => {
    const items = await db.item.findMany({
      take: input.limit + 1,
      cursor: input.cursor ? { id: input.cursor } : undefined,
    });
    
    return {
      items: items.slice(0, input.limit),
      nextCursor: items.length > input.limit 
        ? items[input.limit].id 
        : undefined,
    };
  }),
```

### ❌ DON'T: Expose Sensitive Data

```typescript
// Bad
user: publicProcedure
  .query(async ({ ctx }) => {
    return await db.user.findUnique({
      where: { id: ctx.userId },
      // Including password hash!
    });
  }),

// Good
user: protectedProcedure
  .query(async ({ ctx }) => {
    return await db.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        name: true,
        email: true,
        // No password field
      },
    });
  }),
```

### ✅ DO: Use Middleware for Common Logic

```typescript
const withRateLimit = t.middleware(async ({ ctx, next }) => {
  await checkRateLimit(ctx.userId);
  return next();
});

export const rateLimitedProcedure = t.procedure.use(withRateLimit);
```

---

## Testing

### Unit Testing Procedures

```typescript
import { appRouter } from '@katalyst/api';

describe('Post Router', () => {
  it('should create a post', async () => {
    const caller = appRouter.createCaller({
      userId: 'test-user-id',
      session: mockSession,
    });

    const post = await caller.post.create({
      title: 'Test Post',
      content: 'Test content',
    });

    expect(post.title).toBe('Test Post');
  });
});
```

### Integration Testing

```typescript
import { createTRPCClient } from '@trpc/client';

const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:3000/api/trpc',
});

test('end-to-end post creation', async () => {
  const post = await client.post.create.mutate({
    title: 'E2E Test',
    content: 'Testing...',
  });

  expect(post.id).toBeDefined();
});
```

---

## Troubleshooting

### Error: "UNAUTHORIZED"

**Solution:** Ensure auth context is properly set up:

```typescript
export async function createContext(opts) {
  const session = await getSession(opts.req);
  return {
    userId: session?.user?.id,
    session,
  };
}
```

### Error: Type errors in client

**Solution:** Regenerate types:

```bash
npm run build
# Types are automatically exported from AppRouter
```

### Slow API responses

**Solution:** Use edge runtime for faster responses:

```typescript
export const config = {
  runtime: 'edge',
};
```

---

## Related Packages

- [`@katalyst/core`](../core/USAGE_GUIDE.md) - Core framework
- [`@katalyst/hooks`](../hooks/USAGE_GUIDE.md) - React hooks for API
- [`@katalyst/integrations`](../integrations/USAGE_GUIDE.md) - Framework integrations

---

## API Reference

Complete router documentation:
- [Auth Router](./src/trpc/routers/auth.ts.md)
- [User Router](./src/trpc/routers/user.ts.md)
- [CMS Router](./src/trpc/routers/cms.ts.md)
- [AI Router](./src/trpc/routers/ai.ts.md)
- [All Routers](./src/trpc/routers/README.md)

---

*Last Updated: 2025-10-02*  
*Package Version: 1.0.0*
