import { useStore } from 'zustand';
import type { AuthStore } from '../state/auth-store';

export function useAuthStoreRemix(): AuthStore {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
      setLoading: () => {},
      checkAuth: () => Promise.resolve(),
    };
  }

  try {
    const authModule = globalThis.require?.('../state/auth-store') || 
                     (globalThis as any).__authStore;
    if (authModule?.useAuthStore) {
      return useStore(authModule.useAuthStore);
    }
    throw new Error('Auth store not available');
  } catch {
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
      setLoading: () => {},
      checkAuth: () => Promise.resolve(),
    };
  }
}
