import { writable, type Writable } from 'svelte/store';
import type { AuthStore } from '../state/auth-store';

let authStoreInstance: Writable<AuthStore> | null = null;

export function createAuthStoreSvelte(): Writable<AuthStore> {
  if (authStoreInstance) return authStoreInstance;

  const initialState: AuthStore = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    setLoading: () => {},
    checkAuth: () => Promise.resolve(),
  };

  authStoreInstance = writable(initialState);

  if (typeof window !== 'undefined') {
    try {
      import('../state/auth-store').then(({ useAuthStore }) => {
        const unsubscribe = useAuthStore.subscribe((state) => {
          authStoreInstance?.set(state);
        });

        if (typeof window !== 'undefined') {
          window.addEventListener('beforeunload', unsubscribe);
        }
      }).catch(() => {
      });
    } catch {
    }
  }

  return authStoreInstance;
}

export const authStore = createAuthStoreSvelte();
