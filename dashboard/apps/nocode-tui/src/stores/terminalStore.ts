import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface TerminalLine {
  id: string;
  text: string;
  type: 'output' | 'input' | 'prompt' | 'error';
  timestamp: number;
  color?: string;
  bold?: boolean;
  prompt?: string;
}

interface TerminalSession {
  id: string;
  name?: string;
  connection?: string;
  connected: boolean;
  hasActivity: boolean;
  output: TerminalLine[];
  currentInput: string;
  prompt: string;
  workingDirectory: string;
  environment: Record<string, string>;
  history: string[];
  lastActivity: number;
}

interface TerminalState {
  sessions: TerminalSession[];
  activeSessionId?: string;
  
  // Actions
  createSession: (options?: { name?: string; connection?: string }) => string;
  closeSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string) => void;
  
  // Session management
  getSession: (sessionId: string) => TerminalSession | undefined;
  updateSession: (sessionId: string, updates: Partial<TerminalSession>) => void;
  
  // Terminal operations
  sendCommand: (sessionId: string, command: string) => void;
  sendInput: (sessionId: string, input: string) => void;
  sendKey: (sessionId: string, key: string) => void;
  clear: (sessionId: string) => void;
  
  // Output management
  addOutput: (sessionId: string, line: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  getRecentCommands: (sessionId: string) => string[];
  
  // WebSocket connection
  connect: (sessionId: string, url: string) => Promise<void>;
  disconnect: (sessionId: string) => void;
}

