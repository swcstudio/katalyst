import type { KatalystConfig } from '@swcstudio/shared';

export const katalystConfig: KatalystConfig = {
  variant: 'next',
  theme: 'system',
  features: [
    {
      name: 'react-compiler',
      enabled: false, // Matches next.config.ts
      config: {
        experimental: true,
      },
    },
    {
      name: 'hot-reload',
      enabled: true,
      config: {
        fastRefresh: true,
      },
    },
    {
      name: 'ssr',
      enabled: true,
      config: {
        streaming: true,
        suspense: true,
      },
    },
    {
      name: 'image-optimization',
      enabled: true,
      config: {
        formats: ['webp', 'avif'],
        sizes: [400, 768, 1024, 1200],
      },
    },
    {
      name: 'seo',
      enabled: true,
      config: {
        sitemap: true,
        robots: true,
        openGraph: true,
      },
    },
    {
      name: 'analytics',
      enabled: true,
      config: {
        googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
        vercelAnalytics: true,
      },
    },
  ],
  plugins: [
    {
      name: '@payloadcms/next',
      version: 'latest',
      config: {
        revalidateOnChange: true,
      },
    },
    {
      name: '@next/mdx',
      version: 'latest',
      config: {
        extension: /\.mdx?$/,
        options: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
      },
    },
  ],
  integrations: [
    {
      name: 'tanstack',
      type: 'framework',
      enabled: true,
      config: {
        router: false, // Using Next.js App Router
        query: true,
        form: false,
        table: false,
        virtual: false,
      },
    },
    {
      name: 'tailwind',
      type: 'ui',
      enabled: true,
      config: {
        darkMode: 'class',
        content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../shared/src/**/*.{js,ts,jsx,tsx}'],
        theme: {
          extend: {
            fontFamily: {
              sans: ['var(--font-inter)'],
              display: ['var(--font-display)'],
            },
          },
        },
      },
    },
    {
      name: 'biome',
      type: 'development',
      enabled: true,
      config: {
        linter: true,
        formatter: true,
        organizeImports: true,
      },
    },
    {
      name: 'storybook',
      type: 'development',
      enabled: true,
      config: {
        builder: 'rsbuild',
        addons: [
          '@storybook/addon-essentials',
          '@storybook/addon-interactions',
          '@storybook/addon-a11y',
        ],
        features: {
          buildStoriesJson: true,
        },
      },
    },
    {
      name: 'playwright',
      type: 'testing',
      enabled: true,
      config: {
        browsers: ['chromium', 'firefox', 'webkit'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'vitest',
      type: 'testing',
      enabled: true,
      config: {
        environment: 'jsdom',
        setupFiles: ['./src/lib/test-setup.ts'],
      },
    },
    {
      name: 'rspack',
      type: 'bundler',
      enabled: true,
      config: {
        plugins: ['swc', 'css', 'html'],
        optimization: {
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              shared: {
                name: 'shared',
                chunks: 'all',
                test: /[\\/]shared[\\/]/,
                priority: 10,
              },
              vendor: {
                name: 'vendor',
                chunks: 'all',
                test: /[\\/]node_modules[\\/]/,
                priority: 5,
              },
            },
          },
        },
        performance: {
          maxAssetSize: 250000,
          maxEntrypointSize: 250000,
        },
      },
    },
    {
      name: 'zustand',
      type: 'framework',
      enabled: true,
      config: {
        devtools: process.env.NODE_ENV === 'development',
        persist: true,
      },
    },
    {
      name: 'multithreading',
      type: 'automation',
      enabled: true,
      config: {
        autoInitialize: true,
        workerThreads: 4,
        maxBlockingThreads: 2,
        enableProfiling: process.env.NODE_ENV === 'development',
        enableReactIntegration: true,
      },
    },
  ],
  unifiedAppBuilder: {
    enabled: true,
    platforms: ['web', 'desktop'],
    frameworks: {
      desktop: 'tauri',
      mobile: 'rspeedy',
      metaverse: 'webxr',
    },
    sharedComponents: true,
    rustBackend: true,
    features: {
      crossPlatformComponents: true,
      sharedStateManagement: true,
      unifiedBuildSystem: true,
      hotReload: true,
    },
  },
  platformConfigs: {
    desktop: {
      tauri: {
        enabled: true,
        features: ['api-all', 'system-tray', 'updater', 'window-all'],
      },
    },
    mobile: {
      rspeedy: {
        enabled: false, // Not needed for marketing site
        features: [],
      },
    },
    metaverse: {
      webxr: {
        enabled: false, // Not needed for marketing site
        features: [],
      },
    },
  },
};

export default katalystConfig;
