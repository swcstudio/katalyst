import { defineNitroConfig } from 'nitro';

export default defineNitroConfig({
  experimental: {
    wasm: true
  },
  preset: 'deno',
  srcDir: 'src',
  output: {
    dir: 'dist',
    serverDir: 'dist/server',
    publicDir: 'dist/public'
  },
  runtimeConfig: {
    port: 3000
  },
  devServer: {
    port: 3000
  }
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
