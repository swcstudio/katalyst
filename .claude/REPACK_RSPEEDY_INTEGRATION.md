# Repack + RSpeedy Integration Guide

## Overview

This document outlines the integration of **Re.Pack** (webpack-based React Native bundler) with **RSpeedy** (Lynx mobile framework) to create a powerful mobile development workflow that bridges web and native app development for engineering teams.

## What is Re.Pack?

Re.Pack is a modern bundler toolkit for React Native applications that replaces Metro with a webpack-based solution, providing:

- **Webpack Ecosystem Access**: Full access to webpack loaders, plugins, and tools
- **Module Federation**: Advanced microfrontends architecture support
- **Enhanced Code Splitting**: More sophisticated bundling strategies
- **Better Performance**: Optimized builds with advanced caching
- **Configurability**: Greater control over the build process

## Integration Architecture

### Current RSpeedy Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    RSpeedy (Lynx)                       │
├─────────────────────────────────────────────────────────┤
│ • High-performance mobile runtime                       │
│ • Native bridge communication                           │
│ • Cross-platform component sharing                      │
│ • Unified build system                                  │
└─────────────────────────────────────────────────────────┘
```

### Enhanced with Re.Pack
```
┌─────────────────────────────────────────────────────────┐
│                Re.Pack + RSpeedy Stack                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │   Web App   │ │ iOS Native  │ │Android Native│        │
│ │ (Webpack)   │ │ (Re.Pack)   │ │  (Re.Pack)   │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │          Module Federation Layer                    │ │
│ │  • Shared Components • Shared State • Shared APIs  │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │              RSpeedy Runtime                        │ │
│ │  • Native Bridge • Performance Optimization        │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Benefits for Engineering Teams

### 1. **Unified Development Experience**
- Same webpack configuration across web and mobile
- Shared build tooling and optimization strategies
- Consistent debugging and development workflow

### 2. **Microfrontends Architecture**
- Deploy components independently to web and mobile
- Share business logic across all platforms
- Enable team autonomy with module federation

### 3. **Advanced Code Splitting**
- Dynamic imports work seamlessly across platforms
- Lazy loading for mobile performance
- Shared chunks between web and native

### 4. **Enhanced Performance**
- Tree shaking for mobile bundles
- Advanced caching strategies
- Bundle analysis and optimization

## Implementation Strategy

### Phase 1: Re.Pack Setup

#### 1. Install Re.Pack in RSpeedy Project
```bash
# Add Re.Pack to mobile projects
npm install --save-dev @callstack/repack

# Configure webpack for mobile
npm install --save-dev webpack webpack-cli babel-loader

# Add module federation support
npm install --save-dev @module-federation/webpack

# Performance monitoring
npm install --save-dev webpack-bundle-analyzer
```

#### 2. Configure Re.Pack with RSpeedy
```javascript
// repack.config.js
const { getDefaultConfig } = require('@callstack/repack');
const path = require('path');

module.exports = (env) => {
  const config = getDefaultConfig(env);
  
  return {
    ...config,
    entry: './index.js',
    resolve: {
      ...config.resolve,
      alias: {
        '@shared': path.resolve(__dirname, '../shared/src'),
        '@tanstack': path.resolve(__dirname, '../shared/src/components/tanstack'),
      },
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        // Custom loaders for RSpeedy components
        {
          test: /\.rspeedy\.(ts|tsx)$/,
          use: ['babel-loader', './rspeedy-loader.js'],
        },
      ],
    },
    plugins: [
      ...config.plugins,
      // Module federation for shared components
      new ModuleFederationPlugin({
        name: 'rspeedy_mobile',
        remotes: {
          'shared_components': 'sharedComponents@http://localhost:3001/remoteEntry.js',
        },
        shared: {
          react: { singleton: true },
          'react-native': { singleton: true },
          '@tanstack/react-query': { singleton: true },
        },
      }),
    ],
  };
};
```

