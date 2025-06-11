import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { type Component, For, JSX, createSignal, onCleanup, onMount } from 'solid-js';

export interface SlideData {
  title: string;
  button: string;
  src: string;
}

export interface CarouselProps {
  slides: SlideData[];
  className?: string;
}

export const CarouselDemo: Component = () => {
  const slideData = [
    {
      title: 'Mystic Mountains',
      button: 'Explore Component',
      src: 'https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Urban Dreams',
      button: 'Explore Component',
      src: 'https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Neon Nights',
      button: 'Explore Component',
      src: 'https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Desert Whispers',
      button: 'Explore Component',
      src: 'https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <div
      class={css({
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        paddingY: '80px',
      })}
    >
      <Carousel slides={slideData} />
    </div>
  );
};

export const Carousel: Component<CarouselProps> = (props) => {
  const [currentSlide, setCurrentSlide] = createSignal(0);
  const [isAutoPlaying, setIsAutoPlaying] = createSignal(true);
  let autoPlayInterval: number;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % props.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + props.slides.length) % props.slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(() => {
      if (isAutoPlaying()) {
        nextSlide();
      }
    }, 5000);
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };

  onMount(() => {
    startAutoPlay();
  });

  onCleanup(() => {
    stopAutoPlay();
  });

  return (
    <div
      class={cx(
        css({
          position: 'relative',
          width: '100%',
          height: '500px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '2xl',
        }),
        props.className
      )}
      onMouseEnter={() => {
        setIsAutoPlaying(false);
        stopAutoPlay();
      }}
      onMouseLeave={() => {
        setIsAutoPlaying(true);
        startAutoPlay();
      }}
    >
      {/* Slides Container */}
      <div
        class={css({
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        })}
      >
        <For each={props.slides}>
          {(slide, index) => (
            <div
              class={css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                opacity: currentSlide() === index() ? 1 : 0,
                transform: `translateX(${(index() - currentSlide()) * 100}%)`,
              })}
            >
              <img
                src={slide.src}
                alt={slide.title}
                class={css({
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                })}
              />

              {/* Overlay */}
              <div
                class={css({
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'end',
                  padding: '32px',
                })}
              >
                <h2
                  class={css({
                    fontSize: '3xl',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '16px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  })}
                >
                  {slide.title}
                </h2>

                <button
                  class={css({
                    backgroundColor: 'white',
                    color: 'black',
                    paddingX: '24px',
                    paddingY: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: 'sm',
                    maxWidth: '200px',
                    transition: 'all 0.3s',
                    _hover: {
                      backgroundColor: 'gray.100',
                      transform: 'translateY(-2px)',
                    },
                  })}
                >
                  {slide.button}
                </button>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        class={css({
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          backdropFilter: 'blur(10px)',
          _hover: {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-50%) scale(1.1)',
          },
        })}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        class={css({
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          backdropFilter: 'blur(10px)',
          _hover: {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-50%) scale(1.1)',
          },
        })}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div
        class={css({
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
        })}
      >
        <For each={props.slides}>
          {(_, index) => (
            <button
              onClick={() => goToSlide(index())}
              class={css({
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: currentSlide() === index() ? 'white' : 'rgba(255, 255, 255, 0.5)',
                _hover: {
                  backgroundColor: 'white',
                  transform: 'scale(1.2)',
                },
              })}
            />
          )}
        </For>
      </div>
    </div>
  );
};
