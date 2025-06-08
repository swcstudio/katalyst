import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  roles: string[];
}

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async (user) => set({ user, isAuthenticated: true, isLoading: false }),
    logout: async () => set({ user: null, isAuthenticated: false, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
    checkAuth: async () => {},
  }))
);

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
