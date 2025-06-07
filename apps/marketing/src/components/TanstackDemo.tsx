import { createQuery } from '@tanstack/solid-query';
import { createSignal, onMount } from 'solid-js';
import { useAuthStore } from '../../../libs/shared/state/auth-store';

export function TanstackDemo() {
  const authStore = useAuthStore();

  const demoQuery = createQuery(() => ({
    queryKey: ['demo-data'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        message: 'Tanstack Query working in SolidJS!',
        timestamp: new Date().toISOString(),
        features: ['Query', 'Router', 'Table', 'Form', 'Virtual', 'Store'],
      };
    },
  }));

  return (
    <div class="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
      <h3 class="text-xl font-semibold mb-4">Tanstack Ecosystem Demo</h3>

      <div class="mb-4">
        <h4 class="font-medium mb-2">Authentication State (Zustand)</h4>
        <p>Status: {authStore.isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
        {authStore.user && (
          <p>
            User: {authStore.user.name} ({authStore.user.email})
          </p>
        )}
        <button
          onClick={() => (authStore.isAuthenticated ? authStore.logout() : authStore.login())}
          disabled={authStore.isLoading}
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {authStore.isLoading ? 'Loading...' : authStore.isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </div>

      <div class="mb-4">
        <h4 class="font-medium mb-2">Tanstack Query Demo</h4>
        {demoQuery.isLoading && <p>Loading demo data...</p>}
        {demoQuery.error && <p class="text-red-500">Error loading data</p>}
        {demoQuery.data && (
          <div class="bg-white p-3 rounded border">
            <p class="font-medium">{demoQuery.data.message}</p>
            <p class="text-sm text-gray-600">Loaded at: {demoQuery.data.timestamp}</p>
            <div class="mt-2">
              <p class="text-sm font-medium">Available Tanstack Features:</p>
              <ul class="text-sm list-disc list-inside">
                {demoQuery.data.features.map((feature) => (
                  <li>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <button
          onClick={() => demoQuery.refetch()}
          class="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Refetch Data
        </button>
      </div>
    </div>
  );
}
