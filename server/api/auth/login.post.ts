import { createClerkClient } from '@clerk/backend';
import type { AuthResponse, SignInRequest } from '@sse/types';
import { createError, defineEventHandler, readBody } from 'h3';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export default defineEventHandler(async (event) => {
  // Only allow POST method
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  try {
    const body: SignInRequest = await readBody(event);

    // Validate required fields
    if (!body.emailAddress || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.emailAddress)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format',
      });
    }

    // Attempt to sign in with Clerk
    const signInAttempt = await clerk.signInTokens.createSignInToken({
      userId: undefined, // Will be resolved by Clerk
    });

    // For development, we'll use a simplified approach
    // In production, you'd integrate with Clerk's sign-in flow
    const users = await clerk.users.getUserList({
      emailAddress: [body.emailAddress],
    });

    if (users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    const user = users[0];

    // Create session token
    const sessionToken = await clerk.sessions.createSession({
      userId: user.id,
    });

    const response: AuthResponse = {
      success: true,
      user: {
        id: user.id,
        emailAddress: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
        hasImage: user.hasImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      sessionToken: sessionToken.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    // Set secure HTTP-only cookie
    setCookie(event, 'sse-session', sessionToken.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    // Set CORS headers for cross-origin requests
    setHeader(event, 'Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    setHeader(event, 'Access-Control-Allow-Credentials', 'true');

    return response;
  } catch (error: Error) {
    // Log error for monitoring (use your preferred logging service)
    console.error('Login error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: getHeader(event, 'user-agent'),
      ip: getClientIP(event),
    });

    // Handle Clerk-specific errors
    if (error.errors) {
      const clerkError = error.errors[0];
      throw createError({
        statusCode: 400,
        statusMessage: clerkError.message || 'Authentication failed',
      });
    }

    // Handle known error types
    if (error.statusCode) {
      throw error;
    }

    // Generic error for unexpected issues
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License Agreement.
 */
