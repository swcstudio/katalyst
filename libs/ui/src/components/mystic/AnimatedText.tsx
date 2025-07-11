import { createEffect, createSignal, type JSX, onCleanup, splitProps } from 'solid-js';
import { animations, cn, gradients, typography } from './utils.ts';

export interface AnimatedTextProps {
  text: string;
  variant?: 'typewriter' | 'fade' | 'slide' | 'wave' | 'glitch' | 'rainbow';
  gradient?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'sunset'
    | 'ocean'
    | 'forest'
    | 'rainbow'
    | 'midnight';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  speed?: 'slow' | 'normal' | 'fast';
  delay?: number;
  repeat?: boolean;
  cursor?: boolean;
  stagger?: boolean;
  shimmer?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  class?: string;
  id?: string;
  style?: JSX.CSSProperties | string;
}

export function AnimatedText(props: AnimatedTextProps) {
  const [local, others] = splitProps(props, [
    'text',
    'variant',
    'gradient',
    'size',
    'speed',
    'delay',
    'repeat',
    'cursor',
    'stagger',
    'shimmer',
    'as',
    'class',
    'id',
    'style',
  ]);

  const [displayText, setDisplayText] = createSignal('');
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [showCursor, setShowCursor] = createSignal(true);
  const [isAnimating, setIsAnimating] = createSignal(true);

  let animationFrame: number | undefined;
  let cursorInterval: number | undefined;

  const getSpeedDelay = () => {
    const speeds = {
      slow: 150,
      normal: 100,
      fast: 50,
    };
    return speeds[local.speed || 'normal'];
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    };
    return sizes[local.size || 'md'];
  };

  const getGradientClasses = () => {
    if (!local.gradient) return '';

    const gradientMap = {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
      secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
      accent: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
      sunset: 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600',
      ocean: 'bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-600',
      forest: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600',
      rainbow:
        'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
      midnight: 'bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900',
    };

    return `${gradientMap[local.gradient]} bg-clip-text text-transparent`;
  };

  const getVariantClasses = () => {
    const variants = {
      typewriter: 'font-mono',
      fade: 'transition-opacity duration-300',
      slide: 'transition-transform duration-300',
      wave: 'inline-block',
      glitch: 'relative',
      rainbow: 'animate-pulse',
    };
    return variants[local.variant || 'typewriter'];
  };

  // Typewriter animation
  createEffect(() => {
    if (local.variant === 'typewriter') {
      const animate = () => {
        if (currentIndex() < local.text.length) {
          setDisplayText(local.text.slice(0, currentIndex() + 1));
          setCurrentIndex((prev) => prev + 1);
          setTimeout(() => {
            if (isAnimating()) animate();
          }, getSpeedDelay());
        } else if (local.repeat) {
          setTimeout(() => {
            setCurrentIndex(0);
            setDisplayText('');
            if (isAnimating()) animate();
          }, 2000);
        }
      };

      const startDelay = local.delay || 0;
      setTimeout(() => {
        if (isAnimating()) animate();
      }, startDelay);
    } else {
      setDisplayText(local.text);
    }
  });

  // Cursor blinking effect
  createEffect(() => {
    if (local.cursor && local.variant === 'typewriter') {
      cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
    }
  });

  onCleanup(() => {
    setIsAnimating(false);
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (cursorInterval) clearInterval(cursorInterval);
  });

  const baseClasses = cn(
    'inline-block',
    getSizeClasses(),
    getVariantClasses(),
    getGradientClasses(),
    local.shimmer && 'relative overflow-hidden',
    local.class
  );

  const Component = local.as || 'span';

  const renderText = () => {
    const text = displayText();

    if (local.stagger && local.variant !== 'typewriter') {
      return text.split('').map((char, index) => (
        <span
          class={cn(
            'inline-block transition-all duration-300',
            local.variant === 'wave' && 'animate-bounce',
            local.variant === 'fade' && 'animate-in fade-in',
            local.variant === 'slide' && 'animate-in slide-in-from-bottom-2'
          )}
          style={`animation-delay: ${index * 100}ms`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }

    return text;
  };

  const renderCursor = () => {
    if (!local.cursor || local.variant !== 'typewriter') return null;

    return (
      <span
        class={cn(
          'ml-1 bg-current',
          showCursor() ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-100'
        )}
        style="width: 2px; height: 1em; display: inline-block;"
      />
    );
  };

  const renderShimmer = () => {
    if (!local.shimmer) return null;

    return (
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
    );
  };

  const renderGlitchEffect = () => {
    if (local.variant !== 'glitch') return null;

    return (
      <>
        <span
          class="absolute inset-0 text-red-500 animate-pulse"
          style="transform: translateX(-2px); z-index: -1;"
        >
          {displayText()}
        </span>
        <span
          class="absolute inset-0 text-blue-500 animate-pulse"
          style="transform: translateX(2px); z-index: -1; animation-delay: 150ms;"
        >
          {displayText()}
        </span>
      </>
    );
  };

  return (
    <Component class={baseClasses} id={local.id} style={local.style}>
      <span class="relative">
        {renderGlitchEffect()}
        {renderShimmer()}
        {renderText()}
        {renderCursor()}
      </span>
    </Component>
  );
}
