# tRPC Router Index

## Overview

The `index.ts` file serves as the central aggregation point for all tRPC routers in the Katalyst API. It combines individual domain routers (auth, CMS, storefront, AI, etc.) into a single, comprehensive router that can be used throughout the application.

## Features

- **Router Aggregation**: Combines all individual routers into a unified API
- **Type Export**: Exports the complete router type for client-side type safety
- **Modular Architecture**: Organizes routers by domain and functionality
- **Middleware Composition**: Applies global middleware across all routers
- **Development Helpers**: Provides utilities for development and testing

## Usage

### Basic Router Setup

```typescript
import { t } from '../trpc';
import { authRouter } from './auth';
import { cmsRouter } from './cms';
import { storefrontRouter } from './storefront';
import { aiRouter } from './ai';
import { analyticsRouter } from './analytics';
import { adminRouter } from './admin';

export const appRouter = t.router({
  auth: authRouter,
  cms: cmsRouter,
  storefront: storefrontRouter,
  ai: aiRouter,
  analytics: analyticsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
```

### Advanced Router Configuration

```typescript
import { t } from '../trpc';
import { authRouter } from './auth';
import { cmsRouter } from './cms';
import { storefrontRouter } from './storefront';
import { aiRouter } from './ai';
import { analyticsRouter } from './analytics';
import { formsRouter } from './forms';
import { mediaRouter } from './media';
import { membershipRouter } from './membership';
import { adminRouter } from './admin';
import { userRouter } from './user';
import { postRouter } from './post';

// Apply global middleware to all routers
const withGlobalMiddleware = t.procedure
  .use(logging)
  .use(cors)
  .use(rateLimit);

export const appRouter = t.router({
  // Core functionality
  auth: authRouter,
  user: userRouter,
  admin: adminRouter,
  
  // Content management
  cms: cmsRouter,
  post: postRouter,
  media: mediaRouter,
  
  // E-commerce
  storefront: storefrontRouter,
  membership: membershipRouter,
  
  // Interactive features
  forms: formsRouter,
  ai: aiRouter,
  
  // Analytics and monitoring
  analytics: analyticsRouter,
});

// Export type for client-side type safety
export type AppRouter = typeof appRouter;

// Development utilities
export const createRouter = t.router;
export const publicProcedure = withGlobalMiddleware;
export const protectedProcedure = withGlobalMiddleware.use(isAuthed);
export const adminProcedure = withGlobalMiddleware.use(isAuthed).use(isAdmin);
```

## Router Organization

### Core Routers

#### Authentication Router (`auth`)
Handles user authentication, registration, profile management, and session management.

```typescript
auth: {
  register: Mutation<RegisterInput, RegisterOutput>;
  login: Mutation<LoginInput, LoginOutput>;
  logout: Mutation<LogoutInput, LogoutOutput>;
  getProfile: Query<void, UserProfile>;
  updateProfile: Mutation<UpdateProfileInput, UserProfile>;
  changePassword: Mutation<ChangePasswordInput, SuccessResponse>;
  forgotPassword: Mutation<ForgotPasswordInput, SuccessResponse>;
  resetPassword: Mutation<ResetPasswordInput, SuccessResponse>;
}
```

#### CMS Router (`cms`)
Manages content creation, editing, and organization for blogs, pages, and articles.

```typescript
cms: {
  getPosts: Query<GetPostsInput, PaginatedPosts>;
  createPost: Mutation<CreatePostInput, Post>;
  updatePost: Mutation<UpdatePostInput, Post>;
  deletePost: Mutation<DeletePostInput, SuccessResponse>;
  getCategories: Query<void, Category[]>;
  createCategory: Mutation<CreateCategoryInput, Category>;
  getMedia: Query<GetMediaInput, PaginatedMedia>;
  uploadMedia: Mutation<UploadMediaInput, Media>;
}
```

#### Storefront Router (`storefront`)
Provides e-commerce functionality including products, orders, and cart management.

