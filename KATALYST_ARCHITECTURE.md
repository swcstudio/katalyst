# Katalyst Framework Architecture

## Overview

The Katalyst Framework is split into two specialized components, each optimized for its specific role and deployment target, with Cloudflare services providing the underlying infrastructure for both.

```
┌─────────────────────────────────────────────────────────────────┐
│                     KATALYST FRAMEWORK                           │
├─────────────────────────┬───────────────────────────────────────┤
│     KATALYST-CORE       │        KATALYST-SERVER                 │
│   (AI & Edge Functions) │    (Backend & Data Services)          │
├─────────────────────────┼───────────────────────────────────────┤
│   Deployed on: Vercel   │      Deployed on: Fly.io              │
│   Focus: AI/ML, UI      │      Focus: Data, APIs, State        │
└─────────────────────────┴───────────────────────────────────────┘
                    │                     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  CLOUDFLARE SERVICES │
                    │  (Shared Infrastructure)│
                    └─────────────────────┘
```

## Component Breakdown

### 1. Katalyst-Core (Serverless AI/Frontend)

**Location:** `/home/ubuntu/src/repos/katalyst-core`  
**Deployment:** Vercel (Serverless)  
**Purpose:** AI processing, edge functions, user interface

#### Cloudflare Services Used:

**AI-First Services:**
- **Workers AI** - 6 specialized models:
  - Chat: `@cf/meta/llama-3.1-70b-instruct`
  - Code: `@cf/deepseek/deepseek-coder-6.7b-instruct`
  - Vision: `@cf/llava-hf/llava-1.5-7b-hf`
  - Embeddings: `@cf/baai/bge-base-en-v1.5`
  - Translation: `@cf/meta/m2m100-1.2b`
  - Speech: `@cf/openai/whisper`
- **AI Gateway** - Caching and rate limiting for AI requests
- **Vectorize** - 2 indexes for AI context and RAG:
  - `katalyst-core-context` (1536 dims, OpenAI)
  - `katalyst-core-code` (768 dims, BGE)

**Edge State Management:**
- **KV Namespaces** - 3 namespaces:
  - AI response caching
  - Edge session state
  - Feature flags & A/B testing
- **Durable Objects** - Stateful AI sessions:
  - AI conversation state
  - Collaborative editing
  - Real-time AI streaming

**Lightweight Storage:**
- **D1 Databases** - 2 edge databases:
  - User preferences
  - AI conversation history
- **R2 Buckets** - 3 buckets:
  - User uploads
  - Fine-tuned models
  - Generated content cache

**Processing:**
- **Queues** - Async AI tasks
- **Browser Rendering** - For AI vision
- **WASM Modules** - AI processing & tokenization

#### Key Features:
- Real-time AI inference at the edge
- Serverless function execution
- Global CDN distribution
- Zero cold starts for AI models
- Automatic scaling

---

### 2. Katalyst-Server (Persistent Backend)

**Location:** `/home/ubuntu/src/repos/katalyst-server`  
**Deployment:** Fly.io (Persistent Machines)  
**Purpose:** Data persistence, heavy processing, Phoenix/Elixir backend

#### Cloudflare Services Used:

**Data-First Services:**
- **D1 Databases** - 4 heavy-duty databases:
  - Main application data
  - Time-series metrics
  - Analytics & reporting
  - Audit logs & compliance
- **Hyperdrive** - PostgreSQL connection pooling:
  - Primary Fly.io PostgreSQL
  - Read replica connections
- **Vectorize** - 3 data indexes:
  - Document search (1536 dims)
  - User behavior (768 dims)
  - Recommendations (512 dims)

**High-Performance Caching:**
- **KV Namespaces** - 5 namespaces:
  - Database query cache
  - API response cache
  - Session storage
  - Rate limiting counters
  - Distributed locks

**Heavy Processing:**
- **Queues** - 5 queues with batching:
  - Event bus (100 batch size)
  - Background jobs (5 min timeout)
  - Data pipeline (500 batch size)
  - Notifications
  - Dead letter queue
- **Durable Objects** - Backend services:
  - WebSocket manager (Phoenix channels)
  - State coordinator
  - Rate limiter
  - Job scheduler

**Storage & Backup:**
- **R2 Buckets** - 4 buckets:
  - Database backups
  - File uploads
  - Data exports
  - Logs archive

**Monitoring:**
- **Analytics Engine** - 2 datasets:
  - API metrics
  - Performance monitoring

