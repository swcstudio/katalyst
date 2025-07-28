# Installation Guide

This guide will help you install and set up the SWC Studio Marketing component ecosystem in your project.

## System Requirements

- **Node.js**: Version 18.0 or higher
- **Package Manager**: npm, yarn, or pnpm
- **TypeScript**: Version 5.0 or higher (recommended)
- **React**: Version 18.0 or higher

## Package Installation

### Core Package

```bash
# Using npm
npm install @swcstudio/shared

# Using yarn
yarn add @swcstudio/shared

# Using pnpm
pnpm add @swcstudio/shared
```

### Peer Dependencies

Install the required peer dependencies:

```bash
# React and React DOM (if not already installed)
npm install react react-dom

# TypeScript (for type support)
npm install -D typescript @types/react @types/react-dom

# Tailwind CSS (for styling)
npm install -D tailwindcss postcss autoprefixer
```

### Optional Dependencies

For specific features, you may need additional packages:

```bash
# For TanStack integration
npm install @tanstack/react-query @tanstack/react-form @tanstack/react-table

# For TRPC integration
npm install @trpc/client @trpc/react-query

# For advanced styling
npm install @emotion/react @emotion/styled

# For native multithreading features
npm install @swcstudio/native
```

## Framework-Specific Setup

### Next.js Setup

#### 1. Install Next.js Integration

```bash
npm install @swcstudio/nextjs-integration
```

#### 2. Configure Next.js

Update your `next.config.js`:

```js
// next.config.js
const { withSwcStudio } = require('@swcstudio/nextjs-integration');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
  experimental: {
    appDir: true, // If using App Router
  },
  // SWC Studio optimizations
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@swcstudio/shared'],
};

module.exports = withSwcStudio(nextConfig);
```

#### 3. Set Up App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { KatalystProvider } from '@swcstudio/shared';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SWC Studio App',
  description: 'Built with SWC Studio components',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <KatalystProvider framework="nextjs">
          {children}
        </KatalystProvider>
      </body>
    </html>
  );
}
```

#### 4. Set Up Pages Router (Next.js 12)

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { KatalystProvider } from '@swcstudio/shared';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <KatalystProvider framework="nextjs">
      <Component {...pageProps} />
    </KatalystProvider>
  );
}
```

### Remix Setup

#### 1. Install Remix Integration

```bash
npm install @swcstudio/remix-integration
```

#### 2. Configure Remix

Update your `remix.config.js`:

```js
// remix.config.js
const { withSwcStudio } = require('@swcstudio/remix-integration');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = withSwcStudio({
  ignoredRouteFiles: ["**/.*"],
  // SWC Studio specific configuration
  serverDependenciesToBundle: [
    '@swcstudio/shared',
    '@swcstudio/native',
  ],
});
```

#### 3. Set Up Root Component

```tsx
// app/root.tsx
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { KatalystProvider } from '@swcstudio/shared';
import './tailwind.css';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <KatalystProvider framework="remix">
          <Outlet />
        </KatalystProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

### Core React Setup

For standalone React applications (Create React App, Vite, etc.):

#### 1. Standard React Setup

```tsx
// src/main.tsx (Vite) or src/index.tsx (CRA)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { KatalystProvider } from '@swcstudio/shared';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KatalystProvider framework="react">
      <App />
    </KatalystProvider>
  </React.StrictMode>
);
```

#### 2. Vite Configuration

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { swcStudioPlugin } from '@swcstudio/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    swcStudioPlugin({
      // Enable native modules
      native: true,
      // Enable design system
      designSystem: true,
    }),
  ],
  optimizeDeps: {
    include: ['@swcstudio/shared'],
  },
});
```

## TypeScript Configuration

### 1. Update tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    // SWC Studio specific types
    "types": [
      "@swcstudio/shared/types",
      "@swcstudio/native/types"
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@swcstudio/*": ["./node_modules/@swcstudio/*/dist"]
    }
  },
  "include": [
    "src",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### 2. Add Type Definitions

Create `src/types/swc-studio.d.ts`:

```typescript
// src/types/swc-studio.d.ts
declare module '@swcstudio/shared' {
  // This ensures proper type inference
  export * from '@swcstudio/shared/dist/types';
}

declare module '@swcstudio/native' {
  export * from '@swcstudio/native/dist/types';
}

// Global type augmentations
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      // Add custom props if needed
      'data-swc-component'?: string;
    }
  }
}
```

## Styling Setup

### Tailwind CSS Configuration

#### 1. Initialize Tailwind

```bash
npx tailwindcss init -p
```

#### 2. Configure tailwind.config.js

```js
// tailwind.config.js
const { swcStudioPreset } = require('@swcstudio/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // For Next.js App Router
    './pages/**/*.{js,ts,jsx,tsx}', // For Next.js Pages Router
    './node_modules/@swcstudio/shared/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [swcStudioPreset],
  theme: {
    extend: {
      // Your custom theme extensions
    },
  },
  plugins: [
    // Additional Tailwind plugins
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

#### 3. Add Tailwind to CSS

```css
/* src/index.css or app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* SWC Studio design system tokens */
@import '@swcstudio/shared/dist/styles/tokens.css';
@import '@swcstudio/shared/dist/styles/components.css';

/* Custom styles */
@layer components {
  .swc-card-shadow {
    @apply shadow-lg shadow-gray-200/50 dark:shadow-gray-800/50;
  }
}
```

## Build Tool Configuration

### Webpack Configuration

```js
// webpack.config.js
const path = require('path');

module.exports = {
  // ... existing config
  resolve: {
    alias: {
      '@swcstudio/shared': path.resolve(__dirname, 'node_modules/@swcstudio/shared/dist'),
    },
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader', // For native modules
      },
    ],
  },
  externals: {
    // Don't bundle native modules
    '@swcstudio/native': 'commonjs @swcstudio/native',
  },
};
```

### RSpack Configuration

```js
// rspack.config.js
const { SwcStudioPlugin } = require('@swcstudio/rspack-plugin');

