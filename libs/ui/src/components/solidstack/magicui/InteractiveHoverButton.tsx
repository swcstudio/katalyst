import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  createSignal,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  type ParentComponent,
  splitProps,
} from 'solid-js';

export interface InteractiveHoverButtonProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  disabled?: boolean;
  onClick?: () => void;
  hoverColor?: string;
  animationDuration?: number;
  background?: string;
}

export const InteractiveHoverButton: ParentComponent<InteractiveHoverButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'class',
    'style',
    'children',
    'disabled',
    'onClick',
    'hoverColor',
    'animationDuration',
    'background',
  ]);

  const merged = mergeProps(
    {
      disabled: false,
      hoverColor: '#667eea',
      animationDuration: 0.3,
      background: 'transparent',
    },
    local
  );

  const [isHovered, setIsHovered] = createSignal(false);
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  let buttonRef: HTMLButtonElement | undefined;

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef) return;

    const rect = buttonRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  onMount(() => {
    if (buttonRef) {
      buttonRef.addEventListener('mousemove', handleMouseMove);
      buttonRef.addEventListener('mouseenter', handleMouseEnter);
      buttonRef.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  onCleanup(() => {
    if (buttonRef) {
      buttonRef.removeEventListener('mousemove', handleMouseMove);
      buttonRef.removeEventListener('mouseenter', handleMouseEnter);
      buttonRef.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  return (
    <button
      ref={buttonRef}
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
          border: '2px solid',
          borderColor: merged.disabled ? 'gray.300' : 'gray.300',
          cursor: merged.disabled ? 'not-allowed' : 'pointer',
          transition: `all ${merged.animationDuration}s ease`,
          overflow: 'hidden',
          opacity: merged.disabled ? 0.6 : 1,
          background: merged.background,
          color: merged.disabled ? 'gray.500' : 'gray.700',

          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at ${mousePosition().x}px ${mousePosition().y}px, ${merged.hoverColor}20 0%, transparent 60%)`,
            opacity: isHovered() ? 1 : 0,
            transition: `opacity ${merged.animationDuration}s ease`,
            pointerEvents: 'none',
            zIndex: 1,
          },

          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${mousePosition().x}px ${mousePosition().y}px, ${merged.hoverColor} 0%, transparent 70%)`,
            opacity: isHovered() ? 0.1 : 0,
            transition: `opacity ${merged.animationDuration}s ease`,
            pointerEvents: 'none',
            zIndex: 0,
          },

          '&:hover': {
            borderColor: merged.disabled ? 'gray.300' : merged.hoverColor,
            color: merged.disabled ? 'gray.500' : merged.hoverColor,
            transform: merged.disabled ? 'none' : 'translateY(-1px)',
            boxShadow: merged.disabled ? 'none' : `0 8px 25px ${merged.hoverColor}30`,
          },

          '&:active': {
            transform: merged.disabled ? 'none' : 'translateY(0)',
          },
        },
        merged.class
      )}
      style={{
        '--hover-x': `${mousePosition().x}px`,
        '--hover-y': `${mousePosition().y}px`,
        ...merged.style,
      }}
      disabled={merged.disabled}
      onClick={merged.onClick}
      {...others}
    >
      <span
        class={css({
          position: 'relative',
          zIndex: 2,
        })}
      >
        {merged.children}
      </span>
    </button>
  );
};

export interface InteractiveHoverButtonDemoProps {
  class?: string;
}

export const InteractiveHoverButtonDemo: Component<InteractiveHoverButtonDemoProps> = (props) => {
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
      <InteractiveHoverButton>Hover Me</InteractiveHoverButton>
    </div>
  );
};

export type { InteractiveHoverButtonProps, InteractiveHoverButtonDemoProps };
