import { preview } from 'npm:@rsbuild/core';
import { pluginSolid } from 'npm:@rsbuild/plugin-solid';

console.log('Starting Storefront micro-frontend preview server...');

try {
  const { close } = await preview({
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
    server: {
      port: 4002,
    },
  });
  
  const handleSignal = async () => {
    console.log('Shutting down Storefront preview server...');
    await close();
    Deno.exit(0);
  };
  
  Deno.addSignalListener("SIGINT", handleSignal);
  Deno.addSignalListener("SIGTERM", handleSignal);
  
  console.log('Storefront preview server started on http://localhost:4002');
} catch (error) {
  console.error('Failed to start Storefront preview server:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
