# AI Manager

The `AI` class is the main entry point for AI functionality in the Katalyst framework. It provides a high-level interface for managing agents, threads, and task execution with a simplified API.

## Overview

The AI Manager provides:
- Singleton pattern for global AI management
- Agent and thread lifecycle management
- Task execution and coordination
- Multi-agent conversation support
- Team creation and management
- Chat interface for quick interactions

## Usage Examples

### Basic Setup and Usage

```typescript
import { AI, ClaudeConfig } from '@katalyst/ai';

// Initialize AI manager
const ai = new AI({
  apiKeys: {
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai: process.env.OPENAI_API_KEY
  },
  orchestrator: {
    maxAgents: 10,
    enableLoadBalancing: true
  },
  threadPool: {
    maxThreads: 5,
    threadTimeout: 300000
  },
  defaultAgent: {
    model: 'claude-3-opus-20240229',
    temperature: 0.7,
    maxTokens: 4096
  }
});

// Create a Claude agent
const agent = await ai.createClaudeAgent({
  name: 'Code Assistant',
  systemPrompt: 'You are an expert software developer helping with code-related tasks.'
});

// Execute a task
const result = await ai.executeTask({
  name: 'Code Review',
  description: 'Review this function for bugs and improvements',
  requiredCapabilities: ['code-review']
});

console.log('Task result:', result.result);
```

### Singleton Pattern Usage

```typescript
import { ai } from '@katalyst/ai';

// Use the global instance
const response = await ai.chat('Help me understand dependency injection');
console.log(response);

// Execute tasks through the global instance
const result = await ai.executeTask({
  name: 'Generate Tests',
  description: 'Generate unit tests for a user service class',
  requiredCapabilities: ['test-generation']
});
```

### Quick Chat Interface

```typescript
import { chat } from '@katalyst/ai';

// Quick chat with default configuration
const response = await chat('Explain microservices architecture');
console.log(response);

// Chat with custom configuration
const customResponse = await chat('Design a REST API for user management', {
  model: 'claude-3-opus-20240229',
  temperature: 0.3,
  systemPrompt: 'You are an API design expert. Focus on REST principles and best practices.'
});
```

### Multi-Agent Conversations

```typescript
// Create multiple agents
const architect = await ai.createClaudeAgent({
  name: 'Architect',
  systemPrompt: 'You are a software architect focused on system design.'
});

const developer = await ai.createClaudeAgent({
  name: 'Developer',
  systemPrompt: 'You are a senior developer focused on implementation details.'
});

const tester = await ai.createClaudeAgent({
  name: 'QA Tester',
  systemPrompt: 'You are a QA engineer focused on testing and quality assurance.'
});

// Run a multi-agent conversation
const conversation = await ai.runConversation(
  [architect, developer, tester],
  3, // 3 rounds of conversation
  'Design a user authentication system with the following requirements: secure, scalable, and maintainable.'
);

conversation.forEach((message, index) => {
  console.log(`Round ${Math.floor(index / 3) + 1}, ${message.role}: ${message.content}`);
});
```

### Team Creation and Management

```typescript
// Create a development team
const devTeam = await ai.createTeam('fullstack-team', [
  {
    name: 'frontend-dev',
    capabilities: ['react', 'typescript', 'css', 'ui-design'],
    config: {
      temperature: 0.6,
      systemPrompt: 'You are a frontend developer specializing in React and TypeScript.'
    }
  },
  {
    name: 'backend-dev',
    capabilities: ['nodejs', 'database', 'api-design', 'security'],
    config: {
      temperature: 0.4,
      systemPrompt: 'You are a backend developer specializing in Node.js and database design.'
    }
  },
  {
    name: 'devops-engineer',
    capabilities: ['docker', 'kubernetes', 'ci-cd', 'cloud'],
    config: {
      temperature: 0.3,
      systemPrompt: 'You are a DevOps engineer focused on deployment and infrastructure.'
    }
  }
]);

// Use the team for complex tasks
const teamResult = await ai.executeTask({
  name: 'Build E-commerce Platform',
  description: 'Build a complete e-commerce platform with user authentication, product catalog, and payment processing',
  requiredCapabilities: ['fullstack-development', 'database-design', 'security']
});
```

