// Deno Worker Multithreading Example for Katalyst

import { katalyst } from '../../wasm-modules/deno/katalyst-deno.ts';
import { createKatalystHooks, KatalystHooks } from '../../hooks/katalyst-hooks.ts';

interface WorkerTask {
  id: string;
  method: string;
  params: Record<string, any>;
  priority: number;
}

interface WorkerResult {
  taskId: string;
  result: any;
  executionTime: number;
  workerId: string;
}

class KatalystWorkerPool {
  private workers: Worker[] = [];
  private taskQueue: WorkerTask[] = [];
  private activeJobs = new Map<string, WorkerTask>();
  private hooks = createKatalystHooks('deno');

  constructor(private poolSize: number = navigator.hardwareConcurrency || 4) {
    this.initializeWorkerPool();
  }

  private async initializeWorkerPool(): Promise<void> {
    console.log(`Initializing worker pool with ${this.poolSize} workers`);
    
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(
        new URL('./katalyst-worker.ts', import.meta.url).href,
        { type: 'module', name: `katalyst-worker-${i}` }
      );

      worker.onmessage = this.handleWorkerMessage.bind(this);
      worker.onerror = this.handleWorkerError.bind(this);

      this.workers.push(worker);
    }

    await this.hooks.emit(KatalystHooks.HOOKS.INIT, {
      runtimeType: 'deno-multithreading',
      config: { poolSize: this.poolSize },
    });
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const { type, taskId, result, error, executionTime, workerId } = event.data;

    if (type === 'task-complete') {
      this.activeJobs.delete(taskId);
      
      if (error) {
        console.error(`Task ${taskId} failed:`, error);
        this.hooks.emit(KatalystHooks.HOOKS.RUNTIME_ERROR, {
          error: new Error(error),
          runtime: 'deno',
        });
      } else {
        console.log(`Task ${taskId} completed in ${executionTime}ms by ${workerId}`);
      }

      // Process next task in queue
      this.processNextTask();
    }
  }

  private handleWorkerError(error: ErrorEvent): void {
    console.error('Worker error:', error);
    this.hooks.emit(KatalystHooks.HOOKS.RUNTIME_ERROR, {
      error: error.error || new Error(error.message),
      runtime: 'deno',
    });
  }

  async addTask(task: Omit<WorkerTask, 'id'>): Promise<string> {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullTask: WorkerTask = { ...task, id: taskId };
    
    this.taskQueue.push(fullTask);
    this.taskQueue.sort((a, b) => b.priority - a.priority); // Higher priority first
    
    await this.hooks.emit(KatalystHooks.HOOKS.STATE_CHANGE, {
      newState: { taskQueueLength: this.taskQueue.length },
    });

    this.processNextTask();
    return taskId;
  }

  private processNextTask(): void {
    if (this.taskQueue.length === 0) return;

    // Find available worker
    const availableWorker = this.workers.find(
      worker => !Array.from(this.activeJobs.values())
        .some(job => this.getWorkerForTask(job.id) === worker)
    );

    if (!availableWorker) return; // All workers busy

    const task = this.taskQueue.shift()!;
    this.activeJobs.set(task.id, task);

    availableWorker.postMessage({
      type: 'execute-task',
      task,
    });
  }

  private getWorkerForTask(taskId: string): Worker | undefined {
    // Simple round-robin assignment based on task ID hash
    const hash = taskId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.workers[hash % this.workers.length];
  }

  async executeParallelTasks(
    tasks: Omit<WorkerTask, 'id'>[]
  ): Promise<WorkerResult[]> {
    console.log(`Executing ${tasks.length} tasks in parallel`);
    
    const taskPromises = tasks.map(async (task) => {
      const taskId = await this.addTask(task);
      
      return new Promise<WorkerResult>((resolve, reject) => {
        const checkCompletion = () => {
          if (!this.activeJobs.has(taskId) && !this.taskQueue.some(t => t.id === taskId)) {
            // Task completed - this is a simplified example
            // In a real implementation, you'd track results properly
            resolve({
              taskId,
              result: 'completed',
              executionTime: 0,
              workerId: 'unknown',
            });
          } else {
            setTimeout(checkCompletion, 100);
          }
        };
        checkCompletion();
      });
    });

    return Promise.all(taskPromises);
  }

  // Benchmark different task configurations
  async benchmark(): Promise<void> {
    console.log('Starting Katalyst multithreading benchmark...');

    const singleThreadStart = performance.now();
    
    // Single-threaded execution
    for (let i = 0; i < 10; i++) {
      await katalyst.executeStatefulCall('process_context', {
        data: { iteration: i, workload: 'heavy' },
      });
    }
    
    const singleThreadTime = performance.now() - singleThreadStart;
    console.log(`Single-threaded execution: ${singleThreadTime.toFixed(2)}ms`);

    // Multi-threaded execution
    const multiThreadStart = performance.now();
    
    const tasks = Array.from({ length: 10 }, (_, i) => ({
      method: 'process_context',
      params: { data: { iteration: i, workload: 'heavy' } },
      priority: 1,
    }));

    await this.executeParallelTasks(tasks);
    
    const multiThreadTime = performance.now() - multiThreadStart;
    console.log(`Multi-threaded execution: ${multiThreadTime.toFixed(2)}ms`);
    console.log(`Speedup: ${(singleThreadTime / multiThreadTime).toFixed(2)}x`);
  }

  getStats(): {
    poolSize: number;
    queueLength: number;
    activeJobs: number;
    totalTasks: number;
  } {
    return {
      poolSize: this.workers.length,
      queueLength: this.taskQueue.length,
      activeJobs: this.activeJobs.size,
      totalTasks: this.taskQueue.length + this.activeJobs.size,
    };
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down worker pool...');
    
    await this.hooks.emit(KatalystHooks.HOOKS.PRE_CLEANUP);
    
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.taskQueue = [];
    this.activeJobs.clear();
    
    await this.hooks.emit(KatalystHooks.HOOKS.POST_CLEANUP);
  }
}

// Usage example
async function runExample(): Promise<void> {
  const workerPool = new KatalystWorkerPool(4);

  // Add some tasks
  await workerPool.addTask({
    method: 'process_context',
    params: { message: 'Hello from task 1' },
    priority: 1,
  });

  await workerPool.addTask({
    method: 'execute_protocol',
    params: { protocol: 'test-protocol', data: { value: 42 } },
    priority: 2,
  });

  // Run benchmark
  await workerPool.benchmark();

  // Show stats
  console.log('Worker pool stats:', workerPool.getStats());

  // Cleanup
  await workerPool.shutdown();
}

if (import.meta.main) {
  await runExample();
}

export { KatalystWorkerPool };
