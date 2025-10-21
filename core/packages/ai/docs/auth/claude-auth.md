# Claude Code Authentication

The `ClaudeCodeAuth` class handles Google Sign-In authentication for Claude Code Max plan, providing secure OAuth2 integration with token management and caching.

## Overview

`ClaudeCodeAuth` provides:
- Google OAuth2 authentication flow
- Secure token storage and encryption
- Automatic token refresh
- Browser-based authentication
- HTML response pages for user feedback
- Local HTTP server for OAuth callbacks

## Usage Examples

### Basic Authentication

```typescript
import { ClaudeCodeAuth } from '@katalyst/ai';

const auth = new ClaudeCodeAuth({
  clientId: 'your-google-client-id',
  redirectUri: 'http://localhost:3000/callback',
  port: 3000,
  cachePath: './auth-cache.json'
});

// Listen to authentication events
auth.on('authenticated', (token) => {
  console.log('Authenticated as:', token.userEmail);
  console.log('Access token:', token.accessToken);
});

auth.on('auth:error', (error) => {
  console.error('Authentication failed:', error);
});

// Start authentication process
try {
  const token = await auth.authenticate();
  console.log('Successfully authenticated!');
} catch (error) {
  console.error('Authentication error:', error);
}
```

### Using with Claude Agent Max

```typescript
import { ClaudeCodeAuth, ClaudeAgentMax } from '@katalyst/ai';

// Create authentication instance
const auth = new ClaudeCodeAuth();

// Create Claude Agent Max with authentication
const agent = new ClaudeAgentMax({
  name: 'Max Agent',
  useAuthentication: true
});

// The agent will handle authentication automatically
await agent.authenticate();

// Check authentication status
if (auth.isAuthenticated()) {
  const token = auth.getToken();
  console.log('User:', token?.userEmail);
}
```

### Custom Authentication Configuration

```typescript
const auth = new ClaudeCodeAuth({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  redirectUri: 'http://localhost:8080/auth/callback',
  port: 8080,
  cachePath: path.join(os.homedir(), '.my-app', 'claude-auth.json')
});

// Custom error handling
auth.on('auth:error', (error) => {
  if (error.message.includes('access_denied')) {
    console.log('User denied access permissions');
  } else {
    console.error('Authentication error:', error);
  }
});

// Custom success handling
auth.on('authenticated', (token) => {
  // Store token in your application's secure storage
  secureStore.set('claude_token', token);
  
  // Log authentication event
  audit.log('user_authenticated', {
    email: token.userEmail,
    timestamp: new Date().toISOString()
  });
});
```

### Token Management

```typescript
const auth = new ClaudeCodeAuth();

// Check if already authenticated
if (auth.isAuthenticated()) {
  console.log('Already authenticated');
} else {
  // Authenticate
  await auth.authenticate();
}

// Get current token
const token = auth.getToken();
if (token) {
  console.log('Token expires at:', new Date(token.expiryDate!));
  
  // Check if token needs refresh
  if (token.expiryDate && token.expiryDate < Date.now()) {
    console.log('Token expired, refreshing...');
    const refreshedToken = await auth.refreshToken();
    console.log('Token refreshed');
  }
}

// Sign out
await auth.signOut();
console.log('Signed out successfully');
```

## API Reference

### Constructor

```typescript
constructor(config?: ClaudeAuthConfig)
```

### Configuration

#### ClaudeAuthConfig

```typescript
interface ClaudeAuthConfig {
  clientId?: string;
  redirectUri?: string;
  port?: number;
  cachePath?: string;
}
```

#### ClaudeAuthToken

```typescript
interface ClaudeAuthToken {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiryDate?: number;
  userEmail?: string;
  userName?: string;
}
```

### Methods

#### Authentication

**authenticate(): Promise<ClaudeAuthToken>**
Start the authentication flow with Google Sign-In.

**refreshToken(): Promise<ClaudeAuthToken>**
Refresh the access token using the refresh token.

**signOut(): Promise<void>**
Sign out and clear cached tokens.

#### Token Management

**getToken(): ClaudeAuthToken | undefined**
Get the current authentication token.

**isAuthenticated(): boolean**
Check if currently authenticated with a valid token.

