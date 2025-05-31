import { Component, JSX, mergeProps, children } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface AnimatedShinyTextProps {
  children?: JSX.Element;
  text?: string;
  className?: string;
  style?: JSX.CSSProperties;
  shimmerColor?: string;
  shimmerWidth?: number;
  animationSpeed?: number;
  direction?: 'left-to-right' | 'right-to-left';
  as?: keyof JSX.IntrinsicElements;
  disabled?: boolean;
}

const AnimatedShinyText: Component<AnimatedShinyTextProps> = (props) => {
  const merged = mergeProps(
    {
      shimmerColor: '#ffffff',
      shimmerWidth: 100,
      animationSpeed: 3,
      direction: 'left-to-right' as const,
      as: 'span' as const,
      disabled: false,
    },
    props
  );

  const resolved = children(() => props.children);
  const Dynamic = merged.as as any;

  const getAnimationDirection = () => {
    return merged.direction === 'left-to-right' ? 'shimmer-ltr' : 'shimmer-rtl';
  };

  return (
    <Dynamic
      class={css({
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        background: merged.disabled ? 'transparent' : `linear-gradient(
          110deg,
          transparent 0%,
          transparent 40%,
          ${merged.shimmerColor}40 50%,
          ${merged.shimmerColor}80 52%,
          transparent 55%,
          transparent 100%
        )`,
        backgroundSize: `${merged.shimmerWidth * 2}% 100%`,
        backgroundPosition: merged.direction === 'left-to-right' ? '-100% 0' : '100% 0',
        backgroundRepeat: 'no-repeat',
        animation: merged.disabled ? 'none' : `${getAnimationDirection()} ${merged.animationSpeed}s ease-in-out infinite`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        _before: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          transform: merged.direction === 'left-to-right' ? 'translateX(-100%)' : 'translateX(100%)',
          animation: merged.disabled ? 'none' : `shimmer-overlay ${merged.animationSpeed}s ease-in-out infinite`,
          zIndex: 1,
        },
      }, merged.className)}
      style={merged.style}
    >
      <span
        class={css({
          position: 'relative',
          zIndex: 2,
          background: 'linear-gradient(90deg, currentColor, currentColor)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: merged.disabled ? 'currentColor' : 'transparent',
          color: merged.disabled ? 'currentColor' : 'transparent',
        })}
      >
        {props.text || resolved()}
      </span>

      <style>{`
        @keyframes shimmer-ltr {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
        
        @keyframes shimmer-rtl {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
        
        @keyframes shimmer-overlay {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Dynamic>
  );
};

export default AnimatedShinyText;