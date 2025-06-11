import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts';
import { render } from 'https://esm.sh/solid-testing-library@0.5.1';
import { createRoot } from 'solid-js';
import { assertEquals, assertExists, assertStringIncludes } from 'std/assert/mod.ts';

// Import second batch MagicUI components to test
import { AppleCardsCarouselDemo } from '../../libs/ui/src/components/solidstack/magicui/AppleCardsCarousel.tsx';
import { AuroraBackgroundDemo } from '../../libs/ui/src/components/solidstack/magicui/AuroraBackground.tsx';
import { BackgroundBeamsDemo } from '../../libs/ui/src/components/solidstack/magicui/BackgroundBeams.tsx';
import { BentoGridDemo } from '../../libs/ui/src/components/solidstack/magicui/BentoGrid.tsx';

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

Deno.test('MagicUI Components Batch 2', async (t) => {
  await t.step('AppleCardsCarouselDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => AppleCardsCarouselDemo({}));
      assertExists(result);
    });

    await t.step('contains expected content', () => {
      const html = renderToString(() => AppleCardsCarouselDemo({}));
      assertStringIncludes(html, 'Get to know your iSad');
      assertStringIncludes(html, 'Artificial Intelligence');
      assertStringIncludes(html, 'Productivity');
    });

    await t.step('includes carousel functionality', () => {
      const html = renderToString(() => AppleCardsCarouselDemo({}));
      assertStringIncludes(html, 'svg') || assertStringIncludes(html, 'button');
    });

    await t.step('contains card images', () => {
      const html = renderToString(() => AppleCardsCarouselDemo({}));
      const imageCount = (html.match(/<img/g) || []).length;
      assertEquals(imageCount >= 6, true, 'Should contain multiple card images');
      assertStringIncludes(html, 'unsplash.com');
    });

    await t.step('has responsive design', () => {
      const html = renderToString(() => AppleCardsCarouselDemo({}));
      assertStringIncludes(html, 'width') && assertStringIncludes(html, 'height');
    });

    await t.step('includes macbook content', () => {
      const html = renderToString(() => AppleCardsCarouselDemo({}));
      assertStringIncludes(html, 'assets.aceternity.com/macbook');
    });
  });

  await t.step('AuroraBackgroundDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => AuroraBackgroundDemo({}));
      assertExists(result);
    });

    await t.step('contains expected text content', () => {
      const html = renderToString(() => AuroraBackgroundDemo({}));
      assertStringIncludes(html, 'Background lights are cool you know');
      assertStringIncludes(html, 'chemical burn');
      assertStringIncludes(html, 'Debug now');
    });

    await t.step('has aurora animation keyframes', () => {
      const html = renderToString(() => AuroraBackgroundDemo({}));
      assertStringIncludes(html, 'aurora') || assertStringIncludes(html, '@keyframes');
    });

    await t.step('includes gradient backgrounds', () => {
      const html = renderToString(() => AuroraBackgroundDemo({}));
      assertStringIncludes(html, 'radial-gradient') || assertStringIncludes(html, 'background');
    });

    await t.step('has proper positioning', () => {
      const html = renderToString(() => AuroraBackgroundDemo({}));
      assertStringIncludes(html, 'absolute') || assertStringIncludes(html, 'position');
    });

    await t.step('includes interactive button', () => {
      const html = renderToString(() => AuroraBackgroundDemo({}));
      assertStringIncludes(html, 'button') || assertStringIncludes(html, '<button');
    });
  });

  await t.step('BackgroundBeamsDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => BackgroundBeamsDemo({}));
      assertExists(result);
    });

    await t.step('contains expected content', () => {
      const html = renderToString(() => BackgroundBeamsDemo({}));
      assertStringIncludes(html, 'Join the waitlist');
      assertStringIncludes(html, 'MailJet');
      assertStringIncludes(html, 'hi@manuarora.in');
    });

    await t.step('includes SVG beam elements', () => {
      const html = renderToString(() => BackgroundBeamsDemo({}));
      assertStringIncludes(html, '<svg') && assertStringIncludes(html, 'viewBox');
    });

    await t.step('has animated beam paths', () => {
      const html = renderToString(() => BackgroundBeamsDemo({}));
      assertStringIncludes(html, 'path') || assertStringIncludes(html, 'animate');
    });

    await t.step('includes input field', () => {
      const html = renderToString(() => BackgroundBeamsDemo({}));
      assertStringIncludes(html, 'input') || assertStringIncludes(html, 'placeholder');
    });

    await t.step('has gradient effects', () => {
      const html = renderToString(() => BackgroundBeamsDemo({}));
      assertStringIncludes(html, 'gradient') || assertStringIncludes(html, 'linear-gradient');
    });
  });

  await t.step('BentoGridDemo', async (t) => {
    await t.step('renders without errors', () => {
      const result = createTestRoot(() => BentoGridDemo({}));
      assertExists(result);
    });

    await t.step('contains grid items', () => {
      const html = renderToString(() => BentoGridDemo({}));
      assertStringIncludes(html, 'Dawn of Innovation');
      assertStringIncludes(html, 'Digital Revolution');
      assertStringIncludes(html, 'Art of Design');
      assertStringIncludes(html, 'Power of Communication');
    });

    await t.step('includes icon elements', () => {
      const html = renderToString(() => BentoGridDemo({}));
      const svgCount = (html.match(/<svg/g) || []).length;
      assertEquals(svgCount >= 7, true, 'Should contain SVG icons for each grid item');
    });

    await t.step('has grid layout styling', () => {
      const html = renderToString(() => BentoGridDemo({}));
      assertStringIncludes(html, 'grid') || assertStringIncludes(html, 'display');
    });

    await t.step('contains skeleton placeholders', () => {
      const html = renderToString(() => BentoGridDemo({}));
      assertStringIncludes(html, 'background') || assertStringIncludes(html, 'gradient');
    });

    await t.step('has proper responsive design', () => {
      const html = renderToString(() => BentoGridDemo({}));
      assertStringIncludes(html, 'max-width') || assertStringIncludes(html, 'maxWidth');
    });
  });

  await t.step('Performance Tests', async (t) => {
    await t.step('all batch 2 components render within performance budget', () => {
      const startTime = performance.now();

      createTestRoot(() => AppleCardsCarouselDemo({}));
      createTestRoot(() => AuroraBackgroundDemo({}));
      createTestRoot(() => BackgroundBeamsDemo({}));
      createTestRoot(() => BentoGridDemo({}));

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      assertEquals(
        renderTime < 250,
        true,
        `Batch 2 render time ${renderTime}ms exceeds 250ms budget`
      );
    });

    await t.step('components handle multiple instances efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 3; i++) {
        createTestRoot(() => BentoGridDemo({}));
        createTestRoot(() => BackgroundBeamsDemo({}));
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      assertEquals(
        renderTime < 400,
        true,
        `Multiple instance render time ${renderTime}ms too high`
      );
    });

    await t.step('carousel component handles large datasets', () => {
      const startTime = performance.now();

      // Test carousel with multiple renders
      for (let i = 0; i < 5; i++) {
        createTestRoot(() => AppleCardsCarouselDemo({}));
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      assertEquals(renderTime < 300, true, `Carousel stress test ${renderTime}ms too high`);
    });
  });

  await t.step('Accessibility Tests', async (t) => {
    await t.step('carousel has proper navigation', () => {
      const html = renderToString(() => AppleCardsCarouselDemo({}));
      // Should have navigation buttons
      assertStringIncludes(html, 'button') || assertStringIncludes(html, 'svg');
    });

    await t.step('input fields have proper attributes', () => {
      const html = renderToString(() => BackgroundBeamsDemo({}));
      assertStringIncludes(html, 'placeholder');
      assertStringIncludes(html, 'type=');
    });

    await t.step('images have alt text', () => {
      const components = [() => AppleCardsCarouselDemo({}), () => BackgroundBeamsDemo({})];

      components.forEach((component, index) => {
        const html = renderToString(component);
        if (html.includes('<img')) {
          assertStringIncludes(html, 'alt=', `Component ${index} should have alt text for images`);
        }
      });
    });

    await t.step('background elements are non-interactive', () => {
      const backgroundComponents = [() => AuroraBackgroundDemo({}), () => BackgroundBeamsDemo({})];

      backgroundComponents.forEach((component) => {
        const html = renderToString(component);
        // Background elements should not interfere with interaction
        assertStringIncludes(html, 'pointer-events') || assertStringIncludes(html, 'pointerEvents');
      });
    });
  });

  await t.step('Animation and Styling Tests', async (t) => {
    await t.step('aurora background has animation keyframes', () => {
      const html = renderToString(() => AuroraBackgroundDemo({}));
      assertStringIncludes(html, '@keyframes') || assertStringIncludes(html, 'animation');
    });

    await t.step('background beams have SVG animations', () => {
      const html = renderToString(() => BackgroundBeamsDemo({}));
      assertStringIncludes(html, 'animate') || assertStringIncludes(html, 'animateTransform');
    });

    await t.step('carousel has smooth transitions', () => {
      const html = renderToString(() => AppleCardsCarouselDemo({}));
      assertStringIncludes(html, 'transition') || assertStringIncludes(html, 'transform');
    });

    await t.step('bento grid has hover effects', () => {
      const html = renderToString(() => BentoGridDemo({}));
      assertStringIncludes(html, 'hover') || assertStringIncludes(html, '_hover');
    });

    await t.step('components use proper gradients', () => {
      const gradientComponents = [
        () => AuroraBackgroundDemo({}),
        () => BackgroundBeamsDemo({}),
        () => BentoGridDemo({}),
      ];

      gradientComponents.forEach((component, index) => {
        const html = renderToString(component);
        const hasGradient =
          html.includes('gradient') ||
          html.includes('linear-gradient') ||
          html.includes('radial-gradient');
        assertEquals(
          hasGradient,
          true,
          `Component ${index} should use gradients for visual effects`
        );
      });
    });
  });

  await t.step('Content and Data Tests', async (t) => {
    await t.step('carousel contains all expected data items', () => {
      const html = renderToString(() => AppleCardsCarouselDemo({}));
      const expectedCategories = [
        'Artificial Intelligence',
        'Productivity',
        'Product',
        'iOS',
        'Hiring',
      ];
      expectedCategories.forEach((category) => {
        assertStringIncludes(html, category, `Should contain ${category} category`);
      });
    });

    await t.step('bento grid contains all items', () => {
      const html = renderToString(() => BentoGridDemo({}));
      const expectedTitles = [
        'Dawn of Innovation',
        'Digital Revolution',
        'Art of Design',
        'Power of Communication',
        'Pursuit of Knowledge',
        'Joy of Creation',
        'Spirit of Adventure',
      ];
      expectedTitles.forEach((title) => {
        assertStringIncludes(html, title, `Should contain ${title} item`);
      });
    });

    await t.step('background beams includes proper messaging', () => {
      const html = renderToString(() => BackgroundBeamsDemo({}));
      assertStringIncludes(html, 'transactional email service');
      assertStringIncludes(html, 'order confirmations');
      assertStringIncludes(html, 'password reset emails');
    });
  });

  await t.step('Error Handling Tests', async (t) => {
    await t.step('components handle missing props gracefully', () => {
      try {
        createTestRoot(() => AppleCardsCarouselDemo({}));
        createTestRoot(() => AuroraBackgroundDemo({}));
        createTestRoot(() => BackgroundBeamsDemo({}));
        createTestRoot(() => BentoGridDemo({}));
      } catch (error) {
        throw new Error(`Batch 2 components should handle missing props: ${error.message}`);
      }
    });

    await t.step('carousel handles empty data gracefully', () => {
      try {
        createTestRoot(() => AppleCardsCarouselDemo({}));
      } catch (error) {
        throw new Error(`Carousel should handle data gracefully: ${error.message}`);
      }
    });

    await t.step('background components handle rendering edge cases', () => {
      try {
        createTestRoot(() => AuroraBackgroundDemo({}));
        createTestRoot(() => BackgroundBeamsDemo({}));
      } catch (error) {
        throw new Error(`Background components should handle edge cases: ${error.message}`);
      }
    });
  });
});

