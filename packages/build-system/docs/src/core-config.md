# Core Configuration Files

This section documents the main configuration files that define the build system's behavior and architecture.

## mod.ts

The main entry point for the build system package. It exports all core configurations and utilities.

**Purpose**: Provides a unified interface to all build system components
**Exports**: All configuration files, scripts, and builder classes

### Key Features

- Unified builder interface for all platforms
- TypeScript exports for type safety
- Builder factory pattern for different targets

### Usage Example

```typescript
import { UnifiedBuilder, BuildConfig } from '@katalyst/build-system';

const builder = new UnifiedBuilder();
const config: BuildConfig = {
  target: 'web',
  mode: 'production',
  features: ['webxr']
};

await builder.build(config);
```

## package.json

Package configuration and dependency management for the build system.

**Purpose**: Defines package metadata, scripts, and dependencies
**Key Features**: Multi-framework exports, platform-specific scripts

### Scripts

| Script | Description |
|--------|-------------|
| `build` | Main build command using Deno tasks |
| `build:desktop` | Build desktop platform |
| `build:mobile` | Build mobile platform |
| `build:webxr` | Build WebXR platform |
| `build:metaverse` | Build metaverse platform |
| `build:all` | Build all platforms |
| `dev` | Development mode for all platforms |
| `lint` | Code linting with Biome |
| `typecheck` | TypeScript type checking |

### Dependencies

- **Build Tools**: RSBuild, Rspack, Webpack, Vite, Turbo, NX
- **Platform Tools**: Tauri, Capacitor, React Native, Expo
- **3D/WebXR**: Three.js, React Three Fiber, React Three XR

## build.config.ts

The central configuration file that orchestrates the entire build system.

**Purpose**: Defines all build targets, frameworks, platforms, and optimization settings
**Size**: 745 lines of comprehensive configuration

### Core Interfaces

