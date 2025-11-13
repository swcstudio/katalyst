# Katalyst Membership API Documentation

## Overview

The Katalyst Membership API provides comprehensive subscription and membership management capabilities for modern web applications. Built with tRPC and TypeScript, it offers type-safe subscription management with support for multiple pricing tiers, billing cycles, and member benefits.

## Features

- **Flexible Plans & Pricing**: Create custom subscription plans with multiple intervals
- **Trial Management**: Configurable trial periods and conditions
- **Member Limits**: granular control over resource usage and limits
- **Payment Integration**: Stripe and Paddle payment provider support
- **Subscription Lifecycle**: Complete subscription management from creation to cancellation
- **Member Analytics**: Comprehensive usage and revenue analytics
- **Member Benefits**: Configurable benefits and feature access control
- **Grace Periods**: Configurable grace periods for failed payments

## API Reference

### Plan Management

#### Create Subscription Plan

```typescript
mutation {
  createPlan({
    name: "Professional",
    description: "Perfect for growing businesses and teams",
    price: 29.99,
    currency: "USD",
    interval: "monthly",
    intervalCount: 1,
    trialDays: 14,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "Team collaboration"
    ],
    limits: {
      members: 10,
      storage: 100, // GB
      bandwidth: 1000, // GB
      apiCalls: 100000,
      customLimits: {
        projects: 50,
        reports: 100,
        exports: 1000
      }
    },
    metadata: {
      tier: "professional",
      targetAudience: "businesses",
      supportLevel: "priority"
    },
    stripePriceId: "price_1N2xYZ2eZvKYlo2C",
    paddlePriceId: "pri_1k2j3h4l5m6n7o8p"
  })
}
```

#### Create Annual Plan

```typescript
mutation {
  createPlan({
    name: "Enterprise Annual",
    description: "Complete solution for large organizations",
    price: 299.99,
    currency: "USD",
    interval: "yearly",
    intervalCount: 1,
    trialDays: 30,
    features: [
      "Everything in Professional",
      "Unlimited everything",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom training",
      "On-premise deployment"
    ],
    limits: {
      members: -1, // Unlimited
      storage: -1, // Unlimited
      bandwidth: -1, // Unlimited
      apiCalls: -1, // Unlimited
      customLimits: {
        projects: -1,
        reports: -1,
        exports: -1
      }
    },
    metadata: {
      tier: "enterprise",
      targetAudience: "enterprise",
      supportLevel: "dedicated"
    },
    stripePriceId: "price_1N2xYZ2eZvKYlo2C_annual",
    paddlePriceId: "pri_1k2j3h4l5m6n7o8p_annual"
  })
}
```

### Subscription Management

#### Create Subscription

```typescript
mutation {
  createSubscription({
    planId: "plan-pro-monthly",
    memberId: "member-123",
    paymentMethodId: "pm_123456789",
    trialPeriodDays: 14,
    metadata: {
      source: "website",
      campaign: "spring2024",
      referralCode: "FRIEND20"
    },
    billingInfo: {
      name: "John Doe",
      email: "john@company.com",
      address: {
        line1: "123 Business St",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "US"
      }
    }
  })
}
```

#### Update Subscription

```typescript
mutation {
  updateSubscription({
    subscriptionId: "sub_123456789",
    planId: "plan-enterprise-yearly", // Upgrade plan
    prorationBehavior: "create_prorations",
    billingCycleAnchor: "immediate", // Charge immediately
    metadata: {
      upgradeReason: "team_expansion",
      requestedBy: "admin"
    }
  })
}
```

#### Cancel Subscription

```typescript
mutation {
  cancelSubscription({
    subscriptionId: "sub_123456789",
    cancellationReason: "business_closure",
    immediate: false, // Cancel at period end
    retainAccess: true, // Keep access until period ends
    feedback: {
      reason: "price",
      comments: "Looking for more affordable solution",
      wouldReturn: true,
      pricePoint: 20.00
    }
  })
}
```

### Member Management

#### Get Member Details

```typescript
query {
  getMember({
    memberId: "member-123",
    includeUsage: true,
    includeBilling: true,
    includeHistory: true
  })
}
```

#### Update Member Information

```typescript
mutation {
  updateMember({
    memberId: "member-123",
    data: {
      contactInfo: {
        email: "newemail@company.com",
        phone: "+1-555-0123",
        timezone: "America/New_York"
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        billingDayOfMonth: 1
      },
      metadata: {
        department: "Engineering",
        role: "CTO",
        teamSize: 25
      }
    }
  })
}
```

