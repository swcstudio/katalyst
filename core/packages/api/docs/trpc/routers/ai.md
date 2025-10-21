# AI Router

## Overview

The `ai.ts` router provides comprehensive AI integration capabilities for the Katalyst framework. It offers chat functionality, content generation, analysis, and conversation management with seamless integration with the Katalyst AI package and external AI providers like Anthropic's Claude.

## Features

- **AI Chat Integration**: Real-time chat with AI models with streaming support
- **Content Generation**: Generate various types of content (blog posts, product descriptions, social media)
- **Content Analysis**: Analyze content for sentiment, SEO, readability, and plagiarism
- **Conversation Management**: Track and manage conversation history and sessions
- **Multi-Model Support**: Support for different AI models (Claude 3 Sonnet, Haiku, Opus)
- **Streaming Responses**: Real-time streaming for better user experience
- **Rate Limiting**: Intelligent rate limiting and quota management
- **Error Handling**: Comprehensive error handling and retry mechanisms

## Procedures

### AI Chat

#### chat
Interactive chat functionality with AI models, supporting both streaming and batch responses.

```typescript
aiRouter.chat = t.procedure
  .input(z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    conversationId: z.string().optional(),
    model: z.enum(['claude-3-sonnet', 'claude-3-haiku', 'claude-3-opus']).default('claude-3-sonnet'),
    stream: z.boolean().default(false),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().min(1).max(8000).default(4000),
    systemPrompt: z.string().optional(),
    context: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Rate limiting
    const rateLimitKey = `ai-chat:${ctx.user.id}`;
    const currentUsage = await checkRateLimit(rateLimitKey, input.maxTokens);
    
    if (currentUsage.exceeded) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Try again in ${currentUsage.resetTime} seconds.`,
      });
    }

    try {
      // Get or create conversation
      let conversation;
      if (input.conversationId) {
        conversation = await ctx.prisma.conversation.findUnique({
          where: { id: input.conversationId, userId: ctx.user.id },
          include: { messages: { orderBy: { createdAt: 'desc' }, take: 10 } },
        });
        
        if (!conversation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Conversation not found',
          });
        }
      } else {
        conversation = await ctx.prisma.conversation.create({
          data: {
            userId: ctx.user.id,
            title: input.message.slice(0, 50) + (input.message.length > 50 ? '...' : ''),
            model: input.model,
            metadata: input.metadata,
          },
        });
      }

      // Build message history for context
      const contextMessages = conversation.messages.slice(-5).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      // Add current message
      contextMessages.push({
        role: 'user',
        content: input.message,
      });

      // Add system prompt if provided
      if (input.systemPrompt) {
        contextMessages.unshift({
          role: 'system',
          content: input.systemPrompt,
        });
      }

      // Add additional context if provided
      if (input.context && input.context.length > 0) {
        contextMessages.push(...input.context.map(ctx => ({
          role: 'user',
          content: ctx,
        })));
      }

      if (input.stream) {
        // Streaming response
        const response = await ctx.aiManager.chatStream({
          messages: contextMessages,
          model: input.model,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
          conversationId: conversation.id,
          userId: ctx.user.id,
        });

        return response;
      } else {
        // Batch response
        const response = await ctx.aiManager.chat({
          messages: contextMessages,
          model: input.model,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
          conversationId: conversation.id,
          userId: ctx.user.id,
        });

        // Save message and response
        await ctx.prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: 'user',
            content: input.message,
            model: input.model,
            metadata: {
              requestIp: ctx.requestIp,
              userAgent: ctx.userAgent,
            },
          },
        });

        const assistantMessage = await ctx.prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: 'assistant',
            content: response.content,
            model: input.model,
            tokensUsed: response.tokensUsed,
            metadata: {
              responseTime: response.responseTime,
              model: response.model,
            },
          },
        });

        // Update conversation metadata
        await ctx.prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageAt: new Date(),
            messageCount: conversation.messageCount + 2,
            metadata: {
              ...conversation.metadata,
              lastModel: input.model,
              lastActivity: new Date().toISOString(),
            },
          },
        });

        // Log AI usage
        await logAIUsage({
          userId: ctx.user.id,
          model: input.model,
          tokensUsed: response.tokensUsed,
          operation: 'chat',
          conversationId: conversation.id,
          requestId: ctx.requestId,
        });

        return {
          id: assistantMessage.id,
          content: response.content,
          model: response.model,
          tokensUsed: response.tokensUsed,
          conversationId: conversation.id,
          messageCount: conversation.messageCount + 2,
          createdAt: assistantMessage.createdAt,
        };
      }
    } catch (error) {
      // Log error
      await ctx.logger.error('AI chat error', {
        error: error.message,
        userId: ctx.user.id,
        input,
        requestId: ctx.requestId,
      });

      // Handle specific error types
      if (error.message.includes('rate limit')) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded. Please try again later.',
        });
      }

      if (error.message.includes('quota')) {
        throw new TRPCError({
          code: 'RESOURCE_EXHAUSTED',
          message: 'AI quota exceeded. Please try again later.',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'AI service temporarily unavailable',
      });
    }
  });
