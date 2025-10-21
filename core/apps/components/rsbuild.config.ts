import { RsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import path from 'path';

const config: RsbuildConfig = {
  plugins: [
    pluginReact({
      fastRefresh: true,
    }),
    pluginSvgr(),
    pluginTypeCheck({
      enable: process.env.NODE_ENV === 'development',
    }),
  ],
  html: {
    template: './src/index.html',
    title: 'Katalyst Component Library',
    favicon: './public/favicon.ico',
  },
  source: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/stories': path.resolve(__dirname, './src/stories'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@katalyst/components': path.resolve(__dirname, './src'),
      '@katalyst/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
    },
    entry: {
      index: './src/index.tsx',
    },
  },
  output: {
    cleanDistPath: true,
    polyfill: 'usage',
    distPath: {
      root: 'dist',
    },
  },
  server: {
    port: 20008,
    host: true,
  },
  dev: {
    progress: true,
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: {
          'lib-react': ['react', 'react-dom'],
          'lib-radix': ['@radix-ui/react-*'],
          'lib-storybook': ['@storybook/*'],
          'lib-utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
  },
};

export default config;
