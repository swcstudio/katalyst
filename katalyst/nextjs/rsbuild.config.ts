import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
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
    template: './src/app/layout.tsx',
    title: 'Katalyst Next.js - React 19 + Next.js Framework',
    meta: {
      description: 'High-performance React 19 + Next.js framework with Rust toolchain',
      viewport: 'width=device-width, initial-scale=1.0',
    },
  },
  source: {
    entry: {
      index: './src/app/page.tsx',
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
