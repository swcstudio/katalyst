console.log('Starting Katalyst Core development server...');

try {
  const process = Deno.run({
    cmd: ['deno', 'run', '--allow-all', 'npm:@rsbuild/core', 'dev', '--port', '20007'],
    cwd: './core',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const status = await process.status();
  process.close();
  
  if (!status.success) {
    Deno.exit(1);
  }
} catch (error) {
  console.error('Katalyst Core development server failed:', error);
  Deno.exit(1);
}

export {};
