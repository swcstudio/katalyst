# Membership Router

The Membership Router provides comprehensive membership and subscription management capabilities including tiered pricing plans, member areas, content access control, billing management, and detailed analytics for the Katalyst platform.

## Overview

This router enables the creation and management of complete membership systems with features like subscription plans, member-only content, access control, payment processing, billing management, and comprehensive analytics for tracking membership growth and revenue.

## Features

### Plan & Pricing Management
- Flexible subscription plans with multiple pricing intervals
- Trial periods and promotional offers
- Feature-based access control
- Custom limits and quotas
- Integration with payment providers (Stripe, Paddle)

### Subscription Management
- Complete subscription lifecycle management
- Plan upgrades, downgrades, and cancellations
- Automated billing and renewal processing
- Subscription pause and resume functionality
- Graceful handling of failed payments

### Member Areas & Content Access
- Private member areas with customizable themes
- Content access control based on membership level
- Drip content scheduling for gradual release
- Custom access rules and permissions
- Multiple content types (articles, videos, courses, downloads)

### Member Management
- Comprehensive member database management
- Custom fields and tagging systems
- Member invitations and onboarding
- Bulk member operations
- Member communication tools

### Payment Processing
- Multiple payment method support (cards, bank transfers, PayPal)
- Automatic payment method management
- Failed payment handling and retry logic
- Payment history and records
- PCI-compliant payment processing

### Billing & Invoicing
- Automated invoice generation and delivery
- Detailed billing history and records
- Tax calculation and reporting
- Credit and refund management
- Export capabilities for accounting

### Usage & Limits Monitoring
- Real-time usage tracking and monitoring
- Configurable limits and quotas
- Usage alerts and notifications
- Detailed usage analytics
- Fair usage policy enforcement

### Coupons & Promotions
- Flexible coupon and discount system
- Time-limited promotional offers
- Referral program support
- Bulk coupon generation
- A/B testing for promotions

### Analytics & Reporting
- Comprehensive membership analytics
- Revenue tracking (MRR, ARR, LTV)
- Churn analysis and retention metrics
- Member growth and engagement analytics
- Custom reporting and dashboards

## API Procedures

### Plan Management

#### `createPlan`
**Type**: Protected Mutation  
**Description**: Create a new subscription plan with pricing and features.

**Input Schema**:
```typescript
{
  name: string,
  description: string,
  price: number,
  currency?: string,
  interval: 'once' | 'monthly' | 'yearly' | 'weekly',
  intervalCount?: number,
  trialDays?: number,
  features: Array<string>,
  limits?: {
    members?: number,
    storage?: number,
    bandwidth?: number,
    apiCalls?: number,
    customLimits?: Record<string, number>
  },
  metadata?: Record<string, any>,
  stripePriceId?: string,
  paddlePriceId?: string
}
```

**Response**:
```typescript
{
  id: string,
  name: string,
  description: string,
  price: number,
  currency: string,
  interval: string,
  intervalCount: number,
  trialDays?: number,
  features: Array<string>,
  limits?: {
    members?: number,
    storage?: number,
    bandwidth?: number,
    apiCalls?: number,
    customLimits?: Record<string, number>
  },
  metadata?: Record<string, any>
}
```

**Usage Example**:
```typescript
// Create a Pro monthly plan
const proPlan = await trpc.membership.createPlan.mutate({
  name: 'Pro Plan',
  description: 'Perfect for growing businesses and professionals',
  price: 29,
  currency: 'USD',
  interval: 'monthly',
  trialDays: 14,
  features: [
    'Unlimited projects',
    'Advanced analytics',
    'Priority support',
    'Custom integrations',
    'Team collaboration'
  ],
  limits: {
    members: 10,
    storage: 100, // GB
    bandwidth: 1000, // GB
    apiCalls: 100000
  },
  stripePriceId: 'price_1234567890',
  metadata: {
    tier: 'professional',
    target_audience: 'business'
  }
});

// Create a yearly plan with discount
const yearlyPlan = await trpc.membership.createPlan.mutate({
  name: 'Enterprise Annual',
  description: 'Best value for large organizations',
  price: 290, // $29/month * 10 months (2 months free)
  currency: 'USD',
  interval: 'yearly',
  intervalCount: 1,
  features: [
    'Everything in Pro',
    'Unlimited members',
    'Unlimited storage',
    'Dedicated account manager',
    'SLA guarantee',
    'Custom training'
  ],
  limits: {
    members: -1, // Unlimited
    storage: -1,
    bandwidth: -1,
    apiCalls: -1
  }
});
```

