# Katalyst API Auth Documentation

## Overview

The Katalyst Authentication API provides comprehensive user authentication and authorization capabilities for modern web applications. Built with tRPC and TypeScript, it offers type-safe authentication with support for multiple providers, two-factor authentication, and advanced security features.

## Features

- **Multiple Authentication Methods**: Email/password, social providers, SSO
- **Two-Factor Authentication**: TOTP, SMS, and authenticator apps
- **Session Management**: Secure token-based authentication
- **Organization Support**: Multi-tenant architecture with role-based access
- **Password Security**: Advanced password policies and recovery
- **Audit Logging**: Comprehensive security event tracking
- **Rate Limiting**: Built-in protection against brute force attacks
- **Social Integration**: OAuth providers (Google, GitHub, Discord, etc.)

## API Reference

### Authentication

#### User Registration

```typescript
mutation {
  register({
    email: "john@example.com",
    password: "SecurePassword123!",
    firstName: "John",
    lastName: "Doe",
    organizationName: "Tech Corp",
    inviteCode: "INVITE2024",
    metadata: {
      source: "website",
      campaign: "spring2024",
      referralCode: "FRIEND20"
    }
  })
}
```

#### User Login

```typescript
mutation {
  login({
    email: "john@example.com",
    password: "SecurePassword123!",
    rememberMe: true,
    twoFactorCode: "123456", // Required if 2FA enabled
    deviceInfo: {
      userAgent: "Mozilla/5.0...",
      platform: "web",
      deviceId: "device-uuid"
    }
  })
}
```

#### Social Authentication

```typescript
mutation {
  authenticateWithProvider({
    provider: "google", // google, github, discord, apple, microsoft
    code: "authorization_code",
    state: "random_state_string",
    redirectUri: "https://app.example.com/auth/callback",
    createOrganization: true,
    invitationId: "org-invite-123"
  })
}
```

#### Two-Factor Authentication Setup

```typescript
mutation {
  setupTwoFactor({
    method: "totp" // totp, sms, email
  })
}

// Returns QR code for TOTP setup
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "secret": "JBSWY3DPEHPK3PXP",
  "backupCodes": ["12345678", "87654321", ...]
}
```

#### Verify Two-Factor Authentication

```typescript
mutation {
  verifyTwoFactor({
    code: "123456",
    secret: "JBSWY3DPEHPK3PXP"
  })
}
```

### Session Management

#### Refresh Access Token

```typescript
mutation {
  refreshToken({
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    deviceId: "device-uuid"
  })
}
```

#### Logout User

```typescript
mutation {
  logout({
    allDevices: false, // Logout from all devices if true
    deviceId: "device-uuid" // Optional: logout specific device
  })
}
```

#### Get Active Sessions

```typescript
query {
  getActiveSessions({
    userId: "user-123",
    includeDetails: true
  })
}
```

#### Revoke Session

```typescript
mutation {
  revokeSession({
    sessionId: "session-123",
    reason: "suspicious_activity"
  })
}
```

### Password Management

#### Request Password Reset

```typescript
mutation {
  forgotPassword({
    email: "john@example.com",
    resetMethod: "email", // email, sms
    redirectUrl: "https://app.example.com/reset-password"
  })
}
```

#### Reset Password

```typescript
mutation {
  resetPassword({
    token: "reset_token_123",
    newPassword: "NewSecurePassword456!",
    confirmPassword: "NewSecurePassword456!"
  })
}
```

#### Change Password

```typescript
mutation {
  changePassword({
    currentPassword: "SecurePassword123!",
    newPassword: "NewSecurePassword456!",
    logoutOtherDevices: true
  })
}
```

### Organization Management

#### Create Organization

```typescript
mutation {
  createOrganization({
    name: "Tech Corp",
    slug: "tech-corp",
    description: "Technology solutions company",
    settings: {
      allowInvites: true,
      requireApproval: false,
      defaultRole: "member",
      domains: ["techcorp.com", "tech-corp.io"]
    },
    subscriptionPlan: "professional"
  })
}
```

#### Invite User to Organization

```typescript
mutation {
  inviteUser({
    organizationId: "org-123",
    email: "jane@example.com",
    role: "admin", // owner, admin, member, viewer
    message: "Join our team at Tech Corp!",
    expiresAt: "2024-02-01T00:00:00Z",
    metadata: {
      department: "Engineering",
      invitedBy: "john@example.com"
    }
  })
}
```

