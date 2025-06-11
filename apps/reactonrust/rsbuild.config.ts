import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  server: {
    port: 20007,
    host: '0.0.0.0',
  },
  output: {
    target: 'web',
    distPath: {
      root: 'build',
    },
  },
  html: {
    template: './src/index.html',
    title: 'React on Rust - SSE Framework',
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          '@': './src',
          '~/shared': '../../libs/shared',
        },
      },
    },
  },
});
