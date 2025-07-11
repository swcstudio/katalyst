console.log('Starting Katalyst Remix development server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@remix-run/dev@2.12.1', 'dev', '--port', '20008'],
    cwd: './katalyst/remix',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('Katalyst Remix development server failed:', error);
  Deno.exit(1);
}

export {};
