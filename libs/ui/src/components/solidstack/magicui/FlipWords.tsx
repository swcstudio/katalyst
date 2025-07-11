import { css, cx } from '@sse/ui/styled-system/css';
import { animate } from 'motion';
import { type Component, createSignal, For, JSX, onCleanup, onMount } from 'solid-js';

export interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const FlipWordsDemo: Component = () => {
  const words = ['better', 'cute', 'beautiful', 'modern'];

  return (
    <div
      class={css({
        height: '640px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingX: '16px',
      })}
    >
      <div
        class={css({
          fontSize: '4xl',
          marginX: 'auto',
          fontWeight: 'normal',
          color: 'neutral.600',
          _dark: { color: 'neutral.400' },
        })}
      >
        Build <FlipWords words={words} />
        <br />
        websites with Aceternity UI
      </div>
    </div>
  );
};

export const FlipWords: Component<FlipWordsProps> = (props) => {
  const [currentWord, setCurrentWord] = createSignal(0);
  const [isAnimating, setIsAnimating] = createSignal(false);

  const duration = () => props.duration || 3000;
  let intervalId: number;
  const wordRefs: HTMLSpanElement[] = [];

  const animateWord = (wordIndex: number, isEntering: boolean) => {
    const element = wordRefs[wordIndex];
    if (!element) return;

    if (isEntering) {
      animate(
        element,
        {
          y: [50, 0],
          opacity: [0, 1],
          rotateX: [90, 0],
        },
        {
          duration: 0.4,
          easing: [0.16, 1, 0.3, 1],
        }
      );
    } else {
      animate(
        element,
        {
          y: [0, -50],
          opacity: [1, 0],
          rotateX: [0, -90],
        },
        {
          duration: 0.4,
          easing: [0.16, 1, 0.3, 1],
        }
      );
    }
  };

  const nextWord = () => {
    if (isAnimating()) return;

    setIsAnimating(true);
    const current = currentWord();

    // Animate current word out
    animateWord(current, false);

    setTimeout(() => {
      const next = (current + 1) % props.words.length;
      setCurrentWord(next);

      // Animate new word in
      setTimeout(() => {
        animateWord(next, true);
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  onMount(() => {
    // Initial animation for first word
    setTimeout(() => {
      animateWord(0, true);
    }, 100);

    intervalId = setInterval(nextWord, duration());

    onCleanup(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });
  });

  return (
    <span
      class={cx(
        css({
          display: 'inline-block',
          position: 'relative',
          color: 'blue.600',
          fontWeight: '600',
          _dark: { color: 'blue.400' },
        }),
        props.className
      )}
    >
      <For each={props.words}>
        {(word, index) => (
          <span
            ref={(el) => (wordRefs[index()] = el)}
            class={css({
              position: 'absolute',
              left: 0,
              top: 0,
              opacity: index() === currentWord() ? 1 : 0,
              transformStyle: 'preserve-3d',
              whiteSpace: 'nowrap',
            })}
            style={{
              display: index() === currentWord() ? 'inline-block' : 'none',
            }}
          >
            {word}
          </span>
        )}
      </For>
      <span
        class={css({
          visibility: 'hidden',
          whiteSpace: 'nowrap',
        })}
      >
        {props.words[currentWord()]}
      </span>
    </span>
  );
};

export default FlipWordsDemo;
