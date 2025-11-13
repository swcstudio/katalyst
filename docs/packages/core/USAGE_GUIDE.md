# Core Package - Complete Usage Guide

> **Package:** `@katalyst/core`  
> **Purpose:** Production-ready foundation for Katalyst applications  
> **Size:** <50KB  
> **Status:** ✅ Production Ready

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Providers](#core-providers)
4. [UI Components](#ui-components)
5. [Hooks & State](#hooks--state)
6. [Design Tokens](#design-tokens)
7. [Architecture](#architecture)
8. [Migration Guide](#migration-guide)

---

## Overview

`@katalyst/core` is the **lightweight, production-tested foundation** of the Katalyst framework. It contains only essential, battle-tested components that every Katalyst application needs.

### What's Included ✅

- **Core Providers** - `KatalystProvider`, `ConfigProvider`
- **UI Components** - Button, Card, Input, Badge, Tabs, Icon
- **Essential Hooks** - `useConfig`, `useHydration`, `useKatalystContext`
- **State Management** - Config store with Zustand
- **Design Tokens** - Colors, typography, spacing, breakpoints
- **Utilities** - `cn` (class names), validation helpers

### What's NOT Included ❌

The core package is intentionally minimal. The following are in separate packages:

- Runtime Providers → `@katalyst/integrations`
- Build tool configs → `@katalyst/build-system`
- Multithreading → `@katalyst/multithreading`
- Data/TanStack → `@katalyst/data`
- Payments → `@katalyst/payments`
- Dev tools → Development only

---

## Quick Start

### Installation

```bash
npm install @katalyst/core
# or
yarn add @katalyst/core
# or
pnpm add @katalyst/core
```

### Basic Setup

```tsx
import { KatalystProvider } from '@katalyst/core';

function App() {
  return (
    <KatalystProvider config={{ framework: 'nextjs' }}>
      <YourApp />
    </KatalystProvider>
  );
}
```

### Complete Setup with All Features

```tsx
import { 
  KatalystProvider, 
  ConfigProvider,
  tokens,
  Button 
} from '@katalyst/core';

function App() {
  return (
    <KatalystProvider 
      config={{ 
        framework: 'nextjs',
        theme: { 
          mode: 'dark',
          primaryColor: tokens.colors.primary 
        }
      }}
    >
      <ConfigProvider>
        <YourApp />
      </ConfigProvider>
    </KatalystProvider>
  );
}
```

---

## Core Providers

### `KatalystProvider` - Root Application Provider

**Purpose:** Provides foundational context for all Katalyst components, managing configuration, theming, and shared state.

**Import:**
```tsx
import { KatalystProvider, useKatalystContext } from '@katalyst/core';
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | ✅ | App components to wrap |
| `config` | `KatalystConfig` | ✅ | Framework configuration |

**Configuration Options:**

```typescript
interface KatalystConfig {
  framework: 'nextjs' | 'remix' | 'vite' | 'native';
  theme?: {
    mode: 'light' | 'dark' | 'system';
    primaryColor?: string;
    fontFamily?: string;
  };
  features?: {
    multithreading?: boolean;
    devTools?: boolean;
  };
}
```

**Usage Examples:**

**Basic Setup:**
```tsx
<KatalystProvider config={{ framework: 'nextjs' }}>
  <App />
</KatalystProvider>
```

**With Dark Theme:**
```tsx
<KatalystProvider 
  config={{ 
    framework: 'nextjs',
    theme: { mode: 'dark' }
  }}
>
  <App />
</KatalystProvider>
```

**With Custom Theme:**
```tsx
<KatalystProvider 
  config={{ 
    framework: 'remix',
    theme: { 
      mode: 'dark',
      primaryColor: '#6366f1',
      fontFamily: 'Inter, system-ui'
    }
  }}
>
  <App />
</KatalystProvider>
```

**Accessing Context:**

```tsx
import { useKatalystContext } from '@katalyst/core';

function MyComponent() {
  const { config, updateConfig, isInitialized } = useKatalystContext();

  const toggleTheme = () => {
    updateConfig({
      theme: {
        ...config.theme,
        mode: config.theme?.mode === 'dark' ? 'light' : 'dark'
      }
    });
  };

  return (
    <div>
      <p>Framework: {config.framework}</p>
      <p>Theme: {config.theme?.mode}</p>
      <p>Status: {isInitialized ? '✅ Ready' : '⏳ Loading'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

**Error Handling:**

```tsx
function SafeComponent() {
  try {
    const katalyst = useKatalystContext();
    return <div>Katalyst is available!</div>;
  } catch (error) {
    // This error means KatalystProvider is missing
    return <div>Please wrap with KatalystProvider</div>;
  }
}
```

---

### `ConfigProvider` - Configuration Management

**Purpose:** Manages application configuration with persistence and validation.

**Import:**
```tsx
import { ConfigProvider } from '@katalyst/core';
```

**Usage:**
```tsx
<KatalystProvider config={{ framework: 'nextjs' }}>
  <ConfigProvider>
    <App />
  </ConfigProvider>
</KatalystProvider>
```

**Accessing Config:**
```tsx
import { useConfig } from '@katalyst/core';

function Settings() {
  const { config, updateConfig } = useConfig();

  return (
    <div>
      <h2>Settings</h2>
      <button onClick={() => updateConfig({ apiUrl: '/api/v2' })}>
        Update API URL
      </button>
    </div>
  );
}
```

---

## UI Components

All UI components in `@katalyst/core` are production-ready, accessible, and themeable.

### `Button` - Action Button Component

**Import:**
```tsx
import { Button } from '@katalyst/core';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `onClick` | `() => void` | - | Click handler |

**Usage Examples:**

```tsx
import { Button } from '@katalyst/core';

function Examples() {
  return (
    <>
      {/* Primary button */}
      <Button variant="primary">
        Primary Action
      </Button>

      {/* Secondary button */}
      <Button variant="secondary" size="sm">
        Secondary
      </Button>

      {/* Ghost button */}
      <Button variant="ghost">
        Ghost Button
      </Button>

      {/* Loading state */}
      <Button loading>
        Processing...
      </Button>

      {/* Disabled */}
      <Button disabled>
        Disabled
      </Button>

      {/* With click handler */}
      <Button onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
    </>
  );
}
```

---

### `Card` - Container Component

**Import:**
```tsx
import { Card } from '@katalyst/core';
```

**Usage:**
```tsx
<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

**With Padding Control:**
```tsx
<Card padding="lg">
  <h2>Large Padding Card</h2>
</Card>
```

---

### `Input` - Form Input Component

**Import:**
```tsx
import { Input } from '@katalyst/core';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'email' \| 'password' \| ...` | `'text'` | Input type |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Controlled value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `error` | `string` | - | Error message |

**Usage Examples:**

```tsx
import { Input } from '@katalyst/core';
import { useState } from 'react';

function Form() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = (value: string) => {
    if (!value.includes('@')) {
      setError('Invalid email');
    } else {
      setError('');
    }
  };

  return (
    <>
      <Input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(val) => {
          setEmail(val);
          validate(val);
        }}
        error={error}
      />

      <Input
        type="password"
        placeholder="Enter password"
      />
    </>
  );
}
```

---

### `Badge` - Status Indicator

**Import:**
```tsx
import { Badge } from '@katalyst/core';
```

**Usage:**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">New</Badge>
```

---

### `Tabs` - Tab Navigation

**Import:**
```tsx
import { Tabs } from '@katalyst/core';
```

**Usage:**
```tsx
import { Tabs } from '@katalyst/core';

function TabsExample() {
  return (
    <Tabs
      tabs={[
        { label: 'Overview', content: <Overview /> },
        { label: 'Settings', content: <Settings /> },
        { label: 'Advanced', content: <Advanced /> }
      ]}
      defaultTab={0}
    />
  );
}
```

---

### `Icon` - Icon Component

**Import:**
```tsx
import { Icon } from '@katalyst/core';
```

**Usage:**
```tsx
<Icon name="check" size="sm" />
<Icon name="warning" size="md" color="orange" />
<Icon name="error" size="lg" />
```

---

## Hooks & State

### `useConfig` - Configuration Hook

**Purpose:** Access and update application configuration.

**Import:**
```tsx
import { useConfig } from '@katalyst/core';
```

**Returns:**

```typescript
{
  config: ConfigState;
  updateConfig: (updates: Partial<ConfigState>) => void;
}
```

**Usage:**
```tsx
function Settings() {
  const { config, updateConfig } = useConfig();

  return (
    <div>
      <p>API URL: {config.apiUrl}</p>
      <button onClick={() => updateConfig({ apiUrl: '/api/v2' })}>
        Update API
      </button>
    </div>
  );
}
```

---

### `useHydration` - SSR Hydration Hook

**Purpose:** Handle client-side hydration in SSR environments.

**Import:**
```tsx
import { useHydration } from '@katalyst/core';
```

**Usage:**
```tsx
function ClientOnly() {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return <div>Client-side content</div>;
}
```

---

### `useConfigStore` - Zustand Config Store

**Purpose:** Direct access to the configuration Zustand store.

**Import:**
```tsx
import { useConfigStore } from '@katalyst/core';
```

**Usage:**
```tsx
function Advanced() {
  const apiUrl = useConfigStore((state) => state.apiUrl);
  const setApiUrl = useConfigStore((state) => state.setApiUrl);

  return (
    <div>
      <p>API: {apiUrl}</p>
      <button onClick={() => setApiUrl('/api/v3')}>
        Update
      </button>
    </div>
  );
}
```

---

## Design Tokens

### Importing Tokens

```tsx
import { 
  tokens, 
  breakpoints, 
  typography, 
  colors, 
  spacing 
} from '@katalyst/core';
```

### Using Colors

```tsx
function ThemedComponent() {
  return (
    <div style={{ 
      backgroundColor: colors.primary,
      color: colors.text 
    }}>
      Themed Content
    </div>
  );
}
```

### Typography

```tsx
function Typography() {
  return (
    <div style={{
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold
    }}>
      Typography Example
    </div>
  );
}
```

### Spacing

```tsx
function SpacedLayout() {
  return (
    <div style={{
      padding: spacing[4],
      margin: spacing[2]
    }}>
      Content
    </div>
  );
}
```

### Breakpoints

```tsx
import { breakpoints } from '@katalyst/core';

const styles = {
  container: {
    width: '100%',
    [`@media (min-width: ${breakpoints.md})`]: {
      width: '768px'
    }
  }
};
```

---

## Architecture

### Package Structure

```
@katalyst/core/
├── components/          # UI Components
│   ├── KatalystProvider.tsx
│   ├── ConfigProvider.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Tabs.tsx
│       └── Icon.tsx
├── hooks/              # Core hooks
│   ├── use-config.ts
│   ├── use-hydration.ts
│   └── use-katalyst.ts
├── stores/             # State management
│   └── config-store.ts
├── design-system/      # Design tokens
│   └── tokens.ts
└── utils/              # Utilities
    ├── cn.ts
    └── validation.ts
```

### Provider Hierarchy

```tsx
<KatalystProvider>          {/* Root - Required */}
  <ConfigProvider>          {/* Config management */}
    <YourApp />             {/* Your application */}
  </ConfigProvider>
</KatalystProvider>
```

---

## Migration Guide

### From Legacy Katalyst

**Before:**
```tsx
import { SWCStudioProvider } from '@swcstudio/legacy';
```

**After:**
```tsx
import { KatalystProvider } from '@katalyst/core';
```

### From Individual Providers

**Before:**
```tsx
import { EMPProvider, UmiProvider } from '@katalyst/old';
```

**After:**
```tsx
import { KatalystProvider } from '@katalyst/core';
// Runtime providers moved to @katalyst/integrations
```

---

## Best Practices

### ✅ DO: Wrap at App Root

```tsx
function App() {
  return (
    <KatalystProvider config={{ framework: 'nextjs' }}>
      <Router />
    </KatalystProvider>
  );
}
```

### ❌ DON'T: Wrap Individual Routes

```tsx
// Bad - Don't do this
function Route() {
  return (
    <KatalystProvider config={...}>
      <Page />
    </KatalystProvider>
  );
}
```

### ✅ DO: Use Design Tokens

```tsx
import { colors, spacing } from '@katalyst/core';

const styles = {
  padding: spacing[4],
  color: colors.primary
};
```

### ❌ DON'T: Hardcode Values

```tsx
// Bad
const styles = {
  padding: '16px',  // Use spacing[4]
  color: '#6366f1'  // Use colors.primary
};
```

---

## Troubleshooting

### Error: "useKatalystContext must be used within a KatalystProvider"

**Solution:** Wrap your app with `KatalystProvider`:

```tsx
<KatalystProvider config={{ framework: 'nextjs' }}>
  <App />
</KatalystProvider>
```

### Components Not Themed

**Solution:** Ensure `KatalystProvider` is configured with theme:

```tsx
<KatalystProvider 
  config={{ 
    framework: 'nextjs',
    theme: { mode: 'dark' }
  }}
>
  <App />
</KatalystProvider>
```

---

## Related Packages

- [`@katalyst/hooks`](../hooks/USAGE_GUIDE.md) - Additional React hooks
- [`@katalyst/design-system`](../design-system/USAGE_GUIDE.md) - Extended UI components
- [`@katalyst/integrations`](../integrations/USAGE_GUIDE.md) - Framework integrations
- [`@katalyst/multithreading`](../multithreading/USAGE_GUIDE.md) - Thread management

---

## API Reference

For complete API documentation:
- [KatalystProvider API](./src/components/KatalystProvider.tsx.md)
- [UI Components API](./src/components/ui/README.md)
- [Hooks API](./src/hooks/README.md)
- [Design Tokens API](./src/design-system/tokens.ts.md)

---

*Last Updated: 2025-10-02*  
*Package Version: 1.0.0*  
*Bundle Size: <50KB*
