import { preview } from 'npm:@rsbuild/core';
import { pluginSolid } from 'npm:@rsbuild/plugin-solid';

console.log('Starting Marketing micro-frontend preview server...');

try {
  const { close } = await preview({
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
    server: {
      port: 4000,
    },
  });

  const handleSignal = async () => {
    console.log('Shutting down Marketing preview server...');
    await close();
    Deno.exit(0);
  };

  Deno.addSignalListener('SIGINT', handleSignal);
  Deno.addSignalListener('SIGTERM', handleSignal);

  console.log('Marketing preview server started on http://localhost:4000');
} catch (error) {
  console.error('Failed to start Marketing preview server:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
