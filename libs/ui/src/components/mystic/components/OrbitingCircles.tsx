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

export interface OrbitingCirclesProps {
  className?: string;
  style?: JSX.CSSProperties;
  radius?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  path?: boolean;
  pauseOnHover?: boolean;
  children?: JSX.Element;
  circleCount?: number;
  circleSize?: number;
  circleColor?: string;
  pathColor?: string;
  pathOpacity?: number;
}

const OrbitingCircles: Component<OrbitingCirclesProps> = (props) => {
  const merged = mergeProps(
    {
      radius: 50,
      duration: 20,
      delay: 10,
      reverse: false,
      path: false,
      pauseOnHover: false,
      circleCount: 6,
      circleSize: 8,
      circleColor: '#ffffff',
      pathColor: '#ffffff',
      pathOpacity: 0.2,
    },
    props
  );

  const [isPaused, setIsPaused] = createSignal(false);

  const circles = Array.from({ length: merged.circleCount }, (_, i) => ({
    id: i,
    delay: (i * merged.delay) / merged.circleCount,
    angle: (i * 360) / merged.circleCount,
  }));

  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'fit-content',
          height: 'fit-content',
        },
        merged.className
      )}
      style={merged.style}
      onMouseEnter={() => merged.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => merged.pauseOnHover && setIsPaused(false)}
    >
      {/* Orbital path */}
      {merged.path && (
        <svg
          class={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 0,
          })}
          width={(merged.radius + merged.circleSize) * 2}
          height={(merged.radius + merged.circleSize) * 2}
        >
          <circle
            cx={merged.radius + merged.circleSize}
            cy={merged.radius + merged.circleSize}
            r={merged.radius}
            fill="none"
            stroke={merged.pathColor}
            stroke-width="1"
            opacity={merged.pathOpacity}
            stroke-dasharray="2 4"
          />
        </svg>
      )}

      {/* Center content */}
      <div
        class={css({
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        {props.children}
      </div>

      {/* Orbiting circles */}
      <For each={circles}>
        {(circle) => (
          <div
            class={css({
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${merged.circleSize * 2}px`,
              height: `${merged.circleSize * 2}px`,
              marginTop: `-${merged.circleSize}px`,
              marginLeft: `-${merged.circleSize}px`,
              pointerEvents: 'none',
              zIndex: 5,
            })}
            style={{
              transform: `rotate(${circle.angle}deg) translateX(${merged.radius}px) rotate(-${circle.angle}deg)`,
              animation: `orbit-${merged.reverse ? 'reverse' : 'normal'} ${merged.duration}s linear infinite`,
              'animation-delay': `${circle.delay}s`,
              'animation-play-state': isPaused() ? 'paused' : 'running',
            }}
          >
            <div
              class={css({
                width: 'full',
                height: 'full',
                borderRadius: '50%',
                backgroundColor: merged.circleColor,
                boxShadow: `0 0 ${merged.circleSize}px ${merged.circleColor}40`,
              })}
            />
          </div>
        )}
      </For>

      <style>{`
        @keyframes orbit-normal {
          from {
            transform: rotate(0deg) translateX(${merged.radius}px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(${merged.radius}px) rotate(-360deg);
          }
        }
        
        @keyframes orbit-reverse {
          from {
            transform: rotate(0deg) translateX(${merged.radius}px) rotate(0deg);
          }
          to {
            transform: rotate(-360deg) translateX(${merged.radius}px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default OrbitingCircles;
