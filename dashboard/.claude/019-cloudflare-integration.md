# Cloudflare Integration & Edge AI

This document covers the complete Cloudflare integration including Workers, Pages, KV, D1, R2, and Claude Code AI running on the edge.

## 🌐 Overview

Our Cloudflare integration provides:
- **Claude Code Worker**: AI development assistance running on the edge
- **Edge Components**: React components optimized for Cloudflare Pages
- **KV Storage**: Type-safe edge caching and state management
- **D1 Database**: SQL database with React hooks and migrations
- **R2 Storage**: Object storage with S3-compatible API
- **Edge AI**: Real-time AI processing at 250+ locations worldwide

## 🚀 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Global Edge Network                       │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│  │   Workers   │   Pages     │      KV     │      D1     │   │
│  │             │             │             │             │   │
│  │ Claude Code │   React     │   Cache &   │  SQL DB &   │   │
│  │     AI      │ Components  │    State    │ Migrations  │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┘   │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│  │      R2     │    CDN      │  Analytics  │   Security  │   │
│  │             │             │             │             │   │
│  │ Object      │ Static      │   Logs &    │  WAF & Bot  │   │
│  │ Storage     │ Assets      │  Metrics    │ Management  │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Anthropic API   │
                    │  (Claude 3 Opus) │
                    └──────────────────┘
```

## ⚡ Quick Start

### 1. Deploy Claude Code Worker

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
cd .cloudflare/workers
wrangler publish claude-code-worker.js
```

### 2. Set Environment Variables

```bash
# Required secrets
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_WEBHOOK_SECRET

# Optional platform secrets
wrangler secret put LINEAR_API_KEY
wrangler secret put SLACK_BOT_TOKEN
wrangler secret put TELEGRAM_BOT_TOKEN
```

### 3. Create Resources

```bash
# Create KV namespaces
wrangler kv:namespace create "CACHE"
wrangler kv:namespace create "METRICS"

# Create D1 database
wrangler d1 create claude-code-db

# Create R2 bucket
wrangler r2 bucket create claude-code-storage
```

### 4. Deploy Pages Application

```bash
# Build and deploy Pages
npm run build
wrangler pages publish dist
```

## 🔧 Claude Code Worker

### Core Features

```javascript
// Code generation
const response = await fetch('/api/code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Create a React component for user authentication',
    language: 'typescript',
    framework: 'react'
  })
});

// Code review
const review = await fetch('/api/review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: '// your code here',
    language: 'javascript',
    focus: 'security' // comprehensive, security, performance, readability, bugs
  })
});

// Debug assistance
const debug = await fetch('/api/debug', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: '// problematic code',
    error: 'TypeError: Cannot read property...',
    context: 'React component mounting'
  })
});
```

### Streaming AI Chat

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'How do I optimize React performance?',
    context: [] // Previous conversation
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Process streaming response
}
```

## 🎨 Edge Components

### Basic Usage

```tsx
import {
  EdgeComponent,
  AIEdgeComponent,
  StreamingAIComponent,
  useEdgeData
} from './.cloudflare/pages/components/CloudflareEdgeComponent';

// Edge-cached component
function CachedComponent() {
  return (
    <EdgeComponent 
      cacheKey="user-profile" 
      revalidate={3600}
      fallback={<div>Loading...</div>}
    >
      <UserProfile />
    </EdgeComponent>
  );
}

// AI-enhanced component
function EnhancedContent() {
  return (
    <AIEdgeComponent 
      prompt="Make this content more engaging"
      enhance={true}
    >
      <div>Original content here</div>
    </AIEdgeComponent>
  );
}

// Streaming AI responses
function AIChat() {
  return (
    <StreamingAIComponent
      endpoint="/api/chat"
      prompt="Explain async/await in JavaScript"
      onChunk={(chunk) => console.log('Received:', chunk)}
    />
  );
}
```

### Geolocation & A/B Testing

```tsx
// Region-specific content
function GeoContent() {
  return (
    <GeoComponent
      regions={{
        'US': <div>🇺🇸 US-specific content</div>,
        'EU': <div>🇪🇺 EU-specific content</div>,
        'APAC': <div>🌏 APAC-specific content</div>
      }}
    >
      <div>Default content</div>
    </GeoComponent>
  );
}

