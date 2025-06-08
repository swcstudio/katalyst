export type {};

console.log('Building Remix application...');

try {
  const process = Deno.run({
    cmd: ['deno', 'run', '--allow-all', 'npm:@remix-run/dev@2.12.1', 'build'],
    cwd: './apps/remix-app',
  });

  const status = await process.status();
  process.close();

  if (status.success) {
    console.log('Remix application built successfully!');
  } else {
    throw new Error('Remix build failed');
  }
} catch (error) {
  console.error('Remix build failed:', error);
  Deno.exit(1);
}
