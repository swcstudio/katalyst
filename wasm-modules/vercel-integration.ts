// Vercel Frontend Integration for Katalyst WASM Modules
// Unified API layer for stateful calls to all three WASM runtimes

export interface KatalystRuntimeConfig {
  deno?: {
    endpoint: string;
    apiKey?: string;
  };
  wasmex?: {
    endpoint: string;
    apiKey?: string;
  };
  wasmer?: {
    endpoint: string;
    apiKey?: string;
  };
  preferredRuntime?: 'deno' | 'wasmex' | 'wasmer';
  fallbackOrder?: ('deno' | 'wasmex' | 'wasmer')[];
}

export interface KatalystRequest {
  method: string;
  params: Record<string, any>;
  runtime?: 'deno' | 'wasmex' | 'wasmer';
  timeout?: number;
  retries?: number;
}

export interface KatalystResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  runtime: string;
  executionTime: number;
  requestId: string;
}

export class KatalystVercelClient {
  private config: KatalystRuntimeConfig;
  private state: Map<string, any> = new Map();
  private requestCounter = 0;

  constructor(config: KatalystRuntimeConfig) {
    this.config = config;
  }

  // Main method for executing stateful calls
  async executeStatefulCall<T = any>(
    request: KatalystRequest
  ): Promise<KatalystResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      const targetRuntime = request.runtime || 
        this.config.preferredRuntime || 
        'deno';

      let result = await this.executeOnRuntime(targetRuntime, request, requestId);

      // If the preferred runtime fails, try fallbacks
      if (!result.success && this.config.fallbackOrder) {
        for (const fallbackRuntime of this.config.fallbackOrder) {
          if (fallbackRuntime !== targetRuntime) {
            console.warn(`Retrying on ${fallbackRuntime} after ${targetRuntime} failed`);
            result = await this.executeOnRuntime(fallbackRuntime, request, requestId);
            if (result.success) break;
          }
        }
      }

      result.executionTime = Date.now() - startTime;
      result.requestId = requestId;

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        runtime: request.runtime || 'unknown',
        executionTime: Date.now() - startTime,
        requestId,
      };
    }
  }

  // Execute on specific runtime
  private async executeOnRuntime<T>(
    runtime: 'deno' | 'wasmex' | 'wasmer',
    request: KatalystRequest,
    requestId: string
  ): Promise<KatalystResponse<T>> {
    switch (runtime) {
      case 'deno':
        return this.executeDeno(request, requestId);
      case 'wasmex':
        return this.executeWasmex(request, requestId);
      case 'wasmer':
        return this.executeWasmer(request, requestId);
      default:
        throw new Error(`Unknown runtime: ${runtime}`);
    }
  }

  // Deno runtime execution
  private async executeDeno<T>(
    request: KatalystRequest,
    requestId: string
  ): Promise<KatalystResponse<T>> {
    const config = this.config.deno;
    if (!config) {
      throw new Error('Deno configuration not provided');
    }

    const response = await fetch(`${config.endpoint}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        method: request.method,
        params: request.params,
        state: Object.fromEntries(this.state),
      }),
    });

    if (!response.ok) {
      throw new Error(`Deno execution failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update local state if provided
    if (result.state) {
      Object.entries(result.state).forEach(([key, value]) => {
        this.state.set(key, value);
      });
    }

    return {
      success: true,
      data: result.data,
      runtime: 'deno',
      executionTime: 0, // Will be set by caller
      requestId,
    };
  }

  // Wasmex runtime execution (Elixir backend)
  private async executeWasmex<T>(
    request: KatalystRequest,
    requestId: string
  ): Promise<KatalystResponse<T>> {
    const config = this.config.wasmex;
    if (!config) {
      throw new Error('Wasmex configuration not provided');
    }

    const response = await fetch(`${config.endpoint}/api/katalyst/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        method: request.method,
        params: request.params,
        state: Object.fromEntries(this.state),
      }),
    });

    if (!response.ok) {
      throw new Error(`Wasmex execution failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Update local state if provided
    if (result.state) {
      Object.entries(result.state).forEach(([key, value]) => {
        this.state.set(key, value);
      });
    }

    return {
      success: result.success || false,
      data: result.data,
      error: result.error,
      runtime: 'wasmex',
      executionTime: 0, // Will be set by caller
      requestId,
    };
  }

  // Wasmer runtime execution
  private async executeWasmer<T>(
    request: KatalystRequest,
    requestId: string
  ): Promise<KatalystResponse<T>> {
    const config = this.config.wasmer;
    if (!config) {
      throw new Error('Wasmer configuration not provided');
    }

    const response = await fetch(`${config.endpoint}/katalyst/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        method: request.method,
        params: {
          ...request.params,
          state: Object.fromEntries(this.state),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Wasmer execution failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Update local state if provided
    if (result.state) {
      Object.entries(result.state).forEach(([key, value]) => {
        this.state.set(key, value);
      });
    }

    return {
      success: result.success || false,
      data: result.data,
      error: result.error,
      runtime: 'wasmer',
      executionTime: 0, // Will be set by caller
      requestId,
    };
  }

  // Batch execution across multiple runtimes
  async executeBatch<T = any>(
    requests: KatalystRequest[]
  ): Promise<KatalystResponse<T>[]> {
    const promises = requests.map(request => this.executeStatefulCall<T>(request));
    return Promise.all(promises);
  }

  // Stream execution for long-running tasks
  async executeStream<T = any>(
    request: KatalystRequest,
    onData: (data: T) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    const targetRuntime = request.runtime || this.config.preferredRuntime || 'deno';
    const config = this.config[targetRuntime];
    
    if (!config) {
      throw new Error(`Configuration not provided for runtime: ${targetRuntime}`);
    }

    const response = await fetch(`${config.endpoint}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        method: request.method,
        params: request.params,
        state: Object.fromEntries(this.state),
      }),
    });

    if (!response.ok) {
      throw new Error(`Stream execution failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              onData(data);
            } catch (error) {
              onError?.(error instanceof Error ? error.message : 'Parse error');
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Get current state
  getState(): Record<string, any> {
    return Object.fromEntries(this.state);
  }

  // Update state
  setState(updates: Record<string, any>): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.state.set(key, value);
    });
  }

  // Clear state
  clearState(): void {
    this.state.clear();
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `katalyst-${Date.now()}-${++this.requestCounter}`;
  }

  // Health check for all configured runtimes
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [runtime, config] of Object.entries(this.config)) {
      if (runtime === 'preferredRuntime' || runtime === 'fallbackOrder') continue;

      try {
        const response = await fetch(`${config.endpoint}/health`, {
          method: 'GET',
          headers: {
            ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
          },
        });
        results[runtime] = response.ok;
      } catch {
        results[runtime] = false;
      }
    }

    return results;
  }
}

// React Hook for Katalyst (if using React)
export function useKatalyst(config: KatalystRuntimeConfig) {
  const [client] = React.useState(() => new KatalystVercelClient(config));
  const [state, setState] = React.useState<Record<string, any>>({});

  const execute = React.useCallback(async <T = any>(request: KatalystRequest) => {
    const result = await client.executeStatefulCall<T>(request);
    setState(client.getState());
    return result;
  }, [client]);

  return {
    client,
    execute,
    state,
    setState: (updates: Record<string, any>) => {
      client.setState(updates);
      setState(client.getState());
    },
    clearState: () => {
      client.clearState();
      setState({});
    },
  };
}

// Export default client factory
export function createKatalystClient(config: KatalystRuntimeConfig) {
  return new KatalystVercelClient(config);
}
