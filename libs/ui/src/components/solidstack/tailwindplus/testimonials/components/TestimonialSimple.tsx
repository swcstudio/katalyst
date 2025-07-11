import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { BlurFade } from '../../../magicui/BlurFade';
import { DotPattern } from '../../../magicui/DotPattern';
import { TextAnimate } from '../../../magicui/TextAnimate';
import { type Testimonial, useTestimonialSection } from '../state/useTestimonialSection';

export interface TestimonialSimpleProps {
  className?: string;
  style?: JSX.CSSProperties;
  testimonial: Testimonial;
  theme?: 'light' | 'dark';
  variant?: 'centered' | 'minimal' | 'logo' | 'gradient';
  animated?: boolean;
  showRating?: boolean;
  showLogo?: boolean;
  backgroundPattern?: 'none' | 'dots' | 'gradient' | 'radial';
  companyLogo?: string;
  animationDelay?: number;
  onTestimonialSelect?: (testimonial: Testimonial) => void;
}

export const TestimonialSimple: Component<TestimonialSimpleProps> = (props) => {
  const merged = mergeProps(
    {
      theme: 'light' as const,
      variant: 'centered' as const,
      animated: true,
      showRating: true,
      showLogo: false,
      backgroundPattern: 'none' as const,
      animationDelay: 0,
    },
    props
  );

  const [containerRef, setContainerRef] = createSignal<HTMLElement>();
  const [isIntersecting, setIsIntersecting] = createSignal(false);

  const testimonialSection = useTestimonialSection({
    testimonialData: {
      id: 'testimonial-simple',
      testimonials: [merged.testimonial],
      layout: 'centered',
      theme: merged.theme,
    },
    theme: merged.theme,
    variant: merged.variant,
    showRatings: merged.showRating,
    onTestimonialSelect: (testimonialId) => {
      if (merged.onTestimonialSelect) {
        merged.onTestimonialSelect(merged.testimonial);
      }
    },
  });

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
      overflow: 'hidden',
      px: '6',
      py: '24',
      sm: { py: '32' },
      lg: { px: '8' },
    });

    const themeClasses =
      merged.theme === 'dark'
        ? css({ bg: 'gray.900', color: 'white' })
        : css({ bg: 'white', color: 'gray.900' });

    const variantClasses = (() => {
      switch (merged.variant) {
        case 'gradient':
          return css({
            bg:
              merged.theme === 'dark'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          });
        default:
          return '';
      }
    })();

    return `${baseClasses} ${themeClasses} ${variantClasses} ${merged.className || ''}`;
  });

  const StarRating: Component<{ rating: number }> = (ratingProps) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
      <div
        class={css({
          display: 'flex',
          justifyContent: 'center',
          gap: '1',
          color: merged.theme === 'dark' ? 'yellow.400' : 'indigo.600',
        })}
      >
        <span class={css({ srOnly: true })}>{ratingProps.rating} out of 5 stars</span>
        <For each={stars}>
          {(star, index) => (
            <BlurFade delay={merged.animationDelay + index() * 0.05} inView={isIntersecting()}>
              <svg
                class={css({
                  w: '5',
                  h: '5',
                  flexShrink: '0',
                })}
                fill={star <= ratingProps.rating ? 'currentColor' : 'none'}
                stroke={star <= ratingProps.rating ? 'currentColor' : 'currentColor'}
                stroke-width={star <= ratingProps.rating ? '0' : '1'}
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

      <Show when={merged.backgroundPattern === 'radial'}>
        <div
          class={css({
            position: 'absolute',
            inset: '0',
            '-z': '10',
            bg:
              merged.theme === 'dark'
                ? 'radial-gradient(45rem 50rem at top, rgba(79, 70, 229, 0.1), transparent)'
                : 'radial-gradient(45rem 50rem at top, rgba(99, 102, 241, 0.1), white)',
            opacity: '0.2',
          })}
        />
      </Show>

      <Show when={merged.variant === 'gradient'}>
        <div
          class={css({
            position: 'absolute',
            insetY: '0',
            right: '1/2',
            '-z': '10',
            mr: '16',
            w: '200%',
            originBottomLeft: true,
            skewX: '-30deg',
            bg: merged.theme === 'dark' ? 'gray.800' : 'white',
            shadow: 'xl',
            ring: '1',
            ringColor: merged.theme === 'dark' ? 'indigo.400/10' : 'indigo.600/10',
            sm: { mr: '28' },
            lg: { mr: '0' },
            xl: { mr: '16', originCenter: true },
          })}
        />
      </Show>

      <div
        class={css({
          mx: 'auto',
          maxW: '2xl',
          lg: { maxW: '4xl' },
        })}
      >
        <figure class={css({ mx: 'auto', maxW: '2xl' })}>
          {/* Company Logo */}
          <Show when={merged.showLogo && (merged.companyLogo || merged.testimonial.author.logoUrl)}>
            <BlurFade delay={merged.animationDelay} inView={isIntersecting()}>
              <img
                src={merged.companyLogo || merged.testimonial.author.logoUrl}
                alt="Company logo"
                class={css({
                  mx: 'auto',
                  h: '12',
                })}
              />
            </BlurFade>
          </Show>

          {/* Rating */}
          <Show when={merged.showRating && merged.testimonial.rating}>
            <div class={css({ mt: merged.showLogo ? '10' : '0' })}>
              <StarRating rating={merged.testimonial.rating!} />
            </div>
          </Show>

          {/* Quote */}
          <blockquote
            class={css({
              mt: '10',
              textAlign: 'center',
              fontSize: 'xl',
              fontWeight: 'semibold',
              letterSpacing: 'tight',
              color: merged.theme === 'dark' ? 'white' : 'gray.900',
              lineHeight: '8',
              sm: { lineHeight: '9' },
            })}
          >
            <TextAnimate
              text={`"${merged.testimonial.body}"`}
              delay={merged.animationDelay + 0.3}
            />
          </blockquote>

          {/* Author */}
          <figcaption class={css({ mt: '10' })}>
            <BlurFade delay={merged.animationDelay + 0.6} inView={isIntersecting()}>
              <Show when={merged.testimonial.author.imageUrl}>
                <img
                  src={merged.testimonial.author.imageUrl}
                  alt={merged.testimonial.author.name}
                  class={css({
                    mx: 'auto',
                    w: merged.variant === 'minimal' ? '10' : '12',
                    h: merged.variant === 'minimal' ? '10' : '12',
                    rounded: 'full',
                    bg: merged.theme === 'dark' ? 'gray.800' : 'gray.50',
                  })}
                />
              </Show>

              <div
                class={css({
                  mt: '4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  spaceX: '3',
                  fontSize: merged.variant === 'minimal' ? 'sm' : 'base',
                  textAlign: 'center',
                })}
              >
                <div
                  class={css({
                    fontWeight: 'semibold',
                    color: merged.theme === 'dark' ? 'white' : 'gray.900',
                  })}
                >
                  {merged.testimonial.author.name}
                </div>

                <Show when={merged.testimonial.author.title || merged.testimonial.author.company}>
                  <svg
                    width={3}
                    height={3}
                    viewBox="0 0 2 2"
                    aria-hidden="true"
                    class={css({
                      fill: merged.theme === 'dark' ? 'white' : 'gray.900',
                    })}
                  >
                    <circle r={1} cx={1} cy={1} />
                  </svg>

                  <div
                    class={css({
                      color: merged.theme === 'dark' ? 'gray.400' : 'gray.600',
                    })}
                  >
                    {merged.testimonial.author.title}
                    <Show
                      when={merged.testimonial.author.title && merged.testimonial.author.company}
                    >
                      {' of '}
                    </Show>
                    {merged.testimonial.author.company}
                  </div>
                </Show>
              </div>
            </BlurFade>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export interface TestimonialSimpleDemoProps {
  className?: string;
}

export const TestimonialSimpleDemo: Component<TestimonialSimpleDemoProps> = (props) => {
  const demoTestimonial: Testimonial = {
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
    category: 'enterprise',
  };

  return (
    <TestimonialSimple
      testimonial={demoTestimonial}
      theme="light"
      variant="centered"
      animated={true}
      showRating={true}
      showLogo={true}
      backgroundPattern="radial"
      className={props.className}
    />
  );
};

export const TestimonialSimpleGradientDemo: Component<TestimonialSimpleDemoProps> = (props) => {
  const demoTestimonial: Testimonial = {
    id: '1',
    body: 'Qui dolor enim consectetur do et non ex amet culpa sint in ea non dolore. Enim minim magna anim id minim eu cillum sunt dolore aliquip. Amet elit laborum culpa irure incididunt adipisicing culpa amet officia exercitation.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80',
    },
    rating: 5,
    category: 'enterprise',
  };

  return (
    <TestimonialSimple
      testimonial={demoTestimonial}
      theme="light"
      variant="gradient"
      animated={true}
      showRating={true}
      showLogo={false}
      backgroundPattern="none"
      className={props.className}
    />
  );
};

export type { TestimonialSimpleProps, TestimonialSimpleDemoProps };
