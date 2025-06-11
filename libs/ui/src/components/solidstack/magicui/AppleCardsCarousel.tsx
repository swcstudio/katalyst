import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  For,
  type JSX,
  Show,
  children,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

export interface CardData {
  category: string;
  title: string;
  src: string;
  content: JSX.Element;
}

export interface CardProps {
  card: CardData;
  index: number;
  className?: string;
}

export interface CarouselProps {
  items: JSX.Element[];
  className?: string;
}

export const Card: Component<CardProps> = (props) => {
  const merged = mergeProps({}, props);
  const [isHovered, setIsHovered] = createSignal(false);

  return (
    <div
      class={css(
        {
          position: 'relative',
          minWidth: '300px',
          height: '400px',
          borderRadius: '2xl',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: isHovered() ? 'scale(1.05)' : 'scale(1)',
          _hover: {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        },
        merged.className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={merged.card.src}
        alt={merged.card.title}
        class={css({
          width: 'full',
          height: 'full',
          objectFit: 'cover',
          position: 'absolute',
          inset: 0,
        })}
      />
      <div
        class={css({
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '6',
        })}
      >
        <div
          class={css({
            color: 'white',
            marginBottom: '2',
          })}
        >
          <div
            class={css({
              fontSize: 'sm',
              fontWeight: 'medium',
              opacity: 0.8,
              marginBottom: '1',
            })}
          >
            {merged.card.category}
          </div>
          <h3
            class={css({
              fontSize: 'xl',
              fontWeight: 'bold',
              lineHeight: 'tight',
            })}
          >
            {merged.card.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export const Carousel: Component<CarouselProps> = (props) => {
  const merged = mergeProps({}, props);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  let containerRef: HTMLDivElement;

  const scrollToIndex = (index: number) => {
    if (containerRef) {
      const cardWidth = 320; // Approximate card width including margins
      containerRef.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const nextCard = () => {
    const nextIndex = (currentIndex() + 1) % merged.items.length;
    scrollToIndex(nextIndex);
  };

  const prevCard = () => {
    const prevIndex = (currentIndex() - 1 + merged.items.length) % merged.items.length;
    scrollToIndex(prevIndex);
  };

  return (
    <div
      class={css({
        position: 'relative',
        width: 'full',
        marginTop: '8',
      })}
    >
      {/* Navigation buttons */}
      <button
        onClick={prevCard}
        class={css({
          position: 'absolute',
          left: '4',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '12',
          height: '12',
          borderRadius: 'full',
          backgroundColor: 'white',
          border: '2px solid',
          borderColor: 'gray.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          _hover: {
            backgroundColor: 'gray.50',
            borderColor: 'gray.300',
          },
        })}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={nextCard}
        class={css({
          position: 'absolute',
          right: '4',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '12',
          height: '12',
          borderRadius: 'full',
          backgroundColor: 'white',
          border: '2px solid',
          borderColor: 'gray.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          _hover: {
            backgroundColor: 'gray.50',
            borderColor: 'gray.300',
          },
        })}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Carousel container */}
      <div
        ref={containerRef!}
        class={css({
          display: 'flex',
          gap: '5',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          paddingX: '8',
          paddingY: '4',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        })}
      >
        <For each={merged.items}>{(item) => <div class={css({ flexShrink: 0 })}>{item}</div>}</For>
      </div>

      {/* Indicators */}
      <div
        class={css({
          display: 'flex',
          justifyContent: 'center',
          gap: '2',
          marginTop: '6',
        })}
      >
        <For each={merged.items}>
          {(_, index) => (
            <button
              onClick={() => scrollToIndex(index())}
              class={css({
                width: index() === currentIndex() ? '8' : '2',
                height: '2',
                borderRadius: 'full',
                backgroundColor: index() === currentIndex() ? 'blue.500' : 'gray.300',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                _hover: {
                  backgroundColor: index() === currentIndex() ? 'blue.600' : 'gray.400',
                },
              })}
            />
          )}
        </For>
      </div>
    </div>
  );
};

const DummyContent: Component = () => {
  return (
    <>
      <For each={Array.from({ length: 3 }, (_, i) => i)}>
        {(index) => (
          <div
            class={css({
              backgroundColor: '#F5F5F7',
              padding: '8',
              borderRadius: '3xl',
              marginBottom: '4',
              _md: {
                padding: '14',
              },
              _dark: {
                backgroundColor: 'neutral.800',
              },
            })}
          >
            <p
              class={css({
                color: 'neutral.600',
                fontSize: 'base',
                fontFamily: 'sans',
                maxWidth: '3xl',
                marginX: 'auto',
                _md: {
                  fontSize: '2xl',
                },
                _dark: {
                  color: 'neutral.400',
                },
              })}
            >
              <span
                class={css({
                  fontWeight: 'bold',
                  color: 'neutral.700',
                  _dark: {
                    color: 'neutral.200',
                  },
                })}
              >
                The first rule of Apple club is that you boast about Apple club.
              </span>{' '}
              Keep a journal, quickly jot down a grocery list, and take amazing class notes. Want to
              convert those notes to text? No problem. Langotiya jeetu ka mara hua yaar is ready to
              capture every thought.
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              class={css({
                height: 'full',
                width: 'full',
                marginX: 'auto',
                objectFit: 'contain',
                _md: {
                  width: '1/2',
                  height: '1/2',
                },
              })}
            />
          </div>
        )}
      </For>
    </>
  );
};

export interface AppleCardsCarouselDemoProps {
  className?: string;
}

export const AppleCardsCarouselDemo: Component<AppleCardsCarouselDemoProps> = (props) => {
  const data: CardData[] = [
    {
      category: 'Artificial Intelligence',
      title: 'You can do more with AI.',
      src: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: <DummyContent />,
    },
    {
      category: 'Productivity',
      title: 'Enhance your productivity.',
      src: 'https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: <DummyContent />,
    },
    {
      category: 'Product',
      title: 'Launching the new Apple Vision Pro.',
      src: 'https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: <DummyContent />,
    },
    {
      category: 'Product',
      title: 'Maps for your iPhone 15 Pro Max.',
      src: 'https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: <DummyContent />,
    },
    {
      category: 'iOS',
      title: 'Photography just got better.',
      src: 'https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: <DummyContent />,
    },
    {
      category: 'Hiring',
      title: 'Hiring for a Staff Software Engineer',
      src: 'https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: <DummyContent />,
    },
  ];

  const cards = data.map((card, index) => <Card card={card} index={index} />);

  return (
    <div
      class={css(
        {
          width: 'full',
          height: 'full',
          paddingY: '20',
        },
        props.className
      )}
    >
      <h2
        class={css({
          maxWidth: '7xl',
          paddingLeft: '4',
          marginX: 'auto',
          fontSize: 'xl',
          fontWeight: 'bold',
          color: 'neutral.800',
          fontFamily: 'sans',
          _md: {
            fontSize: '5xl',
          },
          _dark: {
            color: 'neutral.200',
          },
        })}
      >
        Get to know your iSad.
      </h2>
      <Carousel items={cards} />
    </div>
  );
};

export default AppleCardsCarouselDemo;
