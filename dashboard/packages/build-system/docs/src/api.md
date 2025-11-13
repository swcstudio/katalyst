# API Reference

This section provides detailed API documentation for the Katalyst Build System, including all interfaces, classes, and utility functions.

## Core Interfaces

### BuildConfig

Main configuration interface for the build system.

```typescript
export interface BuildConfig {
  target: 'web' | 'mobile' | 'desktop' | 'metaverse';
  mode: 'development' | 'production';
  features?: string[];
}
```

**Properties**:
- `target`: Target platform for the build
- `mode`: Build mode (development or production)
- `features`: Optional array of feature flags

**Example**:
```typescript
const config: BuildConfig = {
  target: 'web',
  mode: 'production',
  features: ['webxr', 'pwa']
};
```

### BuildTarget

Defines a specific build task with dependencies and caching.

```typescript
export interface BuildTarget {
  name: string;
  frameworks: string[];
  platforms: string[];
  dependencies: string[];
  cacheEnabled: boolean;
  cloudCacheEnabled: boolean;
  parallel: boolean;
  env?: Record<string, string>;
  outputs: string[];
  runner: 'nx' | 'turbo' | 'deno' | 'bun' | 'auto';
  fallbacks?: Array<{ runner: string; command: string }>;
  timeout?: number;
  retries?: number;
}
```

**Properties**:
- `name`: Unique identifier for the build target
- `frameworks`: Array of framework names this target applies to
- `platforms`: Array of platform names this target applies to
- `dependencies`: Array of dependency target names
- `cacheEnabled`: Whether local caching is enabled
- `cloudCacheEnabled`: Whether remote caching is enabled
- `parallel`: Whether this target can run in parallel
- `env`: Environment variables for this target
- `outputs`: Glob patterns for output files
- `runner`: Preferred task runner
- `fallbacks`: Alternative runners and commands
- `timeout`: Timeout in milliseconds
- `retries`: Number of retry attempts

### FrameworkConfig

Configuration for each supported framework.

```typescript
export interface FrameworkConfig {
  name: string;
  type: 'core' | 'remix' | 'nextjs' | 'shared';
  path: string;
  buildCommand: string;
  devCommand: string;
  testCommand: string;
  lintCommand: string;
  previewCommand: string;
  dependencies: string[];
  env: Record<string, string>;
  platforms: string[];
  bundler: 'rspack' | 'vite' | 'webpack' | 'esbuild';
  runtime: 'deno' | 'node' | 'bun';
}
```

**Properties**:
- `name`: Framework identifier
- `type`: Framework type
- `path`: Relative path to framework source
- `buildCommand`: Command to build the framework
- `devCommand`: Command to start development server
- `testCommand`: Command to run tests
- `lintCommand`: Command to run linting
- `previewCommand`: Command to preview build
- `dependencies`: Array of dependency framework names
- `env`: Environment variables
- `platforms`: Supported platforms
- `bundler`: Bundler to use
- `runtime`: JavaScript runtime

### PlatformConfig

Platform-specific build configuration.

```typescript
export interface PlatformConfig {
  name: string;
  enabled: boolean;
  targets: string[];
  buildCommand: string;
  env: Record<string, string>;
  dependencies: string[];
  outputs: string[];
}
```

**Properties**:
- `name`: Platform identifier
- `enabled`: Whether this platform is enabled
- `targets`: Array of target framework names
- `buildCommand`: Build command for this platform
- `env`: Platform-specific environment variables
- `dependencies`: Platform-specific dependencies
- `outputs`: Output file patterns

### RunnerConfig

Configuration for the unified runner.

```typescript
export interface RunnerConfig {
  preferredPackageManager: 'deno' | 'bun';
  preferredTaskRunner: 'nx' | 'turbo';
  enableCloudCache: boolean;
  parallel: boolean;
  verbose: boolean;
  dry: boolean;
  fallbackEnabled: boolean;
  cacheStrategy: 'aggressive' | 'conservative' | 'disabled';
}
```

