export type {};

console.log('Building SvelteKit application...');

try {
  console.log('Running SvelteKit sync...');
  const syncCommand = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'npm:@sveltejs/kit', 'sync'],
    cwd: './apps/sveltekit-spa',
    stdout: 'piped',
    stderr: 'piped',
  });

  const syncResult = await syncCommand.output();
  if (!syncResult.success) {
    console.error('SvelteKit sync failed:');
    console.error(new TextDecoder().decode(syncResult.stderr));
    throw new Error('SvelteKit sync failed');
  }

  console.log('Running SvelteKit build...');
  const buildCommand = new Deno.Command('deno', {
    args: ['task', 'build'],
    cwd: './apps/sveltekit-spa',
    stdout: 'piped',
    stderr: 'piped',
  });

  const buildResult = await buildCommand.output();
  if (buildResult.success) {
    console.log('SvelteKit application built successfully!');
    console.log(new TextDecoder().decode(buildResult.stdout));
  } else {
    console.error('SvelteKit build failed:');
    console.error(new TextDecoder().decode(buildResult.stderr));
    throw new Error('SvelteKit build failed');
  }
} catch (error) {
  console.error('SvelteKit build failed:', error);
  Deno.exit(1);
}
