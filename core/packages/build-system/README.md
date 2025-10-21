# Katalyst Build System

## Overview

The Katalyst Build System is a comprehensive, multi-platform build automation framework that provides unified building capabilities for web applications, desktop apps, metaverse experiences, and mobile applications. Built on modern tools like RSpack, Turbo, and Tauri, it offers exceptional performance, flexibility, and developer experience.

## Features

- **Multi-Platform Support**: Web, Desktop (Windows/macOS/Linux), Mobile, and WebXR builds
- **Unified Builder Interface**: Single API for all build operations across platforms
- **High Performance**: RSpack-powered builds with advanced optimizations
- **Framework Agnostic**: Supports TanStack Core, Remix, Next.js, and more
- **Intelligent Caching**: Local and remote caching for faster builds
- **Hot Reload**: Development builds with instant feedback
- **Cross-Compilation**: Rust backend compilation for native applications
- **Micro-Frontend Support**: Module federation with EMP (Edge Module Pattern)
- **CLI Integration**: Comprehensive command-line interface with extensive options

## Quick Start

### Installation

```bash
npm install @katalyst/build-system
# or
yarn add @katalyst/build-system
# or
pnpm add @katalyst/build-system
```

### Basic Usage

```typescript
import { createBuilder } from '@katalyst/build-system';

const builder = createBuilder({
  platform: 'web',
  framework: 'tanstack-core',
  mode: 'development',
  dev: true,
});

await builder.start();
```

### Platform-Specific Builds

```typescript
// Web Application
const webBuilder = createBuilder({
  platform: 'web',
  framework: 'nextjs',
  mode: 'production',
  outputPath: 'dist/web',
});

// Desktop Application
const desktopBuilder = createBuilder({
  platform: 'desktop',
  framework: 'tanstack-core',
  mode: 'production',
  tauri: {
    features: ['file-system', 'notifications'],
    targets: ['msi', 'deb', 'dmg'],
  },
});

// Metaverse Application
const metaverseBuilder = createBuilder({
  platform: 'metaverse',
  framework: 'tanstack-core',
  mode: 'production',
  webxr: {
    vr: true,
    handTracking: true,
    networking: true,
  },
});
```

## Architecture

### Core Components

#### Builder Configuration
The build system is configured through a central configuration that defines platforms, frameworks, and build options.

#### Platform Adapters
Each platform (web, desktop, metaverse, mobile) has its own adapter that handles platform-specific build requirements.

#### Task Runners
Intelligent task runners (NX, Turbo) provide efficient dependency management and incremental builds.

#### Caching System
Multi-layer caching (local memory, local filesystem, remote cloud) ensures optimal build performance.

### Package Structure

```
build-system/
├── mod.ts                    # Main package entry point
├── package.json             # Package configuration
├── src/
│   ├── build.config.ts      # Central build configuration
│   ├── emp.config.ts         # Module federation configuration
│   ├── rsbuild.config.ts     # Web build configuration
│   ├── tauri-rsbuild.config.ts # Desktop build configuration
│   └── scripts/              # Build automation scripts
│       ├── setup-turbo-cache.ts
│       ├── tauri-builder.ts
│       └── unified-runner.ts
└── platforms/               # Platform-specific configurations
    ├── desktop/
    │   ├── mod.ts
    │   ├── package.json
    │   └── src-tauri/
    ├── metaverse/
    │   ├── mod.ts
    │   ├── package.json
    │   └── src/
    └── mobile/
        ├── mod.ts
        └── package.json
```

## Configuration

### Build Configuration

#### Core Configuration (`build.config.ts`)

