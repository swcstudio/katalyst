import { create } from 'zustand';
import { KatalystIntegration } from '../types';

interface IntegrationStore {
  integrations: Map<string, KatalystIntegration>;
  loadedIntegrations: Set<string>;
  addIntegration: (integration: KatalystIntegration) => void;
  removeIntegration: (name: string) => void;
  toggleIntegration: (name: string) => void;
  markAsLoaded: (name: string) => void;
}

export const useIntegrationStore = create<IntegrationStore>((set, get) => ({
  integrations: new Map(),
  loadedIntegrations: new Set(),
  addIntegration: (integration) => set((state) => {
    const newIntegrations = new Map(state.integrations);
    newIntegrations.set(integration.name, integration);
    return { integrations: newIntegrations };
  }),
  removeIntegration: (name) => set((state) => {
    const newIntegrations = new Map(state.integrations);
    newIntegrations.delete(name);
    return { integrations: newIntegrations };
  }),
  toggleIntegration: (name) => set((state) => {
    const integration = state.integrations.get(name);
    if (integration) {
      const newIntegrations = new Map(state.integrations);
      newIntegrations.set(name, { ...integration, enabled: !integration.enabled });
      return { integrations: newIntegrations };
    }
    return state;
  }),
  markAsLoaded: (name) => set((state) => ({
    loadedIntegrations: new Set([...state.loadedIntegrations, name])
  }))
}));
