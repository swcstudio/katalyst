# tRPC Configuration

## Overview

The `trpc.ts` file is the core configuration file for the tRPC API layer. It initializes tRPC, sets up middleware, defines error handling, and provides the foundation for all API procedures in the Katalyst framework.

## Features

- **tRPC Initialization**: Configures the tRPC instance with custom settings
- **Middleware Pipeline**: Sets up authentication, logging, and validation middleware
- **Error Handling**: Custom error formatting and handling
- **Type Safety**: Ensures end-to-end type safety across the API
- **Performance Optimization**: Configures transformers and optimizers
- **Security**: Implements security middleware and validation

## Usage

### Basic tRPC Setup

```typescript
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});
```

### Advanced tRPC Configuration

```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { Context } from './context';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error, type }) {
    // Custom error formatting
    const formattedError = {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };

    // Add request context to errors in development
    if (process.env.NODE_ENV === 'development') {
      formattedError.data.context = {
        timestamp: new Date().toISOString(),
        type,
      };
    }

    return formattedError;
  },
  // Default error handling
  defaultMeta: {
    // Global metadata for all procedures
  },
  // Allow external access to meta
  allowOutsideOfServer: true,
});
```

## Middleware Setup

### Authentication Middleware

```typescript
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});
```

### Role-based Middleware

```typescript
const hasRole = (role: string) => t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  const hasRequiredRole = ctx.hasRole(role);
  if (!hasRequiredRole) {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: `Requires ${role} role`,
    });
  }
  
  return next({ ctx });
});

const isAdmin = t.middleware(({ next, ctx }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
  return next({ ctx });
});
```

### Rate Limiting Middleware

```typescript
const rateLimit = t.middleware(async ({ next, ctx }) => {
  const rateLimitKey = ctx.rateLimitKey;
  
  if (!ctx.redis) {
    // Redis not available, skip rate limiting
    return next({ ctx });
  }

  const current = await ctx.redis.incr(rateLimitKey);
  
  if (current === 1) {
    await ctx.redis.expire(rateLimitKey, 60); // 1 minute window
  }

  const limit = ctx.user ? 100 : 20; // Authenticated users get higher limits
  
  if (current > limit) {
    const ttl = await ctx.redis.ttl(rateLimitKey);
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Try again in ${ttl} seconds.`,
      cause: {
        current,
        limit,
        resetTime: ttl,
      },
    });
  }

  return next({
    ctx: {
      ...ctx,
      rateLimit: {
        current,
        limit,
        remaining: Math.max(0, limit - current),
        resetTime: await ctx.redis.ttl(rateLimitKey),
      },
    },
  });
});
```

### Logging Middleware

```typescript
const logging = t.middleware(async ({ next, ctx, type, path }) => {
  const start = Date.now();
  
  ctx.logger.info('tRPC request started', {
    path,
    type,
    userId: ctx.user?.id,
    requestId: ctx.requestId,
    requestIp: ctx.requestIp,
  });

  try {
    const result = await next({ ctx });
    
    const duration = Date.now() - start;
    ctx.logger.info('tRPC request completed', {
      path,
      type,
      duration,
      userId: ctx.user?.id,
      requestId: ctx.requestId,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    ctx.logger.error('tRPC request failed', {
      path,
      type,
      duration,
      error: error.message,
      userId: ctx.user?.id,
      requestId: ctx.requestId,
    });
    
    throw error;
  }
});
```

### CORS Middleware

```typescript
const cors = t.middleware(({ next, ctx }) => {
  // Set CORS headers
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const origin = ctx.req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    ctx.res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  ctx.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  ctx.res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  return next({ ctx });
});
```

## Procedure Types

### Public Procedures

```typescript
export const publicProcedure = t.procedure.use(cors).use(logging);
```

### Protected Procedures

```typescript
export const protectedProcedure = t.procedure
  .use(cors)
  .use(logging)
  .use(rateLimit)
  .use(isAuthed);
```

### Admin Procedures

```typescript
export const adminProcedure = t.procedure
  .use(cors)
  .use(logging)
  .use(rateLimit)
  .use(isAuthed)
  .use(isAdmin);
```

### Role-based Procedures

```typescript
export const createRoleProcedure = (role: string) => t.procedure
  .use(cors)
  .use(logging)
  .use(rateLimit)
  .use(isAuthed)
  .use(hasRole(role));
```

## Error Handling

### Custom Error Types

```typescript
export class KatalystError extends TRPCError {
  constructor(
    code: TRPCError['code'],
    message: string,
    public metadata?: Record<string, any>
  ) {
    super({ code, message, cause: metadata });
  }
}

export class ValidationError extends KatalystError {
  constructor(message: string, public validationErrors: any[]) {
    super('BAD_REQUEST', message, { validationErrors });
  }
}

export class NotFoundError extends KatalystError {
  constructor(resource: string, id?: string) {
    super('NOT_FOUND', `${resource}${id ? ` with ID ${id}` : ''} not found`, { resource, id });
  }
}

export class PermissionError extends KatalystError {
  constructor(permission: string) {
    super('FORBIDDEN', `Insufficient permissions. Required: ${permission}`, { permission });
  }
}
```

### Error Utilities

```typescript
export const handlePrismaError = (error: any) => {
  if (error.code === 'P2002') {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Resource already exists',
      cause: { field: error.meta?.target },
    });
  }
  
  if (error.code === 'P2025') {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Resource not found',
    });
  }
  
  throw error;
};