```typescript
export const buildConfig = {
  // General settings
  mode: 'development' | 'production',
  dev: boolean,
  target: 'browser' | 'node',
  
  // Framework settings
  framework: 'tanstack-core' | 'remix' | 'nextjs' | 'vite',
  
  // Platform settings
  platform: 'web' | 'desktop' | 'metaverse' | 'mobile',
  
  // Build settings
  outputPath: 'dist',
  publicDir: 'public',
  assetsDir: 'assets',
  
  // Development settings
  devServer: {
    port: 3000,
    host: 'localhost',
    https: false,
    open: true,
  },
  
  // Performance settings
  minify: true,
  sourcemap: true,
  treeShaking: true,
  codeSplitting: true,
  
  // Caching settings
  cache: {
    enabled: true,
    type: 'filesystem' | 'memory' | 'remote',
    remote: {
      url: 'https://cache.katalyst.dev',
      token: process.env.KATALYST_CACHE_TOKEN,
    },
  },
  
  // Platform-specific settings
  tauri: {
    features: ['file-system', 'notifications'],
    targets: ['msi', 'deb', 'dmg'],
    beforeBuild: [],
    afterBuild: [],
  },
  
  webxr: {
    vr: true,
    handTracking: false,
    networking: true,
  },
};
```

### RSpack Configuration (`rsbuild.config.ts`)

```typescript
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindCSS } from '@rsbuild/plugin-tailwindcss';

export default defineConfig({
  plugins: [
    pluginReact({
      swcMinify: true,
    }),
    pluginTailwindCSS(),
  ],
  
  html: {
    template: './index.html',
    title: 'Katalyst Application',
    favicon: './public/favicon.ico',
  },
  
  output: {
    target: 'web',
    cleanDist: true,
  },
  
  source: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@utils': './src/utils',
    },
  },
  
  tools: {
    bundler: 'rspack',
    swc: {
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    },
  },
  
  performance: {
    removeConsole: true,
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: {
          vendor: ['react', 'react-dom'],
          framework: ['@tanstack/react-router', '@tanstack/react-query'],
        },
      },
    },
  },
  
  dev: {
    hmr: true,
    liveReload: true,
  },
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    mainFields: ['browser', 'module', 'main'],
  },
});
```

## Usage Examples

### Development Build

```typescript
import { createBuilder } from '@katalyst/build-system';

// Development server with hot reload
const devBuilder = createBuilder({
  mode: 'development',
  dev: true,
  platform: 'web',
  framework: 'tanstack-core',
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});

await devBuilder.start();
```

### Production Build

```typescript
// Production build with optimizations
const prodBuilder = createBuilder({
  mode: 'production',
  dev: false,
  platform: 'web',
  framework: 'tanstack-core',
  performance: {
    minify: true,
    sourcemap: false,
    treeShaking: true,
    codeSplitting: true,
  },
  outputPath: 'dist/production',
});

await prodBuilder.build();
```

### Multi-Platform Build

```typescript
import { createBuilder } from '@katalyst/build-system';

// Build for multiple platforms simultaneously
const platforms = [
  {
    platform: 'web',
    mode: 'production',
    outputPath: 'dist/web',
  },
  {
    platform: 'desktop',
    mode: 'production',
    tauri: {
      targets: ['msi', 'deb', 'dmg'],
      features: ['file-system', 'notifications'],
    },
    outputPath: 'dist/desktop',
  },
  {
    platform: 'metaverse',
    mode: 'production',
    webxr: {
      vr: true,
      handTracking: true,
      networking: true,
    },
    outputPath: 'dist/metaverse',
  },
];

// Build all platforms
for (const config of platforms) {
  const builder = createBuilder(config);
  await builder.build();
}
```

### Custom Build Scripts

```typescript
import { createBuilder, createBuildScript } from '@katalyst/build-system';

// Custom build script with preprocessing
const customBuild = createBuildScript(async (config) => {
  // Preprocessing steps
  await runPreprocessors();
  await generateTypes();
  await validateConfigs();
  
  // Create builder
  const builder = createBuilder(config);
  
  // Build
  await builder.build();
  
  // Post-processing steps
  await optimizeAssets();
  await generateManifests();
});

// Usage
await customBuild({
  mode: 'production',
  platform: 'web',
  framework: 'nextjs',
});
```

