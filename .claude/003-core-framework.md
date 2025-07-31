# Katalyst-Core: Vanilla React 19 Framework

## Overview

Katalyst-Core is the foundation of the Katalyst-React ecosystem - a cutting-edge vanilla React 19 framework that leverages Rust-powered tooling and native multithreading to deliver unprecedented performance. Built as a response to Create React App's deprecation, Katalyst-Core goes beyond simple bootstrapping to provide a complete, production-ready foundation for modern React applications.

## Key Features

### 1. React 19 First
- Full support for React 19 concurrent features
- `useTransition` and `useDeferredValue` for optimal UI responsiveness
- Suspense boundaries with proper error handling
- Server Actions pattern simulation via multithreading
- Automatic batching and improved hydration

### 2. Native Multithreading
- Rust-powered Web Workers via NAPI bindings
- Parallel data processing with Rayon
- Async operations with Tokio runtime
- Lock-free data structures with Crossbeam
- Zero-copy message passing between threads

### 3. TanStack Ecosystem
- **Router**: Type-safe, file-based routing
- **Query**: Advanced data fetching with intelligent caching
- **Table**: Performant data tables with virtualization
- **Form**: Type-safe forms with validation
- **Virtual**: Efficient list virtualization

### 4. RSBuild (Rust-Powered Bundler)
- Sub-second HMR (Hot Module Replacement)
- Intelligent code splitting
- Module Federation support
- Optimized production builds
- Native ES modules in development

## Architecture

### Project Structure
```
core/
├── src/
│   ├── components/          # Local components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utilities
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── routeTree.gen.ts     # Generated routes
├── public/                  # Static assets
├── rsbuild.config.ts        # Build configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

### Component Architecture
Katalyst-Core uses a hybrid component architecture:

```typescript
// Local components specific to Core
import { Dashboard } from './components/Dashboard';

// Shared components from the monorepo
import { Button, Card } from '@katalyst/shared/components';

// Lazy-loaded micro-frontends
const RemixAdmin = lazy(() => import('@katalyst/remix/AdminPanel'));
const NextMarketing = lazy(() => import('@katalyst/next/Marketing'));
```

## Getting Started

### Basic Setup
```bash
# Navigate to core directory
cd core

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Creating Your First Component
```typescript
// src/components/MyComponent.tsx
import { useState, useTransition } from 'react';
import { useMultithreading } from '@katalyst/shared/hooks';

export function MyComponent() {
  const [data, setData] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();
  const { parallelMap } = useMultithreading();

  const processData = async () => {
    startTransition(async () => {
      // Process data in parallel using native threads
      const result = await parallelMap(
        Array.from({ length: 1000000 }, (_, i) => i),
        (num) => num * 2
      );
      setData(result);
    });
  };

  return (
    <div>
      <button onClick={processData} disabled={isPending}>
        Process Data {isPending && '(Processing...)'}
      </button>
      <div>Processed {data.length} items</div>
    </div>
  );
}
```

## Routing

### File-Based Routing with TanStack Router
```typescript
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return <h1>Welcome to Katalyst-Core</h1>;
}
```

### Dynamic Routes
```typescript
// src/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return fetchPost(params.postId);
  },
  component: PostPage,
});
```

### Navigation
```typescript
import { Link, useNavigate } from '@tanstack/react-router';

function Navigation() {
  const navigate = useNavigate();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <button onClick={() => navigate({ to: '/dashboard' })}>
        Go to Dashboard
      </button>
    </nav>
  );
}
```

## Data Fetching