```typescript
storefront: {
  getProducts: Query<GetProductsInput, PaginatedProducts>;
  getProduct: Query<GetProductInput, Product>;
  createProduct: Mutation<CreateProductInput, Product>;
  updateProduct: Mutation<UpdateProductInput, Product>;
  getCart: Query<void, Cart>;
  addToCart: Mutation<AddToCartInput, Cart>;
  removeFromCart: Mutation<RemoveFromCartInput, Cart>;
  createOrder: Mutation<CreateOrderInput, Order>;
  getOrders: Query<GetOrdersInput, PaginatedOrders>;
}
```

### Feature Routers

#### AI Router (`ai`)
Integrates AI services for content generation, analysis, and chat functionality.

```typescript
ai: {
  chat: Mutation<ChatInput, ChatResponse>;
  generateContent: Mutation<GenerateContentInput, GeneratedContent>;
  analyzeContent: Mutation<AnalyzeContentInput, ContentAnalysis>;
  getConversations: Query<GetConversationsInput, PaginatedConversations>;
  createConversation: Mutation<CreateConversationInput, Conversation>;
}
```

#### Forms Router (`forms`)
Handles dynamic form creation, submission, and management.

```typescript
forms: {
  getForms: Query<void, Form[]>;
  createForm: Mutation<CreateFormInput, Form>;
  updateForm: Mutation<UpdateFormInput, Form>;
  submitForm: Mutation<SubmitFormInput, FormSubmission>;
  getSubmissions: Query<GetSubmissionsInput, PaginatedSubmissions>;
  exportSubmissions: Mutation<ExportSubmissionsInput, ExportData>;
}
```

#### Analytics Router (`analytics`)
Provides usage analytics, metrics, and reporting functionality.

```typescript
analytics: {
  getMetrics: Query<GetMetricsInput, AnalyticsMetrics>;
  trackEvent: Mutation<TrackEventInput, SuccessResponse>;
  getReports: Query<GetReportsInput, Report[]>;
  generateReport: Mutation<GenerateReportInput, Report>;
  exportData: Mutation<ExportDataInput, ExportData>;
}
```

## Middleware Integration

### Global Middleware Application

```typescript
import { t } from '../trpc';

// Define global middleware
const globalMiddleware = t.middleware(({ next, ctx }) => {
  // Apply logging
  ctx.logger.info('API request', {
    path: ctx.path,
    userId: ctx.user?.id,
    requestId: ctx.requestId,
  });

  return next({ ctx });
});

// Create base procedure with global middleware
export const baseProcedure = t.procedure.use(globalMiddleware);

// Enhanced procedures
export const publicProcedure = baseProcedure;
export const protectedProcedure = baseProcedure.use(isAuthed);
export const adminProcedure = baseProcedure.use(isAuthed).use(isAdmin);
```

### Router-Specific Middleware

```typescript
// Example: AI router with additional middleware
export const aiRouter = t.router({
  chat: protectedProcedure
    .input(z.object({
      message: z.string(),
      conversationId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // AI chat implementation
    }),
  
  generateContent: protectedProcedure
    .input(z.object({
      prompt: z.string(),
      type: z.enum(['blog-post', 'product-description', 'email']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Content generation implementation
    }),
});
```

## Client Integration

### React Query Integration

```typescript
// utils/trpc.ts
import { createReactQueryHooks } from '@trpc/react-query';
import type { AppRouter } from '../server/routers';

export const trpc = createReactQueryHooks<AppRouter>();

// Usage in components
import { trpc } from '../utils/trpc';

function UserProfile() {
  const { data: profile, isLoading } = trpc.auth.getProfile.useQuery();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>Welcome, {profile?.name}!</div>;
}
```

### Next.js Pages

```typescript
// pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers';
import { createContext } from '../../../server/context';

export default createNextApiHandler({
  router: appRouter,
  createContext,
});

// pages/dashboard.tsx
import { trpc } from '../utils/trpc';

export default function DashboardPage() {
  const { data: posts } = trpc.cms.getPosts.useQuery({
    page: 1,
    limit: 10,
  });

  const { data: analytics } = trpc.analytics.getMetrics.useQuery({
    timeframe: '7d',
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <PostList posts={posts?.items} />
      <AnalyticsOverview metrics={analytics} />
    </div>
  );
}
```

## Development Utilities

### Router Health Check