### Phase 2: Enhanced RSpeedy Integration

#### 1. Update RSpeedy Configuration
```typescript
// shared/src/integrations/rspeedy-repack.ts
import { RspeedyIntegration } from './rspeedy';

export class RepackRspeedyIntegration extends RspeedyIntegration {
  private repackConfig: RepackConfig;

  constructor(config: RspeedyConfig & { repack: RepackConfig }) {
    super(config);
    this.repackConfig = config.repack;
  }

  async setupRepackBundler() {
    return {
      name: 'rspeedy-repack',
      setup: () => ({
        bundler: 'repack',
        features: {
          webpackEcosystem: true,
          moduleFederation: true,
          advancedCodeSplitting: true,
          sharedModules: true,
          dynamicImports: true,
        },
        config: {
          entry: this.repackConfig.entry,
          output: this.repackConfig.output,
          optimization: {
            splitChunks: {
              chunks: 'all',
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
                },
                shared: {
                  test: /[\\/]shared[\\/]/,
                  name: 'shared',
                  chunks: 'all',
                },
                tanstack: {
                  test: /[\\/]@tanstack[\\/]/,
                  name: 'tanstack',
                  chunks: 'all',
                },
              },
            },
          },
          resolve: {
            alias: {
              '@shared': '../shared/src',
              '@tanstack': '../shared/src/components/tanstack',
            },
          },
        },
      }),
    };
  }

  async setupModuleFederation() {
    return {
      name: 'module-federation',
      setup: () => ({
        host: 'rspeedy_mobile',
        remotes: {
          'web_components': 'webComponents@http://localhost:3001/remoteEntry.js',
          'shared_state': 'sharedState@http://localhost:3002/remoteEntry.js',
        },
        exposes: {
          './MobileComponents': './src/components/mobile',
          './NativeBridge': './src/bridge/native-bridge',
          './RSpeedy': './src/hooks/use-rspeedy',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-native': { singleton: true },
          '@tanstack/react-query': { singleton: true },
          '@tanstack/react-router': { singleton: true },
          '@tanstack/react-table': { singleton: true },
        },
      }),
    };
  }

  async initialize() {
    const baseIntegrations = await super.initialize();
    const repackIntegrations = await Promise.all([
      this.setupRepackBundler(),
      this.setupModuleFederation(),
    ]);

    return [...baseIntegrations, ...repackIntegrations];
  }
}
```

#### 2. Enhanced Mobile Component Architecture
```typescript
// shared/src/mobile/components/RepackProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { RepackRspeedyIntegration } from '../integrations/rspeedy-repack';

interface RepackContextValue {
  loadRemoteComponent: <T>(remoteName: string, componentName: string) => Promise<React.ComponentType<T>>;
  isModuleLoaded: (remoteName: string) => boolean;
  preloadModule: (remoteName: string) => Promise<void>;
  getBundleInfo: () => BundleInfo;
}

const RepackContext = createContext<RepackContextValue | null>(null);

export function RepackProvider({ children, config }: {
  children: React.ReactNode;
  config: RepackConfig;
}) {
  const [loadedModules, setLoadedModules] = useState<Set<string>>(new Set());
  const [integration, setIntegration] = useState<RepackRspeedyIntegration | null>(null);

  useEffect(() => {
    const initializeRepack = async () => {
      const repackIntegration = new RepackRspeedyIntegration(config);
      await repackIntegration.initialize();
      setIntegration(repackIntegration);
    };

    initializeRepack();
  }, [config]);

  const loadRemoteComponent = async <T,>(
    remoteName: string,
    componentName: string
  ): Promise<React.ComponentType<T>> => {
    try {
      // Dynamic import with module federation
      const remote = await import(/* webpackChunkName: "[request]" */ `${remoteName}/${componentName}`);
      
      setLoadedModules(prev => new Set([...prev, remoteName]));
      
      return remote.default || remote[componentName];
    } catch (error) {
      console.error(`Failed to load remote component ${remoteName}/${componentName}:`, error);
      throw error;
    }
  };

  const isModuleLoaded = (remoteName: string): boolean => {
    return loadedModules.has(remoteName);
  };

  const preloadModule = async (remoteName: string): Promise<void> => {
    try {
      await import(/* webpackPreload: true */ remoteName);
      setLoadedModules(prev => new Set([...prev, remoteName]));
    } catch (error) {
      console.warn(`Failed to preload module ${remoteName}:`, error);
    }
  };

  const getBundleInfo = (): BundleInfo => {
    return {
      loadedModules: Array.from(loadedModules),
      totalSize: 0, // Would be calculated from webpack stats
      sharedModules: [], // Would be extracted from federation config
    };
  };

  const contextValue: RepackContextValue = {
    loadRemoteComponent,
    isModuleLoaded,
    preloadModule,
    getBundleInfo,
  };

  return (
    <RepackContext.Provider value={contextValue}>
      {children}
    </RepackContext.Provider>
  );
}

export function useRepack(): RepackContextValue {
  const context = useContext(RepackContext);
  if (!context) {
    throw new Error('useRepack must be used within a RepackProvider');
  }
  return context;
}
```

