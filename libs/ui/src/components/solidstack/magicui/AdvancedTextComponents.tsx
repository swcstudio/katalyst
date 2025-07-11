import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  For,
  type JSX,
  type ParentComponent,
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

// BoxReveal Component
export interface BoxRevealProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  boxColor?: string;
  duration?: number;
  delay?: number;
  width?: string;
  height?: string;
}

export const BoxReveal: ParentComponent<BoxRevealProps> = (props) => {
  const merged = mergeProps(
    {
      boxColor: '#5046e6',
      duration: 0.5,
      delay: 0,
      width: 'fit-content',
      height: 'fit-content',
    },
    props
  );

  const [isRevealed, setIsRevealed] = createSignal(false);

  onMount(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, merged.delay * 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'inline-block',
          overflow: 'hidden',
          width: merged.width,
          height: merged.height,
        },
        merged.class
      )}
      style={merged.style}
    >
      <div
        class={css({
          opacity: isRevealed() ? 1 : 0,
          transform: isRevealed() ? 'translateY(0)' : 'translateY(8px)',
          transition: `all ${merged.duration}s ease-out ${merged.delay}s`,
        })}
      >
        {props.children}
      </div>

      <div
        class={css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: isRevealed() ? 'translateX(100%)' : 'translateX(0%)',
          transition: `transform ${merged.duration}s ease-out ${merged.delay + 0.15}s`,
          zIndex: 10,
        })}
        style={{
          backgroundColor: merged.boxColor,
        }}
      />
    </div>
  );
};

export const BoxRevealDemo: Component = () => {
  return (
    <div
      class={css({
        width: '100%',
        height: '100%',
        maxWidth: '512px',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '32px',
      })}
    >
      <BoxReveal boxColor="#5046e6" duration={0.5}>
        <p
          class={css({
            fontSize: '3.5rem',
            fontWeight: '600',
          })}
        >
          Magic UI<span style={{ color: '#5046e6' }}>.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor="#5046e6" duration={0.5}>
        <h2
          class={css({
            marginTop: '0.5rem',
            fontSize: '1rem',
          })}
        >
          UI library for <span style={{ color: '#5046e6' }}>Design Engineers</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor="#5046e6" duration={0.5}>
        <div class={css({ marginTop: '24px' })}>
          <p>
            -&gt; 20+ free and open-source animated components built with
            <span class={css({ fontWeight: '600', color: '#5046e6' })}>React</span>,
            <span class={css({ fontWeight: '600', color: '#5046e6' })}>Typescript</span>,
            <span class={css({ fontWeight: '600', color: '#5046e6' })}>Tailwind CSS</span>, and
            <span class={css({ fontWeight: '600', color: '#5046e6' })}>Motion</span>. <br />
            -&gt; 100% open-source, and customizable. <br />
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor="#5046e6" duration={0.5}>
        <button
          class={css({
            marginTop: '1.6rem',
            padding: '8px 16px',
            backgroundColor: '#5046e6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'medium',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: '#3f39c7',
            },
          })}
        >
          Explore
        </button>
      </BoxReveal>
    </div>
  );
};

// SparklesText Component
export interface SparklesTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: string;
  sparklesCount?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  duration?: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  animationDelay: number;
  animationDuration: number;
}

export const SparklesText: Component<SparklesTextProps> = (props) => {
  const merged = mergeProps(
    {
      sparklesCount: 8,
      colors: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98'],
      minSize: 8,
      maxSize: 16,
      duration: 1.5,
    },
    props
  );

  const [sparkles, setSparkles] = createSignal<Sparkle[]>([]);
  let containerRef: HTMLSpanElement | undefined;

  const generateSparkle = (id: number): Sparkle => {
    return {
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (merged.maxSize - merged.minSize) + merged.minSize,
      color: merged.colors[Math.floor(Math.random() * merged.colors.length)],
      animationDelay: Math.random() * merged.duration,
      animationDuration: merged.duration + Math.random() * 0.5,
    };
  };

  onMount(() => {
    const sparkleArray = Array.from({ length: merged.sparklesCount }, (_, i) => generateSparkle(i));
    setSparkles(sparkleArray);

    const interval = setInterval(() => {
      setSparkles((prev) => prev.map((sparkle) => generateSparkle(sparkle.id)));
    }, merged.duration * 1000);

    return () => clearInterval(interval);
  });

  return (
    <span
      ref={containerRef}
      class={css(
        {
          position: 'relative',
          display: 'inline-block',
        },
        merged.class
      )}
      style={merged.style}
    >
      {props.children}

      <For each={sparkles()}>
        {(sparkle) => (
          <span
            class={css({
              position: 'absolute',
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animation: `sparkle ${sparkle.animationDuration}s ease-in-out infinite`,
              animationDelay: `${sparkle.animationDelay}s`,
              pointerEvents: 'none',

              '@keyframes sparkle': {
                '0%, 100%': {
                  opacity: 0,
                  transform: 'scale(0) rotate(0deg)',
                },
                '50%': {
                  opacity: 1,
                  transform: 'scale(1) rotate(180deg)',
                },
              },
            })}
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              backgroundColor: sparkle.color,
              'clip-path':
                'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
        )}
      </For>
    </span>
  );
};

