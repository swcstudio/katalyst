/**
 * Next.js Utilities - Katalyst Design System Integration
 *
 * This file imports shared Katalyst utilities and adds Next.js-specific helpers
 */

// Import shared Katalyst utilities
export {
  cn,
  getKatalystVar,
  setKatalystVar,
  katalystVar,
  responsive,
  conditional,
  focusRing,
  disabledState,
  loadingState,
  transition,
  shadow,
  border,
  text,
  spacing,
  flex,
  grid,
  mergeClasses,
  removeClass,
  hasClass,
} from '@katalyst-react/shared/utils/cn';

// Re-export the main cn function for backward compatibility
import { cn as sharedCn } from '@katalyst-react/shared/utils/cn';

/**
 * Format bytes to human readable format
 */
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytes') : (sizes[i] ?? 'Bytes')
  }`;
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Get absolute URL for the application
 */
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Convert string to URL-safe slug
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Convert slug back to readable string
 */
export function unslugify(str: string) {
  return str.replace(/-/g, ' ');
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**
 * Convert camelCase to sentence case
 */
export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Generate a random ID
 */
export function generateId(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key] as T[typeof key];
    }
  }

  return result;
}

/**
 * Format date to locale string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Get Katalyst CSS variable value
 */
export function getKatalystVar(name: string, fallback?: string): string {
  if (typeof window === 'undefined') return fallback || '';

  const varName = name.startsWith('--katalyst-') ? name : `--katalyst-${name}`;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

  return value || fallback || '';
}

/**
 * Set Katalyst CSS variable
 */
export function setKatalystVar(name: string, value: string): void {
  if (typeof window === 'undefined') return;

  const varName = name.startsWith('--katalyst-') ? name : `--katalyst-${name}`;
  document.documentElement.style.setProperty(varName, value);
}

/**
 * Create CSS variable reference for Katalyst tokens
 */
export function katalystVar(name: string, fallback?: string): string {
  const varName = name.startsWith('--katalyst-') ? name : `--katalyst-${name}`;
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`;
}

/**
 * Generate responsive class names
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
