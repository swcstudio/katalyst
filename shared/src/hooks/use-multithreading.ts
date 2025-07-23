import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useKatalystContext } from '../components/KatalystProvider.tsx';

export interface MultithreadingHookConfig {
  autoInitialize?: boolean;
  workerThreads?: number;
  maxBlockingThreads?: number;
  enableProfiling?: boolean;
}

export interface ThreadTask<T = any> {
  id: string;
  operation: string;
  data: T;
  priority?: 'low' | 'normal' | 'high';
  timeout?: number;
}

export interface ThreadResult<T = any> {
  id: string;
  result: T;
  duration: number;
  threadId: string;
  status: 'completed' | 'failed' | 'timeout';
  error?: string;
}

export interface MultithreadingState {
  isInitialized: boolean;
  isLoading: boolean;
  activeThreads: number;
  completedTasks: number;
  failedTasks: number;
  averageTaskDuration: number;
  error: string | null;
}

export function useMultithreading(config: MultithreadingHookConfig = {}) {
  const { config: katalystConfig } = useKatalystContext();
  const [state, setState] = useState<MultithreadingState>({
    isInitialized: false,
    isLoading: false,
    activeThreads: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageTaskDuration: 0,
    error: null,
  });

  const nativeModule = useRef<any>(null);
  const taskQueue = useRef<Map<string, ThreadTask>>(new Map());
  const resultCallbacks = useRef<Map<string, (result: ThreadResult) => void>>(new Map());

  const initialize = useCallback(async () => {
    if (state.isInitialized) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const multithreading = await import('../native/index.js');
      nativeModule.current = multithreading;

      const systemInfo = multithreading.getSystemInfo();
      
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isLoading: false,
        activeThreads: systemInfo.rayonThreads,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize multithreading',
      }));
    }
  }, [state.isInitialized]);

  const runParallelTask = useCallback(async <T>(
    operation: string,
    data: T[],
    options: { chunkSize?: number; timeout?: number } = {}
  ): Promise<ThreadResult<T[]>> => {
    if (!nativeModule.current) {
      throw new Error('Multithreading not initialized');
    }

    const taskId = `parallel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();

    try {
      setState(prev => ({ ...prev, activeThreads: prev.activeThreads + 1 }));

      const result = await nativeModule.current.rayonParallelMap(
        data,
        operation,
        options.chunkSize || Math.ceil(data.length / 4)
      );

      const duration = performance.now() - startTime;
      
      setState(prev => ({
        ...prev,
        activeThreads: prev.activeThreads - 1,
        completedTasks: prev.completedTasks + 1,
        averageTaskDuration: (prev.averageTaskDuration * prev.completedTasks + duration) / (prev.completedTasks + 1),
      }));

      return {
        id: taskId,
        result,
        duration,
        threadId: 'rayon_pool',
        status: 'completed',
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        activeThreads: prev.activeThreads - 1,
        failedTasks: prev.failedTasks + 1,
      }));

      return {
        id: taskId,
        result: [] as T[],
        duration: performance.now() - startTime,
        threadId: 'rayon_pool',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const runAsyncTask = useCallback(async <T>(
    operation: string,
    data: T,
    options: { timeout?: number } = {}
  ): Promise<ThreadResult<T>> => {
    if (!nativeModule.current) {
      throw new Error('Multithreading not initialized');
    }

    const taskId = `async_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();

    try {
      setState(prev => ({ ...prev, activeThreads: prev.activeThreads + 1 }));

      const result = await nativeModule.current.tokioSpawnTask(operation, data);
      const duration = performance.now() - startTime;

      setState(prev => ({
        ...prev,
        activeThreads: prev.activeThreads - 1,
        completedTasks: prev.completedTasks + 1,
        averageTaskDuration: (prev.averageTaskDuration * prev.completedTasks + duration) / (prev.completedTasks + 1),
      }));

      return {
        id: taskId,
        result,
        duration,
        threadId: 'tokio_runtime',
        status: 'completed',
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        activeThreads: prev.activeThreads - 1,
        failedTasks: prev.failedTasks + 1,
      }));

      return {
        id: taskId,
        result: data,
        duration: performance.now() - startTime,
        threadId: 'tokio_runtime',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const createChannel = useCallback((bounded?: number) => {
    if (!nativeModule.current) {
      throw new Error('Multithreading not initialized');
    }

    return nativeModule.current.createCrossbeamChannel(bounded);
  }, []);

  const benchmark = useCallback(async (
    operation: string,
    dataSize: number
  ): Promise<ThreadResult<any>> => {
    if (!nativeModule.current) {
      throw new Error('Multithreading not initialized');
    }

    const taskId = `benchmark_${Date.now()}`;
    const startTime = performance.now();

    try {
      const result = await nativeModule.current.benchmarkParallelOperations(dataSize, operation);
      const duration = performance.now() - startTime;

      return {
        id: taskId,
        result,
        duration,
        threadId: 'benchmark',
        status: 'completed',
      };
    } catch (error) {
      return {
        id: taskId,
        result: null,
        duration: performance.now() - startTime,
        threadId: 'benchmark',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const getMetrics = useCallback(() => {
    if (!nativeModule.current) return null;
    
    try {
      return nativeModule.current.getPerformanceMetrics();
    } catch (error) {
      console.error('Failed to get metrics:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (config.autoInitialize !== false) {
      initialize();
    }
  }, [initialize, config.autoInitialize]);

  const api = useMemo(() => ({
    initialize,
    runParallelTask,
    runAsyncTask,
    createChannel,
    benchmark,
    getMetrics,
    state,
  }), [initialize, runParallelTask, runAsyncTask, createChannel, benchmark, getMetrics, state]);

  return api;
}

export function useParallelComputation<T>(
  data: T[],
  operation: string,
  dependencies: any[] = []
) {
  const { runParallelTask, state } = useMultithreading();
  const [result, setResult] = useState<ThreadResult<T[]> | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  const compute = useCallback(async () => {
    if (!data.length || !state.isInitialized) return;

    setIsComputing(true);
    try {
      const computeResult = await runParallelTask(operation, data);
      setResult(computeResult);
    } catch (error) {
      console.error('Parallel computation failed:', error);
    } finally {
      setIsComputing(false);
    }
  }, [data, operation, runParallelTask, state.isInitialized]);

  useEffect(() => {
    compute();
  }, [compute, ...dependencies]);

  return {
    result,
    isComputing,
    recompute: compute,
  };
}

export function useAsyncComputation<T>(
  operation: string,
  data: T,
  dependencies: any[] = []
) {
  const { runAsyncTask, state } = useMultithreading();
  const [result, setResult] = useState<ThreadResult<T> | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  const compute = useCallback(async () => {
    if (!state.isInitialized) return;

    setIsComputing(true);
    try {
      const computeResult = await runAsyncTask(operation, data);
      setResult(computeResult);
    } catch (error) {
      console.error('Async computation failed:', error);
    } finally {
      setIsComputing(false);
    }
  }, [operation, data, runAsyncTask, state.isInitialized]);

  useEffect(() => {
    compute();
  }, [compute, ...dependencies]);

  return {
    result,
    isComputing,
    recompute: compute,
  };
}
