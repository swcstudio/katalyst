# @katalyst/integrations

35+ framework and tool integrations for the Katalyst ecosystem including UI frameworks, build tools, testing, and more.

## Overview

The `@katalyst/integrations` package provides pre-configured integrations for popular frameworks and tools, making it easy to add new capabilities to your Katalyst application.

### Key Features

- 🎨 **UI Frameworks** - Arco Design, TailwindCSS, Storybook
- 🔧 **Build Tools** - RSpack, EMP, Umi, NX, Turbo, Zephyr
- 🧪 **Testing** - Playwright, visual regression
- 🔐 **Authentication** - Clerk integration
- ⚡ **State Management** - Zustand patterns
- 🎯 **Data Fetching** - TanStack Query
- 🚀 **Performance** - Multithreading, fast refresh
- 🛠️ **Developer Tools** - Inspector, Biome, ngrok

## Installation

```typescript
import { rspackConfig, arcoPlugin } from '@katalyst/integrations';
```

## Integration Categories

### UI & Styling

```typescript
import { 
  arcoPlugin, 
  tailwindConfig, 
  storybookConfig 
} from '@katalyst/integrations';

// Arco Design
export default arcoPlugin({
  theme: 'dark',
  components: ['Button', 'Table']
});

// TailwindCSS
export default tailwindConfig({
  content: ['./src/**/*.{js,ts,jsx,tsx}']
});
```

### Build Tools

```typescript
import { 
  rspackConfig, 
  empConfig, 
  zephyrConfig,
  nxConfig,
  turboConfig
} from '@katalyst/integrations';

// RSpack
export default rspackConfig({
  entry: './src/index.tsx',
  output: './dist'
});

// Module Federation (EMP)
export default empConfig({
  name: 'app1',
  shared: ['react', 'react-dom']
});
```

### Testing

```typescript
import { 
  playwrightConfig, 
  visualRegressionConfig 
} from '@katalyst/integrations';

// Playwright
export default playwrightConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run dev',
    port: 3000
  }
});
```

### Authentication

```typescript
import { clerkConfig } from '@katalyst/integrations';

export default clerkConfig({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});
```

### State Management

```typescript
import { zustandPatterns } from '@katalyst/integrations';

// Pre-configured Zustand patterns
const useStore = zustandPatterns.create({
  persist: true,
  devtools: true
});
```

### Data Fetching

```typescript
import { tanstackConfig } from '@katalyst/integrations';

// TanStack Query
export const queryClient = tanstackConfig({
  defaultOptions: {
    queries: { staleTime: 60000 }
  }
});
```

## Available Integrations

### Production Ready

- **arco** - Arco Design components
- **tailwind** - TailwindCSS configuration
- **storybook** - Storybook setup
- **rspack** - RSpack bundler
- **zephyr** - Zephyr build tool
- **nx** - NX monorepo
- **turbo** - Turborepo
- **playwright** - E2E testing
- **clerk** - Authentication
- **zustand** - State management
- **tanstack** - Data fetching
- **biome** - Linter and formatter
- **multithreading** - Parallel processing
- **ngrok** - Local tunneling
- **fast-refresh** - Hot module replacement

### Experimental

- **emp** - Module federation
- **umi** - Framework
- **repack** - React Native bundler
- **tauri** - Desktop apps
- **webxr** - XR experiences
- **sails** - Mobile framework

## Integration Groups

```typescript
import { IntegrationGroups } from '@katalyst/integrations';

// Core app integrations
const coreIntegrations = IntegrationGroups.coreApp;
// ['rspack', 'tanstack', 'zustand', 'clerk']

// Full stack integrations
const fullStack = IntegrationGroups.fullStack;

// Performance integrations
const performance = IntegrationGroups.performance;
```

## Usage Examples

### Complete App Setup

```typescript
import { 
  rspackConfig,
  tailwindConfig,
  clerkConfig,
  tanstackConfig
} from '@katalyst/integrations';

// rspack.config.ts
export default rspackConfig({
  entry: './src/index.tsx',
  plugins: [
    tailwindConfig(),
    clerkConfig({ publishableKey: '...' })
  ]
});

// app.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';

const queryClient = tanstackConfig();

function App() {
  return (
    <ClerkProvider publishableKey="...">
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

### Testing Setup

```typescript
import { playwrightConfig } from '@katalyst/integrations';

export default playwrightConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' }
  ]
});
```

## API Reference

Each integration exports configuration functions and utilities specific to that tool.

```typescript
// General pattern
export function integrationConfig(options: IntegrationOptions): Config;
```

## Best Practices

1. **Use production integrations** - Avoid experimental in production
2. **Configure appropriately** - Each integration has sensible defaults
3. **Group related integrations** - Use IntegrationGroups
4. **Keep updated** - Check for integration updates
5. **Test integrations** - Ensure they work together
6. **Read integration docs** - Each has specific requirements

## Related Documentation

- [Build System](./build-system.md) - Build configurations
- [Core Package](./core.md) - Using integrated tools

---

**Version**: N/A (Monorepo)  
**Last Updated**: 2024  
**Status**: Production Ready (Core), Experimental (Some)
