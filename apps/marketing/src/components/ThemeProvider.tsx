'use client';

import { useConfig, useHydration, useKatalystContext } from '@swcstudio/shared';
import React, { createContext, useContext } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  attribute?: string;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  attribute = 'class',
  storageKey = 'katalyst-theme',
}: ThemeProviderProps) {
  const { config, updateConfig } = useKatalystContext();
  const { config: themeConfig, updateFeature } = useConfig({
    ...config,
    theme: defaultTheme as any,
    features: [
      { name: 'theme-system', enabled: enableSystem, config: {} },
      { name: 'theme-mounted', enabled: false, config: {} },
    ],
  });

  const { data: systemTheme, isHydrated: systemThemeHydrated } = useHydration(
    'system-theme',
    'light' as 'light' | 'dark',
    { enableStreaming: false }
  );

  // Detect system theme preference using Katalyst hydration
  const { data: mediaQueryData, isHydrated: mediaQueryHydrated } = useHydration(
    'media-query-theme',
    null,
    {
      enableStreaming: false,
      fallback: 'light',
    }
  );

  // Initialize theme from storage using Katalyst hydration
  const { data: storedTheme, isHydrated: themeHydrated } = useHydration(
    'stored-theme',
    (() => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(storageKey) as Theme;
          if (stored && ['light', 'dark', 'system'].includes(stored)) {
            return stored;
          }
        }
        return config.theme || defaultTheme;
      } catch (error) {
        console.warn('Failed to read theme from localStorage:', error);
        return config.theme || defaultTheme;
      }
    })(),
    { enableStreaming: false }
  );

  // Calculate resolved theme
  const currentTheme = storedTheme || defaultTheme;
  const currentSystemTheme = systemTheme || 'light';
  const resolvedTheme: 'light' | 'dark' =
    currentTheme === 'system' ? currentSystemTheme : (currentTheme as 'light' | 'dark');
  const mounted = themeHydrated && systemThemeHydrated;

  // Apply theme to document using Katalyst hydration
  const { isHydrated: documentThemeApplied } = useHydration('document-theme', resolvedTheme, {
    enableStreaming: false,
    fallback: 'light',
  });

  // Apply theme effects when hydrated
  React.useEffect(() => {
    if (!mounted || !documentThemeApplied) return;

    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // Add current theme class
    if (attribute === 'class') {
      root.classList.add(resolvedTheme);
      body.classList.add(resolvedTheme);
    } else {
      root.setAttribute(attribute, resolvedTheme);
    }

    // Set color scheme for native inputs
    root.style.colorScheme = resolvedTheme;

    // Update meta theme color for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', resolvedTheme === 'dark' ? '#111827' : '#ffffff');
    }
  }, [resolvedTheme, mounted, attribute, documentThemeApplied]);

  const setTheme = (newTheme: Theme) => {
    if (!enableSystem && newTheme === 'system') {
      console.warn('System theme is disabled');
      return;
    }

    // Persist to localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme);
      }
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    // Update Katalyst config
    updateConfig({
      ...config,
      theme: newTheme as any,
    });

    // Update theme feature
    updateFeature('theme-system', newTheme === 'system');

    // Dispatch custom event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('themeChange', {
          detail: {
            theme: newTheme,
            resolvedTheme: newTheme === 'system' ? currentSystemTheme : newTheme,
          },
        })
      );
    }
  };

  const toggleTheme = () => {
    if (currentTheme === 'light') {
      setTheme('dark');
    } else if (currentTheme === 'dark') {
      setTheme(enableSystem ? 'system' : 'light');
    } else {
      setTheme('light');
    }
  };

  const value: ThemeContextValue = {
    theme: currentTheme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme: currentSystemTheme,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme toggle button component
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label="Toggle theme"
      title={`Current theme: ${theme}${theme === 'system' ? ` (${resolvedTheme})` : ''}`}
    >
      {resolvedTheme === 'dark' ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
      {theme === 'system' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
      )}
    </button>
  );
}

export default ThemeProvider;
