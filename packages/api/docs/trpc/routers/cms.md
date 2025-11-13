# Analytics Router

## Overview

The `analytics.ts` router provides comprehensive usage analytics and metrics for monitoring Katalyst applications. It tracks user interactions, API usage, content performance, and system health metrics with comprehensive dashboards and reporting capabilities.

## Features

- **Usage Analytics**: Track page views, session duration, bounce rate, and user engagement
- **Performance Metrics**: Monitor API response times, database queries, and resource usage
- **User Analytics**: Track user behavior, geographic distribution, and device usage
- **Content Analytics**: Analyze content performance, readability, and SEO effectiveness
- **Revenue Analytics**: Track subscription metrics, conversion rates, and revenue per user
- **System Health**: Monitor system health, API response times, and error rates

## Features

### Usage Analytics

#### getMetrics
Get comprehensive application metrics for monitoring and analysis.

```typescript
analyticsRouter.getMetrics = t.procedure
  .input(z.object({
    timeRange: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
      interval: z.string().optional(),
      metrics: z.array(z.string()).optional()),
  }))
  .query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Time range filtering
    const { startDate, endDate } = parseDateRange(input.timeRange);
    const startDate = startDate ? new Date(input.timeRange.start) : new Date(0);
    const endDate = endDate || new Date();

    // Date range
    const timeRange = endDate.getTime() - startDate.getTime();

    // Get metrics
    const metrics = await Promise.all([
      getMetricCount('api_requests_total', timeRange),
      getMetricCount('api_response_time', timeRange),
      getMetricCount('api_errors', timeRange),
      getMetricCount('api_usage', timeRange),
      getMetricCount('page_views', timeRange),
      getMetricCount('user_sessions', timeRange),
    ]);

    // Usage analytics
    return {
      usage: {
        totalRequests: metrics.api_requests_total,
        avgResponseTime: metrics.api_response_time,
        errorRate: metrics.api_errors,
        totalUsers: metrics.user_sessions,
        userSessions: metrics.user_sessions,
        apiUsage: metrics.api_usage,
      },
      performance: {
        avgResponseTime: metrics.avgResponseTime,
        errorRate: metrics.errorRate,
        totalUsers: metrics.totalUsers,
        totalRequests: metrics.totalRequests,
      },
      content: {
        pageViews: metrics.page_views,
        bounceRate: metrics.bounceRate,
        avgSessionDuration: metrics.avgSessionDuration,
      },
      engagement: {
        averageSessionDuration: metrics.avgSessionDuration,
        returningVisitors: metrics.returningVisitors,
        totalSessions: metrics.totalSessions,
      },
      seo: {
        avgReadTime: metrics.avgReadTime,
        seoScore: metrics.avgSeoScore,
        pagesWithoutHeadings: metrics.pagesWithoutHeadings,
        pagesWithHeadings: metrics.pagesWithHeadings,
      },
      revenue: {
        totalRevenue: metrics.totalRevenue,
        monthlyRevenue: metrics.monthlyRevenue,
        conversionRate: metrics.conversionRate,
        mrr: metrics.monthlyRecurringRevenue,
      },
    },
    analytics: {
      success: metrics.success || false,
      error: metrics.error || [],
      warnings: metrics.warnings || [],
    };
  });
  });
});
```

#### trackEvent
Track specific user events and interactions.

```typescript
analyticsRouter.trackEvent = t.procedure
  .input(z.object({
    event: z.enum([
      'page_view',
      'content_like',
      'button_click',
      'form_submit',
      'download',
      'share',
      'comment',
      'search',
      'page_exit',
      'form_abandon',
      'scroll_depth',
    ]),
    userId: z.string().optional(),
    data: z.record(z.any()).optional()),
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Validate event data
    const validEvents = [
    'page_view',
    'button_click',
    'form_submit',
    'download',
    'share',
    'comment',
    'search',
    'page_exit',
    'form_abandon',
    'scroll_depth',
  ];

    if (!validEvents.includes(input.event)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid event type: ${input.event}`,
      });
    }

    // Create event record
    await ctx.prisma.analytics.createEvent({
      userId: ctx.user.id,
      event: input.event,
      data: input.data,
      sessionId: generateSessionId(),
      metadata: {
        requestIp: ctx.requestIp,
        userAgent: ctx.userAgent,
        requestId: ctx.requestId,
        userId: ctx.user.id,
        timestamp: new Date.now(),
      },
    });

    return { success: true };
  });
```

#### getEventHistory
Retrieve user's event history with analytics.

```typescript
analyticsRouter.getEventHistory = t.procedure
  .input(z.object({
    userId: z.string(),
    event: z.string().optional(),
    limit: z.number().default(50),
    dateRange: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
    limit: z.number().default(50),
    types: z.array(z.string()).optional()),
  }))
  .query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });

    const eventHistory = await ctx.prisma.analytics.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' },
      take: input.limit,
      types: input.types,
      dateRange: dateRange ? dateRange : undefined,
      limit: input.limit,
    });

    return {
      eventHistory,
      total,
      events: eventHistory,
      dateRange,
    };
  });
