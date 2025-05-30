export default {
  experimental: {
    wasm: true
  },
  preset: 'deno_server',
  compatibilityDate: '2025-01-30',
  srcDir: 'src',
  output: {
    dir: '.output',
    serverDir: '.output/server',
    publicDir: '.output/public'
  },
  runtimeConfig: {
    port: 3000
  },
  devServer: {
    port: 3000
  }
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
