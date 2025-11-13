# Claude Agent Max

The `ClaudeAgentMax` class provides integration with Claude Code Max plan, offering advanced AI capabilities with Google Sign-In authentication and unlimited features.

## Overview

`ClaudeAgentMax` extends `BaseAgent` to provide:
- Google Sign-In authentication for Claude Code Max
- Unlimited context window
- Priority processing
- Persistent memory across sessions
- Advanced tools access
- Multi-modal support
- Real-time collaboration
- Multiple concurrent instances

## Usage Examples

### Basic Max Agent

```typescript
import { ClaudeAgentMax, ClaudeMaxConfig } from '@katalyst/ai';

const agent = new ClaudeAgentMax({
  name: 'Max Agent',
  type: 'claude',
  useAuthentication: true,
  claudeCodeCommand: 'claude-code',
  workingDirectory: './my-project'
});

// Authenticate with Google Sign-In
await agent.authenticate();

// Use the agent
const response = await agent.send('Help me build a complex application');
console.log(response);
```

### Authentication

```typescript
const agent = new ClaudeAgentMax({
  name: 'Authenticated Agent',
  type: 'claude',
  useAuthentication: true
});

// Listen to authentication events
agent.on('auth:start', () => {
  console.log('Starting authentication...');
});

agent.on('auth:complete', (userInfo) => {
  console.log('Authenticated as:', userInfo.email);
});

agent.on('auth:error', (error) => {
  console.error('Authentication failed:', error);
});

// Authenticate
await agent.authenticate();

// Check authentication status
if (agent.isAuthenticated()) {
  console.log('Agent is authenticated');
}
```

### Using Max Features

```typescript
const agent = new ClaudeAgentMax({
  name: 'Feature-Rich Agent',
  useAuthentication: true
});

await agent.authenticate();

// Unlimited context window
const longResponse = await agent.useMaxFeature('unlimited-context', {
  prompt: 'Analyze this entire codebase and provide comprehensive recommendations',
  context: { maxTokens: -1 }
});

// Priority queue processing
const priorityResult = await agent.useMaxFeature('priority-queue', {
  prompt: 'Urgent: Fix critical bug in production',
  context: { priority: 'high', queue: 'priority' }
});

// Persistent memory
await agent.useMaxFeature('persistent-memory', {
  save: true,
  sessionId: 'project-session-1',
  data: {
    projectContext: 'Building a SaaS platform',
    userPreferences: { language: 'typescript', framework: 'react' }
  }
});

// Advanced tools
const advancedResult = await agent.useMaxFeature('advanced-tools', {
  prompt: 'Build a complete microservices architecture',
  context: {
    tools: ['code-interpreter', 'web-browser', 'database', 'api-client'],
    enableAdvancedTools: true
  }
});
```

### Multi-modal Processing

```typescript
// Process with multiple modalities
const multiModalResult = await agent.useMaxFeature('multi-modal', {
  prompt: 'Analyze this image and generate corresponding code',
  attachments: [
    { type: 'image', data: 'base64-image-data' },
    { type: 'code', data: 'existing-code' },
    { type: 'data', data: 'json-data' }
  ],
  context: {
    modalities: ['text', 'image', 'code', 'data']
  }
});
```

### Real-time Collaboration

```typescript
// Start a collaboration session
const collaboration = await agent.useMaxFeature('real-time-collaboration', {
  sessionId: 'team-session-123',
  role: 'collaborator'
});

// Send messages to collaboration
collaboration.ws.send(JSON.stringify({
  type: 'message',
  content: 'Let\'s work on this together'
}));

// Listen to collaboration events
collaboration.ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('Collaboration message:', message);
});
```

### Multiple Concurrent Instances

```typescript
const mainAgent = new ClaudeAgentMax({
  name: 'Main Agent',
  useAuthentication: true
});

await mainAgent.authenticate();

// Spawn multiple instances for parallel work
const instances = await mainAgent.spawnMultipleInstances(3);

// Use instances for different tasks
const [coder, tester, reviewer] = instances;

const code = await coder.send('Implement authentication system');
const tests = await tester.send('Write tests for the authentication system');
const review = await reviewer.send(`Review this code:\n${code}`);
```

## API Reference

### Constructor

```typescript
constructor(config: ClaudeMaxConfig)
```

### Configuration

#### ClaudeMaxConfig

```typescript
interface ClaudeMaxConfig extends AgentConfig {
  useAuthentication?: boolean;
  claudeCodeCommand?: string;
  workingDirectory?: string;
  allowedTools?: string[];
  maxRetries?: number;
}
```

### Methods

#### Authentication

**authenticate(): Promise<void>**
Authenticate with Claude Code Max using Google Sign-In.

**isAuthenticated(): boolean**
Check if the agent is authenticated.

**signOut(): Promise<void>**
Sign out from Claude Code Max.

**getUsageStats(): Promise<any>**
Get usage statistics (unlimited for Max plan).

#### Max Features

**useMaxFeature(feature: string, params: any): Promise<any>**
Use a specific Max plan feature.

