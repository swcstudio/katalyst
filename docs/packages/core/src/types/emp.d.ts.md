# emp.d.ts

> Source: `src/types/emp.d.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Exports

### `EMPModuleFederationConfig`

<!-- TODO: Add detailed documentation for EMPModuleFederationConfig -->

### `EMPSharedConfig`

<!-- TODO: Add detailed documentation for EMPSharedConfig -->

### `EMPRuntimePluginConfig`

<!-- TODO: Add detailed documentation for EMPRuntimePluginConfig -->

### `EMPRemoteModule`

<!-- TODO: Add detailed documentation for EMPRemoteModule -->

### `EMPLoadRemoteOptions`

<!-- TODO: Add detailed documentation for EMPLoadRemoteOptions -->

### `EMPRuntimeInstance`

<!-- TODO: Add detailed documentation for EMPRuntimeInstance -->

### `EMPRuntimeInitOptions`

<!-- TODO: Add detailed documentation for EMPRuntimeInitOptions -->

### `EMPBuildConfig`

<!-- TODO: Add detailed documentation for EMPBuildConfig -->

### `EMPOptimizationOptions`

<!-- TODO: Add detailed documentation for EMPOptimizationOptions -->

### `EMPDevServerOptions`

<!-- TODO: Add detailed documentation for EMPDevServerOptions -->

### `EMPFrameworkAdapter`

<!-- TODO: Add detailed documentation for EMPFrameworkAdapter -->

### `EMPMetrics`

<!-- TODO: Add detailed documentation for EMPMetrics -->

### `EMPErrorInfo`

<!-- TODO: Add detailed documentation for EMPErrorInfo -->

### `EMPCacheConfig`

<!-- TODO: Add detailed documentation for EMPCacheConfig -->

### `EMPHookType`

<!-- TODO: Add detailed documentation for EMPHookType -->

### `EMPHooks`

<!-- TODO: Add detailed documentation for EMPHooks -->

### `EMPTypeGenerationConfig`

<!-- TODO: Add detailed documentation for EMPTypeGenerationConfig -->

### `EMPDynamicRemoteConfig`

<!-- TODO: Add detailed documentation for EMPDynamicRemoteConfig -->

### `EMPRemotesManager`

<!-- TODO: Add detailed documentation for EMPRemotesManager -->

### `EMPModuleInfo`

<!-- TODO: Add detailed documentation for EMPModuleInfo -->

## Source Code

```typescript
/// <reference types="@empjs/share" />

declare global {
  interface Window {
    EMPShareLib: any;
    __EMP_RUNTIME__: {
      version: string;
      remotes: Record<string, string>;
      initialized: boolean;
    };
  }
}

export interface EMPModuleFederationConfig {
  name: string;
  filename?: string;
  exposes?: Record<string, string>;
  remotes?: Record<string, string>;
  shared?: Record<string, EMPSharedConfig>;
  library?: {
    type: string;
    name: string;
  };
  runtime?: EMPRuntimePluginConfig;
}

export interface EMPSharedConfig {
  singleton?: boolean;
  requiredVersion?: string;
  version?: string;
  eager?: boolean;
  strictVersion?: boolean;
  shareKey?: string;
  shareScope?: string;
}

export interface EMPRuntimePluginConfig {
  loadingComponent?: string | React.ComponentType;
  errorBoundary?: boolean | React.ComponentType<{ error: Error }>;
  timeout?: number;
  retries?: number;
  fallback?: Record<string, string>;
}

export interface EMPRemoteModule {
  name: string;
  entry: string;
  version?: string;
  format?: 'esm' | 'commonjs' | 'umd';
}

export interface EMPLoadRemoteOptions {
  remoteName: string;
  moduleName: string;
  options?: {
    timeout?: number;
    retries?: number;
    fallback?: () => Promise<any>;
  };
}

export interface EMPRuntimeInstance {
  init(options: EMPRuntimeInitOptions): void;
  loadRemote<T = any>(remoteName: string, moduleName: string): Promise<T>;
  preloadRemote(remoteName: string): Promise<void>;
  registerRemotes(remotes: EMPRemoteModule[]): void;
  loadShare<T = any>(pkg: string, version?: string): Promise<T>;
}

export interface EMPRuntimeInitOptions {
  name: string;
  remotes: EMPRemoteModule[];
  plugins?: any[];
  showLog?: boolean;
}