**Properties**:
- `preferredPackageManager`: Preferred package manager
- `preferredTaskRunner`: Preferred task runner
- `enableCloudCache`: Enable remote caching
- `parallel`: Enable parallel execution
- `verbose`: Enable verbose logging
- `dry`: Dry run mode (show commands without executing)
- `fallbackEnabled`: Enable fallback runners
- `cacheStrategy`: Caching strategy

### TaskConfig

Configuration for individual tasks.

```typescript
export interface TaskConfig {
  name: string;
  command: string;
  runner: 'nx' | 'turbo' | 'deno' | 'bun';
  dependencies?: string[];
  platforms?: string[];
  cacheEnabled: boolean;
  cloudCacheEnabled: boolean;
  fallbacks?: Array<{ runner: string; command: string }>;
}
```

**Properties**:
- `name`: Task name
- `command`: Command to execute
- `runner`: Preferred runner
- `dependencies`: Task dependencies
- `platforms`: Applicable platforms
- `cacheEnabled`: Enable caching
- `cloudCacheEnabled`: Enable cloud caching
- `fallbacks`: Alternative runners

## Main Classes

### UnifiedBuilder

Main class for building across different platforms.

```typescript
export class UnifiedBuilder {
  async build(config: BuildConfig): Promise<void>;
}
```

**Methods**:
- `build(config: BuildConfig)`: Build the project with the given configuration

**Example**:
```typescript
const builder = new UnifiedBuilder();
await builder.build({
  target: 'web',
  mode: 'production',
  features: ['pwa']
});
```

### UnifiedRunner

Main class for orchestrating build operations.

```typescript
export class UnifiedRunner {
  constructor(config: RunnerConfig);
  async initialize(): Promise<void>;
  async install(packages?: string[]): Promise<boolean>;
  async runTask(taskName: string, options?: TaskOptions): Promise<boolean>;
  async clean(): Promise<boolean>;
  async setupCloudCache(): Promise<boolean>;
  printStatus(): void;
}
```

**Constructor**:
- `config: RunnerConfig`: Runner configuration

**Methods**:
- `initialize()`: Initialize the runner and detect capabilities
- `install(packages?)`: Install dependencies using preferred package manager
- `runTask(taskName, options?)`: Run a specific task
- `clean()`: Clean build artifacts
- `setupCloudCache()`: Setup remote caching
- `printStatus()`: Print system status information

**Example**:
```typescript
const runner = new UnifiedRunner({
  preferredPackageManager: 'deno',
  preferredTaskRunner: 'turbo',
  enableCloudCache: true,
  parallel: true
});

await runner.initialize();
await runner.runTask('build');
```

### TauriBuilder

Specialized builder for Tauri applications.

```typescript
export class TauriBuilder {
  constructor(config: BuildConfig);
  async build(): Promise<void>;
  async dev(): Promise<void>;
}
```

**Constructor**:
- `config: BuildConfig`: Build configuration

**Methods**:
- `build()`: Build the Tauri application
- `dev()`: Start development server

**Example**:
```typescript
const builder = new TauriBuilder({
  platform: 'desktop',
  mode: 'production',
  features: ['webxr']
});

await builder.build();
```

### TurboCacheSetup

Utility for setting up Turborepo remote caching.

```typescript
class TurboCacheSetup {
  constructor(config: CacheConfig);
  async setup(): Promise<void>;
  async verifyConnection(): Promise<void>;
  async generateCacheStats(): Promise<void>;
}
```

**Constructor**:
- `config: CacheConfig`: Cache configuration

**Methods**:
- `setup()`: Setup remote caching
- `verifyConnection()`: Verify connection to remote cache
- `generateCacheStats()`: Generate cache statistics

## Platform-Specific APIs

### Desktop API

#### DesktopAPI

Interface for desktop-specific functionality.

```typescript
export interface DesktopAPI {
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    setFullscreen: (fullscreen: boolean) => Promise<void>;
  };
  fs: {
    readFile: (path: string) => Promise<string>;
    writeFile: (path: string, contents: string) => Promise<void>;
    exists: (path: string) => Promise<boolean>;
  };
  shell: {
    open: (path: string) => Promise<void>;
    execute: (command: string, args?: string[]) => Promise<string>;
  };
}
```

