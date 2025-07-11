import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  For,
  type JSX,
  ParentComponent,
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

// WordRotate Component
export interface WordRotateProps {
  class?: string;
  style?: JSX.CSSProperties;
  words: string[];
  duration?: number;
  animationDuration?: number;
}

export const WordRotate: Component<WordRotateProps> = (props) => {
  const merged = mergeProps(
    {
      duration: 2500,
      animationDuration: 0.5,
    },
    props
  );

  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isAnimating, setIsAnimating] = createSignal(false);
  let intervalId: number;

  const nextWord = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % merged.words.length);
      setIsAnimating(false);
    }, merged.animationDuration * 500);
  };

  onMount(() => {
    intervalId = setInterval(nextWord, merged.duration);
  });

  onCleanup(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return (
    <span
      class={css(
        {
          display: 'inline-block',
          position: 'relative',
          minHeight: '1em',
        },
        merged.class
      )}
      style={merged.style}
    >
      <span
        class={css({
          display: 'inline-block',
          transform: isAnimating() ? 'rotateX(90deg)' : 'rotateX(0deg)',
          opacity: isAnimating() ? 0 : 1,
          transition: `all ${merged.animationDuration}s ease-in-out`,
        })}
      >
        {merged.words[currentIndex()]}
      </span>
    </span>
  );
};

export const WordRotateDemo: Component = () => {
  return (
    <WordRotate
      class={css({
        fontSize: '2.25rem',
        fontWeight: 'bold',
        color: 'foreground',
      })}
      words={['Word', 'Rotate']}
    />
  );
};

// TypingAnimation Component
export interface TypingAnimationProps {
  class?: string;
  style?: JSX.CSSProperties;
  children: string;
  duration?: number;
  delay?: number;
  startOnMount?: boolean;
}

export const TypingAnimation: Component<TypingAnimationProps> = (props) => {
  const merged = mergeProps(
    {
      duration: 50,
      delay: 0,
      startOnMount: true,
    },
    props
  );

  const [displayText, setDisplayText] = createSignal('');
  const [showCursor, setShowCursor] = createSignal(true);
  const [isTyping, setIsTyping] = createSignal(false);
  let typingTimeoutId: number;
  let cursorIntervalId: number;

  const startTyping = () => {
    setIsTyping(true);
    setDisplayText('');

    const fullText = merged.children;
    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        typingTimeoutId = setTimeout(typeNextChar, merged.duration);
      } else {
        setIsTyping(false);
        setShowCursor(false);
      }
    };

    setTimeout(typeNextChar, merged.delay);
  };

  onMount(() => {
    // Cursor blinking animation
    cursorIntervalId = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    if (merged.startOnMount) {
      startTyping();
    }
  });

  onCleanup(() => {
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
    }
    if (cursorIntervalId) {
      clearInterval(cursorIntervalId);
    }
  });

  return (
    <span
      class={css(
        {
          display: 'inline-block',
          fontFamily: 'monospace',
        },
        merged.class
      )}
      style={merged.style}
    >
      {displayText()}
      <span
        class={css({
          opacity:
            showCursor() && (isTyping() || displayText().length < merged.children.length) ? 1 : 0,
          transition: 'opacity 0.1s ease',
        })}
      >
        |
      </span>
    </span>
  );
};

export const TypingAnimationDemo: Component = () => {
  return (
    <TypingAnimation
      class={css({
        fontSize: '1.5rem',
        fontWeight: '600',
        color: 'foreground',
      })}
    >
      Typing Animation
    </TypingAnimation>
  );
};

// FlipText Component
export interface FlipTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children: string;
  duration?: number;
  staggerDelay?: number;
  startOnMount?: boolean;
  triggerOnHover?: boolean;
}