## Platform-Specific Features

### Desktop Applications

#### Tauri Integration
```typescript
const desktopConfig = {
  platform: 'desktop',
  tauri: {
    features: [
      'file-system',
      'notifications',
      'system-tray',
      'auto-updater',
    ],
    targets: {
      windows: ['msi'],
      macos: ['dmg', 'pkg'],
      linux: ['deb', 'appimage'],
    },
    bundle: {
      identifier: 'com.katalyst.app',
      publisher: 'Katalyst Team',
    },
    security: {
      csp: 'default-src: self; https: trusted-source.com',
    },
  },
};
```

#### Native API Integration
```typescript
// Rust backend integration
import { invoke } from '@tauri-apps/api/tauri';

// Usage in frontend
const readDirectory = async (path: string) => {
  return await invoke('read_directory', { path });
};

const showNotification = async (title: string, body: string) => {
  return await invoke('show_notification', { title, body });
};

const getSystemInfo = async () => {
  return await invoke('get_system_info');
};
```

### Metaverse Applications

#### WebXR Configuration
```typescript
const metaverseConfig = {
  platform: 'metaverse',
  webxr: {
    vr: true,
    handTracking: true,
    spatialAudio: true,
    networking: true,
    physics: true,
  },
  build: {
    include: [
      '@react-three/fiber',
      '@react-three/drei',
      'three-stdlib',
      'webxr',
    ],
  },
};
```

#### 3D Scene Optimization
```typescript
// Performance optimizations for 3D content
const sceneConfig = {
  webxr: {
    renderOptimizations: {
      frustumCulling: true,
      occlusion: true,
      lod: true,
      textureCompression: true,
      instancing: true,
    },
    networking: {
      webrtc: true,
      websocket: true,
      syncRate: 60,
    },
  },
};
```

## Performance Optimization

### Build Performance

#### Caching Strategy
```typescript
const cacheConfig = {
  cache: {
    enabled: true,
    type: 'remote',
    remote: {
      url: 'https://cache.katalyst.dev',
      token: process.env.KATALYST_CACHE_TOKEN,
      timeout: 30000,
    },
    compression: true,
    hashAlgorithm: 'xxhash64',
  },
};
```

#### Incremental Builds
```typescript
const incrementalConfig = {
  build: {
    incremental: true,
    cacheKey: 'production',
    parallel: true,
    maxWorkers: 4,
  },
};
```

### Runtime Performance

#### Code Splitting
```typescript
const codeSplittingConfig = {
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: {
          vendor: ['react', 'react-dom', 'three'],
          framework: ['@tanstack/react-router'],
          ui: ['@katalyst/design-system'],
          xr: ['@react-three/fiber', 'webxr'],
        },
        maxSize: 250000,
        minSize: 20000,
      },
    },
  },
};
```

#### Tree Shaking
```typescript
const treeShakingConfig = {
  build: {
    treeShaking: true,
    usedExports: true,
    sideEffects: false,
    moduleSideEffects: false,
  },
};
```

## CLI Integration

### Command Line Interface

```bash
# Development server
katalyst build --dev --platform web

# Production build
katalyst build --prod --platform desktop

# Multi-platform build
katalyst build --prod --platforms web,desktop,metaverse

# Custom configuration
katalyst build --config ./my-build.config.ts

# Build with environment variables
KATALYST_ENV=production katalyst build --prod

# Verbose output
katalyst build --prod --verbose

# Clean build
katalyst build --prod --clean

# Build with analysis
katalyst build --prod --analyze
```

### Configuration Files

