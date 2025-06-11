import {
  type Component,
  For,
  type JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BackgroundBeams } from '../../../magicui/BackgroundBeams';
import { BlurFade } from '../../../magicui/BlurFade';
import { BorderBeam } from '../../../magicui/BorderBeam';
import { DotPattern } from '../../../magicui/DotPattern';
import { NumberTicker } from '../../../magicui/NumberTicker';
import { TextAnimate } from '../../../magicui/TextAnimate';
import {
  type Testimonial,
  TestimonialSection,
  useTestimonialSection,
} from '../state/useTestimonialSection';

export interface TestimonialSectionProps {
  className?: string;
  style?: JSX.CSSProperties;
  title?: string;
  subtitle?: string;
  badge?: string;
  testimonials: Testimonial[];
  theme?: 'light' | 'dark';
  variant?:
    | 'simple'
    | 'hero'
    | 'split'
    | 'grid'
    | 'masonry'
    | 'carousel'
    | 'featured'
    | 'centered'
    | 'branded';
  layout?: 'grid' | 'masonry' | 'carousel' | 'split' | 'centered';
  animated?: boolean;
  showRatings?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'beams' | 'gradient';
  backgroundImage?: string;
  autoplay?: boolean;
  staggerDelay?: number;
  animationDuration?: number;
  onTestimonialSelect?: (testimonial: Testimonial) => void;
  onAnimationComplete?: () => void;
}

