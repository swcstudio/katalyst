// @ts-ignore npm import compatibility with Deno
import { build } from 'npm:astro@4.16.18';

console.log('Building Docs micro-frontend...');

try {
  await Deno.mkdir('dist/docs', { recursive: true });

  await build({
    root: './apps/docs',
    outDir: '../../dist/docs',
    config: {
      integrations: ['@astrojs/solid-js', '@astrojs/mdx'],
    },
  });

  console.log('Docs build completed successfully!');
} catch (error) {
  console.error('Docs build failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
