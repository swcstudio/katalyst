import { defineConfig } from '@rsbuild/core';
import { pluginSolid } from '@rsbuild/plugin-solid';

export default defineConfig({
  plugins: [pluginSolid()],
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  server: {
    port: 30000,
    open: true,
  },
  html: {
    title: 'SOTA Marketing Stack',
  },
  tools: {
    rspack: {
      optimization: {
        minimize: process.env.NODE_ENV === 'production',
      },
    },
  },
  output: {
    distPath: {
      root: 'dist',
      js: 'assets/js',
      css: 'assets/css',
      image: 'assets/images',
      font: 'assets/fonts',
      media: 'assets/media',
    },
    cleanDistPath: true,
  },
});
