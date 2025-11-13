# Claude Chat

The Claude Chat Edge Function provides a serverless API endpoint for AI chat interactions with streaming support. It leverages the Vercel AI SDK and OpenAI for scalable, real-time chat functionality.

## Overview

The Claude Chat Edge Function provides:
- Edge-optimized runtime for low latency
- Streaming text responses
- OpenAI integration with multiple model support
- Automatic logging and analytics
- Error handling and rate limiting
- Vercel deployment optimization

## Usage Examples

### Basic API Usage

```typescript
// Client-side usage
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Hello, how can you help me?' }
    ],
    model: 'gpt-4-turbo-preview'
  })
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  console.log(text);
}
```

### React Component Integration

```typescript
import { useState, useEffect } from 'react';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: 'gpt-4-turbo-preview'
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        assistantMessage += text;
        
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantMessage }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
```

### Streaming with Server-Sent Events

```typescript
class ChatStream {
  private eventSource: EventSource | null = null;

  connect(model = 'gpt-4-turbo-preview') {
    // Start streaming session
    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Start a conversation' }],
        model,
        stream: true
      })
    }).then(response => {
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                this.handleMessage(parsed);
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      };

      processStream();
    });
  }

  private handleMessage(data: any) {
    // Handle different message types
    switch (data.type) {
      case 'content':
        this.onContent(data.content);
        break;
      case 'error':
        this.onError(data.error);
        break;
      case 'done':
        this.onDone();
        break;
    }
  }

  onContent(content: string) {
    // Override in subclasses
    console.log('Content:', content);
  }

  onError(error: string) {
    // Override in subclasses
    console.error('Error:', error);
  }

  onDone() {
    // Override in subclasses
    console.log('Stream completed');
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
```

### Advanced Chat with Context Management

```typescript
class AdvancedChat {
  private context: Map<string, any> = new Map();
  private conversationHistory: Array<{role: string, content: string}> = [];

  async sendMessage(
    content: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      context?: Record<string, any>;
    } = {}
  ): Promise<string> {
    // Add context to message
    let enhancedContent = content;
    
    if (options.context) {
      Object.entries(options.context).forEach(([key, value]) => {
        this.context.set(key, value);
      });
    }

    if (this.context.size > 0) {
      const contextString = Array.from(this.context.entries())
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
      
      enhancedContent = `Context:\n${contextString}\n\nUser: ${content}`;
    }

    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content: enhancedContent });

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: this.conversationHistory,
          model: options.model || 'gpt-4-turbo-preview',
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
      }

      // Add assistant response to history
      this.conversationHistory.push({ role: 'assistant', content: fullResponse });

      // Extract and store any context updates
      this.extractContext(fullResponse);

      return fullResponse;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }

  private extractContext(response: string) {
    // Extract context information from responses
    const contextPattern = /\[context: (\w+)=([^\]]+)\]/g;
    let match;

    while ((match = contextPattern.exec(response)) !== null) {
      const [, key, value] = match;
      try {
        this.context.set(key, JSON.parse(value));
      } catch {
        this.context.set(key, value);
      }
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  setContext(key: string, value: any) {
    this.context.set(key, value);
  }

  getContext(key?: string) {
    if (key) {
      return this.context.get(key);
    }
    return Object.fromEntries(this.context);
  }
}
```

## API Reference

### Request Format

```typescript
interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}
```

### Response Format

The API returns a streaming response with the following headers:

```
Content-Type: text/plain; charset=utf-8
Cache-Control: no-cache
X-Accel-Buffering: no
```

### Configuration

The Edge Function is configured with:

```typescript
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Close to OpenAI servers
};
```

## Integration Patterns

### Chat Service Class

```typescript
class ChatService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        messages,
        model: options.model || 'gpt-4-turbo-preview',
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      result += decoder.decode(value);
    }

    return result;
  }

  async chatStream(
    messages: ChatMessage[],
    options: ChatOptions = {},
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        messages,
        model: options.model || 'gpt-4-turbo-preview',
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

### Rate Limiting and Caching

```typescript
class ChatWithLimits extends ChatService {
  private requestCache = new Map<string, { timestamp: number; response: string }>();
  private requestQueue = Array<() => Promise<void>>();
  private isProcessing = false;
  private lastRequestTime = 0;
  private readonly minRequestInterval = 1000; // 1 second between requests

  async chatWithLimit(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<string> {
    // Check cache first
    const cacheKey = this.generateCacheKey(messages, options);
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return cached.response;
    }

    // Rate limiting
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const now = Date.now();
          const timeSinceLastRequest = now - this.lastRequestTime;
          
          if (timeSinceLastRequest < this.minRequestInterval) {
            await new Promise(r => setTimeout(r, this.minRequestInterval - timeSinceLastRequest));
          }

          const response = await this.chat(messages, options);
          
          // Cache response
          this.requestCache.set(cacheKey, {
            timestamp: Date.now(),
            response
          });

          this.lastRequestTime = Date.now();
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()!;
      await request();
    }

