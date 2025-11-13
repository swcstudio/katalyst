# Individual Hooks Documentation

This section provides detailed documentation for each individual hook in the Katalyst Hooks package.

## Core Hooks

### useKatalyst

The core hook for initializing and managing Katalyst functionality.

#### Signature
```typescript
function useKatalyst(options?: UseKatalystOptions): UseKatalystReturn
```

#### Parameters
- `options` (optional): Configuration options for Katalyst initialization

#### Options Interface
```typescript
interface UseKatalystOptions {
  apiKey?: string;                    // Katalyst API key
  projectPath?: string;               // Project root path
  config?: KatalystConfig;            // Custom configuration
  enableAI?: boolean;                 // Enable AI features (default: true)
  enableOptimization?: boolean;       // Enable code optimization (default: true)
  environment?: 'development' | 'production' | 'test';
  plugins?: KatalystPlugin[];         // Additional plugins
}
```

#### Return Value
```typescript
interface UseKatalystReturn {
  config: KatalystConfig;             // Current configuration
  ai: AIManager;                      // AI management interface
  optimizer: CodeOptimizer;           // Code optimization interface
  analyzer: CodeAnalyzer;             // Code analysis interface
  updateConfig: (config: Partial<KatalystConfig>) => void;
  reset: () => void;                  // Reset to default configuration
  restart: () => void;                // Restart Katalyst services
}
```

#### Example
```typescript
import { useKatalyst } from '@katalyst/hooks';

function App() {
  const katalyst = useKatalyst({
    apiKey: process.env.KATALYST_API_KEY,
    enableAI: true,
    environment: 'development',
  });

  React.useEffect(() => {
    // Initialize AI features
    katalyst.ai.initialize();
  }, [katalyst]);

  return <div>{/* App content */}</div>;
}
```

### useKatalystRuntime

Manages the Katalyst runtime environment and provides access to runtime capabilities.

#### Signature
```typescript
function useKatalystRuntime(): RuntimeState
```

#### Return Value
```typescript
interface RuntimeState {
  isInitialized: boolean;             // Runtime initialization status
  environment: 'development' | 'production' | 'test';
  features: string[];                 // Available features
  performance: PerformanceMetrics;    // Current performance metrics
  capabilities: RuntimeCapabilities;  // Available capabilities
  resources: ResourceStatus;          // Resource utilization status
}

interface PerformanceMetrics {
  cpu: number;                        // CPU usage percentage
  memory: number;                     // Memory usage in MB
  bundleSize: number;                 // Current bundle size in KB
  buildTime: number;                  // Last build time in ms
  hotReloadTime: number;              // Hot reload time in ms
}

interface RuntimeCapabilities {
  multithreading: boolean;            // Multithreading support
  webWorkers: boolean;                // Web Workers support
  wasm: boolean;                      // WebAssembly support
  serviceWorker: boolean;             // Service Worker support
  ssr: boolean;                       // Server-side rendering support
}
```

#### Example
```typescript
import { useKatalystRuntime } from '@katalyst/hooks';

function RuntimeStatus() {
  const runtime = useKatalystRuntime();

  return (
    <div>
      <h3>Runtime Status</h3>
      <p>Environment: {runtime.environment}</p>
      <p>CPU Usage: {runtime.performance.cpu}%</p>
      <p>Memory: {runtime.performance.memory}MB</p>
      <p>Features: {runtime.features.join(', ')}</p>
    </div>
  );
}
```

### useKatalystUnified

Provides a unified development experience across different frameworks and build tools.

#### Signature
```typescript
function useKatalystUnified(config?: Partial<UnifiedConfig>): UnifiedConfig
```

#### Parameters
- `config` (optional): Partial unified configuration

#### Configuration Interface
```typescript
interface UnifiedConfig {
  framework: FrameworkType;           // Target framework
  buildTool: BuildToolType;           // Build tool configuration
  features: FeatureFlags;             // Feature flags
  optimization: OptimizationConfig;   // Optimization settings
  plugins: PluginConfig[];            // Plugin configuration
  devServer: DevServerConfig;         // Development server settings
}

type FrameworkType = 'react' | 'vue' | 'angular' | 'svelte' | 'preact';
type BuildToolType = 'webpack' | 'rspack' | 'vite' | 'rollup' | 'esbuild';

interface FeatureFlags {
  hotReload: boolean;
  codeSplitting: boolean;
  treeShaking: boolean;
  minification: boolean;
  sourceMaps: boolean;
  typescript: boolean;
}
```

