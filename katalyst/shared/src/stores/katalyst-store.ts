import { create } from 'zustand';
import { KatalystConfig } from '../types';

interface KatalystStore {
  config: KatalystConfig | null;
  isInitialized: boolean;
  setConfig: (config: KatalystConfig) => void;
  updateConfig: (updates: Partial<KatalystConfig>) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useKatalystStore = create<KatalystStore>((set, get) => ({
  config: null,
  isInitialized: false,
  setConfig: (config) => set({ config }),
  updateConfig: (updates) => set((state) => ({
    config: state.config ? { ...state.config, ...updates } : null
  })),
  setInitialized: (initialized) => set({ isInitialized: initialized })
}));
