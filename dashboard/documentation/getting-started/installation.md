# Installation Guide

This guide will help you install and set up the SWC Studio Marketing component ecosystem in your project.

## System Requirements

- **Deno**: Version 2.0 or higher (primary runtime)
- **Bun**: Version 1.0 or higher (fallback if Deno has issues)
- **TypeScript**: Version 5.0 or higher (built-in with Deno)
- **React**: Version 18.0 or higher

## Package Installation

### Primary Installation (Deno - Recommended)

SWC Studio natively supports Deno out of the box for optimal performance:

```bash
# Using Deno (recommended)
deno add @swcstudio/shared

# Install peer dependencies
deno add react react-dom

# TypeScript support is built-in with Deno - no additional installation needed!
```

### Fallback Installation (Bun)

If you encounter issues with Deno, use Bun as the fallback option:

```bash
# Using Bun (fallback option)
bun add @swcstudio/shared

# Install peer dependencies
bun add react react-dom

# TypeScript support
bun add -D typescript @types/react @types/react-dom
```

### Legacy Installation (npm/yarn/pnpm)

For projects that must use traditional Node.js package managers:

```bash
# Using npm (legacy)
npm install @swcstudio/shared

# Using yarn (legacy)
yarn add @swcstudio/shared

# Using pnpm (legacy)
pnpm add @swcstudio/shared
```

### Core Dependencies

Install the required dependencies based on your package manager:

```bash
# Deno (recommended)
deno add react react-dom @swcstudio/shared

# Bun (fallback)
bun add react react-dom @swcstudio/shared
bun add -D typescript @types/react @types/react-dom

# npm/yarn/pnpm (legacy)
npm install react react-dom @swcstudio/shared
npm install -D typescript @types/react @types/react-dom
```

### Styling Dependencies

For Tailwind CSS support:

```bash
# Deno
deno add tailwindcss postcss autoprefixer

# Bun
bun add -D tailwindcss postcss autoprefixer

# npm/yarn/pnpm
npm install -D tailwindcss postcss autoprefixer
```

### Optional Integrations

For specific features, you may need additional packages:

```bash
# TanStack ecosystem (Deno)
deno add @tanstack/react-query @tanstack/react-form @tanstack/react-table

# TanStack ecosystem (Bun)
bun add @tanstack/react-query @tanstack/react-form @tanstack/react-table

# TRPC integration (Deno)
deno add @trpc/client @trpc/react-query

# TRPC integration (Bun)
bun add @trpc/client @trpc/react-query

# TRPC integration (npm/yarn/pnpm - legacy)
npm install @trpc/client @trpc/react-query

# Advanced styling (Deno)
deno add @emotion/react @emotion/styled

# Advanced styling (Bun)
bun add @emotion/react @emotion/styled

# Native multithreading (Deno)
deno add @swcstudio/native

# Native multithreading (Bun)
bun add @swcstudio/native
```

## Framework-Specific Setup

### Next.js Setup

#### 1. Install Next.js Integration

```bash
# Deno (recommended)
deno add @swcstudio/nextjs-integration

# Bun (fallback)
bun add @swcstudio/nextjs-integration

# npm/yarn/pnpm (legacy)
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
# Deno (recommended)
deno add @swcstudio/remix-integration

# Bun (fallback)
bun add @swcstudio/remix-integration

# npm/yarn/pnpm (legacy)
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

#### Option 1: Deno with Fresh (Recommended)

```bash
# Create new Fresh project with SWC Studio
deno run -A -r https://fresh.deno.dev my-swc-studio-app
cd my-swc-studio-app

# Add SWC Studio
deno add @swcstudio/shared react react-dom
```

```tsx
// routes/index.tsx
import { KatalystProvider, Button } from '@swcstudio/shared';

export default function Home() {
  return (
    <KatalystProvider framework="fresh">
      <div class="p-8">
        <h1 class="text-3xl font-bold mb-4">SWC Studio with Fresh</h1>
        <Button variant="primary">Get Started</Button>
      </div>
    </KatalystProvider>
  );
}
```

#### Option 2: Bun with Vite (Fallback)

```bash
# Create Vite project with Bun
bun create vite my-swc-studio-app --template react-ts
cd my-swc-studio-app

# Install SWC Studio
bun add @swcstudio/shared react react-dom
```

```tsx
// src/main.tsx
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

#### Option 3: Legacy Node.js Setup

For traditional React applications (Create React App, Vite with npm, etc.):

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

## Deno Configuration

### 1. Create deno.json

```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --allow-env --watch main.tsx",
    "build": "deno compile --allow-net --allow-read --allow-env main.tsx",
    "preview": "deno run --allow-net --allow-read --allow-env main.tsx"
  },
  "imports": {
    "@swcstudio/shared": "npm:@swcstudio/shared@latest",
    "react": "https://esm.sh/react@18",
    "react-dom": "https://esm.sh/react-dom@18"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### 2. Deno Import Map (Alternative)

```json
{
  "imports": {
    "@/": "./src/",
    "@swcstudio/shared": "npm:@swcstudio/shared",
    "react": "https://esm.sh/react@^18.2.0",
    "react-dom": "https://esm.sh/react-dom@^18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@^18.2.0/client"
  }
}
```

## Bun Configuration

### 1. Create bunfig.toml

```toml
[install]
# Use npm registry for compatibility
registry = "https://registry.npmjs.org/"