Available features:
- `unlimited-context` - Unlimited context window
- `priority-queue` - Priority processing
- `persistent-memory` - Cross-session memory
- `advanced-tools` - Advanced tool access
- `multi-modal` - Multi-modal processing
- `real-time-collaboration` - Real-time collaboration

#### Instance Management

**spawnMultipleInstances(count: number): Promise<ClaudeAgentMax[]>**
Spawn multiple Claude Code Max instances.

#### Processing

**process(input: string, context?: Partial<AgentContext>): Promise<string>**
Process input using Max plan features.

#### Lifecycle

**terminate(): void**
Terminate the agent and clean up resources.

## Authentication Flow

The authentication process involves:

1. **Google OAuth**: Opens browser for Google Sign-In
2. **Token Exchange**: Exchanges authorization code for tokens
3. **Token Storage**: Securely caches tokens for future use
4. **Auto-refresh**: Automatically refreshes expired tokens

### Authentication Events

```typescript
agent.on('auth:start', () => {
  console.log('Authentication started');
});

agent.on('auth:complete', (userInfo) => {
  console.log('Authenticated:', userInfo);
});

agent.on('already:authenticated', () => {
  console.log('Already authenticated');
});

agent.on('auth:error', (error) => {
  console.error('Authentication failed:', error);
});

agent.on('signed:out', () => {
  console.log('Signed out successfully');
});
```

## Max Features in Detail

### Unlimited Context

Process extremely large inputs without context limits:

```typescript
const result = await agent.useMaxFeature('unlimited-context', {
  prompt: 'Analyze this entire repository',
  context: {
    maxTokens: -1, // Unlimited
    files: ['src/**/*.ts', 'docs/**/*.md']
  }
});
```

### Priority Queue

Get priority processing for urgent tasks:

```typescript
const urgentResult = await agent.useMaxFeature('priority-queue', {
  prompt: 'Critical security vulnerability detected',
  context: {
    priority: 'critical',
    queue: 'emergency',
    sla: 5000 // 5 second SLA
  }
});
```

### Persistent Memory

Maintain context across sessions:

```typescript
// Save memory
await agent.useMaxFeature('persistent-memory', {
  save: true,
  sessionId: 'project-alpha',
  data: {
    architecture: 'microservices',
    database: 'postgresql',
    deployment: 'kubernetes'
  }
});

// Load memory
const memory = await agent.useMaxFeature('persistent-memory', {
  save: false,
  sessionId: 'project-alpha'
});
```

### Advanced Tools

Access advanced development tools:

```typescript
const advancedResult = await agent.useMaxFeature('advanced-tools', {
  prompt: 'Build a complete CI/CD pipeline',
  context: {
    tools: [
      'code-interpreter',
      'web-browser',
      'file-system',
      'database',
      'api-client',
      'terminal',
      'debugger',
      'profiler'
    ],
    enableAdvancedTools: true
  }
});
```

### Real-time Collaboration

Collaborate with team members in real-time:

```typescript
const session = await agent.useMaxFeature('real-time-collaboration', {
  sessionId: 'team-workspace-123',
  role: 'developer'
});

// Listen to events
session.ws.on('message', (data) => {
  const event = JSON.parse(data.toString());
  
  switch (event.type) {
    case 'user:joined':
      console.log(`${event.user} joined the session`);
      break;
    case 'message':
      console.log(`${event.user}: ${event.content}`);
      break;
    case 'code:change':
      console.log('Code updated:', event.diff);
      break;
  }
});
```

## Integration Patterns

### Enterprise Development Assistant

```typescript
class EnterpriseAssistant extends ClaudeAgentMax {
  constructor(config: ClaudeMaxConfig) {
    super({
      ...config,
      useAuthentication: true,
      workingDirectory: './enterprise-app'
    });
    
    this.setupEnterpriseFeatures();
  }

  private async setupEnterpriseFeatures() {
    await this.authenticate();
    
    // Enable persistent memory for project context
    await this.useMaxFeature('persistent-memory', {
      save: true,
      sessionId: 'enterprise-context',
      data: {
        standards: this.loadEnterpriseStandards(),
        policies: this.loadSecurityPolicies(),
        architecture: this.loadArchitectureDocs()
      }
    });
  }

  async developFeature(requirements: string) {
    // Use unlimited context for complex requirements
    return this.useMaxFeature('unlimited-context', {
      prompt: `Develop enterprise feature: ${requirements}`,
      context: {
        maxTokens: -1,
        standards: 'enterprise-grade',
        compliance: ['SOC2', 'GDPR', 'HIPAA']
      }
    });
  }

  async securityReview(code: string) {
    // Priority processing for security
    return this.useMaxFeature('priority-queue', {
      prompt: `Security review for code: ${code}`,
      context: {
        priority: 'high',
        securityLevel: 'enterprise',
        compliance: true
      }
    });
  }
}
```

### Multi-Agent Team Collaboration

