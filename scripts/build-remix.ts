console.log('Building Remix application...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@remix-run/dev@2.12.1', 'build'],
    cwd: './apps/remix-app',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const { success } = await command.output();

  if (success) {
    console.log('Remix application built successfully!');
  } else {
    throw new Error('Remix build failed');
  }
} catch (error) {
  console.error('Remix build failed:', error);
  Deno.exit(1);
}
