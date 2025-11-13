# Agents Module Documentation

The agents module provides the core foundation for AI agent implementations, including base classes, specialized agents, and orchestration capabilities.

## Overview

The agents module is the heart of the AI package, providing:
- Abstract base agent class with common functionality
- Specialized agent implementations (Claude, Claude Max)
- Agent orchestration and delegation capabilities
- Tool registration and execution framework
- Message history and context management

## Files Overview

### [base-agent.ts](./base-agent.md)
Abstract base class for all AI agents with core functionality including message handling, tool execution, sub-agent management, and event emission.

### [claude-agent.ts](./claude-agent.md)
Claude-specific agent implementation with API integration and optional Claude Code execution capabilities.

### [claude-agent-max.ts](./claude-agent-max.md)
Enhanced Claude agent with advanced features like code execution, file system access, and extended tool capabilities.

### [orchestrator.ts](./orchestrator.md)
Agent orchestration system for managing multiple agents, task distribution, and workflow coordination.

### [templates.ts](./templates.md)
Agent configuration templates and factory functions for common agent types and use cases.

## Core Architecture

### Agent Lifecycle

1. **Initialization**: Agent creation with configuration and tool registration
2. **Processing**: Message handling and response generation
3. **Delegation**: Sub-agent spawning and task delegation
4. **Execution**: Tool invocation and result handling
5. **Termination**: Cleanup and resource deallocation

### Event System

All agents emit events for monitoring and debugging:

```typescript
// Core events
agent.on('message', (message) => { /* handle incoming message */ });
agent.on('response', (response) => { /* handle agent response */ });
agent.on('error', (error) => { /* handle errors */ });

// Sub-agent events
agent.on('subagent:spawned', (subAgent) => { /* handle sub-agent creation */ });
agent.on('subagent:message', (data) => { /* handle sub-agent messages */ });

// Tool events
agent.on('tool:registered', (tool) => { /* handle tool registration */ });
agent.on('tool:execute:start', (data) => { /* handle tool execution start */ });
agent.on('tool:execute:complete', (data) => { /* handle tool completion */ });

// Status events
agent.on('status:change', (data) => { /* handle status changes */ });
agent.on('terminated', () => { /* handle agent termination */ });
```

### Status Management

Agents maintain a status throughout their lifecycle:

```typescript
enum AgentStatus {
  IDLE = 'idle',           // Ready to process messages
  THINKING = 'thinking',   // Processing input
  EXECUTING = 'executing', // Running tools
  WAITING = 'waiting',     // Awaiting external input
  ERROR = 'error',         // Error state
  TERMINATED = 'terminated' // Shutdown
}
```

## Usage Patterns

### Basic Agent Usage

```typescript
import { ClaudeAgent } from '@katalyst/ai/agents';

const agent = new ClaudeAgent({
  name: 'Assistant',
  apiKey: 'your-api-key',
  model: 'claude-3-sonnet',
  temperature: 0.7,
  enableCodeExecution: true
});

// Simple message exchange
const response = await agent.send('Hello, how can you help me?');
console.log(response);
```

### Advanced Agent Configuration

```typescript
const advancedAgent = new ClaudeAgent({
  name: 'Advanced Assistant',
  apiKey: 'your-api-key',
  model: 'claude-3-opus',
  temperature: 0.5,
  maxTokens: 8000,
  systemPrompt: 'You are an advanced AI assistant with specialized capabilities.',
  tools: [
    {
      name: 'webSearch',
      description: 'Search the web for information',
      parameters: { query: 'string' },
      execute: async ({ query }) => {
        // Implementation
        return searchResults;
      }
    },
    {
      name: 'fileRead',
      description: 'Read file contents',
      parameters: { path: 'string' },
      execute: async ({ path }) => {
        // Implementation
        return fileContent;
      }
    }
  ],
  memory: true,
  capabilities: ['reasoning', 'code', 'analysis']
});
```

### Sub-Agent Orchestration

```typescript
// Create specialized sub-agents
const researcher = await agent.spawnSubAgent({
  name: 'Research Specialist',
  systemPrompt: 'You specialize in research and information gathering.',
  tools: [webSearchTool, databaseQueryTool]
});

const analyst = await agent.spawnSubAgent({
  name: 'Data Analyst', 
  systemPrompt: 'You specialize in data analysis and visualization.',
  tools: [chartTool, statisticsTool]
});

// Delegate tasks to specialized agents
const researchData = await agent.delegateToSubAgent(
  researcher.id,
  'Research the latest trends in AI technology'
);

const analysis = await agent.delegateToSubAgent(
  analyst.id,
  `Analyze this research data: ${researchData}`
);
```

### Tool Registration and Execution

