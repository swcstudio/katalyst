import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [solidJs(), mdx()],
  output: 'hybrid',
  srcDir: './src',
  server: {
    port: 20001,
  },
  build: {
    outDir: '../../dist/blog'
  },
  experimental: {
    serverIslands: true,
  }
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
