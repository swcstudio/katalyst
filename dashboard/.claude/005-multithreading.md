# Multithreading & Rust Toolchain

## Overview

Katalyst-React's multithreading module represents a groundbreaking approach to web performance, bringing native Rust performance to JavaScript applications. By leveraging Rust's fearless concurrency model through NAPI bindings, Katalyst enables true parallel processing in web applications, something traditionally limited by JavaScript's single-threaded nature.

## Architecture

### Technology Stack
- **Rust**: Core implementation language
- **NAPI-RS**: Node.js API bindings for Rust
- **Crossbeam**: Lock-free concurrent data structures
- **Rayon**: Data parallelism library
- **Tokio**: Asynchronous runtime
- **Web Workers**: Browser-side parallel execution

### Module Structure
```
shared/src/native/
├── src/
│   ├── lib.rs           # Main module entry point
│   ├── crossbeam.rs     # Crossbeam implementations
│   ├── rayon.rs         # Rayon thread pool
│   └── tokio.rs         # Async runtime
├── Cargo.toml           # Rust dependencies
├── build.rs             # Build configuration
├── index.js             # JavaScript bindings
└── index.d.ts           # TypeScript definitions
```

## Core Components

### 1. Crossbeam - Lock-Free Data Structures

Crossbeam provides high-performance concurrent data structures without locks:

#### Channels
```typescript
import { createCrossbeamChannel } from '@katalyst/shared';

// Create a bounded channel with capacity 100
const channel = createCrossbeamChannel(100);

// Producer thread
async function producer() {
  for (let i = 0; i < 1000; i++) {
    await channel.send(`Message ${i}`);
  }
}

// Consumer thread
async function consumer() {
  while (true) {
    const message = await channel.receive();
    if (message) {
      console.log('Received:', message);
    }
  }
}

// Run in parallel
Promise.all([producer(), consumer()]);
```

#### Atomic Cell
```typescript
import { createCrossbeamAtomicCell } from '@katalyst/shared';

const counter = createCrossbeamAtomicCell(0);

// Thread-safe operations
counter.store(42);
const value = counter.load();
const oldValue = counter.swap(100);
const wasUpdated = counter.compareExchange(100, 200);

// Atomic arithmetic
counter.fetchAdd(10);
counter.fetchSub(5);
```

#### Array Queue (Bounded)
```typescript
import { createCrossbeamArrayQueue } from '@katalyst/shared';

const queue = createCrossbeamArrayQueue(1000);

// Producer threads can push
const pushed = queue.push('item'); // returns false if full

// Consumer threads can pop
const item = queue.pop(); // returns undefined if empty

// Check status
console.log(queue.len(), queue.capacity(), queue.isFull());
```

#### Segment Queue (Unbounded)
```typescript
import { createCrossbeamSegQueue } from '@katalyst/shared';

const queue = createCrossbeamSegQueue();

// Push without worrying about capacity
queue.push('item1');
queue.push('item2');

// Pop items
const item = queue.pop();
```

### 2. Rayon - Data Parallelism

Rayon enables parallel iteration and computation:

#### Parallel Map
```typescript
import { useMultithreading } from '@katalyst/shared';

function DataProcessor() {
  const { parallelMap, initializeRayon } = useMultithreading();

  useEffect(() => {
    initializeRayon({ numThreads: 8 });
  }, []);

  const processImages = async (images: ImageData[]) => {
    // Process images in parallel across 8 threads
    const processed = await parallelMap(images, (image) => {
      // CPU-intensive image processing
      return applyFilters(image);
    });
    
    return processed;
  };
}
```

#### Parallel Reduce
```typescript
const { parallelReduce } = useMultithreading();

// Sum large array in parallel
const numbers = Array.from({ length: 10000000 }, (_, i) => i);
const sum = await parallelReduce(
  numbers,
  (acc, val) => acc + val,
  0 // initial value
);

// Find max value in parallel
const max = await parallelReduce(
  numbers,
  (acc, val) => Math.max(acc, val),
  -Infinity
);
```

