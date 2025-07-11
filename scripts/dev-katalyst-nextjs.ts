console.log('Starting Katalyst Next.js development server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:next@15.1.3', 'dev', '--port', '20009'],
    cwd: './katalyst/nextjs',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('Katalyst Next.js development server failed:', error);
  Deno.exit(1);
}

export {};
