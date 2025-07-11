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
import { TextAnimate } from '../../../magicui/TextAnimate';
import { type Testimonial, useTestimonialSection } from '../state/useTestimonialSection';

export interface TestimonialHeroProps {
  className?: string;
  style?: JSX.CSSProperties;
  testimonial: Testimonial;
  theme?: 'light' | 'dark';
  variant?: 'split' | 'overlay' | 'split-reverse' | 'image-bg' | 'gradient';
  animated?: boolean;
  showLogo?: boolean;
  backgroundImage?: string;
  heroImage?: string;
  companyLogo?: string;
  overlayOpacity?: number;
  animationDelay?: number;
  onTestimonialSelect?: (testimonial: Testimonial) => void;
}

export const TestimonialHero: Component<TestimonialHeroProps> = (props) => {
  const merged = mergeProps(
    {
      theme: 'light' as const,
      variant: 'split' as const,
      animated: true,
      showLogo: true,
      overlayOpacity: 0.9,
      animationDelay: 0,
    },
    props
  );

  const [containerRef, setContainerRef] = createSignal<HTMLElement>();
  const [isIntersecting, setIsIntersecting] = createSignal(false);

  const testimonialSection = useTestimonialSection({
    testimonialData: {
      id: 'testimonial-hero',
      testimonials: [merged.testimonial],
      layout: 'split',
      theme: merged.theme,
      backgroundImage: merged.backgroundImage,
    },
    theme: merged.theme,
    variant: merged.variant,
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
    });

    const variantClasses = (() => {
      switch (merged.variant) {
        case 'split':
        case 'split-reverse':
          return css({
            bg: 'white',
            pt: '24',
            pb: '16',
            sm: { pt: '32', pb: '24' },
            xl: { pb: '32' },
          });
        case 'overlay':
        case 'image-bg':
          return css({
            bg: 'white',
            py: '16',
            sm: { py: '24' },
          });
        case 'gradient':
          return css({
            bg: 'gray.900',
            py: '24',
            sm: { py: '32' },
          });
        default:
          return css({
            py: '24',
            sm: { py: '32' },
          });
      }
    })();

    return `${baseClasses} ${variantClasses} ${merged.className || ''}`;
  });

  const QuoteSVG: Component<{ className?: string }> = (svgProps) => (
    <svg fill="none" viewBox="0 0 162 128" aria-hidden="true" class={svgProps.className}>
      <path
        d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
        id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
      />
      <use x={86} href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" />
    </svg>
  );

  const SplitLayout: Component = () => (
    <div
      class={css({
        bg: merged.variant === 'split' ? 'gray.900' : 'white',
        pb: '20',
        sm: { pb: '24' },
        xl: { pb: '0' },
      })}
    >
      <div
        class={css({
          mx: 'auto',
          display: 'flex',
          maxW: '7xl',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8',
          px: '6',
          sm: { gap: '8' },
          lg: { px: '8' },
          xl: {
            flexDirection: merged.variant === 'split-reverse' ? 'row-reverse' : 'row',
            alignItems: 'stretch',
          },
        })}
      >
        {/* Image Section */}
        <div
          class={css({
            '-mt': '8',
            w: 'full',
            maxW: '2xl',
            xl: {
              '-mb': '8',
              w: '96',
              flexShrink: '0',
            },
          })}
        >
          <BlurFade delay={merged.animationDelay} inView={isIntersecting()}>
            <div
              class={css({
                position: 'relative',
                aspectRatio: '2/1',
                h: 'full',
                md: { '-mx': '8' },
                xl: { mx: '0', aspectRatio: 'auto' },
              })}
            >
              <img
                src={merged.heroImage || merged.testimonial.author.imageUrl}
                alt={merged.testimonial.author.name}
                class={css({
                  position: 'absolute',
                  inset: '0',
                  w: 'full',
                  h: 'full',
                  rounded: '2xl',
                  bg: merged.variant === 'split' ? 'gray.800' : 'gray.50',
                  objectFit: 'cover',
                  shadow: '2xl',
                })}
              />
            </div>
          </BlurFade>
        </div>

        {/* Content Section */}
        <div
          class={css({
            w: 'full',
            maxW: '2xl',
            xl: {
              maxW: 'none',
              flexGrow: '1',
              px: '16',
              py: '24',
            },
          })}
        >
          <figure
            class={css({
              position: 'relative',
              isolate: true,
              pt: '6',
              sm: { pt: '12' },
            })}
          >
            <QuoteSVG
              className={css({
                position: 'absolute',
                top: '0',
                left: '0',
                '-z': '10',
                h: '32',
                stroke: merged.variant === 'split' ? 'white/20' : 'gray.900/10',
              })}
            />

            <blockquote
              class={css({
                fontSize: 'xl',
                fontWeight: 'semibold',
                color: merged.variant === 'split' ? 'white' : 'gray.900',
                lineHeight: '8',
                sm: { lineHeight: '9' },
              })}
            >
              <TextAnimate
                text={`"${merged.testimonial.body}"`}
                delay={merged.animationDelay + 0.3}
              />
            </blockquote>

            <figcaption
              class={css({
                mt: '8',
                fontSize: 'base',
              })}
            >
              <BlurFade delay={merged.animationDelay + 0.6} inView={isIntersecting()}>
                <div
                  class={css({
                    fontWeight: 'semibold',
                    color: merged.variant === 'split' ? 'white' : 'gray.900',
                  })}
                >
                  {merged.testimonial.author.name}
                </div>
                <div
                  class={css({
                    mt: '1',
                    color: merged.variant === 'split' ? 'gray.400' : 'gray.500',
                  })}
                >
                  {merged.testimonial.author.title}
                  <Show when={merged.testimonial.author.title && merged.testimonial.author.company}>
                    {', '}
                  </Show>
                  {merged.testimonial.author.company}
                </div>
              </BlurFade>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );

  const OverlayLayout: Component = () => (
    <div
      class={css({
        mx: 'auto',
        maxW: '7xl',
        sm: { px: '6' },
        lg: { px: '8' },
      })}
    >
      <div
        class={css({
          position: 'relative',
          overflow: 'hidden',
          bg: 'gray.900',
          px: '6',
          py: '20',
          shadow: 'xl',
          sm: {
            rounded: '3xl',
            px: '10',
            py: '24',
          },
          md: { px: '12' },
          lg: { px: '20' },
        })}
      >
        {/* Background Image */}
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
              brightness: '150',
              saturate: '0',
            })}
          />
        </Show>

        {/* Overlay */}
        <div
          class={css({
            position: 'absolute',
            inset: '0',
            bg: 'gray.900',
            mixBlendMode: 'multiply',
          })}
          style={{ opacity: merged.overlayOpacity }}
        />

        {/* Gradient Blobs */}
        <div
          aria-hidden="true"
          class={css({
            position: 'absolute',
            '-top': '56',
            '-left': '80',
            transform: 'gpu',
            filter: 'blur(3xl)',
          })}
        >
          <div
            style={{
              'clip-path':
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            class={css({
              aspectRatio: '1097/845',
              w: '274.25',
              bg: 'linear-gradient(to right, #ff4694, #776fff)',
              opacity: '0.45',
            })}
          />
        </div>

        <BackgroundBeams className={css({ position: 'absolute', inset: '0', opacity: '0.1' })} />

        {/* Content */}
        <div
          class={css({
            position: 'relative',
            mx: 'auto',
            maxW: '2xl',
            lg: { mx: '0' },
          })}
        >
          <Show when={merged.showLogo && (merged.companyLogo || merged.testimonial.author.logoUrl)}>
            <BlurFade delay={merged.animationDelay} inView={isIntersecting()}>
              <img
                src={merged.companyLogo || merged.testimonial.author.logoUrl}
                alt="Company logo"
                class={css({
                  h: '12',
                  w: 'auto',
                })}
              />
            </BlurFade>
          </Show>

          <figure>
            <blockquote
              class={css({
                mt: '6',
                fontSize: 'lg',
                fontWeight: 'semibold',
                color: 'white',
                sm: { fontSize: 'xl', lineHeight: '8' },
              })}
            >
              <TextAnimate
                text={`"${merged.testimonial.body}"`}
                delay={merged.animationDelay + 0.3}
              />
            </blockquote>

            <figcaption
              class={css({
                mt: '6',
                fontSize: 'base',
                color: 'white',
              })}
            >
              <BlurFade delay={merged.animationDelay + 0.6} inView={isIntersecting()}>
                <div class={css({ fontWeight: 'semibold' })}>{merged.testimonial.author.name}</div>
                <div class={css({ mt: '1' })}>
                  {merged.testimonial.author.title}
                  <Show when={merged.testimonial.author.title && merged.testimonial.author.company}>
                    {' of '}
                  </Show>
                  {merged.testimonial.author.company}
                </div>
              </BlurFade>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={setContainerRef} class={containerClasses()} style={merged.style}>
      <Show when={merged.variant === 'split' || merged.variant === 'split-reverse'}>
        <SplitLayout />
      </Show>

      <Show when={merged.variant === 'overlay' || merged.variant === 'image-bg'}>
        <OverlayLayout />
      </Show>
    </section>
  );
};