#### Parallel Filter
```typescript
const { parallelFilter } = useMultithreading();

const largeDataset = generateDataset(1000000);

// Filter in parallel
const filtered = await parallelFilter(largeDataset, (item) => {
  // Complex filtering logic
  return item.score > 0.8 && validateItem(item);
});
```

#### Custom Thread Pool
```typescript
import { createRayonThreadPool } from '@katalyst/shared';

// Create custom thread pool
const pool = createRayonThreadPool({
  numThreads: 4,
  stackSize: 2 * 1024 * 1024, // 2MB stack per thread
  threadName: 'ImageProcessor',
});

// Use the pool
const result = await pool.execute(async () => {
  // Work executed in thread pool
  return processLargeDataset();
});
```

### 3. Tokio - Async Runtime

Tokio provides an asynchronous runtime for concurrent I/O operations:

#### Async Tasks
```typescript
import { createTokioRuntime } from '@katalyst/shared';

const runtime = createTokioRuntime({
  workerThreads: 4,
  maxBlockingThreads: 512,
});

// Spawn async task
const taskHandle = await runtime.spawn(async () => {
  const data = await fetchDataAsync();
  const processed = await processAsync(data);
  return processed;
});

// Wait for result
const result = await taskHandle.await();
```

#### MPSC Channel
```typescript
import { createTokioMpscChannel } from '@katalyst/shared';

const channel = createTokioMpscChannel();

// Multiple producers
async function producer(id: number) {
  for (let i = 0; i < 100; i++) {
    await channel.send({ id, value: i });
  }
}

// Single consumer
async function consumer() {
  while (true) {
    const msg = await channel.receive();
    if (msg) {
      console.log(`From producer ${msg.id}: ${msg.value}`);
    }
  }
}

// Run multiple producers
Promise.all([
  producer(1),
  producer(2),
  producer(3),
  consumer(),
]);
```

#### Broadcast Channel
```typescript
import { createTokioBroadcastChannel } from '@katalyst/shared';

const channel = createTokioBroadcastChannel(100);

// Multiple subscribers
const sub1 = channel.subscribe();
const sub2 = channel.subscribe();

// Broadcast to all
channel.send('Hello all subscribers!');

// Each subscriber receives the message
const msg1 = await sub1.receive();
const msg2 = await sub2.receive();
```

#### Timers
```typescript
import { createTokioTimer } from '@katalyst/shared';

const timer = createTokioTimer();

// Sleep for duration
await timer.sleep(1000); // 1 second

// Execute at interval
const intervalId = timer.interval(100, () => {
  console.log('Tick every 100ms');
});

// Cancel interval
timer.cancelInterval(intervalId);

// Timeout a promise
const result = await timer.timeout(
  fetchSlowData(),
  5000 // 5 second timeout
);
```

## Integration with React

### MultithreadingProvider Setup
```typescript
import { MultithreadingProvider } from '@katalyst/shared';

function App() {
  return (
    <MultithreadingProvider
      config={{
        rayon: {
          numThreads: navigator.hardwareConcurrency || 4,
          stackSize: 2 * 1024 * 1024,
        },
        tokio: {
          workerThreads: 4,
          maxBlockingThreads: 512,
        },
        enableMetrics: true,
        enableProfiling: process.env.NODE_ENV === 'development',
      }}
    >
      <YourApp />
    </MultithreadingProvider>
  );
}
```

### Custom Hooks

#### useParallelState
```typescript
import { useParallelState } from '@katalyst/shared';

function DataGrid({ data }: { data: any[] }) {
  const [processedData, setProcessedData] = useParallelState(data, {
    processor: (items) => items.map(complexTransform),
    chunkSize: 1000,
    maxThreads: 4,
  });

  return <Grid data={processedData} />;
}
```