### Phase 3: Advanced Features

#### 1. Shared Component Federation
```typescript
// shared/src/mobile/federation/SharedComponentLoader.tsx
import React, { Suspense, lazy } from 'react';
import { useRepack } from '../components/RepackProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface SharedComponentLoaderProps<T = any> {
  remoteName: string;
  componentName: string;
  fallback?: React.ComponentType;
  props?: T;
  preload?: boolean;
}

export function SharedComponentLoader<T>({
  remoteName,
  componentName,
  fallback: Fallback,
  props,
  preload = false,
}: SharedComponentLoaderProps<T>) {
  const { loadRemoteComponent, preloadModule } = useRepack();

  React.useEffect(() => {
    if (preload) {
      preloadModule(remoteName);
    }
  }, [preload, remoteName, preloadModule]);

  const LazyComponent = lazy(() => loadRemoteComponent<T>(remoteName, componentName));

  return (
    <ErrorBoundary
      fallback={Fallback ? <Fallback {...props} /> : <div>Component failed to load</div>}
    >
      <Suspense fallback={<div>Loading {componentName}...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

#### 2. Performance Monitoring
```typescript
// shared/src/mobile/performance/RepackPerformanceMonitor.tsx
import { useEffect } from 'react';
import { useRepack } from '../components/RepackProvider';

