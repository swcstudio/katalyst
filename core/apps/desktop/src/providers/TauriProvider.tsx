import React, { createContext, useContext, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-shell';
import { ask, message, save, open as openDialog } from '@tauri-apps/plugin-dialog';
import { 
  readTextFile, 
  writeTextFile, 
  exists, 
  BaseDirectory 
} from '@tauri-apps/plugin-fs';

interface TauriContextType {
  appInfo: AppInfo | null;
  systemInfo: SystemInfo | null;
  theme: string;
  isLoading: boolean;
  
  // File operations
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  openFileDialog: (options?: FileDialogOptions) => Promise<string | null>;
  saveFileDialog: (options?: FileDialogOptions) => Promise<string | null>;
  
  // System operations
  showNotification: (title: string, body: string) => Promise<void>;
  openUrl: (url: string) => Promise<void>;
  setTheme: (theme: string) => Promise<void>;
  
  // Dialog operations
  askQuestion: (message: string, title?: string) => Promise<boolean>;
  showMessage: (message: string, title?: string, type?: 'info' | 'warning' | 'error') => Promise<void>;
}

interface AppInfo {
  name: string;
  version: string;
  platform: string;
  arch: string;
}

interface SystemInfo {
  os: string;
  arch: string;
  version: string;
  memory?: string;
  cores?: string;
}

interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
  multiple?: boolean;
}

const TauriContext = createContext<TauriContextType | null>(null);

export function useTauri() {
  const context = useContext(TauriContext);
  if (!context) {
    throw new Error('useTauri must be used within a TauriProvider');
  }
  return context;
}

export function TauriProvider({ children }: { children: React.ReactNode }) {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [theme, setThemeState] = useState('system');
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [app, sys, currentTheme] = await Promise.all([
          invoke<AppInfo>('get_app_info'),
          invoke<SystemInfo>('get_system_info'),
          invoke<string>('get_theme'),
        ]);
        
        setAppInfo(app);
        setSystemInfo(sys);
        setThemeState(currentTheme);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Listen for deep link events
  useEffect(() => {
    const unlisten = listen<string>('deep-link-received', (event) => {
      console.log('Deep link received:', event.payload);
      // Handle deep link navigation
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  // File operations
  const readFile = async (path: string): Promise<string> => {
    return await readTextFile(path);
  };

  const writeFile = async (path: string, content: string): Promise<void> => {
    await writeTextFile(path, content);
  };

  const openFileDialog = async (options?: FileDialogOptions): Promise<string | null> => {
    return await openDialog({
      title: options?.title || 'Open File',
      defaultPath: options?.defaultPath,
      filters: options?.filters,
      multiple: options?.multiple || false,
    });
  };

  const saveFileDialog = async (options?: FileDialogOptions): Promise<string | null> => {
    return await save({
      title: options?.title || 'Save File',
      defaultPath: options?.defaultPath,
      filters: options?.filters,
    });
  };

  // System operations
  const showNotification = async (title: string, body: string): Promise<void> => {
    await invoke('show_notification', { title, body });
  };

  const openUrl = async (url: string): Promise<void> => {
    await open(url);
  };

  const setTheme = async (newTheme: string): Promise<void> => {
    await invoke('set_theme', { theme: newTheme });
    setThemeState(newTheme);
  };

  // Dialog operations
  const askQuestion = async (message: string, title?: string): Promise<boolean> => {
    return await ask(message, { title: title || 'Question', type: 'info' });
  };

  const showMessage = async (
    message: string, 
    title?: string, 
    type: 'info' | 'warning' | 'error' = 'info'
  ): Promise<void> => {
    await message(message, { title: title || 'Message', type });
  };

  const value: TauriContextType = {
    appInfo,
    systemInfo,
    theme,
    isLoading,
    readFile,
    writeFile,
    openFileDialog,
    saveFileDialog,
    showNotification,
    openUrl,
    setTheme,
    askQuestion,
    showMessage,
  };

  return (
    <TauriContext.Provider value={value}>
      {children}
    </TauriContext.Provider>
  );
}
