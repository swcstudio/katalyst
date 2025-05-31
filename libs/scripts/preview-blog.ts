import { preview } from 'npm:astro';

console.log('Starting Blog micro-frontend preview server...');

try {
  await preview({
    root: './apps/blog',
    port: 4001,
    config: {
      integrations: ['@astrojs/solid-js', '@astrojs/mdx'],
    }
  });
  
  console.log('Blog preview server started on http://localhost:4001');
} catch (error) {
  console.error('Failed to start Blog preview server:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
