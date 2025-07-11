import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
  plugins: [
    pluginReact({
      reactRefreshOptions: {
        overlay: true,
      },
    }),
    pluginSvgr({
      svgrOptions: {
        exportType: 'default',
      },
    }),
    pluginTypeCheck({
      enable: true,
      forkTsChecker: {
        typescript: {
          memoryLimit: 4096,
          configFile: './tsconfig.json',
        },
      },
    }),
  ],
  html: {
    template: './src/index.html',
    title: 'Katalyst Remix - React 19 + Remix Framework',
    meta: {
      description: 'High-performance React 19 + Remix framework with Rust toolchain',
      viewport: 'width=device-width, initial-scale=1.0',
    },
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
    alias: {
      '@': './app',
      '@/components': './app/components',
      '@/hooks': './app/hooks',
      '@/utils': './app/utils',
      '@/stores': './app/stores',
      '@/routes': './app/routes',
    },
  },
  server: {
    port: 20008,
    host: '0.0.0.0',
    open: false,
  },
  dev: {
    hmr: true,
    liveReload: true,
    progressBar: true,
  },
  output: {
    target: 'web',
    distPath: {
      root: 'dist',
      js: 'static/js',
      css: 'static/css',
      svg: 'static/svg',
      font: 'static/fonts',
      image: 'static/images',
    },
    filename: {
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css',
    },
    cleanDistPath: true,
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
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
          remix: {
            test: /[\\/]node_modules[\\/]@remix-run[\\/]/,
            name: 'remix',
            chunks: 'all',
            priority: 18,
          },
          tanstack: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
            name: 'tanstack',
            chunks: 'all',
            priority: 15,
          },
        },
      },
    },
    bundleAnalyze: process.env.BUNDLE_ANALYZE ? {} : undefined,
  },
  tools: {
    rspack: {
      plugins: [
        new ModuleFederationPlugin({
          name: 'katalyst_remix',
          filename: 'remoteEntry.js',
          exposes: {
            './AdminDashboard': './app/components/AdminDashboard.tsx',
            './DataTable': './app/components/DataTable.tsx',
            './Analytics': './app/components/Analytics.tsx',
          },
          remotes: {
            katalyst_core: 'katalyst_core@http://localhost:20007/remoteEntry.js',
            katalyst_nextjs: 'katalyst_nextjs@http://localhost:20009/remoteEntry.js',
          },
          shared: {
            react: { singleton: true, requiredVersion: '^19.0.0' },
            'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
            '@remix-run/react': { singleton: true },
            '@tanstack/react-query': { singleton: true },
            '@tanstack/react-table': { singleton: true },
            zustand: { singleton: true },
          },
        }),
      ],
    },
    postcss: {
      postcssOptions: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  },
});
