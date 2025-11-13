// Web Worker batch example
const worker = new Worker(new URL('./web_workers.ts', import.meta.url));
worker.postMessage({ id: 1, type: 'batch', data: [1,2,3,4,5], batchSize: 2 });
worker.onmessage = (e) => {
  if (e.data.id === 1) {
    console.log('Worker batch result:', e.data.result);
    worker.terminate();
  }
};
