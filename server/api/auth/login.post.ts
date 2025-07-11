import { createError, defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  // Only allow POST method
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  try {
    const body: any = await readBody(event);

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
    const signInAttempt = { success: true };

    const users = [{ id: 'mock-user-id', emailAddresses: [{ emailAddress: body.emailAddress }] }];

    if (users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    const user = users[0];

    const sessionToken = { id: 'mock-session-id' };

    const response = {
      success: true,
      user: {
        id: user.id,
        emailAddress: user.emailAddresses[0]?.emailAddress || '',
        firstName: '',
        lastName: '',
        imageUrl: '',
        hasImage: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      sessionToken: sessionToken.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    // Set secure HTTP-only cookie
    // setCookie(event, 'sse-session', sessionToken.id, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 24 * 60 * 60, // 24 hours
    //   path: '/',
    // });

    // Set CORS headers for cross-origin requests
    // setHeader(event, 'Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    // setHeader(event, 'Access-Control-Allow-Credentials', 'true');

    return response;
  } catch (error: unknown) {
    // Log error for monitoring (use your preferred logging service)
    console.error('Login error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userAgent: 'unknown',
      ip: 'unknown',
    });

    // Handle Clerk-specific errors
    if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors)) {
      const clerkError = error.errors[0];
      throw createError({
        statusCode: 400,
        statusMessage: clerkError.message || 'Authentication failed',
      });
    }

    // Handle known error types
    if (error && typeof error === 'object' && 'statusCode' in error) {
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
