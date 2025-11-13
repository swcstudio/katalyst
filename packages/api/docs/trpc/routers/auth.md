# Authentication Router

## Overview

The `auth.ts` router handles all authentication-related procedures including user registration, login, logout, session management, and user profile operations. It provides a secure, type-safe API for managing user authentication and authorization within the Katalyst framework.

## Features

- **User Registration**: New user signup with email verification
- **Authentication**: Secure login with password validation
- **Session Management**: JWT token management and refresh
- **Password Recovery**: Secure password reset functionality
- **Profile Management**: User profile updates and preferences
- **Multi-factor Authentication**: 2FA support with TOTP and SMS
- **Social Auth Integration**: OAuth provider integration
- **Security Features**: Rate limiting, account lockout, audit logging

## Procedures

### Authentication Operations

#### register
Registers a new user account with email validation and optional organization invitation.

```typescript
authRouter.register = t.procedure
  .input(z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    invitationCode: z.string().optional(),
    organizationId: z.string().optional(),
    acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  }))
  .mutation(async ({ input, ctx }) => {
    // Validate invitation code if provided
    if (input.invitationCode) {
      const invitation = await ctx.prisma.invitation.findUnique({
        where: { code: input.invitationCode, used: false },
        include: { organization: true },
      });
      
      if (!invitation || invitation.expiresAt < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid or expired invitation code',
        });
      }
    }

    // Check if user already exists
    const existingUser = await ctx.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // Create user
    const user = await ctx.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        password: hashedPassword,
        name: input.name,
        emailVerified: false,
        organizationId: input.organizationId || null,
      },
    });

    // Mark invitation as used if provided
    if (input.invitationCode) {
      await ctx.prisma.invitation.update({
        where: { code: input.invitationCode },
        data: { 
          used: true,
          usedBy: user.id,
          usedAt: new Date(),
        },
      });
    }

    // Generate email verification token
    const verificationToken = generateEmailToken();
    await ctx.prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    await ctx.email.send({
      to: user.email,
      template: 'email-verification',
      data: {
        name: user.name,
        verificationLink: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`,
      },
    });

    // Log registration
    await ctx.logger.info('User registered', {
      userId: user.id,
      email: user.email,
      requestIp: ctx.requestIp,
      requestId: ctx.requestId,
    });

    return {
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    };
  });
```

#### login
Authenticates a user with email and password, returning a JWT token and user information.

```typescript
authRouter.login = t.procedure
  .input(z.object({
    email: z.string().email(),
    password: z.string(),
    rememberMe: z.boolean().default(false),
    twoFactorCode: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Find user with organization and roles
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        organization: true,
        roles: {
          include: {
            permissions: true,
          },
        },
        twoFactorAuth: true,
      },
    });

    if (!user) {
      // Log failed login attempt
      await ctx.logger.warn('Login failed - user not found', {
        email: input.email,
        requestIp: ctx.requestIp,
        requestId: ctx.requestId,
      });
      
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invalid email or password',
      });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Account is temporarily locked. Please try again later.',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      // Increment failed login attempts
      const failedAttempts = user.failedLoginAttempts + 1;
      const lockDuration = failedAttempts >= 5 ? 30 * 60 * 1000 : 0; // 30 minutes for 5+ attempts
      
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts,
          lockedUntil: lockDuration > 0 ? new Date(Date.now() + lockDuration) : null,
        },
      });

      // Log failed login
      await ctx.logger.warn('Login failed - invalid password', {
        userId: user.id,
        email: user.email,
        failedAttempts,
        requestIp: ctx.requestIp,
        requestId: ctx.requestId,
      });

      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    // Check 2FA if enabled
    if (user.twoFactorAuth?.enabled) {
      if (!input.twoFactorCode) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Two-factor authentication code required',
          cause: { requiresTwoFactor: true },
        });
      }

      const isValid2FA = await verifyTwoFactorCode(
        user.twoFactorAuth.secret,
        input.twoFactorCode
      );

      if (!isValid2FA) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid two-factor authentication code',
        });
      }
    }

    // Check email verification
    if (!user.emailVerified) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Please verify your email address before logging in',
        cause: { requiresEmailVerification: true },
      });
    }

    // Reset failed login attempts
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Generate JWT tokens
    const token = generateJWTToken(user, input.rememberMe);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    await ctx.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        userAgent: ctx.userAgent,
        requestIp: ctx.requestIp,
      },
    });

    // Extract permissions
    const permissions = user.roles.flatMap(role => 
      role.permissions.map(p => p.name)
    );

    // Log successful login
    await ctx.logger.info('User logged in', {
      userId: user.id,
      email: user.email,
      requestIp: ctx.requestIp,
      requestId: ctx.requestId,
    });

    return {
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        organization: user.organization,
        roles: user.roles.map(role => role.name),
        permissions,
        twoFactorEnabled: user.twoFactorAuth?.enabled || false,
      },
    };
  });
```

#### logout
Logs out the user by invalidating their refresh token.

```typescript
authRouter.logout = t.procedure
  .input(z.object({
    allDevices: z.boolean().default(false),
    refreshToken: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    if (input.allDevices) {
      // Invalidate all refresh tokens for the user
      await ctx.prisma.refreshToken.updateMany({
        where: { userId: ctx.user.id },
        data: { revoked: true },
      });
    } else {
      // Invalidate specific refresh token
      await ctx.prisma.refreshToken.updateMany({
        where: { 
          token: input.refreshToken,
          userId: ctx.user.id,
        },
        data: { revoked: true },
      });
    }

    // Log logout
    await ctx.logger.info('User logged out', {
      userId: ctx.user.id,
      allDevices: input.allDevices,
      requestIp: ctx.requestIp,
      requestId: ctx.requestId,
    });

    return { success: true };
  });
```

### User Profile Operations

#### getProfile
Retrieves the current user's profile information.

```typescript
authRouter.getProfile = t.procedure
  .query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        roles: {
          include: {
            permissions: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        twoFactorAuth: {
          select: {
            enabled: true,
            backupCodesGenerated: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const permissions = user.roles.flatMap(role => role.permissions);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      organization: user.organization,
      roles: user.roles.map(role => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions,
      })),
      permissions,
      twoFactorAuth: user.twoFactorAuth,
    };
  });
