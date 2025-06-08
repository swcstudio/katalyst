import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,

  include: [
    './apps/marketing/src/**/*.{ts,tsx}',
    './apps/blog/src/**/*.{ts,tsx,astro}',
    './apps/storefront/src/**/*.{ts,tsx}',
    './apps/astro-blog/src/**/*.{ts,tsx,astro}',
    './apps/astro-docs/src/**/*.{ts,tsx,astro}',
    './apps/remix-app/app/**/*.{ts,tsx}',
    './apps/sveltekit-spa/src/**/*.{ts,tsx,svelte}',
    './libs/*/src/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './libs/shared/**/*.{ts,tsx}',
  ],

  exclude: [],

  outdir: 'src/styled-system',

  theme: {
    extend: {
      tokens: {
        colors: {
          primary: {
            50: { value: '#ecfdf5' },
            100: { value: '#d1fae5' },
            200: { value: '#a7f3d0' },
            300: { value: '#6ee7b7' },
            400: { value: '#34d399' },
            500: { value: '#10b981' }, // Emerald-500 as accent color
            600: { value: '#059669' },
            700: { value: '#047857' },
            800: { value: '#065f46' },
            900: { value: '#064e3b' },
            950: { value: '#022c22' },
          },
          secondary: {
            50: { value: '#f5f3ff' },
            100: { value: '#ede9fe' },
            200: { value: '#ddd6fe' },
            300: { value: '#c4b5fd' },
            400: { value: '#a78bfa' },
            500: { value: '#8b5cf6' },
            600: { value: '#7c3aed' },
            700: { value: '#6d28d9' },
            800: { value: '#5b21b6' },
            900: { value: '#4c1d95' },
            950: { value: '#2e1065' },
          },
        },
      },
      semanticTokens: {
        colors: {
          'bg-canvas': {
            value: {
              base: '{colors.white}',
              _dark: '{colors.gray.900}', // Charcoal grey for dark mode
            },
          },
          'bg-surface': {
            value: {
              base: '{colors.gray.50}', // Lightest grey in Tailwind
              _dark: '{colors.gray.800}',
            },
          },
        },
      },
    },
  },

  jsxFramework: 'solid',

  logLevel: 'info',
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