### Parallel Task Execution

```typescript
// Define multiple tasks to run in parallel
const tasks = [
  {
    name: 'Database Design',
    description: 'Design database schema for user management system',
    requiredCapabilities: ['database-design']
  },
  {
    name: 'API Documentation',
    description: 'Create comprehensive API documentation',
    requiredCapabilities: ['documentation']
  },
  {
    name: 'Security Review',
    description: 'Review authentication system for security vulnerabilities',
    requiredCapabilities: ['security-analysis']
  },
  {
    name: 'Performance Testing',
    description: 'Create performance test suite',
    requiredCapabilities: ['test-generation', 'performance']
  }
];

// Execute all tasks in parallel
const results = await ai.executeParallel(tasks);

results.forEach((result, index) => {
  console.log(`${tasks[index].name}: ${result.status} (${result.duration}ms)`);
});
```

### Pipeline Task Execution

```typescript
// Create a pipeline of related tasks
const developmentPipeline = [
  {
    name: 'Requirements Analysis',
    description: 'Analyze requirements for a blog platform',
    requiredCapabilities: ['requirements-analysis']
  },
  {
    name: 'Architecture Design',
    description: 'Design system architecture based on requirements',
    requiredCapabilities: ['architecture-design']
  },
  {
    name: 'Database Schema',
    description: 'Create database schema for the blog platform',
    requiredCapabilities: ['database-design']
  },
  {
    name: 'API Development',
    description: 'Implement REST APIs for the blog platform',
    requiredCapabilities: ['api-development']
  },
  {
    name: 'Testing',
    description: 'Create comprehensive test suite',
    requiredCapabilities: ['test-generation']
  }
];

// Execute pipeline
const pipelineResults = await ai.executePipeline(developmentPipeline);

// Results are passed from one task to the next
pipelineResults.forEach((result, index) => {
  console.log(`Step ${index + 1} - ${developmentPipeline[index].name}:`);
  console.log(`Status: ${result.status}`);
  console.log(`Duration: ${result.duration}ms`);
});
```

### Thread Management

```typescript
// Create and manage threads
const thread = await ai.createThread();

// Add an agent to the thread
const agent = await ai.createClaudeAgent({
  name: 'Research Assistant'
});
thread.addAgent(agent, true);

// Send messages and get responses
const response1 = await thread.send('Research the latest trends in AI development');
const response2 = await thread.send('Based on your research, what are the key technologies to learn?');

// Get thread history
const history = thread.getMessages();
console.log(`Total messages in thread: ${history.length}`);

// Clean up
thread.terminate();
```

## API Reference

### Constructor

```typescript
constructor(config?: AIConfig)
```

### Configuration

#### AIConfig

```typescript
interface AIConfig {
  orchestrator?: OrchestratorConfig;
  threadPool?: ThreadPoolConfig;
  defaultAgent?: AgentConfig;
  apiKeys?: {
    anthropic?: string;
    openai?: string;
    google?: string;
  };
}
```

### Methods

#### Agent Management

**createClaudeAgent(config?: Partial<ClaudeConfig>): Promise<ClaudeAgent>**
Create a new Claude agent with optional configuration overrides.

**spawnAgent(config: AgentConfig): Promise<BaseAgent>**
Spawn an agent through the orchestrator.

**createTeam(teamName: string, roles: Array<{name: string; capabilities: string[]; config?: Partial<AgentConfig>}>): Promise<Map<string, BaseAgent>>**
Create a team of specialized agents.

#### Task Execution

**executeTask(task: TaskDefinition): Promise<TaskResult>**
Execute a single task.

**executeParallel(tasks: TaskDefinition[]): Promise<TaskResult[]>**
Execute multiple tasks in parallel.

**executePipeline(tasks: TaskDefinition[]): Promise<TaskResult[]>**
Execute tasks as a pipeline where output flows to the next task.

#### Chat Interface

**chat(message: string, config?: Partial<ClaudeConfig>): Promise<string>**
Quick chat interface with Claude.

**runConversation(agents: BaseAgent[], rounds: number, initialMessage: string): Promise<any[]>**
Run a multi-agent conversation.

#### Thread Management

**createThread(): Promise<Thread>**
Create a new thread.

#### Monitoring

