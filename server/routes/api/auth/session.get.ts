import { clerkClient } from 'npm:@clerk/clerk-sdk-node';
import { verifyToken } from 'npm:@clerk/clerk-sdk-node';

export default defineEventHandler(async (event) => {
  assertMethod(event, 'GET');

  try {
    // Get authorization header
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Missing or invalid authorization header'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the JWT token with Clerk
    const payload = await verifyToken(token, {
      issuer: `https://clerk.${process.env.CLERK_DOMAIN}`,
      authorizedParties: [process.env.CLERK_FRONTEND_API_URL]
    });

    if (!payload.sub) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token payload'
      });
    }

    // Get user details from Clerk
    const user = await clerkClient.users.getUser(payload.sub);

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    // Get user's organizations
    const userOrganizations = await clerkClient.users.getOrganizationMembershipList({
      userId: user.id
    });

    // Get user's current session
    const sessions = await clerkClient.users.getUserList({
      userId: [user.id]
    });

    // Check if user has active subscription
    const subscription = await getUserSubscription(user.id);

    // Get user permissions based on subscription and role
    const permissions = await getUserPermissions(user.id, subscription?.plan);

    // Track session access
    await trackSessionAccess({
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      ip: getClientIP(event),
      userAgent: getHeader(event, 'user-agent'),
      timestamp: new Date()
    });

    // Build response
    const sessionData = {
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
        emailVerified: user.emailAddresses[0]?.verification?.status === 'verified',
        phoneVerified: user.phoneNumbers[0]?.verification?.status === 'verified',
        twoFactorEnabled: user.twoFactorEnabled,
        publicMetadata: user.publicMetadata,
        privateMetadata: user.privateMetadata
      },
      session: {
        id: payload.sid,
        status: 'active',
        lastActiveAt: new Date(),
        expireAt: new Date(payload.exp * 1000),
        issuedAt: new Date(payload.iat * 1000)
      },
      organizations: userOrganizations.map(org => ({
        id: org.organization.id,
        name: org.organization.name,
        slug: org.organization.slug,
        role: org.role,
        permissions: org.permissions,
        createdAt: org.createdAt
      })),
      subscription: subscription ? {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        features: subscription.features,
        usage: subscription.usage
      } : null,
      permissions: permissions,
      features: {
        tutorials: permissions.includes('tutorials:access'),
        aiAgent: permissions.includes('ai:access'),
        storefront: permissions.includes('storefront:access'),
        adminPanel: permissions.includes('admin:access'),
        analytics: permissions.includes('analytics:access'),
        exportData: permissions.includes('data:export'),
        customBranding: permissions.includes('branding:custom')
      },
      preferences: await getUserPreferences(user.id)
    };

    // Set security headers
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate');
    setHeader(event, 'Pragma', 'no-cache');
    setHeader(event, 'Expires', '0');

    return {
      success: true,
      data: sessionData,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    // Handle specific Clerk errors
    if (error.message?.includes('jwt')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      });
    }

    if (error.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User session not found'
      });
    }

    console.error('Session verification error:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to verify session'
    });
  }
});

// Helper functions
async function getUserSubscription(userId: string): Promise<any> {
  // Implement subscription lookup
  // This could integrate with Stripe, Paddle, or your billing system
  return {
    id: 'sub_' + userId,
    plan: 'enterprise',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    features: ['tutorials', 'ai-agent', 'priority-support', 'custom-branding'],
    usage: {
      apiCalls: 1250,
      deployments: 15,
      storage: '2.5GB'
    }
  };
}

async function getUserPermissions(userId: string, plan?: string): Promise<string[]> {
  const basePermissions = [
    'profile:read',
    'profile:update',
    'tutorials:access'
  ];

  const planPermissions = {
    'starter': [
      ...basePermissions,
      'projects:create',
      'projects:read'
    ],
    'professional': [
      ...basePermissions,
      'projects:create',
      'projects:read',
      'projects:update',
      'ai:access',
      'analytics:basic'
    ],
    'enterprise': [
      ...basePermissions,
      'projects:*',
      'ai:access',
      'ai:advanced',
      'storefront:access',
      'admin:access',
      'analytics:advanced',
      'data:export',
      'branding:custom',
      'support:priority'
    ]
  };

  return planPermissions[plan || 'starter'] || basePermissions;
}

async function getUserPreferences(userId: string): Promise<any> {
  // Fetch user preferences from database
  return {
    theme: 'dark',
    language: 'en',
    timezone: 'Australia/Brisbane',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    dashboard: {
      layout: 'grid',
      widgets: ['analytics', 'recent-projects', 'tutorials']
    }
  };
}

async function trackSessionAccess(data: any): Promise<void> {
  // Track session access for analytics and security monitoring
  console.log('Session access tracked:', data.userId, data.email);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */