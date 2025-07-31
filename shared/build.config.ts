/**
 * Build configuration for @swcstudio/katalyst-shared
 * Creates clean distribution bundles hiding internal structure
 */

import { build } from 'esbuild';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const outDir = resolve('./dist');

// Ensure dist directory exists
mkdirSync(outDir, { recursive: true });

async function buildPackage() {
  console.log('🏗️  Building @swcstudio/katalyst-shared...');

  // Build ESM version
  await build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    external: [
      // React ecosystem
      'react',
      'react-dom',
      'react/*',
      
      // Build tools (these are consumed, not bundled)
      '@rspack/*',
      '@rsbuild/*',
      'rspack',
      'webpack',
      'vite',
      
      // TanStack suite
      '@tanstack/*',
      
      // Design systems
      '@arco-design/*',
      'tailwindcss',
      
      // Auth & payments
      '@clerk/*',
      '@reown/*',
      'wagmi',
      'viem',
      
      // Development tools
      'storybook',
      'playwright',
      '@biomejs/*',
      
      // Node.js built-ins
      'node:*',
      'fs',
      'path',
      'crypto',
      'url'
    ],
    splitting: true,
    chunkNames: 'chunks/[name]-[hash]',
    metafile: true,
    sourcemap: true,
    treeShaking: true,
    minify: process.env.NODE_ENV === 'production',
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }
  });

  // Build CommonJS version for compatibility
  await build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.cjs',
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    external: [
      'react',
      'react-dom',
      '@rspack/*',
      '@tanstack/*',
      '@arco-design/*'
    ],
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production'
  });

  // Create package.json for ESM/CJS dual package
  const packageJson = {
    type: 'module',
    main: './index.cjs',
    module: './index.js',
    types: './index.d.ts'
  };
  
  writeFileSync(
    resolve(outDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  console.log('✅ Build complete!');
  console.log('📦 Package structure:');
  console.log('   dist/');
  console.log('   ├── index.js        (ESM bundle)');
  console.log('   ├── index.cjs       (CommonJS bundle)');
  console.log('   ├── index.d.ts      (TypeScript types)');
  console.log('   ├── chunks/         (Code-split chunks)');
  console.log('   └── package.json    (Module metadata)');
  console.log('');
  console.log('🎯 Public API only - internal files hidden');
  console.log('📱 Tree-shakeable feature modules');
  console.log('⚡ Lazy-loaded dev tools and experimental features');
}

buildPackage().catch(console.error);