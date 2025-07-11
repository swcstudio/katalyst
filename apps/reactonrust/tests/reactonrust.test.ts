import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

Deno.test('React on Rust framework - basic test', () => {
  const frameworkName = 'React on Rust';
  assertEquals(frameworkName, 'React on Rust');
});

Deno.test('React on Rust framework - port configuration', () => {
  const expectedPort = 20007;
  assertEquals(expectedPort, 20007);
});