#### katalyst.build.config.ts
```typescript
import { defineConfig } from '@katalyst/build-system';

export default defineConfig({
  platform: 'web',
  framework: 'tanstack-core',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  dev: process.env.NODE_ENV === 'development',
  
  // Custom plugins
  plugins: [
    '@katalyst/plugin-tailwind',
    '@katalyst/plugin-swc',
  ],
  
  // Custom paths
  paths: {
    src: './src',
    output: './dist',
    public: './public',
  },
  
  // Environment-specific settings
  env: {
    production: {
      minify: true,
      sourcemap: false,
      treeShaking: true,
    },
    development: {
      sourcemap: true,
      devtool: 'source-map',
      hmr: true,
    },
  },
});
```

## Integration with Development Workflows

### CI/CD Integration

#### GitHub Actions
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npx katalyst build --prod --platforms web,desktop
      
      - name: Build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/
```

#### Vercel Deployment
```json
{
  "buildCommand": "katalyst build --prod --platform web",
  "outputDirectory": "dist/web",
  "framework": null
}
```

### Development Tools Integration

#### VS Code Integration
```json
{
  "scripts": {
    "dev": "katalyst build --dev",
    "build": "katalyst build --prod",
    "build:desktop": "katalyst build --prod --platform desktop",
    "build:metaverse": "katalyst build --prod --platform metaverse"
  },
  "tasks": {
    "dev": {
      "label": "Development Server",
      "type": "shell",
      "command": "katalyst build --dev",
      "isBackground": true,
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      },
      "problemMatcher": []
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Build Failures
```typescript
// Enable verbose output for debugging
const debugConfig = {
  logging: {
    level: 'verbose',
    colors: true,
  },
};

// Run with debug info
katalyst build --prod --verbose --debug
```

#### Caching Issues
```bash
# Clear local cache
katalyst build --clean

# Clear remote cache
katalyst cache clear

# Bypass cache
katalyst build --prod --no-cache
```

#### Platform-Specific Issues

**Desktop Build Issues:**
```bash
# Check Tauri installation
katalyst check tauri

# Rebuild Tauri dependencies
katalyst rebuild tauri

# Check platform-specific requirements
katalyst check platform --desktop
```

**Metaverse Build Issues:**
```bash
# Check WebXR support
katalyst check webxr

# Validate Three.js setup
katalyst validate threejs

# Test VR functionality
katalyst test vr
```

### Performance Issues

#### Build Performance
```typescript
// Enable build profiling
const profileConfig = {
  profiling: {
    enabled: true,
    output: 'build-profile.json',
  },
};

// Run with profiling
katalyst build --prod --profile
```

#### Runtime Performance
```typescript
// Enable runtime analysis
const analysisConfig = {
  analyze: {
    bundle: true,
    performance: true,
    accessibility: true,
  },
};

// Generate analysis report
katalyst analyze --bundle --performance
```

## Best Practices

### 1. Configuration Management

- **Environment-Specific Configs**: Use different configs for development and production
- **Platform Detection**: Automatically detect and configure for target platforms
- **Dependency Management**: Keep build dependencies minimal and up-to-date
- **Version Control**: Store configuration files in version control

### 2. Performance Optimization

- **Incremental Builds**: Enable caching and incremental builds when possible
- **Bundle Analysis**: Regularly analyze bundle sizes and optimize
- **Code Splitting**: Use strategic code splitting for better loading performance
- **Tree Shaking**: Ensure unused code is properly eliminated

### 3. Development Experience

- **Hot Module Replacement**: Enable HMR for development speed
- **Error Reporting**: Configure comprehensive error reporting
- **Source Maps**: Generate source maps for production debugging
- **Build Feedback**: Provide clear build progress and error messages

### 4. Production Deployment

- **Asset Optimization**: Optimize all assets (images, fonts, etc.)
- **Security**: Configure appropriate security headers and CSP
- **Monitoring**: Set up build performance monitoring
- **Rollback**: Implement rollback strategies for deployment failures

This comprehensive build system provides everything needed to build modern applications for multiple platforms with excellent performance and developer experience.
