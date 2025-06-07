export default {
  experimental: {
    wasm: true,
    nitropack: true,
  },
  preset: 'deno_server',
  compatibilityDate: '2025-01-30',
  srcDir: 'src',
  output: {
    dir: '.output',
    serverDir: '.output/server',
    publicDir: '.output/public',
  },
  runtimeConfig: {
    port: 20000,
    apiBase: '/api',
    public: {
      apiBase: '/api',
    },
  },
  devServer: {
    port: 20000,
  },
  routeRules: {
    '/api/**': {
      cors: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
    '/marketing/**': { proxy: 'http://localhost:20000' },
    '/blog/**': { proxy: 'http://localhost:20001' },
    '/storefront/**': { proxy: 'http://localhost:20002' },
    '/docs/**': { proxy: 'http://localhost:20003' },
    '/remix/**': { proxy: 'http://localhost:20004' },
    '/spa/**': { proxy: 'http://localhost:20005' },
  },
  storage: {
    redis: {
      driver: 'redis',
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    },
  },
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