#### `getPlans`
**Type**: Public Query  
**Description**: Retrieve available subscription plans.

**Input Schema**:
```typescript
{
  active?: boolean,
  includeHidden?: boolean
}
```

**Response**:
```typescript
{
  plans: Array<{
    id: string,
    name: string,
    price: number,
    interval: string,
    features: Array<string>,
    trialDays?: number,
    limits?: Record<string, number>
  }>
}
```

**Usage Example**:
```typescript
// Get all active plans
const activePlans = await trpc.membership.getPlans.query({
  active: true
});

// Display pricing options
activePlans.plans.forEach(plan => {
  const price = plan.price === 0 ? 'Free' : `$${plan.price}/${plan.interval}`;
  console.log(`${plan.name}: ${price}`);
  plan.features.forEach(feature => {
    console.log(`  ✓ ${feature}`);
  });
});

// Get plans including hidden ones (for admin)
const allPlans = await trpc.membership.getPlans.query({
  active: true,
  includeHidden: true
});
```

### Subscription Management

#### `createSubscription`
**Type**: Protected Mutation  
**Description**: Create a new subscription for a user.

**Input Schema**:
```typescript
{
  planId: string,
  paymentMethodId?: string,
  couponCode?: string,
  quantity?: number
}
```

**Response**:
```typescript
{
  id: string,
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid',
  currentPeriodEnd: Date,
  trialEnd?: Date
}
```

**Usage Example**:
```typescript
// Subscribe to Pro plan with payment method
const subscription = await trpc.membership.createSubscription.mutate({
  planId: 'pro-monthly',
  paymentMethodId: 'pm_1234567890',
  quantity: 1
});

console.log(`Subscription created: ${subscription.id}`);
console.log(`Status: ${subscription.status}`);

// Subscribe with coupon code
const subscriptionWithCoupon = await trpc.membership.createSubscription.mutate({
  planId: 'pro-monthly',
  couponCode: 'LAUNCH20',
  paymentMethodId: 'pm_1234567890'
});
```

#### `getSubscription`
**Type**: Protected Query  
**Description**: Get current user's subscription details.

**Response**:
```typescript
{
  id: string,
  planId: string,
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid',
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: boolean,
  trialEnd?: Date
}
```

**Usage Example**:
```typescript
const subscription = await trpc.membership.getSubscription.query();

if (subscription) {
  console.log(`Plan: ${subscription.planId}`);
  console.log(`Status: ${subscription.status}`);
  console.log(`Next billing: ${subscription.currentPeriodEnd}`);
  
  if (subscription.cancelAtPeriodEnd) {
    console.log('⚠️ Subscription will cancel at period end');
  }
  
  if (subscription.status === 'trialing') {
    const daysLeft = Math.ceil(
      (subscription.trialEnd!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    console.log(`Trial ends in ${daysLeft} days`);
  }
} else {
  console.log('No active subscription');
}
```

#### `updateSubscription`
**Type**: Protected Mutation  
**Description**: Update an existing subscription.

**Input Schema**:
```typescript
{
  planId?: string,
  quantity?: number,
  cancelAtPeriodEnd?: boolean
}
```

**Usage Example**:
```typescript
// Upgrade to yearly plan
await trpc.membership.updateSubscription.mutate({
  planId: 'pro-yearly'
});

// Increase quantity for team
await trpc.membership.updateSubscription.mutate({
  quantity: 5
});

// Cancel subscription at period end
await trpc.membership.updateSubscription.mutate({
  cancelAtPeriodEnd: true
});
```

