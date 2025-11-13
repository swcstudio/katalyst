import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  
  // Production optimizations
  mode: 'production',
  
  source: {
    entry: {
      // Entry points for different packages
      core: './packages/core/src/index.ts',
      hooks: './packages/hooks/src/index.ts',
    },
  },

  output: {
    // Optimized output configuration
    target: 'web',
    distPath: {
      root: 'dist',
      js: 'js',
      css: 'css',
      svg: 'svg',
      font: 'font',
      wasm: 'wasm',
      image: 'img',
      media: 'media',
      html: '',
    },
    
    // Advanced chunking strategy
    polyfill: 'usage',
    cleanDistPath: true,
    minify: true,
    legalComments: 'none',
    
    // Modern browser targets for optimal performance
    overrideBrowserslist: [
      'Chrome >= 87',
      'Firefox >= 78', 
      'Safari >= 14',
      'Edge >= 87'
    ],
  },

  html: {
    template: './index.html',
    title: 'Katalyst Framework',
    meta: {
      description: 'Revolutionary React framework with native multithreading',
    },
  },

  performance: {
    // Bundle analysis and optimization
    bundleAnalyze: process.env.BUNDLE_ANALYZE === 'true' ? {} : undefined,
    
    // Performance budgets
    chunkSplit: {
      strategy: 'split-by-experience',
      minSize: 20000,
      maxSize: 200000,
      override: {
        chunks: 'all',
        minChunks: 1,
        cacheGroups: {
          // Vendor chunk for stable dependencies
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          // React chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          // Katalyst core functionality
          katalyst: {
            test: /[\\/](core|hooks)[\\/]/,
            name: 'katalyst',
            chunks: 'all',
            priority: 15,
          },
          // Common utilities
          utils: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    },
    
    // Preloading strategy
    preload: {
      type: 'all-chunks',
    },
    prefetch: {
      type: 'all-chunks',
    },
  },

  optimization: {
    // Production optimizations
    minimize: true,
    sideEffects: false,
    
    // Tree shaking configuration
    usedExports: true,
    providedExports: true,
    
    // Module concatenation
    concatenateModules: true,
    
    // Runtime optimization
    runtimeChunk: {
      name: 'runtime',
    },
    
    // Minimize CSS
    minimizer: [
      {
        minify: 'swc',
        exclude: /[\\/]node_modules[\\/]/,
      },
    ],
  },

  tools: {
    // RSpack optimizations
    rspack: (config, { addRules, mergeConfig }) => {
      // Add custom rules for better optimization
      addRules({
        test: /\.tsx?$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
                // Advanced optimizations
                minify: {
                  compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info'],
                  },
                  mangle: true,
                },
              },
            },
          },
        ],
      });

      // Production-specific configuration
      return mergeConfig(config, {
        resolve: {
          // Alias for smaller bundles
          alias: {
            '@katalyst/core': './packages/core/src',
            '@katalyst/hooks': './packages/hooks/src',
          },
          // Prefer ES modules
          mainFields: ['module', 'main'],
        },
        
        // Advanced module federation for micro-frontends
        plugins: [
          ...(config.plugins || []),
          // Add production-specific plugins here
        ],
        
        // Compression and caching
        optimization: {
          ...config.optimization,
          moduleIds: 'deterministic',
          chunkIds: 'deterministic',
        },
      });
    },
    
    // PostCSS configuration
    postcss: {
      postcssOptions: {
        plugins: [
          require('autoprefixer'),
          require('cssnano')({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
            }],
          }),
        ],
      },
    },
  },

  // Development server configuration (for production testing)
  server: {
    port: 3000,
    host: '0.0.0.0',
    compress: true,
    historyApiFallback: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },

  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.KATALYST_VERSION': JSON.stringify(process.env.npm_package_version || '1.0.0'),
    '__DEV__': false,
  },
});