#### TauriCommands

Interface for Tauri command invocation.

```typescript
export interface TauriCommands {
  invoke: (cmd: string, args?: any) => Promise<any>;
  listen: (event: string, handler: (payload: any) => void) => Promise<() => void>;
  emit: (event: string, payload?: any) => Promise<void>;
}
```

**Example**:
```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Read a file
const content = await invoke('read_file', { path: '/path/to/file.txt' });

// Minimize window
await invoke('minimize_window');

// Execute shell command
const output = await invoke('execute_command', { 
  command: 'ls', 
  args: ['-la'] 
});
```

### Metaverse API

#### MetaverseConfig

Configuration for metaverse experiences.

```typescript
export interface MetaverseConfig {
  renderer: 'three' | 'babylon' | 'aframe';
  physics: 'cannon' | 'ammo' | 'rapier';
  networking: 'webrtc' | 'websocket' | 'webtransport';
  xr: boolean;
  performance: {
    targetFPS: number;
    pixelRatio: number;
    shadows: boolean;
    antialiasing: boolean;
  };
  input: {
    handTracking: boolean;
    controllers: boolean;
    gaze: boolean;
    voice: boolean;
  };
}
```

#### MetaverseEngine

Core engine for metaverse experiences.

```typescript
export class MetaverseEngine {
  constructor(config: MetaverseConfig);
  async initialize(): Promise<void>;
  async loadWorld(worldUrl: string): Promise<void>;
  async enableXR(): Promise<void>;
}
```

**Example**:
```typescript
const engine = new MetaverseEngine({
  renderer: 'three',
  physics: 'rapier',
  networking: 'webrtc',
  xr: true,
  performance: {
    targetFPS: 60,
    pixelRatio: 2,
    shadows: true,
    antialiasing: true
  },
  input: {
    handTracking: true,
    controllers: true,
    gaze: false,
    voice: false
  }
});

await engine.initialize();
await engine.loadWorld('/assets/worlds/default.json');
await engine.enableXR();
```

## Utility Functions

### Configuration Accessors

Functions for accessing configuration data:

```typescript
export function getFrameworkConfig(name: string): FrameworkConfig | undefined;
export function getPlatformConfig(name: string): PlatformConfig | undefined;
export function getBuildTarget(name: string): BuildTarget | undefined;
export function getFrameworksForPlatform(platform: string): string[];
export function getDependenciesForTarget(targetName: string): string[];
export function getEnvironmentForTarget(
  targetName: string,
  environment: 'development' | 'production' | 'test' = 'development'
): Record<string, string>;
export function isCloudCacheEnabled(targetName: string): boolean;
export function getOutputsForTarget(targetName: string): string[];
export function getTimeoutForTarget(targetName: string): number;
export function getRetriesForTarget(targetName: string): number;
export function shouldRunInParallel(targetName: string): boolean;
```

**Examples**:
```typescript
// Get framework configuration
const coreConfig = getFrameworkConfig('core');
console.log(coreConfig?.buildCommand); // 'rsbuild build'

// Get platforms for framework
const webPlatforms = getFrameworksForPlatform('web');
console.log(webPlatforms); // ['core', 'remix', 'nextjs']

// Get environment variables
const env = getEnvironmentForTarget('build:web', 'production');
console.log(env.NODE_ENV); // 'production'

// Check if cloud cache is enabled
const cloudCacheEnabled = isCloudCacheEnabled('build:web');
console.log(cloudCacheEnabled); // true
```

### Build System Utilities

```typescript
export function createBuildConfig(config: Partial<BuildConfig>): BuildConfig;
export function validateBuildConfig(config: BuildConfig): boolean;
export function mergeBuildConfigs(...configs: Partial<BuildConfig>[]): BuildConfig;
```

### Platform Detection