#### Example
```typescript
import { useKatalystUnified } from '@katalyst/hooks';

function SetupUnified() {
  const config = useKatalystUnified({
    framework: 'react',
    buildTool: 'rspack',
    features: {
      hotReload: true,
      codeSplitting: true,
      typescript: true,
    },
  });

  console.log('Unified config:', config);
  return null;
}
```

## Framework Integration Hooks

### useReact

React-specific optimizations, integrations, and performance enhancements.

#### Signature
```typescript
function useReact(config?: ReactConfig): ReactIntegration
```

#### Configuration Interface
```typescript
interface ReactConfig {
  optimizeRerenders?: boolean;        // Optimize component re-renders
  enableProfiling?: boolean;          // Enable React Profiler
  hotReload?: boolean;                // Enable hot module replacement
  suspense?: boolean;                 // Enable React Suspense features
  concurrentMode?: boolean;           // Enable concurrent features
  strictMode?: boolean;               // Enable strict mode
  devTools?: boolean;                 // Enable React DevTools integration
}
```

#### Return Value
```typescript
interface ReactIntegration {
  optimizeBundle: () => Promise<BundleOptimizationResult>;
  enableHotReload: () => void;
  analyzePerformance: () => PerformanceReport;
  optimizeRendering: () => void;
  enableProfiling: () => void;
  getComponentMetrics: () => ComponentMetrics[];
  optimizeComponent: (componentPath: string) => OptimizationResult;
}
```

#### Example
```typescript
import { useReact } from '@katalyst/hooks';

function ReactOptimizer() {
  const { 
    optimizeBundle, 
    analyzePerformance, 
    optimizeRendering 
  } = useReact({
    optimizeRerenders: true,
    enableProfiling: true,
    hotReload: true,
  });

  const handleOptimization = async () => {
    const bundleResult = await optimizeBundle();
    const perfReport = analyzePerformance();
    optimizeRendering();
    
    console.log('Optimization results:', bundleResult);
    console.log('Performance report:', perfReport);
  };

  return (
    <button onClick={handleOptimization}>
      Optimize React App
    </button>
  );
}
```

### useHydration

Manages server-side rendering hydration and provides hydration optimization.

#### Signature
```typescript
function useHydration(config?: HydrationConfig): HydrationState
```

#### Configuration Interface
```typescript
interface HydrationConfig {
  timeout?: number;                   // Hydration timeout in ms
  retries?: number;                   // Number of retry attempts
  fallback?: React.ComponentType;     // Fallback component
  lazyHydration?: boolean;            // Enable lazy hydration
  prefetchData?: boolean;             // Prefetch critical data
  optimization?: HydrationOptimization;
}

interface HydrationOptimization {
  prioritizeCritical: boolean;        // Prioritize critical components
  deferNonCritical: boolean;          // Defer non-critical components
  preloadResources: boolean;          // Preload necessary resources
}
```

#### Return Value
```typescript
interface HydrationState {
  isHydrating: boolean;               // Currently hydrating
  hydrationComplete: boolean;         // Hydration completed
  errors: HydrationError[];           // Hydration errors
  progress: number;                   // Hydration progress (0-100)
  optimize: () => Promise<void>;      // Optimize hydration
  retry: () => Promise<void>;         // Retry hydration
  getReport: () => HydrationReport;   // Get detailed report
}
```

#### Example
```typescript
import { useHydration } from '@katalyst/hooks';

function HydrationManager() {
  const { 
    isHydrating, 
    hydrationComplete, 
    errors, 
    progress 
  } = useHydration({
    timeout: 5000,
    retries: 3,
    lazyHydration: true,
  });

  if (isHydrating) {
    return (
      <div>
        <p>Hydrating... {progress}%</p>
        <div style={{ width: `${progress}%` }} />
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div>
        <h3>Hydration Errors</h3>
        {errors.map((error, i) => (
          <p key={i}>{error.message}</p>
        ))}
      </div>
    );
  }

  return <div>App is hydrated and ready!</div>;
}
```

### useReactCompat

Provides React compatibility layer for different React versions and features.

