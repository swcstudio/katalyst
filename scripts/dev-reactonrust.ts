export type {};

console.log('Starting React on Rust development server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core', 'dev', '--port', '20007'],
    cwd: './apps/reactonrust',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('React on Rust development server failed:', error);
  Deno.exit(1);
}