// A/B testing
function ABTestContent() {
  return (
    <ABTestComponent
      variants={{
        'A': <div className="bg-blue-500">Version A</div>,
        'B': <div className="bg-green-500">Version B</div>
      }}
      defaultVariant="A"
    />
  );
}
```

### Rate Limiting & Caching

```tsx
// Rate-limited API calls
function LimitedAPIComponent() {
  return (
    <RateLimitedComponent limit={100} window={60}>
      <ExpensiveAPICall />
    </RateLimitedComponent>
  );
}

// Edge caching
function CachedAPIData() {
  return (
    <EdgeCache 
      cacheKey="api-data" 
      ttl={3600} 
      staleWhileRevalidate={86400}
    >
      <APIDataComponent />
    </EdgeCache>
  );
}
```

## 🗃️ KV Storage

### Basic Operations

```typescript
import { useKVStore, createKVStore } from './.cloudflare/storage/kv-store';

// React hook usage
function UserSettings() {
  const {
    value: settings,
    loading,
    error,
    setValue,
    remove
  } = useKVStore<UserSettings>('user-settings', 'user-123', {
    theme: 'dark',
    notifications: true
  });

  const updateTheme = async (theme: string) => {
    await setValue({ ...settings, theme }, {
      expirationTtl: 86400 // 24 hours
    });
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Theme: {settings?.theme}</h3>
      <button onClick={() => updateTheme('light')}>
        Switch to Light
      </button>
    </div>
  );
}

// Direct client usage
const kv = createKVStore('cache');

await kv.put('session:abc123', { userId: 1, role: 'admin' }, {
  expirationTtl: 3600,
  metadata: { created: Date.now() }
});

const session = await kv.get<Session>('session:abc123');
```

### Advanced Features

```typescript
import { 
  KVCache, 
  NamespacedKV, 
  KVBatch 
} from './.cloudflare/storage/kv-store';

// Memory + KV caching
const cache = new KVCache('api-cache', 60000); // 1 minute memory TTL
const data = await cache.get('user:123');

// Namespaced operations
const userKV = new NamespacedKV('app-data', 'users');
await userKV.put('profile:123', userProfile);

// Batch operations
const batch = new KVBatch()
  .put('key1', 'value1')
  .put('key2', 'value2')
  .delete('key3');

