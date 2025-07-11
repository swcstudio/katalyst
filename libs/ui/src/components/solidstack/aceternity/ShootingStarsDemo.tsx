import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';
import { ShootingStars } from './core/ShootingStars';
import { StarsBackground } from './core/StarsBackground';
import { Motion, ScrollReveal } from './core/motion';

export const ShootingStarsAndStarsBackgroundDemo: Component = () => {
  return (
    <ScrollReveal variant="fadeIn" duration={0.8}>
      <div
        class={css({
          height: '40rem',
          borderRadius: 'md',
          backgroundColor: 'rgb(23, 23, 23)', // neutral-900
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: 'full',
        })}
      >
        <Motion variant="scaleIn" delay={0.3} duration={0.8}>
          <h2
            class={css({
              position: 'relative',
              flexDirection: 'column',
              zIndex: '10',
              fontSize: '3xl',
              maxWidth: '5xl',
              marginX: 'auto',
              textAlign: 'center',
              letterSpacing: 'tight',
              fontWeight: 'medium',
              backgroundClip: 'text',
              color: 'transparent',
              background: 'linear-gradient(to bottom, rgb(38, 38, 38), white, white)', // from-neutral-800 via-white to-white
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              md: {
                flexDirection: 'row',
                fontSize: '5xl',
                lineHeight: 'tight',
                gap: '8',
              },
            })}
          >
            <span>Shooting Star</span>
            <span
              class={css({
                color: 'white',
                fontSize: 'lg',
                fontWeight: 'thin',
              })}
            >
              x
            </span>
            <span>Star Background</span>
          </h2>
        </Motion>

        <ShootingStars
          starCount={8}
          starColor="#FFFFFF"
          trailLength={150}
          minSpeed={3}
          maxSpeed={10}
        />

        <StarsBackground
          starCount={300}
          starColor="#FFFFFF"
          minStarSize={0.5}
          maxStarSize={2.5}
          twinkleSpeed={0.03}
        />
      </div>
    </ScrollReveal>
  );
};

export default ShootingStarsAndStarsBackgroundDemo;
