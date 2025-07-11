console.log('Starting Katalyst Core development server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core', 'dev', '--port', '20007'],
    cwd: './katalyst/core',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('Katalyst Core development server failed:', error);
  Deno.exit(1);
}

export {};
