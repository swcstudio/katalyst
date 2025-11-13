# Agent Orchestrator

The `AgentOrchestrator` class manages agent spawning, coordination, and task distribution. It provides a powerful framework for orchestrating multiple AI agents to work together on complex tasks.

## Overview

`AgentOrchestrator` provides:
- Agent spawning and lifecycle management
- Task distribution and execution
- Load balancing across agents
- Team creation and coordination
- Parallel and pipeline task execution
- Auto-scaling capabilities
- Performance monitoring and statistics

## Usage Examples

### Basic Orchestrator Setup

```typescript
import { AgentOrchestrator, OrchestratorConfig, TaskDefinition } from '@katalyst/ai';

const orchestrator = new AgentOrchestrator({
  maxAgents: 10,
  maxThreads: 5,
  defaultAgentType: 'claude',
  agentTimeout: 60000,
  enableLoadBalancing: true,
  enableAutoScaling: false
});

// Spawn a single agent
const agent = await orchestrator.spawnAgent({
  name: 'Code Reviewer',
  type: 'claude',
  capabilities: ['code-review', 'security-analysis']
});

// Execute a task
const task: TaskDefinition = {
  name: 'Review Authentication Module',
  description: 'Review the authentication module for security vulnerabilities',
  requiredCapabilities: ['security-analysis']
};

const result = await orchestrator.executeTask(task);
console.log('Task result:', result.result);
```

### Creating Specialized Teams

```typescript
// Create a development team
const devTeam = await orchestrator.createTeam('frontend-team', [
  {
    name: 'ui-designer',
    capabilities: ['ui-design', 'ux-design', 'prototyping'],
    config: {
      model: 'claude-3-opus-20240229',
      temperature: 0.8
    }
  },
  {
    name: 'component-developer',
    capabilities: ['react', 'typescript', 'component-development'],
    config: {
      model: 'claude-3-opus-20240229',
      temperature: 0.3
    }
  },
  {
    name: 'accessibility-specialist',
    capabilities: ['accessibility', 'a11y', 'wcag'],
    config: {
      temperature: 0.1
    }
  }
]);

// Listen to team events
orchestrator.on('team:created', ({ teamName, agents }) => {
  console.log(`Team ${teamName} created with agents: ${agents.join(', ')}`);
});
```

### Parallel Task Execution

```typescript
// Define multiple tasks to run in parallel
const tasks: TaskDefinition[] = [
  {
    name: 'Write Unit Tests',
    description: 'Write comprehensive unit tests for the user service',
    requiredCapabilities: ['test-generation']
  },
  {
    name: 'Security Audit',
    description: 'Perform security audit on payment module',
    requiredCapabilities: ['security-audit']
  },
  {
    name: 'Performance Analysis',
    description: 'Analyze performance bottlenecks in API endpoints',
    requiredCapabilities: ['performance-analysis']
  }
];

// Execute all tasks in parallel
const results = await orchestrator.executeParallelTasks(tasks);

results.forEach((result, index) => {
  console.log(`Task ${tasks[index].name}:`, {
    status: result.status,
    duration: result.duration,
    agent: result.agentId
  });
});
```

### Pipeline Task Execution

```typescript
// Create a pipeline of tasks where output flows to next task
const pipeline: TaskDefinition[] = [
  {
    name: 'Requirements Analysis',
    description: 'Analyze user requirements for new feature',
    requiredCapabilities: ['requirements-analysis']
  },
  {
    name: 'Architecture Design',
    description: 'Design system architecture based on requirements',
    requiredCapabilities: ['architecture-design']
  },
  {
    name: 'Implementation',
    description: 'Implement the feature based on architecture',
    requiredCapabilities: ['code-generation']
  },
  {
    name: 'Testing',
    description: 'Create and run tests for the implementation',
    requiredCapabilities: ['test-generation', 'testing']
  }
];

// Execute pipeline
const pipelineResults = await orchestrator.executePipeline(pipeline);

pipelineResults.forEach((result, index) => {
  console.log(`Pipeline step ${index + 1} (${pipeline[index].name}):`, {
    status: result.status,
    duration: result.duration
  });
});
```

