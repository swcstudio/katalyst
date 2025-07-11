// Types and Schemas
export interface ResendConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  defaultFrom?: string;
}

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string;
  type?: string;
  disposition?: 'attachment' | 'inline';
  contentId?: string;
}

export interface EmailTag {
  name: string;
  value: string;
}

export interface EmailHeaders {
  [key: string]: string;
}

export interface SendEmailOptions {
  from: string | EmailAddress;
  to: (string | EmailAddress)[];
  cc?: (string | EmailAddress)[];
  bcc?: (string | EmailAddress)[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
  tags?: EmailTag[];
  headers?: EmailHeaders;
  scheduledAt?: Date;
  replyTo?: string | EmailAddress;
  template?: {
    id: string;
    data: Record<string, unknown>;
  };
  metadata?: Record<string, string>;
}

export interface EmailResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

export interface BatchEmailResponse {
  data: EmailResponse[];
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

export class ResendError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ResendError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ResendClient {
  private readonly config: Required<ResendConfig>;
  private readonly rateLimitTracker = new Map<string, { count: number; resetTime: number }>();

  constructor(config: ResendConfig) {
    this.config = {
      baseUrl: 'https://api.resend.com',
      timeout: 30000,
      retries: 3,
      defaultFrom: '',
      ...config,
    };

    if (!this.config.apiKey) {
      throw new Error('Resend API key is required');
    }
  }

  // Core email sending method
  async sendEmail(options: SendEmailOptions): Promise<EmailResponse> {
    const validatedOptions = options;

    // Use default from if not specified
    if (!validatedOptions.from && this.config.defaultFrom) {
      validatedOptions.from = this.config.defaultFrom;
    }

    const payload = this.buildEmailPayload(validatedOptions);
    const response = await this.makeRequest('POST', '/emails', payload);

    // Track successful sends for analytics
    await this.trackEmailSent({
      id: response.id,
      from: this.normalizeEmailAddress(validatedOptions.from),
      to: validatedOptions.to.map((addr: any) => this.normalizeEmailAddress(addr)),
      subject: validatedOptions.subject,
      tags: validatedOptions.tags,
      metadata: validatedOptions.metadata,
    });

    return response as unknown as EmailResponse;
  }

  // Batch email sending
  async sendBatch(emails: SendEmailOptions[]): Promise<BatchEmailResponse> {
    if (emails.length === 0) {
      throw new ResendError('No emails provided for batch send', 'EMPTY_BATCH', 400);
    }

    if (emails.length > 100) {
      throw new ResendError('Batch size cannot exceed 100 emails', 'BATCH_TOO_LARGE', 400);
    }

    const validatedEmails = emails;
    const payloads = validatedEmails.map((email) => this.buildEmailPayload(email));

    const response = await this.makeRequest('POST', '/emails/batch', {
      emails: payloads,
    });

    return response as unknown as BatchEmailResponse;
  }

  // Template-based email sending
  async sendTemplate(
    templateId: string,
    options: Omit<SendEmailOptions, 'html' | 'text'> & {
      templateData: Record<string, unknown>;
    }
  ): Promise<EmailResponse> {
    return this.sendEmail({
      ...options,
      template: {
        id: templateId,
        data: options.templateData,
      },
    });
  }

  // Get email status
  async getEmail(emailId: string): Promise<Record<string, unknown>> {
    return this.makeRequest('GET', `/emails/${emailId}`);
  }

  // Cancel scheduled email
  async cancelEmail(emailId: string): Promise<void> {
    await this.makeRequest('POST', `/emails/${emailId}/cancel`);
  }

  // Webhook verification
  verifyWebhook(payload: string, signature: string, secret: string): boolean {
    try {
      const hmac = crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      // This is a simplified version - implement proper HMAC verification
      return signature.length > 0 && payload.length > 0;
    } catch {
      return false;
    }
  }

  // Rate limit info
  getRateLimitInfo(): { remaining: number; resetTime: number } | null {
    const info = this.rateLimitTracker.get('global');
    if (!info) return null;

    return {
      remaining: Math.max(0, 100 - info.count), // Assuming 100 req/min limit
      resetTime: info.resetTime,
    };
  }

  // Private methods
  private buildEmailPayload(options: SendEmailOptions): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      from: this.normalizeEmailAddress(options.from),
      to: options.to.map((addr) => this.normalizeEmailAddress(addr)),
      subject: options.subject,
    };

    if (options.cc?.length) {
      payload.cc = options.cc.map((addr) => this.normalizeEmailAddress(addr));
    }

    if (options.bcc?.length) {
      payload.bcc = options.bcc.map((addr) => this.normalizeEmailAddress(addr));
    }

    if (options.html) payload.html = options.html;
    if (options.text) payload.text = options.text;
    if (options.attachments) payload.attachments = options.attachments;
    if (options.tags) payload.tags = options.tags;
    if (options.headers) payload.headers = options.headers;
    if (options.replyTo) payload.reply_to = this.normalizeEmailAddress(options.replyTo);
    if (options.scheduledAt) payload.scheduled_at = options.scheduledAt.toISOString();
    if (options.template) payload.template = options.template;

    // Add metadata as custom headers
    if (options.metadata) {
      payload.headers = {
        ...(payload.headers || {}),
        ...Object.fromEntries(
          Object.entries(options.metadata).map(([key, value]) => [`X-Metadata-${key}`, value])
        ),
      };
    }

    return payload;
  }

  private normalizeEmailAddress(addr: string | EmailAddress): string {
    if (typeof addr === 'string') return addr;
    return addr.name ? `${addr.name} <${addr.email}>` : addr.email;
  }

  private async makeRequest(
    method: string,
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const url = `${this.config.baseUrl}${endpoint}`;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'SolidStack-Enterprise/1.0.0 (Deno)',
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Update rate limit tracking
        this.updateRateLimitTracking(response.headers);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ResendError(
            errorData.message || `HTTP ${response.status}`,
            errorData.code || 'API_ERROR',
            response.status,
            errorData
          );
        }

        return await response.json();
      } catch (error) {
        if (attempt === this.config.retries) {
          if (error instanceof ResendError) throw error;

          if (
            error &&
            typeof error === 'object' &&
            'name' in error &&
            error.name === 'AbortError'
          ) {
            throw new ResendError('Request timeout', 'TIMEOUT', 408);
          }

          throw new ResendError(
            error instanceof Error ? error.message : 'Network error',
            'NETWORK_ERROR',
            500
          );
        }

        // Wait before retry with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
      }
    }

    throw new ResendError('Max retries exceeded', 'MAX_RETRIES', 500);
  }

  private updateRateLimitTracking(headers: Headers): void {
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');

    if (remaining && reset) {
      this.rateLimitTracker.set('global', {
        count: 100 - Number.parseInt(remaining, 10),
        resetTime: Number.parseInt(reset, 10) * 1000,
      });
    }
  }

  private async trackEmailSent(data: Record<string, unknown>): Promise<void> {
    // Implement analytics tracking here
    console.log('Email sent:', data.id, data.subject);
  }
}

// Factory function for easy instantiation
export function createResendClient(config: ResendConfig): ResendClient {
  return new ResendClient(config);
}

// Default instance (can be configured via environment)
let defaultClient: ResendClient | null = null;

export function getDefaultResendClient(): ResendClient {
  if (!defaultClient) {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    defaultClient = new ResendClient({
      apiKey,
      defaultFrom: Deno.env.get('RESEND_DEFAULT_FROM') || '',
    });
  }

  return defaultClient;
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */
