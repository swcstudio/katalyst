import { useState, useEffect, useCallback, useMemo } from 'react';
import { useMultithreadingStore, useTaskQueue, useThreadPools, useChannelCommunication } from '../../../packages/core/src/stores/multithreading-store';
import { useKatalystStore } from '../../../packages/core/src/stores/katalyst-store';
import { useIntegrationStore } from '../../../packages/core/src/stores/integration-store';
import { useAdvancedMultithreading, useThreadMonitoring, useSubagentCoordination } from '../../../packages/hooks/src/use-multithreading';
import { ThreadPrimitive } from '../../../packages/core/src/native/thread-primitives';
import { TerminalWorker } from './TerminalWorker';
import { VMSessionManager } from './VMSessionManager';
import { ResourceDashboard } from './ResourceDashboard';
import { AITaskProcessor } from './AITaskProcessor';
import { InfiniteMovingCards } from '../../../packages/design-system/src/ui/infinite-moving-cards';
import { BackgroundBeams } from '../../../packages/design-system/src/ui/background-beams';
import { FloatingDock } from '../../../packages/design-system/src/ui/floating-dock';
import { SpotlightNew } from '../../../packages/design-system/src/ui/spotlight-new';
import { BentoGrid, BentoGridItem } from '../../../packages/design-system/src/ui/bento-grid';
import { cn } from '../../../packages/design-system/src/utils/cn';

interface Session {
  id: string;
  name: string;
  type: 'terminal' | 'browser' | 'devcontainer' | 'ai-agent';
  status: 'active' | 'idle' | 'processing' | 'disconnected';
  threadPoolId?: string;
  workerId?: string;
  metrics: {
    cpu: number;
    memory: number;
    throughput: number;
    tasksCompleted: number;
  };
}

