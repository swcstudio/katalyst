import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';
import { DesignSystem } from '../../shared/src/components/DesignSystem.tsx';
import { KatalystProvider } from '../../shared/src/components/KatalystProvider.tsx';
import { TRPCProvider } from '../../shared/src/components/TRPCProvider.tsx';
import { useConfigStore } from '../../shared/src/stores/config-store.ts';
import './index.css';
import { routeTree } from './routeTree.gen.ts';

const RemixAdminDashboard = lazy(() => import('../../remix/app/components/AdminDashboard.tsx'));
const NextMarketing = lazy(() => import('../../next/src/components/Marketing.tsx'));

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
      {type === 'admin' ? <RemixAdminDashboard /> : <NextMarketing />}
    </Suspense>
  );
}

export default function App() {
  const { theme, variant } = useConfigStore();

  return (
    <KatalystProvider config={{ integrations: [], theme, variant, features: [], plugins: [] }}>
      <DesignSystem>
        <TRPCProvider queryClient={queryClient}>
          <div className="katalyst-core-app" data-variant={variant}>
            <header className="bg-primary text-primary-foreground p-4">
              <h1 className="text-2xl font-bold">Katalyst Core - React 19 Web App</h1>
              <nav className="mt-2 space-x-4">
                <button
                  type="button"
                  className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80"
                  onClick={() =>
                    globalThis.dispatchEvent(
                      new CustomEvent('katalyst:navigate', {
                        detail: { to: 'admin' },
                      })
                    )
                  }
                >
                  Admin Dashboard
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80"
                  onClick={() =>
                    globalThis.dispatchEvent(
                      new CustomEvent('katalyst:navigate', {
                        detail: { to: 'marketing' },
                      })
                    )
                  }
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
        </TRPCProvider>
      </DesignSystem>
    </KatalystProvider>
  );
}