#### BuildTarget
Defines a specific build task with dependencies and caching:
```typescript
interface BuildTarget {
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

#### FrameworkConfig
Configuration for each supported framework:
```typescript
interface FrameworkConfig {
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

#### PlatformConfig
Platform-specific build configuration:
```typescript
interface PlatformConfig {
  name: string;
  enabled: boolean;
  targets: string[];
  buildCommand: string;
  env: Record<string, string>;
  dependencies: string[];
  outputs: string[];
}
```

### Supported Frameworks

#### Core Framework (TanStack)
- **Bundler**: Rspack
- **Runtime**: Deno
- **Platforms**: Web, Desktop, Mobile
- **Features**: Modern React 19 with TanStack Router

#### Remix Framework (Admin)
- **Bundler**: Esbuild
- **Runtime**: Node.js
- **Platforms**: Web
- **Features**: Admin dashboard with data loading

#### Next.js Framework (Marketing)
- **Bundler**: Webpack
- **Runtime**: Node.js
- **Platforms**: Web
- **Features**: Marketing site with SSR/SSG

#### Shared Framework
- **Bundler**: Esbuild
- **Runtime**: Deno
- **Platforms**: Web, Desktop, Mobile
- **Features**: Common components and utilities

### Build Targets

#### Development Targets
- `dev`: Development servers for all frameworks
- `dev:core`, `dev:remix`, `dev:nextjs`: Framework-specific dev servers

#### Build Targets
- `build`: Production build for all platforms
- `build:web`: Web-specific build
- `build:desktop`: Desktop application build
- `build:mobile`: Mobile application build
- `build-native`: Native module compilation

#### Testing Targets
- `test`: All tests (unit, integration, E2E)
- `test:unit`: Unit tests only
- `test:integration`: Integration tests
- `test:e2e`: End-to-end tests

#### Quality Targets
- `lint`: Code linting and formatting
- `typecheck`: TypeScript type checking

### Environment Configuration

#### Global Environment
```typescript
env: {
  global: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DENO_ENV: process.env.DENO_ENV || 'development',
    CI: process.env.CI || 'false',
    VERBOSE: process.env.VERBOSE || 'false',
  },
  development: {
    DEBUG: '1',
    HOT_RELOAD: 'true',
    SOURCE_MAPS: 'true',
  },
  production: {
    OPTIMIZE: 'true',
    MINIFY: 'true',
    SOURCE_MAPS: 'false',
  },
  test: {
    NODE_ENV: 'test',
    DENO_ENV: 'test',
    TEST_TIMEOUT: '30000',
  },
}
```

### Performance Optimization

#### Bundle Splitting
```typescript
bundleSplitting: {
  enabled: true,
  chunks: ['vendor', 'common', 'runtime'],
  maxSize: 500000,
}
```

#### Tree Shaking
```typescript
treeShaking: {
  enabled: true,
  sideEffects: false,
}
```

#### Compression
```typescript
compression: {
  enabled: true,
  algorithms: ['gzip', 'brotli'],
}
```

### Cache Configuration

#### Local Cache
```typescript
cache: {
  buildCache: {
    enabled: true,
    directory: '.cache/build',
    maxSize: '10GB',
    maxAge: '7d',
  },
  testCache: {
    enabled: true,
    directory: '.cache/test',
    maxSize: '2GB',
    maxAge: '3d',
  },
  nodeModulesCache: {
    enabled: true,
    directory: 'node_modules/.cache',
    maxSize: '5GB',
    maxAge: '30d',
  },
}
```

#### Cloud Cache
```typescript
cloudCache: {
  enabled: true,
  turbo: {
    team: process.env.TURBO_TEAM,
    token: process.env.TURBO_TOKEN,
  },
  nx: {
    accessToken: process.env.NX_CLOUD_ACCESS_TOKEN,
  },
}
```

### Utility Functions

The configuration provides several utility functions for accessing settings:

```typescript
// Get framework configuration
const coreConfig = getFrameworkConfig('core');

// Get platform configuration
const desktopConfig = getPlatformConfig('desktop');

// Get build target
const buildTarget = getBuildTarget('build:web');

// Get environment variables for target
const env = getEnvironmentForTarget('build:web', 'production');

// Check if cloud cache is enabled
const cloudCacheEnabled = isCloudCacheEnabled('build:web');

// Get build outputs
const outputs = getOutputsForTarget('build:web');

// Get build timeout
const timeout = getTimeoutForTarget('build:web');
```

## emp.config.ts

Configuration for EMP (Enhanced Module Federation) micro-frontend architecture.

**Purpose**: Module federation setup for micro-frontend architecture
**Features**: Shared dependencies, remote modules, optimization

### Key Configuration

#### Module Federation
```typescript
empShare: {
  name: 'swcstudio_marketing',
  exposes: {
    './App': './src/App.tsx',
    './components': './shared/src/components/index.ts',
    './hooks': './shared/src/hooks/index.ts',
    './design-system': './shared/src/design-system/index.ts',
    './integrations': './shared/src/integrations/index.ts',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
    '@tanstack/react-query': { singleton: true },
    '@tanstack/react-router': { singleton: true },
    zustand: { singleton: true },
    '@arco-design/web-react': { singleton: true },
  },
  remotes: {
    // Add remote micro-frontends here
  },
}
```

#### Path Aliases
```typescript
resolve: {
  alias: {
    '@': './src',
    '@shared': './shared/src',
    '@components': './shared/src/components',
    '@hooks': './shared/src/hooks',
    '@integrations': './shared/src/integrations',
  },
}
```

#### Performance Optimization
```typescript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
      },
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react-vendor',
        priority: 20,
      },
      shared: {
        test: /[\\/]shared[\\/]/,
        name: 'shared-components',
        priority: 15,
      },
    },
  },
  treeshaking: true,
  usedExports: true,
  sideEffects: false,
}
```

## rsbuild.config.ts

RSpack configuration for web builds, providing optimal performance for React applications.

**Purpose**: High-performance web build configuration using RSpack
**Features**: React 19 support, TypeScript, Sass, optimization

### Core Configuration

#### Plugins
```typescript
plugins: [
  pluginReact(),
  pluginTypeCheck(),
  pluginSass()
]
```

#### Source Configuration
```typescript
source: {
  entry: {
    index: './src/index.tsx',
  },
  alias: {
    '@': './src',
    '@katalyst-react/shared': './shared/src/index.ts',
    '@katalyst-react/components': './shared/src/components/index.ts',
    '@katalyst-react/hooks': './shared/src/hooks/index.ts',
    '@katalyst-react/stores': './shared/src/stores/index.ts',
    '@katalyst-react/utils': './shared/src/utils/index.ts',
    '@katalyst-react/integrations': './shared/src/integrations/index.ts',
    '@katalyst-react/native': './shared/src/native/index.js',
  },
}
```

#### Output Configuration
```typescript
output: {
  target: 'web',
  distPath: {
    root: 'dist',
    js: 'static/js',
    css: 'static/css',
    svg: 'static/media',
    font: 'static/media',
    image: 'static/media',
    media: 'static/media',
  },
  filename: {
    js: '[name].[contenthash:8].js',
    css: '[name].[contenthash:8].css',
  },
  assetPrefix: '/',
  cleanDistPath: true,
}
```

#### Server Configuration
```typescript
server: {
  port: 3000,
  host: 'localhost',
  open: true,
  compress: true,
  historyApiFallback: true,
}
```

### Performance Features

#### Chunk Splitting Strategy
```typescript
performance: {
  chunkSplit: {
    strategy: 'split-by-experience',
    override: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 20,
        },
        katalyst: {
          test: /[\\/]shared[\\/]src[\\/]/,
          name: 'katalyst',
          priority: 15,
        },
      },
    },
  },
}
```

#### Rspack Optimization
```typescript
tools: {
  rspack: {
    experiments: {
      rspackFuture: {
        newTreeshaking: true,
      },
    },
    optimization: {
      minimize: process.env.NODE_ENV === 'production',
      minimizer: ['...'],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          multithreading: {
            test: /[\\/]shared[\\/]src[\\/]native[\\/]/,
            name: 'multithreading',
            priority: 30,
            chunks: 'all',
          },
        },
      },
    },
  },
}
```

### Environment-Specific Builds

#### Web Environment
```typescript
web: {
  output: {
    target: 'web',
  },
}
```

#### Desktop Environment
```typescript
desktop: {
  output: {
    target: 'electron-renderer',
  },
  source: {
    entry: {
      index: './src/desktop.tsx',
    },
  },
}
```

#### Mobile Environment
```typescript
mobile: {
  output: {
    target: 'web',
  },
  source: {
    entry: {
      index: './src/mobile.tsx',
    },
  },
}
```

#### WebXR Environment
```typescript
webxr: {
  output: {
    target: 'web',
  },
  source: {
    entry: {
      index: './src/webxr.tsx',
    },
  },
  tools: {
    rspack: {
      experiments: {
        asyncWebAssembly: true,
      },
    },
  },
}
```

## tauri-rsbuild.config.ts

Specialized RSpack configuration for Tauri applications supporting desktop, mobile, and WebXR platforms.

**Purpose**: Unified build configuration for all Tauri-based platforms
**Features**: Platform-specific optimizations, asset handling, WebAssembly support

### Platform Detection

```typescript
const platform = process.env.TAURI_PLATFORM || 'desktop';
const isDev = process.env.NODE_ENV === 'development';
const isDesktop = platform === 'desktop';
const isMobile = platform === 'mobile';
const isWebXR = platform === 'webxr';
```

### Plugin Configuration

```typescript
plugins: [
  pluginReact({
    reactRefreshOptions: {
      overlay: true,
    },
  }),
  pluginSvgr({
    svgrOptions: {
      exportType: 'default',
      prettier: false,
      svgo: true,
      titleProp: true,
      ref: true,
      replaceAttrValues: {
        '#000': 'currentColor',
        '#000000': 'currentColor',
      },
    },
  }),
  pluginTypeCheck({
    enable: true,
  }),
]
```

### Platform-Specific Configuration

#### Entry Points
```typescript
source: {
  entry: {
    index: getEntryForPlatform(platform),
  },
}

function getEntryForPlatform(platform: string): string {
  switch (platform) {
    case 'desktop':
      return './core/src/main.tsx';
    case 'mobile':
      return './shared/src/mobile/index.ts';
    case 'webxr':
      return './shared/src/webxr/index.ts';
    default:
      return './core/src/main.tsx';
  }
}
```

#### Platform-Specific Assets

**WebXR Assets** (3D models, textures):
```typescript
if (isWebXR) {
  rules.push({
    test: /\.(gltf|glb|fbx|obj|dae)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'static/models/[name].[contenthash:8][ext]',
    },
  });
}
```

**Mobile Assets** (videos, audio):
```typescript
if (isMobile) {
  rules.push({
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'static/media/[name].[contenthash:8][ext]',
    },
  });
}
```

#### Platform-Specific Optimization

**Chunk Size Limits**:
```typescript
function getMaxChunkSizeForPlatform(platform: string): number {
  switch (platform) {
    case 'mobile':
      return 200000; // 200KB for mobile
    case 'webxr':
      return 500000; // 500KB for WebXR (larger assets)
    default:
      return 244000; // 244KB for desktop
  }
}
```

**Bundle Splitting**:
```typescript
cacheGroups: {
  vendor: {
    test: /[\\/]node_modules[\\/]/,
    name: 'vendors',
    chunks: 'all',
    priority: 10,
  },
  react: {
    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
    name: 'react',
    chunks: 'all',
    priority: 20,
  },
  tauri: {
    test: /[\\/]node_modules[\\/]@tauri-apps[\\/]/,
    name: 'tauri',
    chunks: 'all',
    priority: 25,
  },
  webxr: {
    test: /[\\/]node_modules[\\/](three|@react-three|@webxr)[\\/]/,
    name: 'webxr',
    chunks: 'all',
    priority: 18,
    enforce: isWebXR,
  },
  mobile: {
    test: /[\\/](mobile|capacitor|cordova)[\\/]/,
    name: 'mobile',
    chunks: 'all',
    priority: 18,
    enforce: isMobile,
  },
}
```

#### Environment Variables

```typescript
source: {
  define: {
    __TAURI_PLATFORM__: JSON.stringify(platform),
    __IS_DESKTOP__: isDesktop,
    __IS_MOBILE__: isMobile,
    __IS_WEBXR__: isWebXR,
    __DEV__: isDev,
  },
}
```

#### PostCSS Configuration

```typescript
postcss: {
  postcssOptions: {
    plugins: [
      require('@tailwindcss/postcss')({
        config: getTailwindConfigForPlatform(platform),
      }),
      require('autoprefixer'),
      // Platform-specific PostCSS plugins
      ...(isMobile ? [require('postcss-viewport-units')] : []),
      ...(isWebXR ? [require('postcss-3d-transform')] : []),
    ],
  },
}
```

## Integration Between Configurations

All configuration files work together to provide a unified build experience:

1. **mod.ts** exports all configurations for easy importing
2. **build.config.ts** provides the master configuration and orchestration
3. **rsbuild.config.ts** handles web-specific builds
4. **emp.config.ts** manages micro-frontend architecture
5. **tauri-rsbuild.config.ts** provides cross-platform native builds

The configuration system supports:
- **Environment detection** and automatic configuration
- **Platform-specific optimizations** and asset handling
- **Shared dependencies** and module federation
- **Performance optimizations** and caching strategies
- **Type safety** with comprehensive TypeScript interfaces

## Usage Examples

### Basic Web Build
```typescript
import { rsbuildConfig } from '@katalyst/build-system';

// Uses rsbuild.config.ts for web builds
await runBuild('web');
```

### Desktop Application Build
```typescript
import { tauriRsbuildConfig } from '@katalyst/build-system';

// Uses tauri-rsbuild.config.ts for desktop builds
process.env.TAURI_PLATFORM = 'desktop';
await runBuild('desktop');
```

### Micro-frontend Build
```typescript
import { empConfig } from '@katalyst/build-system';

// Uses emp.config.ts for module federation
await runBuild('marketing');
```

### Custom Configuration
```typescript
import { buildConfig, getFrameworkConfig } from '@katalyst/build-system';

// Access main configuration
const coreConfig = getFrameworkConfig('core');
console.log(coreConfig.buildCommand); // 'rsbuild build'
```

This modular configuration system allows developers to easily customize builds for different platforms while maintaining consistency and performance across the entire application ecosystem.