### Complex Task with Subtasks

```typescript
const complexTask: TaskDefinition = {
  name: 'Build E-commerce Feature',
  description: 'Build a complete e-commerce checkout feature',
  requiredCapabilities: ['full-stack-development'],
  subtasks: [
    {
      name: 'Database Schema',
      description: 'Design database schema for orders and payments',
      requiredCapabilities: ['database-design'],
      preferredAgentType: 'claude'
    },
    {
      name: 'Backend API',
      description: 'Create REST API for checkout process',
      requiredCapabilities: ['api-development'],
      preferredAgentType: 'claude'
    },
    {
      name: 'Frontend Components',
      description: 'Build React components for checkout UI',
      requiredCapabilities: ['react-development'],
      preferredAgentType: 'claude'
    },
    {
      name: 'Payment Integration',
      description: 'Integrate with payment gateway',
      requiredCapabilities: ['payment-integration'],
      preferredAgentType: 'claude'
    }
  ],
  retryCount: 2,
  timeout: 180000 // 3 minutes
};

const result = await orchestrator.executeTask(complexTask);
console.log('Complex task completed with subtasks:', result.result);
```

### Load Balancing and Auto-scaling

```typescript
const scalableOrchestrator = new AgentOrchestrator({
  maxAgents: 20,
  enableLoadBalancing: true,
  enableAutoScaling: true,
  agentTimeout: 30000
});

// Monitor agent load
scalableOrchestrator.on('agent:spawned', (agent) => {
  console.log(`New agent spawned: ${agent.name} (${agent.id})`);
});

scalableOrchestrator.on('agent:terminated', (agentId) => {
  console.log(`Agent terminated: ${agentId}`);
});

// Get statistics
const stats = scalableOrchestrator.getStats();
console.log('Orchestrator stats:', {
  totalAgents: stats.totalAgents,
  completedTasks: stats.completedTasks,
  failedTasks: stats.failedTasks,
  agentLoad: stats.agentLoad
});
```

## API Reference

### Constructor

```typescript
constructor(config?: OrchestratorConfig)
```

### Configuration

#### OrchestratorConfig

```typescript
interface OrchestratorConfig {
  maxAgents?: number;
  maxThreads?: number;
  defaultAgentType?: 'claude' | 'openai' | 'custom';
  agentTimeout?: number;
  enableLoadBalancing?: boolean;
  enableAutoScaling?: boolean;
}
```

#### TaskDefinition

```typescript
interface TaskDefinition {
  id?: string;
  name: string;
  description: string;
  requiredCapabilities?: string[];
  preferredAgentType?: string;
  subtasks?: TaskDefinition[];
  dependencies?: string[];
  timeout?: number;
  retryCount?: number;
}
```

#### TaskResult

```typescript
interface TaskResult {
  taskId: string;
  agentId: string;
  threadId: string;
  status: 'success' | 'failure' | 'partial';
  result: any;
  error?: Error;
  duration: number;
  retries: number;
}
```

### Methods

#### Agent Management

**spawnAgent(config: AgentConfig): Promise<BaseAgent>**
Spawn a new agent with the given configuration.

**spawnAgents(configs: AgentConfig[]): Promise<BaseAgent[]>**
Spawn multiple agents in parallel.

**createTeam(teamName: string, roles: Array<{name: string; capabilities: string[]; config?: Partial<AgentConfig>}>): Promise<Map<string, BaseAgent>>**
Create a specialized team of agents.

**terminateAgent(agentId: string): Promise<void>**
Terminate a specific agent.

**getAgent(agentId: string): BaseAgent | undefined**
Get an agent by ID.

**getAllAgents(): BaseAgent[]**
Get all active agents.

