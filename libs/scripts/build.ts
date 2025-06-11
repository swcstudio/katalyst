export type {};

console.log('Building all SOTA Marketing Stack micro-frontends...');

try {
  const buildPromises = [
    Deno.run({ cmd: ['deno', 'task', 'build:marketing'] }),
    Deno.run({ cmd: ['deno', 'task', 'build:blog'] }),
    Deno.run({ cmd: ['deno', 'task', 'build:storefront'] }),
    Deno.run({ cmd: ['deno', 'task', 'build:docs'] }),
  ];

  await Promise.all(buildPromises.map((p) => p.status()));
  console.log('All micro-frontends built successfully!');
} catch (error) {
  console.error('Build failed:', error);
  Deno.exit(1);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
