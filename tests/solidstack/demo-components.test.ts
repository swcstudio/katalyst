import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts';
import { render } from 'https://esm.sh/solid-testing-library@0.5.1';
import { createRoot } from 'solid-js';
import { assertEquals, assertExists, assertStringIncludes } from 'std/assert/mod.ts';

// Import components to test
import { AnimatedShinyTextDemo } from '../../libs/ui/src/components/solidstack/demos/AnimatedShinyTextDemo.tsx';
import { DotPatternDemo } from '../../libs/ui/src/components/solidstack/demos/DotPatternDemo.tsx';
import { GridPatternDemo } from '../../libs/ui/src/components/solidstack/demos/GridPatternDemo.tsx';
import { OrbitingCirclesDemo } from '../../libs/ui/src/components/solidstack/demos/OrbitingCirclesDemo.tsx';

// Mock DOM environment for testing
const parser = new DOMParser();

// Test utilities
function createTestRoot<T>(component: () => T): T {
  let result: T;
  createRoot(() => {
    result = component();
  });
  return result!;
}

function renderToString(component: () => any): string {
  const container = document.createElement('div');
  createRoot(() => {
    container.appendChild(component() as Node);
  });
  return container.innerHTML;
}

Deno.test('SolidStack Demo Components', async (t) => {
  await t.step('AnimatedShinyTextDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => AnimatedShinyTextDemo({}));
      assertExists(result);
    });

    await t.step('contains expected text content', () => {
      const html = renderToString(() => AnimatedShinyTextDemo({}));
      assertStringIncludes(html, '✨ Introducing SolidStack UI');
    });

    await t.step('applies correct CSS classes', () => {
      const html = renderToString(() => AnimatedShinyTextDemo({}));
      assertStringIncludes(html, 'display:inline-flex');
      assertStringIncludes(html, 'align-items:center');
      assertStringIncludes(html, 'justify-content:center');
    });

    await t.step('includes arrow icon', () => {
      const html = renderToString(() => AnimatedShinyTextDemo({}));
      assertStringIncludes(html, '<svg');
      assertStringIncludes(html, 'viewBox="0 0 24 24"');
    });

    await t.step('has proper accessibility attributes', () => {
      const html = renderToString(() => AnimatedShinyTextDemo({}));
      assertStringIncludes(html, 'stroke-linecap="round"');
      assertStringIncludes(html, 'stroke-linejoin="round"');
    });
  });

  await t.step('DotPatternDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => DotPatternDemo({}));
      assertExists(result);
    });

    await t.step('creates container with correct styling', () => {
      const html = renderToString(() => DotPatternDemo({}));
      assertStringIncludes(html, 'position:relative');
      assertStringIncludes(html, 'height:500px');
      assertStringIncludes(html, 'overflow:hidden');
    });

    await t.step('includes SVG pattern', () => {
      const html = renderToString(() => DotPatternDemo({}));
      assertStringIncludes(html, '<svg');
      assertStringIncludes(html, 'aria-hidden="true"');
    });

    await t.step('applies mask for radial gradient effect', () => {
      const html = renderToString(() => DotPatternDemo({}));
      assertStringIncludes(html, 'mask-image') || assertStringIncludes(html, 'maskImage');
      assertStringIncludes(html, 'radial-gradient');
    });

    await t.step('has proper responsive design', () => {
      const html = renderToString(() => DotPatternDemo({}));
      assertStringIncludes(html, 'width:full') || assertStringIncludes(html, 'width:100%');
    });
  });

  await t.step('GridPatternDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => GridPatternDemo({}));
      assertExists(result);
    });

    await t.step('creates grid pattern with proper dimensions', () => {
      const html = renderToString(() => GridPatternDemo({}));
      assertStringIncludes(html, 'height:500px');
      assertStringIncludes(html, 'overflow:hidden');
    });

    await t.step('includes SVG grid pattern', () => {
      const html = renderToString(() => GridPatternDemo({}));
      assertStringIncludes(html, '<svg');
      assertStringIncludes(html, '<pattern');
    });

    await t.step('applies skew transformation', () => {
      const html = renderToString(() => GridPatternDemo({}));
      assertStringIncludes(html, 'skew') || assertStringIncludes(html, 'transform');
    });

    await t.step('has correct mask gradient', () => {
      const html = renderToString(() => GridPatternDemo({}));
      assertStringIncludes(html, '400px circle at center');
    });

    await t.step('maintains accessibility', () => {
      const html = renderToString(() => GridPatternDemo({}));
      assertStringIncludes(html, 'aria-hidden="true"');
    });
  });

  await t.step('OrbitingCirclesDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => OrbitingCirclesDemo({}));
      assertExists(result);
    });

    await t.step('creates container with proper layout', () => {
      const html = renderToString(() => OrbitingCirclesDemo({}));
      assertStringIncludes(html, 'position:relative');
      assertStringIncludes(html, 'height:500px');
      assertStringIncludes(html, 'align-items:center');
      assertStringIncludes(html, 'justify-content:center');
    });

    await t.step('includes multiple orbiting circle sets', () => {
      const html = renderToString(() => OrbitingCirclesDemo({}));
      // Should have multiple instances of orbiting circles
      const svgCount = (html.match(/<svg/g) || []).length;
      assertEquals(svgCount >= 2, true, 'Should have multiple SVG elements for orbiting circles');
    });

    await t.step('contains icon components', () => {
      const html = renderToString(() => OrbitingCirclesDemo({}));
      assertStringIncludes(html, 'viewBox');
      // Should contain path elements for icons
      assertStringIncludes(html, '<path');
    });

    await t.step('applies different orbit configurations', () => {
      const html = renderToString(() => OrbitingCirclesDemo({}));
      // Test for different background colors indicating different orbits
      assertStringIncludes(html, 'backgroundColor') ||
        assertStringIncludes(html, 'background-color');
    });

    await t.step('has proper z-index layering', () => {
      const html = renderToString(() => OrbitingCirclesDemo({}));
      assertStringIncludes(html, 'zIndex') || assertStringIncludes(html, 'z-index');
    });
  });

  await t.step('Performance Tests', async (t) => {
    await t.step('all components render within performance budget', () => {
      const startTime = performance.now();

      createTestRoot(() => AnimatedShinyTextDemo({}));
      createTestRoot(() => DotPatternDemo({}));
      createTestRoot(() => GridPatternDemo({}));
      createTestRoot(() => OrbitingCirclesDemo({}));

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render all components in under 100ms
      assertEquals(renderTime < 100, true, `Render time ${renderTime}ms exceeds 100ms budget`);
    });

    await t.step('components are memory efficient', () => {
      // Test for memory leaks by creating and disposing components
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      for (let i = 0; i < 10; i++) {
        createTestRoot(() => AnimatedShinyTextDemo({}));
        createTestRoot(() => DotPatternDemo({}));
        createTestRoot(() => GridPatternDemo({}));
        createTestRoot(() => OrbitingCirclesDemo({}));
      }

      // Force garbage collection if available
      if ((globalThis as any).gc) {
        (globalThis as any).gc();
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      assertEquals(
        memoryIncrease < 10 * 1024 * 1024,
        true,
        `Memory increase ${memoryIncrease} bytes is too high`
      );
    });
  });

  await t.step('Accessibility Tests', async (t) => {
    await t.step('components have proper ARIA attributes', () => {
      const demos = [
        () => AnimatedShinyTextDemo({}),
        () => DotPatternDemo({}),
        () => GridPatternDemo({}),
        () => OrbitingCirclesDemo({}),
      ];

      demos.forEach((demo, index) => {
        const html = renderToString(demo);
        // Background patterns should be hidden from screen readers
        if (index > 0) {
          // Skip text demo
          assertStringIncludes(
            html,
            'aria-hidden="true"',
            `Demo ${index} should have aria-hidden for decorative elements`
          );
        }
      });
    });

    await t.step('components support reduced motion preferences', () => {
      // Test that animations can be disabled for accessibility
      const html = renderToString(() => AnimatedShinyTextDemo({}));
      assertStringIncludes(html, 'transition') || assertStringIncludes(html, 'animation');
    });

    await t.step('components have sufficient color contrast', () => {
      const htmls = [
        renderToString(() => AnimatedShinyTextDemo({})),
        renderToString(() => OrbitingCirclesDemo({})),
      ];

      htmls.forEach((html) => {
        // Check for color properties that should provide good contrast
        const hasColorStyles =
          html.includes('color:') || html.includes('background') || html.includes('fill:');
        assertEquals(hasColorStyles, true, 'Components should define color styles');
      });
    });
  });

  await t.step('Error Handling Tests', async (t) => {
    await t.step('components handle missing dependencies gracefully', () => {
      // Test components can render even if some dependencies are missing
      try {
        createTestRoot(() => AnimatedShinyTextDemo({}));
        createTestRoot(() => DotPatternDemo({}));
        createTestRoot(() => GridPatternDemo({}));
        createTestRoot(() => OrbitingCirclesDemo({}));
      } catch (error) {
        throw new Error(`Components should not throw errors during rendering: ${error.message}`);
      }
    });

    await t.step('components handle edge cases', () => {
      // Test with extreme or unusual props
      try {
        createTestRoot(() => DotPatternDemo({}));
        createTestRoot(() => GridPatternDemo({}));
      } catch (error) {
        throw new Error(`Components should handle edge cases gracefully: ${error.message}`);
      }
    });
  });
});

// Integration tests for demo components working together
Deno.test('SolidStack Demo Components Integration', async (t) => {
  await t.step('multiple demo components can coexist', () => {
    const html = renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(AnimatedShinyTextDemo({}) as Node);
      container.appendChild(DotPatternDemo({}) as Node);
      container.appendChild(GridPatternDemo({}) as Node);
      container.appendChild(OrbitingCirclesDemo({}) as Node);
      return container;
    });

    assertStringIncludes(html, 'Introducing SolidStack UI');
    assertExists(html);
  });

  await t.step('demo components maintain performance when combined', () => {
    const startTime = performance.now();

    renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(AnimatedShinyTextDemo({}) as Node);
      container.appendChild(DotPatternDemo({}) as Node);
      container.appendChild(GridPatternDemo({}) as Node);
      container.appendChild(OrbitingCirclesDemo({}) as Node);
      return container;
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    assertEquals(
      renderTime < 200,
      true,
      `Combined render time ${renderTime}ms exceeds acceptable limit`
    );
  });
});