# Enable SWC Studio optimizations
cache = true
lockfile = true

[install.scopes]
"@swcstudio" = { registry = "https://registry.npmjs.org/" }
```

### 2. Vite Configuration (with Bun)

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

### Deno-Specific Issues

**Issue**: Deno permission errors
```bash
# Solution: Grant necessary permissions
deno run --allow-all your-app.tsx
# Or grant specific permissions:
deno run --allow-net --allow-read --allow-env your-app.tsx
```

**Issue**: ESM import issues with SWC Studio
```bash
# Solution: Use npm: prefix for Node.js packages
deno add npm:@swcstudio/shared
# Or update import map in deno.json
```

**Issue**: React types not found in Deno
```typescript
// Solution: Add React types to deno.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "https://esm.sh/react@18",
    "@types/react": "https://esm.sh/@types/react@18"
  }
}
```

### Bun-Specific Issues

**Issue**: Package installation fails with Bun
```bash
# Solution: Clear cache and reinstall
bun pm cache rm
bun install --force
```

**Issue**: TypeScript errors with Bun
```bash
# Solution: Install type dependencies explicitly
bun add -D @types/react @types/react-dom typescript
```

**Issue**: Native modules not working with Bun
```bash
# Solution: Use Node.js compatibility mode
bun --bun run your-script.js
```

### Common Issues (All Package Managers)

**Issue**: TypeScript errors about missing types
```bash
# Deno (types are usually built-in)
deno cache --reload your-app.tsx

# Bun
bun add -D @types/react @types/react-dom typescript

# npm/yarn/pnpm (legacy)
npm install -D @types/react @types/react-dom typescript@latest
```

**Issue**: Tailwind classes not applying
```bash
# Deno
deno run --allow-write npm:tailwindcss --init

# Bun  
bunx tailwindcss init

# npm/yarn/pnpm (legacy)
npx tailwindcss init
```

**Issue**: Native modules not loading
```bash
# Deno
deno cache --reload npm:@swcstudio/native

# Bun
bun add @swcstudio/native --force

# npm/yarn/pnpm (legacy)
npm rebuild @swcstudio/native
```

**Issue**: Build errors with bundlers
```js
// Solution: Update bundler configuration based on your setup

// For Deno Fresh
// deno.json
{
  "imports": {
    "@swcstudio/native": "npm:@swcstudio/native"
  }
}

// For Bun with Vite
// vite.config.js  
export default defineConfig({
  optimizeDeps: {
    include: ['@swcstudio/shared']
  }
});

// For Webpack (legacy)
externals: {
  '@swcstudio/native': 'commonjs @swcstudio/native'
}
```

### Package Manager Migration

**Migrating from npm/yarn to Deno**:
```bash
# 1. Remove node_modules and lock files
rm -rf node_modules package-lock.json yarn.lock

# 2. Create deno.json with npm imports
echo '{
  "imports": {
    "@swcstudio/shared": "npm:@swcstudio/shared@latest"
  }
}' > deno.json

# 3. Update scripts to use Deno
# Replace npm scripts with deno tasks
```

**Migrating from npm/yarn to Bun**:
```bash
# 1. Remove existing lock files
rm -rf node_modules package-lock.json yarn.lock

# 2. Install with Bun
bun install

# 3. Update scripts in package.json to use bun
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

## Running Your Application

### Deno Commands
```bash
# Development server
deno task dev

# Build for production  
deno task build

# Preview production build
deno task preview
```

### Bun Commands
```bash
# Development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Legacy Commands
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

## Next Steps

After successful installation:

1. **[Quick Start Guide](./quick-start.md)** - Build your first component with Deno/Bun
2. **[Configuration Guide](./configuration.md)** - Customize Deno/Bun setup
3. **[Component Reference](../components/README.md)** - Explore available components
4. **[Examples](../examples/README.md)** - See Deno/Bun-specific usage patterns

## Support

If you encounter issues during installation:

### Deno Support
- [Deno Documentation](https://deno.land/manual)
- [Fresh Framework Guide](https://fresh.deno.dev)
- Check Deno permissions and import maps

### Bun Support  
- [Bun Documentation](https://bun.sh/docs)
- [Bun Package Manager](https://bun.sh/docs/cli/install)
- Check bunfig.toml configuration

### General Support
- Check the [Troubleshooting Guide](../troubleshooting.md)
- Search [GitHub Issues](https://github.com/swcstudio/swcstudio-marketing/issues)
- Join our [Discord Community](https://discord.gg/swcstudio)
- Email support: [support@swcstudio.com](mailto:support@swcstudio.com)

## Performance Benefits

### Why Deno?
- ✅ **Built-in TypeScript** - No additional type setup required
- ✅ **Native ESM** - Modern module system out of the box
- ✅ **Security by Default** - Permission-based security model
- ✅ **Web Standards** - Uses standard Web APIs
- ✅ **Single Executable** - No external dependencies needed

### Why Bun as Fallback?
- ✅ **Ultra Fast** - 2-3x faster than npm/yarn package installation
- ✅ **All-in-One** - Runtime, bundler, package manager, and test runner
- ✅ **Node.js Compatible** - Drop-in replacement for Node.js
- ✅ **Native Speed** - Written in Zig for maximum performance
- ✅ **Hot Reloading** - Fast development iteration