```typescript
export function detectPlatform(): 'web' | 'desktop' | 'mobile' | 'server';
export function isTauriAvailable(): boolean;
export function isWebXRAvailable(): boolean;
export function getPlatformCapabilities(): PlatformCapabilities;
```

**Example**:
```typescript
// Detect current platform
const platform = detectPlatform();
console.log(platform); // 'desktop'

// Check WebXR availability
if (isWebXRAvailable()) {
  // Enable XR features
}
```

## Configuration Objects

### Default Build Configuration

```typescript
export const buildConfig = {
  packageManager: {
    primary: 'deno' as const,
    fallbacks: ['bun', 'npm'],
    lockfile: 'deno.lock',
    nodeModulesStrategy: 'auto' as const,
    registries: {
      npm: 'https://registry.npmjs.org',
      jsr: 'https://jsr.io',
      deno: 'https://deno.land/x',
    },
  },
  
  taskRunner: {
    primary: 'turbo' as const,
    fallbacks: ['nx', 'deno', 'bun'],
    cacheStrategy: 'aggressive' as const,
    cloudCache: {
      enabled: true,
      turbo: {
        team: process.env.TURBO_TEAM,
        token: process.env.TURBO_TOKEN,
      },
      nx: {
        accessToken: process.env.NX_CLOUD_ACCESS_TOKEN,
      },
    },
    parallel: {
      enabled: true,
      maxConcurrency: 8,
    },
  },
  
  // ... other configuration
};
```

### Default Framework Configurations

```typescript
export const frameworks = {
  core: {
    name: 'core',
    type: 'core' as const,
    path: './core',
    buildCommand: 'rsbuild build',
    devCommand: 'rsbuild dev',
    testCommand: 'deno test --allow-all',
    lintCommand: 'biome check .',
    previewCommand: 'rsbuild preview',
    dependencies: ['shared'],
    env: {
      NODE_ENV: 'development',
      RSPACK_ENV: 'development',
    },
    platforms: ['web', 'desktop', 'mobile'],
    bundler: 'rspack' as const,
    runtime: 'deno' as const,
  },
  
  remix: {
    name: 'remix',
    type: 'remix' as const,
    path: './remix',
    buildCommand: 'remix build',
    devCommand: 'remix dev',
    testCommand: 'deno test --allow-all',
    lintCommand: 'biome check .',
    previewCommand: 'remix-serve build',
    dependencies: ['shared'],
    env: {
      NODE_ENV: 'development',
      REMIX_DEV_HTTP_ORIGIN: 'http://localhost:3002',
    },
    platforms: ['web'],
    bundler: 'esbuild' as const,
    runtime: 'node' as const,
  },
  
  // ... other frameworks
};
```

## Type Definitions

### TaskOptions

Options for running tasks.

```typescript
export interface TaskOptions {
  frameworks?: string[];
  platforms?: string[];
  verbose?: boolean;
  dry?: boolean;
}
```

### CacheConfig

Configuration for caching.

```typescript
export interface CacheConfig {
  team: string;
  token: string;
  apiUrl?: string;
  uploadTimeout?: number;
}
```

### Environment

Environment type definitions.

```typescript
export type Environment = 'development' | 'production' | 'test';
export type Platform = 'web' | 'desktop' | 'mobile' | 'metaverse';
export type Framework = 'core' | 'remix' | 'nextjs' | 'shared';
export type Runner = 'nx' | 'turbo' | 'deno' | 'bun';
export type Bundler = 'rspack' | 'vite' | 'webpack' | 'esbuild';
```

## Error Handling

### Custom Errors

```typescript
export class BuildError extends Error {
  constructor(
    message: string,
    public readonly target?: string,
    public readonly platform?: string,
    public readonly framework?: string
  ) {
    super(message);
    this.name = 'BuildError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string, public readonly configPath?: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class PlatformError extends Error {
  constructor(
    message: string,
    public readonly platform: string,
    public readonly operation?: string
  ) {
    super(message);
    this.name = 'PlatformError';
  }
}
```