await batch.execute(kv);
```

### List Operations

```typescript
// List with React hook
function KVExplorer() {
  const {
    keys,
    loading,
    hasMore,
    loadMore,
    refresh
  } = useKVList('app-data', {
    prefix: 'user:',
    limit: 20
  });

  return (
    <div>
      {keys.map(key => (
        <div key={key.name}>
          {key.name} (expires: {key.expiration})
        </div>
      ))}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
}
```

## 🗄️ D1 Database

### React Hooks

```typescript
import { useD1Query, useD1Mutation } from './.cloudflare/storage/d1-database';

function UserList() {
  const {
    data: users,
    loading,
    error,
    refetch
  } = useD1Query<User>(
    'claude-code-db',
    'SELECT * FROM users WHERE active = ?',
    [true],
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  const { execute: deleteUser, loading: deleting } = useD1Mutation('claude-code-db');

  const handleDelete = async (userId: number) => {
    await deleteUser('DELETE FROM users WHERE id = ?', [userId]);
    refetch(); // Refresh the list
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          {user.name} ({user.email})
          <button 
            onClick={() => handleDelete(user.id)}
            disabled={deleting}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Query Builder

```typescript
import { createD1QueryBuilder } from './.cloudflare/storage/d1-database';

const query = createD1QueryBuilder()
  .select('users.name', 'profiles.avatar')
  .from('users')
  .leftJoin('profiles', 'users.id = profiles.user_id')
  .where('users.active = ?', true)
  .where('users.created_at > ?', new Date('2024-01-01'))
  .orderBy('users.created_at', 'DESC')
  .limit(10);

const { query: sql, params } = query.build();
// SELECT users.name, profiles.avatar FROM users LEFT JOIN profiles ON users.id = profiles.user_id WHERE users.active = ? AND users.created_at > ? ORDER BY users.created_at DESC LIMIT 10
```

### Migrations

```typescript
import { createD1Migrator } from './.cloudflare/storage/d1-database';

const migrations = [
  {
    version: 1,
    name: 'create_users_table',
    up: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    down: 'DROP TABLE users'
  },
  {
    version: 2,
    name: 'add_user_profiles',
    up: `
      CREATE TABLE profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        avatar TEXT,
        bio TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `,
    down: 'DROP TABLE profiles'
  }
];

const migrator = createD1Migrator('claude-code-db', migrations);

// Run migrations
await migrator.up(); // Run all pending
await migrator.up(2); // Run up to version 2

// Rollback
await migrator.down(1); // Rollback to version 1
```

### Transactions

```typescript
import { createD1Transaction } from './.cloudflare/storage/d1-database';

async function createUserWithProfile(userData: User, profileData: Profile) {
  const tx = createD1Transaction('claude-code-db');
  
  try {
    // Insert user
    const userStmt = tx.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?) RETURNING id'
    ).bind(userData.name, userData.email);
    
    // Insert profile
    const profileStmt = tx.prepare(
      'INSERT INTO profiles (user_id, avatar, bio) VALUES (?, ?, ?)'
    ).bind(userData.id, profileData.avatar, profileData.bio);
    
    await tx.commit();
    console.log('User and profile created successfully');
  } catch (error) {
    await tx.rollback();
    console.error('Transaction failed:', error);
    throw error;
  }
}
```

## 📦 R2 Storage

### File Upload & Management

```typescript
import { useR2Upload, useR2Object, useR2List } from './.cloudflare/storage/r2-storage';

function FileUploader() {
  const { upload, uploading, progress, error } = useR2Upload('my-bucket');

  const handleUpload = async (file: File) => {
    try {
      const result = await upload(`uploads/${file.name}`, file, {
        httpMetadata: {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000' // 1 year
        },
        customMetadata: {
          uploadedBy: 'user-123',
          originalName: file.name
        }
      });
      console.log('Upload complete:', result);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && (
        <div>
          Uploading... {progress}%
          <progress value={progress} max={100} />
        </div>
      )}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

### File Browser

```typescript
function FileBrowser() {
  const {
    objects,
    loading,
    hasMore,
    loadMore,
    refresh
  } = useR2List('my-bucket', {
    prefix: 'uploads/',
    limit: 20
  });

  return (
    <div>
      <h3>Files ({objects.length})</h3>
      <button onClick={refresh}>Refresh</button>
      
      {objects.map(obj => (
        <FileItem key={obj.key} object={obj} />
      ))}
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
}

function FileItem({ object }: { object: R2Object }) {
  const { data, loading, metadata } = useR2Object('my-bucket', object.key);

  return (
    <div className="file-item">
      <h4>{object.key}</h4>
      <p>Size: {formatBytes(object.size)}</p>
      <p>Modified: {object.uploaded.toLocaleString()}</p>
      <p>Type: {object.httpMetadata?.contentType}</p>
      
      {data && (
        <a
          href={URL.createObjectURL(data)}
          download={object.key.split('/').pop()}
        >
          Download
        </a>
      )}
    </div>
  );
}
```

### Image Optimization

```typescript
import { useR2Image } from './.cloudflare/storage/r2-storage';

function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  const { src: optimizedSrc, loading, error } = useR2Image('images', src, {
    width: 400,
    height: 300,
    quality: 85,
    format: 'webp'
  });

  if (loading) return <div>Loading image...</div>;
  if (error) return <div>Failed to load image</div>;

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      loading="lazy"
      style={{ width: 400, height: 300, objectFit: 'cover' }}
    />
  );
}
```

### Multipart Upload for Large Files

```typescript
import { createR2MultipartUpload } from './.cloudflare/storage/r2-storage';

async function uploadLargeFile(file: File) {
  const upload = createR2MultipartUpload('large-files', `uploads/${file.name}`);
  
  try {
    await upload.initiate({
      httpMetadata: { contentType: file.type }
    });

    const chunkSize = 10 * 1024 * 1024; // 10MB chunks
    const chunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      await upload.uploadPart(i + 1, chunk);
      console.log(`Uploaded part ${i + 1}/${chunks}`);
    }

    const result = await upload.complete();
    console.log('Large file upload complete:', result);
  } catch (error) {
    await upload.abort();
    console.error('Upload failed:', error);
  }
}
```

## 🔗 Integration Patterns

### Full-Stack AI Development

```typescript
// Component that uses all Cloudflare services
function AICodeEditor() {
  // D1 for storing code snippets
  const { data: snippets } = useD1Query<CodeSnippet>(
    'claude-code-db',
    'SELECT * FROM code_snippets WHERE user_id = ?',
    [userId]
  );

  // KV for caching AI responses
  const { value: cachedResponse, setValue: setCachedResponse } = useKVStore(
    'ai-cache',
    `code-analysis-${codeHash}`
  );

  // R2 for storing large files/exports
  const { upload } = useR2Upload('code-exports');

  const analyzeCode = async (code: string) => {
    // Check cache first
    if (cachedResponse) return cachedResponse;

    // Call Claude Code Worker
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: 'typescript' })
    });

    const analysis = await response.json();
    
    // Cache for future use
    await setCachedResponse(analysis, { expirationTtl: 3600 });
    
    return analysis;
  };

  const exportProject = async () => {
    const zip = await createProjectZip(snippets);
    await upload(`exports/project-${Date.now()}.zip`, zip);
  };

  return (
    <div>
      <CodeEditor onAnalyze={analyzeCode} />
      <button onClick={exportProject}>Export Project</button>
    </div>
  );
}
```

### Real-time Collaboration

```typescript
// WebSocket with edge state management
function CollaborativeEditor() {
  const [document, setDocument] = useState('');
  const { setValue: updateKV } = useKVStore('documents', documentId);
  
  useEffect(() => {
    const ws = new WebSocket('wss://claude-code.yourname.workers.dev/ws');
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setDocument(update.content);
      
      // Persist to KV with conflict resolution
      updateKV(update, { expirationTtl: 86400 });
    };

    return () => ws.close();
  }, [documentId]);

  return (
    <div>
      <textarea
        value={document}
        onChange={(e) => {
          setDocument(e.target.value);
          // Debounced sync to edge
        }}
      />
    </div>
  );
}
```

## 📊 Monitoring & Analytics

### Built-in Metrics

```typescript
// Track usage and performance
async function trackAIUsage(endpoint: string, tokens: number) {
  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'ai_request',
      data: {
        endpoint,
        tokens,
        timestamp: Date.now(),
        region: Cloudflare.cf.colo // Edge location
      }
    })
  });
}

