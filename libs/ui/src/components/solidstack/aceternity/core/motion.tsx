import { Component, createSignal, onMount, onCleanup } from 'solid-js';
import { animate, spring, stagger, timeline, inView } from '@motionone/dom';
import { css } from '@sse/ui/styled-system/css';

// Motion configuration presets
export const motionPresets = {
  // Spring configurations
  springs: {
    gentle: spring({ stiffness: 300, damping: 30 }),
    wobbly: spring({ stiffness: 200, damping: 10 }),
    snappy: spring({ stiffness: 500, damping: 40 }),
    bouncy: spring({ stiffness: 400, damping: 8 }),
  },
  
  // Easing functions
  easing: {
    easeOut: [0.4, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    circOut: [0, 0.55, 0.45, 1],
    backOut: [0.34, 1.56, 0.64, 1],
    anticipate: [0.2, 1, 0.3, 1],
  },
  
  // Duration presets
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },
};

// Animation variants
export const animationVariants = {
  fadeIn: {
    opacity: [0, 1],
    transform: ['translateY(20px)', 'translateY(0px)'],
  },
  
  fadeInUp: {
    opacity: [0, 1],
    transform: ['translateY(30px)', 'translateY(0px)'],
  },
  
  fadeInDown: {
    opacity: [0, 1],
    transform: ['translateY(-30px)', 'translateY(0px)'],
  },
  
  fadeInLeft: {
    opacity: [0, 1],
    transform: ['translateX(-30px)', 'translateX(0px)'],
  },
  
  fadeInRight: {
    opacity: [0, 1],
    transform: ['translateX(30px)', 'translateX(0px)'],
  },
  
  scaleIn: {
    opacity: [0, 1],
    transform: ['scale(0.8)', 'scale(1)'],
  },
  
  slideInUp: {
    transform: ['translateY(100%)', 'translateY(0%)'],
  },
  
  slideInDown: {
    transform: ['translateY(-100%)', 'translateY(0%)'],
  },
  
  slideInLeft: {
    transform: ['translateX(-100%)', 'translateX(0%)'],
  },
  
  slideInRight: {
    transform: ['translateX(100%)', 'translateX(0%)'],
  },
  
  bounce: {
    transform: [
      'translateY(0px)',
      'translateY(-10px)',
      'translateY(0px)',
      'translateY(-5px)',
      'translateY(0px)',
    ],
  },
  
  wiggle: {
    transform: [
      'rotate(0deg)',
      'rotate(5deg)',
      'rotate(-5deg)',
      'rotate(3deg)',
      'rotate(-3deg)',
      'rotate(0deg)',
    ],
  },
  
  pulse: {
    transform: ['scale(1)', 'scale(1.05)', 'scale(1)'],
  },
  
  spin: {
    transform: ['rotate(0deg)', 'rotate(360deg)'],
  },
};

// Motion component wrapper
export interface MotionProps {
  children: any;
  className?: string;
  variant?: keyof typeof animationVariants;
  duration?: number;
  delay?: number;
  easing?: number[];
  spring?: any;
  onInView?: boolean;
  staggerChildren?: number;
  custom?: Record<string, any>;
  onComplete?: () => void;
}

export const Motion: Component<MotionProps> = (props) => {
  let elementRef: HTMLDivElement | undefined;
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    if (!elementRef) return;

    const config = {
      duration: props.duration || motionPresets.duration.normal,
      easing: props.easing || motionPresets.easing.easeOut,
      delay: props.delay || 0,
    };

    const animation = props.variant 
      ? animationVariants[props.variant]
      : props.custom || animationVariants.fadeIn;

    if (props.onInView) {
      const stopInView = inView(elementRef, () => {
        setIsVisible(true);
        animate(elementRef!, animation, config).finished.then(() => {
          props.onComplete?.();
        });
      });
      
      onCleanup(() => stopInView());
    } else {
      animate(elementRef, animation, config).finished.then(() => {
        props.onComplete?.();
      });
    }

    if (props.spring) {
      animate(elementRef, animation, {
        ...config,
        easing: props.spring,
      });
    }
  });

  return (
    <div
      ref={elementRef}
      class={css({
        display: 'inline-block',
      }, props.className)}
    >
      {props.children}
    </div>
  );
};

// Stagger container for animating multiple children
export interface StaggerProps {
  children: any;
  className?: string;
  staggerDelay?: number;
  variant?: keyof typeof animationVariants;
  duration?: number;
  onInView?: boolean;
}

