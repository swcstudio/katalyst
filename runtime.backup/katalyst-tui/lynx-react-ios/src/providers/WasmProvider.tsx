import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';

interface WasmModule {
  ZedWasmIDE: any;
  initialize: () => Promise<void>;
}

interface WasmContextType {
  wasm: WasmModule | null;
  ide: any | null;
  loading: boolean;
  error: string | null;
  initializeIDE: (config: any) => Promise<void>;
  executeCode: (code: string, language: string) => Promise<string>;
  openFile: (path: string) => Promise<string>;
  saveFile: (path: string, content: string) => Promise<void>;
  getCompletions: (filePath: string, position: number) => Promise<string>;
  runTerminalCommand: (command: string) => Promise<string>;
}

const WasmContext = createContext<WasmContextType | undefined>(undefined);

export const useWasm = () => {
  const context = useContext(WasmContext);
  if (!context) {
    throw new Error('useWasm must be used within WasmProvider');
  }
  return context;
};

export const WasmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wasm, setWasm] = useState<WasmModule | null>(null);
  const [ide, setIde] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wasmRef = useRef<WasmModule | null>(null);

  useEffect(() => {
    loadWasmModule();
  }, []);

  const loadWasmModule = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, we would load the WASM module here
      // For now, we'll simulate the loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulated WASM module
      const mockWasmModule: WasmModule = {
        ZedWasmIDE: class {
          constructor() {}
          async initialize(config: string) {
            console.log('IDE initialized with config:', config);
          }
          async open_file(path: string) {
            return `// Contents of ${path}\nconsole.log("Hello from ${path}");`;
          }
          async save_file(path: string, content: string) {
            console.log(`Saving ${path}:`, content);
          }
          async execute_in_sandbox(code: string, language: string) {
            return JSON.stringify({
              stdout: `Executed ${language} code successfully`,
              stderr: '',
              exit_code: 0,
              execution_time_ms: 100,
              memory_used_bytes: 1024,
            });
          }
          async get_completions(filePath: string, position: number) {
            return JSON.stringify({
              items: [
                {
                  label: 'console.log',
                  kind: 'Method',
                  detail: 'Logs to console',
                  documentation: 'Outputs a message to the console',
                  insert_text: 'console.log($0)',
                },
              ],
            });
          }
          async run_terminal_command(command: string) {
            return `$ ${command}\nCommand executed successfully`;
          }
          async export_to_parquet(path: string) {
            console.log(`Exporting to parquet: ${path}`);
          }
        },
        initialize: async () => {
          console.log('WASM module initialized');
        },
      };

      wasmRef.current = mockWasmModule;
      setWasm(mockWasmModule);

      // Initialize the IDE instance
      const ideInstance = new mockWasmModule.ZedWasmIDE();
      setIde(ideInstance);

      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load WASM module';
      setError(errorMessage);
      setLoading(false);
      Alert.alert('Error', errorMessage);
    }
  };

  const initializeIDE = async (config: any) => {
    if (!ide) {
      throw new Error('IDE not initialized');
    }
    await ide.initialize(JSON.stringify(config));
  };

  const executeCode = async (code: string, language: string): Promise<string> => {
    if (!ide) {
      throw new Error('IDE not initialized');
    }
    return await ide.execute_in_sandbox(code, language);
  };

  const openFile = async (path: string): Promise<string> => {
    if (!ide) {
      throw new Error('IDE not initialized');
    }
    return await ide.open_file(path);
  };

  const saveFile = async (path: string, content: string): Promise<void> => {
    if (!ide) {
      throw new Error('IDE not initialized');
    }
    await ide.save_file(path, content);
  };

  const getCompletions = async (filePath: string, position: number): Promise<string> => {
    if (!ide) {
      throw new Error('IDE not initialized');
    }
    return await ide.get_completions(filePath, position);
  };

  const runTerminalCommand = async (command: string): Promise<string> => {
    if (!ide) {
      throw new Error('IDE not initialized');
    }
    return await ide.run_terminal_command(command);
  };

  const value: WasmContextType = {
    wasm,
    ide,
    loading,
    error,
    initializeIDE,
    executeCode,
    openFile,
    saveFile,
    getCompletions,
    runTerminalCommand,
  };

  return <WasmContext.Provider value={value}>{children}</WasmContext.Provider>;
};