**Example**:
```typescript
try {
  await runner.runTask('build');
} catch (error) {
  if (error instanceof BuildError) {
    console.error(`Build failed for ${error.target}: ${error.message}`);
  } else if (error instanceof ConfigurationError) {
    console.error(`Configuration error in ${error.configPath}: ${error.message}`);
  }
}
```

## Events

### Build Events

```typescript
export interface BuildEvent {
  type: 'start' | 'progress' | 'complete' | 'error';
  target: string;
  platform?: string;
  framework?: string;
  data?: any;
}

export type BuildEventListener = (event: BuildEvent) => void;
```

### Progress Events

```typescript
export interface ProgressEvent {
  type: 'progress';
  current: number;
  total: number;
  message: string;
  target: string;
}
```

**Example**:
```typescript
runner.addEventListener('build', (event: BuildEvent) => {
  switch (event.type) {
    case 'start':
      console.log(`Starting build for ${event.target}`);
      break;
    case 'complete':
      console.log(`Build completed for ${event.target}`);
      break;
    case 'error':
      console.error(`Build failed for ${event.target}: ${event.data.message}`);
      break;
  }
});
```

## CLI Interface

### Command Line Options

```typescript
export interface CLIOptions {
  task?: string;
  frameworks?: string;
  platforms?: string;
  packageManager?: 'deno' | 'bun';
  taskRunner?: 'nx' | 'turbo';
  cache?: 'aggressive' | 'conservative' | 'disabled';
  install?: boolean;
  clean?: boolean;
  cloudCache?: boolean;
  parallel?: boolean;
  verbose?: boolean;
  dry?: boolean;
  noFallback?: boolean;
  status?: boolean;
  help?: boolean;
}
```

### Environment Variables

```typescript
export interface EnvironmentVariables {
  NODE_ENV?: string;
  DENO_ENV?: string;
  CI?: string;
  VERBOSE?: string;
  TURBO_TEAM?: string;
  TURBO_TOKEN?: string;
  NX_CLOUD_ACCESS_TOKEN?: string;
  TARGET_PLATFORM?: string;
  TAURI_ENV?: string;
}
```

## Migration Guide

### Version Compatibility

| Build System Version | Node.js | Deno | Tauri | React |
|---------------------|---------|------|-------|-------|
| 0.1.x | 18+ | 1.30+ | 1.5+ | 18+ |
| 0.2.x | 20+ | 1.35+ | 2.0+ | 19+ |

### Breaking Changes

#### From 0.1.x to 0.2.x

1. **Tauri 2.0**: Migrated from Tauri 1.x to 2.0
2. **React 19**: Updated to React 19 and removed React 18 support
3. **RSpack**: Replaced Webpack as default bundler
4. **Configuration**: New configuration format for `tauri-rsbuild.config.ts`

#### Migration Steps

```typescript
// Old configuration (0.1.x)
export default {
  plugins: [pluginReact()],
  target: 'web',
  // ...
}

// New configuration (0.2.x)
export default defineConfig({
  plugins: [pluginReact()],
  output: {
    target: 'web',
  },
  // ...
});
```

## Best Practices

### Configuration

1. **Use Environment Variables**: Store sensitive data in environment variables
2. **Enable Caching**: Always enable both local and cloud caching
3. **Parallel Execution**: Enable parallel builds for better performance
4. **Fallbacks**: Configure fallback runners for reliability

### Performance

1. **Bundle Splitting**: Configure proper chunk splitting for optimal loading
2. **Tree Shaking**: Ensure tree shaking is enabled for production builds
3. **Compression**: Enable gzip and brotli compression
4. **Asset Optimization**: Optimize images and other assets

### Security

1. **Environment Variables**: Never commit sensitive data to version control
2. **Tauri Capabilities**: Follow principle of least privilege
3. **Content Security Policy**: Configure CSP for web applications
4. **Input Validation**: Validate all inputs in Rust backends

This API reference provides comprehensive documentation for all aspects of the Katalyst Build System, enabling developers to effectively utilize and customize the build system for their specific needs.
