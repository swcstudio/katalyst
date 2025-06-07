import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set, get) => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,

    login: async () => {
      set({ isLoading: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({
          isAuthenticated: true,
          user: { id: '1', email: 'user@example.com', name: 'User' },
          isLoading: false,
        });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),

    checkAuth: async () => {
      set({ isLoading: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const isAuth = Math.random() > 0.5;
        set({
          isAuthenticated: isAuth,
          user: isAuth ? { id: '1', email: 'user@example.com', name: 'User' } : null,
          isLoading: false,
        });
      } catch (error) {
        set({ isLoading: false });
      }
    },
  }))
);
