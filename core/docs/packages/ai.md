# @katalyst/ai

Production-ready AI agents with Claude Code Max integration, thread lifecycle management, and WebSocket monitoring for the Katalyst framework.

## Overview

The `@katalyst/ai` package provides a comprehensive AI integration layer with Claude Code (Anthropic), OpenAI, and LangChain support. It features sophisticated agent management, thread lifecycle control, and real-time WebSocket monitoring capabilities.

### Key Features

- 🤖 **Claude Code Integration** - Direct integration with Anthropic's Claude Code Max
- 🧵 **Thread Management** - Full thread lifecycle control with state persistence
- 📡 **WebSocket Monitoring** - Real-time monitoring of agent activities
- 🔐 **OAuth Authentication** - Google OAuth flow for secure authentication
- 🎯 **Type-Safe APIs** - Full TypeScript and Zod schema validation
- 🔄 **Multi-Agent Support** - Coordinate multiple AI agents simultaneously
- 💾 **State Persistence** - Thread state storage with keytar integration
- 🎨 **React Integration** - Pre-built React hooks and components

## Installation

The package is included in the Katalyst monorepo and can be imported directly:

```bash
# Already available in the monorepo
import { ClaudeAgent } from '@katalyst/ai';
```

### Dependencies

The package requires:
- React 19.0.0+
- Node.js 20+
- TypeScript 5.3+

## Quick Start

### Basic Claude Agent

```typescript
import { ClaudeAgent, AgentConfig } from '@katalyst/ai';

// Initialize a Claude agent
const agent = new ClaudeAgent({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus-20240229',
  maxTokens: 4096,
  temperature: 0.7
});

// Send a message
const response = await agent.chat('Help me build a React component');
console.log(response.content);
```

### Using React Hooks

```tsx
import { useClaudeAgent, useAgentThread } from '@katalyst/ai';

function MyComponent() {
  const agent = useClaudeAgent({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
  
  const { messages, sendMessage, isLoading } = useAgentThread(agent);
  
  const handleSend = async () => {
    await sendMessage('What is React 19?');
  };
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={handleSend} disabled={isLoading}>
        Send
      </button>
    </div>
  );
}
```

## Claude Code Integration

### Agent Configuration

```typescript
import { ClaudeAgent, AgentConfig } from '@katalyst/ai/agents';

const config: AgentConfig = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus-20240229',
  maxTokens: 4096,
  temperature: 0.7,
  systemPrompt: 'You are a helpful coding assistant',
  tools: [
    {
      name: 'search_code',
      description: 'Search through code repositories',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' }
        }
      }
    }
  ]
};

const agent = new ClaudeAgent(config);
```

### Streaming Responses

```typescript
const stream = await agent.streamChat('Explain async/await in JavaScript');

for await (const chunk of stream) {
  console.log(chunk.delta);
  // Process streaming chunks
}
```

### Tool Usage

```typescript
const agent = new ClaudeAgent({
  apiKey: process.env.ANTHROPIC_API_KEY,
  tools: [searchCodeTool, createFileTool, runCommandTool]
});

const response = await agent.chat('Create a new React component');

// Agent will automatically use tools as needed
if (response.toolCalls) {
  for (const call of response.toolCalls) {
    console.log(`Tool used: ${call.name}`);
    console.log(`Result: ${call.result}`);
  }
}
```

## Agent Management

### Multi-Agent Coordination

```typescript
import { AgentManager } from '@katalyst/ai/agents';

const manager = new AgentManager();

// Register multiple agents
const codeAgent = manager.registerAgent('code', new ClaudeAgent({
  systemPrompt: 'You are a code generation expert'
}));

const reviewAgent = manager.registerAgent('review', new ClaudeAgent({
  systemPrompt: 'You are a code review expert'
}));

// Coordinate agents
const code = await codeAgent.chat('Create a login component');
const review = await reviewAgent.chat(`Review this code: ${code}`);
```

### Agent State Management

```typescript
import { useAgentState } from '@katalyst/ai/agents';

function AgentDashboard() {
  const { agents, activeAgent, switchAgent } = useAgentState();
  
  return (
    <div>
      {agents.map(agent => (
        <button 
          key={agent.id}
          onClick={() => switchAgent(agent.id)}
          disabled={agent.id === activeAgent}
        >
          {agent.name}
        </button>
      ))}
    </div>
  );
}
```

## Thread Lifecycle

### Thread Management

