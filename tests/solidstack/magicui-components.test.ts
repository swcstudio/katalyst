import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts';
import { render } from 'https://esm.sh/solid-testing-library@0.5.1';
import { createRoot } from 'solid-js';
import { assertEquals, assertExists, assertStringIncludes } from 'std/assert/mod.ts';

// Import MagicUI components to test
import { ThreeDCardDemo } from '../../libs/ui/src/components/solidstack/magicui/3DCard.tsx';
import { AnimatedModalDemo } from '../../libs/ui/src/components/solidstack/magicui/AnimatedModal.tsx';
import { AnimatedPinDemo } from '../../libs/ui/src/components/solidstack/magicui/AnimatedPin.tsx';
import { AnimatedTestimonialsDemo } from '../../libs/ui/src/components/solidstack/magicui/AnimatedTestimonials.tsx';
import { AnimatedTooltipPreview } from '../../libs/ui/src/components/solidstack/magicui/AnimatedTooltip.tsx';
import { ThreeDMarqueeDemo } from '../../libs/ui/src/components/solidstack/magicui/ThreeDMarquee.tsx';

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

Deno.test('MagicUI Components', async (t) => {
  await t.step('ThreeDCardDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => ThreeDCardDemo({}));
      assertExists(result);
    });

    await t.step('contains expected content', () => {
      const html = renderToString(() => ThreeDCardDemo({}));
      assertStringIncludes(html, 'Make things float in air');
      assertStringIncludes(html, 'Aceternity UI');
      assertStringIncludes(html, 'Sign up');
      assertStringIncludes(html, 'Try now');
    });

    await t.step('applies 3D transforms', () => {
      const html = renderToString(() => ThreeDCardDemo({}));
      assertStringIncludes(html, 'perspective');
      assertStringIncludes(html, 'transform');
    });

    await t.step('includes image element', () => {
      const html = renderToString(() => ThreeDCardDemo({}));
      assertStringIncludes(html, '<img');
      assertStringIncludes(html, 'unsplash.com');
    });

    await t.step('has proper styling classes', () => {
      const html = renderToString(() => ThreeDCardDemo({}));
      assertStringIncludes(html, 'border-radius') || assertStringIncludes(html, 'borderRadius');
      assertStringIncludes(html, 'background') || assertStringIncludes(html, 'backgroundColor');
    });
  });

  await t.step('ThreeDMarqueeDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => ThreeDMarqueeDemo({}));
      assertExists(result);
    });

    await t.step('contains image elements', () => {
      const html = renderToString(() => ThreeDMarqueeDemo({}));
      const imageCount = (html.match(/<img/g) || []).length;
      assertEquals(imageCount > 5, true, 'Should contain multiple images');
    });

    await t.step('has 3D perspective styling', () => {
      const html = renderToString(() => ThreeDMarqueeDemo({}));
      assertStringIncludes(html, 'perspective') || assertStringIncludes(html, 'transform');
    });

    await t.step('includes aceternity assets', () => {
      const html = renderToString(() => ThreeDMarqueeDemo({}));
      assertStringIncludes(html, 'assets.aceternity.com');
    });

    await t.step('has animation keyframes', () => {
      const html = renderToString(() => ThreeDMarqueeDemo({}));
      assertStringIncludes(html, 'marquee3d') || assertStringIncludes(html, 'animation');
    });
  });

  await t.step('AnimatedPinDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => AnimatedPinDemo({}));
      assertExists(result);
    });

    await t.step('contains expected content', () => {
      const html = renderToString(() => AnimatedPinDemo({}));
      assertStringIncludes(html, 'Aceternity UI');
      assertStringIncludes(html, 'Customizable Tailwind CSS');
    });

    await t.step('has pin styling', () => {
      const html = renderToString(() => AnimatedPinDemo({}));
      assertStringIncludes(html, 'height') && assertStringIncludes(html, 'width');
    });

    await t.step('includes gradient background', () => {
      const html = renderToString(() => AnimatedPinDemo({}));
      assertStringIncludes(html, 'gradient') || assertStringIncludes(html, 'linear-gradient');
    });

    await t.step('has proper dimensions', () => {
      const html = renderToString(() => AnimatedPinDemo({}));
      assertStringIncludes(html, '40rem') || assertStringIncludes(html, '20rem');
    });
  });

  await t.step('AnimatedModalDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => AnimatedModalDemo({}));
      assertExists(result);
    });

    await t.step('contains trigger button', () => {
      const html = renderToString(() => AnimatedModalDemo({}));
      assertStringIncludes(html, 'Book your flight');
      assertStringIncludes(html, '✈️');
    });

    await t.step('has modal context', () => {
      const html = renderToString(() => AnimatedModalDemo({}));
      assertStringIncludes(html, 'button') || assertStringIncludes(html, '<button');
    });

    await t.step('includes travel icons', () => {
      const html = renderToString(() => AnimatedModalDemo({}));
      assertStringIncludes(html, 'svg') || assertStringIncludes(html, '<svg');
    });

    await t.step('has proper styling', () => {
      const html = renderToString(() => AnimatedModalDemo({}));
      assertStringIncludes(html, 'background') || assertStringIncludes(html, 'backgroundColor');
    });
  });

  await t.step('AnimatedTestimonialsDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => AnimatedTestimonialsDemo({}));
      assertExists(result);
    });

    await t.step('contains testimonial content', () => {
      const html = renderToString(() => AnimatedTestimonialsDemo({}));
      assertStringIncludes(html, 'attention to detail') ||
        assertStringIncludes(html, 'Sarah Chen') ||
        assertStringIncludes(html, 'Product Manager');
    });

    await t.step('includes avatar images', () => {
      const html = renderToString(() => AnimatedTestimonialsDemo({}));
      assertStringIncludes(html, '<img') && assertStringIncludes(html, 'unsplash.com');
    });

    await t.step('has navigation elements', () => {
      const html = renderToString(() => AnimatedTestimonialsDemo({}));
      assertStringIncludes(html, 'svg') || assertStringIncludes(html, 'button');
    });

    await t.step('contains quote styling', () => {
      const html = renderToString(() => AnimatedTestimonialsDemo({}));
      assertStringIncludes(html, 'font') || assertStringIncludes(html, 'text');
    });
  });

  await t.step('AnimatedTooltipPreview', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => AnimatedTooltipPreview({}));
      assertExists(result);
    });

    await t.step('contains avatar images', () => {
      const html = renderToString(() => AnimatedTooltipPreview({}));
      const imageCount = (html.match(/<img/g) || []).length;
      assertEquals(imageCount >= 6, true, 'Should contain 6 avatar images');
    });

    await t.step('includes people data', () => {
      const html = renderToString(() => AnimatedTooltipPreview({}));
      assertStringIncludes(html, 'unsplash.com');
    });

    await t.step('has flex layout', () => {
      const html = renderToString(() => AnimatedTooltipPreview({}));
      assertStringIncludes(html, 'flex') || assertStringIncludes(html, 'display');
    });

    await t.step('contains rounded images', () => {
      const html = renderToString(() => AnimatedTooltipPreview({}));
      assertStringIncludes(html, 'border-radius') || assertStringIncludes(html, 'borderRadius');
    });
  });

  await t.step('Performance Tests', async (t) => {
    await t.step('all components render within performance budget', () => {
      const startTime = performance.now();

      createTestRoot(() => ThreeDCardDemo({}));
      createTestRoot(() => ThreeDMarqueeDemo({}));
      createTestRoot(() => AnimatedPinDemo({}));
      createTestRoot(() => AnimatedModalDemo({}));
      createTestRoot(() => AnimatedTestimonialsDemo({}));
      createTestRoot(() => AnimatedTooltipPreview({}));

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      assertEquals(renderTime < 200, true, `Render time ${renderTime}ms exceeds 200ms budget`);
    });

    await t.step('components handle multiple instances', () => {
      const startTime = performance.now();

      for (let i = 0; i < 5; i++) {
        createTestRoot(() => ThreeDCardDemo({}));
        createTestRoot(() => AnimatedTooltipPreview({}));
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      assertEquals(
        renderTime < 500,
        true,
        `Multiple instance render time ${renderTime}ms too high`
      );
    });
  });

  await t.step('Accessibility Tests', async (t) => {
    await t.step('components have proper image alt text', () => {
      const components = [
        () => ThreeDCardDemo({}),
        () => ThreeDMarqueeDemo({}),
        () => AnimatedTestimonialsDemo({}),
        () => AnimatedTooltipPreview({}),
      ];

      components.forEach((component, index) => {
        const html = renderToString(component);
        if (html.includes('<img')) {
          assertStringIncludes(html, 'alt=', `Component ${index} should have alt text for images`);
        }
      });
    });

    await t.step('interactive elements are keyboard accessible', () => {
      const interactiveComponents = [
        () => AnimatedModalDemo({}),
        () => AnimatedTestimonialsDemo({}),
      ];

      interactiveComponents.forEach((component) => {
        const html = renderToString(component);
        if (html.includes('<button')) {
          // Buttons should not have tabindex="-1" unless properly hidden
          const hasInaccessibleButtons =
            html.includes('tabindex="-1"') && !html.includes('aria-hidden="true"');
          assertEquals(
            hasInaccessibleButtons,
            false,
            'Interactive buttons should be keyboard accessible'
          );
        }
      });
    });

    await t.step('components support screen readers', () => {
      const html = renderToString(() => AnimatedModalDemo({}));
      // Should have semantic button elements
      assertStringIncludes(html, '<button') || assertStringIncludes(html, 'role="button"');
    });
  });

  await t.step('Error Handling Tests', async (t) => {
    await t.step('components handle missing props gracefully', () => {
      try {
        createTestRoot(() => ThreeDCardDemo({}));
        createTestRoot(() => AnimatedPinDemo({}));
        createTestRoot(() => AnimatedModalDemo({}));
        createTestRoot(() => AnimatedTestimonialsDemo({}));
        createTestRoot(() => AnimatedTooltipPreview({}));
      } catch (error) {
        throw new Error(`Components should handle missing props: ${error.message}`);
      }
    });

    await t.step('components handle empty data gracefully', () => {
      try {
        // Test with empty or minimal data
        createTestRoot(() => ThreeDMarqueeDemo({}));
        createTestRoot(() => AnimatedTestimonialsDemo({}));
        createTestRoot(() => AnimatedTooltipPreview({}));
      } catch (error) {
        throw new Error(`Components should handle empty data: ${error.message}`);
      }
    });
  });

  await t.step('Styling and Animation Tests', async (t) => {
    await t.step('3D components have perspective styling', () => {
      const threeDComponents = [
        () => ThreeDCardDemo({}),
        () => ThreeDMarqueeDemo({}),
        () => AnimatedPinDemo({}),
      ];

      threeDComponents.forEach((component, index) => {
        const html = renderToString(component);
        const hasPerspective =
          html.includes('perspective') || html.includes('transform') || html.includes('translateZ');
        assertEquals(hasPerspective, true, `3D component ${index} should have 3D styling`);
      });
    });

    await t.step('components have proper transition animations', () => {
      const animatedComponents = [
        () => AnimatedModalDemo({}),
        () => AnimatedTestimonialsDemo({}),
        () => AnimatedTooltipPreview({}),
      ];

      animatedComponents.forEach((component, index) => {
        const html = renderToString(component);
        const hasAnimation =
          html.includes('transition') || html.includes('animation') || html.includes('@keyframes');
        assertEquals(
          hasAnimation,
          true,
          `Animated component ${index} should have animation styling`
        );
      });
    });

    await t.step('components maintain responsive design', () => {
      const components = [
        () => ThreeDCardDemo({}),
        () => AnimatedTestimonialsDemo({}),
        () => AnimatedTooltipPreview({}),
      ];

      components.forEach((component, index) => {
        const html = renderToString(component);
        const isResponsive =
          html.includes('width') || html.includes('max-width') || html.includes('flex');
        assertEquals(isResponsive, true, `Component ${index} should have responsive styling`);
      });
    });
  });
});