#### Key Features:
- Persistent Elixir/Phoenix application
- PostgreSQL with Fly.io
- WebSocket support
- Heavy data processing
- Multi-region deployment

---

## Integration Architecture

### Bridge Communication

The two components communicate through a Cloudflare Workers bridge:

```typescript
// katalyst-server/.cloudflare/src/bridge.ts
class KatalystBridge {
  // Forward AI requests from server to core
  forwardToAI(request: Request): Promise<Response>
  
  // Store AI embeddings in server's Vectorize
  storeEmbedding(text: string, embedding: number[]): Promise<void>
  
  // Query server data for AI context
  queryForContext(query: string): Promise<any[]>
  
  // Sync sessions between core and server
  syncSession(sessionId: string, data: any): Promise<void>
  
  // Stream data from server to core
  streamData(query: string): AsyncGenerator<any>
  
  // Handle webhooks between services
  handleWebhook(source: string, event: string, data: any): Promise<void>
}
```

### Service Bindings

**Core → Server:**
```toml
[[services]]
binding = "BACKEND_API"
service = "katalyst-server-api"

[[services]]
binding = "DATA_SERVICE"
service = "katalyst-server-data"
```

**Server → Core:**
```toml
[[services]]
binding = "CORE_AI_SERVICE"
service = "katalyst-core"
```

---

## Deployment Flow

### 1. Katalyst-Core (Vercel)

```bash
# Deploy to Vercel
vercel deploy

# Deploy Cloudflare Workers for AI
cd .cloudflare
wrangler deploy --env production
```

**URLs:**
- Frontend: `https://katalyst.vercel.app`
- AI API: `https://ai.katalyst.io`
- Edge Functions: `https://edge.katalyst.io`

### 2. Katalyst-Server (Fly.io)

```bash
# Deploy to Fly.io
fly deploy

# Deploy Cloudflare Workers for data
cd .cloudflare
wrangler deploy --env production
```

**URLs:**
- API: `https://api.katalyst.fly.dev`
- Data Services: `https://data.katalyst.io`
- WebSockets: `wss://ws.katalyst.fly.dev`

---

## Cost Optimization

### Cloudflare Free Tier Usage

**Katalyst-Core (AI-focused):**
- Workers AI: 10,000 neurons/day free
- Vectorize: 30M queried dimensions/month free
- KV: 100k reads/day, 1GB storage free
- D1: 5GB storage, 5M reads/day free
- R2: 10GB storage, 1M requests free

**Katalyst-Server (Data-focused):**
- D1: 5GB storage, 5M reads/day free (×4 databases)
- KV: 100k reads/day free (×5 namespaces)
- Queues: 1M messages/month free
- R2: 10GB storage free (×4 buckets)
- Analytics Engine: 100M events/month free

### Platform Costs

**Vercel (Core):**
- Hobby: Free
- Pro: $20/month (when needed)

**Fly.io (Server):**
- Free allowances: 3 shared VMs, 3GB storage
- Scale as needed: ~$5-20/month for small apps

---

## Data Flow Examples

### 1. AI-Powered Search

```
User Query (Vercel UI)
    ↓
Katalyst-Core (Edge Function)
    ↓
Workers AI (Generate Embedding)
    ↓
Bridge → Katalyst-Server
    ↓
Vectorize (Search Documents)
    ↓
D1 (Fetch Metadata)
    ↓
KV Cache (Store Result)
    ↓
Response → User
```

### 2. Real-time Collaboration

```
User Action (Vercel UI)
    ↓
Katalyst-Core (Durable Object)
    ↓
WebSocket → Katalyst-Server (Fly.io)
    ↓
Phoenix Channels (Broadcast)
    ↓
Queue (Process Updates)
    ↓
D1 (Persist State)
    ↓
Broadcast → All Users
```

### 3. Background Processing

```
Data Upload (Vercel UI)
    ↓
R2 Storage (Katalyst-Core)
    ↓
Queue Message → Katalyst-Server
    ↓
Heavy Processing (Fly.io)
    ↓
D1 Database (Store Results)
    ↓
Vectorize (Index for Search)
    ↓
Notification → User
```

---

## Development Setup

### Local Development

```bash
# Terminal 1: Katalyst-Core
cd katalyst-core
npm run dev  # Vercel dev server
cd .cloudflare
wrangler dev  # Cloudflare Workers

# Terminal 2: Katalyst-Server
cd katalyst-server
docker-compose up  # Local services
mix phx.server  # Phoenix server
cd .cloudflare
wrangler dev --port 8788  # Different port
```

