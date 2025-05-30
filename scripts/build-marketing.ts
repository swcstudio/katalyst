// @ts-ignore npm import compatibility with Deno
import { build } from 'npm:@rsbuild/core@0.2.0';
// @ts-ignore npm import compatibility with Deno
import { pluginSolid } from 'npm:@rsbuild/plugin-solid@0.2.0';

console.log('Building Marketing micro-frontend...');

try {
  await Deno.mkdir('dist/marketing', { recursive: true });
  
  const { close } = await build({
    plugins: [pluginSolid()],
    source: {
      entry: {
        index: './apps/marketing/src/index.tsx',
      },
    },
    output: {
      distPath: {
        root: './dist/marketing',
      },
    },
  });
  
  await close();
  console.log('Marketing build completed successfully!');
} catch (error) {
  console.error('Marketing build failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
