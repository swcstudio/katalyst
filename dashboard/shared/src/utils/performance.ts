/**
 * Katalyst Performance Utilities
 * 
 * Utilities for optimizing performance across all meta frameworks
 * Includes bundle size optimization, runtime performance, and monitoring
 */

import * as React from 'react';

// =============================================================================
// BUNDLE SIZE OPTIMIZATION
// =============================================================================

/**
 * Dynamic import utility with error handling and loading states
 * 
 * @param importFn - Function that returns a dynamic import promise
 * @param fallback - Fallback component while loading
 * @returns React component with dynamic loading
 */
export function dynamicImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T } | T>,
  fallback?: React.ComponentType
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(async () => {
    try {
      const imported = await importFn();
      
      // Handle both default exports and named exports
      if ('default' in imported) {
        return imported;
      } else {
        return { default: imported as T };
      }
    } catch (error) {
      console.error('Failed to load component:', error);
      
      // Return error boundary component
      return {
        default: ({ children }: { children?: React.ReactNode }) => (
          <div 
            role="alert" 
            className="p-4 border border-red-300 bg-red-50 text-red-800 rounded"
          >
            <h3>Component failed to load</h3>
            <p>Please try refreshing the page.</p>children
          </div>
        )
      };
    }
  });

  const WrappedComponent = React.forwardRef<any, React.ComponentProps<T>>(
    (props, ref) => {
      const FallbackComponent = fallback || DefaultLoadingComponent;
      
      return (
        <React.Suspense fallback={<FallbackComponent />}>
          <LazyComponent {...props} ref={ref} />
        </React.Suspense>
      );
    }
  );

  WrappedComponent.displayName = `DynamicComponent`;
  return WrappedComponent;
}

// Default loading component
const DefaultLoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
    <span className="ml-2 text-sm">Loading...</span>
  </div>
);

/**
 * Preload a component for better perceived performance
 * 
 * @param importFn - Function that returns a dynamic import promise
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  if (typeof window !== 'undefined') {
    // Preload after initial render
    setTimeout(importFn, 100);
  }
}

/**
 * Bundle analyzer utility for development
 */
