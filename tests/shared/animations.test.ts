import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { createAnimation } from '../../libs/shared/animations/index.ts';

Deno.test('Animation utilities - createAnimation returns animation functions', () => {
  const { animate } = createAnimation();
  assertEquals(typeof animate, 'function');
});

Deno.test('Animation utilities - animate function handles element animation', () => {
  const { animate } = createAnimation();
  const mockElement = document.createElement('div');

  let didThrow = false;
  try {
    animate(mockElement, {
      opacity: [0, 1],
      duration: 100,
    });
  } catch {
    didThrow = true;
  }
  assertEquals(didThrow, false);
});