// Integration tests for MagicUI components working together
Deno.test('MagicUI Components Integration', async (t) => {
  await t.step('multiple components can coexist', () => {
    const html = renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(ThreeDCardDemo({}) as Node);
      container.appendChild(AnimatedTooltipPreview({}) as Node);
      container.appendChild(AnimatedModalDemo({}) as Node);
      return container;
    });

    assertExists(html);
    assertStringIncludes(html, 'Aceternity UI');
    assertStringIncludes(html, 'Book your flight');
  });

  await t.step('components maintain performance when combined', () => {
    const startTime = performance.now();

    renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(ThreeDCardDemo({}) as Node);
      container.appendChild(ThreeDMarqueeDemo({}) as Node);
      container.appendChild(AnimatedPinDemo({}) as Node);
      container.appendChild(AnimatedTestimonialsDemo({}) as Node);
      return container;
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    assertEquals(
      renderTime < 400,
      true,
      `Combined render time ${renderTime}ms exceeds acceptable limit`
    );
  });

  await t.step('components maintain styling isolation', () => {
    const html = renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(ThreeDCardDemo({}) as Node);
      container.appendChild(AnimatedTooltipPreview({}) as Node);
      return container;
    });

    // Each component should maintain its own styling
    assertStringIncludes(html, 'Make things float in air');
    const imgTags = (html.match(/<img/g) || []).length;
    assertEquals(imgTags >= 7, true, 'Should have images from both components');
  });
});
