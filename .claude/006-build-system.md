# Build System Architecture

## Overview

Katalyst-React features a sophisticated, multi-layered build system that orchestrates multiple cutting-edge tools to achieve unprecedented build performance. The system intelligently selects and coordinates between different package managers, task runners, and bundlers based on the environment and requirements.

## Architecture

### Build System Layers

```
┌─────────────────────────────────────────┐
│          Unified Runner                 │  ← Orchestration Layer
├─────────────────────────────────────────┤
│   Deno/Bun  │  Turborepo/NX            │  ← Package Manager & Task Runner
├─────────────────────────────────────────┤
│           RSpack (Rust)                 │  ← Bundler
├─────────────────────────────────────────┤
│   Core   │   Next   │   Remix          │  ← Frameworks
└─────────────────────────────────────────┘
```

### Key Components

1. **Unified Runner** (`scripts/unified-runner.ts`)
   - Intelligent tool selection
   - Cross-platform compatibility
   - Fallback mechanisms
   - Performance optimization

2. **Package Managers**
   - **Primary**: Deno (fast, secure, TypeScript-native)
   - **Fallback**: Bun (ultra-fast alternative)
   - **Legacy**: npm/yarn (compatibility)

3. **Task Runners**
   - **Primary**: Turborepo (intelligent caching)
   - **Fallback**: NX (powerful monorepo tools)

4. **Bundler**
   - **RSpack**: Rust-powered webpack alternative
   - Module Federation support
   - Native performance
   - HMR optimization

## Configuration Files

### 1. Makefile - Command Interface
```makefile
# Core commands
install:
	@$(MAKE) install-with-$(DEFAULT_PKG_MANAGER)

dev:
	@$(MAKE) dev-with-$(DEFAULT_TASK_RUNNER)

build:
	@$(MAKE) build-with-$(DEFAULT_TASK_RUNNER)

# Framework-specific commands
dev-core:
	cd core && npm run dev

dev-next:
	cd next && npm run dev

dev-remix:
	cd remix && npm run dev

# Advanced commands
build-native:
	cd shared/src/native && cargo build --release

test-all:
	@$(MAKE) test-unit
	@$(MAKE) test-integration
	@$(MAKE) test-e2e
	@$(MAKE) test-performance
```

### 2. Turborepo Configuration (`turbo.json`)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "cache": true
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "tests/**"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "lint": {
      "inputs": ["**/*.ts", "**/*.tsx"],
      "cache": true
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "cache": true
    }
  }
}
```

### 3. NX Configuration (`nx.json`)
```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nx/workspace/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "typecheck"],
        "cacheDirectory": ".nx/cache",
        "parallel": 4,
        "useDaemonProcess": true
      }
    }
  },
  "targetDefaults": {
    "build": {
      "inputs": ["production", "^production"],
      "outputs": ["{projectRoot}/dist"],
      "cache": true,
      "dependsOn": ["^build"]
    }
  },
  "namedInputs": {
    "production": [
      "default",
      "!{projectRoot}/**/*.test.*",
      "!{projectRoot}/**/*.spec.*",
      "!{projectRoot}/**/*.stories.*"
    ]
  }
}
```

### 4. RSpack Configuration
```typescript
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [
    pluginReact({
      swcReactOptions: {
        runtime: 'automatic',
      },
    }),
  ],
  
  output: {
    charset: 'utf-8',
    distPath: {
      root: 'dist',
      js: 'static/js',
      css: 'static/css',
      image: 'static/images',
      font: 'static/fonts',
    },
    sourceMap: {
      js: process.env.NODE_ENV === 'development' ? 'cheap-module-source-map' : false,
    },
  },

  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      chunks: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          priority: 30,
          name: 'react',
        },
        tanstack: {
          test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
          priority: 20,
          name: 'tanstack',
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          name: 'vendor',
        },
      },
    },
  },

  server: {
    port: 20007,
    strictPort: true,
    printUrls: true,
    open: false,
  },

  dev: {
    hmr: true,
    liveReload: true,
    progressBar: true,
  },
});
```

## Unified Runner

The Unified Runner is the brain of the build system, intelligently orchestrating tools:

### Tool Selection Logic
```typescript
// scripts/unified-runner.ts
export class UnifiedRunner {
  private async selectPackageManager(): Promise<PackageManager> {
    // Check for explicit environment variable
    if (process.env.KATALYST_PKG_MANAGER) {
      return process.env.KATALYST_PKG_MANAGER as PackageManager;
    }

    // Check tool availability
    if (await this.isToolAvailable('deno')) {
      return 'deno';
    }
    if (await this.isToolAvailable('bun')) {
      return 'bun';
    }
    
    // Fallback to npm
    return 'npm';
  }

