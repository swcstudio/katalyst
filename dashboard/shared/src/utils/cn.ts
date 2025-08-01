/**
 * Katalyst Class Name Utilities
 *
 * Universal utilities for handling class names across all meta frameworks
 * Integrates with Katalyst Design System tokens and provides consistency
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines className values using clsx and tailwind-merge
 * Optimized for Katalyst design system integration
 *
 * @param inputs - Class name inputs (strings, conditionals, arrays, etc.)
 * @returns Merged and deduplicated class names
 *
 * @example
 * ```tsx
 * cn('base-class', condition && 'conditional-class', {
 *   'active': isActive,
 *   'disabled': isDisabled
 * })
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Get Katalyst CSS variable value (client-side only)
 *
 * @param name - Variable name (with or without --katalyst- prefix)
 * @param fallback - Fallback value if variable is not found
 * @returns CSS variable value or fallback
 */
export function getKatalystVar(name: string, fallback?: string): string {
  if (typeof window === 'undefined') return fallback || '';

  const varName = name.startsWith('--katalyst-') ? name : `--katalyst-${name}`;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

  return value || fallback || '';
}

/**
 * Set Katalyst CSS variable (client-side only)
 *
 * @param name - Variable name (with or without --katalyst- prefix)
 * @param value - Value to set
 */
export function setKatalystVar(name: string, value: string): void {
  if (typeof window === 'undefined') return;

  const varName = name.startsWith('--katalyst-') ? name : `--katalyst-${name}`;
  document.documentElement.style.setProperty(varName, value);
}

/**
 * Create CSS variable reference for Katalyst tokens
 *
 * @param name - Variable name (with or without --katalyst- prefix)
 * @param fallback - Fallback value
 * @returns CSS var() function call
 *
 * @example
 * ```tsx
 * const bgColor = katalystVar('color-background', '#ffffff');
 * // Returns: var(--katalyst-color-background, #ffffff)
 * ```
 */
