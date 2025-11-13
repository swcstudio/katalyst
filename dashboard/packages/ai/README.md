# Katalyst AI Package

## Overview

The Katalyst AI package provides a comprehensive framework for building AI-powered applications with sophisticated agent orchestration, multi-threaded processing, and seamless integration with Claude AI models. This package serves as the foundation for AI-driven development within the Katalyst ecosystem.

## Features

- **Multi-Agent Architecture**: Create and orchestrate multiple specialized AI agents
- **Claude Integration**: Deep integration with Anthropic's Claude models (Claude 3 Sonnet, Haiku, and Opus)
- **Thread Management**: Advanced conversation thread pooling and management
- **Authentication**: Secure Claude API authentication with token management
- **Template System**: Reusable prompt templates for consistent agent behavior
- **Performance Optimization**: Intelligent resource management and caching
- **Type-Safe**: Full TypeScript support with comprehensive type definitions

## Quick Start

### Installation

```bash
npm install @katalyst/ai
# or
yarn add @katalyst/ai
# or
pnpm add @katalyst/ai
```

### Basic Usage

```typescript
import { AIManager, ClaudeAgent } from '@katalyst/ai';

// Initialize the AI Manager
const aiManager = new AIManager({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-sonnet'
});

// Create a simple agent
const agent = new ClaudeAgent({
  name: 'assistant',
  model: 'claude-3-sonnet',
  systemPrompt: 'You are a helpful assistant.'
});

// Process a message
const response = await agent.processMessage(
  'Hello, can you help me understand quantum computing?'
);

console.log(response);
```

### Advanced Agent Orchestration

```typescript
import { 
  AIManager, 
  ClaudeAgent, 
  ClaudeAgentMax, 
  AgentOrchestrator,
  ThreadManager 
} from '@katalyst/ai';

// Initialize AI Manager with configuration
const aiManager = new AIManager({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-sonnet',
  maxTokens: 4000,
  temperature: 0.7,
  timeout: 30000
});

// Create specialized agents
const researcher = new ClaudeAgent({
  name: 'researcher',
  model: 'claude-3-sonnet',
  systemPrompt: 'You are a research assistant. Provide detailed, accurate information.',
  tools: ['web-search', 'document-analysis']
});

const writer = new ClaudeAgent({
  name: 'writer',
  model: 'claude-3-sonnet',
  systemPrompt: 'You are a content writer. Create engaging, well-structured content.',
  tools: ['text-editor', 'seo-analyzer']
});

const reviewer = new ClaudeAgentMax({
  name: 'reviewer',
  model: 'claude-3-opus',
  systemPrompt: 'You are a content reviewer. Provide constructive feedback and suggestions.',
  maxTokens: 8000
});

// Set up orchestrator for complex workflows
const orchestrator = new AgentOrchestrator({
  agents: [researcher, writer, reviewer],
  workflow: 'sequential', // 'parallel', 'pipeline', or 'custom'
  maxConcurrency: 3
});

// Execute a complex task
const result = await orchestrator.executeTask({
  type: 'content-creation',
  input: {
    topic: 'The Future of Artificial Intelligence',
    requirements: {
      wordCount: 2000,
      style: 'technical-but-accessible',
      includeSources: true
    }
  },
  workflow: [
    { agent: 'researcher', task: 'research-topic' },
    { agent: 'writer', task: 'create-content' },
    { agent: 'reviewer', task: 'review-and-refine' }
  ]
});
```

## Architecture

### Core Components

#### AIManager
Central management system for all AI operations:
- Configuration management
- Resource allocation
- Performance monitoring
- Error handling and retry logic

#### Agent System
- **BaseAgent**: Foundation class for all agents
- **ClaudeAgent**: Standard Claude integration
- **ClaudeAgentMax**: High-performance Claude agent with extended capabilities
- **AgentOrchestrator**: Manages multi-agent workflows

#### Thread Management
- **ThreadManager**: Manages conversation threads and context
- **ThreadPool**: Efficient thread pooling and resource management
- **ThreadFactory**: Creates and configures thread instances

