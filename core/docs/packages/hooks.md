# @katalyst/hooks

Unified React hooks interface with 100+ hooks accessible through a single `useKatalyst()` hook.

## Overview

The `@katalyst/hooks` package provides a comprehensive collection of React hooks unified under a single interface. Instead of importing dozens of individual hooks, you access everything through `useKatalyst()` with automatic React 19 compatibility.

### Key Features

- 🎯 **Single Interface** - Access all hooks through `useKatalyst()`
- 🔧 **100+ Hooks** - Comprehensive collection of utilities
- ⚡ **React 19 Compatible** - Full support for React 19 features
- 🎨 **Pattern Hooks** - Pre-built patterns (modal, search, pagination)
- 🌐 **DOM Hooks** - Window, media queries, intersection observer
- 🛠️ **Utility Hooks** - Debounce, throttle, async operations
- 💾 **State Hooks** - Enhanced state management
- 🔄 **Effect Hooks** - Advanced lifecycle management

## Installation

```typescript
import { useKatalyst } from '@katalyst/hooks';
```

## Quick Start

### The Unified Interface

```tsx
import { useKatalyst } from '@katalyst/hooks';

function MyComponent() {
  const k = useKatalyst();
  
  // State management
  const [count, setCount] = k.state(0);
  
  // DOM utilities
  const { width, height } = k.dom.windowSize();
  const isMobile = k.dom.mediaQuery('(max-width: 768px)');
  
  // Utility hooks
  const debouncedSearch = k.utils.debounce(searchTerm, 500);
  
  // Pattern hooks
  const modal = k.patterns.modal();
  const { filtered } = k.patterns.search(items, 'name');
  
  return <div>Count: {count}</div>;
}
```

### Quick Access with $ Shorthand

```tsx
function MyComponent() {
  const k = useKatalyst();
  
  // Shorter syntax with $
  const [value, setValue] = k.$.state('');
  const windowSize = k.$.windowSize();
  const { data } = k.$.fetch('/api/data');
  
  return <div>{value}</div>;
}
```

## Core Hooks

### State Management

```tsx
const k = useKatalyst();

// Enhanced state
const [count, setCount] = k.state(0);

// State with reducer
const [state, dispatch] = k.reducer(reducer, initialState);

// Ref hook
const inputRef = k.ref<HTMLInputElement>(null);

// Effect hook
k.effect(() => {
  console.log('Component mounted');
  return () => console.log('Cleanup');
}, []);

// Memo hook
const expensiveValue = k.memo(() => {
  return computeExpensive(a, b);
}, [a, b]);

// Callback hook
const handleClick = k.callback(() => {
  console.log('Clicked');
}, []);
```

### Context & Providers

```tsx
// Context hook
const theme = k.context(ThemeContext);

// Combined context
const { user, settings } = k.contexts([UserContext, SettingsContext]);
```

## DOM Hooks

### Window & Viewport

```tsx
const k = useKatalyst();

// Window size
const { width, height } = k.dom.windowSize();

// Scroll position
const { x, y } = k.dom.scrollPosition();

// Media query
const isMobile = k.dom.mediaQuery('(max-width: 768px)');
const isDark = k.dom.mediaQuery('(prefers-color-scheme: dark)');

// Intersection observer
const [ref, isVisible] = k.dom.intersection({ threshold: 0.5 });

// Resize observer
const [ref, size] = k.dom.resize();
```

### Events

```tsx
// Click outside
const [ref, clickedOutside] = k.dom.clickOutside();

// Key press
k.dom.keyPress('Escape', () => {
  console.log('Escape pressed');
});

// Hover
const [ref, isHovered] = k.dom.hover();
```

## Utility Hooks

### Timing & Async

```tsx
const k = useKatalyst();

// Debounce
const debouncedValue = k.utils.debounce(value, 500);

// Throttle
const throttledValue = k.utils.throttle(value, 1000);

// Interval
k.utils.interval(() => {
  console.log('Tick');
}, 1000);

// Timeout
k.utils.timeout(() => {
  console.log('Delayed');
}, 2000);

// Async operation
const { data, loading, error } = k.utils.async(async () => {
  return await fetchData();
});
```

