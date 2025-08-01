# EMP Framework Integration Guide

## Overview

The EMP (Enterprise Micro-Frontend Platform) has been successfully integrated into the Katalyst framework. This integration provides:

- **Module Federation 2.0** - Advanced code sharing and dynamic loading
- **Runtime Type Safety** - TypeScript support for remote modules
- **Cross-Framework Support** - React, Vue2, and Vue3 compatibility
- **Performance Optimizations** - 28% faster first load, 45% faster subsequent loads
- **Developer Experience** - Hot module replacement, CSS modules, and TypeScript plugins

## Quick Start

### 1. Basic Setup

```tsx
import { EMPRuntimeProvider } from '@shared/components';
import { EMPConfig } from '@shared/integrations/emp';

const empConfig: EMPConfig = {
  name: 'my-app',
  port: 8080,
  framework: 'react',
  mode: 'development',
  remotes: {
    'header': 'http://localhost:8001/emp.js',
    'footer': 'http://localhost:8002/emp.js'
  },
  exposes: {
    './App': './src/App.tsx'
  }
};

function App() {
  return (
    <EMPRuntimeProvider config={empConfig}>
      <YourApp />
    </EMPRuntimeProvider>
  );
}
```

### 2. Loading Remote Components

```tsx
import { RemoteComponent } from '@shared/components';

function MyPage() {
  return (
    <div>
      <RemoteComponent
        remoteName="header"
        moduleName="./Header"
        fallback={() => <div>Loading...</div>}
        props={{ title: 'My Site' }}
      />
    </div>
  );
}
```

### 3. Using the EMP Hook

```tsx
import { useEMP } from '@shared/hooks';

function DynamicLoader() {
  const { loadRemoteComponent } = useEMP({
    enableMetrics: true,
    onError: (error) => console.error('EMP Error:', error)
  });

  const handleLoad = async () => {
    const module = await loadRemoteComponent('products', './ProductList');
    // Use the module
  };
}
```

## Configuration

### EMP Config Structure

```typescript
interface EMPConfig {
  name: string;                     // Unique name for your app
  port: number;                     // Dev server port
  framework: 'react' | 'vue2' | 'vue3';
  mode: 'development' | 'production';
  remotes: Record<string, string>;  // Remote modules to consume
  exposes: Record<string, string>;  // Modules to expose
  shared: Record<string, any>;      // Shared dependencies
  runtime?: EMPRuntimeConfig;       // Runtime options
  devServer?: EMPDevServerConfig;   // Dev server options
  optimization?: EMPOptimizationConfig; // Build optimizations
}
```

### Runtime Configuration

```typescript
runtime: {
  errorBoundary: true,           // Enable error boundaries
  preload: ['header', 'footer'], // Modules to preload
  timeout: 5000,                 // Load timeout in ms
  retries: 3,                    // Retry attempts
  fallback: {                    // Fallback components
    Header: './src/components/DefaultHeader'
  }
}
```

## CLI Commands

```bash
# Initialize a new EMP project
emp init my-project

# Start development server
emp dev

# Build for production
emp build

# Analyze bundle
emp analyze

# Generate types for remote modules
emp type-gen

# Add a remote module
emp remote add header http://localhost:8001/emp.js

# List remote modules
emp remote list
```

## Advanced Features

### 1. Type Generation

EMP automatically generates TypeScript definitions for remote modules:

```typescript
// Generated at ./@mf-types/header/index.d.ts
export interface HeaderProps {
  title: string;
  links: string[];
}

export const Header: React.FC<HeaderProps>;
```

### 2. Metrics and Monitoring

```tsx
import { useEMPMetrics } from '@shared/hooks';

function MetricsDashboard() {
  const metrics = useEMPMetrics();
  
  return (
    <div>
      <p>Module Load Time: {metrics.moduleLoadTime}ms</p>
      <p>Error Rate: {metrics.errorRate}%</p>
      <p>Cache Hit Ratio: {metrics.cacheHitRatio}%</p>
    </div>
  );
}
```

### 3. Dynamic Remote Loading

```tsx
const { createRemotesManager } = useEMP();
const manager = createRemotesManager();

// Add a remote at runtime
await manager.add('newFeature', {
  name: 'feature',
  entry: 'https://cdn.example.com/feature/emp.js',
  version: '1.0.0'
});
```

### 4. Multi-Team Setup

```typescript
// Configure workspace for multiple teams
const workspace = empIntegration.configureMarketingTeamsWorkspace([
  { name: 'branding', port: 8001, modules: ['Header', 'Footer'] },
  { name: 'products', port: 8003, modules: ['ProductGrid'] },
  { name: 'content', port: 8004, modules: ['BlogList'] }
]);
```

## Best Practices

1. **Version Management**: Use specific versions for shared dependencies
2. **Error Handling**: Always provide fallback components for critical UI
3. **Performance**: Preload frequently used modules
4. **Type Safety**: Enable type generation for all remote modules
5. **Monitoring**: Use metrics in production to track performance

## Integration with Katalyst

The EMP integration works seamlessly with other Katalyst features:

```tsx
import { KatalystProvider } from '@shared/components';

const katalystConfig = {
  variant: 'core',
  integrations: [{
    name: 'emp',
    type: 'framework',
    enabled: true,
    config: empConfig
  }]
};

<KatalystProvider config={katalystConfig}>
  <EMPRuntimeProvider config={empConfig}>
    <App />
  </EMPRuntimeProvider>
</KatalystProvider>
```

## Troubleshooting

### Common Issues

1. **Module not found**: Check remote URL and module name
2. **Version conflicts**: Ensure shared dependencies match
3. **CORS errors**: Configure dev server headers
4. **Type errors**: Run `emp type-gen` to update types

### Debug Mode

Enable debug mode in development:

```typescript
debug: {
  clearLog: false,
  level: 'verbose',
  rsDoctor: {
    enable: true
  }
}
```

## Migration Guide

To migrate existing components to EMP:

1. Update package.json with EMP dependencies
2. Create emp.config.ts
3. Wrap app with EMPRuntimeProvider
4. Replace dynamic imports with RemoteComponent
5. Configure shared dependencies
6. Test in development mode

## Resources

- [EMP Documentation](https://empjs.dev)
- [Module Federation Guide](https://module-federation.io)
- [Example Repository](https://github.com/empjs/emp)

## Support

For issues or questions:
- Check the troubleshooting section
- Run `emp doctor` for diagnostics
- Visit the EMP GitHub repository