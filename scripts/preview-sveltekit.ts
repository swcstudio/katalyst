console.log('Starting SvelteKit preview server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@sveltejs/kit', 'preview', '--port', '20005'],
    cwd: './apps/sveltekit-spa',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('SvelteKit preview server failed:', error);
  Deno.exit(1);
}
