import { RSpackConfig } from '../types';

export class RSpackIntegration {
  private config: RSpackConfig;

  constructor(config: RSpackConfig) {
    this.config = config;
  }

  generateConfig(variant: 'core' | 'remix' | 'nextjs') {
    const baseConfig = {
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      entry: this.getEntryPoint(variant),
      output: {
        path: './dist',
        filename: '[name].[contenthash:8].js',
        chunkFilename: '[name].[contenthash:8].chunk.js',
        publicPath: '/',
        clean: true
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/hooks': './src/hooks',
          '@/utils': './src/utils',
          '@/stores': './src/stores'
        }
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: 'builtin:swc-loader',
                options: {
                  jsc: {
                    parser: {
                      syntax: 'typescript',
                      tsx: true
                    },
                    transform: {
                      react: {
                        runtime: 'automatic'
                      }
                    }
                  }
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader']
          },
          {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            type: 'asset/resource'
          }
        ]
      },
      plugins: this.getPlugins(variant),
      optimization: this.config.optimization,
      performance: this.config.performance
    };

    return baseConfig;
  }

  private getEntryPoint(variant: 'core' | 'remix' | 'nextjs') {
    switch (variant) {
      case 'core':
        return './src/main.tsx';
      case 'remix':
        return './app/entry.client.tsx';
      case 'nextjs':
        return './src/app/page.tsx';
      default:
        return './src/main.tsx';
    }
  }

  private getPlugins(variant: 'core' | 'remix' | 'nextjs') {
    const plugins = [];

    if (this.config.plugins.includes('react')) {
      plugins.push({
        name: 'react-plugin',
        setup: () => ({})
      });
    }

    if (this.config.plugins.includes('svgr')) {
      plugins.push({
        name: 'svgr-plugin',
        setup: () => ({})
      });
    }

    if (this.config.plugins.includes('type-check')) {
      plugins.push({
        name: 'type-check-plugin',
        setup: () => ({})
      });
    }

    return plugins;
  }
}
