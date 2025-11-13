# Base Agent

The `BaseAgent` class is the foundation for all AI agents in the Katalyst framework. It provides a comprehensive set of features for creating, managing, and orchestrating AI agents with event-driven architecture and sub-agent capabilities.

## Overview

`BaseAgent` is an abstract class that implements:
- Event-driven communication
- Message history management
- Tool execution framework
- Sub-agent spawning and delegation
- Context management
- Status tracking

## Usage Examples

### Creating a Custom Agent

```typescript
import { BaseAgent, AgentConfig } from '@katalyst/ai';

class MyCustomAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  async process(input: string, context?: Partial<AgentContext>): Promise<string> {
    // Implement your agent logic here
    return `Processed: ${input}`;
  }

  protected async createAgent(config: AgentConfig): Promise<BaseAgent> {
    return new MyCustomAgent(config);
  }
}

const agent = new MyCustomAgent({
  name: 'My Agent',
  type: 'custom',
  capabilities: ['text-processing', 'analysis']
});
```

### Basic Agent Communication

```typescript
// Send a message and get response
const response = await agent.send('Hello, how can you help me?');
console.log(response);

// Listen to events
agent.on('message', (msg) => {
  console.log('User message:', msg.content);
});

agent.on('response', (msg) => {
  console.log('Agent response:', msg.content);
});

agent.on('status:change', ({ from, to }) => {
  console.log(`Status changed from ${from} to ${to}`);
});
```

### Using Tools

```typescript
// Register a tool
agent.registerTool({
  name: 'calculator',
  description: 'Perform mathematical calculations',
  parameters: {
    expression: { type: 'string', required: true }
  },
  execute: async (params) => {
    return eval(params.expression); // Use safe evaluation in production
  }
});

// Execute a tool
const result = await agent.executeTool('calculator', {
  expression: '2 + 2'
});
console.log(result); // 4
```

### Working with Sub-agents

```typescript
// Spawn a sub-agent
const subAgent = await agent.spawnSubAgent({
  name: 'Helper Agent',
  type: 'claude',
  capabilities: ['research']
});

// Delegate tasks to sub-agent
const result = await agent.delegateToSubAgent(subAgent.id, 'Research AI trends');

// Listen to sub-agent events
agent.on('subagent:message', ({ agentId, message }) => {
  console.log(`Sub-agent ${agentId}:`, message.content);
});
```

### Context Management

```typescript
// Set context variables
agent.setContextVariable('user_name', 'John');
agent.setContextVariable('project', 'Katalyst');

// Get context variables
const userName = agent.getContextVariable('user_name');
const project = agent.getContextVariable('project');

// Get message history
const history = agent.getHistory();
console.log(`Total messages: ${history.length}`);

// Clear history
agent.clearHistory();
```

## API Reference

### Constructor

```typescript
constructor(config: AgentConfig)
```

**Parameters:**
- `config: AgentConfig` - Configuration object for the agent

### Methods

#### Core Methods

**send(message: string, role?: 'user' | 'system'): Promise<string>**
Send a message to the agent and get a response.

**process(input: string, context?: Partial<AgentContext>): Promise<string>**
Abstract method that must be implemented by subclasses. Process the input and return a response.

#### Sub-agent Management

**spawnSubAgent(config: AgentConfig): Promise<BaseAgent>**
Create and manage a sub-agent.

**delegateToSubAgent(agentId: string, task: string): Promise<string>**
Delegate a task to a specific sub-agent.

#### Tool Management

**registerTool(tool: AgentTool): void**
Register a tool that the agent can use.

**executeTool(toolName: string, params: any): Promise<any>**
Execute a registered tool with parameters.

#### Context & History

**setContextVariable(key: string, value: any): void**
Set a variable in the agent's context.

**getContextVariable(key: string): any**
Get a variable from the agent's context.

**getHistory(): AgentMessage[]**
Get the complete message history.

**clearHistory(): void**
Clear the message history.

#### Status & Lifecycle

**getStatus(): AgentStatus**
Get the current status of the agent.

**terminate(): void**
Terminate the agent and clean up resources.

### Properties

**id: string** - Unique identifier for the agent
**name: string** - Human-readable name
**type: string** - Type of the agent (claude, openai, etc.)
**config: AgentConfig** - Configuration object

## Interfaces

### AgentConfig

```typescript
interface AgentConfig {
  id?: string;
  name: string;
  type: 'claude' | 'openai' | 'llama' | 'custom';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  capabilities?: string[];
  memory?: boolean;
  tools?: AgentTool[];
  metadata?: Record<string, any>;
}
```

### AgentTool

```typescript
interface AgentTool {
  name: string;
  description: string;
  parameters?: Record<string, any>;
  execute: (params: any) => Promise<any>;
}
```

### AgentMessage

