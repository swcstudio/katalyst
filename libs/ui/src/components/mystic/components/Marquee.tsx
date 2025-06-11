import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  For,
  type JSX,
  children,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

export interface MarqueeProps {
  children: JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
  direction?: 'left' | 'right' | 'up' | 'down';
  speed?: number;
  pauseOnHover?: boolean;
  repeat?: number;
  vertical?: boolean;
  fade?: boolean;
  gradient?: boolean;
  gradientColor?: string;
  gradientWidth?: number;
}

const Marquee: Component<MarqueeProps> = (props) => {
  const merged = mergeProps(
    {
      direction: 'left' as const,
      speed: 50,
      pauseOnHover: false,
      repeat: 2,
      vertical: false,
      fade: false,
      gradient: true,
      gradientColor: '#ffffff',
      gradientWidth: 200,
    },
    props
  );

  const [isPaused, setIsPaused] = createSignal(false);
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const resolved = children(() => props.children);

  const getAnimationDirection = () => {
    if (merged.vertical) {
      return merged.direction === 'up' || merged.direction === 'left' ? 'reverse' : 'normal';
    }
    return merged.direction === 'right' || merged.direction === 'down' ? 'reverse' : 'normal';
  };

  const getAnimationName = () => {
    return merged.vertical ? 'scroll-y' : 'scroll-x';
  };

  const getGradientMask = () => {
    if (!merged.gradient) return 'none';

    const gradientWidth = merged.gradientWidth;
    const color = merged.gradientColor;

    if (merged.vertical) {
      return `linear-gradient(to bottom, 
        transparent 0%, 
        ${color} ${gradientWidth}px, 
        ${color} calc(100% - ${gradientWidth}px), 
        transparent 100%)`;
    }

    return `linear-gradient(to right, 
      transparent 0%, 
      ${color} ${gradientWidth}px, 
      ${color} calc(100% - ${gradientWidth}px), 
      transparent 100%)`;
  };

  const getFadeClass = () => {
    if (!merged.fade) return '';

    return css({
      _before: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100px',
        height: '100%',
        background: `linear-gradient(to right, ${merged.gradientColor}, transparent)`,
        zIndex: 10,
      },
      _after: {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100%',
        background: `linear-gradient(to left, ${merged.gradientColor}, transparent)`,
        zIndex: 10,
      },
    });
  };

  return (
    <div
      ref={setContainerRef}
      class={css(
        {
          position: 'relative',
          overflow: 'hidden',
          width: merged.vertical ? 'auto' : '100%',
          height: merged.vertical ? '100%' : 'auto',
          mask: getGradientMask(),
          WebkitMask: getGradientMask(),
        },
        getFadeClass(),
        merged.className
      )}
      style={merged.style}
      onMouseEnter={() => merged.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => merged.pauseOnHover && setIsPaused(false)}
    >
      <div
        class={css({
          display: 'flex',
          flexDirection: merged.vertical ? 'column' : 'row',
          width: merged.vertical ? '100%' : 'max-content',
          height: merged.vertical ? 'max-content' : '100%',
          animation: `${getAnimationName()} ${merged.speed}s linear infinite`,
          animationDirection: getAnimationDirection(),
          animationPlayState: isPaused() ? 'paused' : 'running',
        })}
      >
        <For each={Array.from({ length: merged.repeat })}>
          {() => (
            <div
              class={css({
                display: 'flex',
                flexDirection: merged.vertical ? 'column' : 'row',
                flexShrink: 0,
              })}
            >
              {resolved()}
            </div>
          )}
        </For>
      </div>

      <style>{`
        @keyframes scroll-x {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        
        @keyframes scroll-y {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