```typescript
import { ThreadManager } from '@katalyst/ai/threads';

const threadManager = new ThreadManager();

// Create a new thread
const thread = await threadManager.createThread({
  agentId: 'code-agent',
  metadata: { project: 'my-app' }
});

// Send messages
await thread.sendMessage('Hello!');
await thread.sendMessage('Create a component');

// Get thread history
const history = await thread.getHistory();

// Archive thread
await thread.archive();

// Delete thread
await thread.delete();
```

### Thread State Persistence

```typescript
import { ThreadStateManager } from '@katalyst/ai/threads';

const stateManager = new ThreadStateManager();

// Save thread state
await stateManager.saveState(thread.id, {
  messages: thread.messages,
  metadata: thread.metadata,
  lastActive: Date.now()
});

// Restore thread state
const savedState = await stateManager.loadState(thread.id);
const restoredThread = await threadManager.restoreThread(savedState);
```

### React Thread Hooks

```tsx
import { useThread, useThreadHistory } from '@katalyst/ai/threads';

function ChatInterface() {
  const thread = useThread('thread-123');
  const history = useThreadHistory(thread);
  
  const handleSend = async (message: string) => {
    await thread.sendMessage(message);
  };
  
  return (
    <div>
      <ThreadHistory messages={history} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}
```

## WebSocket Monitoring

### Real-time Agent Monitoring

```typescript
import { AgentMonitor } from '@katalyst/ai/monitoring';

const monitor = new AgentMonitor({
  url: 'ws://localhost:3000/agents',
  reconnect: true
});

// Monitor agent activity
monitor.on('message', (data) => {
  console.log('Agent message:', data);
});

monitor.on('tool_call', (data) => {
  console.log('Tool called:', data.tool, data.args);
});

monitor.on('error', (error) => {
  console.error('Agent error:', error);
});

// Start monitoring
await monitor.connect();
```

### React Monitoring Components

```tsx
import { useAgentMonitor } from '@katalyst/ai/monitoring';

function AgentMonitorDashboard() {
  const { 
    status, 
    messages, 
    metrics, 
    isConnected 
  } = useAgentMonitor('ws://localhost:3000/agents');
  
  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <div>Messages: {messages.length}</div>
      <div>Avg Response Time: {metrics.avgResponseTime}ms</div>
      
      <MessageLog messages={messages} />
    </div>
  );
}
```

## Authentication

### OAuth Integration

```typescript
import { GoogleAuthProvider } from '@katalyst/ai/auth';

const auth = new GoogleAuthProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/callback'
});

// Start OAuth flow
const authUrl = await auth.getAuthorizationUrl();
console.log('Visit:', authUrl);

// Handle callback
const tokens = await auth.handleCallback(callbackCode);

// Use tokens with agent
const agent = new ClaudeAgent({
  apiKey: tokens.accessToken
});
```

### Secure Token Storage

```typescript
import { TokenManager } from '@katalyst/ai/auth';

const tokenManager = new TokenManager();

// Store token securely (uses keytar)
await tokenManager.storeToken('claude-api-key', 'sk-...');

// Retrieve token
const apiKey = await tokenManager.getToken('claude-api-key');

// Delete token
await tokenManager.deleteToken('claude-api-key');
```

## API Reference

### ClaudeAgent Class

```typescript
class ClaudeAgent {
  constructor(config: AgentConfig);
  
  // Send a message and get response
  chat(message: string, options?: ChatOptions): Promise<AgentResponse>;
  
  // Stream response
  streamChat(message: string): AsyncGenerator<StreamChunk>;
  
  // Use tools
  useTool(name: string, args: Record<string, any>): Promise<ToolResult>;
  
  // Get agent state
  getState(): AgentState;
  
  // Reset agent
  reset(): void;
}
```

### ThreadManager Class

```typescript
class ThreadManager {
  // Create new thread
  createThread(config: ThreadConfig): Promise<Thread>;
  
  // Get thread by ID
  getThread(id: string): Promise<Thread | null>;
  
  // List threads
  listThreads(filter?: ThreadFilter): Promise<Thread[]>;
  
  // Delete thread
  deleteThread(id: string): Promise<void>;
  
  // Restore thread from state
  restoreThread(state: ThreadState): Promise<Thread>;
}
```

### AgentMonitor Class

```typescript
class AgentMonitor extends EventEmitter {
  constructor(config: MonitorConfig);
  
  // Connect to WebSocket
  connect(): Promise<void>;
  
  // Disconnect
  disconnect(): void;
  
  // Subscribe to events
  on(event: string, handler: Function): void;
  
  // Get metrics
  getMetrics(): MonitorMetrics;
}
```

