import { PORTS } from './ports.ts';

console.log('Building Katalyst Core application...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core', 'build'],
    cwd: './katalyst/core',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const { success } = await command.output();

  if (success) {
    console.log('Katalyst Core application built successfully!');
  } else {
    throw new Error('Katalyst Core build failed');
  }
} catch (error) {
  console.error('Katalyst Core build failed:', error);
  Deno.exit(1);
}

export {};
