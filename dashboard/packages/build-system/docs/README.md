# Katalyst Build System

A comprehensive, unified build system for multi-platform React applications built with React 19, TanStack Router, and modern web technologies. The build system orchestrates NX, Turborepo, Deno, and Bun to provide fast, reliable builds across web, desktop, mobile, and metaverse platforms.

## 🚀 Overview

The Katalyst Build System is designed to handle complex multi-platform applications with ease. It provides:

- **Unified Build Pipeline**: Single configuration for all platforms
- **Multiple Framework Support**: TanStack Core, Remix (Admin), Next.js (Marketing)
- **Cross-Platform Builds**: Web, Desktop (Tauri), Mobile, WebXR/Metaverse
- **Advanced Caching**: Local and remote caching with Turborepo and NX
- **Performance Optimization**: RSpack, tree-shaking, code splitting
- **Developer Experience**: Hot reload, fast builds, comprehensive tooling

## 📁 Architecture

```
@katalyst/build-system/
├── src/
│   ├── build.config.ts          # Main build configuration
│   ├── rsbuild.config.ts        # RSpack web build config
│   ├── emp.config.ts            # EMP micro-frontend config
│   ├── tauri-rsbuild.config.ts  # Tauri desktop/mobile config
│   └── scripts/
│       ├── unified-runner.ts    # Build system orchestrator
│       ├── tauri-builder.ts     # Tauri build automation
│       └── setup-turbo-cache.ts # Remote cache setup
├── platforms/
│   ├── desktop/                 # Desktop platform (Tauri)
│   ├── mobile/                  # Mobile platform
│   └── metaverse/               # WebXR/Metaverse platform
└── docs/                       # This documentation
```

## 🛠️ Installation

### Requirements

- **Deno** (recommended) or **Node.js** 18+
- **Rust** (for desktop/mobile builds)
- **Platform-specific tools**:
  - Desktop: Tauri prerequisites
  - Mobile: Android Studio / Xcode
  - WebXR: Modern browser with WebXR support

### Setup

```bash
# Clone the repository
git clone https://github.com/katalyst/framework.git
cd katalyst

# Install dependencies
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --install

# Setup cloud caching (optional)
deno run --allow-all src/packages/build-system/src/scripts/setup-turbo-cache.ts \
  --team your-team --token your-token
```

## ⚙️ Configuration

### Main Build Configuration

The build system is configured through `src/build.config.ts`, which defines:

- **Framework configurations** (Core, Remix, Next.js)
- **Platform targets** (Web, Desktop, Mobile, WebXR)
- **Build tasks** with dependencies and caching
- **Environment variables** and optimization settings

### Framework Configuration

```typescript
// Example framework configuration
const coreFramework = {
  name: 'core',
  type: 'core',
  path: './core',
  buildCommand: 'rsbuild build',
  devCommand: 'rsbuild dev',
  bundler: 'rspack',
  runtime: 'deno',
  platforms: ['web', 'desktop', 'mobile']
};
```

### Platform Configuration

```typescript
// Example platform configuration
const desktopPlatform = {
  name: 'desktop',
  enabled: true,
  targets: ['core'],
  buildCommand: 'turbo build:desktop',
  env: {
    TARGET_PLATFORM: 'desktop',
    TAURI_ENV: 'production'
  },
  outputs: ['src-tauri/target/**', 'dist/desktop/**']
};
```

## 🎯 Usage

### Development

```bash
# Start all development servers
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task dev

# Start specific framework
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task dev:core

# Start with specific task runner
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts \
  --task dev --task-runner nx
```

### Building

```bash
# Build all platforms
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task build

# Build specific platform
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts \
  --task build:web

# Build with cloud caching
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts \
  --task build --cloud-cache
```

### Testing

```bash
# Run all tests
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test

# Run unit tests only
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test:unit

# Run E2E tests
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test:e2e
```

## 🏗️ Platform-Specific Builds

### Web

The web platform uses RSpack for optimal performance:

```typescript
// rsbuild.config.ts
export default defineConfig({
  plugins: [pluginReact(), pluginTypeCheck()],
  source: {
    entry: { index: './src/index.tsx' },
    alias: {
      '@': './src',
      '@katalyst/shared': './shared/src'
    }
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      cacheGroups: {
        vendor: { test: /[\\/]node_modules[\\/]/ },
        react: { test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/ }
      }
    }
  }
});
```

### Desktop (Tauri)

Desktop applications use Tauri 2.0 with RSpack:

```bash
# Development
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts \
  --dev --platform desktop

# Production build
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts \
  --build --platform desktop --mode production --bundle dmg
```

### Mobile

Mobile builds use Tauri mobile with platform-specific optimizations:

```bash
# Android
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts \
  --build --platform mobile --target android --bundle apk

# iOS
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts \
  --build --platform mobile --target ios --bundle ipa
```

