import { defineConfig } from '@rsbuild/core';
import { pluginSvelte } from '@rsbuild/plugin-svelte';

export default defineConfig({
  plugins: [pluginSvelte()],
  server: {
    port: 20005,
  },
  source: {
    entry: {
      index: './src/app.ts',
    },
  },
  html: {
    template: './src/app.html',
  },
  output: {
    distPath: {
      root: 'build',
    },
    cleanDistPath: true,
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          $app: '@sveltejs/kit/app',
          $lib: './src/lib',
        },
      },
    },
  },
});
