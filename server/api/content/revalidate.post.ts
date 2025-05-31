import { defineEventHandler, readBody, createError, setHeader, getHeader, getClientIP } from 'h3';
import type { RevalidateRequest, RevalidateResponse } from '@sse/types';

// Revalidation configurations for different content types
const REVALIDATION_CONFIGS = {
  'documentation': {
    interval: 30 * 60, // 30 minutes in seconds
    paths: ['/docs/**', '/api-reference/**', '/guides/**'],
    tags: ['docs', 'api-docs', 'guides'],
    priority: 'high',
  },
  'marketing': {
    interval: 3 * 60 * 60, // 3 hours in seconds
    paths: ['/', '/about', '/contact', '/features', '/pricing'],
    tags: ['marketing', 'homepage', 'landing'],
    priority: 'medium',
  },
  'storefront': {
    interval: 3 * 60 * 60, // 3 hours in seconds
    paths: ['/store/**', '/products/**', '/cart', '/checkout'],
    tags: ['storefront', 'products', 'e-commerce'],
    priority: 'medium',
  },
  'blog': {
    interval: 60 * 60, // 1 hour in seconds
    paths: ['/blog/**', '/posts/**'],
    tags: ['blog', 'posts', 'articles'],
    priority: 'low',
  },
} as const;

// Rate limiting map (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Revalidation queue for batch processing
const revalidationQueue = new Map<string, { timestamp: number; priority: string }>();

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  try {
    const clientIP = getClientIP(event);
    const userAgent = getHeader(event, 'user-agent') || '';
    const authHeader = getHeader(event, 'authorization');
    const webhookSignature = getHeader(event, 'x-webhook-signature');
    
    // Authenticate request
    if (!authenticateRequest(authHeader, webhookSignature)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Invalid API key or webhook signature',
      });
    }

    // Rate limiting: 50 revalidation requests per hour per IP
    const now = Date.now();
    const rateLimit = rateLimitMap.get(clientIP);
    
    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= 50) {
          throw createError({
            statusCode: 429,
            statusMessage: 'Rate limit exceeded. Maximum 50 revalidation requests per hour.',
          });
        }
        rateLimit.count++;
      } else {
        rateLimit.count = 1;
        rateLimit.resetTime = now + (60 * 60 * 1000); // 1 hour
      }
    } else {
      rateLimitMap.set(clientIP, {
        count: 1,
        resetTime: now + (60 * 60 * 1000),
      });
    }

    const body: RevalidateRequest = await readBody(event);
    
    // Validate request body
    if (!body.type && !body.paths && !body.tags) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Must specify either type, paths, or tags for revalidation',
      });
    }

    // Validate content type if provided
    if (body.type && !REVALIDATION_CONFIGS[body.type as keyof typeof REVALIDATION_CONFIGS]) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid content type. Valid types: documentation, marketing, storefront, blog',
      });
    }

    // Validate paths format
    if (body.paths && Array.isArray(body.paths)) {
      for (const path of body.paths) {
        if (typeof path !== 'string' || !path.startsWith('/')) {
          throw createError({
            statusCode: 400,
            statusMessage: 'All paths must be strings starting with /',
          });
        }
      }
    }

    // Determine revalidation strategy
    let pathsToRevalidate: string[] = [];
    let tagsToRevalidate: string[] = [];
    let priority = 'medium';

    if (body.type) {
      const config = REVALIDATION_CONFIGS[body.type as keyof typeof REVALIDATION_CONFIGS];
      pathsToRevalidate = config.paths;
      tagsToRevalidate = config.tags;
      priority = config.priority;
    }

    if (body.paths) {
      pathsToRevalidate = [...pathsToRevalidate, ...body.paths];
    }

    if (body.tags) {
      tagsToRevalidate = [...tagsToRevalidate, ...body.tags];
    }

    // Remove duplicates
    pathsToRevalidate = [...new Set(pathsToRevalidate)];
    tagsToRevalidate = [...new Set(tagsToRevalidate)];

    // Check if it's a scheduled revalidation
    const isScheduled = body.source === 'cron' || body.source === 'scheduled';
    
    // For Vercel deployment, use the revalidate function
    const revalidationResults = await performRevalidation({
      paths: pathsToRevalidate,
      tags: tagsToRevalidate,
      priority,
      reason: body.reason || 'Manual revalidation',
      source: body.source || 'api',
      isScheduled,
    });

    // Log revalidation event
    console.info('Content revalidation completed:', {
      type: body.type,
      pathsCount: pathsToRevalidate.length,
      tagsCount: tagsToRevalidate.length,
      priority,
      source: body.source,
      timestamp: new Date().toISOString(),
      ip: clientIP,
      success: revalidationResults.success,
      errors: revalidationResults.errors.length,
    });

    // Store revalidation history (for analytics)
    try {
      await storeRevalidationHistory({
        type: body.type,
        paths: pathsToRevalidate,
        tags: tagsToRevalidate,
        results: revalidationResults,
        metadata: {
          ip: clientIP,
          userAgent,
          timestamp: new Date().toISOString(),
          source: body.source || 'api',
        },
      });
    } catch (historyError) {
      console.error('Failed to store revalidation history:', historyError);
      // Don't fail the request if history storage fails
    }

    const response: RevalidateResponse = {
      success: true,
      message: 'Content revalidation completed successfully',
      revalidated: {
        paths: revalidationResults.paths,
        tags: revalidationResults.tags,
        timestamp: new Date().toISOString(),
      },
      stats: {
        pathsProcessed: pathsToRevalidate.length,
        tagsProcessed: tagsToRevalidate.length,
        successfulPaths: revalidationResults.paths.length,
        failedPaths: revalidationResults.errors.length,
        processingTime: revalidationResults.processingTime,
      },
      errors: revalidationResults.errors,
      nextScheduledRevalidation: calculateNextRevalidation(body.type),
    };

    // Set CORS headers
    setHeader(event, 'Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate');

    return response;

  } catch (error: any) {
    console.error('Revalidation error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: getHeader(event, 'user-agent'),
      ip: getClientIP(event),
    });

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during revalidation',
    });
  }
});