export const validateInput = (schema: z.ZodSchema, data: any) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError('Invalid input', error.errors);
    }
    throw error;
  }
};
```

## Transformers

### Custom Transformer Configuration

```typescript
import superjson from 'superjson';
import { DateTime } from 'luxon';

export const transformer = superjson
  .custom<Date, string>({
    serialize: (date) => date.toISOString(),
    deserialize: (str) => new Date(str),
  })
  .custom<DateTime, string>({
    serialize: (dateTime) => dateTime.toISO(),
    deserialize: (str) => DateTime.fromISO(str),
  })
  .custom<BigInt, string>({
    serialize: (bigint) => bigint.toString(),
    deserialize: (str) => BigInt(str),
  })
  .custom<Buffer, string>({
    serialize: (buffer) => buffer.toString('base64'),
    deserialize: (str) => Buffer.from(str, 'base64'),
  });
```

## Performance Monitoring

### Metrics Middleware

```typescript
const metrics = t.middleware(async ({ next, ctx, type, path }) => {
  const start = performance.now();
  
  try {
    const result = await next({ ctx });
    
    const duration = performance.now() - start;
    
    // Record metrics
    if (ctx.metrics) {
      ctx.metrics.record({
        path,
        type,
        duration,
        success: true,
        userId: ctx.user?.id,
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    // Record error metrics
    if (ctx.metrics) {
      ctx.metrics.record({
        path,
        type,
        duration,
        success: false,
        error: error.message,
        userId: ctx.user?.id,
      });
    }
    
    throw error;
  }
});
```

### Cache Middleware

```typescript
const cache = (ttl: number = 300) => t.middleware(async ({ next, ctx, type, path, input }) => {
  // Only cache queries
  if (type !== 'query') {
    return next({ ctx });
  }

  if (!ctx.redis) {
    return next({ ctx });
  }

  const cacheKey = `trpc:${path}:${JSON.stringify(input)}`;
  
  // Try to get from cache
  const cached = await ctx.redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Execute procedure
  const result = await next({ ctx });
  
  // Cache the result
  await ctx.redis.setex(cacheKey, ttl, JSON.stringify(result));
  
  return result;
});
```

## Configuration Examples

### Development Configuration

```typescript
export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape, error }) {
    // Detailed error formatting for development
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    };
  },
});
```

### Production Configuration

```typescript
export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape, error }) {
    // Minimal error information for production
    const formattedError = {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };

    // Remove sensitive information
    if (shape.code === 'INTERNAL_SERVER_ERROR') {
      formattedError.message = 'An internal error occurred';
      delete formattedError.data.stack;
    }

    return formattedError;
  },
  // Production optimizations
  allowOutsideOfServer: false,
});
```

## Testing Support

### Mock Context for Testing

```typescript
export const createMockContext = (overrides: Partial<Context> = {}): Context => ({
  req: {} as any,
  res: {} as any,
  session: null,
  user: null,
  permissions: [],
  isAdmin: false,
  prisma: mockPrisma,
  redis: mockRedis,
  storage: mockStorage,
  stripe: mockStripe,
  email: mockEmail,
  logger: mockLogger,
  requestIp: '127.0.0.1',
  userAgent: 'test-agent',
  requestId: 'test-request-id',
  hasPermission: () => false,
  hasRole: () => false,
  rateLimitKey: 'test-rate-limit',
  ...overrides,
});
```

### Test Procedures

```typescript
export const testProcedure = t.procedure
  .use(t.middleware(({ next, ctx }) => {
    // Skip authentication in tests
    return next({
      ctx: {
        ...ctx,
        user: createMockUser(),
      },
    });
  }))
  .query(() => {
    return { message: 'Test successful' };
  });
```

## Best Practices

### 1. Middleware Composition

- **Order Matters**: Place authentication before authorization
- **Performance**: Put lightweight middleware first
- **Error Handling**: Handle errors early in the pipeline
- **Logging**: Log at appropriate levels

### 2. Error Handling

- **Specific Errors**: Use specific error codes and messages
- **Security**: Don't expose sensitive information in errors
- **Logging**: Log errors with context for debugging
- **User Experience**: Provide helpful error messages

### 3. Performance

- **Caching**: Cache frequently accessed data
- **Rate Limiting**: Protect against abuse
- **Monitoring**: Track performance metrics
- **Optimization**: Optimize database queries

### 4. Security

- **Authentication**: Always verify user identity
- **Authorization**: Check permissions for sensitive operations
- **Input Validation**: Validate all inputs
- **Rate Limiting**: Prevent brute force attacks

This comprehensive tRPC configuration provides a robust foundation for building type-safe, secure, and performant APIs with the Katalyst framework.
