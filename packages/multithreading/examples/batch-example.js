// Batch processing example
(async () => {
  await threadController.initialize({ rayonThreads: 4 });
  const processor = new BatchProcessor();
  const data = Array.from({length: 10000}, (_, i) => i);
  const batchedSquares = processor.batch_map(data, 1000, 'square');
  console.log('Batched sum:', processor.batch_reduce(batchedSquares, 1000, 'sum'));
  await threadController.shutdown();
})();
