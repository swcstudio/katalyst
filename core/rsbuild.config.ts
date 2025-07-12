import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import process from "node:process";

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
    }),
  ],
  tools: {
    rspack: {
      plugins: [
        // new ModuleFederationPlugin({
        //   name: 'katalyst_core',
        //   filename: 'remoteEntry.js',
        //   exposes: {
        //     './App': './src/App.tsx',
        //     './components': './src/components/index.ts',
        //     './hooks': './src/hooks/index.ts',
        //     './stores': './src/stores/index.ts',
        //   },
        //   remotes: {
        //     katalyst_remix: 'katalyst_remix@http://localhost:20008/remoteEntry.js',
        //     katalyst_nextjs: 'katalyst_nextjs@http://localhost:20009/remoteEntry.js',
        //   },
        //   shared: {
        //     react: { singleton: true, requiredVersion: '^19.0.0' },
        //     'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        //     '@tanstack/react-query': { singleton: true },
        //     '@tanstack/react-router': { singleton: true },
        //     zustand: { singleton: true },
        //   },
        // }),
      ],
    },
    postcss: {
      postcssOptions: {
        plugins: [
          require('@tailwindcss/postcss'),
          require('autoprefixer'),
        ],
      },
    },
  },
  html: {
    template: './src/index.html',
    title: 'Katalyst Core - React 19 Framework',
    meta: {
      description: 'High-performance React 19 framework with Rust toolchain',
      viewport: 'width=device-width, initial-scale=1.0',
    },
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
    alias: {
      '@': './src',
      '@/components': './src/components',
      '@/hooks': './src/hooks',
      '@/utils': './src/utils',
      '@/stores': './src/stores',
    },
  },
  server: {
    port: 20007,
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
});