// Get usage metrics
const metrics = await fetch('/health').then(r => r.json());
console.log('AI requests today:', metrics.metrics.ai_requests);
```

### Performance Monitoring

```typescript
// Edge performance tracking
function useEdgePerformance() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('/api/')) {
          // Track API response times
          fetch('/api/metrics', {
            method: 'POST',
            body: JSON.stringify({
              api: entry.name,
              duration: entry.duration,
              region: navigator.language
            })
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });
    return () => observer.disconnect();
  }, []);
}
```

## 🔒 Security & Best Practices

### Authentication & Authorization

```typescript
// Edge authentication
async function authenticateRequest(request: Request): Promise<User | null> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;

  // Check KV cache first
  const cached = await KV_AUTH.get(`token:${token}`);
  if (cached) return JSON.parse(cached);

  // Validate with external service
  const user = await validateToken(token);
  if (user) {
    // Cache for 5 minutes
    await KV_AUTH.put(`token:${token}`, JSON.stringify(user), {
      expirationTtl: 300
    });
  }

  return user;
}
```

### Rate Limiting

```typescript
// Advanced rate limiting
class EdgeRateLimiter {
  static async checkLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    const windowStart = Math.floor(now / (window * 1000)) * window * 1000;
    
    const requests = await KV_RATE_LIMIT.get(`${key}:${windowStart}`, 'json') || { count: 0 };
    
    if (requests.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    requests.count++;
    await KV_RATE_LIMIT.put(`${key}:${windowStart}`, JSON.stringify(requests), {
      expirationTtl: window * 2
    });

    return { allowed: true, remaining: limit - requests.count };
  }
}
```

## 🚀 Deployment & Configuration

### Complete Deployment Script

```bash
#!/bin/bash
# deploy-cloudflare.sh

echo "🚀 Deploying Cloudflare Claude Code Integration"