#### Accept Organization Invitation

```typescript
mutation {
  acceptInvitation({
    invitationId: "invite-123",
    user: {
      firstName: "Jane",
      lastName: "Smith",
      password: "SecurePassword789!"
    }
  })
}
```

## Integration Examples

### React Authentication Hook

```typescript
import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  organization?: {
    id: string;
    name: string;
    role: string;
  };
  permissions: string[];
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const refreshMutation = trpc.auth.refreshToken.useMutation();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Validate token and get user data
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token invalid, try refresh
          await refreshToken();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: {
    email: string;
    password: string;
    twoFactorCode?: string;
    rememberMe?: boolean;
  }) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      
      if (result.success) {
        localStorage.setItem('accessToken', result.token);
        localStorage.setItem('refreshToken', result.refreshToken);
        
        if (credentials.rememberMe) {
          localStorage.setItem('rememberUser', 'true');
        }
        
        setUser(result.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName?: string;
    inviteCode?: string;
  }) => {
    try {
      const result = await registerMutation.mutateAsync(userData);
      
      if (result.success) {
        localStorage.setItem('accessToken', result.token);
        localStorage.setItem('refreshToken', result.refreshToken);
        setUser(result.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async (allDevices = false) => {
    try {
      await logoutMutation.mutateAsync({ allDevices });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const result = await refreshMutation.mutateAsync({ refreshToken });
      
      if (result.success) {
        localStorage.setItem('accessToken', result.token);
        localStorage.setItem('refreshToken', result.refreshToken);
        return true;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      return false;
    }
  };

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role: string) => {
    return user?.organization?.role === role;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
    checkAuthStatus,
    hasPermission,
    hasRole
  };
};
```

### Authentication Provider Component

```typescript
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: (allDevices?: boolean) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiresAt = payload.exp * 1000;
          const timeUntilExpiry = expiresAt - Date.now();
          
          // Refresh 5 minutes before expiry
          if (timeUntilExpiry < 5 * 60 * 1000) {
            await auth.refreshToken();
          }
        } catch (error) {
          console.error('Token parsing error:', error);
        }
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(refreshInterval);
  }, [auth.isAuthenticated, auth.refreshToken]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
```

### Login Form Component

```typescript
import { useState } from 'react';
import { useAuthContext } from './AuthProvider';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

  const { login } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Login successful, redirect or show success message
        window.location.href = '/dashboard';
      } else {
        if (result.error?.includes('2FA')) {
          setRequiresTwoFactor(true);
        }
        setErrors({ general: result.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="login-form">
      <h2>Sign In</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {requiresTwoFactor && (
          <div className="form-group">
            <label htmlFor="twoFactorCode">Two-Factor Code</label>
            <input
              type="text"
              id="twoFactorCode"
              value={formData.twoFactorCode}
              onChange={(e) => handleInputChange('twoFactorCode', e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className={errors.twoFactorCode ? 'error' : ''}
              required
            />
            {errors.twoFactorCode && <span className="error-message">{errors.twoFactorCode}</span>}
          </div>
        )}

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
            />
            Remember me
          </label>
        </div>

        {errors.general && (
          <div className="error-message general">{errors.general}</div>
        )}

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="form-links">
        <a href="/forgot-password">Forgot your password?</a>
        <a href="/register">Don't have an account? Sign up</a>
      </div>

      <div className="social-login">
        <p>Or sign in with:</p>
        <div className="social-buttons">
          <a href="/auth/google" className="social-button google">
            Continue with Google
          </a>
          <a href="/auth/github" className="social-button github">
            Continue with GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Protected Route Component

```typescript
import { useEffect } from 'react';
import { useAuthContext } from './AuthProvider';
import { useRouter } from 'next/router';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallbackPath?: string;
}

function ProtectedRoute({ 
  children, 
  requiredPermission, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`${fallbackPath}?redirect=${router.asPath}`);
      return;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/unauthorized');
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, isLoading, requiredPermission, requiredRole, router, fallbackPath, hasPermission, hasRole]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <div>Access denied. Insufficient permissions.</div>;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <div>Access denied. Insufficient role.</div>;
  }

  return <>{children}</>;
}

