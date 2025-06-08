export type {};

console.log('Building Blog micro-frontend...');

try {
  console.log('Using Astro version: astro@4.16.18');
  const buildCommand = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:astro@4.16.18', 'build'],
    cwd: './apps/astro-blog',
    stdout: 'piped',
    stderr: 'piped',
  });

  const buildResult = await buildCommand.output();
  if (buildResult.success) {
    console.log('Blog build completed successfully!');
    console.log(new TextDecoder().decode(buildResult.stdout));
  } else {
    console.error('Blog build failed:');
    console.error(new TextDecoder().decode(buildResult.stderr));
    throw new Error('Blog build failed');
  }
} catch (error) {
  console.error('Blog build failed:', error);
  Deno.exit(1);
}
