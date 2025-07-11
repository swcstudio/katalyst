import { css, cx } from '@sse/ui/styled-system/css';
import { animate } from 'motion';
import { type Component, createSignal, For, JSX, onCleanup, onMount } from 'solid-js';

export interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
}

export interface InfiniteMovingCardsProps {
  items: TestimonialItem[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCardsDemo: Component = () => {
  return (
    <div
      class={css({
        height: '640px',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        _dark: {
          backgroundColor: 'black',
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.05,
        },
      })}
    >
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  );
};

export const InfiniteMovingCards: Component<InfiniteMovingCardsProps> = (props) => {
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const [scrollerRef, setScrollerRef] = createSignal<HTMLUListElement>();
  const [start, setStart] = createSignal(false);

  const direction = () => props.direction || 'left';
  const speed = () => props.speed || 'fast';
  const pauseOnHover = () => props.pauseOnHover ?? true;

  const getSpeed = () => {
    switch (speed()) {
      case 'fast':
        return '20s';
      case 'normal':
        return '40s';
      case 'slow':
        return '80s';
      default:
        return '40s';
    }
  };

  const getDirection = () => {
    return direction() === 'left' ? 'forwards' : 'reverse';
  };

  const addAnimation = () => {
    const container = containerRef();
    const scroller = scrollerRef();

    if (container && scroller) {
      const scrollerContent = Array.from(scroller.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scroller.appendChild(duplicatedItem);
      });

      setStart(true);
    }
  };

  onMount(() => {
    addAnimation();
  });

  return (
    <div
      ref={setContainerRef}
      class={cx(
        css({
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
          WebkitMask: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
        }),
        props.className
      )}
    >
      <ul
        ref={setScrollerRef}
        class={css({
          display: 'flex',
          minWidth: '100%',
          flexShrink: 0,
          gap: '16px',
          paddingY: '16px',
          width: 'max-content',
          flexDirection: 'row',
          animation: start() ? `scroll ${getSpeed()} linear infinite ${getDirection()}` : 'none',
          _hover: pauseOnHover() ? { animationPlayState: 'paused' } : {},
        })}
      >
        <For each={props.items}>
          {(item, index) => (
            <li
              class={css({
                width: '350px',
                maxWidth: 'none',
                position: 'relative',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'gray.300',
                paddingX: '32px',
                paddingY: '24px',
                backgroundColor: 'white',
                flexShrink: 0,
                md: { width: '450px' },
                _dark: {
                  borderColor: 'gray.800',
                  backgroundColor: 'gray.950',
                },
              })}
            >
              <blockquote>
                <div
                  aria-hidden="true"
                  class={css({
                    userSelect: 'none',
                    pointerEvents: 'none',
                    position: 'absolute',
                    inset: 0,
                  })}
                />
                <span
                  class={css({
                    position: 'relative',
                    zIndex: 20,
                    fontSize: 'sm',
                    lineHeight: '1.6',
                    color: 'gray.700',
                    fontWeight: 'normal',
                    _dark: { color: 'gray.100' },
                  })}
                >
                  {item.quote}
                </span>
                <div
                  class={css({
                    position: 'relative',
                    zIndex: 20,
                    marginTop: '24px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  })}
                >
                  <span
                    class={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    })}
                  >
                    <span
                      class={css({
                        fontSize: 'sm',
                        lineHeight: '1.6',
                        color: 'gray.700',
                        fontWeight: 'normal',
                        _dark: { color: 'gray.100' },
                      })}
                    >
                      {item.name}
                    </span>
                    <span
                      class={css({
                        fontSize: 'sm',
                        lineHeight: '1.6',
                        color: 'gray.500',
                        fontWeight: 'normal',
                        _dark: { color: 'gray.400' },
                      })}
                    >
                      {item.title}
                    </span>
                  </span>
                </div>
              </blockquote>
            </li>
          )}
        </For>
      </ul>

      <style>
        {`
          @keyframes scroll {
            to {
              transform: translate(calc(-50% - 0.5rem));
            }
          }
        `}
      </style>
    </div>
  );
};

const testimonials: TestimonialItem[] = [
  {
    quote:
      'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.',
    name: 'Charles Dickens',
    title: 'A Tale of Two Cities',
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: 'William Shakespeare',
    title: 'Hamlet',
  },
  {
    quote: 'All that we see or seem is but a dream within a dream.',
    name: 'Edgar Allan Poe',
    title: 'A Dream Within a Dream',
  },
  {
    quote:
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    name: 'Jane Austen',
    title: 'Pride and Prejudice',
  },
  {
    quote:
      'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.',
    name: 'Herman Melville',
    title: 'Moby-Dick',
  },
];

export default InfiniteMovingCardsDemo;