```

### Content Generation

#### generateContent
Generate various types of content using AI models with customizable parameters.

```typescript
aiRouter.generateContent = t.procedure
  .input(z.object({
    prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
    type: z.enum([
      'blog-post',
      'product-description',
      'social-media',
      'email',
      'newsletter',
      'article',
      'product-name',
      'tagline',
      'meta-description',
      'summary',
    ]),
    tone: z.enum([
      'professional',
      'casual',
      'friendly',
      'formal',
      'creative',
      'technical',
      'persuasive',
    ]).default('professional'),
    length: z.enum(['short', 'medium', 'long']).default('medium'),
    language: z.string().default('english'),
    keywords: z.array(z.string()).optional(),
    targetAudience: z.string().optional(),
    includeSEO: z.boolean().default(true),
    format: z.enum(['markdown', 'html', 'plain', 'json']).default('markdown'),
    model: z.enum(['claude-3-sonnet', 'claude-3-haiku', 'claude-3-opus']).default('claude-3-sonnet'),
    maxTokens: z.number().min(100).max(8000).default(2000),
    temperature: z.number().min(0).max(2).default(0.7),
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Generate system prompt based on content type and tone
    const systemPrompts = {
      'blog-post': {
        professional: `You are a professional blog post writer. Create well-researched, informative, and engaging content. Include proper structure, headings, and SEO elements.`,
        casual: `You are a casual blog writer. Write in a conversational, friendly style that connects with readers personally.`,
        creative: `You are a creative blog writer. Use vivid language, storytelling techniques, and unique perspectives.`,
      },
      'product-description': {
        professional: `You are a professional copywriter specializing in product descriptions. Focus on benefits, features, and unique selling points. Be persuasive but honest.`,
        technical: `You are a technical writer focused on product specifications and features. Provide detailed technical information clearly and accurately.`,
        casual: `You are a friendly product description writer. Explain features in simple, accessible language that anyone can understand.`,
      },
      'social-media': {
        professional: `You are a social media manager for business accounts. Create professional, engaging content that aligns with brand voice and marketing goals.`,
        casual: `You are a social media creator. Create fun, relatable content that encourages engagement and community building.`,
        creative: `You are a creative social media strategist. Develop innovative, trend-setting content that stands out in crowded feeds.`,
      },
      'email': {
        professional: `You are a professional email marketer. Write clear, concise, and action-oriented emails that drive results.`,
        friendly: `You are a friendly email marketer. Write warm, personal emails that build relationships and trust.`,
        formal: `You are a formal business communicator. Write professional, structured emails for formal business communications.`,
      },
    };

    const systemPrompt = systemPrompts[input.type]?.[input.tone] || 
      `You are a professional content writer. Create high-quality content that is well-structured, informative, and engaging.`;

    // Build detailed prompt
    let detailedPrompt = systemPrompt;
    
    detailedPrompt += `\n\nContent Type: ${input.type}`;
    detailedPrompt += `\nTone: ${input.tone}`;
    detailedPrompt += `\nLength: ${input.length}`;
    
    if (input.targetAudience) {
      detailedPrompt += `\nTarget Audience: ${input.targetAudience}`;
    }
    
    if (input.keywords && input.keywords.length > 0) {
      detailedPrompt += `\nKeywords to include: ${input.keywords.join(', ')}`;
    }

    if (input.includeSEO) {
      detailedPrompt += `\nInclude SEO elements like meta descriptions, headings, and keyword optimization.`;
    }

    detailedPrompt += `\n\nPrompt: ${input.prompt}`;
    
    if (input.format === 'html') {
      detailedPrompt += `\n\nPlease format the response as HTML with proper tags and structure.`;
    } else if (input.format === 'json') {
      detailedPrompt += `\n\nPlease format the response as JSON with appropriate structure.`;
    }

    try {
      const response = await ctx.aiManager.generateContent({
        prompt: detailedPrompt,
        model: input.model,
        temperature: input.temperature,
        maxTokens: input.maxTokens,
        userId: ctx.user.id,
        type: input.type,
        tone: input.tone,
        length: input.length,
      });

      // Log content generation
      await logAIUsage({
        userId: ctx.user.id,
        model: input.model,
        tokensUsed: response.tokensUsed,
        operation: 'generate-content',
        contentType: input.type,
        requestId: ctx.requestId,
      });

      // Save content generation record
      await ctx.prisma.generatedContent.create({
        data: {
          userId: ctx.user.id,
          type: input.type,
          prompt: input.prompt,
          content: response.content,
          model: input.model,
          tone: input.tone,
          length: input.length,
          language: input.language,
          tokensUsed: response.tokensUsed,
          metadata: {
            keywords: input.keywords,
            targetAudience: input.targetAudience,
            includeSEO: input.includeSEO,
            format: input.format,
          },
        },
      });

      return {
        id: response.id,
        content: response.content,
        type: input.type,
        tone: input.tone,
        length: input.length,
        model: response.model,
        tokensUsed: response.tokensUsed,
        createdAt: response.createdAt,
      };
    } catch (error) {
      await ctx.logger.error('Content generation error', {
        error: error.message,
        userId: ctx.user.id,
        input,
        requestId: ctx.requestId,
      });

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Content generation failed. Please try again.',
      });
    }
  });
