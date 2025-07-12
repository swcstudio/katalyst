export interface IntegrationConfig {
  [key: string]: any;
}

export const integrationConfigs: Record<string, IntegrationConfig> = {
  tanstack: {
    router: {
      enabled: true,
      ssr: true,
      streaming: true,
      fileBasedRouting: true
    },
    query: {
      enabled: true,
      devtools: true,
      persistQueryClient: true
    },
    form: {
      enabled: true,
      validation: 'typia',
      realTimeValidation: true
    },
    table: {
      enabled: true,
      virtualScrolling: true,
      serverSidePagination: true
    },
    virtual: {
      enabled: true,
      windowedScrolling: true,
      dynamicSizing: true
    }
  },
  rspack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20
          }
        }
      },
      minimize: true,
      usedExports: true,
      sideEffects: false
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 250000,
      maxEntrypointSize: 250000
    }
  },
  emp: {
    federation: {
      name: 'katalyst-host',
      remotes: {},
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' }
      }
    },
    microFrontends: {
      routing: 'client-side',
      communication: 'event-bus',
      stateManagement: 'zustand'
    }
  },
  cosmos: {
    blockchain: 'evmos',
    web3: {
      enabled: true,
      walletConnect: true,
      metamask: true
    },
    components: {
      walletButton: true,
      transactionHistory: true,
      balanceDisplay: true
    }
  },
  stylex: {
    atomic: true,
    theme: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      }
    },
    plugins: ['autoprefixer', 'cssnano']
  },
  storybook: {
    builder: 'rsbuild',
    addons: [
      '@storybook/addon-essentials',
      '@storybook/addon-interactions',
      '@storybook/addon-a11y'
    ],
    features: {
      buildStoriesJson: true,
      storyStoreV7: true
    }
  },
  typia: {
    validation: {
      runtime: true,
      compile: true,
      optimize: true
    },
    serialization: {
      json: true,
      binary: true
    }
  },
  midscene: {
    ai: {
      model: 'gpt-4o',
      fallback: 'qwen2.5-vl'
    },
    automation: {
      browser: 'playwright',
      mobile: 'android',
      screenshots: true
    }
  }
};
