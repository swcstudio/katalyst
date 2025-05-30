import { render } from 'solid-js/web';
import { Router } from '@tanstack/solid-router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { routeTree } from './routes';
import './styled-system/styles.css';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router routeTree={routeTree} />
    </QueryClientProvider>
  );
};

const root = document.getElementById('root');

if (root) {
  render(() => <App />, root);
} else {
  console.error('Root element not found');
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