#### Events

The authentication system emits various events:

- **'authenticated'**: Fired when authentication succeeds
- **'auth:start'**: Fired when authentication process starts
- **'auth:error'**: Fired when authentication fails
- **'auth:success'**: Fired when OAuth callback succeeds
- **'already:authenticated'**: Fired when already authenticated
- **'signed:out'**: Fired when sign out completes
- **'token:refreshed'**: Fired when token is refreshed
- **'token:cached'**: Fired when token is cached
- **'token:loaded'**: Fired when token is loaded from cache
- **'cache:error'**: Fired when cache operation fails
- **'server:started'**: Fired when callback server starts
- **'server:stopped'**: Fired when callback server stops

## Authentication Flow

The authentication process follows these steps:

1. **Check Cache**: Look for valid cached tokens
2. **Start Server**: Launch local HTTP server for OAuth callback
3. **Generate URL**: Create Google OAuth authorization URL
4. **Open Browser**: Redirect user to Google Sign-In
5. **Handle Callback**: Process OAuth response on callback
6. **Exchange Tokens**: Exchange authorization code for tokens
7. **Cache Tokens**: Securely store tokens for future use

### OAuth Scopes

The authentication requests these scopes:
- `https://www.googleapis.com/auth/userinfo.email` - User email
- `https://www.googleapis.com/auth/userinfo.profile` - User profile
- `openid` - OpenID Connect

## Security Features

### Token Encryption

Tokens are encrypted using AES-256-CBC with a key derived from the hostname:

```typescript
private encryptToken(token: ClaudeAuthToken): any {
  const key = crypto.scryptSync(os.hostname(), 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(JSON.stringify(token), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    data: encrypted,
    iv: iv.toString('hex')
  };
}
```

### Secure Storage

- Tokens are encrypted before disk storage
- Cache files are stored in user home directory
- Automatic token expiration handling
- Secure token refresh mechanism

## Integration Patterns

### Application Integration

```typescript
class ClaudeAuthManager {
  private auth: ClaudeCodeAuth;
  private isAuthenticated = false;

  constructor() {
    this.auth = new ClaudeCodeAuth({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      port: 3000
    });
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.auth.on('authenticated', (token) => {
      this.isAuthenticated = true;
      this.onAuthenticated(token);
    });

    this.auth.on('auth:error', (error) => {
      this.isAuthenticated = false;
      this.onAuthError(error);
    });
  }

  async ensureAuthenticated(): Promise<boolean> {
    if (this.auth.isAuthenticated()) {
      return true;
    }

    try {
      await this.auth.authenticate();
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  private onAuthenticated(token: ClaudeAuthToken) {
    // Update application state
    appState.setUser({
      email: token.userEmail,
      name: token.userName,
      authenticated: true
    });

    // Notify other components
    eventBus.emit('user:authenticated', token);
  }

  private onAuthError(error: Error) {
    // Handle authentication errors
    appState.setUser({ authenticated: false });
    eventBus.emit('auth:error', error);
  }
}
```

### Express.js Integration

```typescript
import express from 'express';
import { ClaudeCodeAuth } from '@katalyst/ai';

const app = express();
const auth = new ClaudeCodeAuth();

// Authentication routes
app.get('/auth/login', async (req, res) => {
  try {
    await auth.authenticate();
    res.json({ success: true, message: 'Authentication initiated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/auth/status', (req, res) => {
  const authenticated = auth.isAuthenticated();
  const token = auth.getToken();
  
  res.json({
    authenticated,
    user: token ? {
      email: token.userEmail,
      name: token.userName
    } : null
  });
});

app.post('/auth/logout', async (req, res) => {
  try {
    await auth.signOut();
    res.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/auth/refresh', async (req, res) => {
  try {
    const token = await auth.refreshToken();
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### React Integration

```typescript
import React, { useState, useEffect } from 'react';
import { ClaudeCodeAuth } from '@katalyst/ai';