#### `cancelSubscription`
**Type**: Protected Mutation  
**Description**: Cancel a subscription immediately or at period end.

**Input Schema**:
```typescript
{
  immediately?: boolean,
  reason?: string,
  feedback?: string
}
```

**Response**:
```typescript
{
  success: boolean,
  endsAt: Date
}
```

**Usage Example**:
```typescript
// Cancel at period end (keep access until paid period ends)
const gracefulCancel = await trpc.membership.cancelSubscription.mutate({
  immediately: false,
  reason: 'Too expensive',
  feedback: 'Love the product but price is too high for current budget'
});

console.log(`Access ends: ${gracefulCancel.endsAt}`);

// Cancel immediately
const immediateCancel = await trpc.membership.cancelSubscription.mutate({
  immediately: true,
  reason: 'Switching to different provider'
});
```

#### `reactivateSubscription`
**Type**: Protected Mutation  
**Description**: Reactivate a canceled subscription.

**Usage Example**:
```typescript
const result = await trpc.membership.reactivateSubscription.mutate();

if (result.success) {
  console.log('Subscription reactivated successfully');
}
```

### Member Areas

#### `createMemberArea`
**Type**: Protected Mutation  
**Description**: Create a private member area.

**Input Schema**:
```typescript
{
  name: string,
  slug: string,
  description?: string,
  accessLevel: 'public' | 'members' | 'paid' | 'custom',
  requiredPlans?: Array<string>,
  customRules?: Array<{
    field: string,
    operator: string,
    value: any
  }>,
  theme?: {
    primaryColor: string,
    logo?: string,
    customCss?: string
  }
}
```

**Usage Example**:
```typescript
// Create Pro members area
const proArea = await trpc.membership.createMemberArea.mutate({
  name: 'Pro Member Hub',
  slug: 'pro-hub',
  description: 'Exclusive content and resources for Pro members',
  accessLevel: 'paid',
  requiredPlans: ['pro-monthly', 'pro-yearly'],
  theme: {
    primaryColor: '#3B82F6',
    logo: 'https://cdn.example.com/pro-logo.png',
    customCss: `
      .pro-member-card {
        border: 2px solid #3B82F6;
        border-radius: 12px;
      }
    `
  }
});

// Create custom access area
const customArea = await trpc.membership.createMemberArea.mutate({
  name: 'VIP Community',
  slug: 'vip',
  accessLevel: 'custom',
  customRules: [
    {
      field: 'membership_months',
      operator: '>=',
      value: 6
    },
    {
      field: 'total_spent',
      operator: '>=',
      value: 500
    }
  ]
});
```

#### `getMemberAreas`
**Type**: Protected Query  
**Description**: Get member areas accessible to the current user.

**Usage Example**:
```typescript
const areas = await trpc.membership.getMemberAreas.query();

areas.areas.forEach(area => {
  console.log(`${area.name}: /${area.slug}`);
  if (area.description) {
    console.log(`  ${area.description}`);
  }
});
```

### Content Management

#### `createContent`
**Type**: Protected Mutation  
**Description**: Create content with access control.

**Input Schema**:
```typescript
{
  areaId: string,
  title: string,
  slug: string,
  type: 'article' | 'video' | 'course' | 'download' | 'live',
  content: any,
  accessLevel: 'free' | 'members' | 'paid' | 'custom',
  requiredPlans?: Array<string>,
  dripSchedule?: {
    type: 'immediate' | 'fixed' | 'relative',
    date?: Date,
    daysAfterSignup?: number
  },
  metadata?: Record<string, any>
}
```

