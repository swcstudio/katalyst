import { z } from 'npm:zod';
import { OpenAI } from 'npm:openai';
import { verifyToken } from 'npm:@clerk/clerk-sdk-node';

const aiRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  context: z.enum([
    'infrastructure',
    'terraform',
    'kubernetes',
    'docker',
    'ci-cd',
    'monitoring',
    'security',
    'performance',
    'troubleshooting',
    'code-generation',
    'architecture-review'
  ]),
  conversationId: z.string().uuid().optional(),
  attachments: z.array(z.object({
    type: z.enum(['terraform', 'yaml', 'dockerfile', 'code', 'config']),
    content: z.string(),
    filename: z.string()
  })).optional(),
  preferences: z.object({
    cloudProvider: z.enum(['aws', 'gcp', 'azure', 'digitalocean', 'ovhcloud']).default('aws'),
    infraTool: z.enum(['terraform', 'pulumi', 'cloudformation', 'cdk']).default('terraform'),
    orchestrator: z.enum(['kubernetes', 'docker-swarm', 'nomad']).default('kubernetes'),
    responseFormat: z.enum(['conversational', 'code-only', 'detailed', 'quick']).default('conversational')
  }).optional(),
  streaming: z.boolean().default(true)
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPTS = {
  infrastructure: `You are an expert cloud-native infrastructure architect specializing in enterprise-grade distributed systems. You help design, implement, and optimize cloud infrastructure with focus on:

- Multi-tenant architecture with strict node isolation
- Kubernetes orchestration and management
- Infrastructure as Code (Terraform, Pulumi)
- CI/CD pipeline optimization
- Security best practices and compliance
- Performance optimization and scaling
- Cost optimization strategies
- Disaster recovery and high availability

Provide detailed, production-ready solutions with proper error handling, security considerations, and industry best practices. Always include relevant code examples and configuration files.`,

  terraform: `You are a Terraform expert who specializes in creating robust, scalable infrastructure as code. You help with:

- Terraform module development and best practices
- State management and remote backends
- Provider configuration and version constraints
- Resource dependencies and lifecycle management
- Security scanning and compliance
- Multi-environment deployments
- Terraform Cloud/Enterprise workflows

Always provide complete, working Terraform configurations with proper variable definitions, outputs, and documentation.`,

  kubernetes: `You are a Kubernetes architect expert in enterprise container orchestration. You specialize in:

- Cluster architecture and node management
- Workload deployment and scaling strategies
- Service mesh implementation (Istio, Linkerd)
- Security policies and RBAC
- Monitoring and observability (Prometheus, Grafana)
- Storage and networking solutions
- GitOps with ArgoCD/Flux

Provide production-ready YAML manifests with proper resource limits, security contexts, and monitoring configurations.`,

  'code-generation': `You are an expert software engineer specializing in cloud-native application development. You excel at:

- SolidJS and modern frontend frameworks
- TypeScript and type-safe development
- API design and microservices architecture
- Database design and optimization
- Authentication and authorization systems
- Real-time features and WebSocket implementation
- Performance optimization and caching strategies

Generate clean, maintainable, and well-documented code following industry best practices.`
};

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  try {
    // Verify authentication
    const authHeader = getHeader(event, 'authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token, {
      issuer: `https://clerk.${process.env.CLERK_DOMAIN}`
    });

    if (!payload.sub) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      });
    }

    // Parse and validate request
    const body = await readBody(event);
    const validatedData = aiRequestSchema.parse(body);

    // Check user permissions and rate limits
    const userPermissions = await getUserPermissions(payload.sub);
    if (!userPermissions.includes('ai:access')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'AI access not available in your plan'
      });
    }

    // Rate limiting for AI calls
    const rateLimitKey = `ai:${payload.sub}:${new Date().toISOString().split('T')[0]}`;
    const currentUsage = await getAIUsage(rateLimitKey);
    const maxCalls = getUserAILimit(userPermissions);

    if (currentUsage >= maxCalls) {
      throw createError({
        statusCode: 429,
        statusMessage: `Daily AI limit reached (${maxCalls} calls). Upgrade your plan for more.`
      });
    }

    // Get or create conversation
    let conversation;
    if (validatedData.conversationId) {
      conversation = await getConversation(validatedData.conversationId, payload.sub);
      if (!conversation) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Conversation not found'
        });
      }
    } else {
      conversation = await createConversation(payload.sub, validatedData.context);
    }

    // Build context-aware system prompt
    const systemPrompt = SYSTEM_PROMPTS[validatedData.context] || SYSTEM_PROMPTS.infrastructure;
    
    // Prepare conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.messages.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: buildUserMessage(validatedData) }
    ];

    // Handle streaming response
    if (validatedData.streaming) {
      setHeader(event, 'Content-Type', 'text/stream');
      setHeader(event, 'Cache-Control', 'no-cache');
      setHeader(event, 'Connection', 'keep-alive');

      const stream = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages as any,
        stream: true,
        temperature: 0.1,
        max_tokens: 2000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      let fullResponse = '';
      
      // Start streaming response
      const encoder = new TextEncoder();
      const responseStream = new ReadableStream({
        async start(controller) {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'start',
              conversationId: conversation.id,
              timestamp: new Date().toISOString()
            })}\n\n`));

            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: 'content',
                  content: content
                })}\n\n`));
              }
            }

            // Save conversation and track usage
            await addMessageToConversation(conversation.id, {
              role: 'user',
              content: validatedData.message,
              timestamp: new Date()
            });

            await addMessageToConversation(conversation.id, {
              role: 'assistant',
              content: fullResponse,
              timestamp: new Date(),
              context: validatedData.context,
              tokens: estimateTokens(fullResponse)
            });

            await incrementAIUsage(rateLimitKey);
            await trackAIUsage({
              userId: payload.sub,
              context: validatedData.context,
              tokens: estimateTokens(fullResponse),
              conversationId: conversation.id
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'end',
              usage: {
                tokens: estimateTokens(fullResponse),
                remainingCalls: maxCalls - currentUsage - 1
              }
            })}\n\n`));

            controller.close();
          } catch (error) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'error',
              error: 'Stream processing failed'
            })}\n\n`));
            controller.close();
          }
        }
      });

      return responseStream;
    }

    // Non-streaming response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: 0.1,
      max_tokens: 2000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const responseContent = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens || estimateTokens(responseContent);

    // Save conversation
    await addMessageToConversation(conversation.id, {
      role: 'user',
      content: validatedData.message,
      timestamp: new Date()
    });

    await addMessageToConversation(conversation.id, {
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      context: validatedData.context,
      tokens: tokensUsed
    });

    // Track usage
    await incrementAIUsage(rateLimitKey);
    await trackAIUsage({
      userId: payload.sub,
      context: validatedData.context,
      tokens: tokensUsed,
      conversationId: conversation.id
    });

    return {
      success: true,
      data: {
        response: responseContent,
        conversationId: conversation.id,
        context: validatedData.context,
        usage: {
          tokens: tokensUsed,
          remainingCalls: maxCalls - currentUsage - 1
        },
        suggestions: generateFollowUpSuggestions(validatedData.context, responseContent)
      }
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request data',
        data: error.errors
      });
    }

    console.error('AI Assistant error:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'AI service temporarily unavailable'
    });
  }
});