function AuthComponent() {
  const [auth, setAuth] = useState<ClaudeCodeAuth | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authInstance = new ClaudeCodeAuth();
    setAuth(authInstance);

    // Check initial auth state
    setIsAuthenticated(authInstance.isAuthenticated());
    const token = authInstance.getToken();
    if (token) {
      setUser({ email: token.userEmail, name: token.userName });
    }

    // Setup event listeners
    authInstance.on('authenticated', (token) => {
      setIsAuthenticated(true);
      setUser({ email: token.userEmail, name: token.userName });
      setLoading(false);
    });

    authInstance.on('auth:error', (error) => {
      setLoading(false);
      // Handle error (show toast, etc.)
    });

    return () => {
      authInstance.removeAllListeners();
    };
  }, []);

  const handleLogin = async () => {
    if (!auth) return;
    
    setLoading(true);
    try {
      await auth.authenticate();
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    
    try {
      await auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      // Handle error
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name} ({user?.email})</p>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
}
```

## Best Practices

1. **Environment Variables**: Store client ID and secrets in environment variables.

2. **Error Handling**: Implement comprehensive error handling for all authentication flows.

3. **Token Validation**: Always validate token expiration before use.

4. **Secure Storage**: Use the built-in encryption for token storage.

5. **Event Handling**: Listen to authentication events for proper state management.

6. **Retry Logic**: Implement retry logic for network failures during authentication.

7. **User Experience**: Provide clear feedback during authentication process.

8. **Security**: Validate redirect URIs and implement CSRF protection.

## Error Handling

```typescript
class RobustClaudeAuth extends ClaudeCodeAuth {
  constructor(config?: ClaudeAuthConfig) {
    super(config);
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.on('auth:error', async (error) => {
      if (error.message.includes('popup_blocked')) {
        console.warn('Popup was blocked, please allow popups for this site');
        // Show user-friendly message
      } else if (error.message.includes('access_denied')) {
        console.log('User denied access permissions');
        // Handle user cancellation
      } else if (error.message.includes('network')) {
        console.error('Network error during authentication');
        // Implement retry logic
        setTimeout(() => this.authenticate(), 5000);
      }
    });

    this.on('cache:error', (error) => {
      console.error('Cache error:', error);
      // Fallback to memory storage or re-authenticate
    });
  }

  async authenticateWithRetry(maxRetries = 3): Promise<ClaudeAuthToken> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.authenticate();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        console.warn(`Authentication attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
    
    throw new Error('Authentication failed after maximum retries');
  }
}
```

## Testing

```typescript
import { ClaudeCodeAuth } from '@katalyst/ai';

describe('ClaudeCodeAuth', () => {
  let auth: ClaudeCodeAuth;

  beforeEach(() => {
    auth = new ClaudeCodeAuth({
      clientId: 'test-client-id',
      port: 3001 // Use different port for tests
    });
  });

  afterEach(async () => {
    await auth.signOut();
  });

  test('should initialize with default config', () => {
    const defaultAuth = new ClaudeCodeAuth();
    expect(defaultAuth).toBeDefined();
  });

  test('should handle authentication events', (done) => {
    auth.on('auth:start', () => {
      console.log('Authentication started');
    });

    auth.on('authenticated', (token) => {
      expect(token.accessToken).toBeDefined();
      done();
    });

    // Mock authentication for testing
    // In real tests, you'd mock the OAuth flow
  });

  test('should cache and load tokens', async () => {
    const mockToken: ClaudeAuthToken = {
      accessToken: 'test-access-token',
      userEmail: 'test@example.com',
      userName: 'Test User',
      expiryDate: Date.now() + 3600000 // 1 hour from now
    };

    // Mock cache operations
    auth['authToken'] = mockToken;
    expect(auth.isAuthenticated()).toBe(true);

    const loadedToken = auth.getToken();
    expect(loadedToken?.userEmail).toBe('test@example.com');
  });

  test('should handle token refresh', async () => {
    // Mock expired token
    const expiredToken: ClaudeAuthToken = {
      accessToken: 'expired-token',
      refreshToken: 'valid-refresh-token',
      expiryDate: Date.now() - 1000 // Expired
    };

    auth['authToken'] = expiredToken;
    
    // Mock refresh token flow
    const newToken = await auth.refreshToken();
    expect(newToken.accessToken).toBeDefined();
  });
});
```