**Usage Example**:
```typescript
// Create premium article
const premiumArticle = await trpc.membership.createContent.mutate({
  areaId: 'pro-hub',
  title: 'Advanced Integration Guide',
  slug: 'advanced-integration-guide',
  type: 'article',
  content: {
    body: 'Full article content here...',
    readingTime: 15,
    difficulty: 'advanced'
  },
  accessLevel: 'paid',
  requiredPlans: ['pro-monthly', 'pro-yearly'],
  metadata: {
    author: 'John Doe',
    tags: ['integration', 'advanced', 'tutorial']
  }
});

// Create dripped content
const drippedContent = await trpc.membership.createContent.mutate({
  areaId: 'pro-hub',
  title: 'Week 2: Advanced Features',
  slug: 'week-2-advanced-features',
  type: 'video',
  content: {
    videoUrl: 'https://cdn.example.com/week-2.mp4',
    duration: 1800 // 30 minutes
  },
  accessLevel: 'paid',
  requiredPlans: ['pro-monthly'],
  dripSchedule: {
    type: 'relative',
    daysAfterSignup: 14
  }
});
```

#### `getContent`
**Type**: Public Query  
**Description**: Get content details and check access.

**Input Schema**:
```typescript
{
  contentId?: string,
  slug?: string
}
```

**Response**:
```typescript
{
  id: string,
  title: string,
  slug: string,
  type: string,
  content: any,
  accessLevel: string,
  hasAccess: boolean,
  upgradeRequired?: string
}
```

**Usage Example**:
```typescript
const content = await trpc.membership.getContent.query({
  slug: 'advanced-integration-guide'
});

if (content.hasAccess) {
  console.log(`Reading: ${content.title}`);
  // Display content
} else {
  console.log(`Upgrade required: ${content.upgradeRequired}`);
  // Show upgrade prompt
}
```

#### `listContent`
**Type**: Public Query  
**Description**: List content with filtering options.

**Input Schema**:
```typescript
{
  areaId?: string,
  type?: 'article' | 'video' | 'course' | 'download' | 'live',
  accessLevel?: 'free' | 'members' | 'paid',
  page?: number,
  limit?: number
}
```

**Usage Example**:
```typescript
// Get all free content
const freeContent = await trpc.membership.listContent.query({
  accessLevel: 'free',
  limit: 10
});

// Get Pro member articles
const proArticles = await trpc.membership.listContent.query({
  areaId: 'pro-hub',
  type: 'article',
  limit: 20
});
```

#### `checkAccess`
**Type**: Protected Query  
**Description**: Check if user has access to specific content.

**Input Schema**:
```typescript
{
  contentId: string
}
```

**Response**:
```typescript
{
  hasAccess: boolean,
  reason?: string,
  upgradeRequired?: string
}
```

**Usage Example**:
```typescript
const access = await trpc.membership.checkAccess.query({
  contentId: 'content-123'
});

if (access.hasAccess) {
  // Show content
} else {
  // Show upgrade prompt
  console.log(`Reason: ${access.reason}`);
  console.log(`Required plan: ${access.upgradeRequired}`);
}
```

### Member Management

#### `getMembers`
**Type**: Protected Query  
**Description**: Get list of members with filtering.

**Input Schema**:
```typescript
{
  planId?: string,
  status?: 'active' | 'cancelled' | 'past_due' | 'trialing',
  search?: string,
  page?: number,
  limit?: number
}
```

**Usage Example**:
```typescript
// Get all active members
const activeMembers = await trpc.membership.getMembers.query({
  status: 'active',
  limit: 50
});

// Search for specific member
const searchResults = await trpc.membership.getMembers.query({
  search: 'john@example.com',
  limit: 10
});

// Get members on specific plan
const proMembers = await trpc.membership.getMembers.query({
  planId: 'pro-monthly',
  status: 'active'
});
```

#### `getMember`
**Type**: Protected Query  
**Description**: Get detailed information about a specific member.

**Input Schema**:
```typescript
{
  memberId: string
}
```

**Usage Example**:
```typescript
const member = await trpc.membership.getMember.query({
  memberId: 'member-123'
});

console.log(`Member: ${member.name} (${member.email})`);
console.log(`Plan: ${member.planId}`);
console.log(`Status: ${member.status}`);
console.log(`Member since: ${member.createdAt}`);
```

