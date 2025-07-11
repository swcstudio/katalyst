import { PORTS } from './ports.ts';

console.log('Starting Katalyst Core preview server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core', 'preview', '--port', PORTS.KATALYST_CORE.toString()],
    cwd: './katalyst/core',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('Katalyst Core preview server failed:', error);
  Deno.exit(1);
}

export {};