#### Authentication
- **ClaudeAuth**: Secure API authentication with token management
- **Rate Limiting**: Built-in rate limiting and quota management
- **Error Recovery**: Automatic retry and fallback mechanisms

### Package Structure

```
ai/
├── src/
│   ├── agents/           # Agent implementations
│   │   ├── base-agent.ts
│   │   ├── claude-agent.ts
│   │   ├── claude-agent-max.ts
│   │   ├── orchestrator.ts
│   │   └── templates.ts
│   ├── auth/             # Authentication and security
│   │   └── claude-auth.ts
│   ├── claude/           # Claude API integration
│   │   └── chat.ts
│   ├── threads/          # Thread management
│   │   ├── thread-manager.ts
│   │   └── thread-pool.ts
│   ├── utils/            # Utilities and helpers
│   │   └── factory.ts
│   ├── ai-manager.ts     # Main AI manager
│   └── index.ts          # Package exports
├── docs/                 # Documentation
├── mod.ts               # Module exports
└── package.json         # Package configuration
```

## Usage Patterns

### 1. Simple Chat Interface

```typescript
import { ClaudeAgent } from '@katalyst/ai';

const chatAgent = new ClaudeAgent({
  name: 'chat-assistant',
  model: 'claude-3-sonnet',
  systemPrompt: 'You are a friendly and helpful assistant.',
  maxTokens: 2000,
  temperature: 0.7
});

async function chatLoop() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('You: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const response = await chatAgent.processMessage(input);
      console.log('Assistant:', response);
    } catch (error) {
      console.error('Error:', error.message);
    }

    chatLoop();
  });
}

chatLoop();
```

### 2. Multi-Agent Content Pipeline

```typescript
import { 
  AIManager, 
  ClaudeAgent, 
  AgentOrchestrator,
  ThreadManager 
} from '@katalyst/ai';

// Initialize managers
const aiManager = new AIManager({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const threadManager = new ThreadManager({
  maxThreads: 10,
  threadTimeout: 300000 // 5 minutes
});

// Create content pipeline agents
const researcher = new ClaudeAgent({
  name: 'researcher',
  model: 'claude-3-sonnet',
  systemPrompt: 'You are a research specialist. Find accurate, up-to-date information.',
  capabilities: ['web-search', 'document-analysis']
});

const contentCreator = new ClaudeAgent({
  name: 'content-creator',
  model: 'claude-3-sonnet',
  systemPrompt: 'You are a content creator. Transform research into engaging content.',
  capabilities: ['content-generation', 'seo-optimization']
});

const editor = new ClaudeAgent({
  name: 'editor',
  model: 'claude-3-opus',
  systemPrompt: 'You are an editor. Refine content for clarity, accuracy, and style.',
  maxTokens: 6000
});

// Set up orchestrator
const orchestrator = new AgentOrchestrator({
  agents: [researcher, contentCreator, editor],
  workflow: 'pipeline',
  threadManager
});

// Execute content creation pipeline
async function createContent(topic: string, requirements: any) {
  const result = await orchestrator.executePipeline({
    input: { topic, requirements },
    stages: [
      {
        agent: 'researcher',
        task: 'research',
        output: 'research-data'
      },
      {
        agent: 'content-creator',
        task: 'create-content',
        input: 'research-data',
        output: 'draft-content'
      },
      {
        agent: 'editor',
        task: 'edit-content',
        input: 'draft-content',
        output: 'final-content'
      }
    ]
  });

  return result;
}

// Usage
const article = await createContent('Sustainable Technology Trends', {
  length: '1500-2000 words',
  tone: 'professional but accessible',
  includeSources: true,
  targetAudience: 'tech professionals'
});
```

### 3. Real-time AI Assistant

