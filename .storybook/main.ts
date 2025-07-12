import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../core/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../remix/app/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../nextjs/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../shared/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  features: {
    buildStoriesJson: true,
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '../shared/src',
      '@katalyst/shared': '../shared/src/index.ts',
      '@katalyst/core': '../core/src/main.tsx',
      '@katalyst/remix': '../remix/app/root.tsx',
      '@katalyst/nextjs': '../nextjs/src/app/page.tsx',
    };
    
    return config;
  },
};

export default config;
