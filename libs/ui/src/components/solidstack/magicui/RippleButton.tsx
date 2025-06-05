import { Component, JSX, mergeProps, ParentComponent, splitProps, createSignal, onCleanup, For } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface RippleButtonProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  disabled?: boolean;
  onClick?: () => void;
  rippleColor?: string;
  rippleDuration?: number;
  background?: string;
  maxRipples?: number;
}

export const RippleButton: ParentComponent<RippleButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'class', 'style', 'children', 'disabled', 'onClick', 
    'rippleColor', 'rippleDuration', 'background', 'maxRipples'
  ]);
  
  const merged = mergeProps(
    {
      disabled: false,
      rippleColor: '#ADD8E6',
      rippleDuration: 600,
      background: '#3b82f6',
      maxRipples: 3,
    },
    local
  );

  const [ripples, setRipples] = createSignal<Ripple[]>([]);
  let buttonRef: HTMLButtonElement | undefined;
  let rippleId = 0;

  const createRipple = (event: MouseEvent) => {
    if (!buttonRef || merged.disabled) return;

    const rect = buttonRef.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: rippleId++,
      x,
      y,
      size,
    };

    setRipples(prev => {
      const updated = [...prev, newRipple];
      // Limit the number of concurrent ripples
      if (updated.length > merged.maxRipples) {
        updated.shift();
      }
      return updated;
    });

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, merged.rippleDuration);
  };

  const handleClick = (event: MouseEvent) => {
    createRipple(event);
    if (merged.onClick) {
      merged.onClick();
    }
  };

  onCleanup(() => {
    setRipples([]);
  });

  return (
    <button
      ref={buttonRef}
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
        userSelect: 'none',
        
        '&:hover': {
          transform: merged.disabled ? 'none' : 'translateY(-1px)',
          boxShadow: merged.disabled ? 'none' : '0 8px 25px rgba(0, 0, 0, 0.2)',
        },
        
        '&:active': {
          transform: merged.disabled ? 'none' : 'translateY(0)',
        },
        
        '&:focus': {
          outline: 'none',
          boxShadow: `0 0 0 3px ${merged.rippleColor}40`,
        },
      }, merged.class)}
      style={merged.style}
      disabled={merged.disabled}
      onClick={handleClick}
      {...others}
    >
      <span class={css({
        position: 'relative',
        zIndex: 1,
      })}>
        {merged.children}
      </span>
      
      {/* Ripple container */}
      <span class={css({
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      })}>
        <For each={ripples()}>
          {(ripple) => (
            <span
              class={css({
                position: 'absolute',
                borderRadius: '50%',
                transform: 'scale(0)',
                animation: `ripple ${merged.rippleDuration}ms ease-out`,
                pointerEvents: 'none',
                
                '@keyframes ripple': {
                  '0%': {
                    transform: 'scale(0)',
                    opacity: 0.6,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 0,
                  },
                },
              })}
              style={{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
                backgroundColor: merged.rippleColor,
              }}
            />
          )}
        </For>
      </span>
    </button>
  );
};

export interface RippleButtonDemoProps {
  class?: string;
}

export const RippleButtonDemo: Component<RippleButtonDemoProps> = (props) => {
  return (
    <div class={css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }, props.class)}>
      <RippleButton rippleColor="#ADD8E6">Click me</RippleButton>
    </div>
  );
};

export type { RippleButtonProps, RippleButtonDemoProps };