```typescript
// Add health check endpoint
export const healthRouter = t.router({
  check: t.procedure.query(async ({ ctx }) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
    };
  }),

  database: t.procedure.query(async ({ ctx }) => {
    try {
      await ctx.prisma.$queryRaw`SELECT 1`;
      return { status: 'connected' };
    } catch (error) {
      return { 
        status: 'disconnected', 
        error: error.message 
      };
    }
  }),

  redis: t.procedure.query(async ({ ctx }) => {
    try {
      await ctx.redis?.ping();
      return { status: 'connected' };
    } catch (error) {
      return { 
        status: 'disconnected', 
        error: error.message 
      };
    }
  }),
});

// Include in main router
export const appRouter = t.router({
  // ... other routers
  health: healthRouter,
});
```

### Testing Utilities

```typescript
// Test utilities for routers
export const createTestContext = (overrides: Partial<Context> = {}): Context => ({
  req: {} as any,
  res: {} as any,
  session: null,
  user: createMockUser(),
  permissions: [],
  isAdmin: false,
  prisma: mockPrisma,
  redis: mockRedis,
  // ... other mock properties
  ...overrides,
});

export const testProcedure = t.procedure
  .use(t.middleware(({ next, ctx }) => {
    return next({
      ctx: createTestContext(),
    });
  }));
```

## Performance Optimization

### Router Lazy Loading

```typescript
// Lazy load heavy routers
export const createAppRouter = () => {
  return t.router({
    // Always loaded
    auth: authRouter,
    health: healthRouter,
    
    // Conditionally loaded based on environment
    ...(process.env.NODE_ENV === 'development' && {
      debug: debugRouter,
    }),
    
    // Eagerly loaded core routers
    cms: cmsRouter,
    ai: aiRouter,
    
    // Lazy loaded specialized routers
    ...(shouldLoadEcommerce() && {
      storefront: storefrontRouter,
      membership: membershipRouter,
    }),
  });
};

function shouldLoadEcommerce() {
  return process.env.FEATURE_ECOMMERCE === 'true';
}
```

### Router Caching

```typescript
// Add caching to router
export const createCachedRouter = <TRouter extends AnyRouter>(
  router: TRouter,
  cacheOptions: CacheOptions
) => {
  return t.router({
    ...router._def.procedures,
    
    // Add cache wrapper procedures
    ...Object.fromEntries(
      Object.entries(router._def.procedures).map(([key, procedure]) => [
        key,
        t.procedure
          .input(procedure._def.input)
          .query(async ({ input, ctx }) => {
            const cacheKey = `${key}:${JSON.stringify(input)}`;
            
            // Try cache first
            const cached = await ctx.redis?.get(cacheKey);
            if (cached) {
              return JSON.parse(cached);
            }
            
            // Execute procedure
            const result = await procedure({ input, ctx });
            
            // Cache result
            await ctx.redis?.setex(
              cacheKey, 
              cacheOptions.ttl, 
              JSON.stringify(result)
            );
            
            return result;
          }),
      ])
    ),
  });
};
```

## Best Practices

### 1. Router Organization

- **Domain Separation**: Group related procedures into logical routers
- **Consistent Naming**: Use consistent naming conventions across routers
- **Clear Responsibilities**: Each router should have a clear, single responsibility
- **Logical Grouping**: Group routers in a logical hierarchy

### 2. Type Safety

- **Export Types**: Always export router types for client-side type safety
- **Input Validation**: Use Zod schemas for all inputs
- **Output Consistency**: Maintain consistent output structures
- **Error Types**: Use specific error types for different scenarios

### 3. Performance

- **Middleware Ordering**: Place lightweight middleware first
- **Caching Strategy**: Implement appropriate caching for read operations
- **Database Optimization**: Optimize database queries within procedures
- **Lazy Loading**: Load complex routers only when needed

### 4. Security

- **Authentication**: Apply authentication middleware to protected procedures
- **Authorization**: Implement role-based access control
- **Input Validation**: Validate all inputs with Zod schemas
- **Rate Limiting**: Apply rate limiting to prevent abuse

This router index provides a comprehensive foundation for organizing and managing all API routes in the Katalyst framework with excellent type safety and developer experience.
