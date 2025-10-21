# Claude Agent

The `ClaudeAgent` class provides integration with Anthropic's Claude AI models and Claude Code for advanced AI capabilities including code execution, codebase analysis, and real-time communication.

## Overview

`ClaudeAgent` extends `BaseAgent` to provide:
- Claude API integration
- Claude Code execution capabilities
- WebSocket communication for real-time interaction
- Code analysis and execution tools
- Multi-modal processing support

## Usage Examples

### Basic Claude Agent

```typescript
import { ClaudeAgent, ClaudeConfig } from '@katalyst/ai';

const agent = new ClaudeAgent({
  name: 'Claude Assistant',
  type: 'claude',
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus-20240229',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: 'You are a helpful AI assistant.',
  enableCodeExecution: true
});

// Send a message
const response = await agent.send('Explain quantum computing');
console.log(response);
```

### Claude Code Integration

```typescript
const agent = new ClaudeAgent({
  name: 'Code Assistant',
  type: 'claude',
  enableCodeExecution: true,
  workingDirectory: './my-project',
  claudeCodePath: 'claude-code'
});

// Execute code using Claude Code
const codeResult = await agent.executeTool('execute_code', {
  code: 'print("Hello, World!")',
  language: 'python'
});

// Analyze a codebase
const analysis = await agent.executeTool('analyze_codebase', {
  path: './src',
  query: 'Find all API endpoints and their security issues'
});
```

### WebSocket Communication

```typescript
const agent = new ClaudeAgent({
  name: 'Real-time Claude',
  type: 'claude',
  enableCodeExecution: true
});

// Connect via WebSocket
await agent.connectWebSocket(8080);

// Listen to real-time events
agent.on('websocket:connected', () => {
  console.log('Connected to Claude Code');
});

agent.on('thought', (content) => {
  console.log('Claude is thinking:', content);
});

agent.on('action', (content) => {
  console.log('Claude is taking action:', content);
});

agent.on('result', (content) => {
  console.log('Claude produced result:', content);
});

// Send messages via WebSocket
agent.sendWebSocketMessage({
  type: 'prompt',
  content: 'Help me debug this issue'
});
```

### Spawn Claude Code for Complex Tasks

```typescript
const agent = new ClaudeAgent({
  name: 'Complex Task Handler',
  type: 'claude',
  enableCodeExecution: true
});

// Spawn a new Claude Code instance
const result = await agent.executeTool('spawn_claude_code', {
  prompt: 'Build a complete REST API with authentication',
  workingDirectory: './new-project',
  tools: ['execute', 'file-system', 'web-browser'],
  env: {
    NODE_ENV: 'development'
  },
  timeout: 60000 // 60 seconds
});
```

## API Reference

### Constructor

```typescript
constructor(config: ClaudeConfig)
```

**Parameters:**
- `config: ClaudeConfig` - Configuration object extending AgentConfig

### Configuration

#### ClaudeConfig

```typescript
interface ClaudeConfig extends AgentConfig {
  apiKey?: string;
  claudeCodePath?: string;
  enableCodeExecution?: boolean;
  workingDirectory?: string;
  allowedTools?: string[];
  maxRetries?: number;
}
```

#### ClaudeCodeConfig

```typescript
interface ClaudeCodeConfig {
  prompt: string;
  workingDirectory?: string;
  tools?: string[];
  env?: Record<string, string>;
  timeout?: number;
}
```

### Methods

#### Core Claude Methods

**process(input: string, context?: Partial<AgentContext>): Promise<string>**
Process input through Claude API with tool calling support.

**callClaudeAPI(messages: any[]): Promise<any>**
Internal method to call Claude API.

#### Claude Code Integration

**spawnClaudeCode(config: ClaudeCodeConfig): Promise<string>**
Spawn a Claude Code instance for complex tasks.

**executeClaudeCode(code: string, language: string): Promise<string>**
Execute code using Claude Code.

**analyzeCodebase(path: string, query: string): Promise<string>**
Analyze a codebase using Claude Code.

