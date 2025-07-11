import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { useConfigStore } from '../../shared/src/stores/config-store';
import { KatalystProvider } from '../../shared/src/components/KatalystProvider';
import { DesignSystem } from '../../shared/src/components/DesignSystem';
import './index.css';

const RemixAdminDashboard = lazy(() => import('../../remix/app/components/AdminDashboard'));
const NextjsMarketing = lazy(() => import('../../nextjs/src/components/Marketing'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function MicroFrontendLoader({ type }: { type: 'admin' | 'marketing' }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      {type === 'admin' ? <RemixAdminDashboard /> : <NextjsMarketing />}
    </Suspense>
  );
}

export default function App() {
  const { theme, variant } = useConfigStore();

  return (
    <KatalystProvider config={{ integrations: [], theme, variant, features: [], plugins: [] }}>
      <DesignSystem>
        <QueryClientProvider client={queryClient}>
          <div className="katalyst-core-app" data-variant={variant}>
            <header className="bg-primary text-primary-foreground p-4">
              <h1 className="text-2xl font-bold">Katalyst Core - React 19 Web App</h1>
              <nav className="mt-2 space-x-4">
                <button 
                  className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80"
                  onClick={() => window.dispatchEvent(new CustomEvent('katalyst:navigate', { detail: { to: 'admin' } }))}
                >
                  Admin Dashboard
                </button>
                <button 
                  className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80"
                  onClick={() => window.dispatchEvent(new CustomEvent('katalyst:navigate', { detail: { to: 'marketing' } }))}
                >
                  Marketing Site
                </button>
              </nav>
            </header>
            
            <main className="flex-1 p-6">
              <RouterProvider router={router} />
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="border rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Admin Dashboard Preview</h2>
                  <MicroFrontendLoader type="admin" />
                </section>
                
                <section className="border rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Marketing Site Preview</h2>
                  <MicroFrontendLoader type="marketing" />
                </section>
              </div>
            </main>
          </div>
        </QueryClientProvider>
      </DesignSystem>
    </KatalystProvider>
  );
}
