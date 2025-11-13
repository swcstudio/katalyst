import { nativeSSHService } from './NativeSSHService';
import { useTerminalStore } from '../stores/terminalStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConnectionConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  user: string;
  keyPath: string;
  workingDirectory?: string;
}

interface TerminalSession {
  sessionId: string;
  connectionId: string;
  connected: boolean;
  lastActivity: number;
}

class TerminalBridge {
  private sessions: Map<string, TerminalSession> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 3;

  /**
   * Connect to a server and create a terminal session
   */
  async connectToServer(config: ConnectionConfig): Promise<string> {
    try {
      // Create terminal session first
      const sessionId = useTerminalStore.getState().createSession({
        name: config.name,
        connection: `${config.user}@${config.host}:${config.port}`,
      });

      // Add connecting message
      useTerminalStore.getState().addOutput(sessionId, {
        text: `🔌 Connecting to ${config.host}...`,
        type: 'output',
        color: '#ffa54f',
      });

      // Test SSH connection first
      const connectionSuccess = await nativeSSHService.testSSHConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        keyPath: config.keyPath,
      });

      if (!connectionSuccess) {
        throw new Error('SSH connection test failed');
      }

      // Store session info
      const session: TerminalSession = {
        sessionId,
        connectionId: config.id,
        connected: true,
        lastActivity: Date.now(),
      };

      this.sessions.set(sessionId, session);

      // Update terminal session
      useTerminalStore.getState().updateSession(sessionId, {
        connected: true,
        environment: {
          HOST: config.host,
          USER: config.user,
          PORT: config.port.toString(),
        },
        workingDirectory: config.workingDirectory || '~',
      });

      // Add success message
      useTerminalStore.getState().addOutput(sessionId, {
        text: `✅ Connected to ${config.host}`,
        type: 'output',
        color: '#95e454',
      });

      useTerminalStore.getState().addOutput(sessionId, {
        text: `Welcome to ${config.name || config.host}`,
        type: 'output',
        color: '#d8d8d8',
      });

      // Save connection to recent connections
      await this.saveRecentConnection(config);