# 1. Deploy Worker
echo "📦 Deploying Worker..."
cd .cloudflare/workers
wrangler publish

# 2. Create KV Namespaces
echo "🗄️ Setting up KV..."
KV_CACHE_ID=$(wrangler kv:namespace create "CACHE" --preview | grep "id" | cut -d'"' -f4)
KV_METRICS_ID=$(wrangler kv:namespace create "METRICS" --preview | grep "id" | cut -d'"' -f4)

# 3. Create D1 Database
echo "💾 Setting up D1..."
D1_ID=$(wrangler d1 create claude-code-db | grep "database_id" | cut -d'"' -f4)

# 4. Create R2 Bucket
echo "📦 Setting up R2..."
wrangler r2 bucket create claude-code-storage

# 5. Update wrangler.toml with IDs
echo "⚙️ Updating configuration..."
sed -i "s/YOUR_KV_CACHE_ID/$KV_CACHE_ID/g" wrangler.toml
sed -i "s/YOUR_KV_METRICS_ID/$KV_METRICS_ID/g" wrangler.toml
sed -i "s/YOUR_D1_DATABASE_ID/$D1_ID/g" wrangler.toml

# 6. Deploy Pages
echo "🌐 Deploying Pages..."
cd ../../
npm run build
wrangler pages publish dist

# 7. Setup DNS
echo "🌍 Setting up DNS..."
wrangler dns create yourdomain.com claude-api

echo "✅ Deployment complete!"
echo "🔗 Worker URL: https://claude-code.yourdomain.workers.dev"
echo "🔗 Pages URL: https://claude-api.yourdomain.com"
```

### Environment Configuration

```bash
# .env.cloudflare
# Core Configuration
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_TOKEN=ghp_...
GITHUB_WEBHOOK_SECRET=...

# Platform Integrations
LINEAR_API_KEY=lin_api_...
SLACK_BOT_TOKEN=xoxb-...
TELEGRAM_BOT_TOKEN=...

# Cloudflare Configuration
CF_ACCOUNT_ID=...
CF_ZONE_ID=...
CF_API_TOKEN=...

# Database Configuration
D1_DATABASE_ID=...
KV_CACHE_ID=...
KV_METRICS_ID=...
R2_BUCKET_NAME=claude-code-storage
```

## 🎯 Use Cases & Examples

### 1. AI-Powered Code Review Service

```typescript
// Auto-review PRs with edge processing
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'POST' && new URL(request.url).pathname === '/webhook/github') {
      const payload = await request.json();
      
      if (payload.action === 'opened' && payload.pull_request) {
        // Get diff from GitHub
        const diff = await getGitHubDiff(payload.pull_request.diff_url, env.GITHUB_TOKEN);
        
        // AI review using Claude
        const review = await reviewCode(diff, env.ANTHROPIC_API_KEY);
        
        // Cache result
        await env.KV_CACHE.put(
          `review:${payload.pull_request.id}`,
          JSON.stringify(review),
          { expirationTtl: 86400 }
        );
        
        // Post review to GitHub
        await postGitHubReview(payload.pull_request, review, env.GITHUB_TOKEN);
      }
    }
    
    return new Response('OK');
  }
};
```

### 2. Global Code Snippet Manager

```typescript
// Sync code snippets across all edge locations
function useGlobalSnippets(userId: string) {
  const { data: snippets, setValue } = useKVStore<CodeSnippet[]>(
    'snippets',
    `user:${userId}`,
    []
  );

  const saveSnippet = async (snippet: CodeSnippet) => {
    const updated = [...(snippets || []), snippet];
    await setValue(updated, { expirationTtl: 31536000 }); // 1 year
    
    // Also save to D1 for persistence
    await d1.prepare(
      'INSERT INTO snippets (user_id, title, code, language) VALUES (?, ?, ?, ?)'
    ).bind(userId, snippet.title, snippet.code, snippet.language).run();
  };

  return { snippets, saveSnippet };
}
```

### 3. Real-time Collaborative IDE

```typescript
// WebSocket-powered collaborative coding
export class CollaborativeSession extends DurableObject {
  private sessions = new Map<string, WebSocket>();
  private document = '';

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') === 'websocket') {
      const [client, server] = Object.values(new WebSocketPair());
      
