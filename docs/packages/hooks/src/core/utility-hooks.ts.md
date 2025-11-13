# utility-hooks.ts

> Source: `src/core/utility-hooks.ts`

**Package:** `@katalyst/hooks`

## Overview

This module is part of the `@katalyst/hooks` package.

## Dependencies

- `./common-hooks`
- `./common-hooks`

## Exports

### `useDebounce`

<!-- TODO: Add detailed documentation for useDebounce -->

### `useThrottle`

<!-- TODO: Add detailed documentation for useThrottle -->

### `useToggle`

<!-- TODO: Add detailed documentation for useToggle -->

### `useCounter`

<!-- TODO: Add detailed documentation for useCounter -->

### `usePrevious`

<!-- TODO: Add detailed documentation for usePrevious -->

### `useAsync`

<!-- TODO: Add detailed documentation for useAsync -->

### `useInterval`

<!-- TODO: Add detailed documentation for useInterval -->

### `useTimeout`

<!-- TODO: Add detailed documentation for useTimeout -->

### `useFetch`

<!-- TODO: Add detailed documentation for useFetch -->

### `useMount`

<!-- TODO: Add detailed documentation for useMount -->

### `useUnmount`

<!-- TODO: Add detailed documentation for useUnmount -->

### `useUpdateEffect`

<!-- TODO: Add detailed documentation for useUpdateEffect -->

## Source Code

```typescript
/**
 * Utility hooks for common patterns and operations
 */

import { useRef, useCallback, useEffect } from './common-hooks';
import { useState } from './common-hooks';

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Toggle hook
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

// Counter hook
export function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value: number) => setCount(value), []);

  return { count, increment, decrement, reset, set };
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

// Async operation hook
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response: T) => {
        setValue(response);
        setStatus('success');
      })
      .catch((error: any) => {
        setError(error.message || 'An error occurred');
        setStatus('error');
      });
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { execute, status, value, error };
}

// Interval hook
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Timeout hook
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

// Fetch hook
export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
}

// Mount hook
export function useMount(callback: () => void) {
  useEffect(() => {
    callback();
  }, []);
}

// Unmount hook
export function useUnmount(callback: () => void) {
  useEffect(() => {
    return callback;
  }, []);
}

// Update effect (skips first render)
export function useUpdateEffect(effect: () => void | (() => void), deps: any[]) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    return effect();
  }, deps);
}

```

---

*Generated documentation for @katalyst/hooks*