export function KatalystAdvancedDashboard() {
  // Katalyst Store Integration
  const katalystStore = useKatalystStore();
  const integrationStore = useIntegrationStore();
  const multithreadingStore = useMultithreadingStore();
  
  // Advanced Multithreading Hooks
  const multithreading = useAdvancedMultithreading({
    autoInitialize: true,
    workerThreads: 8,
    enableWebSocketMonitoring: true,
    enablePubSub: true,
    enableAutoScaling: true,
  });
  
  const threadMonitoring = useThreadMonitoring();
  const subagentCoordination = useSubagentCoordination();
  const { tasks, pendingTasks, runningTasks, completedTasks } = useTaskQueue();
  const { pools } = useThreadPools();
  const { createChannel, publish, subscribe } = useChannelCommunication();
  
  // Session Management with Thread Pools
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [terminalWorkers, setTerminalWorkers] = useState<Map<string, Worker>>(new Map());
  
  // Initialize Katalyst Environment
  useEffect(() => {
    const initializeKatalyst = async () => {
      // Initialize thread pools for different workloads
      await multithreading.initialize();
      
      // Create channels for inter-component communication
      createChannel('terminal-output', null);
      createChannel('vm-status', null);
      createChannel('ai-tasks', null);
      
      // Register subagents for specialized tasks
      await subagentCoordination.registerSubagent('terminal-emulator', ['terminal', 'shell', 'ssh']);
      await subagentCoordination.registerSubagent('ai-processor', ['inference', 'training', 'analysis']);
      await subagentCoordination.registerSubagent('browser-engine', ['dom', 'javascript', 'rendering']);
      
      // Set up initial session
      createSession('terminal', 'Main Terminal');
    };
    
    initializeKatalyst();
    
    return () => {
      multithreading.cleanup();
      terminalWorkers.forEach(worker => worker.terminate());
    };
  }, []);
  
  // Create a new session with dedicated worker thread
  const createSession = useCallback(async (
    type: Session['type'],
    name?: string
  ) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Submit task to thread pool for session creation
    const task = await multithreading.submitTask({
      id: sessionId,
      type: type === 'terminal' || type === 'devcontainer' ? 'cpu' : 'io',
      operation: `session.create.${type}`,
      data: { sessionId, type },
      priority: 'high',
      resourceHints: {
        expectedMemory: type === 'ai-agent' ? 1024 : 256,
        preferredThreadPool: type === 'terminal' ? 'cpu' : 'io',
      }
    });
    
    // Create dedicated worker for terminal sessions
    if (type === 'terminal' || type === 'devcontainer') {
      const worker = new Worker(
        new URL('./workers/terminal.worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      worker.postMessage({
        type: 'init',
        sessionId,
        config: {
          rows: 24,
          cols: 80,
          useWebGL: true,
          enableGPU: true,
        }
      });
      
      setTerminalWorkers(prev => new Map([...prev, [sessionId, worker]]));
    }
    
    const newSession: Session = {
      id: sessionId,
      name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${sessions.length + 1}`,
      type,
      status: 'active',
      threadPoolId: task.threadId,
      workerId: type === 'terminal' ? sessionId : undefined,
      metrics: {
        cpu: 0,
        memory: 0,
        throughput: 0,
        tasksCompleted: 0,
      }
    };
    
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(sessionId);
    
    // Publish session creation event
    publish('vm-status', {
      event: 'session.created',
      sessionId,
      type,
      timestamp: Date.now(),
    });
    
    return sessionId;
  }, [sessions, multithreading, publish]);
  
  // Close session with cleanup
  const closeSession = useCallback(async (sessionId: string) => {
    // Cancel any running tasks for this session
    await multithreading.cancelTask(sessionId);
    
    // Terminate worker if exists
    const worker = terminalWorkers.get(sessionId);
    if (worker) {
      worker.terminate();
      setTerminalWorkers(prev => {
        const newMap = new Map(prev);
        newMap.delete(sessionId);
        return newMap;
      });
    }
    
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (activeSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
    
    // Publish session closure event
    publish('vm-status', {
      event: 'session.closed',
      sessionId,
      timestamp: Date.now(),
    });
  }, [sessions, activeSessionId, multithreading, terminalWorkers, publish]);
  
  // Execute command in terminal session using worker
  const executeCommand = useCallback(async (sessionId: string, command: string) => {
    const worker = terminalWorkers.get(sessionId);
    if (!worker) return;
    
    // Submit command execution task
    const task = await multithreading.submitTask({
      id: `cmd_${Date.now()}`,
      type: 'cpu',
      operation: 'terminal.execute',
      data: { sessionId, command },
      priority: 'normal',
    });
    
    worker.postMessage({
      type: 'execute',
      command,
      taskId: task.id,
    });
    
    return task;
  }, [terminalWorkers, multithreading]);
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  
  // Compute real-time metrics
  const systemMetrics = useMemo(() => ({
    totalSessions: sessions.length,
    activeSessions: sessions.filter(s => s.status === 'active').length,
    threadUtilization: threadMonitoring.realTimeMetrics.cpuUsage,
    memoryUsage: threadMonitoring.realTimeMetrics.memoryUsage,
    taskThroughput: threadMonitoring.realTimeMetrics.throughput,
    queueBacklog: pendingTasks.length,
    activeThreads: runningTasks.length,
    completedTasks: completedTasks.length,
  }), [sessions, threadMonitoring, pendingTasks, runningTasks, completedTasks]);
  
  // Dock items for quick actions
  const dockItems = [
    {
      title: "Terminal",
      icon: "💻",
      onClick: () => createSession('terminal'),
    },
    {
      title: "Browser",
      icon: "🌐",
      onClick: () => createSession('browser'),
    },
    {
      title: "DevContainer",
      icon: "🐳",
      onClick: () => createSession('devcontainer'),
    },
    {
      title: "AI Agent",
      icon: "🤖",
      onClick: () => createSession('ai-agent'),
    },
  ];
  
  return (
    <div className="relative min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <SpotlightNew />
      <BackgroundBeams />
      
      {/* Header with System Status */}
      <header className="relative z-10 border-b border-white/[0.1] bg-black/50 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Katalyst Pro</h1>
                <p className="text-xs text-gray-400">AI-Optimized Development Environment</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300">
                  {systemMetrics.activeSessions}/{systemMetrics.totalSessions} Sessions
                </span>
              </div>
              <div className="text-gray-400">
                CPU: {systemMetrics.threadUtilization.toFixed(1)}%
              </div>
              <div className="text-gray-400">
                MEM: {systemMetrics.memoryUsage.toFixed(1)}%
              </div>
              <div className="text-gray-400">
                Tasks: {systemMetrics.activeThreads} active
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Grid */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <BentoGrid className="max-w-7xl mx-auto">
          {/* Terminal/Session Area */}
          <BentoGridItem
            className="md:col-span-2 md:row-span-2"
            title="Active Session"
            description={activeSession?.name || "No active session"}
          >
            {activeSession && (
              <TerminalWorker
                sessionId={activeSession.id}
                type={activeSession.type}
                worker={terminalWorkers.get(activeSession.id)}
                onExecute={executeCommand}
                channelId="terminal-output"
              />
            )}
          </BentoGridItem>
          
          {/* Session Manager */}
          <BentoGridItem
            className="md:col-span-1"
            title="Sessions"
            description="Manage active sessions"
          >
            <VMSessionManager
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onCloseSession={closeSession}
              onCreateSession={createSession}
            />
          </BentoGridItem>
          
          {/* Resource Monitor */}
          <BentoGridItem
            className="md:col-span-1"
            title="System Resources"
            description="Real-time monitoring"
          >
            <ResourceDashboard
              metrics={threadMonitoring.realTimeMetrics}
              threadPools={threadMonitoring.threadPools}
              healthStatus={threadMonitoring.healthStatus}
            />
          </BentoGridItem>
          
          {/* Task Queue */}
          <BentoGridItem
            className="md:col-span-1"
            title="Task Queue"
            description={`${pendingTasks.length} pending, ${runningTasks.length} running`}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {runningTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-blue-500/10 rounded">
                  <span className="text-xs text-blue-300 truncate">{task.operation}</span>
                  <span className="text-xs text-blue-400">Running</span>
                </div>
              ))}
              {pendingTasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-gray-500/10 rounded">
                  <span className="text-xs text-gray-400 truncate">{task.operation}</span>
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
              ))}
            </div>
          </BentoGridItem>
          
          {/* AI Task Processor */}
          <BentoGridItem
            className="md:col-span-1"
            title="AI Processing"
            description="Neural compute tasks"
          >
            <AITaskProcessor
              onSubmitTask={async (task) => {
                const result = await multithreading.submitTask({
                  ...task,
                  type: 'ai',
                  subagentRequirement: 'ai-processor',
                });
                return result;
              }}
            />
          </BentoGridItem>
        </BentoGrid>
        
        {/* Thread Pool Status Cards */}
        <div className="mt-8">
          <InfiniteMovingCards
            items={pools.map(pool => ({
              title: pool.id,
              description: `${pool.workerCount} workers • ${pool.activeTasks} active • ${pool.utilization.toFixed(0)}% utilized`,
              health: pool.health,
            }))}
            direction="right"
            speed="slow"
            pauseOnHover
          />
        </div>
      </div>
      
      {/* Floating Dock for Quick Actions */}
      <FloatingDock
        items={dockItems}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
      />
      
      {/* Subagent Status Indicator */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {subagentCoordination.subagents.map(agent => (
          <div key={agent.id} className="flex items-center space-x-2 bg-black/50 backdrop-blur-xl rounded-lg px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">{agent.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}