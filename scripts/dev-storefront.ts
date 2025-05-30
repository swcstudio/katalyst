import { dev } from 'npm:@rsbuild/core';
import { pluginSolid } from 'npm:@rsbuild/plugin-solid';

console.log('Starting Storefront micro-frontend development server...');

try {
  const { close } = await dev({
    plugins: [pluginSolid()],
    source: {
      entry: {
        index: './apps/storefront/src/index.tsx',
      },
    },
    server: {
      port: 3002,
    },
  });
  
  const handleSignal = async () => {
    console.log('Shutting down Storefront development server...');
    await close();
    Deno.exit(0);
  };
  
  Deno.addSignalListener("SIGINT", handleSignal);
  Deno.addSignalListener("SIGTERM", handleSignal);
  
  console.log('Storefront development server started on http://localhost:3002');
} catch (error) {
  console.error('Failed to start Storefront development server:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