module.exports = {
  plugins: [
    new SwcStudioPlugin({
      // Enable tree shaking
      treeShaking: true,
      // Enable native module optimization
      nativeOptimization: true,
    }),
  ],
  resolve: {
    alias: {
      '@swcstudio/shared': require.resolve('@swcstudio/shared'),
    },
  },
};
```

## Environment Variables

### 1. Create Environment File

```bash
# .env.local (Next.js) or .env (other frameworks)

# SWC Studio Configuration
NEXT_PUBLIC_SWC_STUDIO_ENV=development
NEXT_PUBLIC_SWC_STUDIO_DEBUG=true

# API Configuration (if using TRPC)
NEXT_PUBLIC_API_URL=http://localhost:3000/api/trpc

# Native Module Configuration
SWC_STUDIO_NATIVE_THREADS=4
SWC_STUDIO_NATIVE_MEMORY_LIMIT=512

# Design System Configuration
NEXT_PUBLIC_THEME_MODE=system
NEXT_PUBLIC_DESIGN_TOKENS_URL=/design-tokens.json
```

### 2. Environment Type Definitions

```typescript
// src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SWC_STUDIO_ENV: 'development' | 'production';
    NEXT_PUBLIC_SWC_STUDIO_DEBUG: string;
    NEXT_PUBLIC_API_URL: string;
    SWC_STUDIO_NATIVE_THREADS: string;
    SWC_STUDIO_NATIVE_MEMORY_LIMIT: string;
    NEXT_PUBLIC_THEME_MODE: 'light' | 'dark' | 'system';
    NEXT_PUBLIC_DESIGN_TOKENS_URL: string;
  }
}
```

## Verification

### 1. Create Test Component

```tsx
// src/components/TestComponent.tsx
import React from 'react';
import { Button, Card, useKatalyst } from '@swcstudio/shared';

export function TestComponent() {
  const { config, theme } = useKatalyst();
  
  return (
    <Card className="p-6 max-w-md mx-auto">
      <Card.Header>
        <h2 className="text-xl font-bold">Installation Test</h2>
      </Card.Header>
      <Card.Content>
        <p className="text-gray-600 mb-4">
          SWC Studio is successfully installed!
        </p>
        <p className="text-sm text-gray-500">
          Framework: {config.framework}<br />
          Theme: {theme.mode}
        </p>
      </Card.Content>
      <Card.Footer>
        <Button variant="primary" size="md">
          Get Started
        </Button>
      </Card.Footer>
    </Card>
  );
}
```

### 2. Test Installation

```tsx
// src/App.tsx (or your main component)
import React from 'react';
import { TestComponent } from './components/TestComponent';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <TestComponent />
    </div>
  );
}

export default App;
```

### 3. Run Development Server

```bash
# Next.js
npm run dev

# Remix
npm run dev

# Vite
npm run dev

# Create React App
npm start
```

Visit your application in the browser. You should see the test component rendered with SWC Studio styling.

## Troubleshooting

### Common Issues

**Issue**: TypeScript errors about missing types
```bash
# Solution: Install type dependencies
npm install -D @types/react @types/react-dom
npm install -D typescript@latest
```

**Issue**: Tailwind classes not applying
```bash
# Solution: Verify Tailwind configuration
npx tailwindcss --help
# Check that content paths include SWC Studio components
```

**Issue**: Native modules not loading
```bash
# Solution: Rebuild native modules
npm rebuild @swcstudio/native
# Or install platform-specific binaries
npm install @swcstudio/native-darwin-x64 # For macOS
```

**Issue**: Build errors with bundlers
```js
// Solution: Update bundler configuration
// For Webpack, add to externals:
externals: {
  '@swcstudio/native': 'commonjs @swcstudio/native'
}
```

### Debug Mode

Enable debug mode to troubleshoot issues:

```tsx
import { KatalystProvider } from '@swcstudio/shared';

function App() {
  return (
    <KatalystProvider 
      debug={process.env.NODE_ENV === 'development'}
      framework="nextjs"
    >
      <YourApp />
    </KatalystProvider>
  );
}
```

### Check Installation

```tsx
// src/utils/checkInstallation.ts
import { checkSwcStudioInstallation } from '@swcstudio/shared/utils';

export function checkInstallation() {
  const status = checkSwcStudioInstallation();
  
  console.log('SWC Studio Installation Status:', {
    coreInstalled: status.core,
    nativeModulesAvailable: status.native,
    frameworkDetected: status.framework,
    themingConfigured: status.theming,
    issues: status.issues,
  });
  
  return status;
}
```

## Next Steps

After successful installation:

1. **[Quick Start Guide](./quick-start.md)** - Build your first component
2. **[Configuration Guide](./configuration.md)** - Customize the setup
3. **[Component Reference](../components/README.md)** - Explore available components
4. **[Examples](../examples/README.md)** - See real-world usage patterns

## Support

If you encounter issues during installation:

- Check the [Troubleshooting Guide](../troubleshooting.md)
- Search [GitHub Issues](https://github.com/swcstudio/swcstudio-marketing/issues)
- Join our [Discord Community](https://discord.gg/swcstudio)
- Email support: [support@swcstudio.com](mailto:support@swcstudio.com)