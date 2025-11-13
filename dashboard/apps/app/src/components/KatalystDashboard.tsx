import { useState, useEffect } from 'react';
import { Terminal } from './Terminal';
import { VMStatus } from './VMStatus';
import { SessionManager } from './SessionManager';
import { QuickActions } from './QuickActions';
import { ResourceMonitor } from './ResourceMonitor';

interface Session {
  id: string;
  name: string;
  type: 'terminal' | 'browser' | 'devcontainer';
  status: 'active' | 'idle' | 'disconnected';
  resource: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export function KatalystDashboard() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      name: 'Main Terminal',
      type: 'terminal',
      status: 'active',
      resource: { cpu: 15, memory: 256, network: 1.2 }
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [vmStatus, setVmStatus] = useState({
    status: 'running' as 'running' | 'starting' | 'stopped',
    uptime: '2h 34m',
    cpu: 25,
    memory: 45,
    disk: 60,
    network: { in: 12.5, out: 8.3 }
  });

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const createSession = (type: 'terminal' | 'browser' | 'devcontainer') => {
    const newSession: Session = {
      id: Date.now().toString(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${sessions.length + 1}`,
      type,
      status: 'active',
      resource: { cpu: 0, memory: 0, network: 0 }
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
  };

  const closeSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    if (activeSessionId === id && sessions.length > 1) {
      setActiveSessionId(sessions[0].id);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Katalyst</h1>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Optimized AI Development Environment
            </span>
          </div>
          <VMStatus {...vmStatus} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <QuickActions onCreateSession={createSession} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <SessionManager
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onCloseSession={closeSession}
            />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <ResourceMonitor resources={vmStatus} />
          </div>
        </aside>

        {/* Main Terminal/Content Area */}
        <main className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
          {activeSession && (
            <>
              {/* Session Tabs */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-4 py-2 space-x-2 overflow-x-auto">
                  {sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => setActiveSessionId(session.id)}
                      className={`
                        flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors
                        ${session.id === activeSessionId
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      <span className="text-sm">{session.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeSession(session.id);
                        }}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal/Content */}
              <div className="flex-1 p-4">
                <Terminal sessionId={activeSession.id} type={activeSession.type} />
              </div>
            </>
          )}
        </main>
      </div>

      {/* Status Bar */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Connected</span>
            </span>
            <span>Sessions: {sessions.length}</span>
            <span>Uptime: {vmStatus.uptime}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>CPU: {vmStatus.cpu}%</span>
            <span>MEM: {vmStatus.memory}%</span>
            <span>NET: ↓{vmStatus.network.in} ↑{vmStatus.network.out} MB/s</span>
          </div>
        </div>
      </footer>
    </div>
  );
}