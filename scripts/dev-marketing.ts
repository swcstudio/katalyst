import { dev } from 'npm:@rsbuild/core';
import { pluginSolid } from 'npm:@rsbuild/plugin-solid';

console.log('Starting Marketing micro-frontend development server...');

try {
  const { close } = await dev({
    plugins: [pluginSolid()],
    source: {
      entry: {
        index: './apps/marketing/src/index.tsx',
      },
    },
    server: {
      port: 3000,
    },
  });
  
  const handleSignal = () => {
    console.log('Shutting down Marketing development server...');
    close().then(() => process.exit(0));
  };
  
  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);
  
  console.log('Marketing development server started on http://localhost:3000');
} catch (error) {
  console.error('Failed to start Marketing development server:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