#### WebSocket Communication

**connectWebSocket(port?: number): Promise<void>**
Connect to Claude Code via WebSocket for real-time communication.

**sendWebSocketMessage(message: any): void**
Send a message via WebSocket connection.

**handleWebSocketMessage(message: any): void**
Handle incoming WebSocket messages.

#### Lifecycle

**terminate(): void**
Terminate the agent and clean up Claude Code processes and WebSocket connections.

## Built-in Tools

When `enableCodeExecution` is true, the agent automatically registers these tools:

### execute_code

Execute code snippets using Claude Code.

```typescript
await agent.executeTool('execute_code', {
  code: 'const x = 5; console.log(x * 2);',
  language: 'javascript'
});
```

### spawn_claude_code

Spawn a new Claude Code instance for complex tasks.

```typescript
await agent.executeTool('spawn_claude_code', {
  prompt: 'Create a React component with TypeScript',
  workingDirectory: './components',
  tools: ['execute', 'file-system'],
  timeout: 30000
});
```

### analyze_codebase

Analyze a codebase and answer queries about it.

```typescript
await agent.executeTool('analyze_codebase', {
  path: './src',
  query: 'Find all database queries and check for SQL injection vulnerabilities'
});
```

## WebSocket Message Types

The agent can handle various WebSocket message types:

### thought

Emitted when Claude is thinking or reasoning.

```typescript
agent.on('thought', (content) => {
  console.log('Thinking:', content);
});
```

### action

Emitted when Claude is taking an action.

```typescript
agent.on('action', (content) => {
  console.log('Action:', content);
});
```

### result

Emitted when Claude produces a result.

```typescript
agent.on('result', (content) => {
  console.log('Result:', content);
});
```

### error

Emitted when an error occurs.

```typescript
agent.on('error', (error) => {
  console.error('Claude error:', error);
});
```

## Integration Patterns

### Code Development Assistant

```typescript
class CodeDevelopmentAssistant extends ClaudeAgent {
  constructor(config: ClaudeConfig) {
    super({
      ...config,
      systemPrompt: `You are an expert software developer. 
      - Write clean, maintainable code
      - Follow best practices and design patterns
      - Include appropriate error handling
      - Add helpful comments`,
      enableCodeExecution: true
    });
    
    this.setupDevelopmentTools();
  }

  private setupDevelopmentTools() {
    this.registerTool({
      name: 'create_component',
      description: 'Create a new component',
      execute: async (params) => {
        const prompt = `Create a ${params.type} component called ${params.name} with these requirements: ${params.requirements}`;
        return this.spawnClaudeCode({
          prompt,
          workingDirectory: params.directory,
          tools: ['execute', 'file-system']
        });
      }
    });
  }

  async developFeature(featureDescription: string) {
    return this.send(`Develop a feature: ${featureDescription}`);
  }
}

// Usage
const devAssistant = new CodeDevelopmentAssistant({
  name: 'Dev Assistant',
  apiKey: process.env.ANTHROPIC_API_KEY,
  workingDirectory: './my-project'
});

const feature = await devAssistant.developFeature('User authentication system');
```

### Real-time Code Analysis

```typescript
class RealTimeAnalyzer extends ClaudeAgent {
  constructor(config: ClaudeConfig) {
    super({ ...config, enableCodeExecution: true });
    this.setupRealTimeAnalysis();
  }

  private async setupRealTimeAnalysis() {
    await this.connectWebSocket();
    
    this.on('thought', (thought) => {
      // Process Claude's thinking in real-time
      this.broadcastThought(thought);
    });

    this.on('action', (action) => {
      // Monitor Claude's actions
      this.logAction(action);
    });
  }

  async analyzeInRealTime(code: string) {
    this.sendWebSocketMessage({
      type: 'analyze',
      content: code,
      realtime: true
    });
  }

  private broadcastThought(thought: string) {
    // Send thought to connected clients
  }

  private logAction(action: any) {
    console.log('Claude action:', action);
  }
}
```

