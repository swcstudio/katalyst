# Base Agent Documentation

The `BaseAgent` class is the abstract foundation for all AI agents in the Katalyst framework, providing core functionality for message handling, tool execution, sub-agent management, and comprehensive event emission.

## Overview

`BaseAgent` is an event-driven abstract class that implements the common patterns and behaviors shared across all AI agent implementations. It provides a robust foundation for building specialized agents while maintaining consistency and interoperability.

## Core Features

- **Message Processing**: Handle incoming messages and generate responses
- **Tool System**: Register and execute custom tools with parameter validation
- **Sub-Agent Management**: Spawn and delegate tasks to specialized sub-agents
- **Event System**: Comprehensive event emission for monitoring and debugging
- **Context Management**: Maintain conversation context and variables
- **Status Tracking**: Monitor agent lifecycle states
- **Memory Management**: Control message history and data retention

## Class Definition

```typescript
export abstract class BaseAgent extends EventEmitter {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly config: AgentConfig;
  protected status: AgentStatus = AgentStatus.IDLE;
  protected context: AgentContext;
  protected subAgents: Map<string, BaseAgent> = new Map();
  protected tools: Map<string, AgentTool> = new Map();
  protected messageHistory: AgentMessage[] = [];
}
```

## Constructor

```typescript
constructor(config: AgentConfig)
```

Creates a new agent instance with the provided configuration.

### Parameters

- `config: AgentConfig` - Agent configuration object

### Example

```typescript
const agent = new MyAgent({
  id: 'agent-123',
  name: 'Research Assistant',
  type: 'claude',
  model: 'claude-3-sonnet',
  temperature: 0.7,
  maxTokens: 4000,
  systemPrompt: 'You are a helpful research assistant.',
  tools: [searchTool, analysisTool],
  memory: true,
  capabilities: ['research', 'analysis']
});
```

## Core Methods

### Abstract Methods

#### `process(input: string, context?: Partial<AgentContext>): Promise<string>`

**Abstract method** that must be implemented by concrete agent classes. Handles the core processing logic for generating responses from input.

**Parameters:**
- `input: string` - The input message to process
- `context?: Partial<AgentContext>` - Optional context override

**Returns:** `Promise<string>` - The generated response

**Example Implementation:**
```typescript
async process(input: string, context?: Partial<AgentContext>): Promise<string> {
  // Implementation specific to agent type
  return await this.callAIProvider(input, context);
}
```

#### `createAgent(config: AgentConfig): Promise<BaseAgent>`

**Abstract method** for creating new agent instances. Used by `spawnSubAgent()`.

**Parameters:**
- `config: AgentConfig` - Configuration for the new agent

**Returns:** `Promise<BaseAgent>` - New agent instance

### Public Methods

#### `send(message: string, role?: 'user' | 'system'): Promise<string>`

Send a message to the agent and receive a response.

**Parameters:**
- `message: string` - The message to send
- `role?: 'user' | 'system'` - Message role (default: 'user')

**Returns:** `Promise<string>` - Agent's response

**Example:**
```typescript
const response = await agent.send('What is the capital of France?');
console.log(response); // "The capital of France is Paris."
```

#### `spawnSubAgent(config: AgentConfig): Promise<BaseAgent>`

Create and register a sub-agent for specialized tasks.

**Parameters:**
- `config: AgentConfig` - Configuration for the sub-agent

**Returns:** `Promise<BaseAgent>` - Created sub-agent instance

**Example:**
```typescript
const researcher = await agent.spawnSubAgent({
  name: 'Research Specialist',
  type: 'claude',
  systemPrompt: 'You specialize in academic research.'
});
```

#### `delegateToSubAgent(agentId: string, task: string): Promise<string>`

Delegate a task to a specific sub-agent.

**Parameters:**
- `agentId: string` - ID of the sub-agent
- `task: string` - Task description

**Returns:** `Promise<string>` - Result from the sub-agent

**Example:**
```typescript
const result = await agent.delegateToSubAgent(
  researcher.id,
  'Find recent papers on machine learning'
);
```

#### `registerTool(tool: AgentTool): void`

Register a tool that the agent can execute.

**Parameters:**
- `tool: AgentTool` - Tool definition with execute function

**Example:**
```typescript
agent.registerTool({
  name: 'calculator',
  description: 'Perform mathematical calculations',
  parameters: { expression: 'string' },
  execute: async ({ expression }) => eval(expression)
});
```

#### `executeTool(toolName: string, params: any): Promise<any>`

Execute a registered tool with the given parameters.

**Parameters:**
- `toolName: string` - Name of the tool to execute
- `params: any` - Parameters for the tool

**Returns:** `Promise<any>` - Tool execution result

**Example:**
```typescript
const result = await agent.executeTool('calculator', {
  expression: '2 * 3 + 4'
});
```

#### `getStatus(): AgentStatus`

Get the current status of the agent.

