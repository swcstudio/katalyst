import { Component, JSX, createSignal, onMount, onCleanup, For } from 'solid-js';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { animate } from 'motion';

export interface GlowingStarsBackgroundCardProps {
  children: JSX.Element;
  className?: string;
}

export interface GlowingStarsTitleProps {
  children: JSX.Element;
  className?: string;
}

export interface GlowingStarsDescriptionProps {
  children: JSX.Element;
  className?: string;
}

export const GlowingStarsBackgroundCardPreview: Component = () => {
  return (
    <div class={css({
      display: 'flex',
      paddingY: '80px',
      alignItems: 'center',
      justifyContent: 'center'
    })}>
      <GlowingStarsBackgroundCard>
        <GlowingStarsTitle>Next.js 14</GlowingStarsTitle>
        <div class={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end'
        })}>
          <GlowingStarsDescription>
            The power of full-stack to the frontend. Read the release notes.
          </GlowingStarsDescription>
          <div class={css({
            height: '32px',
            width: '32px',
            borderRadius: 'full',
            backgroundColor: 'hsla(0,0%,100%,.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}>
            <ArrowIcon />
          </div>
        </div>
      </GlowingStarsBackgroundCard>
    </div>
  );
};

export const GlowingStarsBackgroundCard: Component<GlowingStarsBackgroundCardProps> = (props) => {
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [stars] = createSignal(Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.8 + 0.2,
  })));

  let cardRef: HTMLDivElement;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = cardRef.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  onMount(() => {
    // Animate stars
    stars().forEach((star, index) => {
      const element = document.querySelector(`.star-${index}`);
      if (element) {
        animate(
          element,
          {
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 1.2, 1],
          },
          {
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            easing: 'ease-in-out',
          }
        );
      }
    });
  });

  return (
    <div
      ref={cardRef!}
      class={cx(
        css({
          position: 'relative',
          height: '200px',
          width: '400px',
          borderRadius: '12px',
          padding: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(15, 15, 23, 0.8), rgba(30, 30, 40, 0.9))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          }
        }),
        props.className
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Stars Background */}
      <div class={css({
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      })}>
        <For each={stars()}>
          {(star, index) => (
            <div
              class={`star-${index()}`}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                'background-color': 'white',
                'border-radius': '50%',
                opacity: star.opacity,
              }}
            />
          )}
        </For>
      </div>

      {/* Glow Effect */}
      <div
        class={css({
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(20px)',
          transition: 'all 0.3s ease',
        })}
        style={{
          left: `${mousePosition().x - 50}px`,
          top: `${mousePosition().y - 50}px`,
        }}
      />

      {/* Content */}
      <div class={css({
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      })}>
        {props.children}
      </div>

      {/* Noise Texture */}
      <div class={css({
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)
        `,
        backgroundSize: '20px 20px',
        opacity: 0.5,
        pointerEvents: 'none'
      })} />
    </div>
  );
};

export const GlowingStarsTitle: Component<GlowingStarsTitleProps> = (props) => {
  return (
    <h3
      class={cx(
        css({
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }),
        props.className
      )}
    >
      {props.children}
    </h3>
  );
};

export const GlowingStarsDescription: Component<GlowingStarsDescriptionProps> = (props) => {
  return (
    <p
      class={cx(
        css({
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.5',
          maxWidth: '280px',
        }),
        props.className
      )}
    >
      {props.children}
    </p>
  );
};

const ArrowIcon: Component = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class={css({
        height: '16px',
        width: '16px',
        color: 'white',
        strokeWidth: 2
      })}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
};

export default GlowingStarsBackgroundCardPreview;