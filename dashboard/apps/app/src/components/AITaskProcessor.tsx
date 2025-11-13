import { useState, useCallback } from 'react';
import { Button } from '../../../packages/design-system/src/ui/button';
import { Card } from '../../../packages/design-system/src/ui/card';
import { Badge } from '../../../packages/design-system/src/ui/badge';
import { cn } from '../../../packages/design-system/src/utils/cn';

interface AITask {
  id: string;
  type: 'inference' | 'training' | 'preprocessing' | 'analysis';
  model: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  startTime?: number;
  endTime?: number;
}

interface AITaskProcessorProps {
  onSubmitTask: (task: any) => Promise<any>;
}

export function AITaskProcessor({ onSubmitTask }: AITaskProcessorProps) {
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [selectedModel, setSelectedModel] = useState('claude-3.5');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const models = [
    { id: 'claude-3.5', name: 'Claude 3.5', type: 'llm' },
    { id: 'gpt-4', name: 'GPT-4', type: 'llm' },
    { id: 'stable-diffusion', name: 'Stable Diffusion', type: 'image' },
    { id: 'whisper', name: 'Whisper', type: 'audio' },
  ];
  
  const taskTypes = [
    { id: 'inference', name: 'Inference', icon: '🔮' },
    { id: 'training', name: 'Training', icon: '🏋️' },
    { id: 'preprocessing', name: 'Preprocessing', icon: '⚙️' },
    { id: 'analysis', name: 'Analysis', icon: '📊' },
  ];
  
  const submitAITask = useCallback(async (type: AITask['type']) => {
    const taskId = `ai_task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const newTask: AITask = {
      id: taskId,
      type,
      model: selectedModel,
      status: 'pending',
      progress: 0,
      startTime: Date.now(),
    };
    
    setTasks(prev => [newTask, ...prev]);
    setIsProcessing(true);
    
    try {
      // Update to running
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'running' as const } : t
      ));
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setTasks(prev => prev.map(t => {
          if (t.id === taskId && t.progress < 90) {
            return { ...t, progress: Math.min(t.progress + 10, 90) };
          }
          return t;
        }));
      }, 500);
      
      // Submit to multithreading system
      const result = await onSubmitTask({
        id: taskId,
        operation: `ai.${type}`,
        data: {
          model: selectedModel,
          type,
          config: {
            temperature: 0.7,
            maxTokens: 1000,
          }
        },
        priority: type === 'inference' ? 'high' : 'normal',
      });
      
      clearInterval(progressInterval);
      
      // Update task with result
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              status: 'completed' as const, 
              progress: 100,
              result: result.result,
              endTime: Date.now()
            } 
          : t
      ));
    } catch (error) {
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'failed' as const, result: error } 
          : t
      ));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedModel, onSubmitTask]);
  
  const getStatusColor = (status: AITask['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
    }
  };
  
  const getStatusBadgeVariant = (status: AITask['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'running': return 'default';
      case 'completed': return 'success';
      case 'failed': return 'destructive';
    }
  };
  
  const formatDuration = (start: number, end?: number) => {
    const duration = (end || Date.now()) - start;
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  };
  
  return (
    <div className="space-y-4">
      {/* Model Selection */}
      <div className="space-y-2">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Model</div>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full px-2 py-1 bg-gray-800 text-white text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          disabled={isProcessing}
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.type})
            </option>
          ))}
        </select>
      </div>
      
      {/* Task Actions */}
      <div className="grid grid-cols-2 gap-2">
        {taskTypes.map(taskType => (
          <Button
            key={taskType.id}
            size="sm"
            variant="outline"
            onClick={() => submitAITask(taskType.id as AITask['type'])}
            disabled={isProcessing}
            className="text-xs"
          >
            <span className="mr-1">{taskType.icon}</span>
            {taskType.name}
          </Button>
        ))}
      </div>
      
      {/* Active Tasks */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            No AI tasks running
          </div>
        ) : (
          tasks.slice(0, 5).map(task => (
            <Card key={task.id} className="p-2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                    {task.status}
                  </Badge>
                  <span className="text-xs text-gray-400">{task.type}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDuration(task.startTime!, task.endTime)}
                </span>
              </div>
              
              <div className="text-xs text-gray-300">
                Model: {task.model}
              </div>
              
              {task.status === 'running' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{task.progress}%</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {task.status === 'completed' && task.result && (
                <div className="text-xs text-green-400">
                  ✓ Task completed successfully
                </div>
              )}
              
              {task.status === 'failed' && (
                <div className="text-xs text-red-400">
                  ✗ Task failed
                </div>
              )}
            </Card>
          ))
        )}
      </div>
      
      {/* Statistics */}
      <div className="pt-3 border-t border-gray-700/50">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>Total: {tasks.length}</div>
          <div>Running: {tasks.filter(t => t.status === 'running').length}</div>
          <div>Completed: {tasks.filter(t => t.status === 'completed').length}</div>
          <div>Failed: {tasks.filter(t => t.status === 'failed').length}</div>
        </div>
      </div>
    </div>
  );
}