# @katalyst/multithreading

Advanced multithreading system for React 19 with Rust-powered Crossbeam, Rayon, and Tokio for high-performance parallel processing.

## Overview

`@swcstudio/multithreading` provides production-ready multithreading capabilities with controllable thread management, lock-free data structures, and async runtime support. Built with Rust and exposed to JavaScript through NAPI.

### Key Features

- 🚀 **Rust-Powered** - Zero-overhead abstractions with Crossbeam, Rayon, and Tokio
- 🎛️ **Full Control** - Granular control over thread pools, channels, and async runtimes
- 🔄 **Multiple Paradigms** - Support for parallel processing, channels, and async operations
- 🛡️ **Memory Safe** - Lock-free data structures with atomic operations
- 📊 **Benchmarking** - Built-in performance testing and stress testing
- 🔧 **Easy Integration** - Simple JavaScript API with TypeScript support
- ⚡ **High Performance** - Native speed with JavaScript convenience

## Installation

```bash
npm install @swcstudio/multithreading
```

## Quick Start

```javascript
import { threadController } from '@swcstudio/multithreading';

// Initialize the multithreading system
await threadController.initialize({
  rayonThreads: 4,
  tokioWorkerThreads: 2
});

// Create a thread pool
const pool = threadController.createThreadPool('processing', {
  threads: 4,
  threadName: 'worker'
});

// Parallel processing
const data = Array.from({ length: 1000000 }, (_, i) => i);
const squared = await pool.map(data, 'square');
const sum = await pool.reduce(squared, 'sum');

console.log('Sum of squares:', sum);

// Cleanup
await threadController.shutdown();
```

## Thread Pools

### Creating Thread Pools

```javascript
const pool = threadController.createThreadPool('data-processing', {
  threads: 4,
  threadName: 'data-worker',
  stackSize: 1024 * 1024, // 1MB stack size
  panicHandler: true
});
```

### Map Operation

```javascript
// Transform each element in parallel
const numbers = [1, 2, 3, 4, 5];
const doubled = await pool.map(numbers, 'double');
// Result: [2, 4, 6, 8, 10]
```

### Reduce Operation

```javascript
// Aggregate elements in parallel
const numbers = [1, 2, 3, 4, 5];
const sum = await pool.reduce(numbers, 'sum', 0);
// Result: 15
```

### Filter Operation

```javascript
// Select elements based on condition
const numbers = [1, 2, 3, 4, 5, 6];
const evens = await pool.filter(numbers, 'even');
// Result: [2, 4, 6]
```

### Sort Operation

```javascript
// Sort in parallel
const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
const sorted = await pool.sort(numbers, false); // ascending
// Result: [1, 1, 2, 3, 4, 5, 6, 9]
```

### Chunk Processing

```javascript
// Process data in batches
const data = [1, 2, 3, 4, 5, 6, 7, 8];
const chunkSums = await pool.chunkProcess(data, 2, 'sum_chunks');
// Processes [1,2], [3,4], [5,6], [7,8] separately
```

## Channels

### Crossbeam Channels

```javascript
// Unbounded channel
const unbounded = threadController.createChannel('messages', {
  type: 'crossbeam'
});

unbounded.send('Hello');
const message = unbounded.receive();
console.log(message); // 'Hello'

// Bounded channel
const bounded = threadController.createChannel('tasks', {
  type: 'crossbeam',
  bounded: 100
});

// Check status
console.log('Is empty:', bounded.isEmpty());
console.log('Is full:', bounded.isFull());
console.log('Length:', bounded.len());
```

### Array Queue

```javascript
// Fixed-capacity queue
const queue = threadController.createChannel('queue', {
  type: 'crossbeam-array',
  capacity: 1000
});

for (let i = 0; i < 100; i++) {
  queue.send(`task-${i}`);
}

while (!queue.isEmpty()) {
  const task = queue.receive();
  console.log('Processing:', task);
}
```

### Tokio Channels

```javascript
// Broadcast channel
const broadcast = threadController.createChannel('notifications', {
  type: 'tokio-broadcast',
  capacity: 100
});

broadcast.send('System update');
console.log('Receivers:', broadcast.receiverCount());

// MPSC channel
const mpsc = threadController.createChannel('mpsc', {
  type: 'tokio-mpsc',
  capacity: 50
});
```

## Atomic Operations

### Atomic Cells

