
console.log('Starting Remix preview server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@remix-run/serve', 'build', '--port', '20004'],
    cwd: './apps/remix-app'
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('Remix preview server failed:', error);
  Deno.exit(1);
}