### Usage & Limits

#### Check Member Usage

```typescript
query {
  getMemberUsage({
    memberId: "member-123",
    period: {
      start: "2024-01-01",
      end: "2024-01-31"
    },
    metrics: [
      "storage",
      "bandwidth",
      "apiCalls",
      "projects",
      "reports"
    ]
  })
}
```

#### Update Member Limits

```typescript
mutation {
  updateMemberLimits({
    memberId: "member-123",
    limits: {
      storage: 200, // Increase from 100GB to 200GB
      apiCalls: 150000, // Increase API calls
      customLimits: {
        projects: 100, // Increase project limit
        teamMembers: 15 // Increase team member limit
      }
    },
    reason: "plan_upgrade",
    effectiveDate: "2024-02-01"
  })
}
```

### Billing & Invoicing

#### Get Upcoming Invoice

```typescript
query {
  getUpcomingInvoice({
    subscriptionId: "sub_123456789",
    details: true
  })
}
```

#### Create Custom Invoice

```typescript
mutation {
  createInvoice({
    memberId: "member-123",
    items: [
      {
        description: "Additional Storage (50GB)",
        quantity: 1,
        unitPrice: 10.00,
        currency: "USD"
      },
      {
        description: "Premium Support",
        quantity: 1,
        unitPrice: 50.00,
        currency: "USD"
      }
    ],
    dueDate: "2024-02-15",
    metadata: {
      type: "add-on",
      approvedBy: "admin"
    }
  })
}
```

#### Apply Discount

```typescript
mutation {
  applyDiscount({
    subscriptionId: "sub_123456789",
    discount: {
      type: "percentage",
      value: 20, // 20% discount
      duration: "repeating",
      durationInMonths: 3,
      metadata: {
        code: "SPRING20",
        campaign: "spring_sale_2024"
      }
    }
  })
}
```

## Integration Examples

### React Membership Component

