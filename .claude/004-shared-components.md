# Shared Components & Design System

## Overview

The Katalyst shared module is the heart of cross-framework code reuse in the Katalyst-React ecosystem. It provides a comprehensive set of components, hooks, utilities, and a token-based design system that works seamlessly across Core React, Next.js, and Remix frameworks. This approach ensures consistency, reduces duplication, and accelerates development.

## Architecture

### Module Structure
```
shared/
├── src/
│   ├── components/       # Shared React components
│   ├── design-system/    # Token-based design system
│   ├── hooks/            # Cross-framework React hooks
│   ├── integrations/     # Framework integrations
│   ├── native/           # Rust multithreading module
│   ├── plugins/          # Build tool plugins
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
├── package.json
└── tsconfig.json
```

### Import Pattern
All shared resources are available through a single import:
```typescript
import { 
  Button, 
  useMultithreading, 
  theme,
  KatalystProvider 
} from '@swcstudio/shared';
```

## Core Components

### 1. KatalystProvider
The root provider that initializes the entire Katalyst system:

```typescript
import { KatalystProvider } from '@swcstudio/shared';

function App() {
  return (
    <KatalystProvider
      config={{
        framework: 'core', // 'core' | 'next' | 'remix'
        theme: 'light',
        variant: 'default',
        enableDevMode: true,
      }}
    >
      {/* Your app content */}
    </KatalystProvider>
  );
}
```

### 2. ConfigProvider
Manages theme and configuration across your application:

```typescript
import { ConfigProvider, useConfig } from '@swcstudio/shared';

function ThemedApp() {
  return (
    <ConfigProvider>
      <ThemeToggle />
      <AppContent />
    </ConfigProvider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useConfig();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

### 3. MultithreadingProvider
Provides access to native Rust-powered multithreading:

```typescript
import { MultithreadingProvider, useMultithreading } from '@swcstudio/shared';

function App() {
  return (
    <MultithreadingProvider
      config={{
        numThreads: 4,
        enableRayon: true,
        enableTokio: true,
      }}
    >
      <DataProcessor />
    </MultithreadingProvider>
  );
}
```

### 4. IntegrationProvider
Manages framework integrations and plugins:

```typescript
import { IntegrationProvider, useIntegration } from '@swcstudio/shared';

function App() {
  return (
    <IntegrationProvider
      integrations={['tanstack', 'rspack', 'storybook']}
      onLoad={(integration) => console.log(`Loaded: ${integration.name}`)}
    >
      <AppContent />
    </IntegrationProvider>
  );
}
```

## UI Components

### Button Component
A versatile button with multiple variants and sizes:

```typescript
import { Button } from '@swcstudio/shared';

function ButtonExamples() {
  return (
    <>
      {/* Variants */}
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      
      {/* Sizes */}
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      
      {/* States */}
      <Button disabled>Disabled</Button>
      <Button loading>Loading...</Button>
      
      {/* With icons */}
      <Button leftIcon={<SaveIcon />}>Save</Button>
      <Button rightIcon={<ArrowIcon />}>Next</Button>
    </>
  );
}
```

### Card Component
A flexible card component for content containers:

```typescript
import { Card } from '@swcstudio/shared';

function CardExamples() {
  return (
    <>
      {/* Basic card */}
      <Card>
        <p>Simple card content</p>
      </Card>
      
      {/* Card with title */}
      <Card title="Dashboard">
        <p>Dashboard content goes here</p>
      </Card>
      
      {/* Card with custom styling */}
      <Card className="p-8 shadow-xl" hoverable>
        <h3>Interactive Card</h3>
        <p>Hover over me!</p>
      </Card>
    </>
  );
}
```

## Design System

### Token-Based Architecture
The design system uses a three-tier token system:

1. **Primitive Tokens**: Raw design values
2. **Semantic Tokens**: Purpose-driven tokens
3. **Component Tokens**: Component-specific values

### Using Design Tokens

```typescript
// In your components
import { tokens } from '@swcstudio/shared';