**getStats(): Object**
Get statistics about agents, threads, and tasks.

#### Lifecycle

**terminate(): void**
Terminate the AI manager and clean up all resources.

### Static Methods

**getInstance(config?: AIConfig): AI**
Get the singleton instance of the AI manager.

## Integration Patterns

### Application Service Layer

```typescript
class AIDevService {
  private ai: AI;

  constructor() {
    this.ai = AI.getInstance({
      apiKeys: {
        anthropic: process.env.ANTHROPIC_API_KEY
      }
    });
  }

  async codeReview(code: string): Promise<CodeReviewResult> {
    const result = await this.ai.executeTask({
      name: 'Code Review',
      description: `Review this code for bugs, security issues, and improvements:\n\n${code}`,
      requiredCapabilities: ['code-review', 'security-analysis']
    });

    return {
      review: result.result,
      issues: this.extractIssues(result.result),
      suggestions: this.extractSuggestions(result.result),
      score: this.calculateScore(result.result)
    };
  }

  async generateDocumentation(code: string, type: 'api' | 'readme' | 'inline' = 'api'): Promise<string> {
    const response = await this.ai.chat(
      `Generate ${type} documentation for this code:\n\n${code}`,
      {
        systemPrompt: 'You are a technical documentation expert. Create clear, comprehensive documentation.',
        temperature: 0.3
      }
    );

    return response;
  }

  async refactorCode(code: string, goals: string[]): Promise<RefactorResult> {
    const goalDescription = goals.join(', ');
    
    const result = await this.ai.executeTask({
      name: 'Code Refactoring',
      description: `Refactor this code to achieve the following goals: ${goalDescription}\n\n${code}`,
      requiredCapabilities: ['refactoring', 'code-optimization']
    });

    return {
      refactoredCode: result.result,
      improvements: this.identifyImprovements(code, result.result),
      breakingChanges: this.identifyBreakingChanges(code, result.result)
    };
  }
}
```

### Plugin System

```typescript
interface AIPlugin {
  name: string;
  version: string;
  initialize(ai: AI): Promise<void>;
  execute(input: any): Promise<any>;
}

class CodeGeneratorPlugin implements AIPlugin {
  name = 'code-generator';
  version = '1.0.0';
  private ai!: AI;

  async initialize(ai: AI) {
    this.ai = ai;
    
    // Register specialized agents
    this.ai.createTeam('code-generation', [
      {
        name: 'generator',
        capabilities: ['code-generation', 'scaffolding'],
        config: {
          systemPrompt: 'You are a code generation expert. Generate clean, maintainable code.',
          temperature: 0.2
        }
      }
    ]);
  }

  async execute(input: { description: string; language: string; framework?: string }): Promise<string> {
    const result = await this.ai.executeTask({
      name: 'Generate Code',
      description: `Generate ${input.language} code for: ${input.description}`,
      requiredCapabilities: ['code-generation'],
      timeout: 60000
    });

    return result.result;
  }
}

// Use plugin
const ai = new AI();
const plugin = new CodeGeneratorPlugin();
await plugin.initialize(ai);

const generatedCode = await plugin.execute({
  description: 'REST API with user authentication',
  language: 'typescript',
  framework: 'express'
});
```

### Middleware System

```typescript
interface AIMiddleware {
  name: string;
  execute(request: AIRequest, next: () => Promise<AIResponse>): Promise<AIResponse>;
}

class LoggingMiddleware implements AIMiddleware {
  name = 'logging';

  async execute(request: AIRequest, next: () => Promise<AIResponse>): Promise<AIResponse> {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] AI Request: ${request.type}`);
    
    try {
      const response = await next();
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] AI Response: ${request.type} (${duration}ms)`);
      
      return response;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] AI Error: ${request.type}`, error);
      throw error;
    }
  }
}

class CachingMiddleware implements AIMiddleware {
  name = 'caching';
  private cache = new Map<string, AIResponse>();

  async execute(request: AIRequest, next: () => Promise<AIResponse>): Promise<AIResponse> {
    const cacheKey = this.generateCacheKey(request);
    
    if (this.cache.has(cacheKey)) {
      console.log(`Cache hit for ${request.type}`);
      return this.cache.get(cacheKey)!;
    }

    const response = await next();
    this.cache.set(cacheKey, response);
    
    return response;
  }