### Environment Variables

**Katalyst-Core (.env):**
```env
VERCEL_URL=http://localhost:3000
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
FLY_BACKEND_URL=http://localhost:4000
```

**Katalyst-Server (.env):**
```env
FLY_APP_NAME=katalyst-server
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
DATABASE_URL=postgres://localhost:5432/katalyst
VERCEL_FRONTEND_URL=http://localhost:3000
```

---

## Monitoring & Observability

### Cloudflare Dashboard

- **Workers Analytics** - Request metrics
- **AI Gateway** - Model usage & costs
- **Vectorize** - Search performance
- **D1 Analytics** - Query performance
- **Queue Metrics** - Message throughput
- **R2 Analytics** - Storage usage

### Platform Monitoring

- **Vercel Analytics** - Frontend performance
- **Fly.io Metrics** - Server health
- **Grafana Cloud** - Unified dashboard

---

## Security Considerations

### Authentication Flow

1. User authenticates via Vercel (katalyst-core)
2. JWT issued and stored in KV
3. Token validated by Workers middleware
4. Backend requests include bearer token
5. Fly.io validates with Cloudflare KV

### Data Protection

- **Encryption at Rest:** D1, KV, R2 all encrypted
- **Encryption in Transit:** TLS 1.3 everywhere
- **Access Control:** Cloudflare Zero Trust
- **Rate Limiting:** AI Gateway + Durable Objects
- **DDoS Protection:** Cloudflare automatic

---

## Scaling Strategy

### Horizontal Scaling

**Katalyst-Core:**
- Vercel: Automatic serverless scaling
- Workers: 100,000 requests/day free, then $0.50/million
- AI: Automatic model routing

**Katalyst-Server:**
- Fly.io: Auto-scale 2-10 instances
- Workers: Handle overflow traffic
- Queues: Batch processing for efficiency

### Vertical Scaling

**When to upgrade:**
1. AI usage > 10k neurons/day → Workers AI paid tier
2. D1 > 5GB → Additional databases
3. Fly.io > 3 VMs → Scale instances
4. R2 > 10GB → Paid storage

---

## Future Enhancements

1. **GraphQL Federation** - Unite APIs
2. **Event Sourcing** - Full audit trail
3. **CQRS Pattern** - Separate read/write
4. **Multi-tenant** - Isolated namespaces
5. **Edge SSR** - Render at edge
6. **WebAssembly Plugins** - Custom processing
7. **Federated Learning** - Distributed AI training

---

## Conclusion

This architecture provides:
- **Optimal placement** - AI at edge, data in regions
- **Cost efficiency** - Maximize free tiers
- **Performance** - <50ms global latency
- **Scalability** - Serverless + auto-scaling
- **Reliability** - Multi-region redundancy
- **Developer experience** - Clear separation of concerns

The split between katalyst-core (AI/Edge) and katalyst-server (Data/Backend) allows each component to be optimized for its specific use case while Cloudflare services provide a unified infrastructure layer.

---

## Implementation Status ✅

All architecture components have been successfully implemented:

### Completed Components:
1. **✅ Katalyst-Core Configuration** - AI-focused edge functions for Vercel
   - Specialized wrangler.toml with AI models, edge caching, and lightweight databases
   - Updated package.json with AI/edge dependencies
   - Integration with Vercel deployment pipeline

2. **✅ Katalyst-Server Configuration** - Data-focused backend for Fly.io
   - Comprehensive wrangler.toml with heavy databases, queues, and processing
   - Updated package.json with backend/data dependencies
   - Integration with Fly.io and Phoenix/Elixir stack

3. **✅ Integration Bridge** - Communication layer between components
   - TypeScript bridge service handling AI forwarding, data sync, and webhooks
   - Efficient caching and queue-based processing
   - Real-time streaming and session management

4. **✅ Architecture Documentation** - Complete system overview
   - Detailed component breakdown and service allocation
   - Cost optimization and scaling strategies
   - Development setup and deployment flows

### Ready for Development:
The Katalyst Framework is now ready for development with:
- **Specialized Cloudflare configurations** for each component
- **Cost-optimized** free tier resource allocation
- **Scalable architecture** supporting both edge and persistent workloads
- **Comprehensive documentation** for developers and operators