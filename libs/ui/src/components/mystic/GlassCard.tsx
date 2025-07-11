import { type JSX, children as resolveChildren, Show, splitProps } from 'solid-js';
import { animations, cn, glassMorphism, shadows, sizeVariants } from './utils.ts';

export interface GlassCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'light'
    | 'medium'
    | 'heavy'
    | 'dark'
    | 'rainbow'
    | 'aurora'
    | 'cosmic'
    | 'ocean'
    | 'forest';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  border?: boolean;
  hoverable?: boolean;
  animated?: boolean;
  children: JSX.Element;
  header?: JSX.Element;
  footer?: JSX.Element;
  overlay?: boolean;
  gradient?: boolean;
}

export function GlassCard(props: GlassCardProps) {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'blur',
    'shadow',
    'rounded',
    'border',
    'hoverable',
    'animated',
    'children',
    'header',
    'footer',
    'overlay',
    'gradient',
    'class',
  ]);

  const c = resolveChildren(() => local.children);

  const getVariantClasses = () => {
    const variants = {
      light: 'bg-white/10 border-white/20',
      medium: 'bg-white/20 border-white/30',
      heavy: 'bg-white/30 border-white/40',
      dark: 'bg-black/20 border-white/10',
      rainbow:
        'bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 border-white/20',
      aurora: 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-white/30',
      cosmic: 'bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 border-white/25',
      ocean: 'bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-teal-600/20 border-white/25',
      forest:
        'bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-teal-600/20 border-white/25',
    };
    return variants[local.variant || 'medium'];
  };

  const getBlurClasses = () => {
    const blurs = {
      none: '',
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    };
    return blurs[local.blur || 'md'];
  };

  const getShadowClasses = () => {
    const shadowVariants = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      glow: 'shadow-xl shadow-purple-500/25',
    };
    return shadowVariants[local.shadow || 'lg'];
  };

  const getRoundedClasses = () => {
    const rounded = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    };
    return rounded[local.rounded || 'xl'];
  };

  const getPaddingClasses = () => {
    const size = local.size || 'md';
    const paddingMap = {
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };
    return paddingMap[size];
  };

  const baseClasses = cn(
    // Base styles
    'relative overflow-hidden',

    // Glass morphism
    getVariantClasses(),
    getBlurClasses(),

    // Border
    local.border !== false && 'border',

    // Rounded corners
    getRoundedClasses(),

    // Shadow
    getShadowClasses(),

    // Size/padding
    getPaddingClasses(),

    // Animations
    local.animated && 'transition-all duration-300',
    local.hoverable && [
      'hover:bg-white/30 hover:border-white/40',
      'hover:shadow-xl hover:shadow-purple-500/20',
      'hover:-translate-y-1 hover:scale-[1.02]',
      'cursor-pointer',
    ],

    // Focus styles
    local.hoverable &&
      'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2',

    // Custom class
    local.class
  );

  const overlayClasses = cn(
    'absolute inset-0 opacity-0 transition-opacity duration-300',
    'bg-gradient-to-br from-white/10 via-transparent to-purple-500/10',
    local.hoverable && 'hover:opacity-100'
  );

  const gradientClasses = cn(
    'absolute inset-0 opacity-20',
    'bg-gradient-to-br from-transparent via-white/5 to-transparent',
    local.animated && 'animate-pulse'
  );

  return (
    <div {...others} class={baseClasses} tabindex={local.hoverable ? 0 : undefined}>
      {/* Overlay effect */}
      <Show when={local.overlay !== false}>
        <div class={overlayClasses} />
      </Show>

      {/* Gradient background */}
      <Show when={local.gradient}>
        <div class={gradientClasses} />
      </Show>

      {/* Shimmer effect */}
      <Show when={local.hoverable}>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      </Show>

      {/* Content container */}
      <div class="relative z-10 h-full flex flex-col">
        {/* Header */}
        <Show when={local.header}>
          <div class="mb-4 pb-4 border-b border-white/20">{local.header}</div>
        </Show>

        {/* Main content */}
        <div class="flex-1">{c()}</div>

        {/* Footer */}
        <Show when={local.footer}>
          <div class="mt-4 pt-4 border-t border-white/20">{local.footer}</div>
        </Show>
      </div>

      {/* Floating dots decoration */}
      <Show when={local.animated}>
        <div class="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div class="absolute bottom-4 left-4 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse animation-delay-500" />
        <div class="absolute top-1/2 left-4 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-pulse animation-delay-1000" />
      </Show>
    </div>
  );
}
