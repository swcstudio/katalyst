import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  type JSX,
  type ParentComponent,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

export interface CoolModeOptions {
  particle?: string;
  particleCount?: number;
  speedHorz?: number;
  speedUp?: number;
  gravity?: number;
  particleSize?: number;
  colors?: string[];
}

export interface CoolModeProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  options?: CoolModeOptions;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  image?: string;
  life: number;
}

export const CoolMode: ParentComponent<CoolModeProps> = (props) => {
  const merged = mergeProps(
    {
      options: {
        particleCount: 30,
        speedHorz: 1,
        speedUp: 1,
        gravity: 0.1,
        particleSize: 8,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      },
    },
    props
  );

  const [particles, setParticles] = createSignal<Particle[]>([]);
  let containerRef: HTMLDivElement | undefined;
  let animationId: number;
  let particleId = 0;

  const createParticle = (x: number, y: number): Particle => {
    const options = merged.options;
    return {
      id: particleId++,
      x,
      y,
      vx: (Math.random() - 0.5) * options.speedHorz! * 10,
      vy: -Math.random() * options.speedUp! * 10 - 5,
      size: Math.random() * options.particleSize! + 2,
      color: options.colors![Math.floor(Math.random() * options.colors!.length)],
      image: options.particle,
      life: 1,
    };
  };

  const updateParticles = () => {
    setParticles((prevParticles) => {
      return prevParticles
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + merged.options.gravity!,
          life: particle.life - 0.02,
        }))
        .filter((particle) => particle.life > 0);
    });

    if (particles().length > 0) {
      animationId = requestAnimationFrame(updateParticles);
    }
  };

  const handleClick = (event: MouseEvent) => {
    if (!containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newParticles: Particle[] = [];
    for (let i = 0; i < merged.options.particleCount!; i++) {
      newParticles.push(createParticle(x, y));
    }

    setParticles((prev) => [...prev, ...newParticles]);

    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    updateParticles();
  };

  onMount(() => {
    if (containerRef) {
      containerRef.addEventListener('click', handleClick);
    }
  });

  onCleanup(() => {
    if (containerRef) {
      containerRef.removeEventListener('click', handleClick);
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });

  return (
    <div
      ref={containerRef}
      class={css(
        {
          position: 'relative',
          display: 'inline-block',
          cursor: 'pointer',
        },
        merged.class
      )}
      style={merged.style}
    >
      {props.children}

      {/* Particle Container */}
      <div
        class={css({
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        })}
      >
        {particles().map((particle) => (
          <div
            key={particle.id}
            class={css({
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              pointerEvents: 'none',
              transform: `translate(${particle.x - particle.size / 2}px, ${particle.y - particle.size / 2}px)`,
              opacity: particle.life,
              transition: 'none',
            })}
            style={{
              backgroundColor: particle.image ? 'transparent' : particle.color,
              backgroundImage: particle.image ? `url(${particle.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export interface CoolModeDemoProps {
  class?: string;
}

export const CoolModeDemo: Component<CoolModeDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        },
        props.class
      )}
    >
      <CoolMode>
        <button
          class={css({
            padding: '8px 16px',
            backgroundColor: 'primary',
            color: 'primary.foreground',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'medium',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'primary/90',
            },
          })}
        >
          Click Me!
        </button>
      </CoolMode>
    </div>
  );
};

export const CoolModeCustomDemo: Component<CoolModeDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        },
        props.class
      )}
    >
      <CoolMode
        options={{
          particle: 'https://pbs.twimg.com/profile_images/1782811051504885763/YR5-kWOI_400x400.jpg',
          particleCount: 20,
          particleSize: 12,
        }}
      >
        <button
          class={css({
            padding: '8px 16px',
            backgroundColor: 'primary',
            color: 'primary.foreground',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'medium',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'primary/90',
            },
          })}
        >
          Click Me!
        </button>
      </CoolMode>
    </div>
  );
};

export type { CoolModeOptions, CoolModeProps, CoolModeDemoProps };
