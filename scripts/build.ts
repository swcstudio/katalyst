import { build } from 'nitro';

console.log('Building SOTA Marketing Stack with Nitro...');

try {
  await build({
    preset: 'deno_server',
    compatibilityDate: '2024-01-01',
    experimental: {
      wasm: true
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