  private async selectTaskRunner(): Promise<TaskRunner> {
    // Performance mode: prefer Turborepo
    if (this.options.performanceMode) {
      return await this.isToolAvailable('turbo') ? 'turborepo' : 'nx';
    }

    // Feature mode: prefer NX
    if (this.options.featureMode) {
      return await this.isToolAvailable('nx') ? 'nx' : 'turborepo';
    }

    // Default based on availability
    return await this.isToolAvailable('turbo') ? 'turborepo' : 'nx';
  }
}
```

### Execution Flow
```typescript
async function executeCommand(command: string, args: string[]) {
  const runner = new UnifiedRunner({
    performanceMode: args.includes('--perf'),
    featureMode: args.includes('--features'),
    parallel: !args.includes('--serial'),
  });

  try {
    // Initialize tools
    await runner.initialize();

    // Execute command
    const result = await runner.execute(command, args);

    // Handle results
    if (result.cache) {
      console.log(`✓ Cache hit! Saved ${result.timeSaved}s`);
    }

    return result.exitCode;
  } catch (error) {
    console.error('Build failed:', error);
    return 1;
  }
}
```

## Build Optimization

### 1. Intelligent Caching

#### Turborepo Cache
- Content-aware hashing
- Remote cache support
- Incremental builds

```bash
# Configure remote cache
turbo login
turbo link

# Use remote cache
TURBO_TOKEN=xxx turbo build --team=katalyst
```

#### NX Cache
- Distributed task execution
- Computation caching
- Affected commands

```bash
# See what's affected by changes
nx affected:build

# Use cloud cache
nx g @nx/nx-cloud:init

# Distributed execution
nx run-many --target=build --parallel=8
```

### 2. Parallel Execution

```typescript
// Parallel build configuration
export const buildConfig = {
  parallel: {
    // Maximum parallel jobs
    maxJobs: os.cpus().length,
    
    // Task dependencies
    dependencies: {
      'shared': [],
      'core': ['shared'],
      'next': ['shared'],
      'remix': ['shared'],
    },
    
    // Priority order
    priority: ['shared', 'core', 'next', 'remix'],
  },
};
```

### 3. Incremental Compilation

```typescript
// RSpack incremental build
export default defineConfig({
  experiments: {
    incrementalRebuild: {
      enable: true,
      emitAssets: true,
    },
  },
  
  cache: {
    type: 'filesystem',
    cacheDirectory: '.rsbuild-cache',
    buildDependencies: {
      config: [__filename],
    },
  },
});
```

## Development Workflow

### 1. Fast Refresh Setup
```typescript
// Enable React Fast Refresh
export default defineConfig({
  dev: {
    hmr: true,
    liveReload: true,
  },
  
  plugins: [
    pluginReact({
      fastRefresh: true,
      swcReactOptions: {
        refresh: true,
      },
    }),
  ],
});
```

### 2. Multi-Framework Development
```bash
# Start all frameworks in dev mode
make dev

# Start specific framework
make dev-core   # Port 20007
make dev-next   # Port 20009
make dev-remix  # Port 20008

# Start with specific tools
make dev-with-turbo
make dev-with-nx
```

### 3. Watch Mode
```typescript
// Unified watch configuration
export const watchConfig = {
  // Files to watch
  include: ['src/**/*', 'shared/**/*'],
  
  // Files to ignore
  exclude: ['**/*.test.*', '**/node_modules/**'],
  
  // Debounce delay
  delay: 100,
  
  // Actions on change
  onChange: async (files) => {
    // Invalidate affected caches
    await invalidateCache(files);
    
    // Rebuild affected modules
    await rebuildModules(files);
    
    // Notify connected clients
    await notifyClients(files);
  },
};
```

## Production Builds

### 1. Optimization Pipeline
```typescript
// Production build steps
export async function productionBuild() {
  // 1. Clean previous builds
  await clean(['dist', 'build', '.next']);
  
  // 2. Type checking
  await typecheck();
  
  // 3. Build native modules
  await buildNative();
  
  // 4. Build shared libraries
  await buildShared();
  
  // 5. Build frameworks in parallel
  await Promise.all([
    buildCore(),
    buildNext(),
    buildRemix(),
  ]);
  
  // 6. Optimize assets
  await optimizeAssets();
  
  // 7. Generate reports
  await generateReports();
}
```

### 2. Asset Optimization
```typescript
export const assetOptimization = {
  images: {
    formats: ['webp', 'avif'],
    sizes: [640, 750, 828, 1080, 1200],
    quality: 80,
  },
  
  fonts: {
    subset: true,
    formats: ['woff2'],
    display: 'swap',
  },
  
  css: {
    minify: true,
    extractCritical: true,
    purge: true,
  },
  
  js: {
    minify: true,
    treeshake: true,
    splitChunks: true,
  },
};
```

### 3. Bundle Analysis
```bash
# Generate bundle analysis
make analyze