**Returns:** `AgentStatus` - Current agent status

#### `getHistory(): AgentMessage[]`

Get the complete message history.

**Returns:** `AgentMessage[]` - Array of all messages

#### `clearHistory(): void`

Clear the message history and context history.

#### `setContextVariable(key: string, value: any): void`

Set a variable in the agent's context.

**Parameters:**
- `key: string` - Variable name
- `value: any` - Variable value

#### `getContextVariable(key: string): any`

Get a variable from the agent's context.

**Parameters:**
- `key: string` - Variable name

**Returns:** `any` - Variable value or undefined

#### `terminate(): void`

Terminate the agent and all sub-agents, cleaning up resources.

## Event System

The `BaseAgent` emits comprehensive events throughout its lifecycle:

### Core Events

```typescript
// Message processing
agent.on('message', (message: AgentMessage) => {
  console.log('Received message:', message.content);
});

agent.on('response', (response: AgentMessage) => {
  console.log('Generated response:', response.content);
});

agent.on('error', (error: Error) => {
  console.error('Agent error:', error);
});
```

### Sub-Agent Events

```typescript
// Sub-agent lifecycle
agent.on('subagent:spawned', (subAgent: BaseAgent) => {
  console.log('Sub-agent created:', subAgent.name);
});

agent.on('subagent:message', (data: { agentId: string, message: AgentMessage }) => {
  console.log(`Sub-agent ${data.agentId} received message`);
});

agent.on('subagent:response', (data: { agentId: string, message: AgentMessage }) => {
  console.log(`Sub-agent ${data.agentId} sent response`);
});
```

### Delegation Events

```typescript
// Task delegation
agent.on('delegation:start', (data: { agentId: string, task: string }) => {
  console.log(`Delegating task to ${data.agentId}: ${data.task}`);
});

agent.on('delegation:complete', (data: { agentId: string, task: string, result: string }) => {
  console.log(`Delegation completed: ${data.result}`);
});
```

### Tool Events

```typescript
// Tool management
agent.on('tool:registered', (tool: AgentTool) => {
  console.log('Tool registered:', tool.name);
});

agent.on('tool:execute:start', (data: { tool: string, params: any }) => {
  console.log(`Executing tool: ${data.tool}`);
});

agent.on('tool:execute:complete', (data: { tool: string, result: any }) => {
  console.log(`Tool ${data.tool} completed:`, data.result);
});

agent.on('tool:execute:error', (data: { tool: string, error: Error }) => {
  console.error(`Tool ${data.tool} failed:`, data.error);
});
```

### Status Events

```typescript
// Status changes
agent.on('status:change', (data: { from: AgentStatus, to: AgentStatus }) => {
  console.log(`Status changed from ${data.from} to ${data.to}`);
});

agent.on('terminated', () => {
  console.log('Agent terminated');
});
```

### Context Events

```typescript
// Context management
agent.on('context:updated', (data: { key: string, value: any }) => {
  console.log(`Context variable ${data.key} updated:`, data.value);
});

agent.on('history:cleared', () => {
  console.log('Message history cleared');
});
```

## Usage Examples

### Basic Usage

```typescript
import { BaseAgent, AgentConfig } from '@katalyst/ai';

class MyAgent extends BaseAgent {
  async process(input: string, context?: Partial<AgentContext>): Promise<string> {
    // Implement your AI logic here
    return `Processed: ${input}`;
  }

  protected async createAgent(config: AgentConfig): Promise<BaseAgent> {
    return new MyAgent(config);
  }
}

// Create and use the agent
const agent = new MyAgent({
  name: 'My Agent',
  type: 'custom',
  systemPrompt: 'You are a helpful assistant.'
});

// Set up event listeners
agent.on('response', (msg) => console.log('Response:', msg.content));

// Send messages
const response = await agent.send('Hello, world!');
console.log(response);
```

### Advanced Configuration

```typescript
const advancedAgent = new MyAgent({
  name: 'Advanced Agent',
  type: 'custom',
  temperature: 0.7,
  maxTokens: 4000,
  systemPrompt: 'You are an advanced AI assistant.',
  tools: [
    {
      name: 'search',
      description: 'Search the web',
      parameters: { query: 'string' },
      execute: async ({ query }) => {
        // Implementation
        return searchResults;
      }
    }
  ],
  memory: true,
  capabilities: ['reasoning', 'analysis']
});

// Configure context variables
agent.setContextVariable('userRole', 'admin');
agent.setContextVariable('preferences', { theme: 'dark' });

// Monitor agent status
agent.on('status:change', ({ from, to }) => {
  console.log(`Agent status: ${from} → ${to}`);
});
```

### Sub-Agent Orchestration

