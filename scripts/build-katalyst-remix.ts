import { PORTS } from './ports.ts';

console.log('Building Katalyst Remix application...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@remix-run/dev@2.12.1', 'build'],
    cwd: './katalyst/remix',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const { success } = await command.output();

  if (success) {
    console.log('Katalyst Remix application built successfully!');
  } else {
    throw new Error('Katalyst Remix build failed');
  }
} catch (error) {
  console.error('Katalyst Remix build failed:', error);
  Deno.exit(1);
}

export {};
