'use client';

import { katalystConfig } from '@/lib/katalyst.config.ts';
import { KatalystProvider, useConfig, useHydration } from '@swcstudio/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const { config } = useConfig(katalystConfig);

  // Use Katalyst hydration for query client initialization
  const { data: queryClient, isHydrated } = useHydration(
    'query-client',
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          retry: 1,
        },
      },
    }),
    { enableStreaming: false }
  );

  if (!isHydrated || !queryClient) {
    return (
      <KatalystProvider config={config}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </KatalystProvider>
    );
  }

  return (
    <KatalystProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </KatalystProvider>
  );
}</text>
