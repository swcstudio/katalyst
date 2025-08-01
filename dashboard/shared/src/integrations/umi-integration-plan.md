# UMI Framework Integration Plan

## Overview
This document outlines the comprehensive integration plan for UMI 4 (@umijs/max) into the Katalyst framework. UMI is Ant Group's enterprise-level React framework that provides a complete development ecosystem with convention-based routing, plugin system, and deep integration with DVA and Ant Design.

## Why UMI is More Complex Than EMP

1. **Full Application Framework**: Unlike EMP (focused on module federation), UMI is a complete application framework like Next.js
2. **Convention Over Configuration**: Requires adapting to UMI's conventions for routing, models, and file structure
3. **Plugin Lifecycle Management**: Complex plugin system with hooks into every build/runtime phase
4. **DVA State Management**: Built-in integration with DVA for Redux-like state management
5. **Qiankun Micro-Frontends**: Different approach to micro-frontends than Module Federation
6. **Ant Design Integration**: Deep coupling with Ant Design patterns and components

## Key Integration Challenges

1. **Routing System**: UMI uses file-based convention routing that conflicts with existing routing
2. **Build System**: UMI has its own build pipeline that needs to coexist with RSpack
3. **Plugin Architecture**: Need to bridge UMI plugins with Katalyst's integration system
4. **State Management**: DVA integration needs to work alongside existing Zustand stores
5. **Configuration**: UMI's configuration system is extensive and opinionated

## Integration Architecture

### 1. Enhanced UMI Integration Class
- Support for both UMI standalone mode and embedded mode
- Plugin management and lifecycle hooks
- Configuration translation between Katalyst and UMI formats
- Build pipeline integration with existing tools

### 2. UMI Runtime Provider
- Context provider for UMI runtime features
- Plugin injection and management
- Route synchronization with app routing
- Model (DVA) state management integration

### 3. Plugin Bridge System
- Adapter pattern for UMI plugins
- Lifecycle event translation
- Configuration merging strategies
- Error boundary for plugin failures

### 4. Routing Adapter
- Convention-based route discovery
- Dynamic route registration
- Nested route support
- Route guards and access control

### 5. Build Integration
- Webpack/RSpack configuration merger
- Asset optimization strategies
- Code splitting coordination
- Development server integration

## Implementation Phases

### Phase 1: Core Integration
1. Create enhanced UmiIntegration class
2. Implement configuration system
3. Add basic plugin support
4. Set up development environment

### Phase 2: Runtime Features
1. Create UmiRuntimeProvider
2. Implement routing adapter
3. Add DVA model support
4. Integrate request/response handling

### Phase 3: Advanced Features
1. Qiankun micro-frontend support
2. Ant Design Pro components
3. Internationalization (i18n)
4. Access control and permissions

### Phase 4: Developer Experience
1. TypeScript definitions
2. Development tools integration
3. Error handling and debugging
4. Documentation and examples

## Key Components to Implement

1. **UmiIntegration Class**
   - Configuration management
   - Plugin lifecycle
   - Build pipeline integration
   - Runtime initialization

2. **UmiRuntimeProvider**
   - Context for UMI features
   - Plugin injection
   - Route management
   - State synchronization

3. **UmiPluginBridge**
   - Plugin adapter interface
   - Lifecycle hooks
   - Configuration merger
   - Error handling

4. **UmiRouteAdapter**
   - Route discovery
   - Dynamic registration
   - Navigation guards
   - Layout system

5. **UmiModelProvider**
   - DVA integration
   - State management
   - Effect handling
   - Subscription system

## Configuration Strategy

```typescript
interface UmiConfig {
  // Core settings
  npmClient: 'npm' | 'yarn' | 'pnpm';
  base: string;
  publicPath: string;
  outputPath: string;
  
  // Routing
  routes?: Route[];
  conventionRoutes?: {
    exclude: RegExp[];
  };
  
  // Plugins
  plugins: string[];
  presets: string[];
  
  // Features
  dva: boolean | DvaConfig;
  antd: boolean | AntdConfig;
  request: boolean | RequestConfig;
  layout: boolean | LayoutConfig;
  qiankun: boolean | QiankunConfig;
  
  // Build
  webpack5: {};
  chainWebpack: Function;
  devServer: {};
}
```

## Integration Points

1. **With Katalyst Config**: Map UMI config to Katalyst integration config
2. **With RSpack**: Merge webpack configs for compatibility
3. **With Existing Routes**: Adapter pattern for route coexistence
4. **With State Management**: Bridge between DVA and Zustand
5. **With UI Components**: Ensure Ant Design works with existing components

## Benefits

- **Enterprise Features**: Access to Ant Group's battle-tested patterns
- **Convention-Based Development**: Faster development with conventions
- **Rich Plugin Ecosystem**: Extensive plugin library
- **Micro-Frontend Support**: Qiankun integration for complex apps
- **Full-Stack Capabilities**: API routes and SSR support

## Risks & Mitigation

1. **Complexity**: Start with minimal features, add incrementally
2. **Performance**: Monitor bundle size, use code splitting
3. **Conflicts**: Use namespacing and isolation patterns
4. **Learning Curve**: Provide comprehensive documentation
5. **Version Updates**: Pin versions, test updates carefully