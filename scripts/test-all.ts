
console.log('Running comprehensive test suite across all frameworks...');

try {
  const testCommands = [
    ['deno', 'test', '--allow-all', 'tests/'],
    ['deno', 'run', '--allow-all', 'npm:rstest', 'apps/marketing/'],
    ['deno', 'run', '--allow-all', 'npm:rstest', 'apps/blog/'],
    ['deno', 'run', '--allow-all', 'npm:rstest', 'apps/storefront/'],
    ['deno', 'run', '--allow-all', 'npm:rstest', 'apps/astro-docs/'],
    ['deno', 'run', '--allow-all', 'npm:rstest', 'apps/remix-app/'],
    ['deno', 'run', '--allow-all', 'npm:rstest', 'apps/sveltekit-spa/'],
    ['deno', 'run', '--allow-all', 'npm:rstest', 'libs/shared/']
  ];

  for (const cmd of testCommands) {
    console.log(`Running: ${cmd.join(' ')}`);
    const command = new Deno.Command(cmd[0], { args: cmd.slice(1) });
    const { success } = await command.output();
    
    if (!success) {
      throw new Error(`Test failed for: ${cmd.join(' ')}`);
    }
  }

  console.log('All tests passed successfully!');
} catch (error) {
  console.error('Test suite failed:', error);
  Deno.exit(1);
}
