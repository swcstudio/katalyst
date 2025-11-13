import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  // App initialization
  initialized: boolean;
  firstLaunch: boolean;
  
  // User preferences
  theme: 'auto' | 'light' | 'dark';
  haptics: boolean;
  fontSize: number;
  fontFamily: string;
  
  // Terminal settings
  terminalTheme: string;
  shellPath: string;
  startupCommands: string[];
  
  // Actions
  initialize: () => Promise<void>;
  setTheme: (theme: 'auto' | 'light' | 'dark') => void;
  setHaptics: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setTerminalTheme: (theme: string) => void;
  setShellPath: (path: string) => void;
  addStartupCommand: (command: string) => void;
  removeStartupCommand: (command: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      initialized: false,
      firstLaunch: true,
      theme: 'auto',
      haptics: true,
      fontSize: 14,
      fontFamily: 'monospace',
      terminalTheme: 'katalyst-dark',
      shellPath: '/bin/zsh',
      startupCommands: [],

      // Actions
      initialize: async () => {
        try {
          // Perform any initialization tasks
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
          
          set({ 
            initialized: true,
            firstLaunch: false,
          });
        } catch (error) {
          console.error('App initialization failed:', error);
          set({ initialized: true }); // Still mark as initialized to prevent loading loop
        }
      },

      setTheme: (theme) => set({ theme }),
      setHaptics: (haptics) => set({ haptics }),
      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setTerminalTheme: (terminalTheme) => set({ terminalTheme }),
      setShellPath: (shellPath) => set({ shellPath }),
      
      addStartupCommand: (command) => {
        const { startupCommands } = get();
        if (!startupCommands.includes(command)) {
          set({ startupCommands: [...startupCommands, command] });
        }
      },
      
      removeStartupCommand: (command) => {
        const { startupCommands } = get();
        set({ startupCommands: startupCommands.filter(cmd => cmd !== command) });
      },
    }),
    {
      name: 'nocode-tui-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        theme: state.theme,
        haptics: state.haptics,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        terminalTheme: state.terminalTheme,
        shellPath: state.shellPath,
        startupCommands: state.startupCommands,
        firstLaunch: state.firstLaunch,
      }),
    }
  )
);