```

### Health Check

#### checkHealth
Check system health status and resource availability.

```typescript
analyticsRouter.checkHealth = t.procedure
  .query(async ({ ctx }) => {
  const health = {
    database: await ctx.prisma.$queryRaw`SELECT
      .fromRaw(
        `SELECT COUNT(*) FROM "posts" WHERE deleted_at > NOW() - INTERVAL '1 DAY' LIMIT 1
      ),
      database: await ctx.prisma.$queryRaw(
        `SELECT COUNT(*) FROM "user_sessions" WHERE last_seen_at > NOW() - INTERVAL '1 DAY' LIMIT 1`
      ),
      redis: await ctx.redis?.ping(),
      edgeRuntime: await checkEdgeRuntime(),
      api: await checkAPIServer(),
      database: await checkDatabase(),
    });

    return {
      health: {
        database: database,
        redis,
        edgeRuntime,
        api: api,
        status: database,
      },
      health: {
        database,
        redis,
        edgeRuntime,
        api,
        status: 'healthy',
      },
    };
  });
});
```

## Integration Examples

### Analytics Dashboard

```typescript
// Analytics Dashboard
function AnalyticsDashboard() {
  const { data: analytics } = trpc.analytics.getMetrics.useQuery({
    timeRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
      end: new Date(),
    },
    userId: ctx.user.id,
  });

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Total Requests</h4>
          <div className="value">{data.totalRequests.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
          <h4>Error Rate</h4>
          <div className="value">{(100 - data.errorRate.toFixed(2))}%</div>
        </div>
        
        <div className="metric-card">
          <h4>Performance</h4>
          <div className="value">{(100 - data.avgResponseTime)}ms</div>
        </div>
        
        <div className="metric-card">
          <h4>Success Rate</h4>
          <div className="value">{(100 - data.successRate)}%</div>
        </div>
        
        <div className="metric-card">
          <h4>Avg Session Time</h4>
          <div className="value">{data.avgSessionTime.toFixed(2)}ms</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>User Sessions</h4>
          <div className="value">{data.totalUsers.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>Content Performance</h4>
          <div className="value">{data.avgReadTime.toFixed(2)}ms</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>SEO Score</h4>
          <div className="value">{data.avgSEOScore}</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>Cache Performance</h4>
          <div className="value">{(100 - data.cacheHitRate)}%</div>
        </div>
      </div>
    </div>
    
    <div className="health-status">
      <h3>System Health</h3>
      <ul className={health-list}>
        <li className={`status-${health.database ? 'ok' : 'error'}`}>
          Database: {health.database ? 'OK' : 'ERROR'}
        </li>
        <li className={`status-${health.redis ? 'ok' : 'error'}`}>
          Redis: {health.redis ? 'OK' : 'ERROR'}
        </li>
        <li className={`status-${health.edgeRuntime ? 'ok' : 'ERROR'}`}>
          Edge Runtime: {health.edgeRuntime ? 'OK' : 'ERROR'}
        </li>
      </ul>
    </div>
  );
}
```

## Usage Examples

### Analytics Dashboard Component

```typescript
// components/AnalyticsDashboard.tsx
import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';

