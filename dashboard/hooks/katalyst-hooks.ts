// Unified Katalyst Hooks System
// Cross-runtime compatible hook API

export interface KatalystHookContext {
  runtime: 'deno' | 'wasmex' | 'wasmer' | 'vercel';
  state: Record<string, any>;
  metadata: Record<string, any>;
}

export interface KatalystHookResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  nextHooks?: string[];
}

export type KatalystHookHandler<T = any> = (
  context: KatalystHookContext,
  payload?: any
) => Promise<KatalystHookResult<T>>;

export class KatalystHooks {
  private hooks: Map<string, KatalystHookHandler[]> = new Map();
  private globalContext: Partial<KatalystHookContext> = {};

  // Lifecycle Hooks
  static readonly HOOKS = {
    // Initialization hooks
    INIT: 'katalyst:init',
    PRE_INIT: 'katalyst:pre-init',
    POST_INIT: 'katalyst:post-init',
    
    // Execution hooks
    EXECUTE: 'katalyst:execute',
    PRE_EXECUTE: 'katalyst:pre-execute',
    POST_EXECUTE: 'katalyst:post-execute',
    
    // State management hooks
    STATE_CHANGE: 'katalyst:state-change',
    STATE_SYNC: 'katalyst:state-sync',
    
    // Runtime hooks
    RUNTIME_SWITCH: 'katalyst:runtime-switch',
    RUNTIME_ERROR: 'katalyst:runtime-error',
    
    // Cleanup hooks
    CLEANUP: 'katalyst:cleanup',
    PRE_CLEANUP: 'katalyst:pre-cleanup',
    POST_CLEANUP: 'katalyst:post-cleanup',
    
    // Custom event hooks
    CUSTOM: 'katalyst:custom',
  } as const;

  constructor(runtime: 'deno' | 'wasmex' | 'wasmer' | 'vercel') {
    this.globalContext = {
      runtime,
      state: {},
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  // Register a hook handler
  on<T = any>(hookName: string, handler: KatalystHookHandler<T>): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName)!.push(handler as KatalystHookHandler);
  }

  // Remove a hook handler
  off(hookName: string, handler?: KatalystHookHandler): void {
    if (!this.hooks.has(hookName)) return;

    if (handler) {
      const handlers = this.hooks.get(hookName)!;
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    } else {
      this.hooks.delete(hookName);
    }
  }

  // Emit a hook event
  async emit<T = any>(
    hookName: string, 
    payload?: any, 
    contextOverride?: Partial<KatalystHookContext>
  ): Promise<KatalystHookResult<T>[]> {
    const handlers = this.hooks.get(hookName) || [];
    
    const context: KatalystHookContext = {
      ...this.globalContext,
      ...contextOverride,
    } as KatalystHookContext;

    const results: KatalystHookResult<T>[] = [];

    for (const handler of handlers) {
      try {
        const result = await handler(context, payload);
        results.push(result);

        // If a handler requests next hooks, emit them
        if (result.nextHooks) {
          for (const nextHook of result.nextHooks) {
            const nextResults = await this.emit(nextHook, result.data, context);
            results.push(...nextResults);
          }
        }

        // Stop execution if handler failed and marked as critical
        if (!result.success && payload?.critical) {
          break;
        }
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  // Emit hook and wait for all handlers
  async emitSerial<T = any>(
    hookName: string,
    payload?: any,
    contextOverride?: Partial<KatalystHookContext>
  ): Promise<KatalystHookResult<T>> {
    const results = await this.emit<T>(hookName, payload, contextOverride);
    
    // Combine all results
    const success = results.every(r => r.success);
    const data = results.map(r => r.data).filter(Boolean);
    const errors = results.map(r => r.error).filter(Boolean);

    return {
      success,
      data: data.length === 1 ? data[0] : data,
      error: errors.length > 0 ? errors.join('; ') : undefined,
    };
  }

  // Update global context
  updateContext(updates: Partial<KatalystHookContext>): void {
    this.globalContext = { ...this.globalContext, ...updates };
  }

  // Get current context
  getContext(): Partial<KatalystHookContext> {
    return { ...this.globalContext };
  }

  // Utility method to create context-specific hooks
  createRuntimeHooks(runtime: KatalystHooks['globalContext']['runtime']) {
    return new KatalystHooks(runtime!);
  }
}

// Pre-defined hook handlers for common scenarios
export const CommonHooks = {
  // Initialization
  async initializeRuntime(
    context: KatalystHookContext, 
    payload: { runtimeType: string; config?: any }
  ): Promise<KatalystHookResult> {
    try {
      // Runtime-specific initialization logic would go here
      console.log(`Initializing ${payload.runtimeType} runtime...`);
      
      return {
        success: true,
        data: { 
          runtime: payload.runtimeType, 
          initialized: true,
          timestamp: new Date().toISOString() 
        },
        nextHooks: [KatalystHooks.HOOKS.POST_INIT],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
      };
    }
  },

  // State synchronization
  async syncState(
    context: KatalystHookContext,
    payload: { newState: Record<string, any> }
  ): Promise<KatalystHookResult> {
    try {
      // Merge new state with existing state
      const updatedState = { ...context.state, ...payload.newState };
      
      return {
        success: true,
        data: updatedState,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'State sync failed',
      };
    }
  },

  // Error handling
  async handleRuntimeError(
    context: KatalystHookContext,
    payload: { error: Error; runtime: string }
  ): Promise<KatalystHookResult> {
    console.error(`Runtime error in ${payload.runtime}:`, payload.error);
    
    return {
      success: true,
      data: {
        error: payload.error.message,
        runtime: payload.runtime,
        timestamp: new Date().toISOString(),
        handled: true,
      },
    };
  },

  // Cleanup
  async cleanup(
    context: KatalystHookContext
  ): Promise<KatalystHookResult> {
    try {
      // Perform cleanup operations
      console.log(`Cleaning up ${context.runtime} runtime...`);
      
      return {
        success: true,
        data: { cleaned: true, runtime: context.runtime },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cleanup failed',
      };
    }
  },
};

// Export singleton for each runtime
export const createKatalystHooks = (
  runtime: 'deno' | 'wasmex' | 'wasmer' | 'vercel'
) => {
  const hooks = new KatalystHooks(runtime);
  
  // Register common hooks
  hooks.on(KatalystHooks.HOOKS.INIT, CommonHooks.initializeRuntime);
  hooks.on(KatalystHooks.HOOKS.STATE_SYNC, CommonHooks.syncState);
  hooks.on(KatalystHooks.HOOKS.RUNTIME_ERROR, CommonHooks.handleRuntimeError);
  hooks.on(KatalystHooks.HOOKS.CLEANUP, CommonHooks.cleanup);
  
  return hooks;
};
