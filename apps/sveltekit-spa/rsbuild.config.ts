import { defineConfig } from '@rsbuild/core';
import { pluginSvelte } from '@rsbuild/plugin-svelte';

export default defineConfig({
  plugins: [pluginSvelte()],
  server: {
    port: 3005,
  },
  source: {
    entry: {
      index: './src/app.html',
    },
  },
  html: {
    template: './src/app.html',
  },
  output: {
    target: 'web',
    distPath: {
      root: '../../dist/sveltekit-spa',
    },
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          '$lib': './src/lib',
          '$app': '@sveltejs/kit/app',
        },
      },
    },
  },
});
