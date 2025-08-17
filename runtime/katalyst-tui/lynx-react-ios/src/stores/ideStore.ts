import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IDEConfig {
  theme: 'dark' | 'light';
  fontSize: number;
  tabSize: number;
  enableLSP: boolean;
  enableSandbox: boolean;
  sandboxMemoryLimit: number;
  sandboxCPULimit: number;
  parquetOutputPath: string | null;
}

interface FileInfo {
  path: string;
  name: string;
  lastModified: Date;
}

interface IDEStore {
  // Configuration
  config: IDEConfig;
  updateConfig: (updates: Partial<IDEConfig>) => void;
  loadConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
  
  // File management
  currentFile: string | null;
  setCurrentFile: (path: string | null) => void;
  recentFiles: FileInfo[];
  addRecentFile: (path: string) => void;
  clearRecentFiles: () => void;
  
  // Editor state
  editorContent: string;
  setEditorContent: (content: string) => void;
  cursorPosition: { line: number; column: number };
  setCursorPosition: (position: { line: number; column: number }) => void;
  
  // Terminal state
  terminalHistory: string[];
  addToTerminalHistory: (command: string) => void;
  clearTerminalHistory: () => void;
  
  // Sandbox state
  sandboxResults: Map<string, any>;
  addSandboxResult: (id: string, result: any) => void;
  clearSandboxResults: () => void;
  
  // UI state
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
  bottomPanelHeight: number;
  setBottomPanelHeight: (height: number) => void;
  
  // Application state
  isInitialized: boolean;
  initialize: () => Promise<void>;
  reset: () => void;
}

const defaultConfig: IDEConfig = {
  theme: 'dark',
  fontSize: 14,
  tabSize: 4,
  enableLSP: true,
  enableSandbox: true,
  sandboxMemoryLimit: 512 * 1024 * 1024, // 512MB
  sandboxCPULimit: 1.0,
  parquetOutputPath: null,
};

export const useIDEStore = create<IDEStore>((set, get) => ({
  // Configuration
  config: defaultConfig,
  
  updateConfig: (updates) => {
    set((state) => ({
      config: { ...state.config, ...updates },
    }));
    get().saveConfig();
  },
  
  loadConfig: async () => {
    try {
      const stored = await AsyncStorage.getItem('@ide_config');
      if (stored) {
        const config = JSON.parse(stored);
        set({ config: { ...defaultConfig, ...config } });
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  },
  
  saveConfig: async () => {
    try {
      await AsyncStorage.setItem('@ide_config', JSON.stringify(get().config));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  },
  
  // File management
  currentFile: null,
  setCurrentFile: (path) => set({ currentFile: path }),
  
  recentFiles: [],
  
  addRecentFile: (path) => {
    set((state) => {
      const existing = state.recentFiles.findIndex((f) => f.path === path);
      const newFile: FileInfo = {
        path,
        name: path.split('/').pop() || path,
        lastModified: new Date(),
      };
      
      let updated = [...state.recentFiles];
      if (existing >= 0) {
        updated.splice(existing, 1);
      }
      updated.unshift(newFile);
      
      // Keep only last 20 files
      if (updated.length > 20) {
        updated = updated.slice(0, 20);
      }
      
      // Save to AsyncStorage
      AsyncStorage.setItem('@recent_files', JSON.stringify(updated)).catch(console.error);
      
      return { recentFiles: updated };
    });
  },
  
  clearRecentFiles: () => {
    set({ recentFiles: [] });
    AsyncStorage.removeItem('@recent_files').catch(console.error);
  },
  
  // Editor state
  editorContent: '',
  setEditorContent: (content) => set({ editorContent: content }),
  
  cursorPosition: { line: 0, column: 0 },
  setCursorPosition: (position) => set({ cursorPosition: position }),
  
  // Terminal state
  terminalHistory: [],
  
  addToTerminalHistory: (command) => {
    set((state) => {
      const updated = [...state.terminalHistory, command];
      // Keep only last 100 commands
      if (updated.length > 100) {
        return { terminalHistory: updated.slice(-100) };
      }
      return { terminalHistory: updated };
    });
  },
  
  clearTerminalHistory: () => set({ terminalHistory: [] }),
  
  // Sandbox state
  sandboxResults: new Map(),
  
  addSandboxResult: (id, result) => {
    set((state) => {
      const updated = new Map(state.sandboxResults);
      updated.set(id, result);
      // Keep only last 50 results
      if (updated.size > 50) {
        const firstKey = updated.keys().next().value;
        updated.delete(firstKey);
      }
      return { sandboxResults: updated };
    });
  },
  
  clearSandboxResults: () => set({ sandboxResults: new Map() }),
  
  // UI state
  sidebarVisible: true,
  setSidebarVisible: (visible) => set({ sidebarVisible: visible }),
  
  bottomPanelHeight: 200,
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),
  
  // Application state
  isInitialized: false,
  
  initialize: async () => {
    const state = get();
    if (state.isInitialized) return;
    
    // Load config
    await state.loadConfig();
    
    // Load recent files
    try {
      const stored = await AsyncStorage.getItem('@recent_files');
      if (stored) {
        const files = JSON.parse(stored);
        set({ recentFiles: files });
      }
    } catch (error) {
      console.error('Failed to load recent files:', error);
    }
    
    // Load terminal history
    try {
      const stored = await AsyncStorage.getItem('@terminal_history');
      if (stored) {
        const history = JSON.parse(stored);
        set({ terminalHistory: history });
      }
    } catch (error) {
      console.error('Failed to load terminal history:', error);
    }
    
    set({ isInitialized: true });
  },
  
  reset: () => {
    set({
      config: defaultConfig,
      currentFile: null,
      recentFiles: [],
      editorContent: '',
      cursorPosition: { line: 0, column: 0 },
      terminalHistory: [],
      sandboxResults: new Map(),
      sidebarVisible: true,
      bottomPanelHeight: 200,
      isInitialized: false,
    });
    
    // Clear AsyncStorage
    AsyncStorage.multiRemove([
      '@ide_config',
      '@recent_files',
      '@terminal_history',
    ]).catch(console.error);
  },
}));