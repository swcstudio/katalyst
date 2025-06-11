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

// Note: This assumes canvas-confetti is available. In a real implementation,
// you would need to install and import it: npm install canvas-confetti
interface ConfettiOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
  zIndex?: number;
}

interface ConfettiFunction {
  (options?: ConfettiOptions): void;
  shapeFromPath?: (options: { path: string }) => string;
  shapeFromText?: (options: { text: string; scalar?: number }) => string;
}

declare const confetti: ConfettiFunction;

export interface ConfettiRef {
  fire: (options?: ConfettiOptions) => void;
}

export interface ConfettiProps {
  class?: string;
  style?: JSX.CSSProperties;
  onMouseEnter?: () => void;
  ref?: (ref: ConfettiRef) => void;
}

export const Confetti: Component<ConfettiProps> = (props) => {
  const merged = mergeProps({}, props);
  let canvasRef: HTMLCanvasElement | undefined;

  const fire = (options: ConfettiOptions = {}) => {
    if (canvasRef && typeof confetti !== 'undefined') {
      const rect = canvasRef.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        origin: { x, y },
        ...options,
      });
    }
  };

  onMount(() => {
    if (merged.ref) {
      merged.ref({ fire });
    }
  });

  return (
    <canvas
      ref={canvasRef}
      class={css(
        {
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        },
        merged.class
      )}
      style={merged.style}
      onMouseEnter={merged.onMouseEnter}
    />
  );
};

export interface ConfettiButtonProps {
  children?: JSX.Element;
  class?: string;
  options?: ConfettiOptions;
  onClick?: () => void;
}

export const ConfettiButton: ParentComponent<ConfettiButtonProps> = (props) => {
  const merged = mergeProps(
    {
      options: {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      },
    },
    props
  );

  const handleClick = () => {
    if (typeof confetti !== 'undefined') {
      confetti(merged.options);
    }
    if (merged.onClick) {
      merged.onClick();
    }
  };

  return (
    <button
      class={css(
        {
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
        },
        merged.class
      )}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
};

export const ConfettiDemo: Component = () => {
  const [confettiRef, setConfettiRef] = createSignal<ConfettiRef>();

  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        height: '500px',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'border',
        backgroundColor: 'background',
      })}
    >
      <span
        class={css({
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
          background: 'linear-gradient(to bottom, black, rgba(128, 128, 128, 0.8))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          textAlign: 'center',
          fontSize: '64px',
          fontWeight: '600',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        })}
      >
        Confetti
      </span>

      <Confetti
        ref={setConfettiRef}
        class={css({
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
        })}
        onMouseEnter={() => {
          confettiRef()?.fire({});
        }}
      />
    </div>
  );
};

export const ConfettiButtonDemo: Component = () => {
  return (
    <div class={css({ position: 'relative' })}>
      <ConfettiButton>Confetti 🎉</ConfettiButton>
    </div>
  );
};

export const ConfettiButtonRandomDemo: Component = () => {
  return (
    <div class={css({ position: 'relative' })}>
      <ConfettiButton
        options={{
          get angle() {
            return Math.random() * 360;
          },
        }}
      >
        Random Confetti 🎉
      </ConfettiButton>
    </div>
  );
};

export const ConfettiFireworks: Component = () => {
  const handleClick = () => {
    if (typeof confetti === 'undefined') return;

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <div class={css({ position: 'relative' })}>
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
        onClick={handleClick}
      >
        Trigger Fireworks
      </button>
    </div>
  );
};

export const ConfettiSideCannons: Component = () => {
  const handleClick = () => {
    if (typeof confetti === 'undefined') return;

    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <div class={css({ position: 'relative' })}>
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
        onClick={handleClick}
      >
        Trigger Side Cannons
      </button>
    </div>
  );
};

export const ConfettiStars: Component = () => {
  const handleClick = () => {
    if (typeof confetti === 'undefined') return;

    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star'],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle'],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <div class={css({ position: 'relative' })}>
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
        onClick={handleClick}
      >
        Trigger Stars
      </button>
    </div>
  );
};

export const ConfettiCustomShapes: Component = () => {
  const handleClick = () => {
    if (typeof confetti === 'undefined') return;

    const scalar = 2;
    const triangle = confetti.shapeFromPath({
      path: 'M0 10 L5 0 L10 10z',
    });
    const square = confetti.shapeFromPath({
      path: 'M0 0 L10 0 L10 10 L0 10 Z',
    });
    const coin = confetti.shapeFromPath({
      path: 'M5 0 A5 5 0 1 0 5 10 A5 5 0 1 0 5 0 Z',
    });
    const tree = confetti.shapeFromPath({
      path: 'M5 0 L10 10 L0 10 Z',
    });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [triangle, square, coin, tree],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ['circle'],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
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
        onClick={handleClick}
      >
        Trigger Shapes
      </button>
    </div>
  );
};

export const ConfettiEmoji: Component = () => {
  const handleClick = () => {
    if (typeof confetti === 'undefined') return;

    const scalar = 2;
    const unicorn = confetti.shapeFromText({ text: '🦄', scalar });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [unicorn],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ['circle'],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <div
      class={css({
        position: 'relative',
        justifyContent: 'center',
      })}
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
        onClick={handleClick}
      >
        Trigger Emoji
      </button>
    </div>
  );
};

export type { ConfettiRef, ConfettiProps, ConfettiButtonProps };
