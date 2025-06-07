console.log('Building SvelteKit application...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core', 'build'],
    cwd: './apps/sveltekit-spa',
  });

  const { success } = await command.output();

  if (success) {
    console.log('SvelteKit application built successfully!');
  } else {
    throw new Error('SvelteKit build failed');
  }
} catch (error) {
  console.error('SvelteKit build failed:', error);
  Deno.exit(1);
}
