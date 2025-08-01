# @swcstudio/katalyst-shared

**Production-ready React framework with multithreading, build tools, and business features**

A comprehensive shared component library that provides everything you need to build modern React applications with advanced capabilities like multithreading, optimized build configurations, and business-ready features.

## 🚀 Quick Start

```bash
# Install
npm install @swcstudio/katalyst-shared

# Or with pnpm
pnpm add @swcstudio/katalyst-shared
```

```typescript
// Simple app setup
import { KatalystApp, Button, Card } from '@swcstudio/katalyst-shared';

function App() {
  return (
    <KatalystApp>
      <Card>
        <Button>Hello Katalyst!</Button>
      </Card>
    </KatalystApp>
  );
}
```

## 📦 What's Included

### Core Framework
- **KatalystApp**: Single provider wrapper for your entire application
- **UI Components**: Production-ready Button, Card, Input, Badge, Tabs, Icon
- **Layouts**: AdminLayout, MarketingLayout for common app structures
- **Design System**: Consistent tokens, colors, spacing, typography

### Feature Modules (Tree-shakeable)

#### 📊 Data Management
```typescript
import { KatalystApp, Data } from '@swcstudio/katalyst-shared';

const { DataTable, useQuery, Form } = Data;
```
- TanStack Query, Table, Form, Router integration
- TRPC client setup
- State management with Zustand

#### 🏗️ Build Tools
```typescript
import { Build } from '@swcstudio/katalyst-shared';

// rspack.config.js  
export default await Build.createCoreConfig();
```
- RSpack configurations for different app types
- Plugin management and optimization
- Integration presets

#### 💳 Commerce
```typescript
import { Commerce } from '@swcstudio/katalyst-shared';

const { CheckoutForm, usePayment } = Commerce;
```
- Hyperswitch payment processing
- WalletConnect crypto payments
- Cart and checkout flows

#### 🚀 Multithreading
```typescript
import { Threading } from '@swcstudio/katalyst-shared';

const { useMultithreading, useAITaskProcessor } = Threading;
```
- Native Rust multithreading with Crossbeam, Rayon, Tokio
- AI task processing and parallel computation
- Thread monitoring and performance optimization

## 🎯 Usage Patterns

### Simple Marketing Site
```typescript
import { KatalystApp, Button, Card } from '@swcstudio/katalyst-shared';

function MarketingApp() {
  return (
    <KatalystApp theme="light">
      <MarketingLayout>
        <Card>
          <Button>Get Started</Button>
        </Card>
      </MarketingLayout>
    </KatalystApp>
  );
}
```

### Admin Dashboard
```typescript
import { KatalystApp, Data } from '@swcstudio/katalyst-shared';

function AdminApp() {
  const { DataTable, useQuery, QueryProvider } = Data;
  
  return (
    <KatalystApp features={{ data: true, accessibility: true }}>
      <QueryProvider>
        <AdminLayout>
          <DataTable data={users} columns={userColumns} />
        </AdminLayout>
      </QueryProvider>
    </KatalystApp>
  );
}
```

### E-commerce App
```typescript
import { KatalystApp, Commerce } from '@swcstudio/katalyst-shared';

function CommerceApp() {
  const { CheckoutForm, HyperswitchProvider } = Commerce;
  
  return (
    <KatalystApp>
      <HyperswitchProvider apiKey="your-key">
        <CheckoutForm />
      </HyperswitchProvider>
    </KatalystApp>
  );
}
```

### Build Configuration
```typescript
// rspack.config.js
import { Build } from '@swcstudio/katalyst-shared';

// Pre-configured setups
export default await Build.createCoreConfig();     // Basic React app
export default await Build.createRemixConfig();   // Remix full-stack
export default await Build.createAdminConfig();   // Admin dashboard

// Custom configuration
const { KatalystBuildPresets } = await Build.KatalystBuildPresets();
export default KatalystBuildPresets.createCustomPreset({
  features: ['data', 'commerce', 'multithreading']
});
```

## 🔧 Development Tools

Development-only features are automatically excluded from production builds:

```typescript
// Only loads in development
if (process.env.NODE_ENV === 'development') {
  const { DevTools } = await import('@swcstudio/katalyst-shared');
  const { MultithreadingDemo, RspackDashboard } = DevTools;
}
```

## 🎨 Architecture Benefits

### Tree-Shakeable
Only import what you use. Unused features are automatically excluded from your bundle.

### Lazy-Loaded
Heavy features like multithreading and dev tools are loaded on-demand.

### Production-Ready
Clear separation between production code and experimental features.

### Bundle Optimized
- Core only: ~15KB
- Core + Data: ~40KB  
- Core + Commerce: ~27KB
- Full features: ~50KB (vs. 500KB+ before optimization)

## 🔒 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { 
  KatalystConfig,
  RSpackPluginConfig,
  BuildVariant 
} from '@swcstudio/katalyst-shared';
```

## 📚 Examples

### Multithreading Example
```typescript
import { KatalystApp, Threading } from '@swcstudio/katalyst-shared';

function App() {
  const { useMultithreading } = Threading;
  const { processInParallel } = useMultithreading();
  
  const handleHeavyTask = async () => {
    const results = await processInParallel([
      () => complexCalculation(data1),
      () => complexCalculation(data2),  
      () => complexCalculation(data3)
    ]);
    console.log('Parallel results:', results);
  };
  
  return (
    <KatalystApp>
      <button onClick={handleHeavyTask}>
        Process in Parallel
      </button>
    </KatalystApp>
  );
}
```

## 🤝 Contributing

This package is built with a focus on production-ready, business-focused components. Internal file structure is hidden from consumers - only the public API in `/src/index.ts` is exposed.

## 📄 License

Apache-2.0

---

**Built by SWC Studio** | [Documentation](https://github.com/swcstudio/katalyst) | [Issues](https://github.com/swcstudio/katalyst/issues)