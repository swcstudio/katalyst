import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  type JSX,
  type ParentComponent,
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

export interface HyperTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: string;
  animationDuration?: number;
  framerProps?: Record<string, unknown>;
  startOnMount?: boolean;
  animateOnLoad?: boolean;
}

export const HyperText: ParentComponent<HyperTextProps> = (props) => {
  const merged = mergeProps(
    {
      animationDuration: 1000,
      startOnMount: false,
      animateOnLoad: false,
    },
    props
  );

  const [displayText, setDisplayText] = createSignal(merged.children || '');
  const [isAnimating, setIsAnimating] = createSignal(false);
  let animationId: number;
  let containerRef: HTMLSpanElement | undefined;

  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const originalText = merged.children || '';

  const getRandomChar = (): string => {
    return characters[Math.floor(Math.random() * characters.length)];
  };

  const animate = () => {
    if (isAnimating()) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const textLength = originalText.length;

    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / merged.animationDuration, 1);

      let newText = '';

      for (let i = 0; i < textLength; i++) {
        const charProgress = Math.max(0, progress * textLength - i);

        if (charProgress >= 1) {
          // Character is fully revealed
          newText += originalText[i];
        } else if (charProgress > 0) {
          // Character is in transition - show random character
          newText += Math.random() < 0.7 ? getRandomChar() : originalText[i];
        } else {
          // Character hasn't started animating yet
          newText += getRandomChar();
        }
      }

      setDisplayText(newText);

      if (progress < 1) {
        animationId = requestAnimationFrame(animateStep);
      } else {
        setDisplayText(originalText);
        setIsAnimating(false);
      }
    };

    animationId = requestAnimationFrame(animateStep);
  };

  const handleMouseEnter = () => {
    animate();
  };

  const handleMouseLeave = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    setIsAnimating(false);
    setDisplayText(originalText);
  };

  onMount(() => {
    if (merged.startOnMount || merged.animateOnLoad) {
      setTimeout(animate, 100);
    }

    if (containerRef) {
      containerRef.addEventListener('mouseenter', handleMouseEnter);
      containerRef.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  onCleanup(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    if (containerRef) {
      containerRef.removeEventListener('mouseenter', handleMouseEnter);
      containerRef.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  createEffect(() => {
    if (!isAnimating()) {
      setDisplayText(originalText);
    }
  });

  return (
    <span
      ref={containerRef}
      class={css(
        {
          display: 'inline-block',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontVariantNumeric: 'tabular-nums',
          transition: 'color 0.3s ease',
          '&:hover': {
            color: 'primary',
          },
        },
        merged.class
      )}
      style={merged.style}
    >
      {displayText()}
    </span>
  );
};

export interface HyperTextDemoProps {
  class?: string;
}

export const HyperTextDemo: Component<HyperTextDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        },
        props.class
      )}
    >
      <HyperText
        class={css({
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'foreground',
        })}
        animationDuration={800}
      >
        Hover Me!
      </HyperText>
    </div>
  );
};

export const HyperTextFastDemo: Component<HyperTextDemoProps> = (props) => {
  return (
    <HyperText
      class={css(
        {
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'primary',
        },
        props.class
      )}
      animationDuration={500}
      startOnMount
    >
      Fast Animation
    </HyperText>
  );
};

export const HyperTextSlowDemo: Component<HyperTextDemoProps> = (props) => {
  return (
    <HyperText
      class={css(
        {
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'secondary',
        },
        props.class
      )}
      animationDuration={2000}
    >
      Slow Animation
    </HyperText>
  );
};

export type { HyperTextProps, HyperTextDemoProps };