      return sessionId;
    } catch (error) {
      console.error('Failed to connect to server:', error);
      
      // If we have a session, update it with error
      const sessions = useTerminalStore.getState().sessions;
      const session = sessions.find(s => s.connection === `${config.user}@${config.host}:${config.port}`);
      
      if (session) {
        useTerminalStore.getState().addOutput(session.id, {
          text: `❌ Connection failed: ${error.message}`,
          type: 'error',
          color: '#ff6b6b',
        });
      }

      throw error;
    }
  }

  /**
   * Execute a command on the remote server
   */
  async executeCommand(sessionId: string, command: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.connected) {
      throw new Error('Session not connected');
    }

    try {
      // Update last activity
      session.lastActivity = Date.now();
      this.sessions.set(sessionId, session);

      // For now, we'll simulate command execution
      // In a real implementation, this would send the command to the SSH connection
      await this.simulateCommandExecution(sessionId, command);

    } catch (error) {
      console.error('Failed to execute command:', error);
      
      useTerminalStore.getState().addOutput(sessionId, {
        text: `Command failed: ${error.message}`,
        type: 'error',
        color: '#ff6b6b',
      });

      // If connection is lost, attempt reconnection
      if (error.message.includes('connection') || error.message.includes('network')) {
        await this.attemptReconnection(sessionId);
      }
    }
  }

  /**
   * Disconnect from a server
   */
  async disconnectSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      // Update session state
      useTerminalStore.getState().updateSession(sessionId, {
        connected: false,
      });

      useTerminalStore.getState().addOutput(sessionId, {
        text: '🔌 Disconnected from server',
        type: 'output',
        color: '#ff6b6b',
      });

      // Clean up session
      this.sessions.delete(sessionId);
      this.reconnectAttempts.delete(sessionId);

    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  }

  /**
   * Get active sessions
   */
  getActiveSessions(): TerminalSession[] {
    return Array.from(this.sessions.values()).filter(s => s.connected);
  }

  /**
   * Check session health and reconnect if needed
   */
  async checkSessionHealth(): Promise<void> {
    const now = Date.now();
    const staleTimeout = 5 * 60 * 1000; // 5 minutes

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.connected && (now - session.lastActivity) > staleTimeout) {
        console.log(`Session ${sessionId} appears stale, checking connection...`);
        
        // Try to send a simple command to test the connection
        try {
          await this.executeCommand(sessionId, 'echo "ping"');
        } catch (error) {
          console.log(`Session ${sessionId} is unresponsive, attempting reconnection...`);
          await this.attemptReconnection(sessionId);
        }
      }
    }
  }

  /**
   * Attempt to reconnect a failed session
   */
  private async attemptReconnection(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const attempts = this.reconnectAttempts.get(sessionId) || 0;
    if (attempts >= this.maxReconnectAttempts) {
      useTerminalStore.getState().addOutput(sessionId, {
        text: '❌ Maximum reconnection attempts exceeded',
        type: 'error',
        color: '#ff6b6b',
      });
      
      session.connected = false;
      this.sessions.set(sessionId, session);
      return;
    }

    this.reconnectAttempts.set(sessionId, attempts + 1);

    useTerminalStore.getState().addOutput(sessionId, {
      text: `🔄 Attempting to reconnect... (${attempts + 1}/${this.maxReconnectAttempts})`,
      type: 'output',
      color: '#ffa54f',
    });

    try {
      // Get connection config from stored data
      const connectionConfig = await this.getConnectionConfig(session.connectionId);
      if (!connectionConfig) {
        throw new Error('Connection configuration not found');
      }

      // Test connection
      const success = await nativeSSHService.testSSHConnection({
        host: connectionConfig.host,
        port: connectionConfig.port,
        user: connectionConfig.user,
        keyPath: connectionConfig.keyPath,
      });

      if (success) {
        session.connected = true;
        session.lastActivity = Date.now();
        this.sessions.set(sessionId, session);
        this.reconnectAttempts.delete(sessionId);

        useTerminalStore.getState().updateSession(sessionId, { connected: true });
        useTerminalStore.getState().addOutput(sessionId, {
          text: '✅ Reconnection successful',
          type: 'output',
          color: '#95e454',
        });
      } else {
        throw new Error('Reconnection test failed');
      }
    } catch (error) {
      useTerminalStore.getState().addOutput(sessionId, {
        text: `❌ Reconnection failed: ${error.message}`,
        type: 'error',
        color: '#ff6b6b',
      });

      // Schedule next attempt
      setTimeout(() => {
        this.attemptReconnection(sessionId);
      }, Math.pow(2, attempts) * 1000); // Exponential backoff
    }
  }

  /**
   * Get connection configuration by ID
   */
  private async getConnectionConfig(connectionId: string): Promise<ConnectionConfig | null> {
    try {
      const serversData = await AsyncStorage.getItem('katalyst_servers');
      if (!serversData) return null;

      const servers = JSON.parse(serversData);
      const server = servers.find((s: any) => s.id === connectionId);
      
      if (!server) return null;

      return {
        id: server.id,
        name: server.name,
        host: this.extractHostname(server.url),
        port: this.extractPort(server.url),
        user: this.extractUser(server.url),
        keyPath: server.defaultKey || '',
        workingDirectory: server.workingDirectory,
      };
    } catch (error) {
      console.error('Failed to get connection config:', error);
      return null;
    }
  }

  /**
   * Save recent connection for quick access
   */
  private async saveRecentConnection(config: ConnectionConfig): Promise<void> {
    try {
      const recentData = await AsyncStorage.getItem('katalyst_recent_connections');
      const recent = recentData ? JSON.parse(recentData) : [];

      // Remove if already exists
      const filtered = recent.filter((r: any) => r.id !== config.id);
      
      // Add to beginning
      filtered.unshift({
        ...config,
        lastConnected: new Date().toISOString(),
      });

      // Keep only last 10
      const updated = filtered.slice(0, 10);

      await AsyncStorage.setItem('katalyst_recent_connections', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent connection:', error);
    }
  }

  /**
   * Simulate command execution (replace with real SSH implementation)
   */
  private async simulateCommandExecution(sessionId: string, command: string): Promise<void> {
    const responses: Record<string, string[]> = {
      'ls': ['file1.txt', 'file2.js', 'directory/', 'README.md', '.git/'],
      'pwd': ['/home/user'],
      'whoami': ['user'],
      'date': [new Date().toString()],
      'uname': ['Linux server 5.4.0-74-generic x86_64 GNU/Linux'],
      'ps': ['PID TTY TIME CMD', '1234 pts/0 00:00:01 bash', '5678 pts/0 00:00:00 ps'],
      'df': ['Filesystem Size Used Avail Use% Mounted on', '/dev/sda1 20G 12G 7.1G 62% /'],
      'free': ['total used free shared buff/cache available', 'Mem: 8192 3072 2048 256 3072 4864'],
      'uptime': ['12:34:56 up 5 days, 10:12, 2 users, load average: 0.15, 0.22, 0.18'],
    };

    const baseCommand = command.trim().split(' ')[0];
    let response: string[] = [];

    if (command.startsWith('echo ')) {
      response = [command.replace('echo ', '')];
    } else if (command.startsWith('cd ')) {
      response = []; // cd doesn't produce output on success
      
      // Update working directory in session
      const newDir = command.replace('cd ', '').trim() || '~';
      useTerminalStore.getState().updateSession(sessionId, {
        workingDirectory: newDir,
      });
    } else if (command === 'clear') {
      useTerminalStore.getState().clear(sessionId);
      return;
    } else {
      response = responses[baseCommand] || [`Command '${baseCommand}' not found`];
    }

    // Add output with realistic delays
    response.forEach((line, index) => {
      setTimeout(() => {
        useTerminalStore.getState().addOutput(sessionId, {
          text: line,
          type: 'output',
          color: '#d8d8d8',
        });
      }, index * 50);
    });
  }

  // Helper methods
  private extractHostname(url: string): string {
    return url.replace('ssh://', '').split('@')[1]?.split(':')[0] || 'localhost';
  }

  private extractUser(url: string): string {
    return url.split('@')[0]?.replace('ssh://', '') || 'root';
  }

  private extractPort(url: string): number {
    const portMatch = url.match(/:(\d+)$/);
    return portMatch ? parseInt(portMatch[1]) : 22;
  }

  /**
   * Clean up all sessions
   */
  async cleanup(): Promise<void> {
    const sessionIds = Array.from(this.sessions.keys());
    
    for (const sessionId of sessionIds) {
      await this.disconnectSession(sessionId);
    }

    this.sessions.clear();
    this.reconnectAttempts.clear();
  }
}

// Export singleton instance
export const terminalBridge = new TerminalBridge();
export { TerminalBridge };
export type { ConnectionConfig, TerminalSession };