export function useRepackPerformanceMonitor() {
  const { getBundleInfo } = useRepack();

  useEffect(() => {
    const monitor = setInterval(() => {
      const bundleInfo = getBundleInfo();
      
      // Report to analytics
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        console.log('Repack Performance Metrics:', {
          bundleInfo,
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          memoryUsage: (window.performance as any).memory?.usedJSHeapSize,
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(monitor);
  }, [getBundleInfo]);
}
```

## Development Workflow

### 1. **Local Development**
```bash
# Start web development server with module federation
npm run dev:web

# Start mobile development with Re.Pack
npm run dev:mobile -- --platform ios
npm run dev:mobile -- --platform android

# Start shared component development server
npm run dev:shared
```

### 2. **Build Process**
```bash
# Build all platforms with shared optimization
npm run build:all

# Build mobile with Re.Pack optimization
npm run build:mobile -- --platform ios --mode release
npm run build:mobile -- --platform android --mode release

# Analyze bundle composition
npm run analyze:bundle
```

### 3. **Deployment Strategy**
```bash
# Deploy shared components to CDN
npm run deploy:shared

# Deploy mobile apps with optimized bundles
npm run deploy:mobile
```

## Configuration Files

### 1. Package.json Scripts
```json
{
  "scripts": {
    "dev:mobile": "react-native start --config repack.config.js",
    "build:mobile": "react-native bundle --config repack.config.js",
    "dev:shared": "webpack serve --config webpack.federation.js",
    "build:shared": "webpack --config webpack.federation.js",
    "analyze:bundle": "npx webpack-bundle-analyzer build/static/js/*.js"
  }
}
```

### 2. TypeScript Configuration
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["./shared/src/*"],
      "@tanstack/*": ["./shared/src/components/tanstack/*"],
      "*/": ["./federation-types/*"]
    }
  }
}
```

## Migration Guide

### Step 1: Assess Current RSpeedy Setup
1. Audit existing mobile components
2. Identify shared logic between web and mobile
3. Map component dependencies

### Step 2: Install and Configure Re.Pack
1. Add Re.Pack to mobile projects
2. Migrate Metro configuration to webpack
3. Set up module federation

### Step 3: Implement Shared Component Architecture
1. Extract common components to federation
2. Set up remote component loading
3. Implement fallback strategies

### Step 4: Optimize and Monitor
1. Analyze bundle sizes
2. Implement performance monitoring
3. Set up deployment pipeline

## Best Practices

### 1. **Component Design**
- Design components to work across web and mobile
- Use platform-specific implementations when needed
- Implement graceful degradation

### 2. **Bundle Optimization**
- Split vendor and application code
- Use dynamic imports for large components
- Implement lazy loading strategies

### 3. **Development Experience**
- Set up hot reloading for all platforms
- Use shared development tools
- Implement consistent linting and formatting

### 4. **Performance**
- Monitor bundle sizes continuously
- Use code splitting effectively
- Implement performance budgets

## Troubleshooting

### Common Issues
1. **Module Resolution**: Ensure consistent path mapping across configurations
2. **Hot Reloading**: Verify webpack dev server configuration
3. **Bundle Splitting**: Check chunk optimization settings
4. **Federation**: Validate remote entry points

### Debug Tools
- Webpack Bundle Analyzer
- React DevTools with Federation support
- Metro/Re.Pack build logs
- Performance monitoring dashboard

## Future Enhancements

1. **Advanced Federation**: Implement version management for federated modules
2. **Edge Deployment**: Deploy components to edge locations
3. **A/B Testing**: Federation-based feature flag system
4. **Analytics**: Deep bundle and performance analytics

This integration provides a powerful foundation for modern mobile development that leverages the best of both webpack ecosystem and React Native performance, perfectly complementing the existing RSpeedy architecture.

## Implemented Components

### 1. Core Re.Pack Components

#### RepackProvider (`shared/src/mobile/components/repack/RepackProvider.tsx`)
- Main provider for Re.Pack functionality
- Manages module federation runtime
- Provides performance monitoring
- Handles dynamic module loading
- Supports code splitting and chunk management

#### ModuleFederationLoader (`shared/src/mobile/components/repack/ModuleFederationLoader.tsx`)
- Dynamic loading of federated modules
- Error boundaries and fallback handling
- Performance tracking and timeout management
- Retry logic and health monitoring
- Support for A/B testing and progressive enhancement

#### PerformanceMonitor (`shared/src/mobile/components/repack/PerformanceMonitor.tsx`)
- Real-time performance metrics display
- Bundle size and load time tracking
- Memory usage monitoring
- Module federation performance
- Threshold-based alerting system

### 2. Enhanced Mobile Components

#### EnhancedTouchableOpacity (`shared/src/mobile/components/enhanced/TouchableOpacity.tsx`)
- Extended TouchableOpacity with Re.Pack features
- Analytics integration with federated modules
- Performance measurement and tracking
- Dynamic module loading on press
- Adaptive styling and platform-specific behavior

**Features:**
- Federated analytics modules
- Performance measurement
- Module preloading on hover
- A/B testing support
- Haptic feedback integration

#### EnhancedSafeAreaView (`shared/src/mobile/components/enhanced/SafeAreaView.tsx`)
- Advanced safe area management
- Federated header/footer components
- Dynamic inset calculation
- Orientation and keyboard awareness
- Viewport tracking and analytics

**Features:**
- Dynamic safe area detection
- Federated UI components
- Adaptive layouts
- Performance optimization
- Analytics integration

### 3. Build System Enhancement

#### RepackBuilder (`shared/src/mobile/build-system/repack-builder.ts`)
- Enhanced build system with Re.Pack integration
- Module federation configuration
- Advanced webpack optimization
- Performance analysis
- Multi-platform support

**Features:**
- Webpack-based bundling
- Module federation setup
- Code splitting strategies
- Bundle analysis
- Platform-specific optimizations

### 4. Utility Components

#### Advanced Module Loading (`shared/src/mobile/components/repack/utils.tsx`)
- `usePreloadModules` - Batch module preloading
- `ConditionalModuleLoader` - Feature flag-based loading
- `ABTestModuleLoader` - A/B testing with federated modules
- `ProgressiveEnhancementLoader` - Graceful degradation
- `useModuleHealth` - Module health monitoring

#### Example Implementations (`shared/src/mobile/components/repack/examples.tsx`)
- Complete mobile app example
- Shopping cart with progressive enhancement
- Payment module A/B testing
- Feature-flag based components
- RSpeedy-specific optimizations

## Key Benefits Realized

### 1. **Module Federation**
- Shared components across web and mobile
- Independent deployment of features
- Dynamic loading and lazy loading
- Version management and rollback capability

### 2. **Performance Optimization**
- Advanced code splitting
- Bundle size optimization
- Memory usage monitoring
- Load time tracking
- Cache management

### 3. **Developer Experience**
- Hot reloading across platforms
- Bundle analysis tools
- Performance profiling
- Error boundary integration
- Development debugging tools

### 4. **Production Features**
- A/B testing framework
- Feature flag integration
- Progressive enhancement
- Graceful degradation
- Analytics integration

## Usage Examples

### Basic Setup
```typescript
import { RepackProvider, ModuleFederationLoader } from '@/shared/mobile/components/repack';

function App() {
  return (
    <RepackProvider config={repackConfig}>
      <ModuleFederationLoader
        remoteName="shared-components"
        moduleName="./Navigation"
        props={{ items: navItems }}
      />
    </RepackProvider>
  );
}
```

### Enhanced Components
```typescript
import { 
  EnhancedTouchableOpacity, 
  EnhancedSafeAreaView 
} from '@/shared/mobile/components/enhanced';

function HomePage() {
  return (
    <EnhancedSafeAreaView
      federation={{
        header: {
          remoteName: 'ui-components',
          moduleName: './Header'
        }
      }}
      analytics={{ trackViewport: true }}
    >
      <EnhancedTouchableOpacity
        onPress={handlePress}
        analytics={{
          eventName: 'cta_button_press',
          remoteName: 'analytics',
          moduleName: './tracker'
        }}
        performance={{ measureInteraction: true }}
      >
        <Text>Enhanced Button</Text>
      </EnhancedTouchableOpacity>
    </EnhancedSafeAreaView>
  );
}
```

### A/B Testing
```typescript
import { ABTestModuleLoader } from '@/shared/mobile/components/repack';

function PaymentSection() {
  return (
    <ABTestModuleLoader
      testName="payment-flow-v2"
      variants={[
        {
          name: 'control',
          remoteName: 'payment',
          moduleName: './FormV1',
          weight: 0.5
        },
        {
          name: 'variant',
          remoteName: 'payment',
          moduleName: './FormV2',
          weight: 0.5
        }
      ]}
    />
  );
}
```

This comprehensive integration enables modern mobile development with the full power of webpack ecosystem while maintaining React Native performance characteristics.