export const FlipText: Component<FlipTextProps> = (props) => {
  const merged = mergeProps(
    {
      duration: 0.5,
      staggerDelay: 0.1,
      startOnMount: false,
      triggerOnHover: true,
    },
    props
  );

  const [isFlipped, setIsFlipped] = createSignal(false);
  const [hasAnimated, setHasAnimated] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const words = merged.children.split(' ');

  const startFlip = () => {
    if (!hasAnimated() || !merged.startOnMount) {
      setIsFlipped(true);
      setHasAnimated(true);

      // Reset after animation completes
      setTimeout(
        () => {
          setIsFlipped(false);
        },
        (merged.duration + merged.staggerDelay * words.length) * 1000
      );
    }
  };

  const handleMouseEnter = () => {
    if (merged.triggerOnHover) {
      startFlip();
    }
  };

  onMount(() => {
    if (merged.startOnMount) {
      setTimeout(startFlip, 100);
    }

    if (containerRef && merged.triggerOnHover) {
      containerRef.addEventListener('mouseenter', handleMouseEnter);
    }
  });

  onCleanup(() => {
    if (containerRef && merged.triggerOnHover) {
      containerRef.removeEventListener('mouseenter', handleMouseEnter);
    }
  });

  return (
    <div
      ref={containerRef}
      class={css(
        {
          display: 'inline-block',
          cursor: merged.triggerOnHover ? 'pointer' : 'default',
        },
        merged.class
      )}
      style={merged.style}
    >
      <For each={words}>
        {(word, index) => (
          <>
            <span
              class={css({
                display: 'inline-block',
                transform: isFlipped() ? 'rotateX(360deg)' : 'rotateX(0deg)',
                transformOrigin: 'center',
                transition: `transform ${merged.duration}s ease-in-out`,
                transitionDelay: `${index() * merged.staggerDelay}s`,
              })}
            >
              {word}
            </span>
            {index() < words.length - 1 && ' '}
          </>
        )}
      </For>
    </div>
  );
};

export const FlipTextDemo: Component = () => {
  return (
    <FlipText
      class={css({
        fontSize: '2.25rem',
        fontWeight: 'bold',
        letterSpacing: '-0.05em',
        color: 'foreground',
        '@media (min-width: 768px)': {
          fontSize: '4.5rem',
          lineHeight: '5rem',
        },
      })}
    >
      Flip Text
    </FlipText>
  );
};

// VelocityScroll Component
export interface VelocityScrollProps {
  class?: string;
  style?: JSX.CSSProperties;
  children: string;
  velocity?: number;
  numRows?: number;
}

export const VelocityScroll: Component<VelocityScrollProps> = (props) => {
  const merged = mergeProps(
    {
      velocity: 1,
      numRows: 1,
    },
    props
  );

  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'flex',
          overflow: 'hidden',
          width: '100%',
        },
        merged.class
      )}
      style={merged.style}
    >
      <div
        class={css({
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: `scroll ${20 / merged.velocity}s linear infinite`,

          '@keyframes scroll': {
            '0%': {
              transform: 'translateX(0)',
            },
            '100%': {
              transform: 'translateX(-50%)',
            },
          },
        })}
      >
        <span class={css({ paddingRight: '2rem' })}>{merged.children}</span>
        <span class={css({ paddingRight: '2rem' })}>{merged.children}</span>
        <span class={css({ paddingRight: '2rem' })}>{merged.children}</span>
        <span class={css({ paddingRight: '2rem' })}>{merged.children}</span>
      </div>
    </div>
  );
};

export const ScrollBasedVelocityDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      })}
    >
      <VelocityScroll
        class={css({
          fontSize: '4rem',
          fontWeight: 'bold',
          color: 'foreground',
        })}
      >
        Velocity Scroll
      </VelocityScroll>
      <div
        class={css({
          pointerEvents: 'none',
          position: 'absolute',
          insetY: 0,
          left: 0,
          width: '25%',
          background: 'linear-gradient(to right, var(--colors-background), transparent)',
        })}
      />
      <div
        class={css({
          pointerEvents: 'none',
          position: 'absolute',
          insetY: 0,
          right: 0,
          width: '25%',
          background: 'linear-gradient(to left, var(--colors-background), transparent)',
        })}
      />
    </div>
  );
};

export type { WordRotateProps, TypingAnimationProps, FlipTextProps, VelocityScrollProps };