#### useAsyncComputation
```typescript
import { useAsyncComputation } from '@katalyst/shared';

function Analytics() {
  const { execute, result, isRunning, error } = useAsyncComputation();

  const analyzeData = () => {
    execute(async (worker) => {
      const stats = await worker.computeStatistics(largeDataset);
      const visualization = await worker.generateVisualization(stats);
      return { stats, visualization };
    });
  };

  return (
    <div>
      <button onClick={analyzeData} disabled={isRunning}>
        Analyze Data
      </button>
      {result && <VisualizationComponent data={result} />}
      {error && <ErrorDisplay error={error} />}
    </div>
  );
}
```

#### useWorkerPool
```typescript
import { useWorkerPool } from '@katalyst/shared';

function ImageProcessor() {
  const pool = useWorkerPool({
    size: 4,
    taskTimeout: 30000,
    idleTimeout: 60000,
  });

  const processImages = async (images: File[]) => {
    const tasks = images.map(image => 
      pool.execute(async (worker) => {
        const bitmap = await createImageBitmap(image);
        return worker.processImage(bitmap);
      })
    );

    const results = await Promise.all(tasks);
    return results;
  };

  return (
    <ImageUploader onUpload={processImages} />
  );
}
```

## Real-World Use Cases

### 1. Data Visualization
```typescript
function DataVisualization({ dataset }: { dataset: DataPoint[] }) {
  const { parallelMap, parallelReduce } = useMultithreading();
  const [processedData, setProcessedData] = useState(null);

  const processDataset = async () => {
    // Parallel aggregation
    const aggregated = await parallelReduce(
      dataset,
      (acc, point) => {
        acc[point.category] = (acc[point.category] || 0) + point.value;
        return acc;
      },
      {}
    );

    // Parallel transformation for visualization
    const visualData = await parallelMap(
      Object.entries(aggregated),
      ([category, value]) => ({
        category,
        value,
        percentage: (value / total) * 100,
        color: generateColor(category),
      })
    );

    setProcessedData(visualData);
  };

  return <Chart data={processedData} />;
}
```

### 2. Real-Time Analytics
```typescript
function RealTimeAnalytics() {
  const channel = createCrossbeamChannel(1000);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    // Producer: collect events
    const eventListener = (event) => {
      channel.send(event);
    };

    // Consumer: process events in parallel
    const processor = async () => {
      const runtime = createTokioRuntime();
      
      while (true) {
        const events = [];
        // Batch receive
        for (let i = 0; i < 100; i++) {
          const event = channel.receive();
          if (event) events.push(event);
          else break;
        }

        if (events.length > 0) {
          const processed = await runtime.spawn(async () => {
            return processEventBatch(events);
          });

          setMetrics(prev => mergeMetrics(prev, processed));
        }
      }
    };

    window.addEventListener('analytics', eventListener);
    processor();

    return () => {
      window.removeEventListener('analytics', eventListener);
    };
  }, []);

  return <MetricsDashboard metrics={metrics} />;
}
```

### 3. Machine Learning Inference
```typescript
function MLInference({ model, inputData }) {
  const { createWorkerPool } = useMultithreading();
  const [predictions, setPredictions] = useState([]);

  const runInference = async () => {
    const pool = createWorkerPool({ size: 4 });

    // Load model in each worker
    await pool.broadcast(async (worker) => {
      await worker.loadModel(model);
    });

    // Parallel inference
    const chunks = chunkArray(inputData, Math.ceil(inputData.length / 4));
    const results = await Promise.all(
      chunks.map(chunk => 
        pool.execute(async (worker) => {
          return worker.predict(chunk);
        })
      )
    );

    setPredictions(results.flat());
    pool.terminate();
  };

  return (
    <div>
      <button onClick={runInference}>Run Inference</button>
      <PredictionResults predictions={predictions} />
    </div>
  );
}
```

## Performance Optimization

### 1. Thread Pool Sizing
```typescript
function getOptimalThreadCount() {
  const cores = navigator.hardwareConcurrency || 4;
  
  // For CPU-bound tasks
  const cpuBound = cores;
  
  // For I/O-bound tasks
  const ioBound = cores * 2;
  
  // For mixed workloads
  const mixed = Math.floor(cores * 1.5);
  
  return { cpuBound, ioBound, mixed };
}
```

