# tsup.config.ts

> Source: `tsup.config.ts`

**Package:** `@katalyst/kitchen-sink`

## Overview

This module is part of the `@katalyst/kitchen-sink` package.

## Dependencies

- `tsup`

## Source Code

```typescript
import { defineConfig } from 'tsup';

export default defineConfig([
  // Main entry point
  {
    entry: {
      index: 'src/index.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    external: [
      'react',
      'react-dom',
      '@tauri-apps/api',
      '@react-navigation/native',
      '@react-three/fiber',
      '@remix-run/react',
      'next'
    ]
  },
  
  // Core module
  {
    entry: {
      core: 'src/core.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@tanstack/react-router',
      'zustand',
      'zod'
    ]
  },
  
  // Hooks module
  {
    entry: {
      hooks: 'src/hooks.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      'react-dom',
      '@swcstudio/multithreading'
    ]
  },
  
  // Design system module
  {
    entry: {
      'design-system': 'src/design-system.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      'react-dom',
      'clsx',
      'tailwind-merge',
      'framer-motion',
      '@radix-ui/react-*'
    ]
  },
  
  // API module
  {
    entry: {
      api: 'src/api.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      '@anthropic-ai/sdk',
      'openai',
      'langchain',
      'zod',
      'ws'
    ]
  },
  
  // AI module
  {
    entry: {
      ai: 'src/ai.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      '@anthropic-ai/sdk',
      'openai',
      'google-auth-library',
      'keytar',
      'ws',
      'uuid'
    ]
  },
  
  // Build system module
  {
    entry: {
      'build-system': 'src/build-system.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      '@rsbuild/core',
      '@rspack/core',
      '@tauri-apps/api',
      'webpack',
      'vite',
      'turbo',
      'nx',
      'esbuild',
      'rollup',
      'capacitor',
      'react-native',
      'expo',
      'three',
      '@react-three/fiber',
      '@react-three/xr'
    ]
  },
  
  // Mobile module
  {
    entry: {
      mobile: 'src/mobile.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      'react-native',
      '@react-navigation/native',
      '@react-navigation/bottom-tabs',
      '@react-navigation/native-stack'
    ]
  },
  
  // Desktop module
  {
    entry: {
      desktop: 'src/desktop.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      '@tauri-apps/api'
    ]
  },
  
  // WebXR module
  {
    entry: {
      webxr: 'src/webxr.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      'three',
      '@react-three/fiber',
      '@react-three/xr'
    ]
  },
  
  // Components module
  {
    entry: {
      components: 'src/components.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      'react-dom'
    ]
  },
  
  // Admin module
  {
    entry: {
      admin: 'src/admin.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      'react-dom',
      '@refinedev/core',
      '@refinedev/react-table'
    ]
  },
  
  // Marketing module
  {
    entry: {
      marketing: 'src/marketing.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'react',
      'react-dom',
      'next'
    ]
  },
  
  // CLI module
  {
    entry: {
      cli: 'src/cli.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: [
      'commander',
      'inquirer',
      'chalk',
      'ora'
    ]
  }
]);

```

---

*Generated documentation for @katalyst/kitchen-sink*