// Helper functions
async function getUserPermissions(userId: string): Promise<string[]> {
  // Implement user permission lookup
  return ['ai:access', 'ai:advanced'];
}

function getUserAILimit(permissions: string[]): number {
  if (permissions.includes('ai:advanced')) return 1000;
  if (permissions.includes('ai:access')) return 100;
  return 0;
}

async function getAIUsage(key: string): Promise<number> {
  // Implement with Redis/KV
  return 0;
}

async function incrementAIUsage(key: string): Promise<void> {
  // Implement with Redis/KV
}

async function getConversation(id: string, userId: string): Promise<any> {
  // Implement conversation lookup
  return {
    id,
    userId,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function createConversation(userId: string, context: string): Promise<any> {
  const id = crypto.randomUUID();
  return {
    id,
    userId,
    context,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function addMessageToConversation(conversationId: string, message: any): Promise<void> {
  // Implement message storage
  console.log('Message added to conversation:', conversationId, message.role);
}

function buildUserMessage(data: any): string {
  let message = data.message;
  
  if (data.attachments?.length > 0) {
    message += '\n\nAttached files:\n';
    data.attachments.forEach((attachment: any) => {
      message += `\n${attachment.filename} (${attachment.type}):\n${attachment.content}\n`;
    });
  }
  
  if (data.preferences) {
    message += `\n\nPreferences: Cloud Provider: ${data.preferences.cloudProvider}, Infrastructure Tool: ${data.preferences.infraTool}, Orchestrator: ${data.preferences.orchestrator}`;
  }
  
  return message;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

async function trackAIUsage(data: any): Promise<void> {
  console.log('AI usage tracked:', data.userId, data.context, data.tokens);
}

function generateFollowUpSuggestions(context: string, response: string): string[] {
  const suggestions = {
    infrastructure: [
      'How can I optimize costs for this setup?',
      'What monitoring should I add?',
      'How do I implement auto-scaling?',
      'What security measures should I consider?'
    ],
    terraform: [
      'How do I manage state for this configuration?',
      'Can you create modules for reusability?',
      'How do I handle different environments?',
      'What validation rules should I add?'
    ],
    kubernetes: [
      'How do I set up monitoring for these resources?',
      'What RBAC policies do I need?',
      'How can I optimize resource usage?',
      'How do I implement blue-green deployments?'
    ]
  };
  
  return suggestions[context as keyof typeof suggestions] || suggestions.infrastructure;
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */