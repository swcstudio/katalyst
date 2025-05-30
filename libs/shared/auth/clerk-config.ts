import { useAuthStore } from '../state/auth-store';

export interface ClerkUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export const clerkConfig = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  appearance: {
    theme: 'custom',
    variables: {
      colorPrimary: '#10b981', // emerald.500
      colorBackground: '#ffffff',
      colorText: '#1f2937', // gray.800
      colorInputBackground: '#f9fafb', // gray.50
      colorInputText: '#1f2937', // gray.800
      colorDanger: '#ef4444', // red.500
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '0.375rem', // rounded-md
    }
  },
  userRoles: {
    admin: ['user:read', 'user:write', 'content:manage', 'settings:manage'],
    editor: ['content:write', 'content:read', 'user:read'],
    customer: ['content:read', 'orders:manage'],
    user: ['content:read']
  },
  onUserChange: (user: ClerkUser | null) => {
    if (user) {
      useAuthStore.getState().login(user);
    } else {
      useAuthStore.getState().logout();
    }
  }
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
