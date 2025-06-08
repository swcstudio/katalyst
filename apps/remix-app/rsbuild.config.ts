import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  source: {
    entry: {
      index: './app/entry.client.tsx',
    },
  },
  server: {
    port: 20004,
  },
  output: {
    target: 'web',
    distPath: {
      root: 'build',
    },
  },
  html: {
    template: './app/root.tsx',
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          '~': './app',
        },
      },
    },
  },
});