      await this.handleSession(server);
      return new Response(null, { status: 101, webSocket: client });
    }
    
    return new Response('Not found', { status: 404 });
  }

  async handleSession(websocket: WebSocket) {
    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, websocket);

    websocket.addEventListener('message', async (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'code_change') {
        this.document = data.content;
        
        // Broadcast to all sessions
        for (const [id, ws] of this.sessions) {
          if (id !== sessionId) {
            ws.send(JSON.stringify({
              type: 'document_update',
              content: this.document,
              author: data.author
            }));
          }
        }
      }
    });

    websocket.addEventListener('close', () => {
      this.sessions.delete(sessionId);
    });
  }
}
```

## 📈 Performance Optimization

### Edge Caching Strategies

```typescript
// Multi-layer caching
class EdgeCache {
  static async get<T>(key: string): Promise<T | null> {
    // 1. Memory cache (fastest)
    if (memoryCache.has(key)) {
      return memoryCache.get(key);
    }

    // 2. KV cache (edge locations)
    const kvData = await KV_CACHE.get(key);
    if (kvData) {
      const data = JSON.parse(kvData);
      memoryCache.set(key, data, 60000); // 1 minute memory cache
      return data;
    }

    // 3. Origin/database (slowest)
    return null;
  }

  static async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    // Store in all layers
    memoryCache.set(key, value, Math.min(ttl, 300) * 1000);
    await KV_CACHE.put(key, JSON.stringify(value), { expirationTtl: ttl });
  }
}
```

### Database Optimization

```typescript
// Connection pooling and query optimization
class OptimizedD1Client {
  private connections = new Map<string, D1Database>();

  async query<T>(
    database: string,
    sql: string,
    params: any[] = []
  ): Promise<T[]> {
    // Prepared statement caching
    const queryKey = `${database}:${sql}`;
    let stmt = this.preparedStatements.get(queryKey);
    
    if (!stmt) {
      const db = await this.getConnection(database);
      stmt = db.prepare(sql);
      this.preparedStatements.set(queryKey, stmt);
    }

    const result = await stmt.bind(...params).all<T>();
    return result.results || [];
  }

  private async getConnection(database: string): Promise<D1Database> {
    if (!this.connections.has(database)) {
      // Initialize connection
      this.connections.set(database, env[database]);
    }
    return this.connections.get(database)!;
  }
}
```

## 🎓 Learning Resources

### Example Projects

1. **AI Code Review Bot**
   - GitHub webhook integration
   - Real-time code analysis
   - Multi-language support

2. **Global Snippet Manager**
   - Cross-region synchronization
   - Full-text search with D1
   - Collaborative features

3. **Edge-Powered IDE**
   - Real-time collaboration
   - AI-assisted coding
   - Cloud save/sync

### Best Practices

1. **Caching Strategy**
   - Memory cache for hot data (< 1 minute)
   - KV cache for warm data (< 1 hour)
   - D1/R2 for cold data (persistent)

2. **Error Handling**
   - Graceful degradation
   - Circuit breaker patterns
   - Fallback responses

3. **Security**
   - Input validation at edge
   - Rate limiting per region
   - Webhook signature verification

## 🔄 Migration Guide

### From Traditional Backend

```typescript
// Before: Traditional Express.js API
app.post('/api/analyze', async (req, res) => {
  const { code } = req.body;
  const analysis = await analyzeWithAI(code);
  res.json(analysis);
});

// After: Cloudflare Worker
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'POST' && request.url.endsWith('/api/analyze')) {
      const { code } = await request.json();
      
      // Check edge cache
      const cacheKey = `analysis:${hashCode(code)}`;
      const cached = await env.KV_CACHE.get(cacheKey);
      if (cached) {
        return new Response(cached, {
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
        });
      }
      
      // AI analysis
      const analysis = await analyzeWithClaude(code, env.ANTHROPIC_API_KEY);
      
      // Cache result
      await env.KV_CACHE.put(cacheKey, JSON.stringify(analysis), {
        expirationTtl: 3600
      });
      
      return new Response(JSON.stringify(analysis), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
```

---

**Ready to deploy AI at the edge? Start with the Claude Code Worker and experience sub-100ms AI responses worldwide! 🚀**