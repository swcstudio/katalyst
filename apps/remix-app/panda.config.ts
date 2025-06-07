import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: ['./app/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: './app/styled-system',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
      },
    },
  },
});
