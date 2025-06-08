import { dev } from 'npm:astro';

console.log('Starting Docs micro-frontend development server...');

try {
  await dev({
    root: './apps/docs',
    port: 3003,
    config: {
      integrations: ['@astrojs/solid-js', '@astrojs/mdx'],
    },
  });

  console.log('Docs development server started on http://localhost:3003');
} catch (error) {
  console.error('Failed to start Docs development server:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