#### Task Execution

**executeTask(task: TaskDefinition): Promise<TaskResult>**
Execute a single task.

**executeParallelTasks(tasks: TaskDefinition[]): Promise<TaskResult[]>**
Execute multiple tasks in parallel.

**executePipeline(tasks: TaskDefinition[]): Promise<TaskResult[]>**
Execute tasks as a pipeline (sequentially with output chaining).

#### Results and Monitoring

**getTaskResult(taskId: string): TaskResult | undefined**
Get the result of a specific task.

**getStats(): Object**
Get orchestrator statistics and performance metrics.

#### Lifecycle

**terminate(): void**
Terminate the orchestrator and all agents.

## Events

The orchestrator emits various events:

### Agent Events

- **'agent:spawned'**: Fired when an agent is spawned
- **'agent:terminated'**: Fired when an agent is terminated
- **'agent:status'**: Fired when an agent's status changes
- **'agent:error'**: Fired when an agent encounters an error

### Task Events

- **'task:started'**: Fired when a task starts execution
- **'task:completed'**: Fired when a task completes successfully
- **'task:failed'**: Fired when a task fails
- **'task:retry'**: Fired when a task is retried

### Team Events

- **'team:created'**: Fired when a team is created

## Advanced Integration Patterns

### Workflow Engine

```typescript
class WorkflowEngine {
  private orchestrator: AgentOrchestrator;
  private workflows: Map<string, Workflow> = new Map();

  constructor(orchestrator: AgentOrchestrator) {
    this.orchestrator = orchestrator;
  }

  async registerWorkflow(name: string, definition: WorkflowDefinition) {
    const workflow = new Workflow(definition);
    this.workflows.set(name, workflow);
    
    // Set up event handlers
    workflow.on('step:complete', async (step, result) => {
      if (step.nextStep) {
        await this.executeStep(workflow, step.nextStep, result);
      }
    });
  }

  async executeWorkflow(name: string, input: any) {
    const workflow = this.workflows.get(name);
    if (!workflow) throw new Error(`Workflow ${name} not found`);
    
    return this.executeStep(workflow, workflow.startStep, input);
  }

  private async executeStep(workflow: Workflow, stepName: string, input: any) {
    const step = workflow.getStep(stepName);
    const task: TaskDefinition = {
      name: step.name,
      description: `${step.description}\n\nInput: ${JSON.stringify(input)}`,
      requiredCapabilities: step.capabilities
    };

    const result = await this.orchestrator.executeTask(task);
    workflow.emit('step:complete', step, result.result);
    
    return result.result;
  }
}

interface WorkflowDefinition {
  name: string;
  startStep: string;
  steps: Record<string, WorkflowStep>;
}

interface WorkflowStep {
  name: string;
  description: string;
  capabilities: string[];
  nextStep?: string;
}
```

### Resource Manager