```javascript
const counter = threadController.createAtomicCell('counter', 0);

// Atomic operations
counter.increment(); // Returns old value
counter.decrement(); // Returns old value
counter.fetchAdd(5); // Add 5, return old value
counter.store(100); // Set to 100
const current = counter.load(); // Get current value
```

### Use Case: Shared Counter

```javascript
// Simulate concurrent access
const shared = threadController.createAtomicCell('shared-counter', 0);

const operations = Array.from({ length: 1000 }, () => 
  shared.fetchAdd(1)
);

console.log('Final value:', shared.load()); // Should be 1000
```

## Tokio Runtime

### Creating Runtimes

```javascript
const runtime = threadController.createRuntime('async-tasks', {
  workerThreads: 2,
  maxBlockingThreads: 4,
  threadName: 'tokio-worker',
  enableIo: true,
  enableTime: true
});
```

### Delay Operations

```javascript
const result = await runtime.delay(1000, 'Task completed');
console.log(result); // After 1 second: 'Task completed'
```

### Parallel Tasks

```javascript
const tasks = ['download', 'process', 'upload', 'cleanup'];
const results = await runtime.parallelTasks(tasks, 500);
// Each task runs for 500ms in parallel
```

### Timeout Handling

```javascript
try {
  const result = await runtime.timeout(2000, 1000, 'long-running-task');
  console.log('Completed:', result);
} catch (error) {
  console.log('Task timed out after 2 seconds');
}
```

### Timer

```javascript
const timer = runtime.createTimer();
// ... do work ...
console.log(`Operation took ${timer.elapsedMs()}ms`);
timer.reset();
// ... do more work ...
console.log(`Next operation took ${timer.elapsedMs()}ms`);
```

## Performance

### Benchmarking

```javascript
const benchmarks = await threadController.benchmark({
  dataSize: 1000000,
  operations: [
    'sequential_sum',
    'parallel_sum',
    'sequential_square',
    'parallel_square'
  ]
});

console.log('Benchmarks:', benchmarks);
// {
//   sequential_sum: { operation: 'sequential_sum', durationMs: 15, throughput: 66666 },
//   parallel_sum: { operation: 'parallel_sum', durationMs: 4, throughput: 250000 },
//   ...
// }
```

### Stress Testing

```javascript
const results = await threadController.stressTest({
  numTasks: 1000,
  taskDurationMs: 10
});

console.log(`Completed ${results.length} tasks`);
console.log(`Average time: ${results.reduce((a, b) => a + b, 0) / results.length}ms`);
```

### System Information

```javascript
const sysInfo = threadController.getSystemInfo();
console.log('CPU cores:', sysInfo.cpuCores);
console.log('Rayon threads:', sysInfo.rayonThreads);
console.log('Tokio workers:', sysInfo.tokioWorkerThreads);

const metrics = threadController.getPerformanceMetrics();
console.log('Memory usage:', metrics.memoryUsageMb, 'MB');
console.log('Active threads:', metrics.activeThreads);
```

## React Integration

### useMultithreading Hook

```tsx
import { useMultithreading } from '@katalyst/multithreading/react';

function DataProcessor() {
  const { initialize, createThreadPool } = useMultithreading();
  
  useEffect(() => {
    initialize({
      rayonThreads: navigator.hardwareConcurrency || 4
    });
  }, []);
  
  const processData = async (data: number[]) => {
    const pool = threadController.createThreadPool('processing');
    const result = await pool.map(data, 'transform');
    pool.destroy();
    return result;
  };
  
  return <button onClick={() => processData([1,2,3])}>Process</button>;
}
```

### Concurrent State Updates

```tsx
import { threadController } from '@swcstudio/multithreading';

function ParallelSearch() {
  const [results, setResults] = useState([]);
  
  const search = async (queries: string[]) => {
    const pool = threadController.createThreadPool('search');
    const allResults = await pool.map(queries, async (query) => {
      return await searchAPI(query);
    });
    setResults(allResults.flat());
  };
  
  return <SearchInterface onSearch={search} results={results} />;
}
```

## Advanced Usage

### Producer-Consumer Pattern

