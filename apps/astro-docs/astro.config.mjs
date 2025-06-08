import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';

export default defineConfig({
  integrations: [solidJs()],
  server: {
    port: 20003,
  },
  output: 'static',
  outDir: '../../dist/astro-docs',
  build: {
    format: 'directory',
  },
});