```typescript
// Register custom tools
agent.registerTool({
  name: 'apiRequest',
  description: 'Make HTTP API requests',
  parameters: {
    url: 'string',
    method: 'string (GET|POST|PUT|DELETE)',
    headers: 'object',
    body: 'string'
  },
  execute: async ({ url, method, headers, body }) => {
    const response = await fetch(url, {
      method,
      headers: JSON.parse(headers),
      body
    });
    return response.json();
  }
});

// Execute tools with error handling
try {
  const result = await agent.executeTool('apiRequest', {
    url: 'https://api.example.com/data',
    method: 'GET',
    headers: '{"Authorization": "Bearer token"}'
  });
  console.log('API Result:', result);
} catch (error) {
  console.error('Tool execution failed:', error);
}
```

## Performance Considerations

### Memory Management
- Monitor message history growth for long-running agents
- Implement periodic cleanup using `clearHistory()` when appropriate
- Use context variables for efficient data access
- Consider database persistence for long-term memory

### Concurrent Processing
- Agents can handle multiple concurrent messages
- Use sub-agents for parallel task execution
- Implement proper synchronization for shared resources
- Monitor resource usage during high-load scenarios

### Tool Execution
- Design tools to be stateless when possible
- Implement timeout mechanisms for long-running operations
- Use connection pooling for external API calls
- Consider caching for frequently accessed data

## Security Considerations

### Access Control
- Validate tool parameters before execution
- Implement sandboxing for code execution tools
- Use principle of least privilege for tool permissions
- Monitor and log tool execution for audit trails

### Data Protection
- Encrypt sensitive data in agent memory
- Secure API key management
- Implement data retention policies
- Handle personally identifiable information (PII) appropriately

## Error Handling

### Common Error Types
- Configuration errors (invalid API keys, missing parameters)
- Network errors (API timeouts, connection failures)
- Tool execution errors (invalid parameters, runtime failures)
- Resource exhaustion errors (memory limits, rate limits)

### Error Recovery Strategies
```typescript
// Implement retry logic for network operations
agent.registerTool({
  name: 'resilientApiCall',
  execute: async (params) => {
    const maxRetries = 3;
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await makeApiCall(params);
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw lastError;
  }
});
```

## Integration Patterns

### With React Applications
```typescript
import { useEffect, useState } from 'react';
import { ClaudeAgent } from '@katalyst/ai/agents';

function useAgent(config) {
  const [agent, setAgent] = useState(null);
  const [response, setResponse] = useState('');
  
  useEffect(() => {
    const agentInstance = new ClaudeAgent(config);
    setAgent(agentInstance);
    
    return () => agentInstance.terminate();
  }, [config]);
  
  const sendMessage = async (message) => {
    if (agent) {
      const result = await agent.send(message);
      setResponse(result);
    }
  };
  
  return { response, sendMessage };
}
```

### With Express.js Backend
```typescript
import express from 'express';
import { ClaudeAgent } from '@katalyst/ai/agents';

const app = express();
const agent = new ClaudeAgent({
  name: 'API Assistant',
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await agent.send(message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Testing

### Unit Testing
```typescript
import { ClaudeAgent } from '@katalyst/ai/agents';

describe('ClaudeAgent', () => {
  let agent;
  
  beforeEach(() => {
    agent = new ClaudeAgent({
      name: 'Test Agent',
      apiKey: 'test-key'
    });
  });
  
  afterEach(() => {
    agent.terminate();
  });
  
  test('should process messages', async () => {
    const response = await agent.send('Hello');
    expect(response).toBeDefined();
  });
  
  test('should execute tools', async () => {
    agent.registerTool({
      name: 'echo',
      execute: async ({ text }) => text
    });
    
    const result = await agent.executeTool('echo', { text: 'test' });
    expect(result).toBe('test');
  });
});
```

### Integration Testing
```typescript
import { ClaudeAgent } from '@katalyst/ai/agents';

describe('Agent Integration', () => {
  test('should handle real API calls', async () => {
    const agent = new ClaudeAgent({
      name: 'Integration Test Agent',
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    const response = await agent.send('What is 2+2?');
    expect(response).toContain('4');
    
    agent.terminate();
  });
});
```

## Monitoring and Debugging

### Event Monitoring
```typescript
// Set up comprehensive monitoring
agent.on('message', (msg) => {
  console.log(`[${msg.timestamp}] User: ${msg.content}`);
});

agent.on('response', (msg) => {
  console.log(`[${msg.timestamp}] Agent: ${msg.content}`);
});

agent.on('tool:execute:start', (data) => {
  console.log(`Tool execution started: ${data.tool}`);
});

agent.on('tool:execute:error', (data) => {
  console.error(`Tool execution failed: ${data.tool}`, data.error);
});
```

### Performance Metrics
```typescript
// Track agent performance
const metrics = {
  messageCount: 0,
  totalResponseTime: 0,
  errorCount: 0
};

agent.on('response', () => {
  metrics.messageCount++;
});

agent.on('error', () => {
  metrics.errorCount++;
});

// Calculate average response time
const getAverageResponseTime = () => {
  return metrics.totalResponseTime / metrics.messageCount;
};
```

---

*This documentation provides comprehensive guidance for working with the agents module in the Katalyst AI package.*