export const SparklesTextDemo: Component = () => {
  return (
    <SparklesText
      class={css({
        fontSize: '3rem',
        fontWeight: 'bold',
        color: 'foreground',
      })}
    >
      Magic UI
    </SparklesText>
  );
};

// MorphingText Component
export interface MorphingTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  texts: string[];
  duration?: number;
  morphDuration?: number;
}

export const MorphingText: Component<MorphingTextProps> = (props) => {
  const merged = mergeProps(
    {
      duration: 2000,
      morphDuration: 300,
    },
    props
  );

  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  const [displayText, setDisplayText] = createSignal(merged.texts[0] || '');

  const morphToNext = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      const nextIndex = (currentIndex() + 1) % merged.texts.length;
      setCurrentIndex(nextIndex);
      setDisplayText(merged.texts[nextIndex]);
      setIsTransitioning(false);
    }, merged.morphDuration / 2);
  };

  onMount(() => {
    const interval = setInterval(morphToNext, merged.duration);
    return () => clearInterval(interval);
  });

  return (
    <span
      class={css(
        {
          display: 'inline-block',
          transform: isTransitioning() ? 'scale(0.95)' : 'scale(1)',
          opacity: isTransitioning() ? 0.7 : 1,
          filter: isTransitioning() ? 'blur(2px)' : 'blur(0px)',
          transition: `all ${merged.morphDuration}ms ease-in-out`,
        },
        merged.class
      )}
      style={merged.style}
    >
      {displayText()}
    </span>
  );
};

export const MorphingTextDemo: Component = () => {
  const texts = [
    'Hello',
    'Morphing',
    'Text',
    'Animation',
    'SolidJS',
    'Component',
    'Smooth',
    'Transition',
    'Engaging',
  ];

  return (
    <MorphingText
      texts={texts}
      class={css({
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'foreground',
      })}
    />
  );
};

// SpinningText Component
export interface SpinningTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children: string;
  radius?: number;
  duration?: number;
  reverse?: boolean;
  fontSize?: string;
}

export const SpinningText: Component<SpinningTextProps> = (props) => {
  const merged = mergeProps(
    {
      radius: 5,
      duration: 10,
      reverse: false,
      fontSize: '1rem',
    },
    props
  );

  const characters = props.children.split('');
  const angleStep = 360 / characters.length;

  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'inline-block',
          width: `${merged.radius * 2}rem`,
          height: `${merged.radius * 2}rem`,
          animation: `spin ${merged.duration}s linear infinite`,
          animationDirection: merged.reverse ? 'reverse' : 'normal',

          '@keyframes spin': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        },
        merged.class
      )}
      style={merged.style}
    >
      <For each={characters}>
        {(char, index) => (
          <span
            class={css({
              position: 'absolute',
              left: '50%',
              top: '50%',
              fontSize: merged.fontSize,
              transformOrigin: '0 0',
              animation: `counterSpin ${merged.duration}s linear infinite`,
              animationDirection: merged.reverse ? 'normal' : 'reverse',

              '@keyframes counterSpin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(-360deg)',
                },
              },
            })}
            style={{
              transform: `rotate(${index() * angleStep}deg) translate(${merged.radius}rem) rotate(${merged.reverse ? '' : '-'}${index() * angleStep}deg)`,
            }}
          >
            {char}
          </span>
        )}
      </For>
    </div>
  );
};

export const SpinningTextBasic: Component = () => {
  return (
    <SpinningText
      class={css({
        fontSize: '1rem',
      })}
    >
      learn more • earn more • grow more •
    </SpinningText>
  );
};

export const SpinningTextReverse: Component = () => {
  return (
    <SpinningText
      reverse
      class={css({
        fontSize: '2.25rem',
      })}
      duration={4}
      radius={6}
    >
      learn more • earn more • grow more •
    </SpinningText>
  );
};

export type { BoxRevealProps, SparklesTextProps, MorphingTextProps, SpinningTextProps };