```

#### updateProfile
Updates the current user's profile information.

```typescript
authRouter.updateProfile = t.procedure
  .input(z.object({
    name: z.string().min(2).optional(),
    bio: z.string().max(500).optional(),
    avatar: z.string().url().optional(),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      language: z.string().optional(),
      timezone: z.string().optional(),
      emailNotifications: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
    }).optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    const updatedUser = await ctx.prisma.user.update({
      where: { id: ctx.user.id },
      data: {
        ...input,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        bio: true,
        avatar: true,
        preferences: true,
        updatedAt: true,
      },
    });

    // Log profile update
    await ctx.logger.info('User profile updated', {
      userId: ctx.user.id,
      updatedFields: Object.keys(input),
      requestIp: ctx.requestIp,
      requestId: ctx.requestId,
    });

    return updatedUser;
  });
```

### Password Management

#### changePassword
Changes the user's password after verifying the current password.

```typescript
authRouter.changePassword = t.procedure
  .input(z.object({
    currentPassword: z.string(),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers'),
    logoutOtherDevices: z.boolean().default(false),
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    // Get current user with password
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: { password: true },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(input.currentPassword, user.password);
    if (!isValidPassword) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(input.newPassword, 12);

    // Update password
    await ctx.prisma.user.update({
      where: { id: ctx.user.id },
      data: {
        password: hashedPassword,
        passwordUpdatedAt: new Date(),
      },
    });

    // Logout other devices if requested
    if (input.logoutOtherDevices) {
      await ctx.prisma.refreshToken.updateMany({
        where: { userId: ctx.user.id },
        data: { revoked: true },
      });
    }

    // Log password change
    await ctx.logger.info('User password changed', {
      userId: ctx.user.id,
      logoutOtherDevices: input.logoutOtherDevices,
      requestIp: ctx.requestIp,
      requestId: ctx.requestId,
    });

    return { success: true };
  });
```

#### forgotPassword
Initiates the password recovery process by sending a reset email.

```typescript
authRouter.forgotPassword = t.procedure
  .input(z.object({
    email: z.string().email(),
  }))
  .mutation(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      await ctx.logger.info('Password reset requested for non-existent email', {
        email: input.email,
        requestIp: ctx.requestIp,
        requestId: ctx.requestId,
      });
      
      return { success: true };
    }

    // Check rate limiting
    const rateLimitKey = `password-reset:${user.id}:${ctx.requestIp}`;
    const recentAttempts = await ctx.redis?.incr(rateLimitKey);
    
    if (recentAttempts && recentAttempts > 3) {
      const ttl = await ctx.redis?.ttl(rateLimitKey);
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Too many password reset attempts. Try again in ${ttl} seconds.`,
      });
    }

    if (recentAttempts === 1) {
      await ctx.redis?.expire(rateLimitKey, 3600); // 1 hour
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken();
    
    // Store reset token
    await ctx.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        requestIp: ctx.requestIp,
        userAgent: ctx.userAgent,
      },
    });

    // Send reset email
    await ctx.email.send({
      to: user.email,
      template: 'password-reset',
      data: {
        name: user.name,
        resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`,
      },
    });

    // Log password reset request
    await ctx.logger.info('Password reset requested', {
      userId: user.id,
      email: user.email,
      requestIp: ctx.requestIp,
      requestId: ctx.requestId,
    });

    return { success: true };
  });
```

## Integration Examples

### React Hook for Authentication

```typescript
// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';

export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation(
    trpc.auth.login.mutate,
    {
      onSuccess: (data) => {
        // Store tokens
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Update user state
        queryClient.setQueryData(['auth.profile'], data.user);
      },
    }
  );

  const logoutMutation = useMutation(
    trpc.auth.logout.mutate,
    {
      onSuccess: () => {
        // Clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Clear user state
        queryClient.clear();
      },
    }
  );

  const profileQuery = useQuery(
    ['auth.profile'],
    trpc.auth.getProfile.query,
    {
      enabled: !!localStorage.getItem('token'),
    }
  );

  return {
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isAuthenticated: !!profileQuery.data,
  };
}
```

### Next.js API Integration

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { trpcClient } from '../../../server/trpc/client';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const result = await trpcClient.auth.login.mutate({
            email: credentials.email,
            password: credentials.password,
            twoFactorCode: credentials.twoFactorCode,
          });

          if (result.success) {
            return result.user;
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});
```

## Security Features

### Rate Limiting
- Login attempts limited to 5 failures before 30-minute lockout
- Password reset requests limited to 3 per hour per IP/user
- API requests limited based on user authentication status

### Password Security
- Minimum 8 characters with complexity requirements
- bcrypt hashing with salt rounds
- Password change tracking
- Secure password reset tokens with expiration

### Session Management
- JWT tokens with configurable expiration
- Refresh token rotation
- Device tracking and management
- Secure logout with token invalidation

### Audit Logging
- All authentication events logged with context
- Failed login attempt tracking
- Profile change auditing
- Security event monitoring

This comprehensive authentication router provides a secure, feature-rich authentication system for the Katalyst framework with robust security measures and excellent developer experience.
