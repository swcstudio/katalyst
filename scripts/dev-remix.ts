
console.log('Starting Remix development server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@remix-run/dev', 'dev', '--port', '20004'],
    cwd: './apps/remix-app'
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('Remix development server failed:', error);
  Deno.exit(1);
}