### Data Operations

```tsx
// Local storage
const [value, setValue] = k.utils.localStorage('key', 'default');

// Session storage
const [session, setSession] = k.utils.sessionStorage('session');

// Previous value
const prevCount = k.utils.previous(count);

// Toggle
const [isOpen, toggle] = k.utils.toggle(false);

// Counter
const [count, { increment, decrement, reset }] = k.utils.counter(0);
```

## Pattern Hooks

### Modal Pattern

```tsx
const k = useKatalyst();
const modal = k.patterns.modal();

return (
  <>
    <button onClick={modal.open}>Open Modal</button>
    {modal.isOpen && (
      <div>
        <h2>Modal Content</h2>
        <button onClick={modal.close}>Close</button>
      </div>
    )}
  </>
);
```

### Search Pattern

```tsx
const items = [
  { id: 1, name: 'Apple', category: 'fruit' },
  { id: 2, name: 'Banana', category: 'fruit' },
];

const { filtered, searchTerm, setSearchTerm } = k.patterns.search(
  items, 
  'name'
);

return (
  <>
    <input 
      value={searchTerm} 
      onChange={e => setSearchTerm(e.target.value)} 
    />
    {filtered.map(item => <div key={item.id}>{item.name}</div>)}
  </>
);
```

### Pagination Pattern

```tsx
const { 
  currentPage, 
  totalPages, 
  nextPage, 
  prevPage, 
  goToPage,
  pageItems 
} = k.patterns.pagination(items, 10);

return (
  <>
    {pageItems.map(item => <div key={item.id}>{item.name}</div>)}
    <button onClick={prevPage} disabled={currentPage === 1}>
      Previous
    </button>
    <span>Page {currentPage} of {totalPages}</span>
    <button onClick={nextPage} disabled={currentPage === totalPages}>
      Next
    </button>
  </>
);
```

### Form Pattern

```tsx
const form = k.patterns.form({
  initialValues: { email: '', password: '' },
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Required';
    if (values.password.length < 8) errors.password = 'Too short';
    return errors;
  },
  onSubmit: async (values) => {
    await login(values);
  }
});

return (
  <form onSubmit={form.handleSubmit}>
    <input {...form.field('email')} />
    {form.errors.email && <span>{form.errors.email}</span>}
    
    <input type="password" {...form.field('password')} />
    {form.errors.password && <span>{form.errors.password}</span>}
    
    <button type="submit" disabled={form.isSubmitting}>
      Login
    </button>
  </form>
);
```

## React 19 Compatibility

### use() Hook

```tsx
// Await promises in render
const k = useKatalyst();
const data = k.react19.use(fetchDataPromise);

// Read context
const theme = k.react19.use(ThemeContext);
```

### useActionState()

```tsx
const [state, action, isPending] = k.react19.actionState(
  async (prevState, formData) => {
    const result = await processForm(formData);
    return result;
  },
  { message: '' }
);
```

### useFormStatus()

```tsx
function SubmitButton() {
  const k = useKatalyst();
  const status = k.react19.formStatus();
  
  return (
    <button disabled={status.pending}>
      {status.pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### useOptimistic()

```tsx
const [optimisticState, addOptimistic] = k.react19.optimistic(
  initialState,
  (state, newValue) => [...state, newValue]
);
```

## Advanced Usage

### Custom Hook Composition

```tsx
function useMyFeature() {
  const k = useKatalyst();
  
  const [data, setData] = k.state([]);
  const debouncedData = k.utils.debounce(data, 500);
  const { filtered } = k.patterns.search(debouncedData, 'name');
  
  return { filtered };
}
```

### Hook Chaining

```tsx
const k = useKatalyst();

const value = k
  .state('initial')
  .$.debounce(500)
  .$.previous();
