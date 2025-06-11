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

export interface TextRevealProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  revealDirection?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export const TextReveal: ParentComponent<TextRevealProps> = (props) => {
  const merged = mergeProps(
    {
      revealDirection: 'up' as const,
      duration: 0.8,
      delay: 0,
      threshold: 0.1,
      once: true,
    },
    props
  );

  const [isRevealed, setIsRevealed] = createSignal(false);
  const [hasRevealed, setHasRevealed] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;

  const getTransformStyle = (): JSX.CSSProperties => {
    const baseTransform = (() => {
      switch (merged.revealDirection) {
        case 'up':
          return 'translateY(50px)';
        case 'down':
          return 'translateY(-50px)';
        case 'left':
          return 'translateX(50px)';
        case 'right':
          return 'translateX(-50px)';
        default:
          return 'translateY(50px)';
      }
    })();

    return {
      transform: isRevealed() ? 'translate(0)' : baseTransform,
      opacity: isRevealed() ? 1 : 0,
      filter: isRevealed() ? 'blur(0px)' : 'blur(4px)',
      transition: `all ${merged.duration}s cubic-bezier(0.16, 1, 0.3, 1) ${merged.delay}s`,
    };
  };

  onMount(() => {
    if (containerRef) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && (!merged.once || !hasRevealed())) {
            setIsRevealed(true);
            if (merged.once) {
              setHasRevealed(true);
              observer?.unobserve(containerRef!);
            }
          } else if (!merged.once && !entry.isIntersecting) {
            setIsRevealed(false);
          }
        },
        { threshold: merged.threshold }
      );
      observer.observe(containerRef);
    }
  });

  onCleanup(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return (
    <div
      ref={containerRef}
      class={css(
        {
          display: 'inline-block',
          position: 'relative',
        },
        merged.class
      )}
      style={{
        ...getTransformStyle(),
        ...merged.style,
      }}
    >
      {props.children}
    </div>
  );
};

export interface TextRevealDemoProps {
  class?: string;
}

export const TextRevealDemo: Component<TextRevealDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          padding: '40px',
          textAlign: 'center',
        },
        props.class
      )}
    >
      <TextReveal
        class={css({
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'foreground',
          textAlign: 'center',
        })}
      >
        Magic UI will change the way you design.
      </TextReveal>
    </div>
  );
};

export type { TextRevealProps, TextRevealDemoProps };