export const Stagger: Component<StaggerProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!containerRef) return;

    const children = Array.from(containerRef.children) as HTMLElement[];
    const staggerDelay = props.staggerDelay || 0.1;
    
    const config = {
      duration: props.duration || motionPresets.duration.normal,
      easing: motionPresets.easing.easeOut,
      delay: stagger(staggerDelay),
    };

    const animation = props.variant 
      ? animationVariants[props.variant]
      : animationVariants.fadeIn;

    if (props.onInView) {
      const stopInView = inView(containerRef, () => {
        animate(children, animation, config);
      });
      
      onCleanup(() => stopInView());
    } else {
      animate(children, animation, config);
    }
  });

  return (
    <div
      ref={containerRef}
      class={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
      }, props.className)}
    >
      {props.children}
    </div>
  );
};

// Scroll-triggered animation
export interface ScrollRevealProps {
  children: any;
  className?: string;
  variant?: keyof typeof animationVariants;
  threshold?: number;
  once?: boolean;
  duration?: number;
}

export const ScrollReveal: Component<ScrollRevealProps> = (props) => {
  let elementRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!elementRef) return;

    const animation = props.variant 
      ? animationVariants[props.variant]
      : animationVariants.fadeInUp;

    const config = {
      duration: props.duration || motionPresets.duration.normal,
      easing: motionPresets.easing.easeOut,
    };

    const stopInView = inView(
      elementRef,
      () => animate(elementRef!, animation, config),
      { amount: props.threshold || 0.3, once: props.once !== false }
    );

    onCleanup(() => stopInView());
  });

  return (
    <div
      ref={elementRef}
      class={css({
        opacity: 0,
      }, props.className)}
    >
      {props.children}
    </div>
  );
};

// Parallax effect component
export interface ParallaxProps {
  children: any;
  className?: string;
  offset?: number;
  speed?: number;
}

export const Parallax: Component<ParallaxProps> = (props) => {
  let elementRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!elementRef) return;

    const offset = props.offset || 0;
    const speed = props.speed || 0.5;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * speed;
      
      if (elementRef) {
        elementRef.style.transform = `translateY(${parallax + offset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  });

  return (
    <div
      ref={elementRef}
      class={css({
        willChange: 'transform',
      }, props.className)}
    >
      {props.children}
    </div>
  );
};

// Hover animation wrapper
export interface HoverMotionProps {
  children: any;
  className?: string;
  scale?: number;
  rotate?: number;
  duration?: number;
  lift?: boolean;
}

export const HoverMotion: Component<HoverMotionProps> = (props) => {
  let elementRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!elementRef) return;

    const scale = props.scale || 1.05;
    const rotate = props.rotate || 0;
    const duration = props.duration || motionPresets.duration.fast;

    const hoverAnimation = {
      transform: [
        'scale(1) rotate(0deg)',
        `scale(${scale}) rotate(${rotate}deg)`,
      ],
      ...(props.lift && {
        boxShadow: [
          '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        ],
      }),
    };

    const resetAnimation = {
      transform: ['scale(1) rotate(0deg)'],
      ...(props.lift && {
        boxShadow: ['0 4px 6px -1px rgba(0, 0, 0, 0.1)'],
      }),
    };

    const config = {
      duration,
      easing: motionPresets.easing.easeOut,
    };

    elementRef.addEventListener('mouseenter', () => {
      animate(elementRef!, hoverAnimation, config);
    });

    elementRef.addEventListener('mouseleave', () => {
      animate(elementRef!, resetAnimation, config);
    });
  });

  return (
    <div
      ref={elementRef}
      class={css({
        cursor: 'pointer',
        willChange: 'transform',
      }, props.className)}
    >
      {props.children}
    </div>
  );
};

// Utility functions for creating custom animations
export const createTimeline = timeline;
export const createStagger = stagger;
export const createSpring = spring;
export const animateElement = animate;
export const observeInView = inView;

// Common animation helpers
export const fadeInStagger = (elements: HTMLElement[], delay = 0.1) => {
  return animate(
    elements,
    animationVariants.fadeIn,
    {
      duration: motionPresets.duration.normal,
      easing: motionPresets.easing.easeOut,
      delay: stagger(delay),
    }
  );
};

export const slideInFromLeft = (element: HTMLElement, duration = 0.5) => {
  return animate(
    element,
    animationVariants.slideInLeft,
    {
      duration,
      easing: motionPresets.easing.easeOut,
    }
  );
};

export const scaleInWithBounce = (element: HTMLElement) => {
  return animate(
    element,
    {
      opacity: [0, 1],
      transform: ['scale(0)', 'scale(1.1)', 'scale(1)'],
    },
    {
      duration: 0.6,
      easing: motionPresets.easing.backOut,
    }
  );
};