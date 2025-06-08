import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider } from '@tanstack/solid-router';
import { render } from 'solid-js/web';
import { useAuthStore } from '../../../libs/shared/state/auth-store';
import { StorefrontRouter } from './routes';

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={StorefrontRouter} />
    </QueryClientProvider>
  );
};

render(() => <App />, document.getElementById('root')!);

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
