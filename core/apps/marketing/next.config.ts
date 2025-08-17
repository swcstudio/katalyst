import createMDX from '@next/mdx';
import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
    serverComponentsExternalPackages: ['sharp', 'payload'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Deno compatibility + SVGR
  webpack: (config: any) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    };

    // SVGR configuration
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                'prefixIds',
              ],
            },
            titleProp: true,
            ref: true,
          },
        },
      ],
    });

    return config;
  },
  env: {
    PAYLOAD_CONFIG_PATH: './payload.config.ts',
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // Add any remark plugins you need
    ],
    rehypePlugins: [
      // Add any rehype plugins you need
    ],
  },
});

export default withPayload(withMDX(nextConfig));
