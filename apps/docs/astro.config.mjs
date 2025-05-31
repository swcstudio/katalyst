import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [solidJs(), mdx()],
  srcDir: './src',
  server: {
    port: 30002,
  },
  build: {
    outDir: '../../dist/docs'
  }
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
