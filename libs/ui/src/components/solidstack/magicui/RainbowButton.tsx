import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, mergeProps, type ParentComponent, splitProps } from 'solid-js';

export interface RainbowButtonProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  variant?: 'default' | 'outline';
  disabled?: boolean;
  onClick?: () => void;
}

export const RainbowButton: ParentComponent<RainbowButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'class',
    'style',
    'children',
    'variant',
    'disabled',
    'onClick',
  ]);

  const merged = mergeProps(
    {
      variant: 'default' as const,
      disabled: false,
    },
    local
  );

  const getVariantStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
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
      isolation: 'isolate',
      opacity: merged.disabled ? 0.6 : 1,
    };

    if (merged.variant === 'outline') {
      return {
        ...baseStyles,
        background: 'transparent',
        border: '2px solid transparent',
        backgroundImage:
          'linear-gradient(var(--colors-background), var(--colors-background)), linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        animation: 'rainbow 3s linear infinite',
        color: 'var(--colors-foreground)',
      };
    }

    return {
      ...baseStyles,
      background:
        'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
      backgroundSize: '400% 100%',
      animation: 'rainbow 3s linear infinite',
      color: 'white',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    };
  };

  return (
    <button
      class={css(getVariantStyles(), merged.class)}
      style={merged.style}
      disabled={merged.disabled}
      onClick={merged.onClick}
      {...others}
    >
      {merged.children}

      <style>
        {`
          @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </button>
  );
};

export interface RainbowButtonDemoProps {
  class?: string;
}

export const RainbowButtonDemo: Component<RainbowButtonDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        },
        props.class
      )}
    >
      <RainbowButton>Get Unlimited Access</RainbowButton>
    </div>
  );
};

export const RainbowButtonOutlineDemo: Component<RainbowButtonDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        },
        props.class
      )}
    >
      <RainbowButton variant="outline">Get Unlimited Access</RainbowButton>
    </div>
  );
};

export type { RainbowButtonProps, RainbowButtonDemoProps };
