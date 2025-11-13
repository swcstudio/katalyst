import { renderHook, act } from '@testing-library/react';
import { threadController } from '@swcstudio/multithreading';
import { useMultithreading } from './useMultithreading';

beforeAll(async () => {
  await threadController.initialize({ rayonThreads: 2 });
});

afterAll(async () => {
  await threadController.shutdown();
});

describe('useMultithreading', () => {
  it('should batch process data', async () => {
    const { result } = renderHook(() => useMultithreading());
    const data = Array.from({ length: 1000 }, (_, i) => i);
    await act(async () => {
      const processed = await result.current.batchProcess(data, 100, 'double');
      expect(processed.length).toBe(1000);
      expect(processed[0]).toBe(0);
      expect(processed[99]).toBe(198);
    });
  });

  it('should use Web Worker for UI batch', async () => {
    const { result } = renderHook(() => useMultithreading());
    const uiData = [1,2,3,4];
    await act(async () => {
      const workerResult = await result.current.workerBatch(uiData, 'square');
      expect(workerResult).toEqual([1,4,9,16]);
    });
  });
});