# Framework-specific analysis
make analyze-core
make analyze-next
make analyze-remix

# Open analysis reports
open dist/report.html
```

## CI/CD Integration

### 1. GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          
      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: |
            ~/.cargo
            ~/.rustup
            node_modules
            .nx
            .turbo
          key: ${{ runner.os }}-${{ hashFiles('**/lockfiles') }}
          
      - name: Install dependencies
        run: make install
        
      - name: Build
        run: make build
        
      - name: Test
        run: make test-all
```

### 2. Docker Support
```dockerfile
# Multi-stage build
FROM rust:1.70 as rust-builder
WORKDIR /app
COPY shared/src/native .
RUN cargo build --release

FROM node:20-alpine as node-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY --from=rust-builder /app/target/release/*.node ./shared/src/native/
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=node-builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Performance Metrics

### Build Performance Tracking
```typescript
// Track build metrics
export class BuildMetrics {
  private metrics: Map<string, Metric> = new Map();

  async trackBuild(name: string, fn: () => Promise<void>) {
    const start = performance.now();
    const startMemory = process.memoryUsage();

    try {
      await fn();
      
      const duration = performance.now() - start;
      const endMemory = process.memoryUsage();
      
      this.metrics.set(name, {
        duration,
        memory: endMemory.heapUsed - startMemory.heapUsed,
        cache: this.wasCacheHit(name),
        timestamp: Date.now(),
      });
    } catch (error) {
      this.metrics.set(name, {
        error: error.message,
        duration: performance.now() - start,
      });
      throw error;
    }
  }

  generateReport() {
    const report = {
      totalDuration: this.getTotalDuration(),
      averageDuration: this.getAverageDuration(),
      cacheHitRate: this.getCacheHitRate(),
      memoryPeak: this.getMemoryPeak(),
      slowestTasks: this.getSlowestTasks(5),
    };

    console.table(report);
    return report;
  }
}
```

## Troubleshooting

### Common Issues

1. **Cache Corruption**
```bash
# Clear all caches
make clean-cache

# Clear specific caches
rm -rf .nx/cache
rm -rf .turbo
rm -rf node_modules/.cache
```

2. **Build Failures**
```bash
# Verbose build for debugging
make build-verbose

# Serial build to isolate issues
make build-serial

# Build with specific tools
make build-with-npm
```

3. **Memory Issues**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=8192"

# Limit parallel jobs
make build PARALLEL_JOBS=2
```

### Debug Mode
```typescript
// Enable debug logging
export const debugConfig = {
  // Log all operations
  verbose: true,
  
  // Write debug files
  writeDebugFiles: true,
  debugDir: '.debug',
  
  // Performance profiling
  profile: true,
  profileOutput: 'build-profile.json',
  
  // Source maps
  sourceMaps: 'inline',
  
  // Disable optimizations
  optimize: false,
};
```

## Best Practices

### 1. Cache Management
- Regular cache pruning
- Remote cache for teams
- Cache warming strategies
- Selective cache invalidation

### 2. Dependency Management
- Lock file maintenance
- Regular updates
- Vulnerability scanning
- License compliance

### 3. Build Performance
- Parallel execution when possible
- Incremental builds
- Lazy loading
- Code splitting

### 4. Monitoring
- Build time tracking
- Resource usage monitoring
- Error rate tracking
- Cache effectiveness

## Advanced Features

### 1. Custom Plugins
```typescript
// Create custom RSpack plugin
export class KatalystPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('KatalystPlugin', (compilation) => {
      // Custom optimization logic
    });
  }
}
```

### 2. Build Profiles
```bash
# Development profile
make build PROFILE=development

# Production profile
make build PROFILE=production

# Performance profile
make build PROFILE=performance
```

### 3. Multi-Platform Builds
```bash
# Build for all platforms
make build-all-platforms

# Platform-specific builds
make build-web
make build-desktop
make build-mobile
```

## Next Steps

- [007-next-integration.md](./007-next-integration.md) - Next.js specific features
- [008-remix-integration.md](./008-remix-integration.md) - Remix specific features
- [009-testing-guide.md](./009-testing-guide.md) - Testing strategies
- [010-deployment-guide.md](./010-deployment-guide.md) - Deployment options