#### Signature
```typescript
function useReactCompat(config?: ReactCompatConfig): ReactCompatInterface
```

#### Configuration Interface
```typescript
interface ReactCompatConfig {
  targetVersion?: string;             // Target React version
  enableConcurrent?: boolean;         // Enable concurrent features
  fallbackMode?: boolean;             // Enable fallback mode
  polyfills?: string[];               // Required polyfills
  strictMode?: boolean;               // Strict mode compatibility
}
```

#### Return Value
```typescript
interface ReactCompatInterface {
  version: string;                    // Detected React version
  features: ReactFeatures;            // Available features
  polyfills: ReactPolyfills;          // Available polyfills
  compatibility: CompatibilityReport; // Compatibility report
  upgrade: () => Promise<void>;       // Upgrade React version
  downgrade: () => Promise<void>;     // Downgrade React version
}
```

#### Example
```typescript
import { useReactCompat } from '@katalyst/hooks';

function ReactCompatibility() {
  const compat = useReactCompat({
    targetVersion: '18.0.0',
    enableConcurrent: true,
  });

  React.useEffect(() => {
    if (compat.compatibility.warnings.length > 0) {
      console.warn('Compatibility warnings:', compat.compatibility.warnings);
    }
  }, [compat]);

  return (
    <div>
      <p>React Version: {compat.version}</p>
      <p>Concurrent Mode: {compat.features.concurrent ? 'Available' : 'Not Available'}</p>
    </div>
  );
}
```

## Build System Hooks

### useRspack

Rspack build system integration with optimization and configuration management.

#### Signature
```typescript
function useRspack(config?: Partial<RspackConfig>): RspackHookInterface
```

#### Configuration Interface
```typescript
interface RspackConfig {
  mode: 'development' | 'production';
  optimization: RspackOptimization;
  plugins: RspackPlugin[];
  performance: PerformanceConfig;
  resolve: ResolveConfig;
  module: ModuleConfig;
  experiments: ExperimentalConfig;
}

interface RspackOptimization {
  minimize: boolean;
  minimizer: MinimizerPlugin[];
  splitChunks: SplitChunksConfig;
  runtimeChunk: RuntimeChunkConfig;
  concatenateModules: boolean;
}
```

#### Return Value
```typescript
interface RspackHookInterface {
  config: RspackConfig;               // Current configuration
  build: () => Promise<BuildResult>;  // Trigger build
  watch: () => void;                  // Start watch mode
  analyze: () => BundleAnalysis;      // Analyze bundle
  optimize: () => OptimizationResult; // Optimize configuration
  addPlugin: (plugin: RspackPlugin) => void;
  removePlugin: (pluginName: string) => void;
}
```

#### Example
```typescript
import { useRspack } from '@katalyst/hooks';

function RspackIntegration() {
  const rspack = useRspack({
    mode: 'development',
    optimization: {
      minimize: false,
      splitChunks: {
        chunks: 'all',
        maxSize: 250000,
      },
    },
  });

  const handleBuild = async () => {
    const result = await rspack.build();
    console.log('Build completed:', result);
  };

  const handleOptimize = () => {
    const optimization = rspack.optimize();
    console.log('Optimization suggestions:', optimization);
  };

  return (
    <div>
      <button onClick={handleBuild}>Build</button>
      <button onClick={handleOptimize}>Optimize</button>
    </div>
  );
}
```

### useRsbuild

Rsbuild configuration and optimization with intelligent defaults.

#### Signature
```typescript
function useRsbuild(config?: Partial<RsbuildConfig>): RsbuildHookInterface
```

#### Configuration Interface
```typescript
interface RsbuildConfig {
  framework: FrameworkType;
  plugins: RsbuildPlugin[];
  tools: ToolsConfig;
  performance: PerformanceConfig;
  source: SourceConfig;
  output: OutputConfig;
  server: ServerConfig;
}

interface ToolsConfig {
  bundler?: 'rspack' | 'webpack';
  swc?: SwcConfig;
  postcss?: PostcssConfig;
  less?: LessConfig;
  sass?: SassConfig;
}
```

