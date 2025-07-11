import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, createSignal, mergeProps, onCleanup, onMount } from 'solid-js';

export interface TypingAnimationProps {
  text: string | string[];
  className?: string;
  style?: JSX.CSSProperties;
  duration?: number;
  delay?: number;
  cursor?: boolean;
  cursorColor?: string;
  cursorChar?: string;
  loop?: boolean;
  speed?: 'slow' | 'medium' | 'fast' | number;
  as?: keyof JSX.IntrinsicElements;
  startOnView?: boolean;
  pauseTime?: number;
  deleteSpeed?: number;
  showDeleteAnimation?: boolean;
}

const TypingAnimation: Component<TypingAnimationProps> = (props) => {
  const merged = mergeProps(
    {
      duration: 2000,
      delay: 0,
      cursor: true,
      cursorColor: 'currentColor',
      cursorChar: '|',
      loop: false,
      speed: 'medium' as const,
      as: 'div' as const,
      startOnView: false,
      pauseTime: 1000,
      deleteSpeed: 50,
      showDeleteAnimation: false,
    },
    props
  );

  const [displayText, setDisplayText] = createSignal('');
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [currentStringIndex, setCurrentStringIndex] = createSignal(0);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(!merged.startOnView);
  const [elementRef, setElementRef] = createSignal<HTMLElement>();

  const Dynamic = merged.as as any;
  const texts = Array.isArray(merged.text) ? merged.text : [merged.text];

  let timeoutId: number;
  let observer: IntersectionObserver;

  const getSpeed = () => {
    if (typeof merged.speed === 'number') return merged.speed;

    switch (merged.speed) {
      case 'slow':
        return 150;
      case 'fast':
        return 50;
      default:
        return 100;
    }
  };

  const startTyping = () => {
    const currentText = texts[currentStringIndex()];
    const currentChar = currentIndex();

    if (!isDeleting()) {
      if (currentChar < currentText.length) {
        setDisplayText(currentText.substring(0, currentChar + 1));
        setCurrentIndex(currentChar + 1);
        timeoutId = setTimeout(startTyping, getSpeed());
      } else {
        // Finished typing current string
        if (texts.length > 1 && merged.showDeleteAnimation) {
          // Pause before deleting
          timeoutId = setTimeout(() => {
            setIsDeleting(true);
            startTyping();
          }, merged.pauseTime);
        } else if (merged.loop && texts.length === 1) {
          // Loop single text
          timeoutId = setTimeout(() => {
            setCurrentIndex(0);
            setDisplayText('');
            startTyping();
          }, merged.pauseTime);
        } else if (texts.length > 1) {
          // Move to next string without deleting
          timeoutId = setTimeout(() => {
            const nextIndex = (currentStringIndex() + 1) % texts.length;
            setCurrentStringIndex(nextIndex);
            setCurrentIndex(0);
            setDisplayText('');
            if (nextIndex === 0 && !merged.loop) return;
            startTyping();
          }, merged.pauseTime);
        }
      }
    } else {
      // Deleting
      if (currentChar > 0) {
        setDisplayText(currentText.substring(0, currentChar - 1));
        setCurrentIndex(currentChar - 1);
        timeoutId = setTimeout(startTyping, merged.deleteSpeed);
      } else {
        // Finished deleting
        setIsDeleting(false);
        const nextIndex = (currentStringIndex() + 1) % texts.length;
        setCurrentStringIndex(nextIndex);

        if (nextIndex === 0 && !merged.loop) return;

        timeoutId = setTimeout(startTyping, getSpeed());
      }
    }
  };

  onMount(() => {
    if (merged.startOnView) {
      const element = elementRef();
      if (element && typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(element);
      }
    }

    if (isVisible()) {
      timeoutId = setTimeout(() => {
        startTyping();
      }, merged.delay);
    }
  });

  onCleanup(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (observer) {
      observer.disconnect();
    }
  });

  return (
    <Dynamic
      ref={setElementRef}
      class={css(
        {
          display: 'inline-block',
          fontFamily: 'monospace',
        },
        merged.className
      )}
      style={merged.style}
    >
      <span>{displayText()}</span>
      {merged.cursor && (
        <span
          class={css({
            display: 'inline-block',
            marginLeft: '2px',
            color: merged.cursorColor,
            animation: 'cursor-blink 1s infinite',
          })}
        >
          {merged.cursorChar}
        </span>
      )}

      <style>{`
        @keyframes cursor-blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </Dynamic>
  );
};

export default TypingAnimation;