## Examples

### Complete AI Chat Application

```tsx
import { 
  ClaudeAgent, 
  ThreadManager, 
  useThread 
} from '@katalyst/ai';

function AIChatApp() {
  const [agent] = useState(() => new ClaudeAgent({
    apiKey: process.env.ANTHROPIC_API_KEY
  }));
  
  const threadManager = new ThreadManager();
  const thread = useThread(threadManager);
  
  const handleSend = async (message: string) => {
    await thread.sendMessage(message);
    const response = await agent.chat(message);
    await thread.addMessage({
      role: 'assistant',
      content: response.content
    });
  };
  
  return (
    <div className="chat-container">
      <ThreadHistory thread={thread} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}
```

### Multi-Agent Workflow

```typescript
import { AgentManager, ClaudeAgent } from '@katalyst/ai';

async function codeGenerationWorkflow() {
  const manager = new AgentManager();
  
  // Register specialized agents
  const architect = manager.registerAgent('architect', new ClaudeAgent({
    systemPrompt: 'You design software architecture'
  }));
  
  const coder = manager.registerAgent('coder', new ClaudeAgent({
    systemPrompt: 'You write production code'
  }));
  
  const reviewer = manager.registerAgent('reviewer', new ClaudeAgent({
    systemPrompt: 'You review code for quality'
  }));
  
  // Execute workflow
  const architecture = await architect.chat('Design a user authentication system');
  const code = await coder.chat(`Implement this: ${architecture}`);
  const review = await reviewer.chat(`Review this code: ${code}`);
  
  return { architecture, code, review };
}
```

### Monitoring Dashboard

```tsx
import { useAgentMonitor, AgentMonitor } from '@katalyst/ai/monitoring';

function MonitoringDashboard() {
  const monitor = useAgentMonitor('ws://localhost:3000/agents');
  
  return (
    <div className="dashboard">
      <MetricsPanel metrics={monitor.metrics} />
      <ActivityLog messages={monitor.messages} />
      <ErrorPanel errors={monitor.errors} />
      <ConnectionStatus connected={monitor.isConnected} />
    </div>
  );
}
```

## Integration with Other Packages

### With @katalyst/multithreading

```typescript
import { threadController } from '@katalyst/multithreading';
import { ClaudeAgent } from '@katalyst/ai';

// Process multiple AI requests in parallel
await threadController.initialize({ rayonThreads: 4 });
const pool = threadController.createThreadPool('ai-processing');

const requests = [
  'Explain React hooks',
  'What is TypeScript?',
  'How does async/await work?'
];

const responses = await pool.map(requests, async (request) => {
  const agent = new ClaudeAgent({ apiKey: process.env.ANTHROPIC_API_KEY });
  return await agent.chat(request);
});
```

### With @katalyst/api

```typescript
import { createTRPCRouter } from '@katalyst/api';
import { ClaudeAgent } from '@katalyst/ai';

export const aiRouter = createTRPCRouter({
  chat: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const agent = new ClaudeAgent({
        apiKey: ctx.user.apiKey
      });
      return await agent.chat(input.message);
    })
});
```

## Troubleshooting

### Common Issues

**Agent not responding:**
```typescript
// Check API key
console.log('API Key set:', !!process.env.ANTHROPIC_API_KEY);

// Increase timeout
const agent = new ClaudeAgent({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 60000 // 60 seconds
});
```

**WebSocket connection fails:**
```typescript
// Enable reconnection
const monitor = new AgentMonitor({
  url: 'ws://localhost:3000/agents',
  reconnect: true,
  reconnectDelay: 5000,
  maxReconnectAttempts: 5
});
```

**Thread state not persisting:**
```typescript
// Manually save state
const stateManager = new ThreadStateManager();
await stateManager.saveState(thread.id, thread.state);
```

## Best Practices

1. **Always handle errors** - AI APIs can fail, implement proper error handling
2. **Use streaming** - For better UX, stream responses instead of waiting
3. **Monitor usage** - Track token usage and costs
4. **Cache responses** - Cache common queries to reduce API calls
5. **Implement rate limiting** - Respect API rate limits
6. **Secure API keys** - Never expose keys in client-side code
7. **Test with mocks** - Use mock agents for testing

## Related Documentation

- [Multithreading Package](./multithreading.md) - Parallel AI processing
- [API Package](./api.md) - Creating AI APIs
- [Core Package](./core.md) - React integration patterns

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