```typescript
class ResourceManager {
  private orchestrator: AgentOrchestrator;
  private resources: Map<string, Resource> = new Map();
  private allocations: Map<string, string[]> = new Map(); // agentId -> resourceIds

  constructor(orchestrator: AgentOrchestrator) {
    this.orchestrator = orchestrator;
  }

  registerResource(name: string, config: ResourceConfig) {
    const resource = new Resource(name, config);
    this.resources.set(name, resource);
  }

  async allocateResources(agentId: string, requirements: string[]): Promise<string[]> {
    const availableResources = this.findAvailableResources(requirements);
    
    if (availableResources.length < requirements.length) {
      throw new Error('Insufficient resources available');
    }

    // Allocate resources to agent
    const allocation = availableResources.slice(0, requirements.length);
    this.allocations.set(agentId, allocation);
    
    // Mark resources as allocated
    allocation.forEach(resourceId => {
      this.resources.get(resourceId)?.allocate(agentId);
    });

    return allocation;
  }

  async executeWithResources(
    agentId: string, 
    task: TaskDefinition, 
    resourceRequirements: string[]
  ): Promise<TaskResult> {
    const resources = await this.allocateResources(agentId, resourceRequirements);
    
    try {
      // Add resource context to task
      task.description += `\n\nAvailable resources: ${resources.join(', ')}`;
      
      const result = await this.orchestrator.executeTask(task);
      return result;
    } finally {
      // Release resources
      this.releaseResources(agentId);
    }
  }

  private findAvailableResources(requirements: string[]): string[] {
    return Array.from(this.resources.values())
      .filter(resource => 
        requirements.includes(resource.type) && 
        resource.isAvailable()
      )
      .map(resource => resource.id);
  }

  private releaseResources(agentId: string) {
    const allocatedResources = this.allocations.get(agentId) || [];
    
    allocatedResources.forEach(resourceId => {
      this.resources.get(resourceId)?.release();
    });
    
    this.allocations.delete(agentId);
  }
}

class Resource {
  public readonly id: string;
  public readonly type: string;
  private allocatedTo?: string;

  constructor(name: string, public config: ResourceConfig) {
    this.id = `${name}-${Date.now()}`;
    this.type = config.type;
  }

  allocate(agentId: string) {
    this.allocatedTo = agentId;
  }

  release() {
    this.allocatedTo = undefined;
  }

  isAvailable(): boolean {
    return this.allocatedTo === undefined;
  }
}

interface ResourceConfig {
  type: string;
  capacity?: number;
  metadata?: Record<string, any>;
}
```

### Priority Queue Manager

```typescript
class PriorityTaskManager {
  private orchestrator: AgentOrchestrator;
  private priorityQueue: TaskQueue[] = [];
  private isProcessing = false;

  constructor(orchestrator: AgentOrchestrator) {
    this.orchestrator = orchestrator;
  }

  addTask(task: TaskDefinition, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    const queueIndex = this.getQueueIndex(priority);
    
    if (!this.priorityQueue[queueIndex]) {
      this.priorityQueue[queueIndex] = new TaskQueue(priority);
    }
    
    this.priorityQueue[queueIndex].enqueue(task);
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    this.isProcessing = true;
    
    while (this.hasTasks()) {
      const task = this.getNextTask();
      if (!task) break;
      
      try {
        await this.orchestrator.executeTask(task);
      } catch (error) {
        console.error(`Failed to execute task ${task.name}:`, error);
      }
    }
    
    this.isProcessing = false;
  }

  private hasTasks(): boolean {
    return this.priorityQueue.some(queue => queue.size() > 0);
  }

  private getNextTask(): TaskDefinition | null {
    for (const queue of this.priorityQueue) {
      if (queue.size() > 0) {
        return queue.dequeue();
      }
    }
    return null;
  }

  private getQueueIndex(priority: string): number {
    const priorities = ['low', 'medium', 'high', 'critical'];
    return priorities.indexOf(priority);
  }
}

class TaskQueue {
  private tasks: TaskDefinition[] = [];

  constructor(public priority: string) {}

  enqueue(task: TaskDefinition) {
    this.tasks.push(task);
  }

  dequeue(): TaskDefinition | null {
    return this.tasks.shift() || null;
  }

  size(): number {
    return this.tasks.length;
  }
}
```

## Best Practices

1. **Agent Lifecycle Management**: Always terminate agents when no longer needed to free resources.

2. **Task Design**: Break down complex tasks into smaller, focused subtasks.

3. **Error Handling**: Implement proper error handling and retry logic for tasks.

4. **Load Balancing**: Enable load balancing for optimal resource utilization.

5. **Monitoring**: Monitor orchestrator statistics to identify bottlenecks.

6. **Resource Allocation**: Be mindful of memory and CPU usage when spawning many agents.

7. **Timeout Management**: Set appropriate timeouts for tasks to prevent hanging.

8. **Team Composition**: Create balanced teams with complementary capabilities.