```typescript
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

function MembershipDashboard({ memberId }: { memberId: string }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const { data: member } = trpc.membership.getMember.useQuery(memberId);
  const { data: plans } = trpc.membership.getPlans.useQuery({ active: true });
  const { data: usage } = trpc.membership.getMemberUsage.useQuery({
    memberId,
    period: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      end: new Date().toISOString()
    }
  });

  const upgradeMutation = trpc.membership.updateSubscription.useMutation();
  const cancelMutation = trpc.membership.cancelSubscription.useMutation();

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    try {
      await upgradeMutation.mutateAsync({
        subscriptionId: member?.subscription?.id!,
        planId,
        prorationBehavior: "create_prorations"
      });
      
      // Refresh member data
      await member?.refetch();
      setSelectedPlan(null);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancel = async (reason: string, comments?: string) => {
    try {
      await cancelMutation.mutateAsync({
        subscriptionId: member?.subscription?.id!,
        cancellationReason: reason,
        immediate: false,
        feedback: { comments, reason }
      });
    } catch (error) {
      console.error('Cancellation failed:', error);
    }
  };

  const renderUsageProgress = (metric: string, current: number, limit: number) => {
    const percentage = limit > 0 ? (current / limit) * 100 : 0;
    const isOverLimit = limit > 0 && current > limit;
    
    return (
      <div key={metric} className="usage-metric">
        <div className="metric-header">
          <span className="metric-name">{metric}</span>
          <span className={`metric-value ${isOverLimit ? 'over-limit' : ''}`}>
            {current.toLocaleString()} / {limit === -1 ? 'Unlimited' : limit.toLocaleString()}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${isOverLimit ? 'over-limit' : ''}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="membership-dashboard">
      <div className="member-info">
        <h2>Membership Overview</h2>
        <div className="current-plan">
          <h3>Current Plan: {member?.subscription?.plan?.name}</h3>
          <p>Status: <span className={`status ${member?.subscription?.status}`}>
            {member?.subscription?.status}
          </span></p>
          <p>Next billing: {new Date(member?.subscription?.currentPeriodEnd || '').toLocaleDateString()}</p>
        </div>

        <div className="usage-overview">
          <h3>Usage Overview</h3>
          {usage && Object.entries(usage.metrics).map(([metric, data]) => 
            renderUsageProgress(metric, data.current, data.limit)
          )}
        </div>
      </div>

      <div className="plan-upgrades">
        <h3>Available Plans</h3>
        <div className="plans-grid">
          {plans?.filter(plan => plan.id !== member?.subscription?.plan?.id).map(plan => (
            <div key={plan.id} className="plan-card">
              <h4>{plan.name}</h4>
              <div className="price">
                ${plan.price}/{plan.interval}
              </div>
              <ul className="features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isUpgrading}
                className="upgrade-button"
              >
                {isUpgrading ? 'Upgrading...' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="billing-actions">
        <h3>Billing Actions</h3>
        <div className="action-buttons">
          <button onClick={() => window.open('/billing/invoices', '_blank')}>
            View Invoices
          </button>
          <button onClick={() => window.open('/billing/payment-methods', '_blank')}>
            Update Payment Method
          </button>
          <button 
            onClick={() => {
              const reason = prompt('Why are you cancelling?');
              if (reason) handleCancel(reason);
            }}
            className="cancel-button"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Subscription Lifecycle Hook

```typescript
import { useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';

export const useSubscription = (memberId: string) => {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: member } = trpc.membership.getMember.useQuery(memberId, {
    onSuccess: (data) => {
      setSubscription(data.subscription);
      setIsLoading(false);
    }
  });

  const { data: usageData } = trpc.membership.getMemberUsage.useQuery({
    memberId,
    period: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      end: new Date().toISOString()
    }
  }, {
    onSuccess: (data) => setUsage(data)
  });

  const checkFeatureAccess = (feature: string) => {
    if (!subscription?.plan) return false;
    
    const features = subscription.plan.features;
    const limits = subscription.plan.limits;
    
    // Check if feature is included in plan
    const hasFeature = features.some(f => 
      f.toLowerCase().includes(feature.toLowerCase())
    );
    
    // Check usage limits
    const currentUsage = usage?.metrics[feature]?.current || 0;
    const limit = limits?.[feature] || limits?.customLimits?.[feature];
    
    return hasFeature && (limit === -1 || currentUsage < limit);
  };

  const getUsagePercentage = (metric: string) => {
    if (!usage || !subscription) return 0;
    
    const current = usage.metrics[metric]?.current || 0;
    const limit = subscription.plan.limits?.[metric] || 
                  subscription.plan.limits?.customLimits?.[metric] || 
                  0;
    
    return limit > 0 ? (current / limit) * 100 : 0;
  };

  const isNearLimit = (metric: string, threshold: number = 80) => {
    return getUsagePercentage(metric) >= threshold;
  };

  const isOverLimit = (metric: string) => {
    return getUsagePercentage(metric) >= 100;
  };

  return {
    subscription,
    usage,
    isLoading,
    checkFeatureAccess,
    getUsagePercentage,
    isNearLimit,
    isOverLimit,
    member
  };
};
```

### Usage-Based Billing

```typescript
// Calculate overage charges
const calculateOverageCharges = (usage: any, plan: any) => {
  const charges = [];
  
  Object.entries(usage.metrics).forEach(([metric, data]) => {
    const limit = plan.limits?.[metric] || plan.limits?.customLimits?.[metric];
    const overagePricing = plan.overagePricing?.[metric];
    
    if (limit > 0 && data.current > limit && overagePricing) {
      const overageUnits = data.current - limit;
      const charge = overageUnits * overagePricing.unitPrice;
      
      charges.push({
        metric,
        overageUnits,
        unitPrice: overagePricing.unitPrice,
        totalCharge: charge
      });
    }
  });
  
  return charges;
};

// Apply overage charges
const applyOverageCharges = async (memberId: string) => {
  const usage = await membership.getMemberUsage({ memberId });
  const subscription = await membership.getCurrentSubscription(memberId);
  
  const charges = calculateOverageCharges(usage, subscription.plan);
  
  if (charges.length > 0) {
    await membership.createInvoice({
      memberId,
      items: charges.map(charge => ({
        description: `${charge.metric} overage (${charge.overageUnits} units)`,
        quantity: charge.overageUnits,
        unitPrice: charge.unitPrice,
        currency: subscription.currency
      })),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      metadata: {
        type: 'overage',
        period: usage.period
      }
    });
  }
};
```

## Advanced Features

### Dunning Management

```typescript
// Configure dunning settings
const dunningConfig = {
  attempts: [
    { days: 3, action: 'send_email', template: 'payment_failed_1' },
    { days: 5, action: 'send_email', template: 'payment_failed_2' },
    { days: 7, action: 'send_email', template: 'payment_failed_3' },
    { days: 10, action: 'warn_cancellation', template: 'cancellation_warning' },
    { days: 14, action: 'cancel_subscription', gracePeriod: 7 }
  ],
  retryCharges: [
    { days: 1, amount: 'full' },
    { days: 3, amount: 'full' },
    { days: 5, amount: 'full' }
  ]
};

