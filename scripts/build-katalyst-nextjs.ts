console.log('Building Katalyst Next.js application...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:next@15.1.3', 'build'],
    cwd: './katalyst/nextjs',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const { success } = await command.output();

  if (success) {
    console.log('Katalyst Next.js application built successfully!');
  } else {
    throw new Error('Katalyst Next.js build failed');
  }
} catch (error) {
  console.error('Katalyst Next.js build failed:', error);
  Deno.exit(1);
}

export {};
