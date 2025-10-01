# @katalyst/build-system

Build configurations for web, desktop (Tauri), mobile (React Native), and WebXR/metaverse platforms.

## Overview

The `@katalyst/build-system` package provides pre-configured build setups for multiple platforms, including RSpack, Webpack, Vite configurations, and platform-specific builds.

### Key Features

- 🌐 **Multi-Platform** - Web, desktop, mobile, WebXR
- ⚡ **RSpack** - Ultra-fast Rust-powered bundler
- 📦 **Webpack** - Traditional webpack configurations  
- ⚡ **Vite** - Lightning-fast Vite setup
- 🖥️ **Tauri** - Desktop application builds
- 📱 **React Native** - Mobile app configurations
- 🎮 **WebXR** - XR and metaverse builds
- 🔧 **Turborepo/NX** - Monorepo orchestration

## Installation

```typescript
import { rspackConfig } from '@katalyst/build-system';
```

## Quick Start

### RSpack Configuration

```typescript
import { rspackConfig } from '@katalyst/build-system/rspack';

export default rspackConfig({
  entry: './src/index.tsx',
  output: {
    path: './dist',
    filename: '[name].[contenthash].js'
  },
  mode: 'production'
});
```

### Webpack Configuration

```typescript
import { webpackConfig } from '@katalyst/build-system/webpack';

export default webpackConfig({
  entry: './src/index.tsx',
  optimization: {
    splitChunks: { chunks: 'all' }
  }
});
```

### Vite Configuration

```typescript
import { viteConfig } from '@katalyst/build-system/vite';

export default viteConfig({
  server: { port: 3000 },
  build: { target: 'esnext' }
});
```

## Platform Builds

### Desktop (Tauri)

```typescript
import { tauriConfig } from '@katalyst/build-system/platforms/desktop';

export default tauriConfig({
  appName: 'MyApp',
  identifier: 'com.myapp',
  windows: true,
  macos: true,
  linux: true
});
```

### Mobile (React Native)

```typescript
import { reactNativeConfig } from '@katalyst/build-system/platforms/mobile';

export default reactNativeConfig({
  ios: true,
  android: true,
  expo: true
});
```

### WebXR & Metaverse

```typescript
import { webxrConfig } from '@katalyst/build-system/platforms/webxr';

export default webxrConfig({
  vr: true,
  ar: true,
  optimization: 'performance'
});
```

## Build Scripts

```json
{
  "scripts": {
    "build": "rspack build",
    "build:desktop": "tauri build",
    "build:mobile": "react-native build",
    "build:webxr": "vite build --config webxr.config.ts"
  }
}
```

## Multi-Platform Build

```bash
# Build all platforms
npm run build:all

# Build specific platforms
npm run build:desktop
npm run build:mobile
npm run build:webxr
```

## Configuration Options

### RSpack Options

```typescript
interface RspackConfig {
  entry: string;
  output?: OutputConfig;
  mode?: 'development' | 'production';
  optimization?: OptimizationConfig;
  plugins?: Plugin[];
  devServer?: DevServerConfig;
}
```

### Platform Options

```typescript
interface PlatformConfig {
  name: string;
  entry: string;
  output: string;
  optimization?: 'size' | 'performance';
  target?: 'web' | 'desktop' | 'mobile' | 'webxr';
}
```

## Best Practices

1. **Use RSpack for web** - Fastest build times
2. **Optimize for platform** - Different optimization strategies
3. **Code splitting** - Split by route and vendor
4. **Tree shaking** - Remove unused code
5. **Asset optimization** - Compress images and assets
6. **Cache builds** - Use Turborepo/NX caching
7. **Monitor bundle size** - Keep bundles small

## Related Documentation

- [Integrations](./integrations.md) - Build tool integrations
- [Core](./core.md) - Using built applications

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Status**: Production Ready
