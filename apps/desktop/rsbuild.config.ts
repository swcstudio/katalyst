import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindCSS } from '@rsbuild/plugin-tailwindcss';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { ModuleFederationPlugin } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginTailwindCSS(),
    pluginTypeCheck(),
  ],
  
  html: {
    template: './src/index.html',
  },
  
  source: {
    entry: {
      index: './src/main.tsx',
    },
    alias: {
      '@': './src',
      '@components': './src/components',
      '@utils': './src/utils',
      '@hooks': './src/hooks',
      '@store': './src/store',
      '@types': './src/types',
    },
  },
  
  output: {
    distPath: {
      root: 'dist',
    },
    assetPrefix: './',
  },
  
  server: {
    port: 3000,
    host: true,
  },
  
  tools: {
    bundlerChain: (chain) => {
      // Configure for Tauri compatibility
      chain.target('web');
      chain.devtool('source-map');
    },
  },
  
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: {
          'vendor': {
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            name: 'vendor',
          },
          'common': {
            minSize: 0,
            priority: 5,
            name: 'common',
          },
        },
      },
    },
  },
  
  moduleFederation: {
    options: {
      name: 'katalyst_desktop',
      filename: 'remoteEntry.js',
      exposes: {
        './DesktopApp': './src/federation-entry.ts',
        './DesktopLayout': './src/components/DesktopLayout',
        './Header': './src/components/Header',
        './Sidebar': './src/components/Sidebar',
        './components': './src/components',
        './providers/TauriProvider': './src/providers/TauriProvider',
        './routes': './src/routes',
        './App': './src/federation-entry.ts',
      },
      shared: {
        'react': { 
          singleton: true,
          requiredVersion: '^19.0.0',
          eager: false,
        },
        'react-dom': { 
          singleton: true,
          requiredVersion: '^19.0.0',
          eager: false,
        },
        '@tanstack/react-query': { 
          singleton: true,
          requiredVersion: '^5.0.0',
          eager: false,
        },
        '@tanstack/react-router': { 
          singleton: true,
          requiredVersion: '^1.0.0',
          eager: false,
        },
        'zustand': { 
          singleton: true,
          requiredVersion: '^5.0.0',
          eager: false,
        },
        '@katalyst/core': { 
          singleton: true,
          requiredVersion: 'workspace:*',
          eager: false,
        },
        '@katalyst/hooks': { 
          singleton: true,
          requiredVersion: 'workspace:*',
          eager: false,
        },
        '@katalyst/design-system': { 
          singleton: true,
          requiredVersion: 'workspace:*',
          eager: false,
        },
        '@katalyst/api': { 
          singleton: true,
          requiredVersion: 'workspace:*',
          eager: false,
        },
        '@katalyst/ai': { 
          singleton: true,
          requiredVersion: 'workspace:*',
          eager: false,
        },
        '@tauri-apps/api': { 
          singleton: true,
          requiredVersion: '^2.0.0',
          eager: false,
        },
        'lucide-react': { 
          singleton: true,
          requiredVersion: '^0.400.0',
          eager: false,
        },
        'clsx': { 
          singleton: true,
          requiredVersion: '^2.0.0',
          eager: false,
        },
        'tailwind-merge': { 
          singleton: true,
          requiredVersion: '^2.0.0',
          eager: false,
        },
        'sonner': { 
          singleton: true,
          requiredVersion: '^1.5.0',
          eager: false,
        },
      },
      remotes: {
        // Can consume other micro-frontends if needed
        katalyst_admin: 'katalyst_admin@http://localhost:3001/remoteEntry.js',
        katalyst_components: 'katalyst_components@http://localhost:3002/remoteEntry.js',
      },
    },
  },
});