export interface TestimonialHeroDemoProps {
  className?: string;
}

export const TestimonialHeroDemo: Component<TestimonialHeroDemoProps> = (props) => {
  const demoTestimonial: Testimonial = {
    id: '1',
    body: 'Gravida quam mi erat tortor neque molestie. Auctor aliquet at porttitor a enim nunc suscipit tincidunt nunc. Et non lorem tortor posuere. Nunc eu scelerisque interdum eget tellus non nibh scelerisque bibendum.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=576&h=576&q=80',
      logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/workcation-logo-white.svg',
    },
    category: 'enterprise',
  };

  return (
    <TestimonialHero
      testimonial={demoTestimonial}
      theme="dark"
      variant="split"
      animated={true}
      showLogo={true}
      heroImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
      className={props.className}
    />
  );
};

export const TestimonialHeroOverlayDemo: Component<TestimonialHeroDemoProps> = (props) => {
  const demoTestimonial: Testimonial = {
    id: '1',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/workcation-logo-white.svg',
    },
    category: 'enterprise',
  };

  return (
    <TestimonialHero
      testimonial={demoTestimonial}
      theme="dark"
      variant="overlay"
      animated={true}
      showLogo={true}
      backgroundImage="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
      overlayOpacity={0.9}
      className={props.className}
    />
  );
};

export type { TestimonialHeroProps, TestimonialHeroDemoProps };
