console.log('Starting SvelteKit development server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core', 'dev', '--port', '20005'],
    cwd: './apps/sveltekit-spa',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('SvelteKit development server failed:', error);
  Deno.exit(1);
}