  private generateCacheKey(request: AIRequest): string {
    return Buffer.from(JSON.stringify(request)).toString('base64');
  }
}

class AIWithMiddleware {
  private ai: AI;
  private middlewares: AIMiddleware[] = [];

  constructor(ai: AI) {
    this.ai = ai;
  }

  use(middleware: AIMiddleware) {
    this.middlewares.push(middleware);
  }

  async executeTaskWithMiddleware(task: TaskDefinition): Promise<TaskResult> {
    const request: AIRequest = { type: 'task', data: task };
    
    const executeNext = async () => {
      return this.ai.executeTask(task);
    };

    // Apply middlewares in reverse order
    let next = executeNext;
    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i];
      const currentNext = next;
      next = () => middleware.execute(request, currentNext);
    }

    return next();
  }
}

// Usage
const ai = new AI();
const aiWithMiddleware = new AIWithMiddleware(ai);

aiWithMiddleware.use(new LoggingMiddleware());
aiWithMiddleware.use(new CachingMiddleware());

const result = await aiWithMiddleware.executeTaskWithMiddleware({
  name: 'Test Task',
  description: 'A test task with middleware'
});
```

## Best Practices

1. **Singleton Usage**: Use the singleton pattern for global AI management in applications.

2. **Configuration Management**: Set up configuration once during application initialization.

3. **Resource Management**: Always terminate the AI manager when shutting down the application.

4. **Error Handling**: Implement proper error handling for all AI operations.

5. **Task Design**: Break down complex tasks into smaller, focused subtasks.

6. **Parallel Processing**: Use parallel execution for independent tasks to improve performance.

7. **Pipeline Usage**: Use pipelines for sequential tasks where output depends on previous results.

8. **Team Composition**: Create balanced teams with complementary capabilities.

## Error Handling

```typescript
class RobustAIManager {
  private ai: AI;
  private retryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000
  };

  constructor(config?: AIConfig) {
    this.ai = new AI(config);
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    // Handle orchestrator errors
    this.ai['orchestrator'].on('agent:error', (error) => {
      console.error('Agent error:', error);
      this.handleAgentError(error);
    });
  }

  async executeTaskWithRetry(task: TaskDefinition): Promise<TaskResult> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await this.ai.executeTask(task);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Task execution attempt ${attempt} failed:`, error);

        if (attempt < this.retryConfig.maxRetries) {
          const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
            this.retryConfig.maxDelay
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  private handleAgentError(error: any) {
    // Implement error recovery logic
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      console.log('Rate limit exceeded, implementing backoff');
    } else if (error.code === 'AUTHENTICATION_FAILED') {
      console.error('Authentication failed, check API keys');
    }
  }
}
```

## Testing

```typescript
import { AI } from '@katalyst/ai';

describe('AI Manager', () => {
  let ai: AI;

  beforeEach(() => {
    ai = new AI({
      apiKeys: {
        anthropic: 'test-key'
      },
      defaultAgent: {
        model: 'claude-3-opus-20240229',
        temperature: 0.7
      }
    });
  });

  afterEach(() => {
    ai.terminate();
  });

  test('should create Claude agent', async () => {
    const agent = await ai.createClaudeAgent({
      name: 'Test Agent'
    });

    expect(agent).toBeDefined();
    expect(agent.name).toBe('Test Agent');
  });

  test('should execute tasks', async () => {
    const task = {
      name: 'Test Task',
      description: 'A simple test task'
    };

    const result = await ai.executeTask(task);
    expect(result.status).toBe('success');
  });

  test('should support chat interface', async () => {
    const response = await ai.chat('Hello, world!');
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
  });

  test('should create teams', async () => {
    const team = await ai.createTeam('test-team', [
      { name: 'developer', capabilities: ['coding'] },
      { name: 'designer', capabilities: ['design'] }
    ]);

    expect(team.size).toBe(2);
  });

  test('should handle parallel execution', async () => {
    const tasks = [
      { name: 'Task 1', description: 'First task' },
      { name: 'Task 2', description: 'Second task' }
    ];

    const results = await ai.executeParallel(tasks);
    expect(results).toHaveLength(2);
  });
});
```