```typescript
import { 
  ClaudeAgent, 
  ThreadManager, 
  ClaudeAuth 
} from '@katalyst/ai';

// Initialize authentication
const auth = new ClaudeAuth({
  apiKey: process.env.ANTHROPIC_API_KEY,
  maxRetries: 3,
  rateLimit: {
    requestsPerMinute: 50,
    tokensPerMinute: 40000
  }
});

// Create thread manager for conversation state
const threadManager = new ThreadManager({
  maxThreads: 100,
  defaultThreadConfig: {
    maxMessages: 20,
    contextWindow: 100000,
    enablePersistence: true
  }
});

// Create AI assistant
const assistant = new ClaudeAgent({
  name: 'realtime-assistant',
  model: 'claude-3-sonnet',
  systemPrompt: 'You are a helpful AI assistant with real-time capabilities.',
  auth,
  threadManager,
  streaming: true
});

// WebSocket integration for real-time chat
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  const threadId = threadManager.createThread();
  
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'chat') {
        // Process message with streaming
        await assistant.processMessageStream(
          message.content,
          threadId,
          (chunk) => {
            ws.send(JSON.stringify({
              type: 'chunk',
              content: chunk,
              threadId
            }));
          }
        );
        
        ws.send(JSON.stringify({
          type: 'complete',
          threadId
        }));
      } else if (message.type === 'reset') {
        threadManager.resetThread(threadId);
        ws.send(JSON.stringify({
          type: 'reset-complete',
          threadId
        }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        error: error.message
      }));
    }
  });
  
  ws.on('close', () => {
    threadManager.cleanupThread(threadId);
  });
});
```

### 4. Custom Agent Development

```typescript
import { BaseAgent } from '@katalyst/ai';

class CustomCodeAssistant extends BaseAgent {
  private codeAnalyzer: CodeAnalyzer;
  private documentationGenerator: DocumentationGenerator;

  constructor(config: CustomAgentConfig) {
    super({
      name: 'code-assistant',
      model: 'claude-3-sonnet',
      systemPrompt: 'You are an expert programming assistant. Provide high-quality code solutions and explanations.',
      ...config
    });

    this.codeAnalyzer = new CodeAnalyzer();
    this.documentationGenerator = new DocumentationGenerator();
  }

  async processCodeRequest(request: CodeRequest): Promise<CodeResponse> {
    const { type, code, language, requirements } = request;

    switch (type) {
      case 'generate':
        return this.generateCode(code, language, requirements);
      case 'analyze':
        return this.analyzeCode(code, language);
      case 'optimize':
        return this.optimizeCode(code, language);
      case 'document':
        return this.generateDocumentation(code, language);
      default:
        throw new Error(`Unsupported request type: ${type}`);
    }
  }

  private async generateCode(
    description: string, 
    language: string, 
    requirements: any
  ): Promise<CodeResponse> {
    const prompt = `Generate ${language} code for: ${description}
    
Requirements:
${JSON.stringify(requirements, null, 2)}

Please provide:
1. The complete code implementation
2. Explanation of the approach
3. Usage examples
4. Potential improvements`;

    const response = await this.processMessage(prompt);
    
    return {
      code: this.extractCode(response),
      explanation: this.extractExplanation(response),
      examples: this.extractExamples(response),
      improvements: this.extractImprovements(response)
    };
  }

  private async analyzeCode(code: string, language: string): Promise<CodeResponse> {
    const analysis = await this.codeAnalyzer.analyze(code, language);
    const review = await this.processMessage(`
      Analyze this ${language} code and provide feedback:

      ${code}

      Focus on:
      1. Code quality and best practices
      2. Performance considerations
      3. Security vulnerabilities
      4. Maintainability
      5. Suggestions for improvement
    `);

    return {
      analysis,
      review,
      suggestions: this.extractSuggestions(review)
    };
  }
}

// Usage
const codeAssistant = new CustomCodeAssistant({
  temperature: 0.1,
  maxTokens: 6000
});

const result = await codeAssistant.processCodeRequest({
  type: 'generate',
  code: 'Create a REST API server with Express.js',
  language: 'javascript',
  requirements: {
    framework: 'express',
    features: ['authentication', 'rate limiting', 'error handling'],
    database: 'mongodb'
  }
});
```

