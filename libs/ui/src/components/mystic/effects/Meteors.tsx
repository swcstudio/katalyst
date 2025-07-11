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

export interface MeteorsProps {
  className?: string;
  style?: JSX.CSSProperties;
  number?: number;
  speed?: number;
  color?: string;
  size?: number;
  direction?: 'left' | 'right';
  tail?: boolean;
  tailLength?: number;
  opacity?: number;
  glow?: boolean;
  glowColor?: string;
}

interface Meteor {
  id: number;
  delay: number;
  duration: number;
  left: number;
  size: number;
  opacity: number;
}

const Meteors: Component<MeteorsProps> = (props) => {
  const merged = mergeProps(
    {
      number: 20,
      speed: 2,
      color: '#ffffff',
      size: 2,
      direction: 'left' as const,
      tail: true,
      tailLength: 100,
      opacity: 0.8,
      glow: true,
      glowColor: '#ffffff',
    },
    props
  );

  const [meteors, setMeteors] = createSignal<Meteor[]>([]);

  const generateMeteors = () => {
    const newMeteors: Meteor[] = [];

    for (let i = 0; i < merged.number; i++) {
      newMeteors.push({
        id: i,
        delay: Math.random() * 10,
        duration: Math.random() * merged.speed + merged.speed,
        left: Math.random() * 100,
        size: Math.random() * merged.size + merged.size,
        opacity: Math.random() * merged.opacity + 0.2,
      });
    }

    setMeteors(newMeteors);
  };

  onMount(() => {
    generateMeteors();
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
      <For each={meteors()}>
        {(meteor) => (
          <div
            class={css({
              position: 'absolute',
              top: 0,
              height: '2px',
              background: merged.tail
                ? `linear-gradient(${merged.direction === 'left' ? '90deg' : '-90deg'}, transparent, ${merged.color})`
                : merged.color,
              borderRadius: '50%',
              boxShadow: merged.glow ? `0 0 ${meteor.size * 2}px ${merged.glowColor}` : 'none',
              animation: `meteor-${merged.direction} ${meteor.duration}s linear infinite`,
              animationDelay: `${meteor.delay}s`,
            })}
            style={{
              left: `${meteor.left}%`,
              width: merged.tail ? `${merged.tailLength}px` : `${meteor.size}px`,
              height: `${meteor.size}px`,
              opacity: meteor.opacity,
              transform: `rotate(${merged.direction === 'left' ? '-45deg' : '45deg'})`,
            }}
          />
        )}
      </For>

      <style>{`
        @keyframes meteor-left {
          0% {
            transform: translateX(300px) translateY(-300px) rotate(-45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(-300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }
        
        @keyframes meteor-right {
          0% {
            transform: translateX(-300px) translateY(-300px) rotate(45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Meteors;
