// Web Workers wrapper for browser threading
self.onmessage = async (e) => {
  const { id, type, data } = e.data;
  let result;
  try {
    switch (type) {
      case 'map':
        const pool = threadController.createThreadPool('worker', { threads: 2 });
        result = await pool.map(data, 'double');
        break;
      case 'batch':
        const processor = new BatchProcessor();
        result = processor.batch_map(data, 100, 'square');
        break;
      default:
        result = { error: 'Unknown type' };
    }
  } catch (err) {
    result = { error: err.message };
  }
  self.postMessage({ id, result });
};
