import { type Component, For, createSignal, onCleanup, onMount } from 'solid-js';
import { css } from '../../styled-system/css';

interface RippleProps {
  className?: string;
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  speed?: number;
  color?: string;
}

interface Circle {
  id: number;
  size: number;
  opacity: number;
  x: number;
  y: number;
  scale: number;
}

export const Ripple: Component<RippleProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [circles, setCircles] = createSignal<Circle[]>([]);

  const mainCircleSize = () => props.mainCircleSize ?? 210;
  const mainCircleOpacity = () => props.mainCircleOpacity ?? 0.24;
  const numCircles = () => props.numCircles ?? 8;
  const speed = () => props.speed ?? 2;
  const color = () => props.color ?? '#3b82f6';

  let animationId: number;

  const generateCircle = (index: number): Circle => {
    return {
      id: Date.now() + index,
      size: Math.random() * 200 + 50,
      opacity: Math.random() * 0.5 + 0.1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0,
    };
  };

  const initializeCircles = () => {
    const initialCircles = Array.from({ length: numCircles() }, (_, i) => generateCircle(i));
    setCircles(initialCircles);
  };

  const animateCircles = () => {
    setCircles((prev) =>
      prev.map((circle, index) => {
        const progress = (Date.now() / 1000 / speed() + index * 0.5) % 2;
        const scale = progress <= 1 ? progress : 2 - progress;
        const opacity = circle.opacity * (1 - Math.abs(progress - 1));

        return {
          ...circle,
          scale,
          opacity: Math.max(0, opacity),
        };
      })
    );

    animationId = requestAnimationFrame(animateCircles);
  };

  onMount(() => {
    setMounted(true);
    initializeCircles();
    animateCircles();
  });

  onCleanup(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });

  const rippleContainerStyles = css({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
  });

  const mainCircleStyles = css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    border: `1px solid ${color()}`,
    opacity: mainCircleOpacity(),
    animation: 'ripplePulse 4s ease-in-out infinite',
  });

  const circleStyles = css({
    position: 'absolute',
    borderRadius: '50%',
    border: `1px solid ${color()}`,
    pointerEvents: 'none',
  });

  return (
    <div class={`${rippleContainerStyles} ${props.className || ''}`}>
      <style>{`
        @keyframes ripplePulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: ${mainCircleOpacity()};
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: ${mainCircleOpacity() * 0.8};
          }
        }

        @keyframes rippleExpand {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>

      {/* Main central circle */}
      <div
        class={mainCircleStyles}
        style={{
          width: `${mainCircleSize()}px`,
          height: `${mainCircleSize()}px`,
        }}
      />

      {/* Animated ripple circles */}
      {mounted() && (
        <For each={circles()}>
          {(circle) => (
            <div
              class={circleStyles}
              style={{
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                left: `${circle.x}%`,
                top: `${circle.y}%`,
                transform: `translate(-50%, -50%) scale(${circle.scale})`,
                opacity: circle.opacity,
              }}
            />
          )}
        </For>
      )}
    </div>
  );
};

export default Ripple;
