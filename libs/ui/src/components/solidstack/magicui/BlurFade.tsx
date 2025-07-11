import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  createEffect,
  createSignal,
  For,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  type ParentComponent,
} from 'solid-js';

export interface BlurFadeProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  delay?: number;
  inView?: boolean;
  yOffset?: number;
  duration?: number;
  blur?: string;
}

export const BlurFade: ParentComponent<BlurFadeProps> = (props) => {
  const merged = mergeProps(
    {
      delay: 0,
      inView: false,
      yOffset: 6,
      duration: 0.6,
      blur: '6px',
    },
    props
  );

  const [isVisible, setIsVisible] = createSignal(false);
  const [isIntersecting, setIsIntersecting] = createSignal(false);
  let elementRef: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;

  onMount(() => {
    if (merged.inView && elementRef) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(elementRef);
    } else {
      // If not using inView, start animation immediately with delay
      setTimeout(() => {
        setIsVisible(true);
      }, merged.delay * 1000);
    }
  });

  onCleanup(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  createEffect(() => {
    if (merged.inView && isIntersecting()) {
      setTimeout(() => {
        setIsVisible(true);
      }, merged.delay * 1000);
    }
  });

  return (
    <div
      ref={elementRef}
      class={css(
        {
          transform: isVisible() ? 'translateY(0)' : `translateY(${merged.yOffset}px)`,
          opacity: isVisible() ? 1 : 0,
          filter: isVisible() ? 'blur(0px)' : `blur(${merged.blur})`,
          transition: `all ${merged.duration}s ease-out`,
        },
        merged.class
      )}
      style={merged.style}
    >
      {props.children}
    </div>
  );
};

export interface BlurFadeDemoProps {
  class?: string;
}

export const BlurFadeDemo: Component<BlurFadeDemoProps> = (props) => {
  const images = Array.from({ length: 9 }, (_, i) => {
    const isLandscape = i % 2 === 0;
    const width = isLandscape ? 800 : 600;
    const height = isLandscape ? 600 : 800;
    return `https://picsum.photos/seed/${i + 1}/${width}/${height}`;
  });

  return (
    <section id="photos" class={props.class}>
      <div
        class={css({
          columns: 2,
          gap: '16px',
          '@media (min-width: 640px)': {
            columns: 3,
          },
        })}
      >
        <For each={images}>
          {(imageUrl, index) => (
            <BlurFade delay={0.25 + index() * 0.05} inView>
              <img
                class={css({
                  marginBottom: '16px',
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'contain',
                })}
                src={imageUrl}
                alt={`Random stock image ${index() + 1}`}
              />
            </BlurFade>
          )}
        </For>
      </div>
    </section>
  );
};

export interface BlurFadeTextDemoProps {
  class?: string;
}

export const BlurFadeTextDemo: Component<BlurFadeTextDemoProps> = (props) => {
  return (
    <section id="header" class={props.class}>
      <BlurFade delay={0.25} inView>
        <h2
          class={css({
            fontSize: '24px',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            '@media (min-width: 640px)': {
              fontSize: '48px',
            },
            '@media (min-width: 1280px)': {
              fontSize: '60px',
              lineHeight: 1,
            },
          })}
        >
          Hello World 👋
        </h2>
      </BlurFade>
      <BlurFade delay={0.25 * 2} inView>
        <span
          class={css({
            fontSize: '20px',
            letterSpacing: '-0.025em',
            '@media (min-width: 640px)': {
              fontSize: '24px',
            },
            '@media (min-width: 1280px)': {
              fontSize: '32px',
              lineHeight: 1,
            },
          })}
        >
          Nice to meet you
        </span>
      </BlurFade>
    </section>
  );
};

export type { BlurFadeProps, BlurFadeDemoProps, BlurFadeTextDemoProps };
