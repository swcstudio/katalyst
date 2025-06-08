console.log('Building all SOTA Marketing Stack micro-frontends...');

try {
  const buildCommands = [
    ['deno', 'task', 'build:marketing'],
    ['deno', 'task', 'build:blog'],
    ['deno', 'task', 'build:storefront'],
    ['deno', 'task', 'build:docs'],
    ['deno', 'task', 'build:remix'],
    ['deno', 'task', 'build:sveltekit'],
  ];

  const buildPromises = buildCommands.map((cmd) =>
    new Deno.Command(cmd[0], { args: cmd.slice(1) }).output()
  );

  await Promise.all(buildPromises);
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