```

### Content Analysis

#### analyzeContent
Analyze content for various metrics including sentiment, SEO, readability, and plagiarism.

```typescript
aiRouter.analyzeContent = t.procedure
  .input(z.object({
    content: z.string().min(50, 'Content must be at least 50 characters'),
    analysisType: z.enum([
      'sentiment',
      'seo',
      'readability',
      'plagiarism',
      'grammar',
      'keyword-density',
      'structure',
    ]),
    language: z.string().default('english'),
    keywords: z.array(z.string()).optional(),
    targetAudience: z.string().optional(),
    comparisonContent: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Check content analysis quota
    const analysisKey = `content-analysis:${ctx.user.id}`;
    const currentUsage = await checkAnalysisQuota(analysisKey, input.content.length);
    
    if (currentUsage.exceeded) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Content analysis quota exceeded. Please try again later.',
      });
    }

    try {
      let analysisResult;

      switch (input.analysisType) {
        case 'sentiment':
          analysisResult = await analyzeSentiment(input.content, input.language);
          break;
          
        case 'seo':
          analysisResult = await analyzeSEO(input.content, input.keywords);
          break;
          
        case 'readability':
          analysisResult = await analyzeReadability(input.content, input.targetAudience);
          break;
          
        case 'plagiarism':
          analysisResult = await analyzePlagiarism(input.content, input.comparisonContent);
          break;
          
        case 'grammar':
          analysisResult = await analyzeGrammar(input.content, input.language);
          break;
          
        case 'keyword-density':
          analysisResult = await analyzeKeywordDensity(input.content, input.keywords);
          break;
          
        case 'structure':
          analysisResult = await analyzeStructure(input.content);
          break;
          
        default:
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Unsupported analysis type: ${input.analysisType}`,
          });
      }

      // Log analysis usage
      await logAIUsage({
        userId: ctx.user.id,
        model: 'analysis-tool',
        tokensUsed: analysisResult.tokensUsed || 0,
        operation: 'analyze-content',
        analysisType: input.analysisType,
        requestId: ctx.requestId,
      });

      // Save analysis record
      await ctx.prisma.contentAnalysis.create({
        data: {
          userId: ctx.user.id,
          contentHash: hashContent(input.content),
          contentLength: input.content.length,
          analysisType: input.analysisType,
          result: analysisResult,
          language: input.language,
          metadata: {
            keywords: input.keywords,
            targetAudience: input.targetAudience,
            comparisonContent: input.comparisonContent ? true : false,
          },
        },
      });

      return {
        id: analysisResult.id,
        analysisType: input.analysisType,
        result: analysisResult,
        contentHash: hashContent(input.content),
        contentLength: input.content.length,
        createdAt: new Date(),
      };
    } catch (error) {
      await ctx.logger.error('Content analysis error', {
        error: error.message,
        userId: ctx.user.id,
        input,
        requestId: ctx.requestId,
      });

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Content analysis failed. Please try again.',
      });
    }
  });
```

### Conversation Management

#### getConversations
Retrieve user's conversation history with pagination and filtering options.

```typescript
aiRouter.getConversations = t.procedure
  .input(z.object({
    page: z.number().default(1),
    limit: z.number().default(20),
    model: z.enum(['claude-3-sonnet', 'claude-3-haiku', 'claude-3-opus']).optional(),
    dateRange: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
    }).optional(),
    search: z.string().optional(),
  }))
  .query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    const whereClause: any = {
      userId: ctx.user.id,
    };

    // Filter by model if specified
    if (input.model) {
      whereClause.model = input.model;
    }

    // Filter by date range
    if (input.dateRange?.start) {
      whereClause.createdAt = {
        gte: new Date(input.dateRange.start),
      };
    }
    
    if (input.dateRange?.end) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        lte: new Date(input.dateRange.end),
      };
    }

    // Search functionality
    if (input.search) {
      whereClause.OR = [
        { title: { contains: input.search, mode: 'insensitive' } },
        { messages: { some: { content: { contains: input.search, mode: 'insensitive' } } } },
      ];
    }

    const [conversations, total] = await Promise.all([
      ctx.prisma.conversation.findMany({
        where: whereClause,
        orderBy: { lastMessageAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: true,
        },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      ctx.prisma.conversation.count({ where: whereClause }),
    ]);

    return {
      conversations,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages: Math.ceil(total / input.limit),
      },
    };
  });
```

#### getConversation
Retrieve a specific conversation with all messages.

```typescript
aiRouter.getConversation = t.procedure
  .input(z.object({
    id: z.string(),
    includeMessages: z.boolean().default(true),
    messageLimit: z.number().default(50),
  }))
  .query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCAIError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    const conversation = await ctx.prisma.conversation.findUnique({
      where: { id: input.id, userId: ctx.user.id },
      include: {
        messages: input.includeMessages
          ? {
              orderBy: { createdAt: 'asc' },
              take: input.messageLimit,
            }
          : false,
      },
    });

    if (!conversation) {
      throw new TRPCError({
        code: 'content_NOT_FOUND',
        message: 'Conversation not found',
      });
    }

    return conversation;
  });
```

#### deleteConversation
Delete a conversation and all its messages.

```typescript
aiRouter.deleteConversation = t.procedure
  .input(z.object({
    id: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Verify ownership
    const conversation = await ctx.prisma.conversation.findUnique({
      where: { id: input.id, userId: ctx.user.id },
    });

    if (!conversation) {
      throw new TRPCError({
        code: 'content_NOT_FOUND',
        message: 'Conversation not found',
      });
    }

    // Delete messages first (foreign key constraint)
    await ctx.prisma.message.deleteMany({
      where: { conversationId: input.id },
    });

    // Delete conversation
    await ctx.prima.conversation.delete({
      where: { id: input.id },
    });

    // Log deletion
    await ctx.logger.info('Conversation deleted', {
      conversationId: input.id,
      userId: ctx.user.id,
      requestId: ctx.requestId,
    });

    return { success: true };
  });
```

## Usage Examples

### React Integration with Chat

```typescript
// hooks/useAIChat.ts
import { useState, useCallback } from 'react';
import { trpc } from '../utils/trpc';

export function useAIChat(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const chatMutation = trpc.ai.chat.useMutation();
  const generateContentMutation = trpc.ai.generateContent.useMutation();

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setIsStreaming(true);

    try {
      if (chatMutation.isLoading) return;

      const result = await chatMutation.mutateAsync({
        message,
        conversationId,
        stream: true,
        model: 'claude-3-sonnet',
        temperature: 0.7,
        maxTokens: 4000,
      });

      // Handle streaming response
      if (result && typeof result === 'object' && 'stream' in result) {
        let accumulatedContent = '';
        
        for await (const chunk of result.stream) {
          accumulatedContent += chunk;
          setMessages(prev => [
            ...prev.slice(-10), // Keep last 10 messages
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: accumulatedContent,
              createdAt: new Date(),
              streaming: true,
            },
          ]);
        }
      } else {
        // Non-streaming response
        setMessages(prev => [
          ...prev.slice(-10),
          {
            id: result.id,
            role: 'assistant',
            content: result.content,
            createdAt: result.createdAt,
            streaming: false,
          },
        ]);
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          content: message,
          createdAt: new Date(),
          streaming: false,
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [conversationId, chatMutation, chatMutation.isLoading]);

  const generateContent = useCallback(async (prompt: string, type: string) => {
    try {
      const result = await generateContentMutation.mutateAsync({
        prompt,
        type: type as any,
        tone: 'professional',
        length: 'medium',
        format: 'markdown',
      });

      return result.content;
    } catch (error) {
      console.error('Content generation error:', error);
      return null;
    }
  }, [generateContentMutation]);

  return {
    messages,
    sendMessage,
    generateContent,
    isLoading,
    isStreaming,
    conversationId,
  };
}

// Usage in component
function ChatInterface() {
  const {
    messages,
    sendMessage,
    generateContent,
    isLoading,
    isStreaming,
  } = useAIChat();

  const [inputValue, setInputValue] = useState('');
  const [contentType, setContentType] = useState('blog-post');

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role} ${message.streaming ? 'streaming' : ''}`}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-meta">
              <span className="role">{message.role}</span>
              <span className="timestamp">
                {formatTime(message.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
              sendMessage(inputValue);
              setInputValue('');
            }
          }}
        />
        
        <div className="controls">
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={isLoading}
          >
            Send
          </button>
          
          <button
            onClick={() => generateContent(inputValue, contentType)}
            disabled={isLoading}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Content Generation Tool

