// Basic common types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, unknown>;
  status?: number;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  isActive?: boolean;
  isExternal?: boolean;
}

// Component types
export interface ComponentBaseProps {
  class?: string;
  id?: string;
  'data-testid'?: string;
}

export interface FormFieldProps extends ComponentBaseProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// UI Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg';
  fontFamily: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Re-export commonly used SolidJS types
export type {
  Accessor,
  Component,
  ComponentProps,
  JSX,
  ParentComponent,
  ParentProps,
  Setter,
  Signal,
} from 'solid-js';

// Global type definitions
declare global {
  interface Window {
    __SSE_APP_CONFIG__: {
      env: 'development' | 'staging' | 'production';
      apiUrl: string;
      version: string;
    };
  }
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
