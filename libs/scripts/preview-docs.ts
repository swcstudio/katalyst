import { preview } from 'npm:astro';

console.log('Starting Docs micro-frontend preview server...');

try {
  await preview({
    root: './apps/docs',
    port: 4003,
    config: {
      integrations: ['@astrojs/solid-js', '@astrojs/mdx'],
    },
  });

  console.log('Docs preview server started on http://localhost:4003');
} catch (error) {
  console.error('Failed to start Docs preview server:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
