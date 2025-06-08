// @ts-ignore npm import compatibility with Deno
import { createRsbuild } from 'npm:@rsbuild/core@1.0.1';
// @ts-ignore npm import compatibility with Deno
import { pluginSolid } from 'npm:@rsbuild/plugin-solid@1.0.1';

console.log('Building Marketing micro-frontend...');

try {
  await Deno.mkdir('dist/marketing', { recursive: true });

  const rsbuild = await createRsbuild({
    rsbuildConfig: {
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
    },
  });

  await rsbuild.build();
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
