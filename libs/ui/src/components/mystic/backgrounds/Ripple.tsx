import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  createSignal,
  For,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

export interface RippleProps {
  className?: string;
  style?: JSX.CSSProperties;
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  duration?: number;
  color?: string;
}

interface Circle {
  id: number;
  size: number;
  opacity: number;
  x: number;
  y: number;
  delay: number;
}

const Ripple: Component<RippleProps> = (props) => {
  const merged = mergeProps(
    {
      mainCircleSize: 210,
      mainCircleOpacity: 0.24,
      numCircles: 8,
      duration: 3000,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    props
  );

  const [circles, setCircles] = createSignal<Circle[]>([]);

  const generateCircles = () => {
    const newCircles: Circle[] = [];

    for (let i = 0; i < merged.numCircles; i++) {
      newCircles.push({
        id: i,
        size: Math.random() * 300 + 50,
        opacity: Math.random() * 0.5 + 0.1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * merged.duration,
      });
    }

    setCircles(newCircles);
  };

  onMount(() => {
    generateCircles();
  });

  return (
    <div
      class={css(
        {
          position: 'absolute',
          inset: 0,
          width: 'full',
          height: 'full',
          overflow: 'hidden',
          pointerEvents: 'none',
        },
        merged.className
      )}
      style={merged.style}
    >
      {/* Main circle */}
      <div
        class={css({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          opacity: merged.mainCircleOpacity,
          background: `radial-gradient(circle, ${merged.color} 0%, transparent 70%)`,
          animation: 'pulse 4s ease-in-out infinite',
        })}
        style={{
          width: `${merged.mainCircleSize}px`,
          height: `${merged.mainCircleSize}px`,
        }}
      />

      {/* Ripple circles */}
      <For each={circles()}>
        {(circle) => (
          <div
            class={css({
              position: 'absolute',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${merged.color} 0%, transparent 70%)`,
              animation: `ripple ${merged.duration}ms ease-out infinite`,
              animationDelay: `${circle.delay}ms`,
            })}
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.x}%`,
              top: `${circle.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: circle.opacity,
            }}
          />
        )}
      </For>

      <style>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: ${merged.mainCircleOpacity};
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: ${merged.mainCircleOpacity * 0.8};
          }
        }
      `}</style>
    </div>
  );
};

export default Ripple;
