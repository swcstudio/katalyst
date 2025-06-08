import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider } from '@tanstack/solid-router';
import { render } from 'solid-js/web';
import { router } from './routes';
import './styled-system/global.css';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

const root = document.getElementById('root');

if (root) {
  render(() => <App />, root);
} else {
  console.error('Root element not found');
}