```typescript
// Create specialized sub-agents
const researcher = await agent.spawnSubAgent({
  name: 'Research Specialist',
  systemPrompt: 'You specialize in research tasks.',
  tools: [searchTool, databaseTool]
});

const analyst = await agent.spawnSubAgent({
  name: 'Data Analyst',
  systemPrompt: 'You specialize in data analysis.',
  tools: [chartTool, statisticsTool]
});

// Set up monitoring
agent.on('delegation:complete', ({ agentId, result }) => {
  console.log(`Sub-agent ${agentId} completed task:`, result);
});

// Delegate tasks
const researchData = await agent.delegateToSubAgent(
  researcher.id,
  'Research machine learning trends'
);

const analysis = await agent.delegateToSubAgent(
  analyst.id,
  `Analyze this data: ${researchData}`
);
```

## Implementation Guide

### Creating Custom Agents

1. **Extend BaseAgent**: Create a class that extends `BaseAgent`
2. **Implement Abstract Methods**: Provide implementations for `process()` and `createAgent()`
3. **Add Custom Logic**: Implement agent-specific functionality
4. **Handle Configuration**: Process configuration parameters in constructor
5. **Error Handling**: Implement proper error handling and recovery

```typescript
class CustomAgent extends BaseAgent {
  private customConfig: CustomConfig;

  constructor(config: AgentConfig & { custom: CustomConfig }) {
    super(config);
    this.customConfig = config.custom;
    this.setupCustomTools();
  }

  async process(input: string, context?: Partial<AgentContext>): Promise<string> {
    // Custom processing logic
    const processedInput = this.preprocessInput(input);
    const result = await this.callCustomAPI(processedInput);
    return this.postprocessOutput(result);
  }

  protected async createAgent(config: AgentConfig): Promise<BaseAgent> {
    return new CustomAgent(config);
  }

  private setupCustomTools(): void {
    this.registerTool({
      name: 'customTool',
      description: 'Custom tool functionality',
      execute: async (params) => {
        // Custom tool implementation
      }
    });
  }

  private preprocessInput(input: string): string {
    // Input preprocessing
    return input.trim();
  }

  private postprocessOutput(output: string): string {
    // Output postprocessing
    return output;
  }
}
```

### Best Practices

1. **Resource Management**: Always call `terminate()` when done with an agent
2. **Error Handling**: Implement comprehensive error handling in all async operations
3. **Event Monitoring**: Set up event listeners for debugging and monitoring
4. **Memory Management**: Monitor message history size and implement cleanup strategies
5. **Tool Validation**: Validate tool parameters before execution
6. **Security**: Sanitize inputs and implement proper access controls

## Performance Considerations

### Memory Usage
- Monitor message history growth in long-running conversations
- Implement periodic cleanup using `clearHistory()` when appropriate
- Use context variables for efficient data access
- Consider database persistence for long-term memory requirements

### Concurrent Operations
- Agents can handle multiple concurrent messages
- Use sub-agents for parallel task execution
- Implement proper synchronization for shared resources
- Monitor resource usage during high-load scenarios

### Tool Execution
- Design tools to be stateless when possible
- Implement timeout mechanisms for long-running operations
- Use connection pooling for external API calls
- Consider caching for frequently accessed data

## Error Handling

### Common Error Scenarios

1. **Configuration Errors**: Invalid API keys, missing required parameters
2. **Network Errors**: API timeouts, connection failures
3. **Tool Execution Errors**: Invalid parameters, runtime failures
4. **Resource Errors**: Memory limits, rate limiting

### Error Recovery Strategies

```typescript
// Implement retry logic
agent.registerTool({
  name: 'resilientOperation',
  execute: async (params) => {
    const maxRetries = 3;
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await performOperation(params);
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, 1000 * Math.pow(2, i))
          );
        }
      }
    }
    throw lastError;
  }
});

// Handle errors gracefully
agent.on('error', (error) => {
  console.error('Agent error:', error);
  
  // Implement recovery logic
  if (error.message.includes('rate limit')) {
    setTimeout(() => {
      // Retry after delay
    }, 60000);
  }
});
```

## Testing

### Unit Testing

```typescript
import { BaseAgent } from '@katalyst/ai';

class TestAgent extends BaseAgent {
  async process(input: string): Promise<string> {
    return `Echo: ${input}`;
  }

  protected async createAgent(config: AgentConfig): Promise<BaseAgent> {
    return new TestAgent(config);
  }
}

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

  test('should process messages', async () => {
    const response = await agent.send('Hello');
    expect(response).toBe('Echo: Hello');
  });

  test('should execute tools', async () => {
    agent.registerTool({
      name: 'testTool',
      execute: async ({ value }) => value * 2
    });

    const result = await agent.executeTool('testTool', { value: 5 });
    expect(result).toBe(10);
  });

  test('should emit events', (done) => {
    agent.on('response', (message) => {
      expect(message.content).toBe('Echo: Test');
      done();
    });

    agent.send('Test');
  });
});
```

---

*This documentation provides comprehensive guidance for implementing and using the BaseAgent class in the Katalyst AI framework.*