## Configuration

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7
AI_TIMEOUT=30000
AI_MAX_RETRIES=3
AI_RATE_LIMIT_RPM=50
AI_ENABLE_CACHING=true
AI_CACHE_TTL=3600
```

### Configuration File

```typescript
// ai.config.ts
export const aiConfig = {
  // Claude API configuration
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultModel: 'claude-3-sonnet',
    maxTokens: 4000,
    temperature: 0.7,
    timeout: 30000
  },

  // Thread management
  threads: {
    maxConcurrent: 10,
    defaultTimeout: 300000,
    maxMessages: 50,
    enablePersistence: true
  },

  // Performance settings
  performance: {
    enableCaching: true,
    cacheTTL: 3600,
    enableMetrics: true,
    logLevel: 'info'
  },

  // Rate limiting
  rateLimit: {
    requestsPerMinute: 50,
    tokensPerMinute: 40000,
    enableBurstAllowance: true
  }
};
```

## Best Practices

### 1. Agent Design

- **Single Responsibility**: Each agent should have a clear, focused purpose
- **Consistent System Prompts**: Use well-defined system prompts for consistent behavior
- **Error Handling**: Implement proper error handling and fallback mechanisms
- **Resource Management**: Monitor token usage and manage context windows effectively

### 2. Performance Optimization

- **Thread Pooling**: Use thread pools for managing concurrent conversations
- **Caching**: Cache responses for repeated queries when appropriate
- **Streaming**: Use streaming for long responses to improve user experience
- **Batch Processing**: Process multiple requests together when possible

### 3. Security

- **API Key Management**: Store API keys securely and rotate them regularly
- **Input Validation**: Validate and sanitize all inputs
- **Rate Limiting**: Implement proper rate limiting to prevent abuse
- **Access Control**: Implement proper access controls for agent capabilities

### 4. Monitoring and Debugging

- **Logging**: Implement comprehensive logging for debugging and monitoring
- **Metrics**: Track performance metrics and usage patterns
- **Error Tracking**: Monitor errors and implement alerting
- **Health Checks**: Implement health checks for agent availability

## Integration Examples

### Next.js Integration

```typescript
// pages/api/chat.ts
import { ClaudeAgent, ThreadManager } from '@katalyst/ai';

const threadManager = new ThreadManager();
const agent = new ClaudeAgent({
  name: 'chat-agent',
  model: 'claude-3-sonnet',
  systemPrompt: 'You are a helpful assistant.',
  threadManager
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, threadId } = req.body;
    
    const response = await agent.processMessage(message, threadId);
    
    res.status(200).json({
      response,
      threadId: threadId || threadManager.getCurrentThreadId()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### React Integration

```typescript
// hooks/useAIAssistant.ts
import { useState, useCallback } from 'react';
import { ClaudeAgent, ThreadManager } from '@katalyst/ai';

export function useAIAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const threadManager = new ThreadManager();
  const agent = new ClaudeAgent({
    name: 'react-assistant',
    model: 'claude-3-sonnet',
    systemPrompt: 'You are a helpful assistant for React applications.',
    threadManager
  });

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await agent.processMessage(message);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [agent]);

  const resetConversation = useCallback(() => {
    threadManager.resetCurrentThread();
    setResponse('');
    setError(null);
  }, [threadManager]);

  return {
    sendMessage,
    resetConversation,
    isLoading,
    response,
    error
  };
}
```

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your Anthropic API key is valid and has sufficient quota
2. **Rate Limiting**: Implement proper rate limiting and retry logic
3. **Token Limits**: Monitor token usage and implement context window management
4. **Memory Leaks**: Properly clean up threads and resources
5. **Timeout Issues**: Adjust timeout settings for long-running operations

### Debug Mode

```typescript
import { AIManager } from '@katalyst/ai';

const aiManager = new AIManager({
  apiKey: process.env.ANTHROPIC_API_KEY,
  debug: true, // Enable debug logging
  logLevel: 'debug'
});
```

## Contributing

When contributing to the AI package:

1. Follow the established code patterns and conventions
2. Add comprehensive tests for new features
3. Update documentation for any API changes
4. Consider performance implications of changes
5. Ensure backward compatibility when possible

This comprehensive documentation provides everything needed to effectively use the Katalyst AI package for building sophisticated AI-powered applications.