export function katalystVar(name: string, fallback?: string): string {
  const varName = name.startsWith('--katalyst-') ? name : `--katalyst-${name}`;
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`;
}

/**
 * Generate responsive class names using Katalyst breakpoints
 *
 * @param base - Base class name
 * @param breakpoints - Breakpoint-specific class names
 * @returns Combined responsive class names
 *
 * @example
 * ```tsx
 * responsive('text-sm', {
 *   md: 'text-base',
 *   lg: 'text-lg',
 *   xl: 'text-xl'
 * })
 * // Returns: 'text-sm md:text-base lg:text-lg xl:text-xl'
 * ```
 */
export function responsive(base: string, breakpoints: Record<string, string> = {}): string {
  const classes = [base];

  Object.entries(breakpoints).forEach(([bp, className]) => {
    if (className) {
      classes.push(`${bp}:${className}`);
    }
  });

  return classes.join(' ');
}

/**
 * Create variant classes using Katalyst design tokens
 *
 * @param base - Base class name
 * @param variants - Variant configurations
 * @returns Variant class name mappings
 */
export function createVariants<T extends Record<string, any>>(
  base: string,
  variants: T
): Record<keyof T, string> {
  const result = {} as Record<keyof T, string>;

  Object.entries(variants).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result[key as keyof T] = cn(base, value);
    } else if (typeof value === 'object') {
      const variantClasses = Object.entries(value)
        .map(([prop, val]) => `${prop}-${val}`)
        .join(' ');
      result[key as keyof T] = cn(base, variantClasses);
    }
  });

  return result;
}

/**
 * Conditional class name helper with improved TypeScript support
 *
 * @param condition - Boolean condition
 * @param trueClass - Class names when condition is true
 * @param falseClass - Class names when condition is false
 * @returns Conditional class names
 *
 * @example
 * ```tsx
 * conditional(isActive, 'bg-blue-500', 'bg-gray-300')
 * ```
 */
export function conditional(
  condition: boolean,
  trueClass: ClassValue,
  falseClass?: ClassValue
): string {
  return cn(condition ? trueClass : falseClass);
}

/**
 * Create focus-visible ring classes using Katalyst tokens
 *
 * @param color - Focus ring color (defaults to Katalyst focus color)
 * @param offset - Ring offset (defaults to 2px)
 * @returns Focus ring class names
 */
export function focusRing(color?: string, offset = 2): string {
  const ringColor = color || 'var(--katalyst-color-border-focus)';
  return cn(
    'focus-visible:outline-none',
    `focus-visible:ring-2`,
    `focus-visible:ring-offset-${offset}`,
    `focus-visible:ring-[${ringColor}]`
  );
}

/**
 * Create disabled state classes using Katalyst tokens
 *
 * @param customStyles - Additional disabled styles
 * @returns Disabled state class names
 */
export function disabledState(customStyles?: ClassValue): string {
  return cn(
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    customStyles
  );
}

/**
 * Create loading state classes
 *
 * @param customStyles - Additional loading styles
 * @returns Loading state class names
 */
export function loadingState(customStyles?: ClassValue): string {
  return cn('cursor-wait', 'pointer-events-none', customStyles);
}

/**
 * Create transition classes using Katalyst animation tokens
 *
 * @param properties - CSS properties to transition
 * @param duration - Transition duration
 * @param easing - Transition easing function
 * @returns Transition class names
 */
export function transition(
  properties: string[] = ['all'],
  duration = 'var(--katalyst-animation-duration-200)',
  easing = 'var(--katalyst-animation-easing-out)'
): string {
  const props = properties.join(', ');
  return cn(`transition-[${props}]`, `duration-[${duration}]`, `ease-[${easing}]`);
}

/**
 * Create shadow classes using Katalyst shadow tokens
 *
 * @param size - Shadow size (xs, sm, md, lg, xl, 2xl)
 * @param hover - Hover shadow size
 * @returns Shadow class names
 */
export function shadow(
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'sm',
  hover?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
): string {
  const baseClasses = [`shadow-${size}`];
  if (hover) {
    baseClasses.push(`hover:shadow-${hover}`);
  }
  return cn(baseClasses);
}

/**
 * Create border classes using Katalyst border tokens
 *
 * @param width - Border width
 * @param color - Border color (defaults to Katalyst border color)
 * @param radius - Border radius
 * @returns Border class names
 */
export function border(
  width = 1,
  color?: string,
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
): string {
  const borderColor = color || 'var(--katalyst-color-border)';
  const classes = [`border-${width}`, `border-[${borderColor}]`];

  if (radius) {
    classes.push(`rounded-${radius}`);
  }

  return cn(classes);
}

/**
 * Create text classes using Katalyst typography tokens
 *
 * @param size - Text size
 * @param weight - Font weight
 * @param color - Text color (defaults to Katalyst primary text)
 * @returns Text class names
 */
export function text(
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl',
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold',
  color?: string
): string {
  const classes: string[] = [];

  if (size) classes.push(`text-${size}`);
  if (weight) classes.push(`font-${weight}`);

  const textColor = color || 'var(--katalyst-color-text-primary)';
  classes.push(`text-[${textColor}]`);

  return cn(classes);
}

/**
 * Create spacing classes using Katalyst spacing tokens
 *
 * @param type - Spacing type (margin or padding)
 * @param size - Spacing size
 * @param sides - Specific sides to apply spacing
 * @returns Spacing class names
 */
export function spacing(
  type: 'margin' | 'padding',
  size: string | number,
  sides?: 'x' | 'y' | 't' | 'r' | 'b' | 'l'
): string {
  const prefix = type === 'margin' ? 'm' : 'p';
  const suffix = sides ? `-${sides}` : '';
  return `${prefix}${suffix}-${size}`;
}

/**
 * Create flexbox utility classes
 *
 * @param direction - Flex direction
 * @param align - Align items
 * @param justify - Justify content
 * @param wrap - Flex wrap
 * @param gap - Gap between items
 * @returns Flexbox class names
 */
export function flex(
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse',
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline',
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly',
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse',
  gap?: string | number
): string {
  const classes = ['flex'];

  if (direction) classes.push(`flex-${direction}`);
  if (align) classes.push(`items-${align}`);
  if (justify) classes.push(`justify-${justify}`);
  if (wrap) classes.push(`flex-${wrap}`);
  if (gap) classes.push(`gap-${gap}`);

  return cn(classes);
}

/**
 * Create grid utility classes
 *
 * @param cols - Number of columns
 * @param rows - Number of rows
 * @param gap - Gap between items
 * @param align - Align items
 * @param justify - Justify items
 * @returns Grid class names
 */
export function grid(
  cols?: number | 'auto' | 'subgrid',
  rows?: number | 'auto' | 'subgrid',
  gap?: string | number,
  align?: 'start' | 'center' | 'end' | 'stretch',
  justify?: 'start' | 'center' | 'end' | 'stretch'
): string {
  const classes = ['grid'];

  if (cols) {
    if (typeof cols === 'number') {
      classes.push(`grid-cols-${cols}`);
    } else {
      classes.push(`grid-cols-${cols}`);
    }
  }

  if (rows) {
    if (typeof rows === 'number') {
      classes.push(`grid-rows-${rows}`);
    } else {
      classes.push(`grid-rows-${rows}`);
    }
  }

  if (gap) classes.push(`gap-${gap}`);
  if (align) classes.push(`items-${align}`);
  if (justify) classes.push(`justify-items-${justify}`);

  return cn(classes);
}

/**
 * Deep merge class names (useful for component composition)
 *
 * @param target - Target class names
 * @param source - Source class names to merge
 * @returns Merged class names
 */
export function mergeClasses(target: ClassValue, source: ClassValue): string {
  return cn(target, source);
}

/**
 * Remove specific classes from a class string
 *
 * @param classes - Original class string
 * @param toRemove - Classes to remove
 * @returns Filtered class string
 */
export function removeClass(classes: string, toRemove: string[]): string {
  const classArray = classes.split(' ');
  const filtered = classArray.filter((cls) => !toRemove.includes(cls));
  return filtered.join(' ');
}

/**
 * Check if classes contain specific class
 *
 * @param classes - Class string to check
 * @param target - Target class to find
 * @returns True if class is found
 */
export function hasClass(classes: string, target: string): boolean {
  return classes.split(' ').includes(target);
}

// Default export for convenience
export default cn;