const StyledComponent = () => (
  <div
    style={{
      padding: tokens.spacing.md,
      color: tokens.colors.text.primary,
      backgroundColor: tokens.colors.background.secondary,
      borderRadius: tokens.radius.md,
      boxShadow: tokens.shadows.sm,
    }}
  >
    Styled with tokens
  </div>
);
```

### CSS Custom Properties
All tokens are available as CSS custom properties:

```css
.my-component {
  padding: var(--katalyst-spacing-4);
  color: var(--katalyst-text-primary);
  background: var(--katalyst-bg-secondary);
  border-radius: var(--katalyst-radius-md);
  transition: all var(--katalyst-duration-200) var(--katalyst-ease-in-out);
}
```

### Theme Configuration

```typescript
// Define custom theme
const customTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    // ... more colors
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    // ... more spacing
  },
  // ... other tokens
};

// Apply custom theme
<KatalystProvider config={{ theme: customTheme }}>
  <App />
</KatalystProvider>
```

## Hooks

### useMultithreading
Access native multithreading capabilities:

```typescript
import { useMultithreading } from '@swcstudio/shared';

function DataProcessor() {
  const { 
    parallelMap, 
    parallelReduce, 
    createChannel,
    spawnTask 
  } = useMultithreading();

  const processData = async () => {
    // Parallel map operation
    const doubled = await parallelMap([1, 2, 3, 4, 5], x => x * 2);
    
    // Parallel reduce operation
    const sum = await parallelReduce(
      [1, 2, 3, 4, 5],
      (acc, val) => acc + val,
      0
    );
    
    // Spawn async task
    const taskId = await spawnTask(async () => {
      // Long-running operation
      return computeExpensiveResult();
    });
  };

  return <button onClick={processData}>Process</button>;
}
```

### useConfig
Manage application configuration:

```typescript
import { useConfig } from '@swcstudio/shared';

