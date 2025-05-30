import { dev } from 'nitro';

console.log('Starting SOTA Marketing Stack development server...');

try {
  await dev({
    preset: 'deno_server',
    compatibilityDate: '2024-01-01'
  });
} catch (error) {
  console.error('Development server failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
