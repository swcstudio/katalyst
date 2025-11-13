# Analytics Router

The Analytics Router provides comprehensive analytics and tracking capabilities for monitoring user behavior, engagement metrics, and conversion data throughout the Katalyst application.

## Overview

This router offers a complete analytics solution with features for:
- Page view tracking and analysis
- User engagement metrics
- Conversion tracking and reporting
- Real-time user monitoring
- Custom event tracking
- Content performance analysis

## Features

### Page Views Analytics
Track and analyze page views with flexible date ranges and grouping options.

### User Engagement Metrics
Monitor user behavior patterns including session duration, bounce rates, and user retention.

### Conversion Tracking
Track various conversion types and measure business impact.

### Real-time Monitoring
Monitor active users and page activity in real-time.

### Custom Event Tracking
Track custom business events and user interactions.

### Content Performance
Analyze top-performing content across different types.

## API Procedures

### `pageViews`
**Type**: Protected Query  
**Description**: Retrieve page view analytics data with flexible grouping options.

**Input Schema**:
```typescript
{
  dateRange: {
    startDate: string | Date,
    endDate: string | Date,
  },
  groupBy: 'day' | 'week' | 'month' // default: 'day'
}
```

**Response**:
```typescript
{
  data: Array<{
    date: string,
    views: number,
    uniqueVisitors: number,
  }>,
  total: number,
  uniqueTotal: number,
}
```

**Usage Example**:
```typescript
// Get daily page views for the last week
const analytics = await trpc.analytics.pageViews.query({
  dateRange: {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  groupBy: 'day'
});

// Get monthly page views for the last year
const monthlyViews = await trpc.analytics.pageViews.query({
  dateRange: {
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  groupBy: 'month'
});
```

### `engagement`
**Type**: Protected Query  
**Description**: Retrieve user engagement metrics and behavioral data.

**Input Schema**:
```typescript
{
  startDate: string | Date,
  endDate: string | Date,
}
```

**Response**:
```typescript
{
  averageSessionDuration: number, // seconds
  bounceRate: number, // 0-1
  pagePerSession: number,
  newUsers: number,
  returningUsers: number,
}
```

**Usage Example**:
```typescript
// Get engagement metrics for last month
const engagement = await trpc.analytics.engagement.query({
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  }
});

console.log(`Average session: ${engagement.averageSessionDuration}s`);
console.log(`Bounce rate: ${(engagement.bounceRate * 100).toFixed(1)}%`);
```

### `conversions`
**Type**: Protected Query  
**Description**: Retrieve conversion metrics for different conversion types.

**Input Schema**:
```typescript
{
  dateRange: {
    startDate: string | Date,
    endDate: string | Date,
  },
  conversionType?: 'signup' | 'purchase' | 'download' | 'contact'
}
```

**Response**:
```typescript
{
  conversions: Array<{
    type: string,
    count: number,
    rate: number, // conversion rate
    value: number | null, // monetary value for purchases
  }>,
  totalConversions: number,
  totalValue: number,
}
```

**Usage Example**:
```typescript
// Get all conversion metrics
const allConversions = await trpc.analytics.conversions.query({
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  }
});

// Get only purchase conversions
const purchaseConversions = await trpc.analytics.conversions.query({
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  conversionType: 'purchase'
});
```

### `activeUsers`
**Type**: Public Query  
**Description**: Get real-time and recent user activity data.

**Input**: None

**Response**:
```typescript
{
  current: number, // currently active users
  lastHour: number, // users in last hour
  last24Hours: number, // users in last 24 hours
  byPage: Array<{
    page: string,
    users: number,
  }>
}
```

**Usage Example**:
```typescript
// Get real-time user activity
const activeUsers = await trpc.analytics.activeUsers.query();

console.log(`Currently active: ${activeUsers.current}`);
console.log(`Active last hour: ${activeUsers.lastHour}`);

// Show top pages
activeUsers.byPage.forEach(page => {
  console.log(`${page.page}: ${page.users} users`);
});
```

### `trackEvent`
**Type**: Public Mutation  
**Description**: Track custom events and user interactions.

**Input Schema**:
```typescript
{
  eventName: string,
  eventData?: Record<string, any>,
  userId?: string,
  sessionId?: string,
}
```

**Response**:
```typescript
{
  success: boolean,
  eventId: string,
  timestamp: Date,
}
```

**Usage Example**:
```typescript
// Track button click
const trackResult = await trpc.analytics.trackEvent.mutate({
  eventName: 'button_click',
  eventData: {
    buttonId: 'subscribe-newsletter',
    page: '/blog/post-123',
    position: 'header'
  },
  userId: 'user-123'
});

// Track form submission
await trpc.analytics.trackEvent.mutate({
  eventName: 'form_submission',
  eventData: {
    formType: 'contact',
    formId: 'contact-form',
    completionTime: 45 // seconds
  }
});

// Track purchase event
await trpc.analytics.trackEvent.mutate({
  eventName: 'purchase_completed',
  eventData: {
    productId: 'product-456',
    price: 99.99,
    currency: 'USD',
    category: 'electronics'
  },
  userId: 'user-123'
});
```

