import React, { createContext, useContext, useMemo } from 'react';
import { useIDEStore } from '../stores/ideStore';

interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  fonts: {
    regular: string;
    mono: string;
  };
  sizes: {
    fontSize: number;
    tabSize: number;
  };
}

const darkTheme: Theme = {
  colors: {
    background: '#1e1e1e',
    surface: '#2d2d2d',
    primary: '#007ACC',
    secondary: '#4CAF50',
    text: '#d4d4d4',
    textSecondary: '#858585',
    border: '#3e3e3e',
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  },
  fonts: {
    regular: 'System',
    mono: 'Menlo',
  },
  sizes: {
    fontSize: 14,
    tabSize: 4,
  },
};

const lightTheme: Theme = {
  colors: {
    background: '#ffffff',
    surface: '#f5f5f5',
    primary: '#007ACC',
    secondary: '#4CAF50',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  },
  fonts: {
    regular: 'System',
    mono: 'Menlo',
  },
  sizes: {
    fontSize: 14,
    tabSize: 4,
  },
};

const ThemeContext = createContext<Theme>(darkTheme);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useIDEStore();
  
  const theme = useMemo(() => {
    const baseTheme = config.theme === 'dark' ? darkTheme : lightTheme;
    return {
      ...baseTheme,
      sizes: {
        fontSize: config.fontSize,
        tabSize: config.tabSize,
      },
    };
  }, [config.theme, config.fontSize, config.tabSize]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};