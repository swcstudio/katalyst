import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  For,
  JSX,
  Show,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

export interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
  autoPlay?: boolean;
  speed?: number;
}

export const AnimatedTestimonials: Component<AnimatedTestimonialsProps> = (props) => {
  const merged = mergeProps(
    {
      autoPlay: true,
      speed: 5000,
    },
    props
  );

  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isAnimating, setIsAnimating] = createSignal(false);
  let intervalId: number;

  const nextTestimonial = () => {
    if (isAnimating()) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % merged.testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevTestimonial = () => {
    if (isAnimating()) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + merged.testimonials.length) % merged.testimonials.length
      );
      setIsAnimating(false);
    }, 300);
  };

  const goToTestimonial = (index: number) => {
    if (isAnimating() || index === currentIndex()) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  onMount(() => {
    if (merged.autoPlay) {
      intervalId = setInterval(nextTestimonial, merged.speed);
    }
  });

  onCleanup(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  const currentTestimonial = () => merged.testimonials[currentIndex()];

  return (
    <div
      class={css(
        {
          maxWidth: '4xl',
          marginX: 'auto',
          padding: '8',
          position: 'relative',
        },
        merged.className
      )}
    >
      <div
        class={css({
          position: 'relative',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        {/* Main testimonial content */}
        <div
          class={css({
            textAlign: 'center',
            maxWidth: '3xl',
            opacity: isAnimating() ? 0 : 1,
            transform: isAnimating() ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.3s ease-in-out',
          })}
        >
          {/* Avatar */}
          <div
            class={css({
              width: '24',
              height: '24',
              borderRadius: 'full',
              overflow: 'hidden',
              marginX: 'auto',
              marginBottom: '6',
              border: '4px solid',
              borderColor: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            })}
          >
            <img
              src={currentTestimonial()?.src}
              alt={currentTestimonial()?.name}
              class={css({
                width: 'full',
                height: 'full',
                objectFit: 'cover',
              })}
            />
          </div>

          {/* Quote */}
          <blockquote
            class={css({
              fontSize: 'xl',
              lineHeight: 'relaxed',
              fontWeight: 'medium',
              color: 'gray.700',
              marginBottom: '8',
              fontStyle: 'italic',
              _md: {
                fontSize: '2xl',
              },
              _dark: {
                color: 'gray.300',
              },
            })}
          >
            "{currentTestimonial()?.quote}"
          </blockquote>

          {/* Author info */}
          <div
            class={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1',
            })}
          >
            <div
              class={css({
                fontSize: 'lg',
                fontWeight: 'semibold',
                color: 'gray.900',
                _dark: {
                  color: 'white',
                },
              })}
            >
              {currentTestimonial()?.name}
            </div>
            <div
              class={css({
                fontSize: 'sm',
                color: 'gray.600',
                _dark: {
                  color: 'gray.400',
                },
              })}
            >
              {currentTestimonial()?.designation}
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevTestimonial}
          class={css({
            position: 'absolute',
            left: '4',
            top: '50%',
            transform: 'translateY(-50%)',
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
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            _hover: {
              backgroundColor: 'gray.50',
              borderColor: 'gray.300',
            },
            _dark: {
              backgroundColor: 'gray.800',
              borderColor: 'gray.600',
              _hover: {
                backgroundColor: 'gray.700',
              },
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
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={nextTestimonial}
          class={css({
            position: 'absolute',
            right: '4',
            top: '50%',
            transform: 'translateY(-50%)',
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
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            _hover: {
              backgroundColor: 'gray.50',
              borderColor: 'gray.300',
            },
            _dark: {
              backgroundColor: 'gray.800',
              borderColor: 'gray.600',
              _hover: {
                backgroundColor: 'gray.700',
              },
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
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div
        class={css({
          display: 'flex',
          justifyContent: 'center',
          gap: '2',
          marginTop: '8',
        })}
      >
        <For each={merged.testimonials}>
          {(_, index) => (
            <button
              onClick={() => goToTestimonial(index())}
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
                _dark: {
                  backgroundColor: index() === currentIndex() ? 'blue.400' : 'gray.600',
                },
              })}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export interface AnimatedTestimonialsDemoProps {
  className?: string;
}

export const AnimatedTestimonialsDemo: Component<AnimatedTestimonialsDemoProps> = (props) => {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: 'Sarah Chen',
      designation: 'Product Manager at TechFlow',
      src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: 'Michael Rodriguez',
      designation: 'CTO at InnovateSphere',
      src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: 'Emily Watson',
      designation: 'Operations Director at CloudScale',
      src: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: 'James Kim',
      designation: 'Engineering Lead at DataPro',
      src: 'https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      quote:
        'The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.',
      name: 'Lisa Thompson',
      designation: 'VP of Technology at FutureNet',
      src: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return <AnimatedTestimonials testimonials={testimonials} className={props.className} />;
};

export default AnimatedTestimonialsDemo;
