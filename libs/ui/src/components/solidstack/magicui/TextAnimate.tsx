import { Component, JSX, mergeProps, createSignal, onMount, onCleanup, createEffect, For, splitProps } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface AnimationVariant {
  hidden: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
    blur?: string;
  };
  show: ((i: number) => {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
    blur?: string;
    transition?: {
      delay?: number;
      duration?: number;
      type?: string;
      damping?: number;
      stiffness?: number;
      mass?: number;
      [key: string]: any;
    };
  }) | {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
    blur?: string;
    transition?: {
      delay?: number;
      duration?: number;
      type?: string;
      damping?: number;
      stiffness?: number;
      mass?: number;
      [key: string]: any;
    };
  };
  exit?: ((i: number) => {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
    blur?: string;
    transition?: {
      delay?: number;
      duration?: number;
    };
  }) | {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
    blur?: string;
    transition?: {
      delay?: number;
      duration?: number;
    };
  };
}

export interface TextAnimateProps {
  children: string;
  class?: string;
  style?: JSX.CSSProperties;
  animation?: 'blurInUp' | 'blurIn' | 'slideUp' | 'slideLeft' | 'scaleUp' | 'fadeIn';
  by?: 'character' | 'word' | 'line' | 'text';
  variants?: AnimationVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const defaultVariants: Record<string, AnimationVariant> = {
  blurInUp: {
    hidden: { opacity: 0, y: 20, blur: '10px' },
    show: { opacity: 1, y: 0, blur: '0px', transition: { duration: 0.6 } }
  },
  blurIn: {
    hidden: { opacity: 0, blur: '10px' },
    show: { opacity: 1, blur: '0px', transition: { duration: 0.6 } }
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } }
  }
};

export const TextAnimate: Component<TextAnimateProps> = (props) => {
  const [local, others] = splitProps(props, [
    'children', 'class', 'style', 'animation', 'by', 'variants', 
    'delay', 'duration', 'once', 'as'
  ]);
  
  const merged = mergeProps(
    {
      animation: 'fadeIn' as const,
      by: 'word' as const,
      delay: 0,
      duration: 0.5,
      once: false,
      as: 'div' as keyof JSX.IntrinsicElements,
    },
    local
  );

  const [isVisible, setIsVisible] = createSignal(false);
  const [hasAnimated, setHasAnimated] = createSignal(false);
  let containerRef: HTMLElement | undefined;
  let observer: IntersectionObserver | undefined;

  const splitText = (text: string, by: string): string[] => {
    switch (by) {
      case 'character':
        return text.split('');
      case 'word':
        return text.split(/(\s+)/);
      case 'line':
        return text.split('\n');
      case 'text':
        return [text];
      default:
        return text.split(/(\s+)/);
    }
  };

  const getVariant = (): AnimationVariant => {
    if (merged.variants) return merged.variants;
    return defaultVariants[merged.animation];
  };

  const getTransformStyle = (variant: any, index: number, isShow: boolean): JSX.CSSProperties => {
    const baseDelay = merged.delay;
    const itemDelay = isShow ? index * 0.05 : 0;
    const totalDelay = baseDelay + itemDelay;
    
    if (!isShow) {
      return {
        opacity: variant.hidden.opacity ?? 1,
        transform: `
          translateX(${variant.hidden.x ?? 0}px) 
          translateY(${variant.hidden.y ?? 0}px) 
          scale(${variant.hidden.scale ?? 1}) 
          rotate(${variant.hidden.rotate ?? 0}deg)
        `,
        filter: variant.hidden.blur ? `blur(${variant.hidden.blur})` : 'none',
        transition: 'none',
      };
    }

    const showVariant = typeof variant.show === 'function' ? variant.show(index) : variant.show;
    const duration = showVariant.transition?.duration ?? merged.duration;

    return {
      opacity: showVariant.opacity ?? 1,
      transform: `
        translateX(${showVariant.x ?? 0}px) 
        translateY(${showVariant.y ?? 0}px) 
        scale(${showVariant.scale ?? 1}) 
        rotate(${showVariant.rotate ?? 0}deg)
      `,
      filter: showVariant.blur ? `blur(${showVariant.blur})` : 'none',
      transition: `all ${duration}s ease-out ${totalDelay}s`,
    };
  };

  onMount(() => {
    if (merged.once && containerRef) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated()) {
            setIsVisible(true);
            setHasAnimated(true);
            observer?.unobserve(containerRef!);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef);
    } else {
      setTimeout(() => setIsVisible(true), merged.delay * 1000);
    }
  });

  onCleanup(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  const textParts = () => splitText(merged.children, merged.by);
  const variant = getVariant();

  const Component = merged.as;

  return (
    <Component
      ref={containerRef}
      class={css({
        display: 'inline-block',
      }, merged.class)}
      style={merged.style}
      {...others}
    >
      <For each={textParts()}>
        {(part, index) => {
          if (merged.by === 'line') {
            return (
              <>
                <span
                  class={css({ display: 'inline-block' })}
                  style={getTransformStyle(variant, index(), isVisible())}
                >
                  {part}
                </span>
                {index() < textParts().length - 1 && <br />}
              </>
            );
          }

          if (part.match(/^\s+$/)) {
            return part;
          }

          return (
            <span
              class={css({ display: 'inline-block' })}
              style={getTransformStyle(variant, index(), isVisible())}
            >
              {part}
            </span>
          );
        }}
      </For>
    </Component>
  );
};

// Demo Components
export const TextAnimateDemo: Component = () => {
  return (
    <TextAnimate animation="blurInUp" by="character" once>
      Blur in by character
    </TextAnimate>
  );
};

export const TextAnimateDemo2: Component = () => {
  return (
    <TextAnimate animation="blurIn" as="h1">
      Blur in text
    </TextAnimate>
  );
};

export const TextAnimateDemo3: Component = () => {
  return (
    <TextAnimate animation="slideUp" by="word">
      Slide up by word
    </TextAnimate>
  );
};

export const TextAnimateDemo4: Component = () => {
  return (
    <TextAnimate animation="scaleUp" by="text">
      Scale up by text
    </TextAnimate>
  );
};

export const TextAnimateDemo5: Component = () => {
  return (
    <TextAnimate animation="fadeIn" by="line" as="p">
      {`Fade in by line as paragraph\n\nFade in by line as paragraph\n\nFade in by line as paragraph`}
    </TextAnimate>
  );
};

export const TextAnimateDemo6: Component = () => {
  return (
    <TextAnimate animation="slideLeft" by="character">
      Slide left by character
    </TextAnimate>
  );
};

export const TextAnimateDemo7: Component = () => {
  return (
    <TextAnimate animation="blurInUp" by="character" delay={2}>
      Blur in by character
    </TextAnimate>
  );
};

export const TextAnimateDemo8: Component = () => {
  return (
    <TextAnimate animation="blurInUp" by="character" duration={5}>
      Blur in by character
    </TextAnimate>
  );
};

export const TextAnimateDemo9: Component = () => {
  return (
    <TextAnimate
      variants={{
        hidden: {
          opacity: 0,
          y: 30,
          rotate: 45,
          scale: 0.5,
        },
        show: (i) => ({
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: {
            delay: i * 0.1,
            duration: 0.4,
          },
        }),
        exit: (i) => ({
          opacity: 0,
          y: 30,
          rotate: 45,
          scale: 0.5,
          transition: {
            delay: i * 0.1,
            duration: 0.4,
          },
        }),
      }}
      by="character"
    >
      Wavy Motion!
    </TextAnimate>
  );
};

export type { TextAnimateProps, AnimationVariant };