export const TestimonialSection: Component<TestimonialSectionProps> = (props) => {
  const merged = mergeProps(
    {
      theme: 'light' as const,
      variant: 'simple' as const,
      layout: 'grid' as const,
      animated: true,
      showRatings: true,
      backgroundPattern: 'none' as const,
      autoplay: false,
      staggerDelay: 150,
      animationDuration: 2000,
    },
    props
  );

  const [containerRef, setContainerRef] = createSignal<HTMLElement>();
  const [isIntersecting, setIsIntersecting] = createSignal(false);

  const testimonialSection = useTestimonialSection({
    testimonialData: {
      id: 'testimonial-section',
      title: merged.title,
      subtitle: merged.subtitle,
      badge: merged.badge,
      testimonials: merged.testimonials,
      layout: merged.layout,
      theme: merged.theme,
      backgroundPattern: merged.backgroundPattern,
      backgroundImage: merged.backgroundImage,
    },
    theme: merged.theme,
    variant: merged.variant,
    animationDuration: merged.animationDuration,
    staggerDelay: merged.staggerDelay,
    autoplayEnabled: merged.autoplay,
    showRatings: merged.showRatings,
    onTestimonialSelect: (testimonialId) => {
      const testimonial = merged.testimonials.find((t) => t.id === testimonialId);
      if (testimonial && merged.onTestimonialSelect) {
        merged.onTestimonialSelect(testimonial);
      }
    },
    onAnimationComplete: merged.onAnimationComplete,
  });

  // Intersection Observer for triggering animations
  onMount(() => {
    const container = containerRef();
    if (!container || !merged.animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isIntersecting()) {
            setIsIntersecting(true);
            testimonialSection.setVisibility(true);
            testimonialSection.startAnimation();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    onCleanup(() => {
      observer.disconnect();
    });
  });

  const containerClasses = createMemo(() => {
    const baseClasses = css({
      position: 'relative',
      py: '24',
      sm: { py: '32' },
    });

    const themeClasses = (() => {
      switch (merged.variant) {
        case 'hero':
        case 'branded':
          return merged.theme === 'dark'
            ? css({ bg: 'gray.900', color: 'white', overflow: 'hidden' })
            : css({ bg: 'white', color: 'gray.900', overflow: 'hidden' });
        case 'split':
          return css({ bg: 'white', color: 'gray.900' });
        default:
          return merged.theme === 'dark'
            ? css({ bg: 'gray.900', color: 'white' })
            : css({ bg: 'white', color: 'gray.900' });
      }
    })();

    return `${baseClasses} ${themeClasses} ${merged.className || ''}`;
  });

  const StarRating: Component<{ rating: number; animated?: boolean; delay?: number }> = (
    ratingProps
  ) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
      <div
        class={css({
          display: 'flex',
          gap: '1',
          color: merged.theme === 'dark' ? 'yellow.400' : 'indigo.600',
        })}
      >
        <span class={css({ srOnly: true })}>{ratingProps.rating} out of 5 stars</span>
        <For each={stars}>
          {(star, index) => (
            <BlurFade
              delay={(ratingProps.delay || 0) + index() * 0.05}
              inView={isIntersecting() && ratingProps.animated}
            >
              <svg
                class={css({
                  w: '5',
                  h: '5',
                  flexShrink: '0',
                  fill: star <= ratingProps.rating ? 'currentColor' : 'none',
                  stroke: star <= ratingProps.rating ? 'currentColor' : 'currentColor',
                  strokeWidth: star <= ratingProps.rating ? '0' : '1',
                })}
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </BlurFade>
          )}
        </For>
      </div>
    );
  };

  const TestimonialCard: Component<{
    testimonial: Testimonial;
    index: number;
    variant?: string;
  }> = (cardProps) => {
    const [isHovered, setIsHovered] = createSignal(false);

    const cardClasses = createMemo(() => {
      const baseClasses = css({
        position: 'relative',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      });

      const variantClasses = (() => {
        switch (merged.variant) {
          case 'grid':
          case 'masonry':
            return css({
              rounded: '2xl',
              bg: merged.theme === 'dark' ? 'white/5' : 'gray.50',
              p: '6',
              shadow: 'lg',
              ring: '1',
              ringColor: merged.theme === 'dark' ? 'white/10' : 'gray.900/5',
              _hover: {
                bg: merged.theme === 'dark' ? 'white/10' : 'gray.100',
              },
            });
          case 'featured':
            return css({
              rounded: '2xl',
              bg: merged.theme === 'dark' ? 'gray.800' : 'white',
              shadow: 'xl',
              ring: '1',
              ringColor: merged.theme === 'dark' ? 'white/10' : 'gray.900/5',
              overflow: 'hidden',
              _hover: {
                shadow: '2xl',
              },
            });
          case 'branded':
            return css({
              display: 'flex',
              flexDirection: 'column',
              p: '12',
              md: {
                borderR:
                  merged.theme === 'dark'
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(0,0,0,0.1)',
                py: '16',
                pr: '10',
                pl: '0',
              },
            });
          default:
            return css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
            });
        }
      })();

      return `${baseClasses} ${variantClasses}`;
    });

    const quoteClasses = createMemo(() => {
      switch (merged.variant) {
        case 'hero':
        case 'centered':
          return css({
            fontSize: 'xl',
            sm: { fontSize: '2xl' },
            fontWeight: 'semibold',
            letterSpacing: 'tight',
            textAlign: 'center',
            color: merged.theme === 'dark' ? 'white' : 'gray.900',
            lineHeight: '8',
          });
        case 'featured':
          return css({
            fontSize: 'lg',
            fontWeight: 'semibold',
            letterSpacing: 'tight',
            color: merged.theme === 'dark' ? 'white' : 'gray.900',
            p: '6',
            sm: { p: '12', fontSize: 'xl', lineHeight: '8' },
          });
        case 'branded':
          return css({
            fontSize: 'lg',
            fontWeight: 'medium',
            color: merged.theme === 'dark' ? 'white' : 'gray.900',
            md: { flexGrow: '1' },
          });
        default:
          return css({
            fontSize: 'base',
            color: merged.theme === 'dark' ? 'white' : 'gray.900',
            lineHeight: '6',
          });
      }
    });

    return (
      <BlurFade delay={cardProps.index * (merged.staggerDelay / 1000)} inView={isIntersecting()}>
        <div
          class={cardClasses()}
          onMouseEnter={() => {
            setIsHovered(true);
            testimonialSection.hoverTestimonial(cardProps.testimonial.id);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            testimonialSection.unhoverTestimonial();
          }}
          onClick={() => testimonialSection.selectTestimonial(cardProps.testimonial.id)}
        >
          <Show when={(merged.variant === 'grid' || merged.variant === 'featured') && isHovered()}>
            <BorderBeam size={250} duration={12} />
          </Show>

          {/* Quote SVG for certain variants */}
          <Show when={merged.variant === 'branded' || merged.variant === 'split'}>
            <svg
              class={css({
                position: 'absolute',
                top: '0',
                left: '0',
                w: '8',
                h: '8',
                transform: 'translate(-12px, -8px)',
                color: merged.theme === 'dark' ? 'indigo.400' : 'indigo.600',
              })}
              fill="currentColor"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
          </Show>

          {/* Rating */}
          <Show when={merged.showRatings && cardProps.testimonial.rating}>
            <StarRating
              rating={cardProps.testimonial.rating!}
              animated={merged.animated}
              delay={cardProps.index * (merged.staggerDelay / 1000) + 0.2}
            />
          </Show>

          {/* Quote */}
          <blockquote class={quoteClasses()}>
            <TextAnimate
              text={`"${cardProps.testimonial.body}"`}
              delay={cardProps.index * (merged.staggerDelay / 1000) + 0.3}
            />
          </blockquote>

          {/* Author */}
          <figcaption
            class={css({
              mt: merged.variant === 'featured' ? '0' : '6',
              display: 'flex',
              alignItems: merged.variant === 'centered' ? 'center' : 'start',
              justifyContent: merged.variant === 'centered' ? 'center' : 'start',
              gap: '4',
              flexWrap: merged.variant === 'featured' ? 'wrap' : 'nowrap',
              borderT:
                merged.variant === 'featured'
                  ? merged.theme === 'dark'
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(0,0,0,0.1)'
                  : 'none',
              px: merged.variant === 'featured' ? '6' : '0',
              py: merged.variant === 'featured' ? '4' : '0',
              sm: { flexWrap: merged.variant === 'featured' ? 'nowrap' : 'wrap' },
            })}
          >
            <Show when={cardProps.testimonial.author.imageUrl}>
              <img
                src={cardProps.testimonial.author.imageUrl}
                alt={cardProps.testimonial.author.name}
                class={css({
                  w:
                    merged.variant === 'centered'
                      ? '12'
                      : merged.variant === 'branded'
                        ? '12'
                        : '10',
                  h:
                    merged.variant === 'centered'
                      ? '12'
                      : merged.variant === 'branded'
                        ? '12'
                        : '10',
                  rounded: 'full',
                  bg: merged.theme === 'dark' ? 'gray.800' : 'gray.50',
                  flexShrink: '0',
                  border: merged.variant === 'branded' ? '2px solid' : 'none',
                  borderColor:
                    merged.variant === 'branded'
                      ? merged.theme === 'dark'
                        ? 'white'
                        : 'white'
                      : 'transparent',
                })}
              />
            </Show>

            <div
              class={css({
                flexGrow: merged.variant === 'featured' ? '1' : '0',
              })}
            >
              <div
                class={css({
                  fontWeight: 'semibold',
                  color: merged.theme === 'dark' ? 'white' : 'gray.900',
                  fontSize: merged.variant === 'centered' ? 'sm' : 'base',
                })}
              >
                {cardProps.testimonial.author.name}
              </div>
              <Show
                when={cardProps.testimonial.author.title || cardProps.testimonial.author.company}
              >
                <div
                  class={css({
                    mt: merged.variant === 'centered' ? '0.5' : '1',
                    fontSize: merged.variant === 'centered' ? 'sm' : 'base',
                    color: merged.theme === 'dark' ? 'gray.400' : 'gray.600',
                  })}
                >
                  {cardProps.testimonial.author.title}
                  <Show
                    when={
                      cardProps.testimonial.author.title && cardProps.testimonial.author.company
                    }
                  >
                    {', '}
                  </Show>
                  {cardProps.testimonial.author.company}
                </div>
              </Show>
              <Show when={cardProps.testimonial.author.handle}>
                <div
                  class={css({
                    mt: '0.5',
                    fontSize: 'sm',
                    color: merged.theme === 'dark' ? 'gray.400' : 'gray.600',
                  })}
                >
                  @{cardProps.testimonial.author.handle}
                </div>
              </Show>
            </div>

            <Show when={merged.variant === 'featured' && cardProps.testimonial.author.logoUrl}>
              <img
                src={cardProps.testimonial.author.logoUrl}
                alt="Company logo"
                class={css({
                  h: '10',
                  w: 'auto',
                  flexShrink: '0',
                })}
              />
            </Show>
          </figcaption>
        </div>
      </BlurFade>
    );
  };

  const getGridClasses = createMemo(() => {
    switch (merged.variant) {
      case 'grid':
      case 'featured':
        return css({
          display: 'grid',
          gap: '8',
          gridTemplateColumns: '1',
          sm: { gridTemplateColumns: '2' },
          xl: { gridTemplateColumns: merged.testimonials.length >= 3 ? '3' : '2' },
        });
      case 'masonry':
        return css({
          display: 'grid',
          gap: '8',
          gridTemplateColumns: '1',
          sm: { gridTemplateColumns: '2' },
          lg: { gridTemplateColumns: '3' },
        });
      case 'split':
        return css({
          display: 'grid',
          gap: '10',
          gridTemplateColumns: '1',
          lg: { gridTemplateColumns: '2' },
        });
      case 'branded':
        return css({
          display: 'grid',
          gridTemplateColumns: '1',
          md: { gridTemplateColumns: '2' },
        });
      default:
        return css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8',
        });
    }
  });

  return (
    <section ref={setContainerRef} class={containerClasses()} style={merged.style}>
      {/* Background Elements */}
      <Show when={merged.backgroundPattern === 'dots'}>
        <DotPattern
          className={css({
            position: 'absolute',
            inset: '0',
            opacity: merged.theme === 'dark' ? '0.1' : '0.05',
          })}
        />
      </Show>

      <Show when={merged.backgroundPattern === 'beams'}>
        <BackgroundBeams className={css({ position: 'absolute', inset: '0' })} />
      </Show>

      <Show when={merged.backgroundPattern === 'gradient'}>
        <div
          class={css({
            position: 'absolute',
            inset: '0',
            bg:
              merged.theme === 'dark'
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(239, 246, 255, 0.6) 0%, rgba(219, 234, 254, 0.6) 100%)',
          })}
        />
      </Show>

      {/* Complex gradient backgrounds for hero variant */}
      <Show when={merged.variant === 'hero'}>
        <div
          class={css({
            position: 'absolute',
            insetX: '0',
            top: '1/2',
            '-z': '10',
            transform: 'translateY(-50%) gpu',
            overflow: 'hidden',
            opacity: '0.3',
            filter: 'blur(3xl)',
          })}
        >
          <div
            style={{
              'clip-path':
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            class={css({
              ml: 'max(50%, 38rem)',
              aspectRatio: '1313/771',
              w: '328.25',
              bg: 'linear-gradient(to top right, #ff80b5, #9089fc)',
            })}
          />
        </div>
      </Show>

      <Show when={merged.backgroundImage}>
        <img
          src={merged.backgroundImage}
          alt=""
          class={css({
            position: 'absolute',
            inset: '0',
            w: 'full',
            h: 'full',
            objectFit: 'cover',
            opacity: merged.theme === 'dark' ? '0.2' : '0.1',
          })}
        />
      </Show>

      <div
        class={css({
          position: 'relative',
          mx: 'auto',
          maxW: '7xl',
          px: '6',
          lg: { px: '8' },
        })}
      >
        {/* Header Section */}
        <Show when={merged.badge || merged.title || merged.subtitle}>
          <BlurFade delay={0.1} inView={isIntersecting()}>
            <div
              class={css({
                mx: 'auto',
                maxW: '2xl',
                textAlign:
                  merged.variant === 'split' || merged.variant === 'branded' ? 'left' : 'center',
                mb: '16',
                lg: { mb: '20' },
              })}
            >
              <Show when={merged.badge}>
                <div
                  class={css({
                    fontSize: 'base',
                    lineHeight: '7',
                    fontWeight: 'semibold',
                    color: merged.theme === 'dark' ? 'indigo.400' : 'indigo.600',
                    mb: '2',
                  })}
                >
                  {merged.badge}
                </div>
              </Show>

              <Show when={merged.title}>
                <h2
                  class={css({
                    mt: '2',
                    fontSize: '4xl',
                    fontWeight: 'semibold',
                    letterSpacing: 'tight',
                    textWrap: 'balance',
                    color: merged.theme === 'dark' ? 'white' : 'gray.900',
                    sm: { fontSize: '5xl' },
                  })}
                >
                  {merged.title}
                </h2>
              </Show>

              <Show when={merged.subtitle}>
                <p
                  class={css({
                    mt: '6',
                    fontSize: 'lg',
                    sm: { fontSize: 'xl' },
                    color: merged.theme === 'dark' ? 'gray.300' : 'gray.600',
                    lineHeight: '8',
                  })}
                >
                  {merged.subtitle}
                </p>
              </Show>
            </div>
          </BlurFade>
        </Show>

        {/* Testimonials Grid */}
        <div class={getGridClasses()}>
          <For each={merged.testimonials}>
            {(testimonial, index) => (
              <TestimonialCard testimonial={testimonial} index={index()} variant={merged.variant} />
            )}
          </For>
        </div>

        {/* Error State */}
        <Show when={testimonialSection.isError && testimonialSection.errorState}>
          <div
            class={css({
              textAlign: 'center',
              py: '12',
            })}
          >
            <p
              class={css({
                color: 'red.500',
                mb: '4',
              })}
            >
              {testimonialSection.errorState}
            </p>
            <button
              onClick={() => testimonialSection.retry()}
              class={css({
                bg: 'red.600',
                color: 'white',
                px: '4',
                py: '2',
                rounded: 'md',
                _hover: { bg: 'red.700' },
              })}
            >
              Retry
            </button>
          </div>
        </Show>
      </div>
    </section>
  );
};

