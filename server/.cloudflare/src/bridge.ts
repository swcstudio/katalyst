/**
 * Katalyst Integration Bridge
 * Connects katalyst-core (Vercel/AI) with katalyst-server (Fly.io/Backend)
 */

export interface Env {
  // Core services
  CORE_AI_SERVICE: Fetcher;
  
  // Server databases
  DB_MAIN: D1Database;
  DB_TIMESERIES: D1Database;
  DB_ANALYTICS: D1Database;
  
  // Caching
  KV_API_CACHE: KVNamespace;
  KV_SESSIONS: KVNamespace;
  
  // Queues
  QUEUE_EVENTS: Queue;
  QUEUE_JOBS: Queue;
  
  // Vector databases
  VECTOR_DOCUMENTS: VectorizeIndex;
  VECTOR_BEHAVIOR: VectorizeIndex;
  
  // Analytics
  ANALYTICS_API: AnalyticsEngineDataset;
  
  // Hyperdrive
  HYPERDRIVE_FLY_PG: Hyperdrive;
}

/**
 * Bridge API - Handles communication between core and server
 */
export class KatalystBridge {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  /**
   * Forward AI requests from server to core
   */
  async forwardToAI(request: Request): Promise<Response> {
    try {
      // Check cache first
      const cacheKey = await this.getCacheKey(request);
      const cached = await this.env.KV_API_CACHE.get(cacheKey, 'json');
      
      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: { 
            'Content-Type': 'application/json',
            'X-Cache': 'HIT'
          }
        });
      }

      // Forward to core AI service
      const response = await this.env.CORE_AI_SERVICE.fetch(request);
      const data = await response.json();

      // Cache the response
      await this.env.KV_API_CACHE.put(
        cacheKey,
        JSON.stringify(data),
        { expirationTtl: 3600 }
      );

      // Log analytics
      this.env.ANALYTICS_API.writeDataPoint({
        blobs: ['ai_request'],
        doubles: [1],
        indexes: ['core_forward']
      });

      return new Response(JSON.stringify(data), {
        headers: { 
          'Content-Type': 'application/json',
          'X-Cache': 'MISS'
        }
      });
    } catch (error) {
      console.error('AI forward error:', error);
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  /**
   * Store AI-generated embeddings in server's Vectorize
   */
  async storeEmbedding(
    text: string,
    embedding: number[],
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      // Store in Vectorize
      await this.env.VECTOR_DOCUMENTS.insert([{
        id: crypto.randomUUID(),
        values: embedding,
        metadata: {
          ...metadata,
          text,
          timestamp: Date.now(),
          source: 'core_ai'
        }
      }]);

      // Store metadata in D1
      await this.env.DB_MAIN.prepare(`
        INSERT INTO vector_metadata (vector_id, content, metadata, created_at)
        VALUES (?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        text,
        JSON.stringify(metadata),
        Date.now()
      ).run();

      // Queue for further processing
      await this.env.QUEUE_EVENTS.send({
        type: 'embedding_stored',
        data: { text, metadata }
      });
    } catch (error) {
      console.error('Embedding storage error:', error);
      throw error;
    }
  }

  /**
   * Query data from server for AI context
   */
  async queryForContext(
    query: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      // Get embedding from core
      const embeddingResponse = await this.env.CORE_AI_SERVICE.fetch(
        new Request('https://ai.katalyst.io/embeddings', {
          method: 'POST',
          body: JSON.stringify({ text: query })
        })
      );
      
      const { embedding } = await embeddingResponse.json();

      // Search in Vectorize
      const results = await this.env.VECTOR_DOCUMENTS.query(embedding, {
        topK: limit,
        returnMetadata: true
      });

      // Enrich with D1 data
      const enriched = await Promise.all(
        results.matches.map(async (match: any) => {
          const dbResult = await this.env.DB_MAIN.prepare(`
            SELECT * FROM documents WHERE id = ?
          `).bind(match.id).first();

          return {
            ...match,
            document: dbResult
          };
        })
      );

      return enriched;
    } catch (error) {
      console.error('Context query error:', error);
      return [];
    }
  }

  /**
   * Sync session between core and server
   */
  async syncSession(sessionId: string, data: any): Promise<void> {
    try {
      // Store in KV
      await this.env.KV_SESSIONS.put(
        `session:${sessionId}`,
        JSON.stringify({
          ...data,
          lastSync: Date.now()
        }),
        { expirationTtl: 86400 } // 24 hours
      );

      // Store in D1 for persistence
      await this.env.DB_MAIN.prepare(`
        INSERT INTO sessions (id, data, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          data = excluded.data,
          updated_at = excluded.updated_at
      `).bind(sessionId, JSON.stringify(data), Date.now()).run();

      // Queue sync event
      await this.env.QUEUE_EVENTS.send({
        type: 'session_sync',
        sessionId,
        data
      });
    } catch (error) {
      console.error('Session sync error:', error);
      throw error;
    }
  }

  /**
   * Stream data from server to core
   */
  async *streamData(query: string): AsyncGenerator<any> {
    try {
      // Use Hyperdrive for efficient PostgreSQL access
      const conn = this.env.HYPERDRIVE_FLY_PG.connect();
      
      // Stream results
      const results = await conn.query(query);
      
      for (const row of results.rows) {
        // Process and yield each row
        yield this.processRow(row);
        
        // Allow other operations
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    } catch (error) {
      console.error('Stream error:', error);
      throw error;
    }
  }

  /**
   * Handle webhooks between services
   */
  async handleWebhook(
    source: 'core' | 'server',
    event: string,
    data: any
  ): Promise<void> {
    try {
      // Log event
      await this.env.DB_ANALYTICS.prepare(`
        INSERT INTO webhooks (source, event, data, timestamp)
        VALUES (?, ?, ?, ?)
      `).bind(source, event, JSON.stringify(data), Date.now()).run();

      // Route to appropriate handler
      switch (event) {
        case 'ai_completion':
          await this.handleAICompletion(data);
          break;
        case 'data_update':
          await this.handleDataUpdate(data);
          break;
        case 'user_action':
          await this.handleUserAction(data);
          break;
        default:
          console.warn('Unknown webhook event:', event);
      }

      // Queue for async processing
      await this.env.QUEUE_JOBS.send({
        type: 'webhook',
        source,
        event,
        data
      });
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  // Helper methods

  private async getCacheKey(request: Request): Promise<string> {
    const url = new URL(request.url);
    const body = await request.text();
    const hash = await this.hashString(body);
    return `api:${url.pathname}:${hash}`;
  }

  private async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private processRow(row: any): any {
    // Transform database row for consumption
    return {
      ...row,
      processed: true,
      timestamp: Date.now()
    };
  }

  private async handleAICompletion(data: any): Promise<void> {
    // Store AI completion in database
    await this.env.DB_MAIN.prepare(`
      INSERT INTO ai_completions (id, prompt, response, model, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      data.id,
      data.prompt,
      data.response,
      data.model,
      Date.now()
    ).run();
  }

  private async handleDataUpdate(data: any): Promise<void> {
    // Invalidate relevant caches
    const cachePattern = `api:${data.resource}:*`;
    // Note: KV doesn't support pattern deletion, implement custom logic
    
    // Queue reindexing if needed
    if (data.requiresReindex) {
      await this.env.QUEUE_JOBS.send({
        type: 'reindex',
        resource: data.resource
      });
    }
  }

  private async handleUserAction(data: any): Promise<void> {
    // Store user behavior for analytics
    await this.env.DB_ANALYTICS.prepare(`
      INSERT INTO user_actions (user_id, action, metadata, timestamp)
      VALUES (?, ?, ?, ?)
    `).bind(
      data.userId,
      data.action,
      JSON.stringify(data.metadata),
      Date.now()
    ).run();

    // Update behavior embeddings
    if (data.updateEmbedding) {
      await this.env.QUEUE_EVENTS.send({
        type: 'update_user_embedding',
        userId: data.userId
      });
    }
  }
}

/**
 * Main worker handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const bridge = new KatalystBridge(env);
    const url = new URL(request.url);

    // Route requests
    switch (url.pathname) {
      case '/bridge/ai':
        return bridge.forwardToAI(request);
      
      case '/bridge/webhook':
        const { source, event, data } = await request.json();
        await bridge.handleWebhook(source, event, data);
        return new Response('OK');
      
      case '/bridge/context':
        const { query, limit } = await request.json();
        const context = await bridge.queryForContext(query, limit);
        return new Response(JSON.stringify(context), {
          headers: { 'Content-Type': 'application/json' }
        });
      
      case '/bridge/session':
        const { sessionId, sessionData } = await request.json();
        await bridge.syncSession(sessionId, sessionData);
        return new Response('OK');
      
      default:
        return new Response('Not Found', { status: 404 });
    }
  },

  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    const bridge = new KatalystBridge(env);
    
    for (const message of batch.messages) {
      try {
        // Process queue messages
        console.log('Processing message:', message.body);
        
        // Acknowledge message
        message.ack();
      } catch (error) {
        console.error('Queue processing error:', error);
        message.retry();
      }
    }
  },

  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    const bridge = new KatalystBridge(env);
    
    // Run scheduled tasks
    switch (event.cron) {
      case '*/5 * * * *':
        // Health check
        console.log('Running health check');
        break;
      
      case '0 * * * *':
        // Hourly aggregation
        console.log('Running hourly aggregation');
        break;
      
      default:
        console.log('Unknown cron:', event.cron);
    }
  }
};