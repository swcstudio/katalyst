import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { animate } from 'motion';
import { type Component, For, JSX, createSignal, onCleanup, onMount } from 'solid-js';

export interface ColourfulTextProps {
  text: string;
  className?: string;
  colors?: string[];
  animationDuration?: number;
}

export const ColourfulTextDemo: Component = () => {
  const [backgroundOpacity, setBackgroundOpacity] = createSignal(0);

  onMount(() => {
    const controls = animate((progress) => setBackgroundOpacity(progress * 0.5), { duration: 1 });

    onCleanup(() => {
      controls.stop();
    });
  });

  return (
    <div
      class={css({
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'black',
      })}
    >
      <img
        src="https://assets.aceternity.com/linear-demo.webp"
        class={css({
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          position: 'absolute',
          inset: 0,
          maskImage: 'radial-gradient(circle, transparent, black 80%)',
          pointerEvents: 'none',
        })}
        style={{ opacity: backgroundOpacity() }}
      />
      <h1
        class={css({
          fontSize: '2xl',
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          zIndex: 2,
          fontFamily: 'sans',
          md: { fontSize: '5xl' },
          lg: { fontSize: '7xl' },
        })}
      >
        The best <ColourfulText text="components" /> <br /> you will ever find
      </h1>
    </div>
  );
};

export const ColourfulText: Component<ColourfulTextProps> = (props) => {
  const defaultColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FECA57',
    '#FF9FF3',
    '#54A0FF',
    '#5F27CD',
    '#00D2D3',
    '#FF9F43',
  ];

  const colors = () => props.colors || defaultColors;
  const animationDuration = () => props.animationDuration || 3;
  const letters = () => props.text.split('');

  const [currentColorIndex, setCurrentColorIndex] = createSignal(0);

  onMount(() => {
    // Animate color transitions using Motion
    const animateColors = () => {
      animate(
        (progress) => {
          const colorIndex = Math.floor(progress * colors().length);
          setCurrentColorIndex(colorIndex);
        },
        {
          duration: animationDuration(),
          repeat: Number.POSITIVE_INFINITY,
          easing: 'ease-in-out',
        }
      );
    };

    animateColors();

    // Also animate individual letters
    letters().forEach((_, index) => {
      const element = document.querySelector(`.letter-${index}`);
      if (element) {
        animate(
          element,
          {
            y: [0, -3, 0],
            scale: [1, 1.05, 1],
          },
          {
            duration: animationDuration() * 0.8,
            delay: index * 0.1,
            repeat: Number.POSITIVE_INFINITY,
            easing: 'ease-in-out',
          }
        );
      }
    });
  });

  return (
    <span
      class={cx(
        css({
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FECA57)',
          backgroundSize: '400% 400%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          animation: 'gradient-shift 3s ease-in-out infinite',
          fontWeight: 'bold',
          position: 'relative',
        }),
        props.className
      )}
    >
      <For each={letters()}>
        {(letter, index) => (
          <span
            class={cx(
              `letter-${index()}`,
              css({
                display: 'inline-block',
                transition: 'all 0.3s ease',
                _hover: {
                  transform: 'translateY(-2px) scale(1.1)',
                  textShadow: '0 0 20px currentColor',
                },
              })
            )}
            style={{
              color: colors()[currentColorIndex()],
            }}
          >
            {letter}
          </span>
        )}
      </For>

      {/* Add some sparkle effects */}
      <div
        class={css({
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        })}
      >
        <For each={Array.from({ length: 3 }, (_, i) => i)}>
          {(i) => {
            onMount(() => {
              const element = document.querySelector(`.sparkle-${i}`);
              if (element) {
                animate(
                  element,
                  {
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  },
                  {
                    duration: animationDuration() + i,
                    delay: i * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    easing: 'ease-in-out',
                  }
                );
              }
            });

            return (
              <div
                class={cx(
                  `sparkle-${i}`,
                  css({
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    backgroundColor: colors()[i % colors().length],
                    borderRadius: '50%',
                    opacity: 0.7,
                  })
                )}
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                }}
              />
            );
          }}
        </For>
      </div>

      <style>
        {`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}
      </style>
    </span>
  );
};
