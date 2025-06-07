console.log('Building Remix application...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@remix-run/dev', 'build'],
    cwd: './apps/remix-app',
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