// Handle failed payment
const handleFailedPayment = async (subscriptionId: string) => {
  const subscription = await membership.getSubscription(subscriptionId);
  const failedAttempts = subscription.paymentFailedAttempts || 0;
  
  const nextStep = dunningConfig.attempts[failedAttempts];
  
  if (nextStep) {
    switch (nextStep.action) {
      case 'send_email':
        await email.send({
          to: subscription.member.email,
          template: nextStep.template,
          data: { subscription, nextAttemptDate: nextStep.days }
        });
        break;
        
      case 'warn_cancellation':
        await email.send({
          to: subscription.member.email,
          template: nextStep.template,
          data: { subscription, cancellationDate: dunningConfig.attempts[failedAttempts + 1].days }
        });
        break;
        
      case 'cancel_subscription':
        await membership.updateSubscription({
          subscriptionId,
          status: 'cancelled',
          cancelledAt: new Date(),
          gracePeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        break;
    }
    
    // Update attempt count
    await membership.updateSubscription({
      subscriptionId,
      paymentFailedAttempts: failedAttempts + 1,
      lastFailedPaymentAt: new Date()
    });
  }
};
```

### Usage Analytics

```typescript
// Generate usage analytics report
const generateUsageReport = async (memberId: string, period: { start: string; end: string }) => {
  const usage = await membership.getMemberUsage({ memberId, period });
  const member = await membership.getMember(memberId);
  const subscription = await membership.getCurrentSubscription(memberId);
  
  const report = {
    summary: {
      totalUsage: Object.values(usage.metrics).reduce((sum, metric) => sum + metric.current, 0),
      totalCost: subscription.price,
      costPerUsage: subscription.price / Object.values(usage.metrics).reduce((sum, metric) => sum + metric.current, 0),
      period
    },
    metrics: Object.entries(usage.metrics).map(([metric, data]) => ({
      metric,
      current: data.current,
      limit: data.limit,
      percentage: data.limit > 0 ? (data.current / data.limit) * 100 : 0,
      trend: calculateTrend(metric, period),
      cost: calculateMetricCost(metric, data.current, subscription.plan)
    })),
    recommendations: generateRecommendations(usage, subscription.plan),
    projections: projectUsage(usage, subscription.plan)
  };
  
  return report;
};

// Calculate usage trends
const calculateTrend = (metric: string, period: { start: string; end: string }) => {
  // Get historical data for trend analysis
  const previousPeriod = {
    start: new Date(new Date(period.start).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: period.start
  };
  
  const currentUsage = membership.getMemberUsage({ memberId, period });
  const previousUsage = membership.getMemberUsage({ memberId, period: previousPeriod });
  
  const current = currentUsage.metrics[metric]?.current || 0;
  const previous = previousUsage.metrics[metric]?.current || 0;
  
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  
  return {
    change,
    direction: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
    current,
    previous
  };
};
```

## Best Practices

### Plan Design

1. **Clear value proposition** - Each plan should offer clear, distinct value
2. **Logical progression** - Plans should naturally lead to upgrades
3. **Fair limits** - Set limits that provide good value while preventing abuse
4. **Transparent pricing** - No hidden fees or surprise charges
5. **Flexibility** - Allow members to adjust plans as needs change

### Billing Management

1. **Graceful failure handling** - Implement dunning processes for failed payments
2. **Clear communication** - Notify members about billing events in advance
3. **Flexible billing cycles** - Support monthly, annual, and custom billing
4. **Proration transparency** - Clearly show prorated charges for upgrades/downgrades
5. **Invoice detail** - Provide detailed, easy-to-understand invoices

### Usage Monitoring

1. **Real-time tracking** - Monitor usage in real-time to prevent overages
2. **Proactive alerts** - Notify members when approaching limits
3. **Usage insights** - Provide analytics to help members optimize usage
4. **Fair overage pricing** - Price overages reasonably to maintain goodwill
5. **Usage optimization** - Help members find the right plan for their needs

This comprehensive Membership API documentation provides everything needed to build sophisticated subscription management systems with the Katalyst framework, from simple tiered pricing to complex usage-based billing with comprehensive analytics and member management.
