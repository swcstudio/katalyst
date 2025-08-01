# RSpack Integration API Reference

## Table of Contents
- [Core Classes](#core-classes)
- [React Hooks](#react-hooks)
- [Configuration Builder](#configuration-builder)
- [Plugin System](#plugin-system)
- [Types and Interfaces](#types-and-interfaces)
- [Utility Functions](#utility-functions)

## Core Classes

### RSpackIntegration

The main integration class for RSpack in the Katalyst framework.

```typescript
class RSpackIntegration {
  constructor(config: RSpackIntegrationOptions)
  
  // Lifecycle Methods
  async initialize(): Promise<IntegrationResult[]>
  isInitialized(): boolean
  
  // Configuration Methods
  generateConfig(variant: 'core' | 'remix' | 'nextjs'): RSpackConfig
  getConfig(): RSpackIntegrationOptions
  createFullConfig(variant?: string): RSpackConfig
  
  // Plugin Management
  getPlugin(name: string): RSpackPlugin | undefined
  getAllPlugins(): RSpackPlugin[]
  addPlugin(plugin: RSpackPlugin): void
  removePlugin(name: string): void
}
```

#### Constructor Options

```typescript
interface RSpackIntegrationOptions {
  plugins: string[];                    // Plugin names to enable
  enableModuleFederation?: boolean;     // Enable module federation
  enableSwcHelpers?: boolean;           // Use SWC helpers
  enableWebWorkers?: boolean;           // Web Worker support
  enableWasm?: boolean;                 // WebAssembly support
  enableSourceMaps?: boolean;           // Source map generation
  enableBundleAnalyzer?: boolean;       // Bundle analysis
  enableProgressBar?: boolean;          // Build progress
  enableTypeChecking?: boolean;         // TypeScript checking
  customPlugins?: RSpackPlugin[];       // Custom plugins
  optimization?: OptimizationConfig;    // Optimization settings
  performance?: PerformanceConfig;      // Performance hints
}
```

#### Example Usage

```typescript
import { RSpackIntegration } from '@katalyst/shared';

const rspack = new RSpackIntegration({
  plugins: ['react', 'svgr', 'type-check'],
  enableModuleFederation: true,
  enableSourceMaps: true,
  enableBundleAnalyzer: process.env.ANALYZE === 'true'
});

await rspack.initialize();
const config = rspack.generateConfig('core');
```

## React Hooks

### useRSpack

Main hook for RSpack integration in React components.

```typescript
function useRSpack(options?: UseRSpackOptions): UseRSpackReturn

interface UseRSpackOptions {
  variant?: 'core' | 'remix' | 'nextjs';
  autoInitialize?: boolean;
  enableHMR?: boolean;
  enableDevTools?: boolean;
}

interface UseRSpackReturn {
  // State
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  config: RSpackConfig | null;
  stats: RSpackBuildStats | null;
  plugins: RSpackPluginConfig[];
  
  // Methods
  initialize: () => Promise<void>;
  build: () => Promise<RSpackBuildStats>;
  watch: (callback: (stats: RSpackBuildStats) => void) => () => void;
  addPlugin: (plugin: RSpackPluginConfig) => void;
  removePlugin: (name: string) => void;
  updateConfig: (config: Partial<RSpackConfig>) => void;
  getPlugin: (name: string) => RSpackPluginConfig | undefined;
  reload: () => Promise<void>;
}
```

#### Example Usage

```typescript
import { useRSpack } from '@katalyst/shared';

function BuildManager() {
  const {
    isInitialized,
    stats,
    build,
    addPlugin
  } = useRSpack({
    variant: 'core',
    autoInitialize: true,
    enableHMR: true
  });

  const handleBuild = async () => {
    const buildStats = await build();
    console.log('Build completed in', buildStats.time, 'ms');
  };

  return (
    <div>
      <button onClick={handleBuild}>Build Project</button>
      {stats && <p>Last build: {stats.time}ms</p>}
    </div>
  );
}
```

### Variant-Specific Hooks

```typescript
// Core variant
function useRSpackCore(options?: Omit<UseRSpackOptions, 'variant'>): UseRSpackReturn

// Remix variant
function useRSpackRemix(options?: Omit<UseRSpackOptions, 'variant'>): UseRSpackReturn

// Next.js variant
function useRSpackNextJS(options?: Omit<UseRSpackOptions, 'variant'>): UseRSpackReturn
```

## Configuration Builder

### RSpackConfigBuilder

Builder class for creating RSpack configurations.

```typescript
class RSpackConfigBuilder {
  constructor(options: RSpackConfigBuilderOptions)
  
  async build(): Promise<RSpackConfig>
  addPlugin(name: string, options?: any): void
  removePlugin(name: string): void
  setMode(mode: 'development' | 'production'): void
  setVariant(variant: 'core' | 'remix' | 'nextjs'): void
  async exportConfig(outputPath: string): Promise<void>
}

interface RSpackConfigBuilderOptions {
  variant: 'core' | 'remix' | 'nextjs';
  mode?: 'development' | 'production';
  enableIntegration?: boolean;
  customConfig?: any;
}
```

#### Factory Functions

```typescript
// Create a complete RSpack configuration
async function createRSpackConfig(
  options: RSpackConfigBuilderOptions
): Promise<RSpackConfig>

// Preset configurations
const RSpackPresets = {
  async core(mode?: 'development' | 'production'): Promise<RSpackConfig>,
  async remix(mode?: 'development' | 'production'): Promise<RSpackConfig>,
  async nextjs(mode?: 'development' | 'production'): Promise<RSpackConfig>
}
```

#### Example Usage

```typescript
import { createRSpackConfig, RSpackPresets } from '@katalyst/shared';

// Using preset
const config = await RSpackPresets.core('production');

// Custom configuration
const customConfig = await createRSpackConfig({
  variant: 'core',
  mode: 'development',
  customConfig: {
    devServer: {
      port: 3000
    }
  }
});

// Using builder directly
const builder = new RSpackConfigBuilder({ variant: 'remix' });
builder.addPlugin('BundleAnalyzerPlugin', { openAnalyzer: true });
const config = await builder.build();
```

## Plugin System

### RSpackPluginManager

Manages RSpack plugins with factory pattern.

```typescript
class RSpackPluginManager {
  constructor()
  
  // Plugin Registration
  registerPluginFactory(name: string, factory: RSpackPluginFactory): void
  
  // Plugin Management
  addPlugin(config: RSpackPluginConfig): void
  removePlugin(name: string): void
  getPlugin(name: string): RSpackPluginConfig | undefined
  getAllPlugins(): RSpackPluginConfig[]
  
  // Configuration
  generatePluginConfig(): RSpackPlugin[]
  createPlugins(compiler: RSpackCompiler): RSpackPlugin[]
  loadPreset(preset: 'development' | 'production' | RSpackPluginConfig[]): void
  
  // Static Methods
  static createDevelopmentPreset(): RSpackPluginConfig[]
  static createProductionPreset(): RSpackPluginConfig[]
}
```

#### Plugin Configuration

```typescript
interface RSpackPluginConfig {
  name: string;
  options?: Record<string, any>;
  enabled?: boolean;
  priority?: number;
}

type RSpackPluginFactory = (options?: any) => {
  name: string;
  apply: (compiler: RSpackCompiler) => void;
}
```

#### Built-in Plugins

1. **ReactRefreshPlugin** - React Fast Refresh for development
2. **ModuleFederationPlugin** - Micro-frontend support
3. **HtmlPlugin** - HTML generation
4. **DefinePlugin** - Global constants
5. **ProgressPlugin** - Build progress tracking
6. **BundleAnalyzerPlugin** - Bundle size analysis
7. **CompressionPlugin** - Gzip/Brotli compression
8. **WorkboxPlugin** - PWA service worker
9. **SourceMapPlugin** - Source map handling
10. **CopyPlugin** - Static asset copying

#### Example Usage

```typescript
import { RSpackPluginManager } from '@katalyst/shared';

const pluginManager = new RSpackPluginManager();

// Load preset
pluginManager.loadPreset('production');

// Add custom plugin
pluginManager.addPlugin({
  name: 'MyCustomPlugin',
  enabled: true,
  priority: 50,
  options: {
    customOption: true
  }
});

// Register new plugin factory
pluginManager.registerPluginFactory('MyPlugin', (options) => ({
  name: 'MyPlugin',
  apply: (compiler) => {
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('Build completed!');
    });
  }
}));
```

## Types and Interfaces

### Build Statistics

```typescript
interface RSpackBuildStats {
  assets: Array<{
    name: string;
    size: number;
    chunks: string[];
  }>;
  chunks: Array<{
    id: string;
    names: string[];
    size: number;
    modules: number;
  }>;
  modules: number;
  errors: string[];
  warnings: string[];
  time: number;
  hash: string;
}
```

### Optimization Configuration

```typescript
interface OptimizationConfig {
  splitChunks?: SplitChunksConfig;
  runtimeChunk?: RuntimeChunkConfig;
  moduleIds?: 'natural' | 'named' | 'deterministic' | 'size';
  chunkIds?: 'natural' | 'named' | 'deterministic' | 'size' | 'total-size';
  minimize?: boolean;
  minimizer?: any[];
  usedExports?: boolean;
  sideEffects?: boolean;
  concatenateModules?: boolean;
  providedExports?: boolean;
  innerGraph?: boolean;
  mangleExports?: boolean | 'size' | 'deterministic';
  mergeDuplicateChunks?: boolean;
  flagIncludedChunks?: boolean;
  removeAvailableModules?: boolean;
  removeEmptyChunks?: boolean;
  realContentHash?: boolean;
}
```

### Experiments Configuration

```typescript
interface ExperimentsConfig {
  asyncWebAssembly?: boolean;
  topLevelAwait?: boolean;
  outputModule?: boolean;
  css?: boolean;
  lazyCompilation?: {
    entries?: boolean;
    imports?: boolean;
    test?: RegExp | string;
  };
  buildHttp?: {
    allowedUris?: string[];
    cacheLocation?: string;
    frozen?: boolean;
    lockfileLocation?: string;
    upgrade?: boolean;
  };
}
```

### Cache Configuration

```typescript
interface CacheConfig {
  type: 'memory' | 'filesystem';
  cacheDirectory?: string;
  compression?: false | 'gzip' | 'brotli';
  profile?: boolean;
  maxAge?: number;
  buildDependencies?: {
    config?: string[];
  };
  name?: string;
  version?: string;
  store?: 'pack';
  idleTimeout?: number;
  idleTimeoutForInitialStore?: number;
  idleTimeoutAfterLargeChanges?: number;
  maxMemoryGenerations?: number;
}
```

## Utility Functions

### Build Helpers

```typescript
// Format file size for display
function formatSize(bytes: number): string

// Check if RSpack is available
function isRSpackAvailable(): boolean

// Get optimal worker count
function getOptimalWorkerCount(): number

// Validate configuration
function validateRSpackConfig(config: any): boolean
```

### Integration Helpers

```typescript
// Check if integration is ready
function isRSpackIntegrationReady(): boolean

// Get RSpack version
function getRSpackVersion(): string

// Create development server
function createDevServer(config: DevServerConfig): any

// Merge configurations
function mergeRSpackConfigs(...configs: Partial<RSpackConfig>[]): RSpackConfig
```

## Dashboard Component

### RSpackDashboard

Visual dashboard for monitoring RSpack builds.

```typescript
interface RSpackDashboardProps {
  variant?: 'core' | 'remix' | 'nextjs';
  className?: string;
}

function RSpackDashboard(props: RSpackDashboardProps): JSX.Element
```

#### Features
- Real-time build statistics
- Plugin management UI
- Configuration viewer
- Build triggering
- Error display
- Performance metrics

#### Example Usage

```typescript
import { RSpackDashboard } from '@katalyst/shared';

function App() {
  return (
    <div>
      <h1>Build Dashboard</h1>
      <RSpackDashboard 
        variant="core" 
        className="my-custom-dashboard" 
      />
    </div>
  );
}
```

## Environment Variables

### RSpack-specific Environment Variables

```env
# Enable bundle analysis
ANALYZE=true

# RSpack mode
RSPACK_ENV=development|production

# Enable profiling
RSPACK_PROFILE=true

# Cache directory
RSPACK_CACHE_DIR=.rspack-cache

# Module federation URL
RSPACK_REMOTE_URL=https://example.com/remoteEntry.js

# Worker threads
RSPACK_WORKERS=4

# Memory limit
RSPACK_MEMORY_LIMIT=4096
```

## Migration Guide

### From Webpack to RSpack

1. Update dependencies:
```bash
npm uninstall webpack webpack-cli webpack-dev-server
npm install @rspack/core @rspack/dev-server @rsbuild/core
```

2. Update configuration:
```typescript
// webpack.config.js → rspack.config.ts
import { createRSpackConfig } from '@katalyst/shared';

export default await createRSpackConfig({
  variant: 'core',
  mode: process.env.NODE_ENV
});
```

3. Update scripts:
```json
{
  "scripts": {
    "dev": "rsbuild dev",
    "build": "rsbuild build",
    "preview": "rsbuild preview"
  }
}
```

4. Update imports:
```typescript
// Before
import webpackConfig from './webpack.config.js';

// After
import rspackConfig from './rspack.config.ts';
```

## Best Practices

1. **Use Type-Safe Configuration**
   ```typescript
   const config: RSpackConfig = await createRSpackConfig({
     variant: 'core',
     mode: 'production'
   });
   ```

2. **Enable Caching in Production**
   ```typescript
   cache: {
     type: 'filesystem',
     compression: 'gzip'
   }
   ```

3. **Optimize for Your Use Case**
   ```typescript
   // For large applications
   optimization: {
     splitChunks: {
       chunks: 'all',
       maxAsyncRequests: 30,
       maxInitialRequests: 30
     }
   }
   ```

4. **Monitor Build Performance**
   ```typescript
   const { stats } = useRSpack();
   console.log('Build metrics:', stats);
   ```

5. **Use Module Federation for Micro-frontends**
   ```typescript
   enableModuleFederation: true,
   moduleFederation: {
     name: 'my-app',
     exposes: {
       './Component': './src/Component'
     }
   }
   ```