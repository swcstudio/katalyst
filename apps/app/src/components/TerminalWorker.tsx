import { useEffect, useRef, useState, useCallback } from 'react';
import { useChannelCommunication } from '../../../packages/core/src/stores/multithreading-store';
import { cn } from '../../../packages/design-system/src/utils/cn';

interface TerminalWorkerProps {
  sessionId: string;
  type: 'terminal' | 'browser' | 'devcontainer' | 'ai-agent';
  worker?: Worker;
  onExecute: (sessionId: string, command: string) => Promise<any>;
  channelId: string;
}

export function TerminalWorker({ 
  sessionId, 
  type, 
  worker, 
  onExecute,
  channelId 
}: TerminalWorkerProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { subscribe, publish } = useChannelCommunication();
  
  // WebGL-accelerated rendering context
  const glContextRef = useRef<WebGL2RenderingContext | null>(null);
  
  useEffect(() => {
    if (!worker) return;
    
    // Set up worker message handling
    const handleWorkerMessage = (event: MessageEvent) => {
      const { type: msgType, data } = event.data;
      
      switch (msgType) {
        case 'output':
          setLines(prev => [...prev, ...data.lines]);
          publish(channelId, {
            sessionId,
            type: 'output',
            data: data.lines,
          });
          break;
          
        case 'render':
          // WebGL rendering update
          if (canvasRef.current && glContextRef.current) {
            renderTerminalFrame(data.frame);
          }
          break;
          
        case 'status':
          setIsProcessing(data.processing);
          break;
          
        case 'error':
          console.error('Worker error:', data.error);
          setLines(prev => [...prev, `Error: ${data.error}`]);
          break;
      }
    };
    
    worker.addEventListener('message', handleWorkerMessage);
    
    // Subscribe to channel events
    const unsubscribe = subscribe(channelId, (data) => {
      if (data.sessionId === sessionId && data.type === 'input') {
        worker.postMessage({
          type: 'input',
          data: data.input,
        });
      }
    });
    
    // Initialize WebGL context for GPU-accelerated rendering
    if (canvasRef.current && type === 'terminal') {
      const gl = canvasRef.current.getContext('webgl2', {
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      
      if (gl) {
        glContextRef.current = gl;
        initializeWebGLTerminal(gl);
      }
    }
    
    return () => {
      worker.removeEventListener('message', handleWorkerMessage);
      unsubscribe();
    };
  }, [worker, sessionId, channelId, type, subscribe, publish]);
  
  const handleCommand = useCallback(async (command: string) => {
    if (!command.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setLines(prev => [...prev, `$ ${command}`]);
    
    try {
      // Execute command through multithreading system
      const result = await onExecute(sessionId, command);
      
      // Worker will handle the actual execution and output
      if (worker) {
        worker.postMessage({
          type: 'execute',
          command,
          taskId: result.id,
        });
      }
    } catch (error) {
      setLines(prev => [...prev, `Error: ${error}`]);
      setIsProcessing(false);
    }
    
    setCurrentInput('');
  }, [sessionId, worker, onExecute, isProcessing]);
  
  const initializeWebGLTerminal = (gl: WebGL2RenderingContext) => {
    // Vertex shader for terminal rendering
    const vertexShaderSource = `#version 300 es
      in vec2 a_position;
      in vec2 a_texCoord;
      out vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;
    
    // Fragment shader with terminal effects
    const fragmentShaderSource = `#version 300 es
      precision highp float;
      
      in vec2 v_texCoord;
      out vec4 outColor;
      
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform float u_scanline;
      uniform float u_glow;
      
      void main() {
        vec4 color = texture(u_texture, v_texCoord);
        
        // CRT scanline effect
        float scanline = sin(v_texCoord.y * 800.0 + u_time * 5.0) * 0.04;
        color.rgb -= scanline * u_scanline;
        
        // Phosphor glow effect
        vec3 glow = color.rgb * u_glow;
        color.rgb += glow * 0.5;
        
        // Slight chromatic aberration
        color.r = texture(u_texture, v_texCoord + vec2(0.001, 0.0)).r;
        color.b = texture(u_texture, v_texCoord - vec2(0.001, 0.0)).b;
        
        outColor = color;
      }
    `;
    
    // Compile and link shaders (implementation details omitted for brevity)
    // This would set up the WebGL pipeline for GPU-accelerated terminal rendering
  };
  
  const renderTerminalFrame = (frameData: any) => {
    // GPU-accelerated frame rendering
    const gl = glContextRef.current;
    if (!gl) return;
    
    // Render terminal frame using WebGL
    // Implementation would update textures and draw the terminal display
  };
  
  // Render different UI based on session type
  if (type === 'browser') {
    return (
      <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <input
            type="text"
            className="flex-1 px-3 py-1 bg-gray-700 text-white rounded text-sm ml-4"
            placeholder="https://localhost:3000"
          />
        </div>
        <iframe 
          src="about:blank"
          className="w-full h-full bg-white"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }
  
  if (type === 'devcontainer') {
    return (
      <div className="h-full bg-gray-900 rounded-lg p-4">
        <div className="text-cyan-400 font-mono text-sm space-y-2">
          <div className="flex items-center space-x-2">
            <span>🐳</span>
            <span>DevContainer Environment</span>
          </div>
          <div className="text-gray-500 text-xs">
            Node.js 20.x | Python 3.11 | Rust 1.75 | Go 1.21
          </div>
          <div className="mt-4 p-3 bg-gray-800 rounded">
            <div className="text-green-400">Container Status: Running</div>
            <div className="text-gray-400 text-xs mt-1">
              Image: mcr.microsoft.com/devcontainers/universal:2
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'ai-agent') {
    return (
      <div className="h-full bg-gray-900 rounded-lg p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-purple-400">
            <span>🤖</span>
            <span className="font-semibold">AI Agent Console</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-purple-900/20 rounded border border-purple-700/50">
              <div className="text-purple-300 text-sm">Model: Claude 3.5</div>
              <div className="text-gray-400 text-xs">Context: 200K tokens</div>
            </div>
            <div className="text-gray-400 text-sm">
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-400"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Ready for inference'
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default terminal view with WebGL acceleration
  return (
    <div className="h-full bg-black rounded-lg overflow-hidden relative">
      {/* WebGL Canvas for GPU-accelerated rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className={cn(
          "h-full p-4 font-mono text-sm overflow-y-auto",
          "text-green-400 selection:bg-green-400 selection:text-black"
        )}
        onClick={() => document.getElementById(`terminal-input-${sessionId}`)?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        
        {/* Input Line */}
        <div className="flex items-center">
          <span>$ </span>
          <input
            id={`terminal-input-${sessionId}`}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isProcessing) {
                handleCommand(currentInput);
              }
            }}
            className="flex-1 bg-transparent outline-none border-none"
            disabled={isProcessing}
            autoFocus
          />
          {!isProcessing && <span className="animate-pulse ml-1">▊</span>}
          {isProcessing && (
            <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-green-400"></div>
          )}
        </div>
      </div>
    </div>
  );
}