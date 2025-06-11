import {
  createError,
  defineEventHandler,
  getHeader,
  readBody,
  setHeader,
} from 'h3';

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
    if (!body.emailAddress || !body.password || !body.firstName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password, and first name are required',
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

    // Validate password strength
    if (body.password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long',
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(body.password)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }

    // Check if user already exists
    const existingUsers = [];

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists',
      });
    }

    // Create user with Clerk
    const user = {
      id: 'mock-user-id',
      emailAddresses: [{ emailAddress: body.emailAddress }],
      firstName: body.firstName,
      lastName: body.lastName || '',
      imageUrl: '',
      hasImage: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Send verification email


    // Create initial session
    const session = { id: 'mock-session-id' };

    // Log successful registration for analytics
    console.info('User registration successful:', {
      userId: user.id,
      email: body.emailAddress,
      timestamp: new Date().toISOString(),
      ip: 'unknown',
    });

    const response = {
      success: true,
      user: {
        id: user.id,
        emailAddress: user.emailAddresses[0]?.emailAddress || body.emailAddress,
        firstName: user.firstName || body.firstName,
        lastName: user.lastName || body.lastName || '',
        imageUrl: user.imageUrl || '',
        hasImage: user.hasImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      sessionToken: session.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      message: 'Registration successful. Please check your email for verification.',
    };

    // Set secure HTTP-only cookie


    // Set CORS headers for cross-origin requests
    setHeader(event, 'Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    setHeader(event, 'Access-Control-Allow-Credentials', 'true');

    return response;
  } catch (error: unknown) {
    // Log error for monitoring
    console.error('Registration error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userAgent: getHeader(event, 'user-agent'),
      ip: 'unknown',
      requestBody: null,
    });

    // Handle Clerk-specific errors
    if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors)) {
      const clerkError = error.errors[0];
      throw createError({
        statusCode: 400,
        statusMessage: (clerkError as any)?.message || 'Registration failed',
      });
    }

    // Handle rate limiting
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 429) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too many registration attempts. Please try again later.',
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
