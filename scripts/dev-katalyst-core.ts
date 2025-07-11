import { PORTS } from './ports.ts';

console.log('Starting Katalyst Core development server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core', 'dev', '--port', PORTS.KATALYST_CORE.toString()],
    cwd: './katalyst/core',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const child = command.spawn();
  const status = await child.status;
  
  if (!status.success) {
    Deno.exit(1);
  }
} catch (error) {
  console.error('Katalyst Core development server failed:', error);
  Deno.exit(1);
}

export {};