### Using TanStack Query
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateUser = useMutation({
    mutationFn: updateUserAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => updateUser.mutate({ id: userId, name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
}
```

## Multithreading

### Basic Usage
```typescript
import { useMultithreading } from '@katalyst/shared/hooks';

function DataProcessor() {
  const { 
    initializeRayon, 
    parallelMap, 
    createChannel,
    isInitialized 
  } = useMultithreading();

  useEffect(() => {
    initializeRayon({ numThreads: 4 });
  }, []);

  const processLargeDataset = async () => {
    const data = Array.from({ length: 1000000 }, (_, i) => i);
    
    // Process in parallel across 4 threads
    const results = await parallelMap(data, (item) => {
      // CPU-intensive computation
      return Math.sqrt(item) * Math.PI;
    });

    return results;
  };

  return (
    <button onClick={processLargeDataset} disabled={!isInitialized}>
      Process Dataset
    </button>
  );
}
```

### Advanced Multithreading Patterns
```typescript
// Using channels for inter-thread communication
const ThreadedCounter = () => {
  const { createChannel } = useMultithreading();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const channel = createChannel<number>();
    
    // Producer thread
    channel.sendAsync(async () => {
      let value = 0;
      while (value < 1000) {
        await channel.send(value++);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });

    // Consumer (main thread)
    const unsubscribe = channel.receive((value) => {
      setCount(value);
    });

    return unsubscribe;
  }, []);

  return <div>Count: {count}</div>;
};
```

## State Management

### Using Zustand with Multithreading
```typescript
import { create } from 'zustand';
import { useMultithreading } from '@katalyst/shared/hooks';

interface AppState {
  data: number[];
  processData: () => Promise<void>;
}

const useAppStore = create<AppState>((set) => {
  const { parallelMap } = useMultithreading();

  return {
    data: [],
    processData: async () => {
      const rawData = await fetchData();
      const processed = await parallelMap(rawData, complexCalculation);
      set({ data: processed });
    },
  };
});
```

## Performance Optimization

### Code Splitting
```typescript
// Automatic code splitting with dynamic imports
const HeavyComponent = lazy(() => 
  import('./components/HeavyComponent')
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### React 19 Transitions
```typescript
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // Update input immediately

    startTransition(() => {
      // Expensive search operation
      const searchResults = performSearch(value);
      setResults(searchResults);
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        {results.map(result => (
          <SearchResult key={result.id} {...result} />
        ))}
      </div>
    </>
  );
}
```

## Testing

### Unit Testing with Vitest
```typescript
// src/components/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
  it('increments count when button is clicked', () => {
    render(<Counter />);
    
    const button = screen.getByText('Count: 0');
    fireEvent.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

### Testing Multithreaded Components
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useMultithreading } from '@katalyst/shared/hooks';

test('parallel processing works correctly', async () => {
  const { result } = renderHook(() => useMultithreading());
  
  await waitFor(() => {
    expect(result.current.isInitialized).toBe(true);
  });

  const data = [1, 2, 3, 4, 5];
  const doubled = await result.current.parallelMap(data, x => x * 2);
  
  expect(doubled).toEqual([2, 4, 6, 8, 10]);
});
```

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Type check before build
npm run typecheck
```

### Optimization Features
- Automatic code splitting
- Tree shaking
- Minification with SWC
- Asset optimization
- Content hashing for caching

### Deployment Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Drop-in support
- **Docker**: Containerized deployment
- **Static Hosting**: Export as static site

## Best Practices

### 1. Component Organization
- Keep components small and focused
- Use composition over inheritance
- Leverage shared components from `@katalyst/shared`
- Implement proper error boundaries

### 2. Performance
- Use React 19 transitions for expensive updates
- Leverage multithreading for CPU-intensive tasks
- Implement proper memoization with `useMemo` and `useCallback`
- Use virtual scrolling for large lists

### 3. Type Safety
- Enable strict TypeScript mode
- Use proper type inference
- Avoid `any` types
- Leverage TanStack Router's type-safe routing

### 4. Testing
- Write tests for critical paths
- Test multithreaded operations
- Use React Testing Library best practices
- Maintain 80% code coverage

## Advanced Topics

### Module Federation
```typescript
// rsbuild.config.ts
export default defineConfig({
  moduleFederation: {
    name: 'katalystCore',
    exposes: {
      './Dashboard': './src/components/Dashboard',
      './Analytics': './src/components/Analytics',
    },
    shared: ['react', 'react-dom', '@katalyst/shared'],
  },
});
```

### Custom Hooks
```typescript
// Combining multithreading with React Query
function useParallelQuery<T>(
  queryKey: string[],
  fetchFn: () => Promise<T[]>,
  processFn: (item: T) => T
) {
  const { parallelMap } = useMultithreading();
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const data = await fetchFn();
      return parallelMap(data, processFn);
    },
  });
}
```

## Troubleshooting

### Common Issues

1. **Multithreading not working**
   - Ensure native module is built: `npm run build:native`
   - Check browser compatibility (requires SharedArrayBuffer)
   - Verify CORS headers for SharedArrayBuffer

2. **Build failures**
   - Clear cache: `rm -rf .nx node_modules`
   - Rebuild: `npm install && npm run build`

3. **Type errors**
   - Run `npm run typecheck`
   - Ensure `@types/react` is version 19+

## Next Steps

- [004-shared-components.md](./004-shared-components.md) - Using shared components
- [005-multithreading.md](./005-multithreading.md) - Deep dive into multithreading
- [006-build-system.md](./006-build-system.md) - Understanding the build system
- [007-testing-guide.md](./007-testing-guide.md) - Comprehensive testing guide