// Authentication helper
function authenticateRequest(authHeader: string | undefined, webhookSignature: string | undefined): boolean {
  // Check API key authentication
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const validApiKeys = [
      process.env.REVALIDATION_API_KEY,
      process.env.CMS_WEBHOOK_KEY,
      process.env.VERCEL_REVALIDATION_KEY,
    ].filter(Boolean);
    
    if (validApiKeys.includes(token)) {
      return true;
    }
  }

  // Check webhook signature (for CMS webhooks)
  if (webhookSignature) {
    const expectedSignature = process.env.WEBHOOK_SECRET;
    if (expectedSignature && webhookSignature === expectedSignature) {
      return true;
    }
  }

  // Allow localhost in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return false;
}

// Main revalidation function
async function performRevalidation(params: {
  paths: string[];
  tags: string[];
  priority: string;
  reason: string;
  source: string;
  isScheduled: boolean;
}) {
  const startTime = Date.now();
  const revalidatedPaths: string[] = [];
  const revalidatedTags: string[] = [];
  const errors: Array<{ path?: string; tag?: string; error: string }> = [];

  // Revalidate by paths
  for (const path of params.paths) {
    try {
      // In Vercel, you would use: await revalidatePath(path)
      // For now, we'll simulate the revalidation
      await simulateRevalidation(path, 'path');
      revalidatedPaths.push(path);
    } catch (error: any) {
      errors.push({
        path,
        error: error.message || 'Unknown error',
      });
    }
  }

  // Revalidate by tags
  for (const tag of params.tags) {
    try {
      // In Vercel, you would use: await revalidateTag(tag)
      // For now, we'll simulate the revalidation
      await simulateRevalidation(tag, 'tag');
      revalidatedTags.push(tag);
    } catch (error: any) {
      errors.push({
        tag,
        error: error.message || 'Unknown error',
      });
    }
  }

  const processingTime = Date.now() - startTime;

  return {
    success: errors.length === 0,
    paths: revalidatedPaths,
    tags: revalidatedTags,
    errors,
    processingTime,
  };
}

// Simulate revalidation (replace with actual Vercel functions)
async function simulateRevalidation(target: string, type: 'path' | 'tag'): Promise<void> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));

  // In production, this would be:
  // if (type === 'path') {
  //   await revalidatePath(target);
  // } else {
  //   await revalidateTag(target);
  // }

  // For now, just log the action
  console.debug(`Revalidated ${type}: ${target}`);
}

// Store revalidation history for analytics
async function storeRevalidationHistory(data: any): Promise<void> {
  // In production, store in your database
  // await db.revalidationHistory.create({ data });
  
  // For now, just log
  console.debug('Revalidation history stored:', {
    type: data.type,
    pathsCount: data.paths.length,
    tagsCount: data.tags.length,
    timestamp: data.metadata.timestamp,
  });
}

// Calculate next scheduled revalidation time
function calculateNextRevalidation(contentType?: string): string | null {
  if (!contentType) return null;

  const config = REVALIDATION_CONFIGS[contentType as keyof typeof REVALIDATION_CONFIGS];
  if (!config) return null;

  const nextTime = new Date(Date.now() + config.interval * 1000);
  return nextTime.toISOString();
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License Agreement.
 */