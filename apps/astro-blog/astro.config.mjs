import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';

export default defineConfig({
  integrations: [solidJs()],
  server: {
    port: 20001,
  },
  output: 'static',
  outDir: '../../dist/astro-blog',
  build: {
    format: 'directory',
  },
  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  },
});
