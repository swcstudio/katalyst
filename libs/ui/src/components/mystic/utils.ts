import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Animation utilities
 */
export const animations = {
  // Entrance animations
  fadeIn: 'animate-in fade-in duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom-2 duration-300',
  slideInFromTop: 'animate-in slide-in-from-top-2 duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left-2 duration-300',
  slideInFromRight: 'animate-in slide-in-from-right-2 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-300',

  // Exit animations
  fadeOut: 'animate-out fade-out duration-200',
  slideOutToBottom: 'animate-out slide-out-to-bottom-2 duration-200',
  slideOutToTop: 'animate-out slide-out-to-top-2 duration-200',
  slideOutToLeft: 'animate-out slide-out-to-left-2 duration-200',
  slideOutToRight: 'animate-out slide-out-to-right-2 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',

  // Hover animations
  hoverScale: 'transition-transform hover:scale-105',
  hoverLift: 'transition-transform hover:-translate-y-1',
  hoverGlow: 'transition-all hover:shadow-lg hover:shadow-primary/25',

  // Focus animations
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  focusVisible:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
};

/**
 * Color variants for components
 */
export const colorVariants = {
  primary: {
    bg: 'bg-primary-500',
    hover: 'hover:bg-primary-600',
    text: 'text-white',
    border: 'border-primary-500',
    ring: 'ring-primary-500',
  },
  secondary: {
    bg: 'bg-secondary-500',
    hover: 'hover:bg-secondary-600',
    text: 'text-white',
    border: 'border-secondary-500',
    ring: 'ring-secondary-500',
  },
  accent: {
    bg: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    hover: 'hover:from-primary-600 hover:to-secondary-600',
    text: 'text-white',
    border: 'border-primary-500',
    ring: 'ring-primary-500',
  },
  neutral: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    hover: 'hover:bg-gray-200 dark:hover:bg-gray-700',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border-gray-300 dark:border-gray-600',
    ring: 'ring-gray-500',
  },
  success: {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    text: 'text-white',
    border: 'border-green-500',
    ring: 'ring-green-500',
  },
  warning: {
    bg: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    text: 'text-white',
    border: 'border-yellow-500',
    ring: 'ring-yellow-500',
  },
  danger: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    text: 'text-white',
    border: 'border-red-500',
    ring: 'ring-red-500',
  },
  ghost: {
    bg: 'bg-transparent',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-transparent',
    ring: 'ring-gray-500',
  },
};

/**
 * Size variants for components
 */
export const sizeVariants = {
  xs: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    height: 'h-6',
    icon: 'h-3 w-3',
  },
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    height: 'h-8',
    icon: 'h-4 w-4',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    height: 'h-10',
    icon: 'h-5 w-5',
  },
  lg: {
    padding: 'px-6 py-3',
    text: 'text-base',
    height: 'h-12',
    icon: 'h-6 w-6',
  },
  xl: {
    padding: 'px-8 py-4',
    text: 'text-lg',
    height: 'h-14',
    icon: 'h-7 w-7',
  },
};

/**
 * Typography utilities
 */
export const typography = {
  display: {
    xl: 'text-5xl font-bold tracking-tight',
    lg: 'text-4xl font-bold tracking-tight',
    md: 'text-3xl font-bold tracking-tight',
    sm: 'text-2xl font-bold tracking-tight',
    xs: 'text-xl font-bold tracking-tight',
  },
  heading: {
    xl: 'text-3xl font-semibold tracking-tight',
    lg: 'text-2xl font-semibold tracking-tight',
    md: 'text-xl font-semibold tracking-tight',
    sm: 'text-lg font-semibold tracking-tight',
    xs: 'text-base font-semibold tracking-tight',
  },
  body: {
    lg: 'text-lg leading-relaxed',
    md: 'text-base leading-relaxed',
    sm: 'text-sm leading-relaxed',
    xs: 'text-xs leading-relaxed',
  },
  caption: {
    lg: 'text-sm text-gray-600 dark:text-gray-400',
    md: 'text-xs text-gray-600 dark:text-gray-400',
    sm: 'text-xs text-gray-500 dark:text-gray-500',
  },
};

/**
 * Glass morphism utilities
 */
export const glassMorphism = {
  light: 'bg-white/80 backdrop-blur-sm border border-white/20',
  medium: 'bg-white/60 backdrop-blur-md border border-white/30',
  heavy: 'bg-white/40 backdrop-blur-lg border border-white/40',
  dark: 'bg-black/20 backdrop-blur-sm border border-white/10',
};

/**
 * Gradient utilities
 */
export const gradients = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
  secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
  accent: 'bg-gradient-to-r from-primary-500 via-purple-500 to-secondary-500',
  sunset: 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600',
  ocean: 'bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-600',
  forest: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600',
  rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  midnight: 'bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900',
};

/**
 * Shadow utilities
 */
export const shadows = {
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  glow: 'shadow-lg shadow-primary/25',
  glowHover: 'hover:shadow-xl hover:shadow-primary/30',
  colored: {
    primary: 'shadow-lg shadow-primary/25',
    secondary: 'shadow-lg shadow-secondary/25',
    success: 'shadow-lg shadow-green-500/25',
    warning: 'shadow-lg shadow-yellow-500/25',
    danger: 'shadow-lg shadow-red-500/25',
  },
};

/**
 * Border radius utilities
 */
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

/**
 * Component state utilities
 */
export const states = {
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-75 cursor-wait',
  active: 'ring-2 ring-primary ring-offset-2',
  focus: animations.focusVisible,
  hover: 'transition-all duration-200',
};

/**
 * Responsive utilities
 */
export const responsive = {
  mobile: 'block sm:hidden',
  tablet: 'hidden sm:block lg:hidden',
  desktop: 'hidden lg:block',
  mobileUp: 'sm:block',
  tabletUp: 'lg:block',
};

/**
 * Dark mode utilities
 */
export const darkMode = {
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
  },
  text: {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-700 dark:text-gray-300',
    tertiary: 'text-gray-500 dark:text-gray-400',
    muted: 'text-gray-400 dark:text-gray-500',
  },
  border: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
  },
};

/**
 * Component variant creator
 */
export function createVariants<T extends Record<string, Record<string, string>>>(variants: T) {
  return variants;
}

/**
 * Helper to generate component classes
 */
export function createComponentClasses({
  base,
  variants = {},
  defaultVariants = {},
}: {
  base: string;
  variants?: Record<string, Record<string, string>>;
  defaultVariants?: Record<string, string>;
}) {
  return (props: Record<string, any> = {}) => {
    const variantClasses = Object.entries(variants).map(([key, variantSet]) => {
      const value = props[key] ?? defaultVariants[key];
      return value ? variantSet[value] : '';
    });

    return cn(base, ...variantClasses, props.class);
  };
}

/**
 * Animation delay utilities
 */
export const animationDelays = {
  0: 'animation-delay-0',
  75: 'animation-delay-75',
  100: 'animation-delay-100',
  150: 'animation-delay-150',
  200: 'animation-delay-200',
  300: 'animation-delay-300',
  500: 'animation-delay-500',
  700: 'animation-delay-700',
  1000: 'animation-delay-1000',
};

/**
 * Stagger animation helper
 */
export function getStaggerDelay(index: number, baseDelay = 100): string {
  return `style="animation-delay: ${index * baseDelay}ms"`;
}