```typescript
// components/ContentGenerator.tsx
import { useState } from 'react';
import { trpc } from '../utils/trpc';

export function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [language, setLanguage] = useState('english');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [includeSEO, setIncludeSEO] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const generateMutation = trpc.ai.generateContent.useMutation();
  const analysisMutation = trpc.ai.analyzeContent.useMutation();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateMutation.mutateAsync({
        prompt,
        type: contentType as any,
        tone,
        length: length as any,
        language,
        keywords,
        includeSEO,
        model: 'claude-3-sonnet',
        temperature: 0.7,
      });

      setGeneratedContent(result.content);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!generatedContent) {
      return;
    }

    try {
      const result = await analysisMutation.mutateAsync({
        content: generatedContent,
        analysisType: 'seo',
        language,
      });

      return result.result;
    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  return (
    <div className="content-generator">
      <div className="controls">
        <div className="form-group">
          <label>Content Type</label>
          <select 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="blog-post">Blog Post</option>
            <option value="product-description">Product Description</option>
            <option value="social-media">Social Media</option>
            <option value="email">Email</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tone</label>
          <select 
            value={tone} 
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        <div className="form-group">
          <label>Length</label>
          <select 
            value={length} 
            onChange={(e) => setLength(e.target.value)}
          >
            <option value="short">Short (100-300 words)</option>
            <option value="medium">Medium (300-600 words)</option>
            <option value="long">Long (600-1000 words)</option>
          </select>
        </div>

        <div className="form-group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your content prompt..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Keywords (comma-separated)</label>
          <input
            type="text"
            value={keywords.join(', ')}
            onChange={(e) => setKeywords(e.target.value.split(',').map(k => k.trim()))}
            placeholder="seo, marketing, business"
          />
        </div>

        <div className="form-group">
          <label>Language</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="english"
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={includeSEO}
              onChange={(e) => setIncludeSEO(e.target.checked)}
            />
            Include SEO elements
          </label>
        </div>
      </div>

      <div className="actions">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </button>
        
        {generatedContent && (
          <button
          onClick={handleAnalyze}
          className="analyze-button"
        >
          Analyze SEO
          </button>
        )}
      </div>

      <div className="result">
        {generatedContent && (
          <div className="generated-content">
            <div className="content-preview">
              <h3>Generated Content</h3>
              <pre className="content-text">
                {generatedContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Advanced Features

### Streaming Implementation

```typescript
// Streaming chat response handler
export const handleStreamingResponse = async (
  response: Response,
  reader: ReadableStream,
  conversationId: string,
  userId: string
) => {
  const encoder = new TextEncoder();
  const writer = response.body.getWriter();
  
  const reader = reader.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    const chunk = encoder.decode(value);
    yield chunk;
    
    // Send chunk to client
    writer.write(`data: ${chunk}\n\n`);
    
    // Save partial message if streaming
    if (chunk.includes('.') || chunk.includes('!') || chunk.includes('?')) {
      await savePartialMessage(conversationId, userId, chunk);
    }
  }
  
  writer.close();
};
```

### Context Window Management

```typescript
// Smart context window management for conversations
export const manageContextWindow = (
  messages: Array<{role: string; content: string}>,
  maxTokens: number,
  model: string
): Array<{role: string; content: string}> => {
  // Calculate available context window
  const totalTokens = messages.reduce(
    (sum, msg) => sum + estimateTokens(msg.content),
    0
  );
  
  // Remove old messages if context window exceeded
  if (totalTokens > maxTokens) {
    let tokensUsed = 0;
    const filteredMessages: Array<{role: string; content: string}> = [];
    
    // Remove messages from oldest until within limit
    for (let i = messages.length - 1; i >= 0; i--) {
      const tokens = estimateTokens(messages[i].content);
      if (tokensUsed + tokens <= maxTokens) {
        filteredMessages.unshift(messages[i]);
        tokensUsed += tokens;
      } else {
        break;
      }
    }
    
    return filteredMessages;
  }
  
  return messages;
};