```

## API Reference

### useKatalyst() Interface

```typescript
interface KatalystHook {
  // State hooks
  state: <T>(initial: T) => [T, (value: T) => void];
  reducer: <S, A>(reducer: Reducer<S, A>, initial: S) => [S, Dispatch<A>];
  ref: <T>(initial: T | null) => RefObject<T>;
  effect: (effect: EffectCallback, deps?: DependencyList) => void;
  memo: <T>(factory: () => T, deps?: DependencyList) => T;
  callback: <T extends Function>(callback: T, deps?: DependencyList) => T;
  
  // DOM hooks
  dom: {
    windowSize: () => { width: number; height: number };
    scrollPosition: () => { x: number; y: number };
    mediaQuery: (query: string) => boolean;
    intersection: (options?: IntersectionObserverInit) => [RefCallback, boolean];
    resize: () => [RefCallback, DOMRectReadOnly];
    clickOutside: () => [RefCallback, boolean];
    keyPress: (key: string, handler: () => void) => void;
    hover: () => [RefCallback, boolean];
  };
  
  // Utility hooks
  utils: {
    debounce: <T>(value: T, delay: number) => T;
    throttle: <T>(value: T, delay: number) => T;
    interval: (callback: () => void, delay: number) => void;
    timeout: (callback: () => void, delay: number) => void;
    async: <T>(fn: () => Promise<T>) => AsyncState<T>;
    localStorage: <T>(key: string, initial: T) => [T, (value: T) => void];
    sessionStorage: <T>(key: string, initial: T) => [T, (value: T) => void];
    previous: <T>(value: T) => T | undefined;
    toggle: (initial: boolean) => [boolean, () => void];
    counter: (initial: number) => [number, CounterActions];
  };
  
  // Pattern hooks
  patterns: {
    modal: () => ModalState;
    search: <T>(items: T[], key: keyof T) => SearchState<T>;
    pagination: <T>(items: T[], perPage: number) => PaginationState<T>;
    form: <T>(config: FormConfig<T>) => FormState<T>;
  };
  
  // Quick access
  $: QuickAccessHooks;
}
```

## Examples

### Complete Form with Validation

```tsx
function LoginForm() {
  const k = useKatalyst();
  
  const form = k.patterns.form({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors: any = {};
      if (!values.email.includes('@')) {
        errors.email = 'Invalid email';
      }
      if (values.password.length < 8) {
        errors.password = 'Password too short';
      }
      return errors;
    },
    onSubmit: async (values) => {
      await login(values);
    }
  });
  
  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <input {...form.field('email')} placeholder="Email" />
        {form.errors.email && <span>{form.errors.email}</span>}
      </div>
      
      <div>
        <input 
          type="password" 
          {...form.field('password')} 
          placeholder="Password" 
        />
        {form.errors.password && <span>{form.errors.password}</span>}
      </div>
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Search with Debounce

```tsx
function SearchableList({ items }: { items: Item[] }) {
  const k = useKatalyst();
  
  const [searchTerm, setSearchTerm] = k.state('');
  const debouncedSearch = k.utils.debounce(searchTerm, 500);
  const { filtered } = k.patterns.search(items, 'name', debouncedSearch);
  
  return (
    <>
      <input 
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <div>
        {filtered.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </>
  );
}
```

## Integration with Other Packages

### With @katalyst/core

```tsx
import { useKatalyst } from '@katalyst/hooks';
import { Button } from '@katalyst/core';

function MyComponent() {
  const k = useKatalyst();
  const [count, setCount] = k.state(0);
  
  return (
    <Button onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  );
}
```

## Best Practices

1. **Use the unified interface** - Access all hooks through `useKatalyst()`
2. **Leverage $ shorthand** - Use `k.$` for common operations
3. **Compose hooks** - Build custom hooks by combining utilities
4. **Follow React rules** - All standard React hook rules apply
5. **Type your hooks** - Use TypeScript for better DX
6. **Memoize expensive operations** - Use `k.memo()` for performance
7. **Clean up effects** - Always return cleanup functions

## Related Documentation

- [Core Package](./core.md) - Components that use hooks
- [Design System](./design-system.md) - UI components with hooks
- [API Package](./api.md) - Data fetching hooks

---

**Version**: N/A (Monorepo)  
**Last Updated**: 2024  
**Status**: Production Ready