```javascript
const channel = threadController.createChannel('producer-consumer', {
  type: 'crossbeam',
  bounded: 100
});

// Producer
async function producer() {
  for (let i = 0; i < 1000; i++) {
    channel.send(`task-${i}`);
    await sleep(10);
  }
  channel.send(null); // Signal end
}

// Consumer
async function consumer() {
  while (true) {
    const task = channel.receive();
    if (task === null) break;
    await processTask(task);
  }
}

// Run both
Promise.all([producer(), consumer()]);
```

### Pipeline Processing

```javascript
// Stage 1: Load data
const loadPool = threadController.createThreadPool('load', { threads: 2 });
const loadedData = await loadPool.map(files, 'load');

// Stage 2: Transform
const transformPool = threadController.createThreadPool('transform', { threads: 4 });
const transformedData = await transformPool.map(loadedData, 'transform');

// Stage 3: Save
const savePool = threadController.createThreadPool('save', { threads: 2 });
await savePool.map(transformedData, 'save');

// Cleanup
[loadPool, transformPool, savePool].forEach(p => p.destroy());
```

## API Reference

### ThreadController

```typescript
class ThreadController {
  // Initialize system
  initialize(options?: ThreadControllerOptions): Promise<boolean>;
  
  // Create thread pool
  createThreadPool(name: string, config?: ThreadPoolConfig): ThreadPoolController;
  
  // Create channel
  createChannel(name: string, config?: ChannelConfig): ChannelController;
  
  // Create atomic cell
  createAtomicCell(name: string, initialValue?: number): AtomicCellController;
  
  // Create Tokio runtime
  createRuntime(name: string, config?: RuntimeConfig): RuntimeController;
  
  // Benchmarking
  benchmark(config: BenchmarkConfig): Promise<BenchmarkResults>;
  stressTest(config: StressTestConfig): Promise<number[]>;
  
  // System info
  getSystemInfo(): SystemInfo;
  getPerformanceMetrics(): PerformanceMetrics;
  
  // Shutdown
  shutdown(): Promise<void>;
}
```

## Examples

### Image Processing

```javascript
import { threadController } from '@swcstudio/multithreading';

async function processImages(images: string[]) {
  await threadController.initialize({ rayonThreads: 8 });
  
  const pool = threadController.createThreadPool('image-processing', {
    threads: 8
  });
  
  const processed = await pool.map(images, async (imagePath) => {
    // Heavy image processing in parallel
    return await processImage(imagePath);
  });
  
  pool.destroy();
  return processed;
}
```

### Data Aggregation

```javascript
async function aggregateData(dataset: number[][]) {
  const pool = threadController.createThreadPool('aggregation');
  
  // Process each subset in parallel
  const subSums = await pool.map(dataset, subset => {
    return subset.reduce((a, b) => a + b, 0);
  });
  
  // Final aggregation
  const total = await pool.reduce(subSums, 'sum', 0);
  
  pool.destroy();
  return total;
}
```

## Integration with Other Packages

### With @katalyst/ai

```javascript
import { ClaudeAgent } from '@katalyst/ai';
import { threadController } from '@swcstudio/multithreading';

// Process multiple AI requests in parallel
const pool = threadController.createThreadPool('ai-processing');
const requests = ['Question 1', 'Question 2', 'Question 3'];

const responses = await pool.map(requests, async (request) => {
  const agent = new ClaudeAgent({ apiKey: process.env.ANTHROPIC_API_KEY });
  return await agent.chat(request);
});
```

## Best Practices

1. **Initialize once** - Call `initialize()` at app startup
2. **Reuse pools** - Create pools once, reuse for multiple operations
3. **Size appropriately** - Match thread count to CPU cores
4. **Clean up** - Always destroy pools when done
5. **Use bounded channels** - Prevent memory issues with bounded channels
6. **Benchmark** - Use built-in benchmarking to optimize
7. **Handle errors** - Wrap operations in try-catch blocks

## Troubleshooting

### High Memory Usage

```javascript
// Use bounded channels
const channel = threadController.createChannel('bounded', {
  type: 'crossbeam',
  bounded: 1000 // Limit queue size
});

// Destroy pools when done
pool.destroy();
```

### Thread Exhaustion

```javascript
// Don't create too many threads
const pool = threadController.createThreadPool('safe', {
  threads: Math.min(navigator.hardwareConcurrency, 8)
});
```

## Related Documentation

- [AI Package](./ai.md) - Parallel AI processing
- [API Package](./api.md) - Parallel API calls
- [Core Package](./core.md) - Using in React components

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
