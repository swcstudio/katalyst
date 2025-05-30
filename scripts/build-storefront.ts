import { build } from 'npm:@rsbuild/core@1.0.1';
import { pluginSolid } from 'npm:@rsbuild/plugin-solid@1.0.1';

console.log('Building Storefront micro-frontend...');

try {
  await Deno.mkdir('dist/storefront', { recursive: true });
  
  const { close } = await build({
    plugins: [pluginSolid()],
    source: {
      entry: {
        index: './apps/storefront/src/index.tsx',
      },
    },
    output: {
      distPath: {
        root: './dist/storefront',
      },
    },
  });
  
  await close();
  console.log('Storefront build completed successfully!');
} catch (error) {
  console.error('Storefront build failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
