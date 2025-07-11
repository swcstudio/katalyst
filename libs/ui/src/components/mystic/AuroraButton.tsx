import { createSignal, type JSX, onMount, splitProps } from 'solid-js';
import { animations, cn, sizeVariants } from './utils.ts';

export interface AuroraButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'aurora' | 'cosmic' | 'mystic' | 'ocean' | 'forest' | 'sunset';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  children: JSX.Element;
  glowIntensity?: 'subtle' | 'medium' | 'intense';
  animationSpeed?: 'slow' | 'normal' | 'fast';
}

export function AuroraButton(props: AuroraButtonProps) {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'loading',
    'disabled',
    'children',
    'class',
    'glowIntensity',
    'animationSpeed',
  ]);

  const [isHovered, setIsHovered] = createSignal(false);
  let buttonRef: HTMLButtonElement | undefined;

  onMount(() => {
    if (buttonRef) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = buttonRef!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        buttonRef!.style.setProperty('--mouse-x', `${x}px`);
        buttonRef!.style.setProperty('--mouse-y', `${y}px`);
      };

      buttonRef.addEventListener('mousemove', handleMouseMove);
      return () => buttonRef?.removeEventListener('mousemove', handleMouseMove);
    }
  });

  const getVariantClasses = () => {
    const variants = {
      aurora:
        'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600',
      cosmic:
        'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700',
      mystic:
        'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:via-indigo-700 hover:to-purple-700',
      ocean:
        'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700',
      forest:
        'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700',
      sunset:
        'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700',
    };
    return variants[local.variant || 'aurora'];
  };

  const getGlowClasses = () => {
    const intensity = local.glowIntensity || 'medium';
    const glowMap = {
      subtle: 'shadow-lg',
      medium: 'shadow-xl shadow-current/25',
      intense: 'shadow-2xl shadow-current/40',
    };
    return glowMap[intensity];
  };

  const getAnimationSpeed = () => {
    const speed = local.animationSpeed || 'normal';
    const speedMap = {
      slow: 'duration-700',
      normal: 'duration-500',
      fast: 'duration-300',
    };
    return speedMap[speed];
  };

  const getSizeClasses = () => {
    const size = local.size || 'md';
    return `${sizeVariants[size].padding} ${sizeVariants[size].text} ${sizeVariants[size].height}`;
  };

  const baseClasses = cn(
    // Base styles
    'relative inline-flex items-center justify-center font-semibold text-white',
    'rounded-xl overflow-hidden transition-all',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'before:absolute before:inset-0 before:bg-gradient-to-r before:opacity-0 before:transition-opacity',
    'hover:before:opacity-100 hover:scale-105 active:scale-95',

    // Aurora effect
    'after:absolute after:inset-0 after:bg-gradient-radial after:from-white/20 after:to-transparent',
    'after:opacity-0 after:transition-opacity after:duration-300',
    'hover:after:opacity-100',

    // Animation classes
    getAnimationSpeed(),
    animations.hoverGlow,

    // Size classes
    getSizeClasses(),

    // Variant classes
    getVariantClasses(),

    // Glow classes
    getGlowClasses(),

    // Custom class
    local.class
  );

  const overlayClasses = cn(
    'absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300',
    'hover:opacity-20',
    getVariantClasses()
  );

  return (
    <button
      ref={buttonRef}
      {...others}
      disabled={local.disabled || local.loading}
      class={baseClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        background: isHovered()
          ? 'radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent)'
          : undefined,
        ...(others.style as any),
      }}
    >
      {/* Aurora overlay */}
      <div class={overlayClasses} />

      {/* Animated background */}
      <div
        class="absolute inset-0 bg-gradient-to-r animate-pulse opacity-30"
        classList={{
          'from-blue-400/20 via-purple-400/20 to-pink-400/20': local.variant === 'aurora',
          'from-purple-400/20 via-blue-400/20 to-cyan-400/20': local.variant === 'cosmic',
          'from-violet-400/20 via-indigo-400/20 to-purple-400/20': local.variant === 'mystic',
          'from-blue-400/20 via-cyan-400/20 to-teal-400/20': local.variant === 'ocean',
          'from-green-400/20 via-emerald-400/20 to-teal-400/20': local.variant === 'forest',
          'from-orange-400/20 via-pink-400/20 to-purple-400/20': local.variant === 'sunset',
        }}
      />

      {/* Content */}
      <span class="relative z-10 flex items-center gap-2">
        {local.loading && (
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {local.children}
      </span>

      {/* Shimmer effect */}
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}
