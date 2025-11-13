import { useTerminalStore } from '../stores/terminalStore';

/**
 * Custom hook that provides terminal operations and state
 * This is the main interface for terminal functionality
 */
export function useTerminal() {
  const store = useTerminalStore();

  return {
    // State
    sessions: store.sessions,
    activeSessionId: store.activeSessionId,
    activeSessions: store.sessions,

    // Session management
    createSession: store.createSession,
    closeSession: store.closeSession,
    setActiveSession: store.setActiveSession,
    getSession: store.getSession,
    updateSession: store.updateSession,

    // Terminal operations
    sendCommand: store.sendCommand,
    sendInput: store.sendInput,
    sendKey: store.sendKey,
    clear: store.clear,

    // Output management
    addOutput: store.addOutput,
    getRecentCommands: store.getRecentCommands,

    // Connection
    connect: store.connect,
    disconnect: store.disconnect,

    // Computed values
    get activeSession() {
      return store.activeSessionId ? store.getSession(store.activeSessionId) : undefined;
    },

    get hasActiveSessions() {
      return store.sessions.length > 0;
    },

    get connectedSessions() {
      return store.sessions.filter(session => session.connected);
    },
  };
}