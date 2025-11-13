/**
 * Module Federation Entry Point for Katalyst Desktop
 * This file allows other micro-frontends to consume desktop components
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import { createKatalystApp } from '@katalyst/core';
import { useKatalyst } from '@katalyst/hooks';
import { ThemeProvider } from '@katalyst/design-system';
import { TauriProvider } from './providers/TauriProvider';
import { DesktopLayout } from './components/DesktopLayout';
import { routes } from './routes';

import './styles/globals.css';

// Export components for module federation
export { DesktopLayout } from './components/DesktopLayout';
export { Header } from './components/Header';
export { Sidebar } from './components/Sidebar';
export { TauriProvider } from './providers/TauriProvider';

// Export the main app component
export { App } from './App';

// Export routes for federation
export { routes };

// Export utilities
export * from './utils';

// Module Federation utilities
export async function loadRemoteModule<T = any>(
  remoteName: string,
  exposedModule: string
): Promise<T> {
  try {
    // @ts-ignore - Dynamic import for Module Federation
    const module = await import(`${remoteName}/${exposedModule}`);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load remote module ${remoteName}/${exposedModule}:`, error);
    throw error;
  }
}

// Helper to check if module federation is active
export function isFederated(): boolean {
  return typeof window !== 'undefined' && window.__POWERED_BY_MODULE_FEDERATION__;
}

// Extend window interface for Module Federation
declare global {
  interface Window {
    __POWERED_BY_MODULE_FEDERATION__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create router
const router = createRouter({ routeTree: routes });

// Katalyst app configuration
const katalystApp = createKatalystApp({
  features: ['core', 'hooks', 'design-system', 'api'],
  providers: [
    <QueryClientProvider client={queryClient} key="query-client">
      <TauriProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </TauriProvider>
    </QueryClientProvider>,
  ],
});

function App() {
  const { platform, isNative, notifications } = useKatalyst();

  React.useEffect(() => {
    if (isNative && notifications) {
      // Request notification permissions
      notifications.requestPermission();
    }
  }, [isNative, notifications]);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <DesktopLayout />
      <Toaster position="top-right" />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </div>
  );
}

// Render the app only if running standalone
if (typeof window !== 'undefined' && !window.__POWERED_BY_MODULE_FEDERATION__) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      {katalystApp.providers}
      <App />
    </React.StrictMode>
  );
}

// Module Federation bootstrap
export async function bootstrap() {
  console.log('Desktop app bootstrapped');
}

export async function mount(props: any) {
  const { container } = props;
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      {katalystApp.providers}
      <App />
    </React.StrictMode>
  );
}

export async function unmount(props: any) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container);
}
