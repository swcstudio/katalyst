import { PORTS } from './ports.ts';

console.log('Starting Katalyst Next.js development server...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core@1.0.17', 'dev', '--config', 'rsbuild.config.ts', '--port', PORTS.KATALYST_NEXTJS.toString()],
    cwd: './katalyst/nextjs',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const child = command.spawn();
  const status = await child.status;
  
  if (!status.success) {
    Deno.exit(status.code);
  }
} catch (error) {
  console.error('Katalyst Next.js development server failed:', error);
  Deno.exit(1);
}

export {};
