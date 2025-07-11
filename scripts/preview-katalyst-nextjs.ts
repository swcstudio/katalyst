import { PORTS } from './ports.ts';

console.log('Starting Katalyst Next.js preview server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:next@15.1.3', 'start', '--port', PORTS.KATALYST_NEXTJS.toString()],
    cwd: './katalyst/nextjs',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const child = command.spawn();
  await child.status;
} catch (error) {
  console.error('Katalyst Next.js preview server failed:', error);
  Deno.exit(1);
}

export {};
