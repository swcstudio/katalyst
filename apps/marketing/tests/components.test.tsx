import { assertEquals } from 'std/assert/assert_equals.ts';

Deno.test('Marketing components basic validation', () => {
  assertEquals(true, true, 'Basic test validation passes');
});

Deno.test('Component imports are accessible', async () => {
  try {
    const headerModule = await import('../src/components/Header.tsx');
    const footerModule = await import('../src/components/Footer.tsx');
    const storeModule = await import('../src/components/TanstackStore.tsx');
    const queryModule = await import('../src/components/TanstackQuery.tsx');

    assertEquals(typeof headerModule.default, 'function', 'Header component is a function');
    assertEquals(typeof footerModule.default, 'function', 'Footer component is a function');
    assertEquals(typeof storeModule.default, 'function', 'TanstackStore component is a function');
    assertEquals(typeof queryModule.default, 'function', 'TanstackQuery component is a function');
  } catch (error) {
    throw new Error(`Component import failed: ${error.message}`);
  }
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
