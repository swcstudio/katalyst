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

interface SessionManagerProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCloseSession: (id: string) => void;
}

export function SessionManager({
  sessions,
  activeSessionId,
  onSelectSession,
  onCloseSession
}: SessionManagerProps) {
  const getSessionIcon = (type: Session['type']) => {
    switch (type) {
      case 'terminal':
        return '💻';
      case 'browser':
        return '🌐';
      case 'devcontainer':
        return '🐳';
    }
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Active Sessions
      </h3>
      <div className="space-y-2">
        {sessions.map(session => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all
              ${session.id === activeSessionId
                ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getSessionIcon(session.type)}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    CPU: {session.resource.cpu}% • MEM: {session.resource.memory}MB
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${getStatusColor(session.status)} rounded-full`}></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseSession(session.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}