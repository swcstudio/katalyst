import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  type JSX,
  type ParentComponent,
  createSignal,
  mergeProps,
  splitProps,
} from 'solid-js';

export interface AnimatedSubscribeButtonProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: [JSX.Element, JSX.Element]; // [default state, subscribed state]
  disabled?: boolean;
  onClick?: (subscribed: boolean) => void;
  initialSubscribed?: boolean;
  animationDuration?: number;
}

export const AnimatedSubscribeButton: ParentComponent<AnimatedSubscribeButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'class',
    'style',
    'children',
    'disabled',
    'onClick',
    'initialSubscribed',
    'animationDuration',
  ]);

  const merged = mergeProps(
    {
      disabled: false,
      initialSubscribed: false,
      animationDuration: 0.3,
    },
    local
  );

  const [isSubscribed, setIsSubscribed] = createSignal(merged.initialSubscribed);
  const [isAnimating, setIsAnimating] = createSignal(false);

  const handleClick = () => {
    if (merged.disabled || isAnimating()) return;

    setIsAnimating(true);
    const newState = !isSubscribed();

    setTimeout(() => {
      setIsSubscribed(newState);
      setIsAnimating(false);
      if (merged.onClick) {
        merged.onClick(newState);
      }
    }, merged.animationDuration * 500);
  };

  const defaultState = Array.isArray(merged.children) ? merged.children[0] : merged.children;
  const subscribedState = Array.isArray(merged.children) ? merged.children[1] : merged.children;

  return (
    <button
      class={css(
        {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          border: '1px solid',
          borderColor: isSubscribed() ? 'green.500' : 'gray.300',
          cursor: merged.disabled ? 'not-allowed' : 'pointer',
          transition: `all ${merged.animationDuration}s ease`,
          overflow: 'hidden',
          opacity: merged.disabled ? 0.6 : 1,
          background: isSubscribed() ? 'green.500' : 'white',
          color: isSubscribed() ? 'white' : 'gray.700',
          minWidth: '120px',

          '&:hover': {
            transform: merged.disabled ? 'none' : 'translateY(-1px)',
            boxShadow: merged.disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderColor: isSubscribed() ? 'green.600' : 'gray.400',
            backgroundColor: isSubscribed() ? 'green.600' : 'gray.50',
          },

          '&:active': {
            transform: merged.disabled ? 'none' : 'translateY(0)',
          },

          '& .button-content': {
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },

          '& .state-default': {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isSubscribed() ? 'translateY(-100%)' : 'translateY(0)',
            opacity: isSubscribed() ? 0 : 1,
            transition: `all ${merged.animationDuration}s ease`,
          },

          '& .state-subscribed': {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isSubscribed() ? 'translateY(0)' : 'translateY(100%)',
            opacity: isSubscribed() ? 1 : 0,
            transition: `all ${merged.animationDuration}s ease`,
          },
        },
        merged.class
      )}
      style={merged.style}
      disabled={merged.disabled}
      onClick={handleClick}
      {...others}
    >
      <div class="button-content">
        <div class="state-default">{defaultState}</div>
        <div class="state-subscribed">{subscribedState}</div>
      </div>
    </button>
  );
};

export interface AnimatedSubscribeButtonDemoProps {
  class?: string;
}

export const AnimatedSubscribeButtonDemo: Component<AnimatedSubscribeButtonDemoProps> = (props) => {
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
      <AnimatedSubscribeButton class={css({ width: '144px' })}>
        <span
          class={css({
            group: true,
            display: 'inline-flex',
            alignItems: 'center',
          })}
        >
          Follow
          <svg
            class={css({
              marginLeft: '4px',
              width: '16px',
              height: '16px',
              transition: 'transform 300ms ease',
              '.group:hover &': {
                transform: 'translateX(4px)',
              },
            })}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
        <span
          class={css({
            group: true,
            display: 'inline-flex',
            alignItems: 'center',
          })}
        >
          <svg
            class={css({
              marginRight: '8px',
              width: '16px',
              height: '16px',
            })}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Subscribed
        </span>
      </AnimatedSubscribeButton>
    </div>
  );
};

export type { AnimatedSubscribeButtonProps, AnimatedSubscribeButtonDemoProps };
