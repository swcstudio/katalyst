import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppStore } from '../stores/appStore';

export interface Theme {
  isDark: boolean;
  colors: {
    // Base colors
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    
    // Background colors
    background: string;
    surface: string;
    card: string;
    
    // Terminal colors
    terminal: string;
    cursor: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textInverse: string;
    
    // Border colors
    border: string;
    divider: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#FF9500',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    
    background: '#FFFFFF',
    surface: '#F2F2F7',
    card: '#FFFFFF',
    
    terminal: '#1C1C1E',
    cursor: '#007AFF',
    
    text: '#000000',
    textSecondary: '#6D6D70',
    textInverse: '#FFFFFF',
    
    border: '#C6C6C8',
    divider: '#E5E5E7',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    accent: '#FF9F0A',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',
    
    terminal: '#000000',
    cursor: '#0A84FF',
    
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textInverse: '#000000',
    
    border: '#38383A',
    divider: '#48484A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

const ThemeContext = createContext<Theme>(darkTheme);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const { theme: userTheme } = useAppStore();
  
  const theme = useMemo(() => {
    let selectedTheme = darkTheme; // Default to dark theme
    
    switch (userTheme) {
      case 'light':
        selectedTheme = lightTheme;
        break;
      case 'dark':
        selectedTheme = darkTheme;
        break;
      case 'auto':
      default:
        selectedTheme = systemColorScheme === 'light' ? lightTheme : darkTheme;
        break;
    }
    
    return selectedTheme;
  }, [userTheme, systemColorScheme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};