### Metaverse/WebXR

WebXR experiences use Three.js and React Three Fiber:

```typescript
// metaverse configuration
const metaverseConfig = {
  renderer: 'three',
  physics: 'rapier',
  networking: 'webrtc',
  xr: true
};
```

## 🔧 Advanced Configuration

### Build Targets

The build system supports multiple build targets with dependency management:

```typescript
const buildTargets = {
  'build:web': {
    name: 'build:web',
    frameworks: ['core', 'remix', 'nextjs'],
    platforms: ['web'],
    dependencies: ['build-native'],
    cacheEnabled: true,
    cloudCacheEnabled: true,
    runner: 'turbo'
  }
};
```

### Environment Configuration

Environment-specific settings:

```typescript
const environments = {
  development: {
    DEBUG: '1',
    HOT_RELOAD: 'true',
    SOURCE_MAPS: 'true'
  },
  production: {
    OPTIMIZE: 'true',
    MINIFY: 'true',
    SOURCE_MAPS: 'false'
  }
};
```

### Caching Strategy

Configure local and remote caching:

```typescript
const cacheConfig = {
  buildCache: {
    enabled: true,
    directory: '.cache/build',
    maxSize: '10GB',
    maxAge: '7d'
  },
  cloudCache: {
    enabled: true,
    turbo: {
      team: process.env.TURBO_TEAM,
      token: process.env.TURBO_TOKEN
    }
  }
};
```

## 🎨 Customization

### Adding New Frameworks

1. Create framework configuration in `build.config.ts`
2. Add build scripts to platform packages
3. Update unified runner task definitions

### Adding New Platforms

1. Create platform directory in `platforms/`
2. Add platform configuration to `build.config.ts`
3. Create platform-specific build scripts
4. Update Tauri configuration if needed

### Custom Build Scripts

Create custom build scripts using the UnifiedRunner:

```typescript
import { UnifiedRunner } from '@katalyst/build-system';

const runner = new UnifiedRunner({
  preferredPackageManager: 'deno',
  preferredTaskRunner: 'turbo',
  enableCloudCache: true,
  parallel: true
});

await runner.runTask('custom:build', {
  frameworks: ['core'],
  platforms: ['web']
});
```

## 📊 Performance Optimization

### Bundle Splitting

The build system automatically splits bundles for optimal loading:

```typescript
const chunkSplitting = {
  vendor: { test: /[\\/]node_modules[\\/]/ },
  react: { test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/ },
  shared: { test: /[\\/]shared[\\/]/ }
};
```

### Tree Shaking

Enabled by default for all builds:

```typescript
const optimization = {
  treeShaking: {
    enabled: true,
    sideEffects: false
  }
};
```

### Code Compression

Production builds include compression:

```typescript
const compression = {
  enabled: true,
  algorithms: ['gzip', 'brotli']
};
```

## 🔄 Integration with Development Workflows

### CI/CD Integration

```yaml
# .github/workflows/build.yml
name: Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v1
      - name: Install dependencies
        run: deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --install
      - name: Build
        run: deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task build
      - name: Test
        run: deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test
```

### VS Code Integration

Create tasks in `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build All",
      "type": "shell",
      "command": "deno",
      "args": ["run", "--allow-all", "src/packages/build-system/src/scripts/unified-runner.ts", "--task", "build"],
      "group": "build"
    },
    {
      "label": "Development",
      "type": "shell",
      "command": "deno",
      "args": ["run", "--allow-all", "src/packages/build-system/src/scripts/unified-runner.ts", "--task", "dev"],
      "group": "build"
    }
  ]
}
```

## 🐛 Troubleshooting

### Common Issues

**Build fails with "Deno not found"**
```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh
```

**Tauri build fails**
```bash
# Install Tauri prerequisites
# Follow https://tauri.app/v1/guides/getting-started/prerequisites
```

**Cache issues**
```bash
# Clean cache
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --clean
```

### Debug Mode

Enable verbose output for debugging:

```bash
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts \
  --task build --verbose
```

## 📚 API Reference

### UnifiedRunner

Main class for orchestrating builds:

```typescript
class UnifiedRunner {
  constructor(config: RunnerConfig);
  async initialize(): Promise<void>;
  async install(packages?: string[]): Promise<boolean>;
  async runTask(taskName: string, options?: TaskOptions): Promise<boolean>;
  async clean(): Promise<boolean>;
  async setupCloudCache(): Promise<boolean>;
}
```

### TauriBuilder

Specialized builder for Tauri applications:

```typescript
class TauriBuilder {
  constructor(config: BuildConfig);
  async build(): Promise<void>;
  async dev(): Promise<void>;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Documentation

- [Katalyst Framework](../../README.md)
- [Platform-Specific Guides](./platforms/)
- [API Reference](./src/)
- [Examples](../../../examples/)