#### `updateMember`
**Type**: Protected Mutation  
**Description**: Update member information.

**Input Schema**:
```typescript
{
  memberId: string,
  data: {
    email?: string,
    name?: string,
    customFields?: Record<string, any>,
    tags?: Array<string>
  }
}
```

**Usage Example**:
```typescript
await trpc.membership.updateMember.mutate({
  memberId: 'member-123',
  data: {
    name: 'John Smith',
    customFields: {
      company: 'Acme Corp',
      role: 'Developer'
    },
    tags: ['enterprise', 'developer']
  }
});
```

#### `inviteMember`
**Type**: Protected Mutation  
**Description**: Invite someone to become a member.

**Input Schema**:
```typescript
{
  email: string,
  planId?: string,
  expiresAt?: Date,
  customMessage?: string
}
```

**Response**:
```typescript
{
  invitationId: string,
  inviteUrl: string
}
```

**Usage Example**:
```typescript
const invitation = await trpc.membership.inviteMember.mutate({
  email: 'newmember@example.com',
  planId: 'pro-monthly',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  customMessage: 'Welcome! We think you\'ll love our Pro features.'
});

console.log(`Invitation sent: ${invitation.inviteUrl}`);
```

### Payment Methods

#### `addPaymentMethod`
**Type**: Protected Mutation  
**Description**: Add a new payment method.

**Input Schema**:
```typescript
{
  type: 'card' | 'bank' | 'paypal',
  token: string,
  setAsDefault?: boolean
}
```

**Response**:
```typescript
{
  id: string
}
```

**Usage Example**:
```typescript
// Add credit card (using Stripe token)
const paymentMethod = await trpc.membership.addPaymentMethod.mutate({
  type: 'card',
  token: 'tok_1234567890', // Stripe token from Stripe Elements
  setAsDefault: true
});

console.log(`Payment method added: ${paymentMethod.id}`);
```

#### `getPaymentMethods`
**Type**: Protected Query  
**Description**: Get user's payment methods.

**Response**:
```typescript
{
  methods: Array<{
    id: string,
    type: 'card' | 'bank' | 'paypal',
    brand?: string,
    last4?: string,
    expiryMonth?: number,
    expiryYear?: number,
    isDefault: boolean
  }>
}
```

**Usage Example**:
```typescript
const methods = await trpc.membership.getPaymentMethods.query();

methods.methods.forEach(method => {
  if (method.type === 'card') {
    const cardInfo = `${method.brand} •••• ${method.last4}`;
    const default = method.isDefault ? ' (Default)' : '';
    console.log(`${cardInfo}${default}`);
  }
});
```

#### `removePaymentMethod`
**Type**: Protected Mutation  
**Description**: Remove a payment method.

**Input Schema**:
```typescript
{
  paymentMethodId: string
}
```

**Usage Example**:
```typescript
await trpc.membership.removePaymentMethod.mutate({
  paymentMethodId: 'pm-1234567890'
});
```

### Billing & Invoices

#### `getInvoices`
**Type**: Protected Query  
**Description**: Get user's invoice history.

**Input Schema**:
```typescript
{
  page?: number,
  limit?: number
}
```

**Response**:
```typescript
{
  invoices: Array<{
    id: string,
    number: string,
    amount: number,
    status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible',
    date: Date,
    downloadUrl: string
  }>,
  total: number
}
```

**Usage Example**:
```typescript
const invoices = await trpc.membership.getInvoices.query({
  limit: 12
});

invoices.invoices.forEach(invoice => {
  console.log(`${invoice.number}: $${invoice.amount} (${invoice.status})`);
  console.log(`  Download: ${invoice.downloadUrl}`);
});
```

#### `downloadInvoice`
**Type**: Protected Query  
**Description**: Get a secure download URL for an invoice.

**Input Schema**:
```typescript
{
  invoiceId: string
}
```

**Response**:
```typescript
{
  downloadUrl: string,
  expiresAt: Date
}
```