export interface EMPBuildConfig {
  mode: 'development' | 'production';
  entry: string | Record<string, string>;
  output: {
    path: string;
    publicPath: string;
    uniqueName?: string;
  };
  resolve?: {
    extensions?: string[];
    alias?: Record<string, string>;
  };
  module?: {
    rules?: any[];
  };
  plugins?: any[];
  optimization?: EMPOptimizationOptions;
  devServer?: EMPDevServerOptions;
}

export interface EMPOptimizationOptions {
  splitChunks?: boolean | object;
  treeshaking?: boolean;
  minify?: boolean;
  sideEffects?: boolean;
  usedExports?: boolean;
  concatenateModules?: boolean;
  runtimeChunk?: boolean | string | object;
  moduleIds?: 'natural' | 'named' | 'deterministic' | 'size';
  chunkIds?: 'natural' | 'named' | 'deterministic' | 'size' | 'total-size';
}

export interface EMPDevServerOptions {
  port?: number;
  host?: string;
  hot?: boolean;
  liveReload?: boolean;
  historyApiFallback?: boolean | object;
  compress?: boolean;
  proxy?: Record<string, any>;
  headers?: Record<string, string>;
  https?: boolean | object;
  allowedHosts?: string[];
  open?: boolean | string;
  static?: {
    directory: string;
    publicPath?: string;
    watch?: boolean;
  };
  client?: {
    logging?: 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose';
    overlay?:
      | boolean
      | {
          errors?: boolean;
          warnings?: boolean;
        };
    progress?: boolean;
    reconnect?: boolean | number;
    webSocketURL?: string | object;
  };
}

export interface EMPFrameworkAdapter {
  name: 'react' | 'vue2' | 'vue3';
  version: string;
  mount(component: any, container: HTMLElement, props?: any): void;
  unmount(container: HTMLElement): void;
  update?(container: HTMLElement, props: any): void;
}

export interface EMPMetrics {
  moduleLoadTime: number;
  remoteFetchDuration: number;
  errorRate: number;
  cacheHitRatio: number;
  totalModulesLoaded: number;
  failedModules: string[];
}

export interface EMPErrorInfo {
  type: 'LOAD_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT_ERROR' | 'NETWORK_ERROR';
  message: string;
  remoteName?: string;
  moduleName?: string;
  timestamp: number;
  stack?: string;
}

export interface EMPCacheConfig {
  enabled: boolean;
  maxAge?: number;
  maxSize?: number;
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

export type EMPHookType =
  | 'beforeLoad'
  | 'afterLoad'
  | 'loadError'
  | 'beforeInit'
  | 'afterInit'
  | 'beforePreload'
  | 'afterPreload';

export interface EMPHooks {
  beforeLoad?: (options: EMPLoadRemoteOptions) => void | Promise<void>;
  afterLoad?: (options: EMPLoadRemoteOptions, module: any) => void | Promise<void>;
  loadError?: (options: EMPLoadRemoteOptions, error: Error) => void | Promise<void>;
  beforeInit?: (options: EMPRuntimeInitOptions) => void | Promise<void>;
  afterInit?: () => void | Promise<void>;
  beforePreload?: (remoteName: string) => void | Promise<void>;
  afterPreload?: (remoteName: string) => void | Promise<void>;
}

export interface EMPTypeGenerationConfig {
  enabled: boolean;
  outputPath: string;
  updateOnChange: boolean;
  includeRemotes?: boolean;
  excludePatterns?: string[];
}

export interface EMPDynamicRemoteConfig {
  url: string;
  format?: 'esm' | 'commonjs' | 'umd';
  from?: 'cdn' | 'server' | 'custom';
  integrity?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

export interface EMPRemotesManager {
  add(name: string, config: EMPDynamicRemoteConfig): Promise<void>;
  remove(name: string): void;
  update(name: string, config: Partial<EMPDynamicRemoteConfig>): void;
  list(): Record<string, EMPDynamicRemoteConfig>;
  has(name: string): boolean;
  clear(): void;
}

export interface EMPModuleInfo {
  name: string;
  version: string;
  dependencies: string[];
  exports: string[];
  size: number;
  loaded: boolean;
  timestamp: number;
}

```

---

*Generated documentation for @katalyst/core*
