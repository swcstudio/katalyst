import { css } from '@sse/ui/styled-system/css';
import { type Component, createEffect, createSignal, For, onCleanup } from 'solid-js';

interface WordType {
  text: string;
  className?: string;
}

// Placeholder TypewriterEffectSmooth component
const TypewriterEffectSmooth: Component<{
  words: WordType[];
  className?: string;
  cursorClassName?: string;
}> = (props) => {
  const [displayedText, setDisplayedText] = createSignal('');
  const [currentWordIndex, setCurrentWordIndex] = createSignal(0);
  const [currentCharIndex, setCurrentCharIndex] = createSignal(0);

  createEffect(() => {
    const words = props.words;
    let wordIndex = 0;
    let charIndex = 0;
    let currentText = '';

    const typeWriter = () => {
      if (wordIndex < words.length) {
        const currentWord = words[wordIndex].text;
        if (charIndex < currentWord.length) {
          currentText += currentWord[charIndex];
          setDisplayedText(currentText + (charIndex < currentWord.length - 1 ? '' : ' '));
          charIndex++;
          setTimeout(typeWriter, 100);
        } else {
          wordIndex++;
          charIndex = 0;
          currentText += ' ';
          setTimeout(typeWriter, 200);
        }
      }
    };

    typeWriter();
  });

  return (
    <div
      class={css(
        {
          fontSize: '4xl',
          fontWeight: 'bold',
          textAlign: 'center',
          md: { fontSize: '6xl' },
        },
        props.className
      )}
    >
      <For each={props.words}>
        {(word, index) => (
          <span
            class={css({
              color: word.className?.includes('text-blue-500') ? 'blue.500' : 'inherit',
              _dark: {
                color: word.className?.includes('text-blue-500') ? 'blue.500' : 'inherit',
              },
            })}
          >
            {word.text}
          </span>
        )}
      </For>
      <span
        class={css({
          animation: 'blink 1s infinite',
          marginLeft: '1',
        })}
      >
        |
      </span>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Placeholder TypewriterEffect component
const TypewriterEffect: Component<{
  words: WordType[];
  className?: string;
  cursorClassName?: string;
}> = (props) => {
  const [displayedWords, setDisplayedWords] = createSignal<string[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);

  createEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex() < props.words.length) {
        setDisplayedWords((prev) => [...prev, props.words[currentIndex()].text]);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 500);

    onCleanup(() => clearInterval(timer));
  });

  return (
    <div
      class={css(
        {
          fontSize: '4xl',
          fontWeight: 'bold',
          textAlign: 'center',
          md: { fontSize: '6xl' },
        },
        props.className
      )}
    >
      <For each={displayedWords()}>
        {(word, index) => {
          const wordData = props.words[index()];
          return (
            <span
              class={css({
                color: wordData?.className?.includes('text-blue-500') ? 'blue.500' : 'inherit',
                _dark: {
                  color: wordData?.className?.includes('text-blue-500') ? 'blue.500' : 'inherit',
                },
                marginRight: '2',
                opacity: 0,
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: `${index() * 0.1}s`,
              })}
            >
              {word}
            </span>
          );
        }}
      </For>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export const TypewriterEffectSmoothDemo: Component = () => {
  const words: WordType[] = [
    { text: 'Build' },
    { text: 'awesome' },
    { text: 'apps' },
    { text: 'with' },
    { text: 'Aceternity.', className: 'text-blue-500 dark:text-blue-500' },
  ];

  return (
    <div
      class={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40rem',
      })}
    >
      <p
        class={css({
          color: 'gray.600',
          fontSize: 'xs',
          sm: { fontSize: 'base' },
          _dark: { color: 'gray.200' },
        })}
      >
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          spaceX: '0',
          md: {
            flexDirection: 'row',
            spaceY: '0',
            spaceX: '4',
          },
        })}
      >
        <button
          class={css({
            width: '40',
            height: '10',
            borderRadius: 'xl',
            backgroundColor: 'black',
            border: '1px solid transparent',
            color: 'white',
            fontSize: 'sm',
            _dark: {
              border: '1px solid white',
            },
          })}
        >
          Join now
        </button>
        <button
          class={css({
            width: '40',
            height: '10',
            borderRadius: 'xl',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid black',
            fontSize: 'sm',
          })}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export const TypewriterEffectDemo: Component = () => {
  const words: WordType[] = [
    { text: 'Build' },
    { text: 'awesome' },
    { text: 'apps' },
    { text: 'with' },
    { text: 'Aceternity.', className: 'text-blue-500 dark:text-blue-500' },
  ];

  return (
    <div
      class={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40rem',
      })}
    >
      <p
        class={css({
          color: 'gray.600',
          fontSize: 'base',
          marginBottom: '10',
          _dark: { color: 'gray.200' },
        })}
      >
        The road to freedom starts from here
      </p>
      <TypewriterEffect words={words} />
      <div
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          marginTop: '10',
          spaceX: '0',
          md: {
            flexDirection: 'row',
            spaceY: '0',
            spaceX: '4',
          },
        })}
      >
        <button
          class={css({
            width: '40',
            height: '10',
            borderRadius: 'xl',
            backgroundColor: 'black',
            border: '1px solid transparent',
            color: 'white',
            fontSize: 'sm',
            _dark: {
              border: '1px solid white',
            },
          })}
        >
          Join now
        </button>
        <button
          class={css({
            width: '40',
            height: '10',
            borderRadius: 'xl',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid black',
            fontSize: 'sm',
          })}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default TypewriterEffectDemo;
