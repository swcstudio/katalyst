import { onMount } from 'solid-js';
import { createAnimation } from '../../../../libs/shared/animations/index.ts';
import { css } from '../styled-system/css';

export const AnimatedHero = () => {
  const { animate } = createAnimation();

  onMount(() => {
    const heroElement = document.getElementById('hero-section');
    if (heroElement) {
      animate(heroElement, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuart',
      });
    }
  });

  return (
    <section
      id="hero-section"
      class={css({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'gradient-to-br',
        gradientFrom: 'emerald.50',
        gradientTo: 'blue.50',
        px: '6',
        py: '20',
      })}
    >
      <div
        class={css({
          maxWidth: '4xl',
          textAlign: 'center',
        })}
      >
        <h1
          class={css({
            fontSize: { base: '4xl', md: '6xl' },
            fontWeight: 'bold',
            color: 'gray.900',
            mb: '6',
            lineHeight: 'tight',
          })}
        >
          SolidStack Enterprise
        </h1>
        <p
          class={css({
            fontSize: { base: 'lg', md: 'xl' },
            color: 'gray.600',
            mb: '8',
            maxWidth: '2xl',
            mx: 'auto',
          })}
        >
          State-of-the-art micro-frameworks ecosystem for building high-performance marketing
          websites with comprehensive TypeScript integration.
        </p>
      </div>
    </section>
  );
};
