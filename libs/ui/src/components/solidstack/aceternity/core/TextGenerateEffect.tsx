import { css } from '@sse/ui/styled-system/css';
import { type Component, createEffect, createSignal, For, onCleanup } from 'solid-js';

export interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  mode?: 'words' | 'characters' | 'lines';
  delay?: number;
  staggerDelay?: number;
  onComplete?: () => void;
}

interface AnimatedWord {
  text: string;
  isVisible: boolean;
  index: number;
}

interface AnimatedCharacter {
  char: string;
  isVisible: boolean;
  index: number;
  wordIndex: number;
}

export const TextGenerateEffect: Component<TextGenerateEffectProps> = (props) => {
  const [animatedWords, setAnimatedWords] = createSignal<AnimatedWord[]>([]);
  const [animatedCharacters, setAnimatedCharacters] = createSignal<AnimatedCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isComplete, setIsComplete] = createSignal(false);

  const config = {
    filter: props.filter !== false,
    duration: props.duration || 1,
    mode: props.mode || 'words',
    delay: props.delay || 0,
    staggerDelay: props.staggerDelay || 0.1,
  };

  const words = () => props.words.split(' ');
  const totalItems = () => {
    if (config.mode === 'words') return words().length;
    if (config.mode === 'characters') return props.words.replace(/\s/g, '').length;
    return words().length; // fallback to words
  };

  // Initialize animated items
  createEffect(() => {
    if (config.mode === 'words') {
      const wordsArray = words().map((word, index) => ({
        text: word,
        isVisible: false,
        index,
      }));
      setAnimatedWords(wordsArray);
    } else if (config.mode === 'characters') {
      const chars: AnimatedCharacter[] = [];
      let charIndex = 0;
      words().forEach((word, wordIndex) => {
        word.split('').forEach((char) => {
          chars.push({
            char,
            isVisible: false,
            index: charIndex++,
            wordIndex,
          });
        });
        // Add space after each word (except the last)
        if (wordIndex < words().length - 1) {
          chars.push({
            char: ' ',
            isVisible: false,
            index: charIndex++,
            wordIndex,
          });
        }
      });
      setAnimatedCharacters(chars);
    }
  });

  // Animation logic
  createEffect(() => {
    if (isComplete()) return;

    const totalCount = totalItems();
    if (totalCount === 0) return;

    const baseInterval = (config.duration * 1000) / totalCount;
    const interval = Math.max(baseInterval, 50); // Minimum 50ms between animations

    const timer = setTimeout(
      () => {
        const current = currentIndex();

        if (current < totalCount) {
          if (config.mode === 'words') {
            setAnimatedWords((prev) =>
              prev.map((word, index) => (index === current ? { ...word, isVisible: true } : word))
            );
          } else if (config.mode === 'characters') {
            setAnimatedCharacters((prev) =>
              prev.map((char, index) => (index === current ? { ...char, isVisible: true } : char))
            );
          }

          setCurrentIndex(current + 1);
        } else {
          setIsComplete(true);
          props.onComplete?.();
        }
      },
      interval + currentIndex() * config.staggerDelay * 1000 + config.delay * 1000
    );

    onCleanup(() => clearTimeout(timer));
  });

  const getWordStyles = (word: AnimatedWord) => {
    return css({
      opacity: word.isVisible ? 1 : 0,
      filter: config.filter && !word.isVisible ? 'blur(2px)' : 'none',
      transform: word.isVisible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-block',
      marginRight: '0.25rem',
      animation: word.isVisible ? 'fadeInUp 0.3s ease-out' : 'none',
    });
  };

  const getCharStyles = (char: AnimatedCharacter) => {
    return css({
      opacity: char.isVisible ? 1 : 0,
      filter: config.filter && !char.isVisible ? 'blur(1px)' : 'none',
      transform: char.isVisible ? 'translateY(0)' : 'translateY(5px)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-block',
      animation: char.isVisible ? 'fadeInUp 0.2s ease-out' : 'none',
    });
  };

  return (
    <div
      class={css(
        {
          fontSize: 'lg',
          lineHeight: 'relaxed',
          color: 'gray.700',
          _dark: { color: 'gray.300' },
        },
        props.className
      )}
    >
      {config.mode === 'words' && (
        <For each={animatedWords()}>
          {(word) => <span class={getWordStyles(word)}>{word.text}</span>}
        </For>
      )}

      {config.mode === 'characters' && (
        <For each={animatedCharacters()}>
          {(char) => <span class={getCharStyles(char)}>{char.char}</span>}
        </For>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TextGenerateEffect;