export const bundleAnalyzer = {
  /**
   * Log component render information in development
   */
  logRender: (componentName: string, props: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Bundle] Rendering ${componentName}`, {
        props: Object.keys(props),
        timestamp: Date.now()
      });
    }
  },

  /**
   * Measure component bundle impact
   */
  measureBundle: (componentName: string) => {
    if (process.env.NODE_ENV === 'development' && 'performance' in window) {
      const startMark = `${componentName}-bundle-start`;
      const endMark = `${componentName}-bundle-end`;
      
      performance.mark(startMark);
      
      return () => {
        performance.mark(endMark);
        performance.measure(`${componentName}-bundle`, startMark, endMark);
      };
    }
    
    return () => {};
  }
};

// =============================================================================
// RUNTIME PERFORMANCE
// =============================================================================

/**
 * Memoization utilities with enhanced debugging
 */
export const memo = {
  /**
   * Enhanced React.memo with debugging
   */
  component: <T extends React.ComponentType<any>>(
    Component: T,
    compare?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean
  ): T => {
    const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
      if (process.env.NODE_ENV === 'development') {
        const componentName = Component.displayName || Component.name || 'Unknown';
        console.log(`[Memo] Comparing props for ${componentName}`, {
          prevProps,
          nextProps,
          shouldUpdate: compare ? !compare(prevProps, nextProps) : false
        });
      }
      
      return compare ? compare(prevProps, nextProps) : false;
    });

    return MemoizedComponent as T;
  },

  /**
   * Smart memoization that ignores functions by default
   */
  smart: <T extends React.ComponentType<any>>(Component: T): T => {
    return React.memo(Component, (prevProps, nextProps) => {
      const prevKeys = Object.keys(prevProps).filter(key => typeof prevProps[key] !== 'function');
      const nextKeys = Object.keys(nextProps).filter(key => typeof nextProps[key] !== 'function');
      
      if (prevKeys.length !== nextKeys.length) return false;
      
      return prevKeys.every(key => prevProps[key] === nextProps[key]);
    }) as T;
  }
};

/**
 * Callback optimization utilities
 */
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  debugName?: string
): T => {
  const memoizedCallback = React.useCallback(callback, deps);
  
  // Debug callback recreations in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && debugName) {
      console.log(`[Callback] ${debugName} recreated`, { deps });
    }
  }, [deps, debugName]);
  
  return memoizedCallback;
};

/**
 * Optimized event handlers that prevent unnecessary re-renders
 */
export const useEventHandler = <T extends Event>(
  handler: (event: T) => void,
  deps: React.DependencyList = []
) => {
  return React.useCallback((event: T) => {
    // Prevent synthetic event pooling issues
    event.persist?.();
    handler(event);
  }, deps);
};

/**
 * Stable reference hook for objects and arrays
 */
export const useStableReference = <T>(value: T): T => {
  const ref = React.useRef<T>(value);
  const [state, setState] = React.useState(value);
  
  // Only update if the value has actually changed (deep comparison for objects)
  React.useEffect(() => {
    if (JSON.stringify(ref.current) !== JSON.stringify(value)) {
      ref.current = value;
      setState(value);
    }
  }, [value]);
  
  return state;
};

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

/**
 * Performance monitoring utilities
 */
export const performance = {
  /**
   * Measure component render time
   */
  measureRender: (componentName: string) => {
    if (typeof window === 'undefined' || !window.performance) return () => {};
    
    const startTime = window.performance.now();
    
    return () => {
      const endTime = window.performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
      
      // Track performance metrics
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`[Performance] Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      return renderTime;
    };
  },

  /**
   * Monitor memory usage (development only)
   */
  measureMemory: (label: string) => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`[Memory] ${label}:`, {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
      });
    }
  },

  /**
   * Track long tasks (tasks that block the main thread)
   */
  trackLongTasks: () => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    
    return () => observer.disconnect();
  },

  /**
   * Measure Core Web Vitals
   */
  measureWebVitals: () => {
    if (typeof window === 'undefined') return;
    
    // Largest Contentful Paint
    const observeLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`[WebVitals] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    };
    
    // First Input Delay
    const observeFID = () => {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          console.log(`[WebVitals] FID: ${fid.toFixed(2)}ms`);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    };
    
    // Cumulative Layout Shift
    const observeCLS = () => {
      let clsScore = 0;
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        console.log(`[WebVitals] CLS: ${clsScore.toFixed(4)}`);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    };
    
    observeLCP();
    observeFID();
    observeCLS();
  }
};

// =============================================================================
// VIRTUALIZATION UTILITIES
// =============================================================================

/**
 * Simple virtualization for large lists
 */
export const useVirtualization = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    offsetY,
    handleScroll,
    totalHeight: items.length * itemHeight
  };
};

// =============================================================================
// IMAGE OPTIMIZATION
// =============================================================================

/**
 * Image loading optimization
 */
export const imageOptimization = {
  /**
   * Lazy load images with intersection observer
   */
  useLazyImage: (src: string, options?: IntersectionObserverInit) => {
    const [imageSrc, setImageSrc] = React.useState<string>();
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const imgRef = React.useRef<HTMLImageElement>(null);
    
    React.useEffect(() => {
      if (!imgRef.current) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        },
        options
      );
      
      observer.observe(imgRef.current);
      
      return () => observer.disconnect();
    }, [src, options]);
    
    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setIsError(true);
    
    return {
      imgRef,
      imageSrc,
      isLoaded,
      isError,
      handleLoad,
      handleError
    };
  },

  /**
   * Preload critical images
   */
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }
};

// =============================================================================
// DEBOUNCE AND THROTTLE
// =============================================================================

/**
 * Debounce hook for expensive operations
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

/**
 * Throttle hook for high-frequency events
 */
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const lastCall = React.useRef<number>(0);
  
  return React.useCallback(((...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }) as T, [callback, delay]);
};

// =============================================================================
// DEVELOPMENT UTILITIES
// =============================================================================

/**
 * Development-only performance profiler
 */
export const Profiler: React.FC<{
  id: string;
  children: React.ReactNode;
  onRender?: (id: string, phase: string, actualDuration: number) => void;
}> = ({ id, children, onRender }) => {
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }
  
  return (
    <React.Profiler
      id={id}
      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) => {
        console.log(`[Profiler] ${id}:`, 
          phase,
          actualDuration: `$actualDuration.toFixed(2)ms`,
          baseDuration: `$baseDuration.toFixed(2)ms`,
          startTime: `$startTime.toFixed(2)ms`,
          commitTime: `$commitTime.toFixed(2)ms`
        });
        
        onRender?.(id, phase, actualDuration);
      }}
    >
      {children}
    </React.Profiler>
  );
};

/**
 * Component render counter for debugging
 */
export const useRenderCount = (componentName: string) => {
  const renderCount = React.useRef(0);
  
  React.useEffect(() => {
    renderCount.current += 1;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[RenderCount] $componentName: $renderCount.current`);
    }
  });
  
  return renderCount.current;
};

// Export all utilities
export default {
  dynamicImport,
  preloadComponent,
  bundleAnalyzer,
  memo,
  useOptimizedCallback,
  useEventHandler,
  useStableReference,
  performance,
  useVirtualization,
  imageOptimization,
  useDebounce,
  useThrottle,
  Profiler,
  useRenderCount
};