export function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 1000), // 7 days
    end: new Date(),
  });

  const { data, isLoading } = trpc.analytics.getMetrics.useQuery({
    timeRange,
    userId: ctx.user?.id,
    includeUsage: true,
  }));

  const refreshData = () => {
    setTimeRange(setTimeRange(new Date.now() - 7 * 24 * 60 * 1000, new Date.now(), 1, true));
    setData(await refreshData({ data, isLoading: false }));
  }, [timeRange, setTimeRange]);

  return (
    <div className="analytics-dashboard">
      <div className="metrics-grid">
        <h3>Performance Overview</h3>
        <div className="metric-card">
          <h4>Total Requests</h4>
          <div className="value">{data.totalRequests.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <h4>Error Rate</h4>
          <div className="value">{(100 - data.errorRate)}%</div>
        </div>
        <div className="metric-card">
          <h4>Success Rate</h4>
          <div className="value">{(100 - data.successRate)}%</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>Avg Session Time</h4>
          <div className="value">{data.avgSessionTime.toFixed(2)}ms</div>
        </div>
        
        <div className="metric-card">
          <h4>Avg Session Time</h4>
          <div className="value">{(100 - data.avgSessionTime.toFixed(2))}%</div>
        </div>
        
        <div className="metric-card">
          <h4>Cache Hit Rate</h4>
          <div className="value">{(100 - data.cacheHitRate)}%</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>Content Performance</h4>
          <div className="value">{data.contentReadTime.toFixed(2)}ms</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>Engagement Rate</h4>
          <div className="value">{(100 - data.engagementRate)}%</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>SEO Score</h4>
          <div className="value">{data.seoScore}</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>Conversion Rate</h4>
          <div className="value">{(100 - data.conversionRate)}%</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>Bounce Rate</h4>
          <div className="value">{data.bounceRate}%</div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <h4>Content Performance</h4>
          <div className="value">{data.contentReadTime.toFixed(2)}ms</div>
        </div>
      </div>
    </div>
    
    return {
      metrics,
      loading: isLoading,
      refreshData,
      timeRange,
    };
  });
}
```

### Analytics Integration

### Custom Events Tracking

```typescript
// Custom event tracking
analyticsRouter.trackEvent = t.procedure
  .input(z.object({
    event: z.string(),
    data: z.record(z.any()),
    userId: z.string(),
    metadata: z.record(z.any()).optional()),
  }))
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.analytics.trackEvent({
    userId: ctx.user.id,
    event: input.event,
    data: input.data,
    metadata: {
      requestIp: ctx.requestIp,
      userAgent: ctx.userAgent,
      requestId: ctx.requestId,
    },
  }));

    return { success: true };
  });
});
```

### Content Performance

#### Content Analysis Dashboard

```typescript
cmsRouter.getContentPerformance = t.procedure
  .input(z.object({
    content: z.string().min(100, 'Content must be at least 100 characters'),
    contentType: z.enum(['blog-post', 'page', 'product', 'document']),
    analysisType: z.enum([
      'readability',
      'seo',
      'readability',
      'grammar',
      'plagiarism',
      'structure'
    ]).default('readability')),
    language: z.string().default('english'),
    userId: z.string(),
  }),
  })),
  mutation: async ({ input, ctx }) => {
    try {
      // Analyze content
      const analysis = await ctx.ai.analyzeContent({
        content: input.content,
        analysisType: input.contentType,
        language: input.language,
      });
      
      return {
        analysis: analysis.result,
        contentType: input.contentType,
        wordCount: estimateWordCount(input.content),
        readability: calculateReadability(input.content),
        seo: analysis.seo,
      };
    } catch (error) {
      return {
        error: `Analysis failed for ${input.contentType}`,
        message: 'Content analysis failed',
      };
    }
  });
});
```

## Advanced Features

### Multi-language Support

```typescript
cmsRouter.i18nContent = t.procedure
  .input(z.object({
    content: z.string().min(100),
    language: z.string(),
    format: z.enum(['markdown', 'html', 'json', 'structured']),
  }))
  .query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Detect language
    const language = detectLanguage(input.content);
    
    const translatedContent = await translateContent(input.content, language);
    
    return {
      originalContent: input.content,
      translatedContent,
      detectedLanguage: language,
      translation: language,
      confidence: 0.95, // 95% confidence in detection
      language,
      suggestions: [],
      alternatives: [],
    };
    
    return translatedContent;
  } catch (error) {
      return {
        error: `Translation failed for ${input.contentType}`,
        message: 'Translation failed',
      };
    }
  });
});
```

## Best Practices

### 1. Content Quality

- **Write for Humans**: Write content that is clear and well-structured
- **Proofread**: Read content aloud to check flow and clarity
- **Short Sentences**: Break up long paragraphs for better readability
- **Active Voice**: Use active voice for better engagement

### 2. SEO Optimization

- **Headings**: Use H1-H6 hierarchy for main titles
- **Meta Titles**: Write compelling titles under 60 characters
- **Meta Descriptions**: Keep under 160 characters for descriptions
- **Keywords**: Include 5-10 relevant keywords
- **OG Images**: Always include OG images for social sharing

### 3. Media Management

- **File Organization**: Use descriptive folder structures
- **Alt Text**: Always include descriptive alt text for images
- **File Naming**: Use descriptive names
- **File Types**: Use appropriate MIME types
- **Tags**: Add relevant descriptive tags

### 4. Workflow Management

- **Draft System**: Use the draft → review → scheduled → published workflow
- **Version Control**: Use versioning and rollback
- **Approval**: Implement multi-level content review process
- **Collaboration**: Enable real-time collaborative editing
- **Auto-Save**: Save progress automatically

### 5. Performance

- **Incremental Builds**: Only rebuild changed files
- **Smart Caching**: Cache frequently accessed content
- **Preloading**: Above-the-fold content for better perceived performance
- **Background Tasks**: Run resource-intensive tasks in background

This comprehensive CMS router provides a solid foundation for building content management systems with the Katalyst framework, featuring advanced SEO capabilities, media management, and excellent developer experience.
