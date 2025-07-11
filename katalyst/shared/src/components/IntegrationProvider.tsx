import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { KatalystIntegration } from '../types';
import { useIntegrationStore } from '../stores/integration-store';

interface IntegrationContextValue {
  integrations: Map<string, KatalystIntegration>;
  loadedIntegrations: Set<string>;
  addIntegration: (integration: KatalystIntegration) => void;
  removeIntegration: (name: string) => void;
  toggleIntegration: (name: string) => void;
}

const IntegrationContext = createContext<IntegrationContextValue | null>(null);

interface IntegrationProviderProps {
  children: ReactNode;
  initialIntegrations?: KatalystIntegration[];
}

export function IntegrationProvider({ children, initialIntegrations = [] }: IntegrationProviderProps) {
  const store = useIntegrationStore();

  useEffect(() => {
    initialIntegrations.forEach(integration => {
      store.addIntegration(integration);
    });
  }, [initialIntegrations, store]);

  return (
    <IntegrationContext.Provider value={store}>
      {children}
    </IntegrationContext.Provider>
  );
}

export function useIntegrationContext() {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegrationContext must be used within an IntegrationProvider');
  }
  return context;
}