const estimateTokens = (text: string): number => {
  // Approximate token count (rough estimate: 4 characters per token)
  return Math.ceil(text.length / 4);
};
```

## Best Practices

### 1. Error Handling

- **Graceful Degradation**: Provide fallback responses when AI services are unavailable
- **Retry Logic**: Implement exponential backoff for transient errors
- **User Feedback**: Clear error messages for different error types
- **Logging**: Log all AI interactions for debugging and analytics

### 2. Performance Optimization

- **Streaming**: Use streaming for long responses to improve user experience
- **Context Management**: Implement intelligent context window management
- **Caching**: Cache frequently used content to reduce API calls
- **Rate Limiting**: Protect against abuse and manage usage quotas

### 3. Security

- **Input Validation**: Validate all inputs with proper sanitization
- **Rate Limiting**: Implement per-user rate limiting
- **Content Filtering**: Filter inappropriate or harmful content
- **Access Control**: Ensure users can only access their own conversations

### 4. User Experience

- **Real-time Feedback**: Provide immediate feedback during content generation
- **Progress Indicators**: Show loading states and progress bars
- **Auto-save**: Save conversation drafts automatically
- **Search and Filter**: Enable searching and filtering of conversations

## Integration with External Services

### Database Schema

```typescript
// Conversation model
model Conversation {
  id        String   @id @default(cuid())
  userId    String
  title     String?
  model     String   @default('claude-3-sonnet')
  createdAt DateTime @default(now())
  lastMessageAt DateTime?
  messageCount Int    @default(0)
  metadata   Json?
  messages   Message[]
}