## Performance Optimization

```typescript
class OptimizedOrchestrator extends AgentOrchestrator {
  private taskCache = new Map<string, TaskResult>();
  private agentPool: BaseAgent[] = [];
  private metrics = new Map<string, number>();

  constructor(config?: OrchestratorConfig) {
    super(config);
    this.setupOptimizations();
  }

  private setupOptimizations() {
    // Pre-warm agent pool
    this.preWarmAgents();
    
    // Set up metrics collection
    this.setupMetrics();
  }

  private async preWarmAgents() {
    const poolSize = Math.min(5, this.config.maxAgents || 5);
    
    for (let i = 0; i < poolSize; i++) {
      const agent = await this.spawnAgent({
        name: `Pooled Agent ${i}`,
        type: this.config.defaultAgentType!,
        capabilities: ['general']
      });
      
      this.agentPool.push(agent);
    }
  }

  private setupMetrics() {
    this.on('task:completed', (result) => {
      this.metrics.set('completed_tasks', (this.metrics.get('completed_tasks') || 0) + 1);
      this.metrics.set('avg_duration', this.calculateAverageDuration(result.duration));
    });
  }

  async executeTaskWithCaching(task: TaskDefinition): Promise<TaskResult> {
    const cacheKey = this.generateCacheKey(task);
    
    if (this.taskCache.has(cacheKey)) {
      const cached = this.taskCache.get(cacheKey)!;
      this.metrics.set('cache_hits', (this.metrics.get('cache_hits') || 0) + 1);
      return cached;
    }

    const result = await this.executeTask(task);
    this.taskCache.set(cacheKey, result);
    
    return result;
  }

  private generateCacheKey(task: TaskDefinition): string {
    return Buffer.from(`${task.name}-${task.description}`).toString('base64');
  }

  private calculateAverageDuration(newDuration: number): number {
    const current = this.metrics.get('avg_duration') || 0;
    const count = this.metrics.get('completed_tasks') || 1;
    return (current * (count - 1) + newDuration) / count;
  }

  getOptimizedStats() {
    return {
      ...this.getStats(),
      cacheSize: this.taskCache.size,
      agentPoolSize: this.agentPool.length,
      metrics: Object.fromEntries(this.metrics)
    };
  }
}
```

## Testing

```typescript
import { AgentOrchestrator, TaskDefinition } from '@katalyst/ai';

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    orchestrator = new AgentOrchestrator({
      maxAgents: 5,
      maxThreads: 2,
      defaultAgentType: 'claude',
      enableLoadBalancing: true
    });
  });

  afterEach(() => {
    orchestrator.terminate();
  });

  test('should spawn agents', async () => {
    const agent = await orchestrator.spawnAgent({
      name: 'Test Agent',
      type: 'claude'
    });

    expect(agent).toBeDefined();
    expect(agent.name).toBe('Test Agent');
  });

  test('should execute tasks', async () => {
    const task: TaskDefinition = {
      name: 'Test Task',
      description: 'A simple test task'
    };

    const result = await orchestrator.executeTask(task);
    expect(result.status).toBe('success');
  });

  test('should handle parallel tasks', async () => {
    const tasks: TaskDefinition[] = [
      { name: 'Task 1', description: 'First task' },
      { name: 'Task 2', description: 'Second task' },
      { name: 'Task 3', description: 'Third task' }
    ];

    const results = await orchestrator.executeParallelTasks(tasks);
    expect(results).toHaveLength(3);
    expect(results.every(r => r.status === 'success')).toBe(true);
  });

  test('should create teams', async () => {
    const team = await orchestrator.createTeam('test-team', [
      { name: 'developer', capabilities: ['coding'] },
      { name: 'designer', capabilities: ['design'] }
    ]);

    expect(team.size).toBe(2);
    expect(team.has('developer')).toBe(true);
    expect(team.has('designer')).toBe(true);
  });
});
```