export const useTerminalStore = create<TerminalState>()(
  subscribeWithSelector((set, get) => ({
    sessions: [],
    activeSessionId: undefined,

    createSession: (options = {}) => {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      
      const newSession: TerminalSession = {
        id: sessionId,
        name: options.name,
        connection: options.connection,
        connected: false,
        hasActivity: false,
        output: [
          {
            id: `line-${Date.now()}`,
            text: `Welcome to NoCode TUI Terminal`,
            type: 'output',
            timestamp: Date.now(),
            color: '#00ff88',
          },
          {
            id: `line-${Date.now()}-1`,
            text: `Session: ${sessionId.slice(-8)}`,
            type: 'output',
            timestamp: Date.now(),
            color: '#888',
          },
        ],
        currentInput: '',
        prompt: '$ ',
        workingDirectory: '~',
        environment: {},
        history: [],
        lastActivity: Date.now(),
      };

      set(state => ({
        sessions: [...state.sessions, newSession],
        activeSessionId: state.activeSessionId || sessionId,
      }));

      return sessionId;
    },

    closeSession: (sessionId) => {
      set(state => {
        const sessions = state.sessions.filter(s => s.id !== sessionId);
        const activeSessionId = state.activeSessionId === sessionId 
          ? sessions[0]?.id 
          : state.activeSessionId;
        
        return { sessions, activeSessionId };
      });
    },

    setActiveSession: (sessionId) => {
      set({ activeSessionId: sessionId });
    },

    getSession: (sessionId) => {
      return get().sessions.find(s => s.id === sessionId);
    },

    updateSession: (sessionId, updates) => {
      set(state => ({
        sessions: state.sessions.map(session => 
          session.id === sessionId 
            ? { ...session, ...updates, lastActivity: Date.now() }
            : session
        ),
      }));
    },

    sendCommand: (sessionId, command) => {
      const { addOutput, updateSession, getSession } = get();
      const session = getSession(sessionId);
      
      if (!session) return;

      // Add command to history
      const history = [...session.history.filter(h => h !== command), command].slice(-50);
      
      // Add command line to output
      addOutput(sessionId, {
        text: command,
        type: 'input',
        prompt: session.prompt,
      });

      // Update session
      updateSession(sessionId, { 
        history,
        currentInput: '',
        hasActivity: true,
      });

      // Simulate command execution (in real app, this would send to backend)
      setTimeout(() => {
        get().simulateCommandOutput(sessionId, command);
      }, 100);
    },

    sendInput: (sessionId, input) => {
      const { updateSession } = get();
      updateSession(sessionId, { 
        currentInput: input,
        hasActivity: true,
      });
    },

    sendKey: (sessionId, key) => {
      const { getSession, updateSession } = get();
      const session = getSession(sessionId);
      
      if (!session) return;

      switch (key) {
        case 'Enter':
          if (session.currentInput) {
            get().sendCommand(sessionId, session.currentInput);
          }
          break;
        case 'Backspace':
          updateSession(sessionId, {
            currentInput: session.currentInput.slice(0, -1),
          });
          break;
        case 'Tab':
          // Simulate tab completion
          updateSession(sessionId, {
            currentInput: session.currentInput + '    ',
          });
          break;
        case 'ArrowUp':
          // Get previous command
          if (session.history.length > 0) {
            const lastCommand = session.history[session.history.length - 1];
            updateSession(sessionId, { currentInput: lastCommand });
          }
          break;
        case 'ArrowDown':
          updateSession(sessionId, { currentInput: '' });
          break;
        case 'Ctrl+C':
          get().addOutput(sessionId, {
            text: '^C',
            type: 'output',
            color: '#ff6b6b',
          });
          updateSession(sessionId, { currentInput: '' });
          break;
        case 'Escape':
          updateSession(sessionId, { currentInput: '' });
          break;
        default:
          if (key.length === 1) {
            updateSession(sessionId, {
              currentInput: session.currentInput + key,
            });
          }
      }
    },

    clear: (sessionId) => {
      updateSession(sessionId, { 
        output: [
          {
            id: `clear-${Date.now()}`,
            text: 'Terminal cleared',
            type: 'output',
            timestamp: Date.now(),
            color: '#888',
          }
        ],
      });
    },

    addOutput: (sessionId, line) => {
      const { getSession } = get();
      const session = getSession(sessionId);
      
      if (!session) return;

      const newLine: TerminalLine = {
        ...line,
        id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
      };

      set(state => ({
        sessions: state.sessions.map(s => 
          s.id === sessionId 
            ? { 
                ...s, 
                output: [...s.output, newLine].slice(-1000), // Keep last 1000 lines
                lastActivity: Date.now(),
              }
            : s
        ),
      }));
    },

    getRecentCommands: (sessionId) => {
      const session = get().getSession(sessionId);
      return session?.history.slice(-10) || [];
    },

    connect: async (sessionId, url) => {
      // Simulate connection
      get().addOutput(sessionId, {
        text: `Connecting to ${url}...`,
        type: 'output',
        color: '#ffa54f',
      });

      setTimeout(() => {
        get().updateSession(sessionId, { 
          connected: true, 
          connection: url,
        });
        
        get().addOutput(sessionId, {
          text: `Connected to ${url}`,
          type: 'output',
          color: '#95e454',
        });
      }, 2000);
    },

    disconnect: (sessionId) => {
      get().updateSession(sessionId, { connected: false });
      get().addOutput(sessionId, {
        text: 'Disconnected',
        type: 'output',
        color: '#ff6b6b',
      });
    },

    // Simulate command output (replace with real backend integration)
    simulateCommandOutput: (sessionId: string, command: string) => {
      const { addOutput } = get();
      
      const responses: Record<string, string[]> = {
        'ls': ['file1.txt', 'file2.js', 'directory/', 'README.md'],
        'pwd': ['/home/user'],
        'whoami': ['user'],
        'date': [new Date().toString()],
        'echo': [command.replace('echo ', '')],
        'clear': [],
      };

      const baseCommand = command.split(' ')[0];
      const response = responses[baseCommand] || [`Command '${baseCommand}' not found`];

      response.forEach((line, index) => {
        setTimeout(() => {
          addOutput(sessionId, {
            text: line,
            type: 'output',
            color: baseCommand === 'clear' ? undefined : '#d8d8d8',
          });
        }, index * 50);
      });
    },
  }))
);