```typescript
interface AgentMessage {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

### AgentContext

```typescript
interface AgentContext {
  threadId: string;
  parentAgentId?: string;
  sessionId: string;
  variables: Map<string, any>;
  history: AgentMessage[];
}
```

### AgentStatus

```typescript
enum AgentStatus {
  IDLE = 'idle',
  THINKING = 'thinking',
  EXECUTING = 'executing',
  WAITING = 'waiting',
  ERROR = 'error',
  TERMINATED = 'terminated'
}
```

## Events

The agent emits various events that you can listen to:

### Core Events

- **'message'**: Fired when a user message is received
- **'response'**: Fired when an agent response is generated
- **'status:change'**: Fired when the agent status changes
- **'error'**: Fired when an error occurs

### Tool Events

- **'tool:registered'**: Fired when a tool is registered
- **'tool:execute:start'**: Fired when tool execution starts
- **'tool:execute:complete'**: Fired when tool execution completes
- **'tool:execute:error'**: Fired when tool execution fails

### Sub-agent Events

- **'subagent:spawned'**: Fired when a sub-agent is spawned
- **'subagent:message'**: Fired when a sub-agent receives a message
- **'subagent:response'**: Fired when a sub-agent responds
- **'delegation:start'**: Fired when task delegation starts
- **'delegation:complete'**: Fired when task delegation completes

### Context Events

- **'context:updated'**: Fired when a context variable is updated
- **'history:cleared'**: Fired when message history is cleared

## Integration Patterns

### Multi-Agent Systems

```typescript
// Create a parent agent with specialized sub-agents
const orchestrator = new MyCustomAgent({
  name: 'Orchestrator',
  type: 'custom',
  capabilities: ['coordination']
});

// Spawn specialized sub-agents
const coder = await orchestrator.spawnSubAgent({
  name: 'Code Generator',
  type: 'claude',
  capabilities: ['code-generation']
});

const reviewer = await orchestrator.spawnSubAgent({
  name: 'Code Reviewer',
  type: 'claude',
  capabilities: ['code-review']
});

// Coordinate task execution
const code = await orchestrator.delegateToSubAgent(
  coder.id,
  'Generate a REST API endpoint'
);

const review = await orchestrator.delegateToSubAgent(
  reviewer.id,
  `Review this code:\n${code}`
);
```

### Event-Driven Architecture

```typescript
class EventDrivenAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // React to status changes
    this.on('status:change', ({ from, to }) => {
      if (to === AgentStatus.THINKING) {
        this.emit('thinking:start');
      }
    });

    // Handle tool execution
    this.on('tool:execute:complete', ({ tool, result }) => {
      this.setContextVariable(`last_${tool}_result`, result);
    });

    // Monitor sub-agent activities
    this.on('subagent:response', ({ agentId, message }) => {
      this.logSubAgentActivity(agentId, message);
    });
  }

  private logSubAgentActivity(agentId: string, message: AgentMessage) {
    console.log(`[${new Date().toISOString()}] Sub-agent ${agentId}: ${message.content}`);
  }
}
```

## Best Practices

1. **Implement Proper Error Handling**: Always wrap tool execution and API calls in try-catch blocks.

2. **Manage Memory**: Clear message history periodically to prevent memory leaks in long-running agents.

3. **Use Events**: Leverage the event system for decoupled communication between components.

4. **Validate Tool Parameters**: Validate parameters before executing tools to prevent runtime errors.

5. **Handle Timeouts**: Implement timeouts for long-running operations to prevent hanging.

6. **Clean Up Resources**: Always call `terminate()` when done with an agent to clean up resources.

7. **Use Context Variables**: Store persistent information in context variables rather than global state.

8. **Implement Retry Logic**: Add retry logic for network operations and tool execution.

9. **Monitor Status**: Listen to status changes to track agent health and performance.

10. **Use Sub-agents**: Break down complex tasks into smaller, specialized sub-agents.

## Error Handling

```typescript
class RobustAgent extends BaseAgent {
  async process(input: string, context?: Partial<AgentContext>): Promise<string> {
    try {
      // Your processing logic here
      return await this.processSafely(input, context);
    } catch (error) {
      this.emit('error', error);
      
      // Fallback behavior
      if (error instanceof NetworkError) {
        return 'I apologize, but I\'m experiencing connectivity issues. Please try again.';
      }
      
      throw error;
    }
  }

  private async processSafely(input: string, context?: Partial<AgentContext>): Promise<string> {
    // Implement with proper error handling
  }
}
```

## Testing

```typescript
import { BaseAgent, AgentConfig } from '@katalyst/ai';

// Test helper
class TestAgent extends BaseAgent {
  async process(input: string): Promise<string> {
    return `Test response: ${input}`;
  }

  protected async createAgent(config: AgentConfig): Promise<BaseAgent> {
    return new TestAgent(config);
  }
}

// Test suite
describe('BaseAgent', () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent({
      name: 'Test Agent',
      type: 'test'
    });
  });

  afterEach(() => {
    agent.terminate();
  });

  test('should send and receive messages', async () => {
    const response = await agent.send('Hello');
    expect(response).toBe('Test response: Hello');
  });

  test('should manage context variables', () => {
    agent.setContextVariable('test', 'value');
    expect(agent.getContextVariable('test')).toBe('value');
  });

  test('should emit events', (done) => {
    agent.on('message', (msg) => {
      expect(msg.content).toBe('Hello');
      done();
    });
    
    agent.send('Hello');
  });
});
```