#### Return Value
```typescript
interface RsbuildHookInterface {
  config: RsbuildConfig;              // Current configuration
  createProvider: () => RsbuildProvider;
  build: () => Promise<BuildResult>;
  dev: () => Promise<DevServer>;
  preview: () => Promise<PreviewServer>;
  analyze: () => BundleAnalysis;
  optimize: () => OptimizationResult;
}
```

#### Example
```typescript
import { useRsbuild } from '@katalyst/hooks';

function RsbuildSetup() {
  const rsbuild = useRsbuild({
    framework: 'react',
    tools: {
      bundler: 'rspack',
    },
    performance: {
      profile: true,
      buildCache: true,
    },
  });

  const startDevServer = async () => {
    const devServer = await rsbuild.dev();
    console.log('Dev server started:', devServer.address);
  };

  return (
    <button onClick={startDevServer}>
      Start Development Server
    </button>
  );
}
```

## Development & Debugging Hooks

### useInspector

Runtime inspection and debugging capabilities for development.

#### Signature
```typescript
function useInspector(config?: InspectorConfig): InspectorInterface
```

#### Configuration Interface
```typescript
interface InspectorConfig {
  enableProfiling?: boolean;          // Enable performance profiling
  enableLogging?: boolean;            // Enable debug logging
  enableTracing?: boolean;            // Enable call tracing
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  maxLogEntries?: number;             // Maximum log entries to keep
  filters?: InspectorFilter[];        // Log filters
}
```

#### Return Value
```typescript
interface InspectorInterface {
  session: InspectorSession;          // Current inspection session
  startProfiling: () => void;         // Start performance profiling
  stopProfiling: () => ProfileResult; // Stop and get profile
  trace: (target: string) => TraceResult; // Trace function/component
  inspect: (target: any) => InspectionResult; // Inspect object
  getLogs: () => LogEntry[];          // Get all logs
  clearLogs: () => void;              // Clear all logs
  exportData: () => InspectionData;   // Export inspection data
}
```

#### Example
```typescript
import { useInspector } from '@katalyst/hooks';

function DevInspector() {
  const inspector = useInspector({
    enableProfiling: true,
    enableLogging: true,
    logLevel: 'debug',
  });

  const startInspection = () => {
    inspector.startProfiling();
    
    // Trace a component
    const traceResult = inspector.trace('MyComponent');
    console.log('Component trace:', traceResult);
    
    // Inspect an object
    const inspectResult = inspector.inspect({ foo: 'bar' });
    console.log('Object inspection:', inspectResult);
  };

  const stopInspection = () => {
    const profile = inspector.stopProfiling();
    console.log('Profile data:', profile);
  };

  return (
    <div>
      <button onClick={startInspection}>Start Inspection</button>
      <button onClick={stopInspection}>Stop Inspection</button>
      <button onClick={() => console.log(inspector.getLogs())}>
        View Logs
      </button>
    </div>
  );
}
```

### useServerActions

Integration with server-side actions and RPC capabilities.

#### Signature
```typescript
function useServerActions(config?: ServerActionsConfig): ServerActionsInterface
```

#### Configuration Interface
```typescript
interface ServerActionsConfig {
  endpoint?: string;                  // Server endpoint URL
  timeout?: number;                   // Request timeout in ms
  retries?: number;                   // Number of retries
  cache?: boolean;                    // Enable response caching
  validateResponses?: boolean;        // Validate server responses
  authentication?: AuthConfig;        // Authentication configuration
}
```

#### Return Value
```typescript
interface ServerActionsInterface {
  invoke: <T>(action: string, ...args: any[]) => Promise<T>;
  batch: (actions: BatchAction[]) => Promise<BatchResult>;
  subscribe: (event: string, handler: EventHandler) => void;
  unsubscribe: (event: string, handler: EventHandler) => void;
  status: ServerStatus;               // Server connection status
  cache: ActionCache;                 // Response cache
}
```

#### Example
```typescript
import { useServerActions } from '@katalyst/hooks';

function ServerIntegration() {
  const { invoke, batch, status, cache } = useServerActions({
    endpoint: '/api/actions',
    timeout: 5000,
    cache: true,
  });

  const handleAction = async () => {
    try {
      const result = await invoke('getUserData', { id: 123 });
      console.log('User data:', result);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const handleBatch = async () => {
    const results = await batch([
      { action: 'getProfile', args: [123] },
      { action: 'getPreferences', args: [123] },
      { action: 'getHistory', args: [123] },
    ]);
    console.log('Batch results:', results);
  };

  return (
    <div>
      <p>Server Status: {status.connected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={handleAction}>Get User Data</button>
      <button onClick={handleBatch}>Batch Request</button>
    </div>
  );
}
```

