import React, { createContext, useContext, ReactNode } from 'react';
import { KatalystConfig } from '../types';
import { useKatalyst } from '../hooks/use-katalyst';

interface KatalystContextValue {
  config: KatalystConfig;
  updateConfig: (updates: Partial<KatalystConfig>) => void;
  isInitialized: boolean;
}

const KatalystContext = createContext<KatalystContextValue | null>(null);

interface KatalystProviderProps {
  children: ReactNode;
  config: KatalystConfig;
}

export function KatalystProvider({ children, config }: KatalystProviderProps) {
  const katalyst = useKatalyst(config);

  return (
    <KatalystContext.Provider value={katalyst}>
      {children}
    </KatalystContext.Provider>
  );
}

export function useKatalystContext() {
  const context = useContext(KatalystContext);
  if (!context) {
    throw new Error('useKatalystContext must be used within a KatalystProvider');
  }
  return context;
}
