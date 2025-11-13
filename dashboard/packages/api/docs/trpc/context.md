# tRPC Context

## Overview

The `context.ts` file is responsible for creating and managing the request context for all tRPC procedures. It provides essential information about the current request, including user authentication state, database connections, and other shared resources that procedures need to access.

## Features

- **Request Context Creation**: Creates context objects for each tRPC request
- **Authentication Integration**: Integrates with authentication providers (NextAuth, etc.)
- **Database Access**: Provides database connections and models
- **Session Management**: Handles user session state and persistence
- **Resource Sharing**: Shares common resources across procedures
- **Type Safety**: Ensures type-safe context usage throughout the API

## Usage

### Basic Context Setup

```typescript
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { prisma } from '../lib/prisma';

export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession(opts.req);
  
  return {
    req: opts.req,
    res: opts.res,
    session,
    user: session?.user || null,
    prisma,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
```

### Advanced Context with Multiple Services

```typescript
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { stripe } from '../lib/stripe';
import { emailService } from '../lib/email';
import { fileStorage } from '../lib/storage';
import { logger } from '../lib/logger';

export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession(opts.req);
  
  // Get user with permissions
  let user = null;
  let permissions = [];
  
  if (session?.user?.id) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            permissions: true
          }
        },
        organization: true
      }
    });
    
    permissions = user?.roles.flatMap(role => 
      role.permissions.map(p => p.name)
    ) || [];
  }

  // Extract request metadata
  const requestIp = getRequestIP(opts.req);
  const userAgent = opts.req.headers['user-agent'];
  const requestId = generateRequestId();

  // Create context with all services
  return {
    // Request/Response
    req: opts.req,
    res: opts.res,
    
    // Authentication & Authorization
    session,
    user: user || null,
    permissions,
    isAdmin: user?.roles.some(role => role.name === 'admin') || false,
    
    // Database & Storage
    prisma,
    redis,
    storage: fileStorage,
    
    // External Services
    stripe,
    email: emailService,
    
    // Request Metadata
    requestIp,
    userAgent,
    requestId,
    
    // Utilities
    logger,
    
    // Methods
    hasPermission: (permission: string) => permissions.includes(permission),
    hasRole: (role: string) => user?.roles.some(r => r.name === role) || false,
    
    // Rate limiting context
    rateLimitKey: `rate-limit:${requestIp}:${user?.id || 'anonymous'}`,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

// Helper functions
function getRequestIP(req: any): string {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'unknown';
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

## Context Structure

### Core Properties

```typescript
interface Context {
  // HTTP Objects
  req: Request;
  res: Response;
  
  // Authentication
  session: Session | null;
  user: User | null;
  permissions: string[];
  isAdmin: boolean;
  
  // Services
  prisma: PrismaClient;
  redis: RedisClient;
  storage: FileStorage;
  stripe: Stripe;
  email: EmailService;
  logger: Logger;
  
  // Request Metadata
  requestIp: string;
  userAgent: string;
  requestId: string;
  
  // Helper Methods
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  rateLimitKey: string;
}
```

### User Object Structure

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  roles: Array<{
    id: string;
    name: string;
    permissions: Array<{
      id: string;
      name: string;
    }>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

## Integration Examples

### tRPC Router Usage

```typescript
// trpc/routers/auth.ts
import { t } from '../trpc';
import type { Context } from '../context';

export const authRouter = t.router({
  me: t.procedure.query(({ ctx }: { ctx: Context }) => {
    if (!ctx.user) {
      throw new Error('Not authenticated');
    }
    return ctx.user;
  }),

  hasPermission: t.procedure
    .input(z.object({
      permission: z.string(),
    }))
    .query(({ input, ctx }: { input: { permission: string }, ctx: Context }) => {
      return {
        hasPermission: ctx.hasPermission(input.permission),
        user: ctx.user,
      };
    }),

  adminOnly: t.procedure
    .use(({ ctx, next }) => {
      if (!ctx.isAdmin) {
        throw new Error('Admin access required');
      }
      return next({ ctx });
    })
    .query(({ ctx }: { ctx: Context }) => {
      return { message: 'Admin access granted' };
    }),
});
```

### Database Operations

```typescript
// trpc/routers/cms.ts
import { t } from '../trpc';
import type { Context } from '../context';

export const cmsRouter = t.router({
  createPost: t.procedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      published: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }: { input: CreatePostInput, ctx: Context }) => {
      if (!ctx.user) {
        throw new Error('Authentication required');
      }

      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          authorId: ctx.user.id,
          organizationId: ctx.user.organization?.id,
        },
      });

      // Log activity
      await ctx.logger.info('Post created', {
        postId: post.id,
        userId: ctx.user.id,
        requestId: ctx.requestId,
      });

      return post;
    }),

  getPosts: t.procedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      published: z.boolean().default(true),
    }))
    .query(async ({ input, ctx }: { input: GetPostsInput, ctx: Context }) => {
      const cacheKey = `posts:${JSON.stringify(input)}`;
      
      // Try to get from cache first
      const cached = await ctx.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Query database
      const posts = await ctx.prisma.post.findMany({
        where: {
          published: input.published,
          organizationId: ctx.user?.organization?.id,
        },
        orderBy: { createdAt: 'desc' },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      const total = await ctx.prisma.post.count({
        where: {
          published: input.published,
          organizationId: ctx.user?.organization?.id,
        },
      });

      const result = {
        posts,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };

      // Cache for 5 minutes
      await ctx.redis.setex(cacheKey, 300, JSON.stringify(result));

      return result;
    }),
});
```

### Email Service Integration

```typescript
// trpc/routers/forms.ts
import { t } from '../trpc';
import type { Context } from '../context';

