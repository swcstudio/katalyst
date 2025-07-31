# UMI Framework Integration Guide

## Overview

UMI is Ant Group's enterprise-level React framework that provides a complete development ecosystem. This integration brings UMI's powerful features to the **superior Katalyst framework** as complementary tools, including convention-based routing patterns, Ant Design Pro components, and qiankun micro-frontends.

## ⚠️ IMPORTANT: Katalyst Architecture Precedence

**Katalyst's unified state management, routing, and architecture patterns take precedence over UMI's approaches. UMI integration is configured to bridge and complement Katalyst, NOT replace any of its superior capabilities.**

## Key Features (Complementary to Katalyst)

- **Ant Design Pro Integration**: Enterprise UI components that enhance Katalyst
- **Qiankun Micro-Frontends**: Alternative micro-frontend approach (bridges to Katalyst)
- **Convention Patterns**: File-system routing concepts (maps to Katalyst routing)
- **MFSU**: Module Federation Speed Up for faster builds
- **i18n**: Built-in internationalization support
- **Access Control**: Role-based access control patterns

## What UMI Does NOT Replace in Katalyst

- ❌ **State Management**: Katalyst's unified state management is superior to DVA
- ❌ **Routing**: Katalyst's routing system is more flexible than UMI's conventions
- ❌ **Build Pipeline**: Katalyst's RSpack integration is more advanced
- ❌ **Component Architecture**: Katalyst's design system is better organized

## Quick Start

### 1. Basic Setup

```tsx
import { UmiRuntimeProvider } from '@shared/components';
import { UmiConfig } from '@shared/integrations/umi';

const umiConfig: UmiConfig = {
  npmClient: 'pnpm',
  dva: true,
  antd: { theme: { primaryColor: '#1890ff' } },
  layout: {
    name: 'My App',
    logo: '/logo.svg',
    navTheme: 'dark'
  },
  request: { dataField: 'data' },
  locale: { default: 'en-US' },
  model: true
};

function App() {
  return (
    <UmiRuntimeProvider config={umiConfig}>
      <YourApp />
    </UmiRuntimeProvider>
  );
}
```

### 2. Using UMI Hooks (Bridged to Katalyst)

```tsx
import { useModel, useRequest, useIntl, useAccess } from '@shared/hooks';
import { useKatalyst } from '@shared/hooks'; // Katalyst takes precedence

function MyComponent() {
  const katalyst = useKatalyst(); // Primary state management
  
  // UMI model hook - bridges to Katalyst stores (NOT DVA)
  const { user, loading, update } = useModel('user'); // Note: 'update' not 'dispatch'
  
  // Request hook (can complement Katalyst's request patterns)
  const { data, loading: requestLoading, run } = useRequest(async () => {
    return fetch('/api/data').then(res => res.json());
  });
  
  // Internationalization (complements Katalyst)
  const { formatMessage, setLocale } = useIntl();
  
  // Access control (maps to Katalyst permissions)
  const access = useAccess();
  
  return (
    <div>
      {access.canRead && (
        <h1>{formatMessage({ id: 'welcome', defaultMessage: 'Welcome' })}</h1>
      )}
      <button onClick={() => update({ profileLoaded: true })}>
        Update User (via Katalyst bridge)
      </button>
    </div>
  );
}
```

### 3. Katalyst-First State Management

**DO NOT create DVA models** - use Katalyst's superior unified state management:

```typescript
// Use Katalyst stores instead of DVA models
import { useKatalyst } from '@shared/hooks';

function UserComponent() {
  const { config, updateConfig } = useKatalyst();
  
  // Katalyst's unified state management
  const updateUser = (userData: any) => {
    updateConfig({
      // Update via Katalyst's superior patterns
      user: userData
    });
  };
  
  return <div>Katalyst state management is better!</div>;
}

// If you MUST bridge UMI patterns, do it in src/umi-models/ (separate from Katalyst)
// But remember: Katalyst's approach is superior
```

## Configuration

### Complete UMI Config

```typescript
const umiConfig: UmiConfig = {
  // Basic settings
  npmClient: 'pnpm',
  base: '/',
  publicPath: '/',
  outputPath: 'dist',
  hash: true,
  
  // Features
  dva: {
    immer: true,
    lazyLoad: true
  },
  antd: {
    import: true,
    style: false, // CSS-in-JS
    theme: {
      primaryColor: '#1890ff',
      borderRadius: '6px'
    },
    configProvider: {
      prefixCls: 'ant'
    }
  },
  layout: {
    name: 'Enterprise App',
    logo: '/logo.svg',
    theme: 'pro',
    navTheme: 'dark',
    primaryColor: '#1890ff',
    layout: 'side',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true
  },
  request: {
    dataField: 'data'
  },
  locale: {
    default: 'en-US',
    antd: true,
    title: true,
    baseNavigator: true
  },
  model: true,
  
  // Qiankun micro-frontends
  qiankun: {
    master: {
      apps: [
        {
          name: 'subapp1',
          entry: '//localhost:8081',
          props: {
            routerBase: '/subapp1'
          }
        }
      ],
      sandbox: true,
      prefetch: true
    }
  },
  
  // Development
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  },
  
  // Build optimization
  mfsu: true,
  esbuildMinifyIIFE: true
};
```

### Convention-Based Routing

