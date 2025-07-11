import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
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
  html: {
    template: './src/index.html',
    title: 'Katalyst Next.js - React 19 + Next.js Framework',
    meta: {
      description: 'High-performance React 19 + Next.js framework with Rust toolchain',
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
      '@/app': './src/app',
    },
  },
  server: {
    port: 20009,
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
      root: '.next',
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
          nextjs: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'nextjs',
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
        // new ModuleFederationPlugin({
        //   name: 'katalyst_nextjs',
        //   filename: 'remoteEntry.js',
        //   exposes: {
        //     './Marketing': './src/components/Marketing.tsx',
        //     './Hero': './src/components/Hero.tsx',
        //     './Features': './src/components/Features.tsx',
        //     './Pricing': './src/components/Pricing.tsx',
        //   },
        //   remotes: {
        //     katalyst_core: 'katalyst_core@http://localhost:20007/remoteEntry.js',
        //     katalyst_remix: 'katalyst_remix@http://localhost:20008/remoteEntry.js',
        //   },
        //   shared: {
        //     react: { singleton: true, requiredVersion: '^19.0.0' },
        //     'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        //     'next': { singleton: true },
        //     '@tanstack/react-query': { singleton: true },
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
});
