console.log('Starting Katalyst Remix preview server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@remix-run/serve@2.12.1', 'build', '--port', '20008'],
    cwd: './katalyst/remix',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('Katalyst Remix preview server failed:', error);
  Deno.exit(1);
}

export {};
