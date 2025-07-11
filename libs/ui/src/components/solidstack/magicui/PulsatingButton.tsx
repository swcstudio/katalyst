import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, type ParentComponent, mergeProps, splitProps } from 'solid-js';

export interface PulsatingButtonProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  disabled?: boolean;
  onClick?: () => void;
  pulseColor?: string;
  animationDuration?: number;
  background?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PulsatingButton: ParentComponent<PulsatingButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'class',
    'style',
    'children',
    'disabled',
    'onClick',
    'pulseColor',
    'animationDuration',
    'background',
    'size',
  ]);

  const merged = mergeProps(
    {
      disabled: false,
      pulseColor: '#3b82f6',
      animationDuration: 2,
      background: '#3b82f6',
      size: 'md' as const,
    },
    local
  );

  const getSizeStyles = () => {
    switch (merged.size) {
      case 'sm':
        return {
          padding: '8px 16px',
          fontSize: '12px',
        };
      case 'lg':
        return {
          padding: '16px 32px',
          fontSize: '16px',
        };
      default:
        return {
          padding: '12px 24px',
          fontSize: '14px',
        };
    }
  };

  return (
    <button
      class={css(
        {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          fontWeight: '600',
          border: 'none',
          cursor: merged.disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: merged.disabled ? 0.6 : 1,
          background: merged.background,
          color: 'white',
          zIndex: 1,
          ...getSizeStyles(),

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
            background: merged.pulseColor,
            animation: `pulse ${merged.animationDuration}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
            zIndex: -1,
          },

          '&:hover': {
            transform: merged.disabled ? 'none' : 'translateY(-1px)',
            boxShadow: merged.disabled ? 'none' : `0 8px 25px ${merged.pulseColor}40`,
          },

          '&:active': {
            transform: merged.disabled ? 'none' : 'translateY(0)',
          },

          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
            '50%': {
              opacity: 0.5,
              transform: 'scale(1.05)',
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

export interface PulsatingButtonDemoProps {
  class?: string;
}

export const PulsatingButtonDemo: Component<PulsatingButtonDemoProps> = (props) => {
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
      <PulsatingButton>Join Affiliate Program</PulsatingButton>
    </div>
  );
};

export type { PulsatingButtonProps, PulsatingButtonDemoProps };