function ConfigExample() {
  const { 
    theme, 
    setTheme,
    variant,
    setVariant,
    framework,
    isDevMode 
  } = useConfig();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Framework: {framework}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### useHydration
Handle SSR/SSG hydration correctly:

```typescript
import { useHydration } from '@swcstudio/shared';

function HydrationSafeComponent() {
  const isHydrated = useHydration();

  if (!isHydrated) {
    // Return server-safe content
    return <div>Loading...</div>;
  }

  // Client-only code
  return <div>Window width: {window.innerWidth}</div>;
}
```

### useServerActions
Framework-agnostic server actions:

```typescript
import { useServerActions } from '@swcstudio/shared';

function FormComponent() {
  const { execute, isExecuting } = useServerActions();

  const handleSubmit = async (formData: FormData) => {
    const result = await execute('createUser', formData);
    console.log('User created:', result);
  };

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required />
      <button type="submit" disabled={isExecuting}>
        {isExecuting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### useUnifiedBuilder
Cross-platform build configuration:

```typescript
import { useUnifiedBuilder } from '@swcstudio/shared';

function PlatformBuilder() {
  const { 
    buildForDesktop,
    buildForMobile,
    buildForWeb,
    buildForAll 
  } = useUnifiedBuilder();

  return (
    <div>
      <button onClick={() => buildForDesktop({ target: 'tauri' })}>
        Build Desktop App
      </button>
      <button onClick={() => buildForMobile({ target: 'capacitor' })}>
        Build Mobile App
      </button>
      <button onClick={buildForAll}>
        Build All Platforms
      </button>
    </div>
  );
}
```

## State Management

### Config Store
Persistent configuration management:

```typescript
import { useConfigStore } from '@swcstudio/shared/stores';

function ConfigManager() {
  const { 
    config, 
    updateConfig, 
    resetConfig 
  } = useConfigStore();

  return (
    <div>
      <pre>{JSON.stringify(config, null, 2)}</pre>
      <button onClick={() => updateConfig({ theme: 'dark' })}>
        Dark Mode
      </button>
      <button onClick={resetConfig}>Reset</button>
    </div>
  );
}
```

### Integration Store
Manage loaded integrations:

```typescript
import { useIntegrationStore } from '@swcstudio/shared/stores';

function IntegrationStatus() {
  const { 
    integrations, 
    loadIntegration, 
    isLoaded 
  } = useIntegrationStore();

  return (
    <div>
      <h3>Loaded Integrations:</h3>
      {integrations.map(int => (
        <div key={int.name}>
          {int.name} - {int.version}
        </div>
      ))}
      
      <button 
        onClick={() => loadIntegration('new-integration')}
        disabled={isLoaded('new-integration')}
      >
        Load New Integration
      </button>
    </div>
  );
}
```

### Multithreading Store
Monitor multithreading tasks:

```typescript
import { useMultithreadingStore } from '@swcstudio/shared/stores';

function TaskMonitor() {
  const { 
    activeTasks, 
    queuedTasks, 
    completedTasks,
    metrics 
  } = useMultithreadingStore();

  return (
    <div>
      <p>Active: {activeTasks.length}</p>
      <p>Queued: {queuedTasks.length}</p>
      <p>Completed: {completedTasks.length}</p>
      <p>Average Duration: {metrics.avgDuration}ms</p>
    </div>
  );
}
```

## Integrations

### Available Integrations

1. **RSpack Integration**
   - Rust-powered bundling
   - Module federation support
   - HMR optimization

2. **TanStack Integration**
   - Router configuration
   - Query client setup
   - Table defaults

3. **Storybook Integration**
   - Component documentation
   - Visual testing
   - Design system showcase

4. **Tauri Integration**
   - Desktop app building
   - Native API access
   - Cross-platform support

### Using Integrations

```typescript
import { useIntegration } from '@swcstudio/shared';

function IntegrationExample() {
  const rspack = useIntegration('rspack');
  const tanstack = useIntegration('tanstack');
  
  if (!rspack || !tanstack) {
    return <div>Loading integrations...</div>;
  }

  return (
    <div>
      <p>RSpack version: {rspack.version}</p>
      <p>TanStack features: {tanstack.features.join(', ')}</p>
    </div>
  );
}
```

## Best Practices

### 1. Component Usage
- Always wrap your app with `KatalystProvider`
- Use design tokens instead of hardcoded values
- Leverage shared components before creating new ones
- Follow the established component patterns

### 2. Performance
- Use multithreading for CPU-intensive operations
- Implement proper memoization for expensive computations
- Lazy load integrations when possible
- Monitor task metrics in production

### 3. Theming
- Use semantic tokens for consistency
- Support both light and dark themes
- Test components in all theme variations
- Respect user's system preferences

### 4. State Management
- Use provided stores for global state
- Keep component state local when possible
- Implement proper error boundaries
- Clean up subscriptions on unmount

## Framework-Specific Usage

### In Core (Vanilla React)
```typescript
import { KatalystProvider } from '@swcstudio/shared';

function CoreApp() {
  return (
    <KatalystProvider config={{ framework: 'core' }}>
      <RouterProvider router={router} />
    </KatalystProvider>
  );
}
```

### In Next.js
```typescript
// app/layout.tsx
import { KatalystProvider } from '@swcstudio/shared';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <KatalystProvider config={{ framework: 'next' }}>
          {children}
        </KatalystProvider>
      </body>
    </html>
  );
}
```

### In Remix
```typescript
// root.tsx
import { KatalystProvider } from '@swcstudio/shared';

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <KatalystProvider config={{ framework: 'remix' }}>
          <Outlet />
        </KatalystProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

## Extending the System

### Creating Custom Components
```typescript
// shared/src/components/CustomButton.tsx
import { forwardRef } from 'react';
import { cn } from '../utils';
import { tokens } from '../design-system';

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'glow';
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'gradient', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 rounded-md transition-all',
          variant === 'gradient' && 'bg-gradient-to-r from-blue-500 to-purple-500',
          variant === 'glow' && 'shadow-glow',
          className
        )}
        style={{
          '--glow-color': tokens.colors.primary,
        }}
        {...props}
      />
    );
  }
);
```

### Adding New Hooks
```typescript
// shared/src/hooks/use-websocket.ts
import { useEffect, useState } from 'react';

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    setSocket(ws);

    return () => ws.close();
  }, [url]);

  return { socket, isConnected };
}
```

## Next Steps

- [005-multithreading.md](./005-multithreading.md) - Deep dive into multithreading
- [006-build-system.md](./006-build-system.md) - Understanding the build system
- [007-next-integration.md](./007-next-integration.md) - Next.js specific features
- [008-remix-integration.md](./008-remix-integration.md) - Remix specific features