export interface TestimonialSectionDemoProps {
  className?: string;
}

export const TestimonialSectionDemo: Component<TestimonialSectionDemoProps> = (props) => {
  const demoTestimonials: Testimonial[] = [
    {
      id: '1',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.',
      author: {
        name: 'Judith Black',
        title: 'CEO',
        company: 'Workcation',
        imageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg',
      },
      rating: 5,
      featured: true,
      category: 'enterprise',
    },
    {
      id: '2',
      body: 'Qui dolor enim consectetur do et non ex amet culpa sint in ea non dolore. Enim minim magna anim id minim eu cillum sunt dolore aliquip.',
      author: {
        name: 'Leslie Alexander',
        handle: 'lesliealexander',
        title: 'Co-Founder',
        company: 'Tuple',
        imageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      rating: 5,
      category: 'startup',
    },
    {
      id: '3',
      body: 'Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam ut officia rem nulla blanditiis.',
      author: {
        name: 'Tom Cook',
        handle: 'tomcook',
        title: 'Director of Product',
        company: 'Reform',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      rating: 4,
      category: 'enterprise',
    },
  ];

  return (
    <TestimonialSection
      badge="Testimonials"
      title="We have worked with thousands of amazing people"
      subtitle="Hear what our customers have to say about their experience"
      testimonials={demoTestimonials}
      theme="light"
      variant="grid"
      animated={true}
      showRatings={true}
      backgroundPattern="gradient"
      className={props.className}
    />
  );
};

export type { TestimonialSectionProps, TestimonialSectionDemoProps };
