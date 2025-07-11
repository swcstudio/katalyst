import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';
import { Motion, ScrollReveal } from './core/motion';
import { SparklesCore } from './core/SparklesCore';

export const SparklesPreview: Component = () => {
  return (
    <ScrollReveal variant="fadeIn" duration={0.8}>
      <div
        class={css({
          height: '40rem',
          width: 'full',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: 'md',
        })}
      >
        <Motion variant="scaleIn" delay={0.3} duration={0.6}>
          <h1
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              zIndex: '20',
              md: {
                fontSize: '7xl',
              },
              lg: {
                fontSize: '9xl',
              },
            })}
          >
            Aceternity
          </h1>
        </Motion>

        <Motion variant="fadeInUp" delay={0.6} duration={0.8}>
          <div
            class={css({
              width: '40rem',
              height: '40',
              position: 'relative',
            })}
          >
            {/* Gradients */}
            <div
              class={css({
                position: 'absolute',
                insetX: '20',
                top: '0',
                background:
                  'linear-gradient(to right, transparent, rgb(99, 102, 241), transparent)', // indigo-500
                height: '2px',
                width: '3/4',
                filter: 'blur(1px)',
              })}
            />
            <div
              class={css({
                position: 'absolute',
                insetX: '20',
                top: '0',
                background:
                  'linear-gradient(to right, transparent, rgb(99, 102, 241), transparent)', // indigo-500
                height: '1px',
                width: '3/4',
              })}
            />
            <div
              class={css({
                position: 'absolute',
                insetX: '60',
                top: '0',
                background:
                  'linear-gradient(to right, transparent, rgb(14, 165, 233), transparent)', // sky-500
                height: '5px',
                width: '1/4',
                filter: 'blur(1px)',
              })}
            />
            <div
              class={css({
                position: 'absolute',
                insetX: '60',
                top: '0',
                background:
                  'linear-gradient(to right, transparent, rgb(14, 165, 233), transparent)', // sky-500
                height: '1px',
                width: '1/4',
              })}
            />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className={css({
                width: 'full',
                height: 'full',
              })}
              particleColor="#FFFFFF"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div
              class={css({
                position: 'absolute',
                inset: '0',
                width: 'full',
                height: 'full',
                backgroundColor: 'black',
                maskImage: 'radial-gradient(350px 200px at top, transparent 20%, white)',
              })}
            />
          </div>
        </Motion>
      </div>
    </ScrollReveal>
  );
};

export const SparklesFullPagePreview: Component = () => {
  return (
    <ScrollReveal variant="fadeIn" duration={0.8}>
      <div
        class={css({
          height: '40rem',
          position: 'relative',
          width: 'full',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: 'md',
        })}
      >
        <div
          class={css({
            width: 'full',
            position: 'absolute',
            inset: '0',
            height: 'screen',
          })}
        >
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className={css({
              width: 'full',
              height: 'full',
            })}
            particleColor="#FFFFFF"
          />
        </div>

        <Motion variant="scaleIn" delay={0.5} duration={0.8}>
          <h1
            class={css({
              fontSize: '3xl',
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              zIndex: '20',
              md: {
                fontSize: '7xl',
              },
              lg: {
                fontSize: '6xl',
              },
            })}
          >
            Build great products
          </h1>
        </Motion>
      </div>
    </ScrollReveal>
  );
};

export default SparklesPreview;
