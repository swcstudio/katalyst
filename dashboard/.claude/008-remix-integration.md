# Remix Integration

## Overview

Katalyst-Remix serves as the admin dashboard and data management layer of the Katalyst ecosystem. Built on Remix v2 with React 19, it provides a full-stack framework for building performant administrative interfaces with server-side rendering, data loading, and mutations. This integration is specifically designed for internal tools, admin panels, and data-heavy applications.

## Key Features

### 1. Full-Stack React Framework
- Server-side rendering with streaming
- Nested routing with data loading
- Form handling with progressive enhancement
- Error boundaries at route level
- Built-in session management

### 2. Admin Dashboard Components
- Data tables with sorting/filtering
- Analytics visualizations
- User management interfaces
- Real-time activity feeds
- Role-based access control

### 3. Data Management
- TanStack Table for complex data grids
- TanStack Query for data fetching
- Optimistic UI updates
- Background data synchronization
- Export capabilities

### 4. Performance Optimizations
- Automatic code splitting
- Resource prefetching
- Parallel data loading
- Incremental static regeneration
- Edge runtime support

## Architecture

### Project Structure
```
remix/
├── app/
│   ├── components/          # UI components
│   │   ├── AdminDashboard.tsx
│   │   ├── Analytics.tsx
│   │   └── DataTable.tsx
│   ├── routes/              # Route modules
│   │   ├── _index.tsx       # Home route
│   │   ├── dashboard.tsx    # Dashboard route
│   │   ├── users/           # User management
│   │   └── api/             # API routes
│   ├── styles/              # Global styles
│   ├── utils/               # Utilities
│   ├── entry.client.tsx     # Client entry
│   ├── entry.server.tsx     # Server entry
│   └── root.tsx             # Root component
├── public/                  # Static assets
├── remix.config.ts          # Remix configuration
├── rsbuild.config.ts        # Build configuration
└── package.json
```

### Component Architecture
```typescript
// Admin dashboard with module federation ready
export const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1>Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Users" value="1,234" />
        <MetricCard title="Revenue" value="$45,678" />
        <MetricCard title="Active Orders" value="89" />
      </div>
      <Analytics />
      <DataTable />
    </div>
  );
};
```

## Getting Started

### Installation
```bash
# Navigate to Remix app
cd remix

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev

# Or with Deno
deno task dev
```

### Environment Variables
```env
# .env
SESSION_SECRET=your-session-secret
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379
API_KEY=your-api-key
NODE_ENV=development
```

## Core Features

### 1. Route-Based Data Loading

```typescript
// app/routes/users.tsx
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  return json({ users });
}

export default function UsersRoute() {
  const { users } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>User Management</h1>
      <DataTable data={users} columns={userColumns} />
    </div>
  );
}
```

### 2. Server Actions

```typescript
// app/routes/users.$id.tsx
import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'update':
      await db.user.update({
        where: { id: params.id },
        data: {
          name: formData.get('name'),
          email: formData.get('email'),
          role: formData.get('role'),
        },
      });
      break;
      
    case 'delete':
      await db.user.delete({
        where: { id: params.id },
      });
      return redirect('/users');
  }

  return json({ success: true });
}
```

### 3. Data Table Component

```typescript
import { 
  useReactTable, 
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

export function DataTable({ data, columns }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: filtering, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <SearchInput value={filtering} onChange={setFiltering} />
      <Table>
        <TableHeader table={table} />
        <TableBody table={table} />
      </Table>
      <Pagination table={table} />
    </div>
  );
}
```

### 4. Analytics Dashboard

```typescript
// app/components/Analytics.tsx
import { BarChart, LineChart } from '@/components/charts';
import { useQuery } from '@tanstack/react-query';

export function Analytics() {
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Revenue Trends">
        <LineChart data={analytics?.revenue} />
      </Card>
      
      <Card title="User Activity">
        <BarChart data={analytics?.activity} />
      </Card>
      
      <Card title="Top Products">
        <ProductList products={analytics?.topProducts} />
      </Card>
      
      <Card title="Recent Orders">
        <OrderFeed orders={analytics?.recentOrders} />
      </Card>
    </div>
  );
}
```

### 5. Real-Time Features

```typescript
// app/hooks/use-real-time.ts
import { useEventSource } from 'remix-utils/sse/react';

export function useRealTimeUpdates(channel: string) {
  const data = useEventSource(`/api/sse/${channel}`);
  
  return useMemo(() => {
    if (!data) return null;
    return JSON.parse(data);
  }, [data]);
}

// Usage in component
function LiveDashboard() {
  const updates = useRealTimeUpdates('dashboard');
  
  return (
    <div>
      {updates && (
        <Alert>New activity: {updates.message}</Alert>
      )}
    </div>
  );
}
```

## Integration with Katalyst

### 1. Using Shared Components

```typescript
// When Module Federation is enabled
import { Button, Card } from '@katalyst/shared/components';
import { useMultithreading } from '@katalyst/shared/hooks';

export default function Dashboard() {
  const { parallelMap } = useMultithreading();
  
  const processData = async () => {
    const results = await parallelMap(
      largeDataset,
      (item) => transformItem(item)
    );
    return results;
  };

  return (
    <Card>
      <Button onClick={processData}>Process Data</Button>
    </Card>
  );
}
```

### 2. Module Federation Setup

