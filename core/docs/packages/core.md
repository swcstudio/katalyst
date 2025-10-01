# @katalyst/core

Core React components, hooks, providers, stores, and utilities for the Katalyst framework.

## Overview

The `@katalyst/core` package provides the foundational building blocks for Katalyst applications, including React components, custom hooks, state management stores, utility functions, and context providers.

### Key Features

- ⚛️ **React 19 Support** - Full support for latest React features
- 🎨 **Pre-built Components** - Production-ready UI components
- 🎣 **Custom Hooks** - Reusable React hooks for common patterns
- 🗄️ **State Management** - Zustand-based stores
- 🔧 **Utilities** - Helper functions and utilities
- 🌐 **Providers** - Context providers for global state
- 🎯 **TypeScript** - Fully typed API
- 📦 **Tree-shakeable** - Only import what you need

## Installation

```typescript
import { Button, useAuth, userStore } from '@katalyst/core';
```

## Quick Start

```tsx
import { Button, Card, useAuth } from '@katalyst/core';

function MyApp() {
  const { user, login } = useAuth();
  
  return (
    <Card>
      <h1>Welcome {user?.name}</h1>
      <Button onClick={() => login()}>Login</Button>
    </Card>
  );
}
```

## Components

### UI Components

```tsx
import {
  Button,
  Card,
  Modal,
  Input,
  Select,
  Table,
  Tabs,
  Toast
} from '@katalyst/core/components';

// Button with variants
<Button variant="primary" size="lg">
  Click Me
</Button>

// Card component
<Card title="My Card" footer={<Button>Action</Button>}>
  Card content
</Card>

// Modal
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Modal Title</h2>
  <p>Modal content</p>
</Modal>
```

### Form Components

```tsx
import { Input, Select, Checkbox, Radio } from '@katalyst/core/components';

<Input 
  label="Email"
  type="email"
  placeholder="Enter email"
  error={errors.email}
/>

<Select
  label="Country"
  options={countries}
  value={selected}
  onChange={setSelected}
/>
```

### Data Display Components

```tsx
import { Table, DataGrid, List } from '@katalyst/core/components';

<Table
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' }
  ]}
  data={users}
  onRowClick={handleRowClick}
/>
```

## Hooks

### Authentication Hooks

```tsx
import { useAuth, useUser, useSession } from '@katalyst/core/hooks';

const { user, login, logout, isAuthenticated } = useAuth();
const userData = useUser(userId);
const session = useSession();
```

### Data Fetching Hooks

```tsx
import { useFetch, useQuery, useMutation } from '@katalyst/core/hooks';

const { data, loading, error, refetch } = useFetch('/api/users');

const { data } = useQuery('users', () => fetchUsers());

const mutation = useMutation(createUser, {
  onSuccess: () => queryClient.invalidateQueries('users')
});
```

### UI Hooks

```tsx
import { 
  useModal, 
  useToast, 
  useTheme, 
  useMediaQuery 
} from '@katalyst/core/hooks';

const modal = useModal();
const toast = useToast();
const { theme, setTheme } = useTheme();
const isMobile = useMediaQuery('(max-width: 768px)');
```

## Stores

### User Store

```tsx
import { userStore } from '@katalyst/core/stores';

const { user, setUser, clearUser } = userStore();

// Update user
setUser({ name: 'John', email: 'john@example.com' });

// Clear user
clearUser();
```

### App Store

```tsx
import { appStore } from '@katalyst/core/stores';

const { theme, setTheme, locale, setLocale } = appStore();
```

### Custom Store

```tsx
import { create } from '@katalyst/core/stores';

const useMyStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}));
```

## Providers

### App Provider

```tsx
import { AppProvider } from '@katalyst/core/providers';

function Root() {
  return (
    <AppProvider config={{ theme: 'dark', locale: 'en' }}>
      <App />
    </AppProvider>
  );
}
```

### Auth Provider

```tsx
import { AuthProvider } from '@katalyst/core/providers';

<AuthProvider onAuthChange={handleAuthChange}>
  <App />
</AuthProvider>
```

### Query Provider

```tsx
import { QueryProvider } from '@katalyst/core/providers';

<QueryProvider>
  <App />
</QueryProvider>
```

## Utilities

### String Utils

```typescript
import { capitalize, slugify, truncate } from '@katalyst/core/utils';

capitalize('hello'); // 'Hello'
slugify('Hello World'); // 'hello-world'
truncate('Long text...', 10); // 'Long text...'
```

### Array Utils

```typescript
import { chunk, unique, groupBy } from '@katalyst/core/utils';

chunk([1,2,3,4,5], 2); // [[1,2], [3,4], [5]]
unique([1,2,2,3]); // [1,2,3]
groupBy(users, 'role'); // { admin: [...], user: [...] }
```

### Object Utils

```typescript
import { pick, omit, merge } from '@katalyst/core/utils';

pick(obj, ['name', 'email']);
omit(obj, ['password']);
merge(obj1, obj2);
```

### Date Utils

```typescript
import { formatDate, parseDate, addDays } from '@katalyst/core/utils';

formatDate(new Date(), 'YYYY-MM-DD');
parseDate('2024-01-01');
addDays(new Date(), 7);
```

## API Reference

### Component Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: ReactNode;
}
```

## Integration with Other Packages

### With @katalyst/design-system

```tsx
import { Button } from '@katalyst/core';
import { ThemeProvider } from '@katalyst/design-system';

<ThemeProvider>
  <Button>Themed Button</Button>
</ThemeProvider>
```

### With @katalyst/api

```tsx
import { useAuth } from '@katalyst/core';
import { trpc } from '@katalyst/api';

function MyComponent() {
  const { user } = useAuth();
  const { data } = trpc.users.getProfile.useQuery({ id: user.id });
  
  return <div>{data?.name}</div>;
}
```

## Best Practices

1. **Import what you need** - Use specific imports for tree-shaking
2. **Use providers** - Wrap app in necessary providers
3. **Type your components** - Leverage TypeScript
4. **Compose hooks** - Build custom hooks from primitives
5. **Memoize expensive operations** - Use React.memo and useMemo
6. **Handle loading states** - Show loading indicators
7. **Error boundaries** - Wrap components in error boundaries

## Related Documentation

- [Design System](./design-system.md) - UI components and theming
- [Hooks](./hooks.md) - Additional hooks
- [API](./api.md) - Data fetching

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Status**: Production Ready
