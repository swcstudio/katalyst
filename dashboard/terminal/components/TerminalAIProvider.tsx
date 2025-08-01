import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useTerminalAgentStore } from '../stores/terminal-agent-store.ts';

interface TerminalAgentContextValue {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  nativeModule: any;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

const TerminalAgentContext = createContext<TerminalAgentContextValue | null>(null);

interface TerminalAgentProviderProps {
  children: ReactNode;
  config?: {
    autoInitialize?: boolean;
    workerThreads?: number;
    maxBlockingThreads?: number;
    enableProfiling?: boolean;
  };
}

export function TerminalAgentProvider({
  children,
  config = { autoInitialize: true }
}: TerminalAgentProviderProps) {
  const [nativeModule, setNativeModule] = useState<any>(null);
  const store = useTerminalAgentStore();

  const initialize = async () => {
    if (store.isInitialized) return;

    store.setLoading(true);
    store.setError(null);

    try {
      const multithreading = await import('../native/index.js');

      const initResult = multithreading.initializeMultithreading();
      console.log('Multithreading initialization:', initResult);

      const systemInfo = multithreading.getSystemInfo();
      console.log('System info:', systemInfo);

      store.addThreadPool({
        id: 'rayon_global',
        type: 'rayon',
        workerCount: systemInfo.rayonThreads,
        activeTasks: 0,
        totalTasks: 0,
        isActive: true,
      });

      store.addThreadPool({
        id: 'tokio_runtime',
        type: 'tokio',
        workerCount: config.workerThreads || systemInfo.cpuCores,
        activeTasks: 0,
        totalTasks: 0,
        isActive: true,
      });

      setNativeModule(multithreading);
      store.setInitialized(true);
      store.setLoading(false);

      if (config.enableProfiling) {
        startMetricsCollection(multithreading);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize multithreading';
      store.setError(errorMessage);
      store.setLoading(false);
      console.error('Multithreading initialization failed:', error);
    }
  };

  const startMetricsCollection = (module: any) => {
    const collectMetrics = async () => {
      try {
        const metrics = module.getPerformanceMetrics();
        store.updateMetrics({
          memoryUsage: metrics.memoryUsageMb,
          cpuUsage: metrics.cpuCores,
          totalTasks: store.metrics.totalTasks,
          completedTasks: store.metrics.completedTasks,
          failedTasks: store.metrics.failedTasks,
        });
      } catch (error) {
        console.warn('Failed to collect metrics:', error);
      }
    };

    const interval = setInterval(collectMetrics, 5000);

    return () => clearInterval(interval);
  };

  const cleanup = () => {
    if (nativeModule) {
      try {
        nativeModule.shutdownMultithreading();
      } catch (error) {
        console.warn('Error during multithreading cleanup:', error);
      }
    }

    store.cleanup();
    setNativeModule(null);
  };

  useEffect(() => {
    if (config.autoInitialize) {
      initialize();
    }

    return () => {
      cleanup();
    };
  }, []);

  const contextValue: MultithreadingContextValue = {
    isInitialized: store.isInitialized,
    isLoading: store.isLoading,
    error: store.error,
    nativeModule,
    initialize,
    cleanup,
  };

  return (
    <MultithreadingContext.Provider value={contextValue}>
      {children}
    </MultithreadingContext.Provider>
  );
}

export function useMultithreadingContext() {
  const context = useContext(MultithreadingContext);
  if (!context) {
    throw new Error('useMultithreadingContext must be used within a MultithreadingProvider');
  }
  return context;
}

export function withMultithreading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function MultithreadingWrappedComponent(props: P) {
    return (
      <MultithreadingProvider>
        <Component {...props} />
      </MultithreadingProvider>
    );
  };
}