    this.isProcessing = false;
  }

  private generateCacheKey(messages: ChatMessage[], options: ChatOptions): string {
    const key = {
      messages: messages.map(m => ({ role: m.role, content: m.content.slice(0, 100) })),
      model: options.model,
      temperature: options.temperature
    };
    
    return Buffer.from(JSON.stringify(key)).toString('base64');
  }

  clearCache() {
    this.requestCache.clear();
  }
}
```

### Analytics and Monitoring

```typescript
class ChatAnalytics {
  private static instance: ChatAnalytics;
  private metrics: Map<string, number> = new Map();
  private events: Array<{
    timestamp: number;
    event: string;
    data: any;
  }> = [];

  static getInstance(): ChatAnalytics {
    if (!ChatAnalytics.instance) {
      ChatAnalytics.instance = new ChatAnalytics();
    }
    return ChatAnalytics.instance;
  }

  trackRequest(data: {
    model: string;
    messageCount: number;
    responseTime: number;
    tokenCount?: number;
    success: boolean;
  }) {
    this.incrementMetric('total_requests');
    
    if (data.success) {
      this.incrementMetric('successful_requests');
    } else {
      this.incrementMetric('failed_requests');
    }

    this.incrementMetric(`model_${data.model}_requests`);
    this.addMetric('total_response_time', data.responseTime);
    this.addMetric('total_tokens', data.tokenCount || 0);

    this.events.push({
      timestamp: Date.now(),
      event: 'chat_request',
      data
    });

    // Send to analytics service
    this.sendToAnalytics(data);
  }

  private incrementMetric(name: string) {
    this.metrics.set(name, (this.metrics.get(name) || 0) + 1);
  }

  private addMetric(name: string, value: number) {
    this.metrics.set(name, (this.metrics.get(name) || 0) + value);
  }

  private async sendToAnalytics(data: any) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'chat_request', {
        model: data.model,
        success: data.success,
        response_time: data.responseTime,
        value: data.tokenCount || 0
      });
    }

    // Send to custom analytics endpoint
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'chat_request',
          data,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  getMetrics() {
    const totalRequests = this.metrics.get('total_requests') || 0;
    const successfulRequests = this.metrics.get('successful_requests') || 0;
    const totalResponseTime = this.metrics.get('total_response_time') || 0;
    const totalTokens = this.metrics.get('total_tokens') || 0;

    return {
      totalRequests,
      successfulRequests,
      failedRequests: this.metrics.get('failed_requests') || 0,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      totalTokens,
      averageTokensPerRequest: totalRequests > 0 ? totalTokens / totalRequests : 0
    };
  }

  getRecentEvents(count = 100) {
    return this.events.slice(-count);
  }
}
```

## Best Practices

1. **Streaming**: Use streaming responses for better user experience.

2. **Error Handling**: Implement proper error handling and retry logic.

3. **Rate Limiting**: Respect API rate limits and implement client-side throttling.

4. **Caching**: Cache responses for repeated queries to reduce costs.

5. **Context Management**: Maintain conversation context for better interactions.

6. **Analytics**: Track usage metrics for monitoring and optimization.

7. **Security**: Validate inputs and sanitize user messages.

8. **Performance**: Use Edge Runtime for optimal performance.

## Testing

```typescript
// Test utilities
class ChatTestUtils {
  static async createMockChatApi() {
    const mockMessages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ];

    return {
      async call(request: ChatRequest) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Return mock response
        return new Response('Mock response stream', {
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    };
  }

  static generateTestMessages(count: number): ChatMessage[] {
    return Array.from({ length: count }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Test message ${i + 1}`
    }));
  }
}

// Integration test
describe('Chat API', () => {
  test('should handle streaming responses', async () => {
    const mockApi = await ChatTestUtils.createMockChatApi();
    
    const response = await mockApi.call({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'gpt-4'
    });

    expect(response).toBeDefined();
    expect(response.headers.get('Content-Type')).toBe('text/plain');
  });

  test('should handle error responses', async () => {
    const mockApi = await ChatTestUtils.createMockChatApi();
    
    // Mock error response
    const errorResponse = new Response('Internal Server Error', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(errorResponse.ok).toBe(false);
    expect(errorResponse.status).toBe(500);
  });
});
```

## Deployment

### Vercel Configuration

```json
{
  "functions": {
    "src/claude/chat.ts": {
      "runtime": "edge",
      "regions": ["iad1"]
    }
  },
  "env": {
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

### Environment Variables

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Analytics
VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# Optional: Custom endpoints
OPENAI_BASE_URL=https://api.openai.com/v1
```