**Usage Example**:
```typescript
const invoiceUrl = await trpc.membership.downloadInvoice.query({
  invoiceId: 'inv_1234567890'
});

// Download or open the invoice
window.open(invoiceUrl.downloadUrl, '_blank');
```

### Usage & Limits

#### `getUsage`
**Type**: Protected Query  
**Description**: Get current usage and limits.

**Response**:
```typescript
{
  period: {
    start: Date,
    end: Date
  },
  usage: {
    members: number,
    storage: number, // MB
    bandwidth: number, // GB
    apiCalls: number
  },
  limits: {
    members: number,
    storage: number, // MB
    bandwidth: number, // GB
    apiCalls: number
  }
}
```

**Usage Example**:
```typescript
const usage = await trpc.membership.getUsage.query();

// Calculate usage percentages
const storageUsage = (usage.usage.storage / usage.limits.storage) * 100;
const bandwidthUsage = (usage.usage.bandwidth / usage.limits.bandwidth) * 100;

console.log(`Storage: ${usage.usage.storage}MB / ${usage.limits.storage}MB (${storageUsage.toFixed(1)}%)`);
console.log(`Bandwidth: ${usage.usage.bandwidth}GB / ${usage.limits.bandwidth}GB (${bandwidthUsage.toFixed(1)}%)`);
console.log(`API Calls: ${usage.usage.apiCalls} / ${usage.limits.apiCalls}`);

// Show warnings for high usage
if (storageUsage > 80) {
  console.log('⚠️ Storage usage is high');
}
```

### Coupons & Promotions

#### `validateCoupon`
**Type**: Public Query  
**Description**: Validate a coupon code.

**Input Schema**:
```typescript
{
  code: string,
  planId?: string
}
```

**Response**:
```typescript
{
  valid: boolean,
  discount?: {
    type: 'percentage' | 'fixed_amount',
    value: number,
    duration: 'once' | 'repeating' | 'forever'
  }
}
```

**Usage Example**:
```typescript
const coupon = await trpc.membership.validateCoupon.query({
  code: 'LAUNCH20',
  planId: 'pro-monthly'
});

if (coupon.valid && coupon.discount) {
  if (coupon.discount.type === 'percentage') {
    console.log(`${coupon.discount.value}% discount`);
  } else {
    console.log(`$${coupon.discount.value} off`);
  }
  console.log(`Duration: ${coupon.discount.duration}`);
} else {
  console.log('Invalid coupon code');
}
```

### Webhooks

#### `createWebhook`
**Type**: Protected Mutation  
**Description**: Create a webhook for membership events.

**Input Schema**:
```typescript
{
  url: string,
  events: Array<string>,
  secret?: string
}
```

**Response**:
```typescript
{
  id: string,
  url: string,
  events: Array<string>
}
```

**Usage Example**:
```typescript
const webhook = await trpc.membership.createWebhook.mutate({
  url: 'https://api.example.com/webhooks/membership',
  events: [
    'subscription.created',
    'subscription.updated',
    'subscription.canceled',
    'invoice.paid',
    'member.created'
  ],
  secret: 'whsec_1234567890abcdef'
});

console.log(`Webhook created: ${webhook.id}`);
```

### Analytics

#### `getMembershipAnalytics`
**Type**: Protected Query  
**Description**: Get comprehensive membership analytics.

**Input Schema**:
```typescript
{
  dateFrom?: Date,
  dateTo?: Date
}
```

**Response**:
```typescript
{
  mrr: number, // Monthly Recurring Revenue
  arr: number, // Annual Recurring Revenue
  churnRate: number, // Percentage
  ltv: number, // Lifetime Value
  totalMembers: number,
  activeMembers: number,
  trialMembers: number,
  growth: {
    daily: Array<{ date: Date, members: number, revenue: number }>,
    monthly: Array<{ date: Date, members: number, revenue: number }>
  },
  planBreakdown: Record<string, { members: number, revenue: number }>
}
```

