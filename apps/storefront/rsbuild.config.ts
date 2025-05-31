import { defineConfig } from '@rsbuild/core';
import { pluginSolid } from '@rsbuild/plugin-solid';

export default defineConfig({
  plugins: [pluginSolid()],
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  html: {
    title: 'SOTA Storefront',
  },
  server: {
    port: 30003,
  },
  output: {
    distPath: {
      root: '../../dist/storefront',
      js: 'assets/js',
      css: 'assets/css',
      image: 'assets/images',
      font: 'assets/fonts',
      media: 'assets/media',
    },
    cleanDistPath: true,
  },
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
