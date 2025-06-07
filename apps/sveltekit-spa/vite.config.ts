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
});