**Usage Example**:
```typescript
const analytics = await trpc.membership.getMembershipAnalytics.query({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  dateTo: new Date()
});

console.log(`MRR: $${analytics.mrr.toLocaleString()}`);
console.log(`ARR: $${analytics.arr.toLocaleString()}`);
console.log(`Churn Rate: ${analytics.churnRate}%`);
console.log(`LTV: $${analytics.ltv}`);
console.log(`Total Members: ${analytics.totalMembers}`);
console.log(`Active Members: ${analytics.activeMembers}`);

// Plan breakdown
Object.entries(analytics.planBreakdown).forEach(([planId, data]) => {
  console.log(`${planId}: ${data.members} members, $${data.revenue} revenue`);
});
```

## Integration Examples

### Subscription Management Component
```typescript
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export function SubscriptionManager() {
  const { data: subscription } = trpc.membership.getSubscription.useQuery();
  const { data: plans } = trpc.membership.getPlans.useQuery();
  
  const updateSubscription = trpc.membership.updateSubscription.useMutation();
  const cancelSubscription = trpc.membership.cancelSubscription.useMutation();

  const handleUpgrade = async (planId: string) => {
    await updateSubscription.mutateAsync({ planId });
  };

  const handleCancel = async (immediate: boolean = false) => {
    await cancelSubscription.mutateAsync({ 
      immediately: immediate,
      reason: 'User requested cancellation'
    });
  };

  if (!subscription) {
    return (
      <div className="subscription-plans">
        <h2>Choose Your Plan</h2>
        {plans?.plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <div className="price">${plan.price}/{plan.interval}</div>
            <ul className="features">
              {plan.features.map(feature => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button onClick={() => handleUpgrade(plan.id)}>
              Subscribe
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="current-subscription">
      <h2>Current Subscription</h2>
      <div className="subscription-details">
        <p><strong>Plan:</strong> {subscription.planId}</p>
        <p><strong>Status:</strong> {subscription.status}</p>
        <p><strong>Next billing:</strong> {subscription.currentPeriodEnd.toLocaleDateString()}</p>
        
        {subscription.cancelAtPeriodEnd && (
          <div className="warning">
            ⚠️ Cancels on {subscription.currentPeriodEnd.toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="subscription-actions">
        <select 
          onChange={(e) => e.target.value && handleUpgrade(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Change Plan</option>
          {plans?.plans
            .filter(plan => plan.id !== subscription.planId)
            .map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.name} (${plan.price}/{plan.interval})
              </option>
            ))
          }
        </select>
        
        <button onClick={() => handleCancel(false)}>
          Cancel at Period End
        </button>
        
        <button onClick={() => handleCancel(true)} className="danger">
          Cancel Immediately
        </button>
      </div>
    </div>
  );
}
```

### Member Area Access Component
```typescript
import { trpc } from '@/utils/trpc';
import { useNavigate } from 'react-router-dom';

export function MemberArea({ areaId, children }: {
  areaId: string,
  children: React.ReactNode
}) {
  const navigate = useNavigate();
  
  const { data: user, isLoading } = trpc.auth.getUser.useQuery();
  const { data: subscription } = trpc.membership.getSubscription.useQuery();
  
  // Check if user has access to this member area
  const checkAccess = async () => {
    if (!user) {
      navigate('/login');
      return false;
    }
    
    if (!subscription || subscription.status !== 'active') {
      navigate('/pricing');
      return false;
    }
    
    return true;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="member-area">
      {checkAccess() ? (
        children
      ) : (
        <div className="access-denied">
          <h2>Access Required</h2>
          <p>This content is available to members only.</p>
          <button onClick={() => navigate('/pricing')}>
            Upgrade Your Account
          </button>
        </div>
      )}
    </div>
  );
}
```

