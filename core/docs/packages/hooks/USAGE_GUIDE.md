# Hooks Package - Complete Usage Guide

> **Package:** `@katalyst/hooks`  
> **Purpose:** React hooks for Katalyst framework integration  
> **Status:** Production Ready

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Hooks](#core-hooks)
3. [Advanced Usage](#advanced-usage)
4. [Integration Patterns](#integration-patterns)
5. [Best Practices](#best-practices)

---

## Quick Start

### Installation

```bash
npm install @katalyst/hooks @katalyst/core
# or
yarn add @katalyst/hooks @katalyst/core
# or
pnpm add @katalyst/hooks @katalyst/core
```

### Basic Setup

```tsx
import { useKatalyst } from '@katalyst/hooks';

function App() {
  const { config, updateConfig, isInitialized } = useKatalyst({
    appName: 'My App',
    environment: 'production'
  });

  if (!isInitialized) {
    return <div>Loading Katalyst...</div>;
  }

  return <div>Katalyst initialized: {config.appName}</div>;
}
```

---

## Core Hooks

### `useKatalyst` - Framework Configuration Hook

**Purpose:** Initialize and manage Katalyst framework configuration in your React application.

**Import:**
```tsx
import { useKatalyst } from '@katalyst/hooks';
```

**Signature:**
```typescript
function useKatalyst(initialConfig: KatalystConfig): {
  config: KatalystConfig;
  updateConfig: (updates: Partial<KatalystConfig>) => void;
  isInitialized: boolean;
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initialConfig` | `KatalystConfig` | ✅ | Initial framework configuration |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `config` | `KatalystConfig` | Current configuration state |
| `updateConfig` | `Function` | Update configuration dynamically |
| `isInitialized` | `boolean` | Framework initialization status |

**Usage Example:**

```tsx
import { useKatalyst } from '@katalyst/hooks';

function MyComponent() {
  const { config, updateConfig, isInitialized } = useKatalyst({
    appName: 'MyApp',
    environment: 'production',
    features: {
      multithreading: true,
      devTools: false
    }
  });

  const enableDevTools = () => {
    updateConfig({
      features: {
        ...config.features,
        devTools: true
      }
    });
  };

  return (
    <div>
      <h1>{config.appName}</h1>
      <p>Status: {isInitialized ? 'Ready' : 'Initializing...'}</p>
      <button onClick={enableDevTools}>Enable Dev Tools</button>
    </div>
  );
}
```

**Related Hooks:**
- [`useKatalystRuntime`](./src/use-katalyst-runtime.ts.md) - Advanced runtime control
- [`useKatalystUnified`](./src/use-katalyst-unified.ts.md) - Unified builder integration

---

### `useAdvancedMultithreading` - Thread Management Hook

**Purpose:** Manage multi-threaded operations with advanced task scheduling, priority queues, and resource management.

**Import:**
```tsx
import { useAdvancedMultithreading } from '@katalyst/hooks';
```

**Signature:**
```typescript
function useAdvancedMultithreading(config?: ThreadLifecycleConfig): {
  submitAdvancedTask: <T>(task: AdvancedThreadTask<T>) => Promise<AdvancedTaskResult<T>>;
  taskHistory: Map<string, AdvancedTaskResult>;
  activeOperations: Set<string>;
  performanceMetrics: SystemMetrics;
}
```

**Configuration Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoInitialize` | `boolean` | `true` | Auto-initialize thread pool |
| `workerThreads` | `number` | `4` | Number of worker threads |
| `maxConcurrentThreads` | `number` | `8` | Max concurrent threads |
| `enableProfiling` | `boolean` | `false` | Enable performance profiling |
| `enableAutoScaling` | `boolean` | `true` | Auto-scale thread pool |

**Usage Example:**

```tsx
import { useAdvancedMultithreading } from '@katalyst/hooks';

function DataProcessor() {
  const { submitAdvancedTask, taskHistory, performanceMetrics } = 
    useAdvancedMultithreading({
      workerThreads: 8,
      enableProfiling: true,
      enableAutoScaling: true
    });

  const processData = async () => {
    const task = {
      id: 'data-process-1',
      type: 'cpu' as const,
      operation: 'transform',
      data: { /* large dataset */ },
      priority: 'high' as const,
      timeout: 30000,
      resourceHints: {
        expectedMemory: 512 * 1024 * 1024, // 512MB
        expectedCpuTime: 5000 // 5 seconds
      }
    };

    try {
      const result = await submitAdvancedTask(task);
      console.log('Task completed:', result);
    } catch (error) {
      console.error('Task failed:', error);
    }
  };

  return (
    <div>
      <button onClick={processData}>Process Data</button>
      <div>
        <h3>Performance Metrics</h3>
        <p>Active Threads: {performanceMetrics.totalThreads}</p>
        <p>CPU Usage: {performanceMetrics.cpuUsage}%</p>
        <p>Throughput: {performanceMetrics.throughput} tasks/sec</p>
      </div>
    </div>
  );
}
```

**Advanced Task Configuration:**

```tsx
const advancedTask = {
  id: 'complex-task-1',
  type: 'ai' as const,
  operation: 'inference',
  data: modelInput,
  priority: 'critical' as const,
  timeout: 60000,
  retries: 3,
  dependencies: ['model-load-task'],
  subagentRequirement: 'gpu-worker',
  resourceHints: {
    expectedMemory: 2 * 1024 * 1024 * 1024, // 2GB
    expectedCpuTime: 30000,
    preferredThreadPool: 'gpu-optimized'
  }
};

const result = await submitAdvancedTask(advancedTask);
```

**Task Status Monitoring:**

```tsx
function TaskMonitor() {
  const { taskHistory, activeOperations } = useAdvancedMultithreading();

  return (
    <div>
      <h3>Active Operations: {activeOperations.size}</h3>
      <ul>
        {Array.from(taskHistory.entries()).map(([id, task]) => (
          <li key={id}>
            {id}: {task.status} - {task.executionTime}ms
            {task.error && <span>Error: {task.error}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Related Hooks:**
- [`useMultithreadingContext`](./src/use-multithreading.ts.md) - Lower-level context access
- [`useKatalyst`](./src/use-katalyst.ts.md) - Framework configuration

---

## Integration Patterns

### Pattern 1: Framework + Multithreading

```tsx
import { useKatalyst, useAdvancedMultithreading } from '@katalyst/hooks';

function IntegratedApp() {
  const katalyst = useKatalyst({
    appName: 'Data Pipeline',
    features: { multithreading: true }
  });

  const threading = useAdvancedMultithreading({
    workerThreads: 8,
    enableAutoScaling: katalyst.config.features.multithreading
  });

  // Use both together
  return katalyst.isInitialized ? (
    <DataProcessor threading={threading} />
  ) : (
    <Loading />
  );
}
```

### Pattern 2: With tRPC Integration

```tsx
import { useKatalyst, useTrpc } from '@katalyst/hooks';

function ApiIntegratedApp() {
  const { config } = useKatalyst({ apiUrl: '/api/trpc' });
  const { client, isConnected } = useTrpc({
    url: config.apiUrl
  });

  return (
    <div>
      <p>API Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {/* Use tRPC client */}
    </div>
  );
}
```

---

## Best Practices

### 1. Configuration Management

✅ **DO:** Initialize at app root
```tsx
function App() {
  const katalyst = useKatalyst(config); // At root
  return <KatalystProvider value={katalyst}>...</KatalystProvider>;
}
```

❌ **DON'T:** Initialize in multiple components
```tsx
function BadComponent() {
  const katalyst = useKatalyst(config); // Creates new instance!
  // ...
}
```

### 2. Thread Task Management

✅ **DO:** Set appropriate priorities
```tsx
const highPriorityTask = {
  priority: 'critical', // For user-facing operations
  timeout: 5000
};

const backgroundTask = {
  priority: 'low', // For background processing
  timeout: 60000
};
```

❌ **DON'T:** Make everything high priority
```tsx
const task = {
  priority: 'critical', // Don't overuse!
  // ...
};
```

### 3. Error Handling

✅ **DO:** Handle task failures gracefully
```tsx
try {
  const result = await submitAdvancedTask(task);
  handleSuccess(result);
} catch (error) {
  console.error('Task failed:', error);
  // Fallback logic
  handleFailure(error);
}
```

### 4. Resource Management

✅ **DO:** Provide resource hints
```tsx
const task = {
  resourceHints: {
    expectedMemory: estimateMemoryUsage(data),
    expectedCpuTime: estimateCpuTime(data)
  }
};
```

---

## Performance Optimization

### Thread Pool Tuning

```tsx
const config = {
  workerThreads: navigator.hardwareConcurrency || 4,
  maxConcurrentThreads: navigator.hardwareConcurrency * 2,
  enableAutoScaling: true,
  healthCheckInterval: 5000
};
```

### Task Batching

```tsx
const batchTasks = async (items: any[]) => {
  const tasks = items.map((item, i) => ({
    id: `batch-${i}`,
    type: 'cpu' as const,
    operation: 'process',
    data: item,
    priority: 'normal' as const
  }));

  const results = await Promise.all(
    tasks.map(task => submitAdvancedTask(task))
  );

  return results;
};
```

---

## Troubleshooting

### Common Issues

**Issue:** Hook initialization fails
```tsx
// Solution: Ensure parent component provides context
<MultithreadingProvider>
  <YourComponent />
</MultithreadingProvider>
```

**Issue:** Tasks timing out
```tsx
// Solution: Increase timeout or optimize task
const task = {
  timeout: 60000, // Increase from default 30s
  retries: 3 // Add retry logic
};
```

**Issue:** Memory issues with large tasks
```tsx
// Solution: Use resource hints and chunking
const task = {
  resourceHints: {
    expectedMemory: calculateSize(data),
    preferredThreadPool: 'memory-optimized'
  }
};
```

---

## API Reference

For complete API documentation of all hooks, see:

- [Core Hooks API](./src/core/README.md)
- [Integration Hooks API](./src/integration/README.md)
- [Utility Hooks API](./src/utility/README.md)

---

## Examples

- [Basic Setup Example](../../guides/examples/hooks-basic.md)
- [Advanced Multithreading](../../guides/examples/multithreading-advanced.md)
- [Integration Patterns](../../guides/examples/integration-patterns.md)

---

*Last Updated: 2025-10-02*  
*Version: 1.0.0*
