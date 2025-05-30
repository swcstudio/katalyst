import { render } from 'solid-js/web';
import { Router, useRoutes } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { useAuthStore } from '../../../libs/shared/state/auth-store';

const queryClient = new QueryClient();

const routes = [
  {
    path: '/',
    component: () => import('./pages/BlogHome'),
  },
  {
    path: '/posts/:slug',
    component: () => import('./pages/BlogPost'),
  },
];

const App = () => {
  const Routes = useRoutes(routes);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes />
      </Router>
    </QueryClientProvider>
  );
};

render(() => <App />, document.getElementById('root')!);

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