## Specialized Integration Hooks

### useMultithreading

Multithreading capabilities with Web Workers and SharedArrayBuffer support.

#### Signature
```typescript
function useMultithreading(config?: MultithreadingConfig): MultithreadingInterface
```

#### Configuration Interface
```typescript
interface MultithreadingConfig {
  maxWorkers?: number;                // Maximum number of workers
  workerType?: 'web' | 'shared' | 'iframe';
  enableSIMD?: boolean;               // Enable SIMD operations
  enableSharedMemory?: boolean;       // Enable SharedArrayBuffer
  taskTimeout?: number;               // Task timeout in ms
  scheduling?: SchedulingStrategy;    // Task scheduling strategy
}
```

#### Return Value
```typescript
interface MultithreadingInterface {
  workers: WorkerPool;                // Worker pool interface
  execute: <T>(task: Task<T>) => Promise<T>; // Execute task in worker
  parallel: <T>(tasks: Task<T>[]) => Promise<T[]>; // Parallel execution
  transfer: (data: Transferable[]) => TransferHandle; // Transfer data
  performance: ThreadingPerformance;  // Performance metrics
  terminate: () => Promise<void>;     // Terminate all workers
}
```

#### Example
```typescript
import { useMultithreading } from '@katalyst/hooks';

function MultithreadingExample() {
  const { execute, parallel, workers, performance } = useMultithreading({
    maxWorkers: 4,
    workerType: 'web',
    enableSIMD: true,
  });

  const processImage = async (imageData: ImageData) => {
    const task = {
      name: 'processImage',
      data: imageData,
      fn: async (data) => {
        // Heavy image processing in worker
        return processedData;
      },
    };

    const result = await execute(task);
    return result;
  };

  const batchProcess = async () => {
    const tasks = Array.from({ length: 10 }, (_, i) => ({
      name: 'processChunk',
      data: chunkData[i],
      fn: async (data) => processDataChunk(data),
    }));

    const results = await parallel(tasks);
    return results;
  };

  return (
    <div>
      <p>Active Workers: {workers.active}</p>
      <p>Queue Size: {workers.queueSize}</p>
      <button onClick={() => processImage(sampleImage)}>
        Process Image
      </button>
      <button onClick={batchProcess}>Batch Process</button>
    </div>
  );
}
```

### useTrpc

tRPC integration for end-to-end type safety with server actions.

#### Signature
```typescript
function useTrpc(config?: TrpcConfig): TrpcInterface
```

#### Configuration Interface
```typescript
interface TrpcConfig {
  client?: TrpcClient;                // tRPC client instance
  links?: TrpcLink[];                 // Custom links
  transformer?: DataTransformer;      // Data transformer
  errorFormatter?: ErrorFormatter;    // Error formatter
  headers?: Record<string, string>;   // Default headers
}
```

#### Return Value
```typescript
interface TrpcInterface {
  client: TrpcClient;                 // tRPC client
  router: AppRouter;                  // App router type
  query: <T>(path: string, input?: any) => UseTRPCQueryResult<T>;
  mutation: <T>(path: string) => UseTRPCMutationResult<T>;
  subscription: <T>(path: string, input?: any) => UseTRPCSubscriptionResult<T>;
  invalidate: (path: string) => void; // Invalidate query cache
}
```

#### Example
```typescript
import { useTrpc } from '@katalyst/hooks';

function TrpcIntegration() {
  const { query, mutation, client } = useTrpc({
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  });

  // Type-safe query
  const { data: user, isLoading } = query('user.getById', { id: 123 });

  // Type-safe mutation
  const updateUser = mutation('user.update');

  const handleUpdate = async () => {
    try {
      await updateUser.mutateAsync({
        id: 123,
        name: 'New Name',
      });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={handleUpdate}>
        Update User
      </button>
    </div>
  );
}
```

## Configuration and State Management Hooks

### useConfig

Centralized configuration management with validation and persistence.

#### Signature
```typescript
function useConfig<T = any>(initialConfig?: T, options?: ConfigOptions<T>): ConfigInterface<T>
```

