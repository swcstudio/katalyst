export type {};

console.log('Building React on Rust framework...');

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@rsbuild/core', 'build'],
    cwd: './apps/reactonrust',
  });

  const child = command.spawn();
  const result = await child.status;
  
  if (result.success) {
    console.log('✅ React on Rust build completed successfully!');
  } else {
    console.error('❌ React on Rust build failed');
    Deno.exit(1);
  }
} catch (error) {
  console.error('React on Rust build failed:', error);
  Deno.exit(1);
}
