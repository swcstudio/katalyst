import { Component, JSX, mergeProps, ParentComponent, splitProps } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface ShimmerButtonProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  disabled?: boolean;
  onClick?: () => void;
  shimmerColor?: string;
  shimmerSize?: number;
  animationDuration?: number;
  background?: string;
}

export const ShimmerButton: ParentComponent<ShimmerButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'class', 'style', 'children', 'disabled', 'onClick', 
    'shimmerColor', 'shimmerSize', 'animationDuration', 'background'
  ]);
  
  const merged = mergeProps(
    {
      disabled: false,
      shimmerColor: 'rgba(255, 255, 255, 0.5)',
      shimmerSize: 150,
      animationDuration: 2,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    local
  );

  return (
    <button
      class={css({
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        border: 'none',
        cursor: merged.disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        opacity: merged.disabled ? 0.6 : 1,
        background: merged.background,
        color: 'white',
        
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${merged.shimmerColor}, transparent)`,
          transform: 'skewX(-15deg)',
          animation: `shimmer ${merged.animationDuration}s infinite`,
        },
        
        '&:hover': {
          transform: merged.disabled ? 'none' : 'translateY(-1px)',
          boxShadow: merged.disabled ? 'none' : '0 8px 25px rgba(0, 0, 0, 0.3)',
        },
        
        '&:active': {
          transform: merged.disabled ? 'none' : 'translateY(0)',
        },

        '@keyframes shimmer': {
          '0%': {
            left: '-100%',
          },
          '100%': {
            left: '100%',
          },
        },
      }, merged.class)}
      style={merged.style}
      disabled={merged.disabled}
      onClick={merged.onClick}
      {...others}
    >
      <span class={css({
        position: 'relative',
        zIndex: 1,
      })}>
        {merged.children}
      </span>
    </button>
  );
};

export interface ShimmerButtonDemoProps {
  class?: string;
}

export const ShimmerButtonDemo: Component<ShimmerButtonDemoProps> = (props) => {
  return (
    <div class={css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }, props.class)}>
      <ShimmerButton class={css({ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' })}>
        <span class={css({
          whiteSpace: 'pre-wrap',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'medium',
          lineHeight: 1,
          letterSpacing: '-0.025em',
          color: 'white',
          '@media (min-width: 1024px)': {
            fontSize: '18px',
          },
        })}>
          Shimmer Button
        </span>
      </ShimmerButton>
    </div>
  );
};

export type { ShimmerButtonProps, ShimmerButtonDemoProps };