#### Configuration Interface
```typescript
interface ConfigOptions<T> {
  schema?: z.ZodSchema<T>;            // Validation schema
  storage?: 'localStorage' | 'sessionStorage' | 'memory';
  persistence?: boolean;              // Enable persistence
  namespace?: string;                 // Configuration namespace
  autoSave?: boolean;                 // Auto-save on changes
}
```

#### Return Value
```typescript
interface ConfigInterface<T> {
  config: T;                          // Current configuration
  updateConfig: (config: Partial<T>) => void;
  resetConfig: () => void;
  validateConfig: (config: T) => ValidationResult;
  exportConfig: () => string;         // Export as JSON
  importConfig: (json: string) => void;
  watch: (callback: (config: T) => void) => () => void; // Watch for changes
}
```

#### Example
```typescript
import { useConfig } from '@katalyst/hooks';
import { z } from 'zod';

const appConfigSchema = z.object({
  theme: z.enum(['light', 'dark']),
  language: z.string(),
  features: z.object({
    ai: z.boolean(),
    optimization: z.boolean(),
  }),
});

function AppConfig() {
  const { config, updateConfig, validateConfig } = useConfig(
    {
      theme: 'light',
      language: 'en',
      features: {
        ai: true,
        optimization: true,
      },
    },
    {
      schema: appConfigSchema,
      storage: 'localStorage',
      autoSave: true,
    }
  );

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateConfig({ theme });
  };

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    updateConfig({
      features: {
        ...config.features,
        [feature]: enabled,
      },
    });
  };

  return (
    <div>
      <select 
        value={config.theme} 
        onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <label>
        <input
          type="checkbox"
          checked={config.features.ai}
          onChange={(e) => handleFeatureToggle('ai', e.target.checked)}
        />
        Enable AI Features
      </label>
    </div>
  );
}
```

### useIntegration

Manages integration state and provides utilities for framework integrations.

#### Signature
```typescript
function useIntegration(config?: IntegrationConfig): IntegrationInterface
```

#### Configuration Interface
```typescript
interface IntegrationConfig {
  framework?: string;                 // Target framework
  plugins?: IntegrationPlugin[];      // Integration plugins
  hooks?: IntegrationHook[];          // Integration hooks
  middleware?: IntegrationMiddleware[]; // Middleware stack
  onError?: (error: IntegrationError) => void;
}
```

#### Return Value
```typescript
interface IntegrationInterface {
  status: IntegrationStatus;          // Current integration status
  registerFramework: (name: string, config: FrameworkConfig) => void;
  configureIntegration: (config: IntegrationConfig) => void;
  addPlugin: (plugin: IntegrationPlugin) => void;
  removePlugin: (pluginName: string) => void;
  getMetrics: () => IntegrationMetrics;
  testIntegration: () => Promise<TestResult>;
}
```

#### Example
```typescript
import { useIntegration } from '@katalyst/hooks';

function IntegrationManager() {
  const { 
    status, 
    registerFramework, 
    getMetrics,
    testIntegration 
  } = useIntegration({
    onError: (error) => console.error('Integration error:', error),
  });

  React.useEffect(() => {
    // Register custom framework
    registerFramework('custom-framework', {
      buildSystem: 'webpack',
      features: ['hmr', 'optimization'],
      plugins: ['@katalyst/custom-plugin'],
    });
  }, [registerFramework]);

  const handleTest = async () => {
    const testResult = await testIntegration();
    console.log('Integration test result:', testResult);
  };

  const metrics = getMetrics();

  return (
    <div>
      <h3>Integration Status</h3>
      <p>Status: {status.connected ? 'Connected' : 'Disconnected'}</p>
      <p>Active Frameworks: {status.frameworks.join(', ')}</p>
      <p>Plugin Count: {status.pluginCount}</p>
      
      <h4>Metrics</h4>
      <p>Initialization Time: {metrics.initTime}ms</p>
      <p>Memory Usage: {metrics.memoryUsage}MB</p>
      
      <button onClick={handleTest}>Test Integration</button>
    </div>
  );
}
```

This documentation provides comprehensive coverage of all the individual hooks in the Katalyst Hooks package, including their interfaces, usage patterns, and practical examples for AI-driven development workflows.
