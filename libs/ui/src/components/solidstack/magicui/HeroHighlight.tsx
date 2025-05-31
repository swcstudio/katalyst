import { Component, JSX, createSignal, onMount } from 'solid-js';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { animate } from 'motion';

export interface HeroHighlightProps {
  children: JSX.Element;
  className?: string;
}

export interface HighlightProps {
  children: JSX.Element;
  className?: string;
}

export const HeroHighlightDemo: Component = () => {
  const [textRef, setTextRef] = createSignal<HTMLHeadingElement>();

  onMount(() => {
    const element = textRef();
    if (element) {
      const words = element.querySelectorAll('.hero-word');
      words.forEach((word, index) => {
        animate(
          word,
          {
            opacity: [0, 1],
            filter: ['blur(4px)', 'blur(0px)'],
            y: [20, -5, 0],
          },
          {
            duration: 0.5,
            delay: index * 0.1,
            easing: [0.4, 0.0, 0.2, 1],
          }
        );
      });
    }
  });

  return (
    <HeroHighlight>
      <h1
        ref={setTextRef}
        class={css({
          fontSize: '2xl',
          paddingX: '16px',
          fontWeight: 'bold',
          color: 'neutral.700',
          maxWidth: '1024px',
          lineHeight: 'relaxed',
          textAlign: 'center',
          marginX: 'auto',
          md: { fontSize: '4xl' },
          lg: { fontSize: '5xl', lineHeight: 'snug' },
          _dark: { color: 'white' }
        })}
      >
        {"With insomnia, nothing's real. Everything is far away. Everything is a"
          .split(" ")
          .map((word, index) => (
            <span key={index} class="hero-word mr-2 inline-block opacity-0">
              {word}
            </span>
          ))}{' '}
        <Highlight className={css({ color: 'black', _dark: { color: 'white' } })}>
          <span class="hero-word inline-block opacity-0">copy, of a copy, of a copy.</span>
        </Highlight>
      </h1>
    </HeroHighlight>
  );
};

export const HeroHighlight: Component<HeroHighlightProps> = (props) => {
  return (
    <div
      class={cx(
        css({
          position: 'relative',
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          overflow: 'hidden',
          _dark: { backgroundColor: 'black' },
          _before: {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.3), transparent 50%)',
            filter: 'blur(40px)',
            opacity: 0.7,
            _dark: {
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.15), transparent 50%)'
            }
          },
          _after: {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(90deg, transparent 79px, rgba(255, 255, 255, 0.03) 81px, transparent 82px),
              linear-gradient(rgba(255, 255, 255, 0.03) 0.5px, transparent 0.5px)
            `,
            backgroundSize: '80px 80px',
            _dark: {
              backgroundImage: `
                linear-gradient(90deg, transparent 79px, rgba(255, 255, 255, 0.03) 81px, transparent 82px),
                linear-gradient(rgba(255, 255, 255, 0.03) 0.5px, transparent 0.5px)
              `
            }
          }
        }),
        props.className
      )}
    >
      <div class={css({ position: 'relative', zIndex: 10 })}>
        {props.children}
      </div>
    </div>
  );
};

export const Highlight: Component<HighlightProps> = (props) => {
  let highlightRef: HTMLSpanElement;

  onMount(() => {
    if (highlightRef) {
      animate(
        highlightRef,
        {
          backgroundSize: ['0% 100%', '100% 100%'],
        },
        {
          duration: 2,
          delay: 1,
          easing: 'ease-out',
        }
      );
    }
  });

  return (
    <span
      ref={highlightRef!}
      class={cx(
        css({
          position: 'relative',
          display: 'inline-block',
          paddingX: '4px',
          paddingY: '2px',
          backgroundImage: 'linear-gradient(120deg, rgba(120, 119, 198, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '0% 100%',
          backgroundPosition: 'left',
          borderRadius: '4px',
          _dark: {
            backgroundImage: 'linear-gradient(120deg, rgba(120, 119, 198, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
          }
        }),
        props.className
      )}
    >
      {props.children}
    </span>
  );
};

export default HeroHighlightDemo;