export const formsRouter = t.router({
  submitForm: t.procedure
    .input(z.object({
      formId: z.string(),
      data: z.record(z.any()),
    }))
    .mutation(async ({ input, ctx }: { input: SubmitFormInput, ctx: Context }) => {
      // Log form submission
      await ctx.logger.info('Form submitted', {
        formId: input.formId,
        requestId: ctx.requestId,
        requestIp: ctx.requestIp,
        userAgent: ctx.userAgent,
      });

      // Save to database
      const submission = await ctx.prisma.formSubmission.create({
        data: {
          formId: input.formId,
          data: input.data,
          userId: ctx.user?.id,
          requestIp: ctx.requestIp,
          userAgent: ctx.userAgent,
        },
      });

      // Send notification email if configured
      const form = await ctx.prisma.form.findUnique({
        where: { id: input.formId },
        include: { notificationEmails: true },
      });

      if (form?.notificationEmails?.length) {
        await ctx.email.send({
          to: form.notificationEmails,
          subject: `New form submission: ${form.name}`,
          template: 'form-submission',
          data: {
            form: form.name,
            submission: input.data,
            user: ctx.user,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return { success: true, submissionId: submission.id };
    }),
});
```

## Advanced Features

### Rate Limiting Integration

```typescript
// Enhanced context with rate limiting
export async function createContext(opts: CreateNextContextOptions) {
  // ... previous context setup ...

  const rateLimitKey = `rate-limit:${requestIp}:${user?.id || 'anonymous'}`;
  
  // Check rate limit
  const current = await redis.incr(rateLimitKey);
  
  if (current === 1) {
    await redis.expire(rateLimitKey, 60); // 1 minute window
  }

  const rateLimit = {
    current,
    limit: user ? 100 : 20, // Authenticated users get higher limits
    remaining: Math.max(0, (user ? 100 : 20) - current),
    resetTime: await redis.ttl(rateLimitKey),
  };

  return {
    // ... previous context properties
    rateLimit,
    rateLimitKey,
  };
}

// Usage in procedures
export const rateLimitedProcedure = t.procedure
  .use(({ ctx, next }) => {
    if (ctx.rateLimit.remaining <= 0) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Try again in ${ctx.rateLimit.resetTime} seconds.`,
      });
    }
    return next({ ctx });
  });
```

### Multi-tenant Support

```typescript
// Context with organization/tenant support
export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession(opts.req);
  
  // Get organization from subdomain or header
  const subdomain = getSubdomain(opts.req.headers.host);
  const orgHeader = opts.req.headers['x-organization'];
  
  let organization = null;
  
  if (session?.user?.organizationId) {
    organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
    });
  } else if (subdomain) {
    organization = await prisma.organization.findUnique({
      where: { slug: subdomain },
    });
  } else if (orgHeader) {
    organization = await prisma.organization.findUnique({
      where: { slug: orgHeader },
    });
  }

  return {
    // ... other context properties
    organization,
    tenant: organization,
    isTenantContext: !!organization,
  };
}

// Usage in procedures
export const tenantProcedure = t.procedure
  .use(({ ctx, next }) => {
    if (!ctx.organization) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Organization context required',
      });
    }
    return next({ ctx });
  });
```

## Best Practices

### 1. Context Size Optimization

- **Minimize Context Size**: Only include necessary data in context
- **Lazy Loading**: Load data only when needed
- **Caching**: Cache frequently accessed data
- **Connection Pooling**: Reuse database connections

### 2. Security

- **Input Validation**: Validate all inputs from requests
- **Sanitization**: Sanitize user data before storing
- **Permission Checks**: Always check permissions before operations
- **Audit Logging**: Log all important operations

### 3. Performance

- **Connection Management**: Manage database connections efficiently
- **Caching Strategy**: Implement appropriate caching
- **Async Operations**: Use async/await properly
- **Error Handling**: Handle errors gracefully

### 4. Development

- **Type Safety**: Use TypeScript for all context properties
- **Consistent Naming**: Use consistent naming conventions
- **Documentation**: Document all context properties and methods
- **Testing**: Write tests for context creation and usage

## Error Handling

```typescript
// Robust context creation with error handling
export async function createContext(opts: CreateNextContextOptions) {
  try {
    const session = await getSession(opts.req).catch(() => null);
    
    // Validate session
    if (session && !session.user?.id) {
      logger.warn('Invalid session structure', { session });
      session = null;
    }

    // Initialize services
    let prisma: PrismaClient;
    try {
      prisma = getPrismaClient();
    } catch (error) {
      logger.error('Failed to initialize database connection', error);
      throw new Error('Database connection failed');
    }

    let redis: RedisClient;
    try {
      redis = getRedisClient();
    } catch (error) {
      logger.warn('Redis connection failed, proceeding without cache', error);
      redis = null;
    }

    return {
      req: opts.req,
      res: opts.res,
      session,
      user: session?.user || null,
      prisma,
      redis,
      // ... other properties
    };

  } catch (error) {
    logger.error('Context creation failed', error);
    throw new Error('Failed to create request context');
  }
}
```

This comprehensive context setup provides a solid foundation for building type-safe, secure, and performant tRPC APIs with the Katalyst framework.
