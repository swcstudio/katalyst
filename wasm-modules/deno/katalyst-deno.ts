// Katalyst Deno WASM Module
// Unified interface for stateful calls from Vercel frontend

import init, { 
  KatalystRuntime, 
  WasmBridge,
  FieldProtocolShell,
  ControlLoop 
} from './katalyst_wasm_bg.js';

export interface KatalystState {
  runtime: KatalystRuntime;
  bridge: WasmBridge;
  protocol: FieldProtocolShell;
  controlLoop: ControlLoop;
}

export class KatalystDeno {
  private state: KatalystState | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await init();
    
    this.state = {
      runtime: new KatalystRuntime(),
      bridge: new WasmBridge(),
      protocol: new FieldProtocolShell(),
      controlLoop: new ControlLoop()
    };
    
    this.initialized = true;
  }

  async executeStatefulCall(
    method: string, 
    params: Record<string, any>
  ): Promise<any> {
    if (!this.state) {
      await this.initialize();
    }

    switch (method) {
      case 'process_context':
        return this.state!.runtime.processContext(JSON.stringify(params));
      
      case 'execute_protocol':
        return this.state!.protocol.execute(JSON.stringify(params));
      
      case 'control_loop_step':
        return this.state!.controlLoop.step(JSON.stringify(params));
      
      case 'bridge_call':
        return this.state!.bridge.call(params.target, JSON.stringify(params.data));
      
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  getState(): KatalystState | null {
    return this.state;
  }

  async cleanup(): Promise<void> {
    if (this.state) {
      // Cleanup WASM resources
      this.state = null;
      this.initialized = false;
    }
  }
}

// Export singleton instance
export const katalyst = new KatalystDeno();