```typescript
class AITeam {
  private orchestrator: ClaudeAgentMax;
  private specialists: Map<string, ClaudeAgentMax> = new Map();

  constructor() {
    this.orchestrator = new ClaudeAgentMax({
      name: 'Team Lead',
      useAuthentication: true
    });
  }

  async initialize() {
    await this.orchestrator.authenticate();
    
    // Create specialist agents
    const roles = ['architect', 'developer', 'tester', 'security'];
    
    for (const role of roles) {
      const specialist = await this.createSpecialist(role);
      this.specialists.set(role, specialist);
    }
  }

  private async createSpecialist(role: string): Promise<ClaudeAgentMax> {
    const agent = new ClaudeAgentMax({
      name: `${role}-specialist`,
      useAuthentication: true
    });
    
    // Share authentication
    agent.authToken = this.orchestrator.authToken;
    agent.isAuthenticated = true;
    
    await agent.initializeClaudeCode();
    return agent;
  }

  async collaborateOnTask(task: string) {
    const results = new Map();
    
    // Start collaboration session
    const session = await this.orchestrator.useMaxFeature(
      'real-time-collaboration',
      { sessionId: `task-${Date.now()}`, role: 'lead' }
    );
    
    // Work with specialists
    for (const [role, specialist] of this.specialists) {
      const result = await specialist.send(`${role} perspective on: ${task}`);
      results.set(role, result);
      
      // Share with team
      session.ws.send(JSON.stringify({
        type: 'update',
        from: role,
        content: result
      }));
    }
    
    return results;
  }
}
```

## Best Practices

1. **Authentication Management**: Store authentication securely and handle token refresh automatically.

2. **Resource Optimization**: Use multiple instances for parallel processing when needed.

3. **Memory Management**: Leverage persistent memory for maintaining long-term context.

4. **Priority Usage**: Use priority queue for time-sensitive tasks.

5. **Collaboration**: Set up real-time collaboration for team projects.

6. **Feature Selection**: Choose appropriate Max features based on task requirements.

7. **Error Handling**: Implement robust error handling for authentication failures.

8. **Session Management**: Properly manage session IDs for persistent memory and collaboration.

## Error Handling

```typescript
class RobustMaxAgent extends ClaudeAgentMax {
  constructor(config: ClaudeMaxConfig) {
    super(config);
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.on('auth:error', async (error) => {
      console.error('Authentication error:', error);
      
      if (error.message.includes('token expired')) {
        try {
          await this.authenticate();
        } catch (retryError) {
          console.error('Retry authentication failed:', retryError);
        }
      }
    });

    this.on('error', (error) => {
      if (error.message.includes('rate limit')) {
        // Max plan shouldn't have rate limits, but handle anyway
        console.warn('Unexpected rate limit on Max plan');
      }
    });
  }

  async executeWithRetry(feature: string, params: any, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.useMaxFeature(feature, params);
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

## Performance Optimization

1. **Instance Pooling**: Maintain a pool of authenticated instances.

2. **Connection Reuse**: Reuse WebSocket connections for collaboration.

3. **Memory Caching**: Cache frequently accessed persistent memory.

4. **Batch Processing**: Batch operations when using Max features.

5. **Lazy Loading**: Load specialists only when needed.

```typescript
class OptimizedMaxAgent extends ClaudeAgentMax {
  private instancePool: ClaudeAgentMax[] = [];
  private memoryCache = new Map();

  async getOptimizedInstance(): Promise<ClaudeAgentMax> {
    if (this.instancePool.length > 0) {
      return this.instancePool.pop()!;
    }
    
    const instance = new ClaudeAgentMax({
      name: 'Pooled Instance',
      useAuthentication: true
    });
    
    instance.authToken = this.authToken;
    instance.isAuthenticated = true;
    await instance.initializeClaudeCode();
    
    return instance;
  }

  returnInstance(instance: ClaudeAgentMax) {
    if (this.instancePool.length < 5) {
      this.instancePool.push(instance);
    } else {
      instance.terminate();
    }
  }
}
```

## Testing

```typescript
import { ClaudeAgentMax, ClaudeMaxConfig } from '@katalyst/ai';

describe('ClaudeAgentMax', () => {
  let agent: ClaudeAgentMax;

  beforeEach(() => {
    agent = new ClaudeAgentMax({
      name: 'Test Max Agent',
      type: 'claude',
      useAuthentication: false // Disable for tests
    });
  });

  afterEach(() => {
    agent.terminate();
  });

  test('should handle authentication flow', async () => {
    const mockAuth = {
      authenticate: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        userEmail: 'test@example.com'
      })
    };
    
    agent['auth'] = mockAuth;
    await agent.authenticate();
    
    expect(agent.isAuthenticated()).toBe(true);
  });

  test('should spawn multiple instances', async () => {
    agent.authToken = { accessToken: 'test-token' };
    agent.isAuthenticated = true;
    
    const instances = await agent.spawnMultipleInstances(3);
    expect(instances).toHaveLength(3);
  });

  test('should use Max features', async () => {
    agent.authToken = { accessToken: 'test-token' };
    agent.isAuthenticated = true;
    
    const mockExecute = jest.spyOn(agent as any, 'executeClaudeCodeMax')
      .mockResolvedValue('Max feature result');
    
    const result = await agent.useMaxFeature('unlimited-context', {
      prompt: 'Test prompt'
    });
    
    expect(result).toBe('Max feature result');
  });
});
```