UMI uses file-system based routing:

```
src/pages/
├── index.tsx          // Route: /
├── users/
│   ├── index.tsx      // Route: /users
│   └── [id].tsx       // Route: /users/:id
├── products/
│   ├── _layout.tsx    // Layout for /products/*
│   ├── index.tsx      // Route: /products
│   └── detail.tsx     // Route: /products/detail
└── 404.tsx           // 404 page
```

### Configured Routing

```typescript
const routes: UmiRoute[] = [
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      { path: '/', component: '@/pages/Home' },
      { path: '/users', component: '@/pages/Users' },
      { path: '/products', component: '@/pages/Products' },
      { path: '/admin', access: 'isAdmin', component: '@/pages/Admin' }
    ]
  }
];
```

## Advanced Features

### 1. Layout Components

```tsx
import { UmiLayout } from '@shared/components';

function App() {
  return (
    <UmiLayout
      title="My Enterprise App"
      logo="/logo.svg"
      navTheme="dark"
      layout="side"
    >
      <Routes />
    </UmiLayout>
  );
}
```

### 2. Model Provider

```tsx
import { UmiModelProvider } from '@shared/components';
import userModel from './models/user';
import appModel from './models/app';

function App() {
  return (
    <UmiModelProvider models={[userModel, appModel]}>
      <MyApp />
    </UmiModelProvider>
  );
}
```

### 3. Access Control

```tsx
// src/access.ts
export default function(initialState: any) {
  const { currentUser } = initialState || {};
  
  return {
    canRead: !!currentUser,
    canWrite: currentUser?.role === 'admin',
    canDelete: currentUser?.role === 'admin',
    isAdmin: currentUser?.role === 'admin'
  };
}
```

### 4. Request Configuration

```tsx
// src/app.tsx
export const request = {
  timeout: 30000,
  errorConfig: {
    errorHandler: (error: any) => {
      console.error('Request failed:', error);
    },
    errorThrower: (res: any) => {
      if (!res.success) {
        throw new Error(res.message || 'Request failed');
      }
    }
  },
  requestInterceptors: [
    (config: any) => {
      config.headers.Authorization = `Bearer ${getToken()}`;
      return config;
    }
  ],
  responseInterceptors: [
    (response: any) => {
      return response.data;
    }
  ]
};
```

### 5. Internationalization

```tsx
// src/locales/en-US.ts
export default {
  'welcome': 'Welcome',
  'menu.home': 'Home',
  'menu.products': 'Products',
  'menu.users': 'Users'
};

// Component usage
function MyComponent() {
  const { formatMessage } = useIntl();
  
  return (
    <h1>{formatMessage({ id: 'welcome' })}</h1>
  );
}
```

## CLI Commands

```bash
# Development
umi dev

# Build
umi build

# Generate files
umi generate page products
umi generate model user

# Plugin management
umi plugin list
umi plugin add @umijs/plugin-sass

# Configuration
umi config list
umi config set outputPath build

# Setup
umi setup
```

## Integration with Katalyst

```tsx
import { KatalystProvider } from '@shared/components';
import { UmiRuntimeProvider } from '@shared/components';

const katalystConfig = {
  variant: 'core',
  integrations: [{
    name: 'umi',
    type: 'framework',
    enabled: true,
    config: umiConfig
  }]
};

function App() {
  return (
    <KatalystProvider config={katalystConfig}>
      <UmiRuntimeProvider config={umiConfig}>
        <MyApp />
      </UmiRuntimeProvider>
    </KatalystProvider>
  );
}
```

## File Structure

```
├── src/
│   ├── pages/           # Convention-based routes
│   ├── layouts/         # Layout components
│   ├── models/          # DVA models
│   ├── services/        # API services
│   ├── components/      # Shared components
│   ├── utils/           # Utility functions
│   ├── locales/         # i18n files
│   ├── access.ts        # Access control
│   └── app.tsx          # Runtime configuration
├── mock/                # Mock data
├── .umirc.ts           # UMI configuration
└── typings.d.ts        # Type definitions
```

## Best Practices

1. **Model Organization**: Group related state in namespaced models
2. **Route Access**: Use access control for protected routes
3. **Request Handling**: Centralize API calls in services
4. **Component Structure**: Follow Ant Design Pro patterns
5. **Performance**: Use MFSU for faster development builds
6. **Type Safety**: Leverage TypeScript throughout

## Migration from UMI 3 to UMI 4

```typescript
// Old (UMI 3)
import { connect } from 'umi';

// New (UMI 4)
import { connect } from '@umijs/max';
// or
import { useModel } from '@umijs/max';
```

## Troubleshooting

### Common Issues

1. **MFSU Build Errors**: Clear `.mfsu` cache folder
2. **Model Not Found**: Check namespace and file naming
3. **Route Access**: Verify access configuration
4. **Ant Design Themes**: Use CSS-in-JS for Ant Design 5

### Debug Mode

```typescript
// .umirc.ts
export default {
  define: {
    'process.env.UMI_ENV': process.env.NODE_ENV
  },
  devtool: 'eval-source-map'
};
```

## Performance

- **MFSU**: 50-80% faster dev builds
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Bundle Analysis**: Built-in analyzer

The UMI integration provides a complete enterprise-grade React development experience with minimal configuration!