// Integration tests for batch 2 components working together
Deno.test('MagicUI Components Batch 2 Integration', async (t) => {
  await t.step('multiple batch 2 components can coexist', () => {
    const html = renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(AppleCardsCarouselDemo({}) as Node);
      container.appendChild(BentoGridDemo({}) as Node);
      container.appendChild(BackgroundBeamsDemo({}) as Node);
      return container;
    });

    assertExists(html);
    assertStringIncludes(html, 'Get to know your iSad');
    assertStringIncludes(html, 'Dawn of Innovation');
    assertStringIncludes(html, 'Join the waitlist');
  });

  await t.step('batch 2 components maintain performance when combined', () => {
    const startTime = performance.now();

    renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(AppleCardsCarouselDemo({}) as Node);
      container.appendChild(AuroraBackgroundDemo({}) as Node);
      container.appendChild(BentoGridDemo({}) as Node);
      return container;
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    assertEquals(
      renderTime < 500,
      true,
      `Batch 2 combined render time ${renderTime}ms exceeds acceptable limit`
    );
  });

  await t.step('batch 2 components maintain styling isolation', () => {
    const html = renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(AppleCardsCarouselDemo({}) as Node);
      container.appendChild(BentoGridDemo({}) as Node);
      return container;
    });

    // Each component should maintain its own content
    assertStringIncludes(html, 'iSad');
    assertStringIncludes(html, 'Innovation');

    // Should have content from both components
    const imgTags = (html.match(/<img/g) || []).length;
    const svgTags = (html.match(/<svg/g) || []).length;
    assertEquals(imgTags >= 6, true, 'Should have images from carousel');
    assertEquals(svgTags >= 7, true, 'Should have SVG icons from bento grid');
  });

  await t.step("animations don't conflict between components", () => {
    const html = renderToString(() => {
      const container = document.createElement('div');
      container.appendChild(AuroraBackgroundDemo({}) as Node);
      container.appendChild(BackgroundBeamsDemo({}) as Node);
      return container;
    });

    // Both components should have their animations
    assertStringIncludes(html, 'aurora') || assertStringIncludes(html, 'animate');
    assertStringIncludes(html, 'Background lights are cool');
    assertStringIncludes(html, 'Join the waitlist');
  });
});
