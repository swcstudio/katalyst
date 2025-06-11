import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, type ParentComponent, mergeProps, splitProps } from 'solid-js';

export interface ShinyButtonProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  disabled?: boolean;
  onClick?: () => void;
  shineColor?: string;
  animationDuration?: number;
  background?: string;
}

export const ShinyButton: ParentComponent<ShinyButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'class',
    'style',
    'children',
    'disabled',
    'onClick',
    'shineColor',
    'animationDuration',
    'background',
  ]);

  const merged = mergeProps(
    {
      disabled: false,
      shineColor: 'rgba(255, 255, 255, 0.6)',
      animationDuration: 2.5,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    local
  );

  return (
    <button
      class={css(
        {
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

          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `linear-gradient(45deg, transparent 30%, ${merged.shineColor} 50%, transparent 70%)`,
            transform: 'rotate(45deg)',
            animation: `shine ${merged.animationDuration}s ease-in-out infinite`,
            pointerEvents: 'none',
          },

          '&:hover': {
            transform: merged.disabled ? 'none' : 'translateY(-1px)',
            boxShadow: merged.disabled ? 'none' : '0 8px 25px rgba(0, 0, 0, 0.2)',
          },

          '&:active': {
            transform: merged.disabled ? 'none' : 'translateY(0)',
          },

          '@keyframes shine': {
            '0%': {
              transform: 'rotate(45deg) translate(-200%, -200%)',
            },
            '50%': {
              transform: 'rotate(45deg) translate(0%, 0%)',
            },
            '100%': {
              transform: 'rotate(45deg) translate(200%, 200%)',
            },
          },
        },
        merged.class
      )}
      style={merged.style}
      disabled={merged.disabled}
      onClick={merged.onClick}
      {...others}
    >
      <span
        class={css({
          position: 'relative',
          zIndex: 1,
        })}
      >
        {merged.children}
      </span>
    </button>
  );
};

export interface ShinyButtonDemoProps {
  class?: string;
}

export const ShinyButtonDemo: Component<ShinyButtonDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        },
        props.class
      )}
    >
      <ShinyButton>Shiny Button</ShinyButton>
    </div>
  );
};

export type { ShinyButtonProps, ShinyButtonDemoProps };
