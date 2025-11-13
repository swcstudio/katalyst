'use client';

import { useConfig, useHydration, useKatalystContext } from '@swcstudio/shared';
import Link from 'next/link';
import type React from 'react';
// Using simple Unicode icons instead of heroicons for Deno compatibility

interface BlogLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  children,
  title = 'Blog',
  description,
  showBackButton = true,
  backButtonText = 'Back to Blog',
  backButtonHref = '/blog',
}) => {
  const { config: katalystConfig, isInitialized } = useKatalystContext();
  const { config } = useConfig(katalystConfig);

  // Use Katalyst hydration for layout data
  const { data: layoutData, isHydrated } = useHydration(
    'blog-layout',
    {
      title,
      description,
      showBackButton,
      backButtonText,
      backButtonHref,
    },
    { enableStreaming: false }
  );

  if (!isInitialized || !isHydrated || !layoutData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {layoutData.showBackButton && (
                <Link
                  href={layoutData.backButtonHref}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-colors group"
                >
                  <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
                  {layoutData.backButtonText}
                </Link>
              )}

              <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors group"
              >
                <span className="text-base">🏠</span>
                Home
              </Link>
            </div>

            {/* Theme indicator */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  config.theme === 'dark'
                    ? 'bg-purple-500'
                    : config.theme === 'light'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                }`}
              ></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Katalyst {config.variant}
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {(layoutData.title || layoutData.description) && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              {layoutData.title && (
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {layoutData.title}
                </h1>
              )}
              {layoutData.description && (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {layoutData.description}
                </p>
              )}
            </div>
          </div>
        )}

        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Powered by</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
                <span className="font-semibold">Katalyst Framework</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/blog"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Katalyst Framework Indicators */}
      {config.features.some((f) => f.enabled) && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Features</div>
            <div className="flex flex-wrap gap-1">
              {config.features
                .filter((f) => f.enabled)
                .slice(0, 4)
                .map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                  >
                    {feature.name}
                  </span>
                ))}
              {config.features.filter((f) => f.enabled).length > 4 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{config.features.filter((f) => f.enabled).length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogLayout;
