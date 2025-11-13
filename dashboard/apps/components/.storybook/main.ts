import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    'msw-storybook-addon',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_KATALYST_ENV: 'storybook',
  }),
  webpackFinal: async (config) => {
    // Fix for @katalyst/design-system imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@katalyst/components': __dirname + '/src',
      '@katalyst/design-system': __dirname + '/../../packages/design-system/src',
    };

    // Enable file loading for assets
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|ico)$/i,
      type: 'asset/resource',
    });

    return config;
  },
};

export default config;