### 2. Chunk Size Optimization
```typescript
function calculateOptimalChunkSize(dataSize: number, threadCount: number) {
  // Ensure at least 1000 items per chunk for efficiency
  const minChunkSize = 1000;
  
  // But not more than 100,000 to avoid memory issues
  const maxChunkSize = 100000;
  
  const idealChunkSize = Math.ceil(dataSize / (threadCount * 4));
  
  return Math.max(minChunkSize, Math.min(maxChunkSize, idealChunkSize));
}
```

### 3. Memory Management
```typescript
const { parallelMapChunked } = useMultithreading();

// Process large dataset in chunks to manage memory
const results = await parallelMapChunked(
  hugeArray,
  (item) => processItem(item),
  {
    chunkSize: 10000,
    maxMemoryMB: 512,
    gcThreshold: 0.8, // GC when 80% memory used
  }
);
```

## Debugging & Profiling

### Enable Profiling
```typescript
const { enableProfiling, getProfile } = useMultithreading();

// Enable profiling
enableProfiling(true);

// Run operations
await parallelMap(data, processor);

// Get profile data
const profile = getProfile();
console.log('Thread utilization:', profile.threadUtilization);
console.log('Average task duration:', profile.avgTaskDuration);
console.log('Task throughput:', profile.tasksPerSecond);
```

### Debug Mode
```typescript
<MultithreadingProvider
  config={{
    debug: true,
    logLevel: 'verbose',
    onError: (error) => {
      console.error('Multithreading error:', error);
      // Send to error tracking
    },
  }}
>
```

### Performance Metrics
```typescript
import { useMultithreadingMetrics } from '@katalyst/shared';

function PerformanceMonitor() {
  const metrics = useMultithreadingMetrics();

  return (
    <div>
      <h3>Multithreading Performance</h3>
      <p>Active Threads: {metrics.activeThreads}</p>
      <p>Queued Tasks: {metrics.queuedTasks}</p>
      <p>Completed Tasks: {metrics.completedTasks}</p>
      <p>Average Duration: {metrics.avgDuration}ms</p>
      <p>Throughput: {metrics.throughput} tasks/sec</p>
      <p>CPU Usage: {metrics.cpuUsage}%</p>
    </div>
  );
}
```

## Browser Compatibility

### Requirements
- SharedArrayBuffer support
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Embedder-Policy: require-corp

### Setup Headers
```typescript
// next.config.js or server configuration
export default {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};
```

### Fallback for Unsupported Browsers
```typescript
import { useMultithreading } from '@katalyst/shared';

function App() {
  const { isSupported } = useMultithreading();

  if (!isSupported) {
    return <FallbackApp />; // Single-threaded version
  }

  return <MultithreadedApp />;
}
```

## Best Practices

### 1. Task Granularity
- Keep tasks between 1-100ms for optimal scheduling
- Batch small operations together
- Split very large operations

### 2. Data Transfer
- Minimize data transfer between threads
- Use SharedArrayBuffer for large datasets
- Consider transferable objects

### 3. Error Handling
```typescript
const { parallelMap } = useMultithreading();

try {
  const results = await parallelMap(
    data,
    (item) => processItem(item),
    {
      onError: (error, item, index) => {
        console.error(`Error processing item ${index}:`, error);
        return null; // Default value
      },
      retries: 3,
      timeout: 5000,
    }
  );
} catch (error) {
  // Handle fatal errors
}
```

### 4. Resource Cleanup
```typescript
function Component() {
  const { createWorkerPool } = useMultithreading();
  const poolRef = useRef(null);

  useEffect(() => {
    poolRef.current = createWorkerPool({ size: 4 });

    return () => {
      // Clean up on unmount
      poolRef.current?.terminate();
    };
  }, []);
}
```

## Next Steps

- [006-build-system.md](./006-build-system.md) - Understanding the build system
- [007-next-integration.md](./007-next-integration.md) - Next.js integration
- [008-remix-integration.md](./008-remix-integration.md) - Remix integration
- [009-performance-guide.md](./009-performance-guide.md) - Performance optimization