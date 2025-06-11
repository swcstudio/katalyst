import { css } from '@sse/ui/styled-system/css';
import { type Component, For, JSX, createSignal, mergeProps, onCleanup, onMount } from 'solid-js';

export interface ThreeDMarqueeProps {
  images: string[];
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
}

export const ThreeDMarquee: Component<ThreeDMarqueeProps> = (props) => {
  const merged = mergeProps(
    {
      speed: 50,
      pauseOnHover: false,
      direction: 'left' as const,
    },
    props
  );

  const [isPaused, setIsPaused] = createSignal(false);

  return (
    <div
      class={css(
        {
          width: 'full',
          height: '400px',
          overflow: 'hidden',
          position: 'relative',
          perspective: '1000px',
          display: 'flex',
          alignItems: 'center',
        },
        merged.className
      )}
      onMouseEnter={() => merged.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => merged.pauseOnHover && setIsPaused(false)}
    >
      <div
        class={css({
          display: 'flex',
          width: 'max-content',
          animation: `marquee3d ${merged.speed}s linear infinite`,
          animationDirection: merged.direction === 'right' ? 'reverse' : 'normal',
          animationPlayState: isPaused() ? 'paused' : 'running',
          transform: 'rotateX(10deg) rotateY(-10deg)',
          transformStyle: 'preserve-3d',
        })}
      >
        <For each={[...merged.images, ...merged.images]}>
          {(image, index) => (
            <div
              class={css({
                marginX: '4',
                flexShrink: 0,
                width: '200px',
                height: '120px',
                borderRadius: 'lg',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                transform: `translateZ(${(index() % 5) * 20}px)`,
                transition: 'transform 0.3s ease',
                _hover: {
                  transform: `translateZ(${(index() % 5) * 20 + 50}px) scale(1.05)`,
                },
              })}
            >
              <img
                src={image}
                alt={`Marquee item ${index()}`}
                class={css({
                  width: 'full',
                  height: 'full',
                  objectFit: 'cover',
                })}
              />
            </div>
          )}
        </For>
      </div>

      <style>{`
        @keyframes marquee3d {
          from {
            transform: rotateX(10deg) rotateY(-10deg) translateX(0);
          }
          to {
            transform: rotateX(10deg) rotateY(-10deg) translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export interface ThreeDMarqueeDemoProps {
  className?: string;
}

export const ThreeDMarqueeDemo: Component<ThreeDMarqueeDemoProps> = (props) => {
  const images = [
    'https://assets.aceternity.com/cloudinary_bkp/3d-card.png',
    'https://assets.aceternity.com/animated-modal.png',
    'https://assets.aceternity.com/animated-testimonials.webp',
    'https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png',
    'https://assets.aceternity.com/github-globe.png',
    'https://assets.aceternity.com/glare-card.png',
    'https://assets.aceternity.com/layout-grid.png',
    'https://assets.aceternity.com/flip-text.png',
    'https://assets.aceternity.com/hero-highlight.png',
    'https://assets.aceternity.com/carousel.webp',
    'https://assets.aceternity.com/placeholders-and-vanish-input.png',
    'https://assets.aceternity.com/shooting-stars-and-stars-background.png',
    'https://assets.aceternity.com/signup-form.png',
    'https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png',
    'https://assets.aceternity.com/spotlight-new.webp',
    'https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png',
    'https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png',
    'https://assets.aceternity.com/tabs.png',
    'https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png',
    'https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png',
    'https://assets.aceternity.com/glowing-effect.webp',
    'https://assets.aceternity.com/hover-border-gradient.png',
    'https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png',
    'https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png',
    'https://assets.aceternity.com/macbook-scroll.png',
    'https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png',
    'https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png',
    'https://assets.aceternity.com/multi-step-loader.png',
    'https://assets.aceternity.com/vortex.png',
    'https://assets.aceternity.com/wobble-card.png',
    'https://assets.aceternity.com/world-map.webp',
  ];

  return (
    <div
      class={css(
        {
          marginX: 'auto',
          marginY: '10',
          maxWidth: '7xl',
          borderRadius: '3xl',
          backgroundColor: 'rgba(23, 23, 23, 0.05)',
          padding: '2',
          border: '1px solid',
          borderColor: 'rgba(64, 64, 64, 0.1)',
          _dark: {
            backgroundColor: 'neutral.800',
          },
        },
        props.className
      )}
    >
      <ThreeDMarquee images={images} pauseOnHover />
    </div>
  );
};

export default ThreeDMarqueeDemo;