### `topContent`
**Type**: Protected Query  
**Description**: Retrieve top-performing content sorted by engagement.

**Input Schema**:
```typescript
{
  dateRange: {
    startDate: string | Date,
    endDate: string | Date,
  },
  limit?: number, // 1-50, default: 10
  contentType?: 'posts' | 'products' | 'pages'
}
```

**Response**:
```typescript
{
  content: Array<{
    id: string,
    title: string,
    type: string,
    views: number,
    engagement: number, // 0-1
    conversionRate: number, // 0-1
  }>
}
```

**Usage Example**:
```typescript
// Get top 10 posts from last month
const topPosts = await trpc.analytics.topContent.query({
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  limit: 10,
  contentType: 'posts'
});

// Get top 20 products overall
const topProducts = await trpc.analytics.topContent.query({
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  limit: 20,
  contentType: 'products'
});

// Display top content
topPosts.content.forEach((post, index) => {
  console.log(`${index + 1}. ${post.title}`);
  console.log(`   Views: ${post.views.toLocaleString()}`);
  console.log(`   Engagement: ${(post.engagement * 100).toFixed(1)}%`);
  console.log(`   Conversion Rate: ${(post.conversionRate * 100).toFixed(1)}%`);
});
```

## Integration Examples

### React Component for Analytics Dashboard
```typescript
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-picker';

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  const { data: pageViews } = trpc.analytics.pageViews.useQuery({
    dateRange,
    groupBy: 'day'
  });

  const { data: engagement } = trpc.analytics.engagement.useQuery({
    dateRange,
  });

  const { data: conversions } = trpc.analytics.conversions.useQuery({
    dateRange,
  });

  const { data: activeUsers } = trpc.analytics.activeUsers.useQuery();

  return (
    <div className="analytics-dashboard">
      <div className="controls">
        <DateRangePicker 
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Page Views</h3>
          <div className="metric-value">
            {pageViews?.total.toLocaleString()}
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Avg Session Duration</h3>
          <div className="metric-value">
            {engagement?.averageSessionDuration}s
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Total Conversions</h3>
          <div className="metric-value">
            {conversions?.totalConversions}
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Active Users</h3>
          <div className="metric-value">
            {activeUsers?.current}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Event Tracking Hook
```typescript
import { trpc } from '@/utils/trpc';

export function useAnalyticsTracking() {
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  const trackButtonClick = (buttonId: string, additionalData?: any) => {
    return trackEvent.mutateAsync({
      eventName: 'button_click',
      eventData: {
        buttonId,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        ...additionalData
      }
    });
  };

  const trackPageView = (path?: string) => {
    return trackEvent.mutateAsync({
      eventName: 'page_view',
      eventData: {
        page: path || window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    });
  };

  const trackFormSubmission = (formData: any, formType: string) => {
    return trackEvent.mutateAsync({
      eventName: 'form_submission',
      eventData: {
        formType,
        formData,
        completionTime: Date.now()
      }
    });
  };

  return {
    trackButtonClick,
    trackPageView,
    trackFormSubmission,
    trackEvent: trackEvent.mutateAsync
  };
}
```

## Best Practices

### Event Naming
- Use consistent naming conventions (snake_case or camelCase)
- Be descriptive but concise
- Group related events with prefixes (e.g., `button_click`, `form_submit`, `purchase_`)

### Data Structure
- Include relevant context in event data
- Avoid sensitive information
- Keep data structures consistent

### Performance
- Batch events when possible
- Use async tracking for better performance
- Implement fallback tracking for offline scenarios

### Privacy
- Follow privacy regulations (GDPR, CCPA)
- Allow users to opt-out of tracking
- Anonymize sensitive data

## Error Handling

The analytics router includes comprehensive error handling:

```typescript
try {
  const result = await trpc.analytics.pageViews.query({
    dateRange: { startDate, endDate }
  });
} catch (error) {
  if (error.data?.code === 'UNAUTHORIZED') {
    // Handle authentication error
  } else if (error.data?.code === 'BAD_REQUEST') {
    // Handle invalid input
  } else {
    // Handle other errors
  }
}
```

## Security Considerations

- Protected procedures require authentication
- Input validation prevents injection attacks
- Rate limiting prevents abuse
- Data anonymization protects user privacy

## Integration with tRPC

The analytics router integrates seamlessly with the tRPC system:

```typescript
// In your main tRPC router
export const appRouter = router({
  analytics: analyticsRouter,
  auth: authRouter,
  // ... other routers
});

export type AppRouter = typeof appRouter;
```

This provides type-safe access to all analytics procedures throughout your application.
