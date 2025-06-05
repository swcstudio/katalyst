import { Component, JSX, mergeProps, ParentComponent } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface AnimatedShinyTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  shimmerWidth?: number;
  shimmerColor?: string;
  animationDuration?: number;
}

export const AnimatedShinyText: ParentComponent<AnimatedShinyTextProps> = (props) => {
  const merged = mergeProps(
    {
      shimmerWidth: 100,
      shimmerColor: 'rgba(255, 255, 255, 0.3)',
      animationDuration: 3,
    },
    props
  );

  return (
    <span
      class={css({
        position: 'relative',
        display: 'inline-block',
        background: 'linear-gradient(110deg, transparent 35%, var(--shimmer-color), transparent 65%)',
        backgroundSize: `${merged.shimmerWidth * 2}% 100%`,
        backgroundPosition: '-100% 0',
        animation: `shimmer ${merged.animationDuration}s ease-in-out infinite`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(110deg, transparent 35%, var(--shimmer-color), transparent 65%)',
          backgroundSize: `${merged.shimmerWidth * 2}% 100%`,
          backgroundPosition: '-100% 0',
          animation: `shimmer ${merged.animationDuration}s ease-in-out infinite`,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        },

        '@keyframes shimmer': {
          '0%': {
            backgroundPosition: '-100% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
      }, merged.class)}
      style={{
        '--shimmer-color': merged.shimmerColor,
        ...merged.style,
      }}
    >
      {props.children}
    </span>
  );
};

export interface AnimatedShinyTextDemoProps {
  class?: string;
}

export const AnimatedShinyTextDemo: Component<AnimatedShinyTextDemoProps> = (props) => {
  return (
    <div class={css({
      zIndex: 10,
      display: 'flex',
      minHeight: '256px',
      alignItems: 'center',
      justifyContent: 'center',
    }, props.class)}>
      <div
        class={css({
          group: true,
          borderRadius: '9999px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          backgroundColor: 'rgb(245, 245, 245)',
          fontSize: '16px',
          color: 'white',
          transition: 'all 0.3s ease-in',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgb(229, 229, 229)',
          },
          _dark: {
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgb(23, 23, 23)',
            '&:hover': {
              backgroundColor: 'rgb(38, 38, 38)',
            },
          },
        })}
      >
        <AnimatedShinyText 
          class={css({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingX: '16px',
            paddingY: '4px',
            transition: 'ease-out',
            color: 'rgb(115, 115, 115)',
            '&:hover': {
              duration: '300ms',
              color: 'rgb(82, 82, 82)',
            },
            _dark: {
              color: 'rgb(163, 163, 163)',
              '&:hover': {
                color: 'rgb(115, 115, 115)',
              },
            },
          })}
        >
          <span>✨ Introducing Magic UI</span>
          <svg 
            class={css({
              marginLeft: '4px',
              width: '12px',
              height: '12px',
              transition: 'transform 300ms ease-in-out',
              '.group:hover &': {
                transform: 'translateX(2px)',
              },
            })}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </AnimatedShinyText>
      </div>
    </div>
  );
};

export type { AnimatedShinyTextProps, AnimatedShinyTextDemoProps };