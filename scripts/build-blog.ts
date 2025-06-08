// @ts-ignore npm import compatibility with Deno
import { build } from 'npm:astro@5.0.0';

console.log('Building Blog micro-frontend...');

try {
  await Deno.mkdir('dist/blog', { recursive: true });

  await build({
    root: './apps/blog',
    outDir: '../../dist/blog',
    config: {
      integrations: ['@astrojs/solid-js', '@astrojs/mdx'],
    },
  });

  console.log('Blog build completed successfully!');
} catch (error) {
  console.error('Blog build failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