### Usage Dashboard Component
```typescript
import { trpc } from '@/utils/trpc';
import { Progress } from '@/components/ui/progress';

export function UsageDashboard() {
  const { data: usage } = trpc.membership.getUsage.useQuery();

  if (!usage) return <div>Loading usage data...</div>;

  const calculatePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return (used / limit) * 100;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'destructive';
    if (percentage >= 70) return 'warning';
    return 'default';
  };

  return (
    <div className="usage-dashboard">
      <h2>Usage Overview</h2>
      
      <div className="usage-items">
        <div className="usage-item">
          <div className="usage-header">
            <span>Storage</span>
            <span>{usage.usage.storage}MB / {usage.limits.storage}MB</span>
          </div>
          <Progress 
            value={calculatePercentage(usage.usage.storage, usage.limits.storage)}
            className={getProgressColor(calculatePercentage(usage.usage.storage, usage.limits.storage))}
          />
        </div>

        <div className="usage-item">
          <div className="usage-header">
            <span>Bandwidth</span>
            <span>{usage.usage.bandwidth}GB / {usage.limits.bandwidth}GB</span>
          </div>
          <Progress 
            value={calculatePercentage(usage.usage.bandwidth, usage.limits.bandwidth)}
            className={getProgressColor(calculatePercentage(usage.usage.bandwidth, usage.limits.bandwidth))}
          />
        </div>

        <div className="usage-item">
          <div className="usage-header">
            <span>API Calls</span>
            <span>{usage.usage.apiCalls.toLocaleString()} / {usage.limits.apiCalls.toLocaleString()}</span>
          </div>
          <Progress 
            value={calculatePercentage(usage.usage.apiCalls, usage.limits.apiCalls)}
            className={getProgressColor(calculatePercentage(usage.usage.apiCalls, usage.limits.apiCalls))}
          />
        </div>
      </div>

      <div className="usage-period">
        <p>Period: {usage.period.start.toLocaleDateString()} - {usage.period.end.toLocaleDateString()}</p>
      </div>
    </div>
  );
}
```

## Best Practices

### Plan Structure
- Keep plan structures simple and clear
- Use descriptive names and features
- Price competitively based on value provided
- Offer annual plans with discounts
- Include trial periods for paid plans

### Subscription Management
- Provide clear upgrade/downgrade paths
- Send timely renewal notifications
- Handle failed payments gracefully
- Offer easy cancellation options
- Maintain good customer communication

### Content Access
- Use progressive disclosure for content
- Implement drip schedules for courses
- Provide value at every membership level
- Make upgrade prompts clear and compelling
- Track content engagement metrics

### Payment Processing
- Use reputable payment processors
- Implement PCI compliance
- Provide multiple payment options
- Handle currency conversions properly
- Maintain detailed payment records

### Analytics & Monitoring
- Track key metrics (MRR, LTV, churn)
- Monitor subscription lifecycle events
- Analyze user behavior and engagement
- Set up alerts for unusual activity
- Use data to inform product decisions

## Error Handling

```typescript
try {
  const subscription = await trpc.membership.createSubscription.mutate({
    planId: 'pro-monthly',
    paymentMethodId: 'pm-1234567890'
  });
} catch (error) {
  if (error.data?.code === 'PAYMENT_METHOD_INVALID') {
    // Handle invalid payment method
    alert('Payment method is invalid. Please update your payment information.');
  } else if (error.data?.code === 'PLAN_NOT_FOUND') {
    // Handle invalid plan
    alert('Selected plan is not available.');
  } else if (error.data?.code === 'SUBSCRIPTION_EXISTS') {
    // Handle existing subscription
    alert('You already have an active subscription.');
  } else {
    // Handle other errors
    alert('Failed to create subscription. Please try again.');
  }
}
```

## Integration with tRPC

The membership router integrates seamlessly with the tRPC system:

```typescript
// In your main tRPC router
export const appRouter = router({
  membership: membershipRouter,
  auth: authRouter,
  media: mediaRouter,
  // ... other routers
});

export type AppRouter = typeof appRouter;
```

This provides type-safe access to all membership procedures throughout your application, enabling seamless integration with comprehensive membership and subscription management functionality.