// Usage example
function Dashboard() {
  return (
    <ProtectedRoute requiredPermission="dashboard.view">
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </ProtectedRoute>
  );
}

function AdminPanel() {
  return (
    <ProtectedRoute requiredRole="admin">
      <h1>Admin Panel</h1>
      {/* Admin content */}
    </ProtectedRoute>
  );
}
```

## Advanced Features

### Two-Factor Authentication Implementation

```typescript
// QR Code generation for TOTP
import QRCode from 'qrcode';

const generateTOTPQRCode = async (secret: string, userEmail: string) => {
  const otpauthUrl = `otpauth://totp/Katalyst:${userEmail}?secret=${secret}&issuer=Katalyst`;
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
};

// TOTP verification using speakeasy
import speakeasy from 'speakeasy';

const verifyTOTP = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps before and after
    time: Math.floor(Date.now() / 1000)
  });
};

// SMS 2FA using Twilio
import twilio from 'twilio';

const sendSMSCode = async (phoneNumber: string, code: string) => {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  try {
    await client.messages.create({
      body: `Your Katalyst verification code is: ${code}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
};
```

### Session Security

```typescript
// Device fingerprinting
const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvas.toDataURL(),
    webgl: getWebGLFingerprint()
  };
  
  return btoa(JSON.stringify(fingerprint));
};

// Anomaly detection
const detectSuspiciousActivity = (loginAttempt: any, userHistory: any[]) => {
  const anomalies = [];
  
  // Check for unusual location
  if (userHistory.length > 0) {
    const lastLogin = userHistory[0];
    const distance = calculateDistance(
      loginAttempt.location,
      lastLogin.location
    );
    
    if (distance > 1000) { // More than 1000km from last login
      anomalies.push('unusual_location');
    }
  }
  
  // Check for unusual device
  const knownDevices = userHistory.map(login => login.deviceId);
  if (!knownDevices.includes(loginAttempt.deviceId)) {
    anomalies.push('new_device');
  }
  
  // Check for unusual time
  const currentHour = new Date().getHours();
  const usualHours = userHistory.map(login => new Date(login.timestamp).getHours());
  const usualHourRange = getUsualHourRange(usualHours);
  
  if (currentHour < usualHourRange.min || currentHour > usualHourRange.max) {
    anomalies.push('unusual_time');
  }
  
  return anomalies;
};
```

### Password Security

```typescript
// Password strength validation
const validatePasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    notCommon: !isCommonPassword(password),
    notPersonal: !containsPersonalInfo(password)
  };
  
  const strength = Object.values(checks).filter(Boolean).length;
  
  return {
    score: strength,
    maxScore: Object.keys(checks).length,
    checks,
    isValid: strength >= 4, // Require at least 4 criteria
    suggestions: generatePasswordSuggestions(checks)
  };
};

// Rate limiting for authentication attempts
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }
  
  if (record.count >= maxAttempts) {
    return { 
      allowed: false, 
      remainingAttempts: 0,
      resetTime: record.resetTime
    };
  }
  
  record.count++;
  return { 
    allowed: true, 
    remainingAttempts: maxAttempts - record.count 
  };
};
```

## Best Practices

### Security Implementation

1. **Use HTTPS** - Always serve authentication over secure connections
2. **Implement rate limiting** - Prevent brute force attacks
3. **Use secure cookies** - Set HttpOnly, Secure, and SameSite attributes
4. **Validate input** - Sanitize and validate all user input
5. **Monitor for anomalies** - Detect and flag suspicious activity

### Password Management

1. **Strong password policies** - Require complexity and length
2. **Secure password storage** - Use bcrypt with appropriate salt rounds
3. **Password history** - Prevent reuse of recent passwords
4. **Secure reset flows** - Use single-use, time-limited tokens
5. **Educate users** - Provide guidance on password security

### Session Management

1. **Short token lifetimes** - Use refresh tokens for long-term sessions
2. **Secure token storage** - Store tokens in httpOnly cookies or secure storage
3. **Session invalidation** - Provide logout and session management
4. **Device management** - Allow users to review and revoke sessions
5. **Concurrent session limits** - Limit active sessions per user

This comprehensive Authentication API documentation provides everything needed to build secure authentication systems with the Katalyst framework, from basic login flows to advanced security features like two-factor authentication and anomaly detection.
