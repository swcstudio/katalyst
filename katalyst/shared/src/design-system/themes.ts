import type { DesignSystemConfig } from './types';
import { defaultTheme, darkTheme } from './tokens';

export const createTheme = (config: Partial<DesignSystemConfig> = {}): DesignSystemConfig => {
  const baseTheme = config.darkMode 
    ? { ...defaultTheme, ...darkTheme }
    : defaultTheme;

  return {
    theme: { ...baseTheme, ...config.theme },
    darkMode: config.darkMode ?? false,
    rtl: config.rtl ?? false,
    prefix: config.prefix,
  };
};

export const generateCSSVariables = (theme: DesignSystemConfig['theme']): string => {
  const cssVars: string[] = [];

  Object.entries(theme.colors).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([shade, value]) => {
      cssVars.push(`--color-${category}-${shade}: ${value};`);
    });
  });

  Object.entries(theme.typography).forEach(([category, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      cssVars.push(`--${category}-${key}: ${value};`);
    });
  });

  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars.push(`--spacing-${key}: ${value};`);
  });

  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars.push(`--border-radius-${key}: ${value};`);
  });

  Object.entries(theme.shadows).forEach(([key, value]) => {
    cssVars.push(`--shadow-${key}: ${value};`);
  });

  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    cssVars.push(`--breakpoint-${key}: ${value};`);
  });

  return `:root {\n  ${cssVars.join('\n  ')}\n}`;
};

export const generateTailwindTheme = (theme: DesignSystemConfig['theme']) => {
  return `@theme {
  ${Object.entries(theme.colors).map(([category, colors]) => 
    Object.entries(colors).map(([shade, value]) => 
      `--color-${category}-${shade}: ${value};`
    ).join('\n  ')
  ).join('\n  ')}
  
  ${Object.entries(theme.typography.fontFamily).map(([key, value]) => 
    `--font-family-${key}: ${value};`
  ).join('\n  ')}
  
  ${Object.entries(theme.typography.fontSize).map(([key, value]) => 
    `--font-size-${key}: ${value};`
  ).join('\n  ')}
  
  ${Object.entries(theme.spacing).map(([key, value]) => 
    `--spacing-${key}: ${value};`
  ).join('\n  ')}
  
  ${Object.entries(theme.borderRadius).map(([key, value]) => 
    `--border-radius-${key}: ${value};`
  ).join('\n  ')}
  
  ${Object.entries(theme.breakpoints).map(([key, value]) => 
    `--breakpoint-${key}: ${value};`
  ).join('\n  ')}
}`;
};