## Best Practices

1. **API Key Management**: Store API keys securely using environment variables.

2. **Code Execution Security**: Be cautious when enabling code execution. Validate inputs and use sandboxed environments.

3. **Timeout Management**: Set appropriate timeouts for Claude Code operations to prevent hanging.

4. **Resource Cleanup**: Always terminate the agent to clean up processes and connections.

5. **Error Handling**: Implement robust error handling for network issues and API failures.

6. **Working Directory**: Set appropriate working directories for file operations.

7. **Tool Limitations**: Be aware of Claude Code's limitations and validate tool parameters.

8. **WebSocket Management**: Properly handle WebSocket connections and reconnection logic.

## Error Handling

```typescript
class RobustClaudeAgent extends ClaudeAgent {
  constructor(config: ClaudeConfig) {
    super(config);
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.on('error', (error) => {
      console.error('Claude Agent Error:', error);
      
      if (error.message.includes('API rate limit')) {
        this.handleRateLimit();
      } else if (error.message.includes('Authentication')) {
        this.handleAuthError();
      }
    });
  }

  private handleRateLimit() {
    console.log('Rate limit reached. Implementing backoff...');
    setTimeout(() => {
      this.emit('rate-limit:reset');
    }, 60000);
  }

  private handleAuthError() {
    console.error('Authentication failed. Check API key.');
  }

  async processWithRetry(input: string, maxRetries = 3): Promise<string> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.process(input);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }
}
```

## Environment Setup

### Required Environment Variables

```bash
# Claude API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Claude Code Path
CLAUDE_CODE_PATH=/path/to/claude-code

# Optional: Default Working Directory
CLAUDE_WORKING_DIR=./projects
```

### Installing Claude Code

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Or download from Anthropic website
# https://claude.ai/code
```

## Testing

```typescript
import { ClaudeAgent, ClaudeConfig } from '@katalyst/ai';

describe('ClaudeAgent', () => {
  let agent: ClaudeAgent;

  beforeEach(() => {
    agent = new ClaudeAgent({
      name: 'Test Claude',
      type: 'claude',
      apiKey: 'test-key',
      enableCodeExecution: false // Disable for tests
    });
  });

  afterEach(() => {
    agent.terminate();
  });

  test('should process messages', async () => {
    // Mock the API call
    jest.spyOn(agent as any, 'callClaudeAPI')
      .mockResolvedValue({ content: 'Test response' });

    const response = await agent.send('Hello');
    expect(response).toBe('Test response');
  });

  test('should handle tool registration', () => {
    agent.registerTool({
      name: 'test_tool',
      description: 'Test tool',
      execute: async () => 'test result'
    });

    expect(agent['tools'].has('test_tool')).toBe(true);
  });

  test('should manage WebSocket connections', async () => {
    const mockWs = {
      on: jest.fn(),
      send: jest.fn(),
      readyState: 1 // OPEN
    };
    
    global.WebSocket = jest.fn().mockImplementation(() => mockWs);
    
    await agent.connectWebSocket(8080);
    expect(mockWs.on).toHaveBeenCalledWith('open', expect.any(Function));
  });
});
```

## Performance Optimization

1. **Caching**: Cache responses for repeated queries.

2. **Batching**: Batch multiple operations when possible.

3. **Connection Pooling**: Reuse WebSocket connections.

4. **Async Operations**: Use async/await for non-blocking operations.

5. **Memory Management**: Clear message history periodically.

6. **Rate Limiting**: Implement client-side rate limiting.

```typescript
class OptimizedClaudeAgent extends ClaudeAgent {
  private cache = new Map<string, any>();
  private requestQueue = new Array<() => Promise<any>>();
  private isProcessing = false;

  async processWithCache(input: string): Promise<string> {
    const cacheKey = this.generateCacheKey(input);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const result = await this.process(input);
    this.cache.set(cacheKey, result);
    
    return result;
  }

  private generateCacheKey(input: string): string {
    return Buffer.from(input).toString('base64');
  }
}
```