```typescript
// rsbuild.config.ts
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  plugins: [
    new ModuleFederationPlugin({
      name: 'katalyst_remix',
      exposes: {
        './AdminDashboard': './app/components/AdminDashboard.tsx',
        './DataTable': './app/components/DataTable.tsx',
        './Analytics': './app/components/Analytics.tsx',
      },
      remotes: {
        katalyst_core: 'katalyst_core@http://localhost:20007/remoteEntry.js',
        katalyst_next: 'katalyst_next@http://localhost:20009/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        '@katalyst/shared': { singleton: true },
      },
    }),
  ],
});
```

### 3. Authentication & Authorization

```typescript
// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';

export const authenticator = new Authenticator(sessionStorage);

// app/routes/admin.tsx
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  if (user.role !== 'admin') {
    throw new Response('Unauthorized', { status: 403 });
  }

  return json({ user });
}
```

### 4. Database Integration

```typescript
// app/models/user.server.ts
import { prisma } from '@/lib/prisma';

export async function getUsers({ 
  page = 1, 
  limit = 10, 
  search = '' 
}) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, pages: Math.ceil(total / limit) };
}
```

## Advanced Features

### 1. Background Jobs

```typescript
// app/queues/analytics.server.ts
import { Queue } from 'bull';

export const analyticsQueue = new Queue('analytics', {
  redis: process.env.REDIS_URL,
});

analyticsQueue.process(async (job) => {
  const { userId, event, data } = job.data;
  
  await processAnalyticsEvent({ userId, event, data });
  
  return { processed: true };
});

// Usage in route
export async function action({ request }: ActionFunctionArgs) {
  const { userId, event } = await request.json();
  
  await analyticsQueue.add({
    userId,
    event,
    data: { timestamp: Date.now() },
  });
  
  return json({ queued: true });
}
```

### 2. Export Functionality

```typescript
// app/routes/api.export.tsx
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { format } from '@fast-csv/format';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  
  if (type === 'users') {
    const users = await getUsers({ limit: -1 });
    const csvStream = format({ headers: true });
    
    return new Response(
      new ReadableStream({
        async start(controller) {
          for (const user of users) {
            controller.enqueue(csvStream.write(user));
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="users.csv"',
        },
      }
    );
  }
}
```

### 3. Websocket Support

```typescript
// app/routes/ws.tsx
export function loader() {
  return new Response(null, {
    status: 101,
    headers: {
      Upgrade: 'websocket',
      Connection: 'Upgrade',
    },
  });
}

// Client-side connection
function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => setSocket(ws);
    ws.onmessage = (event) => handleMessage(event.data);
    
    return () => ws.close();
  }, [url]);
  
  return socket;
}
```

## Performance Optimization

### 1. Resource Hints
```typescript
// app/root.tsx
export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://api.example.com' },
  { rel: 'dns-prefetch', href: 'https://cdn.example.com' },
  { rel: 'prefetch', href: '/static/critical.css' },
];

export const meta: MetaFunction = () => [
  { title: 'Katalyst Admin' },
  { name: 'description', content: 'Admin dashboard for Katalyst' },
];
```

### 2. Deferred Data Loading
```typescript
import { defer } from '@remix-run/node';
import { Await } from '@remix-run/react';

export async function loader() {
  const criticalData = await getCriticalData();
  const slowDataPromise = getSlowData();
  
  return defer({
    critical: criticalData,
    slow: slowDataPromise,
  });
}

export default function Route() {
  const { critical, slow } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>{critical.title}</h1>
      
      <Suspense fallback={<Skeleton />}>
        <Await resolve={slow}>
          {(data) => <SlowComponent data={data} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

### 3. Optimistic UI
```typescript
import { useFetcher } from '@remix-run/react';

function OptimisticTodo({ todo }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== 'idle';
  
  return (
    <li style={{ opacity: isDeleting ? 0.5 : 1 }}>
      {todo.text}
      <fetcher.Form method="delete" action={`/todos/${todo.id}`}>
        <button type="submit" disabled={isDeleting}>
          Delete
        </button>
      </fetcher.Form>
    </li>
  );
}
```

## Deployment

### 1. Node.js Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# With PM2
pm2 start npm --name "katalyst-remix" -- start
```

### 2. Edge Deployment
```typescript
// remix.config.ts for Cloudflare Workers
export default {
  serverBuildTarget: 'cloudflare-workers',
  server: './server.js',
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ['**/.*'],
};
```

### 3. Docker Deployment
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
```

## Best Practices

### 1. Data Loading
- Use loaders for server-side data
- Implement proper error boundaries
- Cache expensive queries
- Use deferred loading for slow data

### 2. Forms & Mutations
- Progressive enhancement first
- Optimistic UI for better UX
- Proper validation on server
- CSRF protection

### 3. Performance
- Minimize JavaScript bundles
- Use resource hints
- Implement proper caching
- Stream responses when possible

### 4. Security
- Validate all inputs
- Use HTTPS in production
- Implement rate limiting
- Secure session management

## Troubleshooting

### Common Issues

1. **Hydration Errors**
```typescript
// Ensure consistent server/client rendering
const isServer = typeof window === 'undefined';

if (!isServer) {
  // Client-only code
}
```

2. **Session Issues**
```bash
# Regenerate session secret
openssl rand -base64 32

# Clear sessions
redis-cli FLUSHDB
```

3. **Build Failures**
```bash
# Clear Remix cache
rm -rf .cache build

# Rebuild
npm run build
```

## Next Steps

- [009-testing-guide.md](./009-testing-guide.md) - Testing strategies
- [010-deployment-guide.md](./010-deployment-guide.md) - Deployment options
- [011-security-guide.md](./011-security-guide.md) - Security best practices
- [012-performance-guide.md](./012-performance-guide.md) - Performance optimization