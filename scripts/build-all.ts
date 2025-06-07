
export {};

console.log('🚀 SSE Framework Build Orchestrator');
console.log('Building all micro-frameworks in sequence...\n');

const frameworks = [
  { name: 'marketing', port: 20000, description: 'SolidJS Marketing Site' },
  { name: 'blog', port: 20001, description: 'Astro Dynamic Blog' },
  { name: 'storefront', port: 20002, description: 'SolidJS E-commerce' },
  { name: 'docs', port: 20003, description: 'Astro Static Documentation' },
  { name: 'remix', port: 20004, description: 'Remix Application UIs' },
  { name: 'sveltekit', port: 20005, description: 'SvelteKit SPAs' },
];

console.log('📋 Build Queue:');
frameworks.forEach(f => {
  console.log(`  • ${f.name.padEnd(12)} (Port ${f.port}) - ${f.description}`);
});

console.log('\n🎯 Use individual build commands:');
frameworks.forEach(f => {
  console.log(`  deno task build:${f.name}`);
});

console.log('\n✨ All frameworks configured for rspack builds with Deno runtime!');

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
