import { useMemo } from 'react';
import { cn } from '../../../packages/design-system/src/utils/cn';
import { Card } from '../../../packages/design-system/src/ui/card';

interface SystemMetrics {
  totalThreads: number;
  availableThreads: number;
  memoryUsage: number;
  cpuUsage: number;
  queueBacklog: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

interface ThreadPoolMetrics {
  id: string;
  type: string;
  workerCount: number;
  activeJobs: number;
  queuedJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageJobTime: number;
  utilization: number;
  health: 'healthy' | 'degraded' | 'critical';
}

interface ResourceDashboardProps {
  metrics: SystemMetrics;
  threadPools: ThreadPoolMetrics[];
  healthStatus: any;
}

export function ResourceDashboard({ metrics, threadPools, healthStatus }: ResourceDashboardProps) {
  const getUtilizationColor = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  const formatUptime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };
  
  const totalResources = useMemo(() => ({
    totalWorkers: threadPools.reduce((acc, pool) => acc + pool.workerCount, 0),
    totalActive: threadPools.reduce((acc, pool) => acc + pool.activeJobs, 0),
    totalQueued: threadPools.reduce((acc, pool) => acc + pool.queuedJobs, 0),
    totalCompleted: threadPools.reduce((acc, pool) => acc + pool.completedJobs, 0),
    avgUtilization: threadPools.reduce((acc, pool) => acc + pool.utilization, 0) / threadPools.length,
  }), [threadPools]);
  
  return (
    <div className="space-y-4">
      {/* System Overview */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">CPU Usage</span>
            <span className="text-white font-medium">{metrics.cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                getUtilizationColor(metrics.cpuUsage)
              )}
              style={{ width: `${metrics.cpuUsage}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Memory</span>
            <span className="text-white font-medium">{metrics.memoryUsage.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                getUtilizationColor(metrics.memoryUsage)
              )}
              style={{ width: `${metrics.memoryUsage}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Thread Utilization</span>
            <span className="text-white font-medium">
              {metrics.availableThreads}/{metrics.totalThreads}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                getUtilizationColor(((metrics.totalThreads - metrics.availableThreads) / metrics.totalThreads) * 100)
              )}
              style={{ width: `${((metrics.totalThreads - metrics.availableThreads) / metrics.totalThreads) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Thread Pools */}
      <div className="space-y-2">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Thread Pools</div>
        {threadPools.map(pool => (
          <Card key={pool.id} className="p-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-white">{pool.id}</div>
              <span className={cn("text-xs", getHealthColor(pool.health))}>
                {pool.health}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-400">
                Workers: <span className="text-white">{pool.workerCount}</span>
              </div>
              <div className="text-gray-400">
                Active: <span className="text-white">{pool.activeJobs}</span>
              </div>
              <div className="text-gray-400">
                Queued: <span className="text-white">{pool.queuedJobs}</span>
              </div>
              <div className="text-gray-400">
                Complete: <span className="text-white">{pool.completedJobs}</span>
              </div>
            </div>
            
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  pool.health === 'critical' ? 'bg-red-500' :
                  pool.health === 'degraded' ? 'bg-yellow-500' : 'bg-green-500'
                )}
                style={{ width: `${pool.utilization}%` }}
              />
            </div>
          </Card>
        ))}
      </div>
      
      {/* Performance Metrics */}
      <div className="pt-3 border-t border-gray-700/50 space-y-2">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Performance</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-gray-400">
            Throughput: <span className="text-white">{metrics.throughput.toFixed(1)}/min</span>
          </div>
          <div className="text-gray-400">
            Queue: <span className="text-white">{metrics.queueBacklog}</span>
          </div>
          <div className="text-gray-400">
            Error Rate: <span className="text-white">{(metrics.errorRate * 100).toFixed(1)}%</span>
          </div>
          <div className="text-gray-400">
            Uptime: <span className="text-white">{formatUptime(metrics.uptime)}</span>
          </div>
        </div>
      </div>
      
      {/* Aggregate Stats */}
      <div className="pt-3 border-t border-gray-700/50">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Totals</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="text-gray-400">Workers: {totalResources.totalWorkers}</div>
          <div className="text-gray-400">Active: {totalResources.totalActive}</div>
          <div className="text-gray-400">Queued: {totalResources.totalQueued}</div>
          <div className="text-gray-400">Completed: {totalResources.totalCompleted}</div>
        </div>
      </div>
    </div>
  );
}