import { createAnimation } from '../../libs/shared/animations';

describe('Animation utilities', () => {
  test('createAnimation returns animation functions', () => {
    const { animate } = createAnimation();
    expect(typeof animate).toBe('function');
  });

  test('animate function handles element animation', () => {
    const { animate } = createAnimation();
    const mockElement = document.createElement('div');

    expect(() => {
      animate(mockElement, {
        opacity: [0, 1],
        duration: 100,
      });
    }).not.toThrow();
  });
});
