# Katalyst API AI Router Documentation

## Overview

The Katalyst API AI router provides a comprehensive suite of AI-powered services through tRPC procedures. This router handles chat completions, text generation, sentiment analysis, and image prompt generation with support for multiple AI providers and streaming capabilities.

## Architecture

The AI router is built on top of tRPC and consists of two main components:

1. **tRPC Router** (`/packages/api/trpc/routers/ai.ts`) - Core AI procedures
2. **Edge Function** (`/packages/api/ai/chat.ts`) - Streaming chat completions

### Core Dependencies

```typescript
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
```

## API Procedures

### 1. Chat Completion (`chat`)

**Endpoint**: `protectedProcedure.mutation`
**Purpose**: Handle AI chat completions with conversation history

#### Input Schema
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: 'gpt-4' | 'gpt-4-turbo-preview' | 'gpt-3.5-turbo';
  temperature?: number; // 0-2, default 0.7
  maxTokens?: number; // 1-4000, default 2000
}
```

#### Response Format
```typescript
{
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: [{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: 'stop' | 'length' | 'content_filter';
  }];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

#### Usage Example
```typescript
const response = await ai.chat.query({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing' }
  ],
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 1000
});
```

### 2. Text Generation (`generateText`)

**Endpoint**: `protectedProcedure.mutation`
**Purpose**: Generate specialized text content for different use cases

#### Input Schema
```typescript
{
  prompt: string;
  type: 'marketing' | 'blog' | 'email' | 'product-description';
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  length?: 'short' | 'medium' | 'long';
}
```

#### Response Format
```typescript
{
  text: string;
  metadata: {
    type: string;
    tone: string;
    length: string;
    generatedAt: Date;
  };
}
```

#### Usage Example
```typescript
const response = await ai.generateText.query({
  prompt: 'Launch our new AI platform',
  type: 'marketing',
  tone: 'professional',
  length: 'medium'
});
```

### 3. Sentiment Analysis (`analyzeSentiment`)

**Endpoint**: `publicProcedure.query`
**Purpose**: Analyze text sentiment and emotional components

#### Input Schema
```typescript
{
  text: string; // 1-5000 characters
}
```

#### Response Format
```typescript
{
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  score: number; // 0-1
  confidence: number; // 0.5-1.0
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
}
```

#### Usage Example
```typescript
const response = await ai.analyzeSentiment.query({
  text: 'I love this product! It works perfectly.'
});
```

### 4. Image Prompt Generation (`generateImagePrompt`)

**Endpoint**: `protectedProcedure.mutation`
**Purpose**: Generate optimized prompts for AI image generation

#### Input Schema
```typescript
{
  description: string;
  style?: 'realistic' | 'artistic' | 'cartoon' | 'abstract';
  mood?: 'bright' | 'dark' | 'colorful' | 'monochrome';
}
```

#### Response Format
```typescript
{
  prompt: string;
  negativePrompt: string;
  parameters: {
    steps: number;
    cfg_scale: number;
    width: number;
    height: number;
  };
}
```

#### Usage Example
```typescript
const response = await ai.generateImagePrompt.query({
  description: 'A futuristic city skyline',
  style: 'realistic',
  mood: 'bright'
});
```

## Integration Patterns

### 1. Basic Chat Integration

```typescript
// Client-side integration
import { trpc } from '@/utils/trpc';

const aiChat = trpc.ai.chat.useMutation();

const sendMessage = async (message: string) => {
  const messages = [
    { role: 'system', content: 'You are a helpful AI assistant.' },
    { role: 'user', content: message }
  ];
  
  const result = await aiChat.mutateAsync({
    messages,
    model: 'gpt-4-turbo-preview',
    temperature: 0.7
  });
  
  return result.choices[0].message.content;
};
```

### 2. Streaming Chat Integration

```typescript
// Edge function for streaming
import { OpenAIStream, StreamingTextResponse } from 'ai';

export default async function handler(req: Request) {
  const { messages, model = 'gpt-4-turbo-preview' } = await req.json();
  
  const response = await openai.createChatCompletion({
    model,
    messages,
    temperature: 0.7,
    stream: true,
    max_tokens: 2000,
  });
  
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      // Log completion for analytics
      await logChatCompletion({ model, completion });
    },
  });
  
  return new StreamingTextResponse(stream);
}
```

### 3. React Component Integration

```typescript
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const chatMutation = trpc.ai.chat.useMutation();
  
  const sendMessage = async () => {
    const newMessages = [
      ...messages,
      { role: 'user', content: input }
    ];
    
    setMessages(newMessages);
    
    try {
      const response = await chatMutation.mutateAsync({
        messages: newMessages,
        model: 'gpt-4-turbo-preview'
      });
      
      setMessages([
        ...newMessages,
        response.choices[0].message
      ]);
    } catch (error) {
      console.error('Chat error:', error);
    }
    
    setInput('');
  };
  
  return (
    <div>
      {/* Chat UI implementation */}
    </div>
  );
}
```

## Prompt Engineering Workflows

### 1. System Prompt Templates

```typescript
const systemPrompts = {
  assistant: 'You are a helpful AI assistant. Provide clear, accurate, and concise answers.',
  analyst: 'You are a data analyst. Analyze the provided information and provide insights.',
  creative: 'You are a creative writer. Generate engaging and imaginative content.',
  technical: 'You are a technical expert. Provide detailed and accurate technical information.'
};

const buildMessages = (template: keyof typeof systemPrompts, userMessage: string) => [
  { role: 'system', content: systemPrompts[template] },
  { role: 'user', content: userMessage }
];
```

### 2. Chain-of-Thought Prompting

```typescript
const cotPrompt = `
Think step by step to solve this problem:

1. Analyze the question and identify key components
2. Break down the problem into smaller steps
3. Solve each step methodically
4. Combine the results
5. Provide a final answer

Question: {question}
`;

const formatCOTPrompt = (question: string) => 
  cotPrompt.replace('{question}', question);
```

### 3. Few-Shot Learning

```typescript
const fewShotExample = `
Classify the sentiment of the following text as positive, negative, or neutral.

Examples:
Text: "I love this product!" -> positive
Text: "This is terrible" -> negative
Text: "It's okay" -> neutral

Text: "{text}" -> 
`;

const classifySentiment = async (text: string) => {
  const messages = [
    { role: 'system', content: 'You are a sentiment classifier.' },
    { role: 'user', content: fewShotExample.replace('{text}', text) }
  ];
  
  // Call AI API
};
```

## Model Configuration and Management

### 1. Model Selection Strategy

```typescript
interface ModelConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  costPerToken: number;
}

const modelConfigs: Record<string, ModelConfig> = {
  'gpt-4': {
    model: 'gpt-4',
    maxTokens: 8000,
    temperature: 0.7,
    costPerToken: 0.03
  },
  'gpt-4-turbo-preview': {
    model: 'gpt-4-turbo-preview',
    maxTokens: 4000,
    temperature: 0.7,
    costPerToken: 0.01
  },
  'gpt-3.5-turbo': {
    model: 'gpt-3.5-turbo',
    maxTokens: 4000,
    temperature: 0.7,
    costPerToken: 0.001
  }
};

const selectModel = (complexity: 'low' | 'medium' | 'high', budget: number) => {
  if (budget < 0.01) return modelConfigs['gpt-3.5-turbo'];
  if (complexity === 'high') return modelConfigs['gpt-4'];
  return modelConfigs['gpt-4-turbo-preview'];
};
```

### 2. Dynamic Configuration

```typescript
interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

const adaptiveConfig = (context: {
  type: 'creative' | 'analytical' | 'conversational';
  length: 'short' | 'medium' | 'long';
  consistency: 'high' | 'medium' | 'low';
}): AIConfig => {
  const baseConfig = {
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000
  };
  
  switch (context.type) {
    case 'creative':
      return { ...baseConfig, temperature: 0.9 };
    case 'analytical':
      return { ...baseConfig, temperature: 0.3 };
    case 'conversational':
      return { ...baseConfig, temperature: 0.7 };
  }
};
```

## Response Handling and Streaming

### 1. Streaming Response Handler

```typescript
class StreamingChatHandler {
  private controller: ReadableStreamDefaultController;
  private buffer: string[] = [];
  
  constructor() {
    const stream = new ReadableStream({
      start: (controller) => {
        this.controller = controller;
      }
    });
  }
  
  async handleChunk(chunk: string) {
    this.buffer.push(chunk);
    
    // Process chunk for partial responses
    if (this.isCompleteMessage(chunk)) {
      const message = this.buffer.join('');
      this.controller.enqueue(message);
      this.buffer = [];
    }
  }
  
  private isCompleteMessage(chunk: string): boolean {
    // Logic to determine if message is complete
    return chunk.includes('\n\n') || chunk.endsWith('.');
  }
  
  async finish() {
    if (this.buffer.length > 0) {
      this.controller.enqueue(this.buffer.join(''));
    }
    this.controller.close();
  }
}
```

### 2. Response Parsing

```typescript
interface ChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class ResponseParser {
  static parseResponse(response: ChatResponse): ParsedResponse {
    const { choices, usage } = response;
    const message = choices[0]?.message;
    
    if (!message) {
      throw new Error('No message in response');
    }
    
    return {
      content: message.content,
      role: message.role,
      finishReason: choices[0].finish_reason,
      tokenUsage: {
        prompt: usage.prompt_tokens,
        completion: usage.completion_tokens,
        total: usage.total_tokens,
        cost: this.calculateCost(usage.total_tokens, response.model)
      }
    };
  }
  
  private static calculateCost(tokens: number, model: string): number {
    const costs = {
      'gpt-4': 0.03 / 1000,
      'gpt-4-turbo-preview': 0.01 / 1000,
      'gpt-3.5-turbo': 0.001 / 1000
    };
    
    return tokens * (costs[model] || 0.01 / 1000);
  }
}
```

## Error Handling for AI Services

### 1. Comprehensive Error Handling

```typescript
class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AIError';
  }
}

class AIErrorHandler {
  static handle(error: any): AIError {
    // OpenAI API errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.message;
      
      switch (status) {
        case 400:
          return new AIError('Invalid request', 'INVALID_REQUEST', 400, error.response.data);
        case 401:
          return new AIError('Invalid API key', 'INVALID_API_KEY', 401);
        case 429:
          return new AIError('Rate limit exceeded', 'RATE_LIMIT', 429);
        case 500:
          return new AIError('OpenAI server error', 'SERVER_ERROR', 500);
        default:
          return new AIError(message, 'UNKNOWN_ERROR', status);
      }
    }
    
    // Network errors
    if (error.code === 'ECONNREFUSED') {
      return new AIError('Cannot connect to AI service', 'CONNECTION_ERROR', 503);
    }
    
    // Timeout errors
    if (error.code === 'ETIMEDOUT') {
      return new AIError('Request timeout', 'TIMEOUT', 408);
    }
    
    // Default error
    return new AIError(error.message || 'Unknown error', 'UNKNOWN_ERROR', 500);
  }
  
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw this.handle(error);
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new AIError('Max retries exceeded', 'MAX_RETRIES', 500);
  }
}
```

### 2. Graceful Degradation

```typescript
class FallbackHandler {
  static async withFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>
  ): Promise<T> {
    try {
      return await primaryOperation();
    } catch (error) {
      console.warn('Primary AI service failed, using fallback:', error);
      return await fallbackOperation();
    }
  }
  
  static async generateTextWithFallback(prompt: string): Promise<string> {
    return this.withFallback(
      // Primary: OpenAI
      async () => {
        const response = await openai.createChatCompletion({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        });
        return response.data.choices[0].message.content;
      },
      // Fallback: Simpler model or cached response
      async () => {
        return this.getCachedResponse(prompt) || 
               this.generateSimpleResponse(prompt);
      }
    );
  }
}
```

## Rate Limiting and Cost Management

### 1. Rate Limiting Implementation

```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    
    return true;
  }
  
  getRemainingRequests(userId: string): number {
    const userRequests = this.requests.get(userId) || [];
    const validRequests = userRequests.filter(
      timestamp => Date.now() - timestamp < this.windowMs
    );
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}
```

### 2. Cost Management

```typescript
interface CostTracker {
  trackUsage(userId: string, tokens: number, model: string): void;
  getDailyUsage(userId: string): number;
  isWithinBudget(userId: string, dailyLimit: number): boolean;
}

class AICostManager implements CostTracker {
  private usage: Map<string, { date: string; tokens: number; cost: number }[]> = new Map();
  
  private modelCosts = {
    'gpt-4': 0.03 / 1000,
    'gpt-4-turbo-preview': 0.01 / 1000,
    'gpt-3.5-turbo': 0.001 / 1000
  };
  
  trackUsage(userId: string, tokens: number, model: string): void {
    const cost = tokens * this.modelCosts[model];
    const today = new Date().toISOString().split('T')[0];
    
    const userUsage = this.usage.get(userId) || [];
    userUsage.push({ date: today, tokens, cost });
    
    // Filter to today's usage only
    const todayUsage = userUsage.filter(entry => entry.date === today);
    this.usage.set(userId, todayUsage);
  }
  
  getDailyUsage(userId: string): number {
    const userUsage = this.usage.get(userId) || [];
    const today = new Date().toISOString().split('T')[0];
    
    return userUsage
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.cost, 0);
  }
  
  isWithinBudget(userId: string, dailyLimit: number): boolean {
    return this.getDailyUsage(userId) < dailyLimit;
  }
  
  getUsageReport(userId: string): UsageReport {
    const userUsage = this.usage.get(userId) || [];
    const today = new Date().toISOString().split('T')[0];
    
    const todayUsage = userUsage.filter(entry => entry.date === today);
    
    return {
      totalCost: todayUsage.reduce((sum, entry) => sum + entry.cost, 0),
      totalTokens: todayUsage.reduce((sum, entry) => sum + entry.tokens, 0),
      requestCount: todayUsage.length,
      averageCostPerRequest: todayUsage.length > 0 
        ? todayUsage.reduce((sum, entry) => sum + entry.cost, 0) / todayUsage.length 
        : 0
    };
  }
}
```

### 3. Budget Enforcement Middleware

```typescript
const budgetMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  const costManager = new AICostManager();
  const dailyLimit = 10.0; // $10 per day
  
  if (!costManager.isWithinBudget(ctx.userId, dailyLimit)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Daily AI usage limit exceeded'
    });
  }
  
  const result = await next();
  
  // Track usage after the request (assuming we have token info)
  // This would need to be integrated with the actual AI response
  
  return result;
});
```

## Integration with Different AI Providers

### 1. Provider Abstraction

```typescript
interface AIProvider {
  name: string;
  chatCompletion(params: ChatParams): Promise<ChatResponse>;
  streamCompletion(params: ChatParams): Promise<ReadableStream>;
  generateText(params: TextParams): Promise<string>;
  analyzeSentiment(params: SentimentParams): Promise<SentimentResult>;
}

class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  
  async chatCompletion(params: ChatParams): Promise<ChatResponse> {
    // OpenAI implementation
  }
  
  async streamCompletion(params: ChatParams): Promise<ReadableStream> {
    // OpenAI streaming implementation
  }
  
  async generateText(params: TextParams): Promise<string> {
    // OpenAI text generation
  }
  
  async analyzeSentiment(params: SentimentParams): Promise<SentimentResult> {
    // OpenAI sentiment analysis
  }
}

class AnthropicProvider implements AIProvider {
  name = 'Anthropic';
  
  async chatCompletion(params: ChatParams): Promise<ChatResponse> {
    // Anthropic Claude implementation
  }
  
  // ... other methods
}
```

### 2. Provider Router

```typescript
class AIProviderRouter {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProvider = 'openai';
  
  constructor() {
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('anthropic', new AnthropicProvider());
    // Add more providers as needed
  }
  
  async routeRequest<T>(
    operation: keyof AIProvider,
    params: any,
    provider?: string
  ): Promise<T> {
    const selectedProvider = provider || this.defaultProvider;
    const aiProvider = this.providers.get(selectedProvider);
    
    if (!aiProvider) {
      throw new Error(`Provider ${selectedProvider} not found`);
    }
    
    try {
      return await (aiProvider[operation] as any)(params);
    } catch (error) {
      // Try fallback provider
      if (provider !== this.defaultProvider) {
        console.warn(`${selectedProvider} failed, trying ${this.defaultProvider}`);
        return await (this.providers.get(this.defaultProvider)![operation] as any)(params);
      }
      throw error;
    }
  }
  
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
  
  setDefaultProvider(provider: string): void {
    if (this.providers.has(provider)) {
      this.defaultProvider = provider;
    } else {
      throw new Error(`Provider ${provider} not available`);
    }
  }
}
```

### 3. Multi-Provider Strategy

```typescript
class MultiProviderStrategy {
  constructor(private router: AIProviderRouter) {}
  
  async chatWithFallback(params: ChatParams): Promise<ChatResponse> {
    const providers = ['openai', 'anthropic']; // Priority order
    
    for (const provider of providers) {
      try {
        return await this.router.routeRequest('chatCompletion', params, provider);
      } catch (error) {
        console.warn(`${provider} failed:`, error);
        continue;
      }
    }
    
    throw new Error('All AI providers failed');
  }
  
  async getBestProvider(params: {
    type: 'chat' | 'text' | 'sentiment';
    urgency: 'low' | 'medium' | 'high';
    budget: number;
  }): Promise<string> {
    // Logic to select best provider based on parameters
    if (params.urgency === 'high' && params.budget > 0.01) {
      return 'openai';
    }
    
    if (params.budget < 0.005) {
      return 'anthropic'; // Assuming cheaper option
    }
    
    return 'openai'; // Default
  }
}
```

## Context Management and History

### 1. Conversation Context Management

```typescript
interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
  metadata?: Record<string, any>;
}

interface Conversation {
  id: string;
  userId: string;
  messages: ConversationMessage[];
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  context: {
    model: string;
    temperature: number;
    systemPrompt?: string;
  };
}

class ConversationManager {
  private conversations: Map<string, Conversation> = new Map();
  
  async createConversation(
    userId: string,
    initialMessage?: string,
    systemPrompt?: string
  ): Promise<string> {
    const conversationId = generateId();
    const conversation: Conversation = {
      id: conversationId,
      userId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      context: {
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        systemPrompt
      }
    };
    
    if (initialMessage) {
      conversation.messages.push({
        id: generateId(),
        role: 'user',
        content: initialMessage,
        timestamp: new Date()
      });
    }
    
    if (systemPrompt) {
      conversation.messages.unshift({
        id: generateId(),
        role: 'system',
        content: systemPrompt,
        timestamp: new Date()
      });
    }
    
    this.conversations.set(conversationId, conversation);
    return conversationId;
  }
  
  async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    tokens?: number
  ): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    conversation.messages.push({
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
      tokens
    });
    
    conversation.updatedAt = new Date();
    
    // Limit conversation length to manage token usage
    if (conversation.messages.length > 50) {
      // Keep system message and last 49 messages
      const systemMessages = conversation.messages.filter(m => m.role === 'system');
      const recentMessages = conversation.messages.slice(-49);
      conversation.messages = [...systemMessages, ...recentMessages];
    }
  }
  
  async getContextWindow(
    conversationId: string,
    maxTokens: number = 4000
  ): Promise<ConversationMessage[]> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    // Calculate tokens for each message (approximate)
    const messagesWithTokens = conversation.messages.map(msg => ({
      ...msg,
      tokens: msg.tokens || Math.ceil(msg.content.length / 4)
    }));
    
    // Build context window from most recent messages
    const contextWindow: ConversationMessage[] = [];
    let currentTokens = 0;
    
    for (let i = messagesWithTokens.length - 1; i >= 0; i--) {
      const msg = messagesWithTokens[i];
      if (currentTokens + msg.tokens <= maxTokens) {
        contextWindow.unshift(msg);
        currentTokens += msg.tokens;
      } else {
        break;
      }
    }
    
    return contextWindow;
  }
  
  async getConversation(conversationId: string): Promise<Conversation | null> {
    return this.conversations.get(conversationId) || null;
  }
  
  async getUserConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  async deleteConversation(conversationId: string): Promise<void> {
    this.conversations.delete(conversationId);
  }
}
```

### 2. Context Summarization

```typescript
class ContextSummarizer {
  constructor(private aiRouter: AIProviderRouter) {}
  
  async summarizeConversation(
    conversationId: string,
    conversationManager: ConversationManager
  ): Promise<string> {
    const conversation = await conversationManager.getConversation(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    const recentMessages = conversation.messages.slice(-10); // Last 10 messages
    
    const summaryPrompt = `
Summarize the following conversation in a concise paragraph that captures the main topics and key points:

${recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Summary:`;
    
    try {
      const summary = await this.aiRouter.routeRequest(
        'generateText',
        { prompt: summaryPrompt, maxTokens: 150 }
      );
      
      return summary as string;
    } catch (error) {
      console.error('Failed to summarize conversation:', error);
      return 'Unable to generate summary';
    }
  }
  
  async compressLongConversation(
    conversationId: string,
    conversationManager: ConversationManager
  ): Promise<void> {
    const conversation = await conversationManager.getConversation(conversationId);
    if (!conversation || conversation.messages.length <= 20) {
      return; // No compression needed
    }
    
    // Summarize older messages
    const olderMessages = conversation.messages.slice(0, -10);
    const recentMessages = conversation.messages.slice(-10);
    
    const summary = await this.summarizeConversation(conversationId, conversationManager);
    
    // Replace older messages with summary
    const compressedMessages = [
      ...conversation.messages.filter(m => m.role === 'system'),
      {
        id: generateId(),
        role: 'system' as const,
        content: `Previous conversation summary: ${summary}`,
        timestamp: new Date()
      },
      ...recentMessages
    ];
    
    conversation.messages = compressedMessages;
  }
}
```

### 3. Persistent Context Storage

```typescript
interface ContextStorage {
  saveConversation(conversation: Conversation): Promise<void>;
  loadConversation(conversationId: string): Promise<Conversation | null>;
  loadUserConversations(userId: string): Promise<Conversation[]>;
  deleteConversation(conversationId: string): Promise<void>;
}

class DatabaseContextStorage implements ContextStorage {
  constructor(private db: Database) {}
  
  async saveConversation(conversation: Conversation): Promise<void> {
    await this.db.conversations.upsert({
      where: { id: conversation.id },
      update: {
        messages: JSON.stringify(conversation.messages),
        title: conversation.title,
        updatedAt: conversation.updatedAt,
        context: JSON.stringify(conversation.context)
      },
      create: {
        id: conversation.id,
        userId: conversation.userId,
        messages: JSON.stringify(conversation.messages),
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        context: JSON.stringify(conversation.context)
      }
    });
  }
  
  async loadConversation(conversationId: string): Promise<Conversation | null> {
    const record = await this.db.conversations.findUnique({
      where: { id: conversationId }
    });
    
    if (!record) return null;
    
    return {
      id: record.id,
      userId: record.userId,
      messages: JSON.parse(record.messages),
      title: record.title || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      context: JSON.parse(record.context)
    };
  }
  
  async loadUserConversations(userId: string): Promise<Conversation[]> {
    const records = await this.db.conversations.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    
    return records.map(record => ({
      id: record.id,
      userId: record.userId,
      messages: JSON.parse(record.messages),
      title: record.title || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      context: JSON.parse(record.context)
    }));
  }
  
  async deleteConversation(conversationId: string): Promise<void> {
    await this.db.conversations.delete({
      where: { id: conversationId }
    });
  }
}
```

## Best Practices

### 1. Security

- **API Key Management**: Store API keys in environment variables, never in code
- **Input Validation**: Always validate and sanitize user inputs
- **Rate Limiting**: Implement per-user rate limiting to prevent abuse
- **Content Filtering**: Implement content moderation for generated content

### 2. Performance

- **Caching**: Cache frequent responses to reduce API calls
- **Streaming**: Use streaming for long responses to improve user experience
- **Connection Pooling**: Reuse HTTP connections for better performance
- **Async Operations**: Use async/await for non-blocking operations

### 3. Cost Optimization

- **Model Selection**: Choose appropriate models based on task complexity
- **Token Management**: Monitor and optimize token usage
- **Batching**: Batch similar requests when possible
- **Caching**: Cache expensive operations

### 4. Monitoring

- **Usage Analytics**: Track API usage and costs
- **Error Logging**: Log errors for debugging and improvement
- **Performance Metrics**: Monitor response times and success rates
- **User Feedback**: Collect feedback on AI response quality

### 5. Error Recovery

- **Fallback Mechanisms**: Implement fallback strategies for service failures
- **Retry Logic**: Implement exponential backoff for failed requests
- **Graceful Degradation**: Provide basic functionality when AI services are unavailable
- **User Communication**: Clearly communicate errors to users

## Environment Configuration

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AI_DEFAULT_MODEL=gpt-4-turbo-preview
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7
AI_RATE_LIMIT=100
AI_DAILY_BUDGET=10.0
```

## Testing

```typescript
// Example test for AI router
import { createTRPCMsw } from 'msw-trpc';
import { aiRouter } from '../src/trpc/routers/ai';

describe('AI Router', () => {
  it('should handle chat completion', async () => {
    const result = await aiRouter.chat({
      messages: [
        { role: 'user', content: 'Hello, world!' }
      ],
      model: 'gpt-4-turbo-preview'
    });
    
    expect(result).toHaveProperty('choices');
    expect(result.choices[0]).toHaveProperty('message');
  });
  
  it('should validate input parameters', async () => {
    await expect(
      aiRouter.chat({
        messages: [],
        model: 'invalid-model'
      })
    ).rejects.toThrow();
  });
});
```

This documentation provides a comprehensive guide to the Katalyst API AI router, covering all aspects from basic usage to advanced patterns and best practices for AI-powered application development.