// Message model
model Message {
  id          String   @id @default(cuid())
  conversationId String
  role        'user' | 'assistant'
  content     String
  model       String?
  tokensUsed  Int?
  metadata    Json?
  createdAt   DateTime @default(now())
}

// GeneratedContent model
model GeneratedContent {
  id          String   @id @default(cuid())
  userId      String
  type        String
  prompt      String
  content     String
  tone        String
  length      String
  language    String   @default('english')
  tokensUsed  Int?
  model       String
  metadata    Json?
  createdAt   DateTime @default(now())
}
```

### Rate Limiting Implementation

```typescript
class RateLimiter {
  private cache = new Map<string, { count: number; resetTime: number }>();
  
  async checkRateLimit(
    key: string, 
    tokens: number, 
    limit: number,
    windowMinutes: number = 60
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const record = this.cache.get(key);
    
    if (!record || now > record.resetTime) {
      this.cache.set(key, { count: 1, resetTime: now + windowMinutes * 60 * 1000 });
      return { allowed: true, remaining: limit - 1, resetTime: windowMinutes * 60 };
    }
    
    if (record.count >= limit) {
      const resetTime = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, remaining: 0, resetTime };
    }
    
    const newCount = record.count + 1;
    this.cache.set(key, { 
      count: newCount, 
      resetTime: record.resetTime 
    });
    
    return { 
      allowed: true, 
      remaining: limit - newCount, 
      resetTime: Math.ceil((record.resetTime - now) / 1000) 
    };
  }
}
```

This comprehensive AI router provides a robust foundation for building AI-powered applications with the Katalyst framework, featuring chat functionality, content generation, analysis, and conversation management with excellent developer experience and production-ready capabilities.
