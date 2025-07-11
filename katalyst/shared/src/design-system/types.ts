import type { ComponentProps, ReactNode } from 'react';

export interface DesignSystemTheme {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    neutral: Record<string, string>;
    success: Record<string, string>;
    warning: Record<string, string>;
    error: Record<string, string>;
  };
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
}

export interface DesignSystemConfig {
  theme: DesignSystemTheme;
  darkMode: boolean;
  rtl: boolean;
  prefix?: string;
}

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

export interface RadixComponentProps extends BaseComponentProps {
  asChild?: boolean;
}

export interface AntComponentProps extends BaseComponentProps {
  size?: 'small' | 'middle' | 'large';
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'link';
}

export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';
