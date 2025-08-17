import { useCallback, useMemo } from 'react';
import { cn } from '../../../packages/design-system/src/utils/cn';
import { Card } from '../../../packages/design-system/src/ui/card';
import { Badge } from '../../../packages/design-system/src/ui/badge';
import { Button } from '../../../packages/design-system/src/ui/button';

interface Session {
  id: string;
  name: string;
  type: 'terminal' | 'browser' | 'devcontainer' | 'ai-agent';
  status: 'active' | 'idle' | 'processing' | 'disconnected';
  threadPoolId?: string;
  metrics: {
    cpu: number;
    memory: number;
    throughput: number;
    tasksCompleted: number;
  };
}

interface VMSessionManagerProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCloseSession: (id: string) => void;
  onCreateSession: (type: Session['type'], name?: string) => void;
}

export function VMSessionManager({
  sessions,
  activeSessionId,
  onSelectSession,
  onCloseSession,
  onCreateSession
}: VMSessionManagerProps) {
  const getSessionIcon = useCallback((type: Session['type']) => {
    switch (type) {
      case 'terminal': return '💻';
      case 'browser': return '🌐';
      case 'devcontainer': return '🐳';
      case 'ai-agent': return '🤖';
    }
  }, []);
  
  const getStatusColor = useCallback((status: Session['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'disconnected': return 'bg-gray-500';
    }
  }, []);
  
  const getStatusBadgeVariant = useCallback((status: Session['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'idle': return 'warning';
      case 'processing': return 'default';
      case 'disconnected': return 'secondary';
    }
  }, []);
  
  const groupedSessions = useMemo(() => {
    const groups: Record<Session['type'], Session[]> = {
      terminal: [],
      browser: [],
      devcontainer: [],
      'ai-agent': []
    };
    
    sessions.forEach(session => {
      groups[session.type].push(session);
    });
    
    return groups;
  }, [sessions]);
  
  return (
    <div className="space-y-4">
      {/* Quick Create Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCreateSession('terminal')}
          className="text-xs"
        >
          <span className="mr-1">💻</span> Terminal
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCreateSession('browser')}
          className="text-xs"
        >
          <span className="mr-1">🌐</span> Browser
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCreateSession('devcontainer')}
          className="text-xs"
        >
          <span className="mr-1">🐳</span> DevContainer
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCreateSession('ai-agent')}
          className="text-xs"
        >
          <span className="mr-1">🤖</span> AI Agent
        </Button>
      </div>
      
      {/* Active Sessions */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(groupedSessions).map(([type, typeSessions]) => {
          if (typeSessions.length === 0) return null;
          
          return (
            <div key={type} className="space-y-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider px-1">
                {type.replace('-', ' ')}
              </div>
              {typeSessions.map(session => (
                <Card
                  key={session.id}
                  className={cn(
                    "p-2 cursor-pointer transition-all",
                    session.id === activeSessionId
                      ? "border-blue-500 bg-blue-500/10"
                      : "hover:bg-gray-800/50"
                  )}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <span className="text-lg">{getSessionIcon(session.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {session.name}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getStatusBadgeVariant(session.status)} className="text-xs">
                            {session.status}
                          </Badge>
                          {session.metrics.tasksCompleted > 0 && (
                            <span className="text-xs text-gray-500">
                              {session.metrics.tasksCompleted} tasks
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-end text-xs text-gray-400">
                        <span>CPU: {session.metrics.cpu}%</span>
                        <span>MEM: {session.metrics.memory}MB</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseSession(session.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  {/* Thread Pool Info */}
                  {session.threadPoolId && (
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <div className="text-xs text-gray-500">
                        Thread: {session.threadPoolId.substring(0, 8)}...
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          );
        })}
      </div>
      
      {/* Session Summary */}
      <div className="pt-3 border-t border-gray-700/50">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>Total: {sessions.length}</div>
          <div>Active: {sessions.filter(s => s.status === 'active').length}</div>
          <div>Processing: {sessions.filter(s => s.status === 'processing').length}</div>
          <div>Idle: {sessions.filter(s => s.status === 'idle').length}</div>
        </div>
      </div>
    </div>
  );
}