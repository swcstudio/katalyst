import { z } from 'npm:zod';
import {
  createResendClient,
  getDefaultResendClient,
  type ResendClient,
  ResendError,
  SendEmailOptions,
} from './resend-client.ts';
import { SSETemplates } from './templates/sse-templates.ts';

export interface EmailServiceConfig {
  resendApiKey?: string;
  defaultFrom?: string;
  dryRun?: boolean;
  trackingEnabled?: boolean;
  retryAttempts?: number;
}

export interface EmailAnalytics {
  templateName: string;
  recipient: string;
  status: 'sent' | 'failed' | 'bounced' | 'delivered';
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ContactFormEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  referenceId: string;
}

export interface WaitlistEmailData {
  firstName: string;
  email: string;
  product:
    | 'solidstack-enterprise'
    | 'cloud-native-boilerplate'
    | 'ai-agent-framework'
    | 'micro-frontend-toolkit';
  position: number;
  estimatedLaunch: string;
  benefits: string[];
  referralCode: string;
}

export interface NewsletterEmailData {
  email: string;
  firstName?: string;
  interests: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  confirmationUrl: string;
}

export interface UserWelcomeEmailData {
  firstName: string;
  lastName: string;
  email: string;
  plan: string;
  dashboardUrl: string;
  features: string[];
}

export interface AIAgentEmailData {
  userName: string;
  context: string;
  tokensUsed: number;
  remainingCalls: number;
  conversationUrl: string;
  upgradeUrl?: string;
}

export interface PaymentEmailData {
  customerName: string;
  email: string;
  amount: number;
  currency: string;
  plan: string;
  period: string;
  invoiceUrl: string;
  dashboardUrl: string;
  features: string[];
}

export interface BatchEmailRequest {
  template: string;
  recipients: Array<{
    email: string;
    data:
      | ContactFormEmailData
      | WaitlistEmailData
      | NewsletterEmailData
      | UserWelcomeEmailData
      | AIAgentEmailData
      | PaymentEmailData;
  }>;
  options?: {
    delay?: number;
    batchSize?: number;
  };
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  analytics?: EmailAnalytics;
}

export interface BatchEmailResult {
  successful: number;
  failed: number;
  results: EmailSendResult[];
  errors: Array<{
    email: string;
    error: string;
  }>;
}

export class EmailService {
  private resendClient: ResendClient;
  private config: Required<EmailServiceConfig>;
  private analytics: EmailAnalytics[] = [];

  constructor(config: EmailServiceConfig = {}) {
    this.config = {
      resendApiKey: config.resendApiKey || Deno.env.get('RESEND_API_KEY') || '',
      defaultFrom:
        config.defaultFrom || Deno.env.get('RESEND_DEFAULT_FROM') || 'noreply@spectrumwebco.com.au',
      dryRun: config.dryRun || Deno.env.get('EMAIL_DRY_RUN') === 'true',
      trackingEnabled: config.trackingEnabled ?? true,
      retryAttempts: config.retryAttempts || 3,
    };

    if (config.resendApiKey) {
      this.resendClient = createResendClient({
        apiKey: config.resendApiKey,
        defaultFrom: this.config.defaultFrom,
      });
    } else {
      this.resendClient = getDefaultResendClient();
    }
  }

  // Contact form confirmation email
  async sendContactConfirmation(data: ContactFormEmailData): Promise<EmailSendResult> {
    const html = SSETemplates.contactConfirmation(data);

    return this.sendEmail({
      template: 'contact-confirmation',
      to: data.email,
      subject: 'Thank you for contacting Spectrum Web Co',
      html,
      metadata: {
        template: 'contact-confirmation',
        referenceId: data.referenceId,
        subject: data.subject,
      },
    });
  }

  // Waitlist confirmation email
  async sendWaitlistConfirmation(data: WaitlistEmailData): Promise<EmailSendResult> {
    const html = SSETemplates.waitlistConfirmation(data);

    return this.sendEmail({
      template: 'waitlist-confirmation',
      to: data.email,
      subject: `Welcome to the waitlist! You're #${data.position}`,
      html,
      metadata: {
        template: 'waitlist-confirmation',
        product: data.product,
        position: data.position.toString(),
      },
    });
  }

  // Newsletter double opt-in email
  async sendNewsletterConfirmation(data: NewsletterEmailData): Promise<EmailSendResult> {
    const html = SSETemplates.newsletterConfirmation(data);

    return this.sendEmail({
      template: 'newsletter-confirmation',
      to: data.email,
      subject: 'Please confirm your newsletter subscription',
      html,
      metadata: {
        template: 'newsletter-confirmation',
        interests: data.interests.join(','),
        frequency: data.frequency,
      },
    });
  }

  // User welcome email after registration
  async sendUserWelcome(data: UserWelcomeEmailData): Promise<EmailSendResult> {
    const html = SSETemplates.userWelcome(data);

    return this.sendEmail({
      template: 'user-welcome',
      to: data.email,
      subject: `Welcome to SolidStack Enterprise, ${data.firstName}! 🚀`,
      html,
      metadata: {
        template: 'user-welcome',
        plan: data.plan,
        featuresCount: data.features.length.toString(),
      },
    });
  }

  // AI Agent session notification
  async sendAIAgentNotification(data: AIAgentEmailData): Promise<EmailSendResult> {
    const html = SSETemplates.aiAgentNotification(data);

    return this.sendEmail({
      template: 'ai-agent-notification',
      to: data.userName, // Assuming userName contains email, adjust if needed
      subject: `🤖 Your ${data.context} solution is ready`,
      html,
      metadata: {
        template: 'ai-agent-notification',
        context: data.context,
        tokensUsed: data.tokensUsed.toString(),
        remainingCalls: data.remainingCalls.toString(),
      },
    });
  }

  // Payment confirmation email
  async sendPaymentConfirmation(data: PaymentEmailData): Promise<EmailSendResult> {
    const html = SSETemplates.paymentConfirmation(data);

    return this.sendEmail({
      template: 'payment-confirmation',
      to: data.email,
      subject: `Payment Confirmed - ${data.plan} Plan Activated! 💳`,
      html,
      metadata: {
        template: 'payment-confirmation',
        plan: data.plan,
        amount: data.amount.toString(),
        currency: data.currency,
      },
    });
  }

  // Generic email sending method
  async sendEmail(options: {
    template: string;
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    metadata?: Record<string, string>;
    tags?: Array<{ name: string; value: string }>;
  }): Promise<EmailSendResult> {
    try {
      // Validate email addresses
      const recipients = Array.isArray(options.to) ? options.to : [options.to];
      for (const email of recipients) {
        if (!this.isValidEmail(email)) {
          throw new Error(`Invalid email address: ${email}`);
        }
      }

      // Dry run mode
      if (this.config.dryRun) {
        console.log('DRY RUN - Email would be sent:', {
          template: options.template,
          to: options.to,
          subject: options.subject,
        });
        return {
          success: true,
          messageId: `dry-run-${Date.now()}`,
          analytics: this.createAnalyticsEntry(
            options.template,
            recipients[0],
            'sent',
            options.metadata
          ),
        };
      }

      // Send email with retry logic
      let lastError: Error | null = null;
      for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
        try {
          const result = await this.resendClient.sendEmail({
            from: this.config.defaultFrom,
            to: recipients,
            subject: options.subject,
            html: options.html,
            text: options.text,
            tags: [
              { name: 'template', value: options.template },
              { name: 'environment', value: Deno.env.get('NODE_ENV') || 'development' },
              ...(options.tags || []),
            ],
            metadata: options.metadata,
          });

          const analytics = this.createAnalyticsEntry(
            options.template,
            recipients[0],
            'sent',
            options.metadata
          );
          if (this.config.trackingEnabled) {
            this.analytics.push(analytics);
            await this.trackEmailSent(analytics);
          }

          return {
            success: true,
            messageId: result.id,
            analytics,
          };
        } catch (error) {
          lastError = error;
          if (attempt < this.config.retryAttempts - 1) {
            // Wait before retry with exponential backoff
            await this.delay(2 ** attempt * 1000);
          }
        }
      }

      // All retries failed
      const analytics = this.createAnalyticsEntry(
        options.template,
        recipients[0],
        'failed',
        options.metadata
      );
      if (this.config.trackingEnabled) {
        this.analytics.push(analytics);
      }

      return {
        success: false,
        error: lastError?.message || 'Unknown error',
        analytics,
      };
    } catch (error) {
      const analytics = this.createAnalyticsEntry(
        options.template,
        Array.isArray(options.to) ? options.to[0] : options.to,
        'failed',
        options.metadata
      );
      if (this.config.trackingEnabled) {
        this.analytics.push(analytics);
      }

      return {
        success: false,
        error: error.message,
        analytics,
      };
    }
  }

  // Batch email sending
  async sendBatch(request: BatchEmailRequest): Promise<BatchEmailResult> {
    const { template, recipients, options = {} } = request;
    const { delay = 100, batchSize = 10 } = options;

    const results: EmailSendResult[] = [];
    const errors: Array<{ email: string; error: string }> = [];
    let successful = 0;
    let failed = 0;

    // Process in batches
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const batchPromises = batch.map(async (recipient) => {
        try {
          let html: string;
          let subject: string;

          // Generate email based on template
          switch (template) {
            case 'contact-confirmation':
              html = SSETemplates.contactConfirmation(recipient.data);
              subject = 'Thank you for contacting Spectrum Web Co';
              break;
            case 'waitlist-confirmation':
              html = SSETemplates.waitlistConfirmation(recipient.data);
              subject = `Welcome to the waitlist! You're #${recipient.data.position}`;
              break;
            case 'newsletter-confirmation':
              html = SSETemplates.newsletterConfirmation(recipient.data);
              subject = 'Please confirm your newsletter subscription';
              break;
            case 'user-welcome':
              html = SSETemplates.userWelcome(recipient.data);
              subject = `Welcome to SolidStack Enterprise, ${recipient.data.firstName}! 🚀`;
              break;
            case 'ai-agent-notification':
              html = SSETemplates.aiAgentNotification(recipient.data);
              subject = `🤖 Your ${recipient.data.context} solution is ready`;
              break;
            case 'payment-confirmation':
              html = SSETemplates.paymentConfirmation(recipient.data);
              subject = `Payment Confirmed - ${recipient.data.plan} Plan Activated! 💳`;
              break;
            default:
              throw new Error(`Unknown template: ${template}`);
          }

          const result = await this.sendEmail({
            template,
            to: recipient.email,
            subject,
            html,
            metadata: {
              template,
              batchId: `batch-${Date.now()}`,
              ...recipient.data,
            },
          });

          if (result.success) {
            successful++;
          } else {
            failed++;
            errors.push({ email: recipient.email, error: result.error || 'Unknown error' });
          }

          return result;
        } catch (error) {
          failed++;
          errors.push({ email: recipient.email, error: error.message });
          return {
            success: false,
            error: error.message,
            analytics: this.createAnalyticsEntry(template, recipient.email, 'failed'),
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(
        ...batchResults.map((r) =>
          r.status === 'fulfilled'
            ? r.value
            : {
                success: false,
                error: r.reason?.message || 'Unknown error',
              }
        )
      );

      // Delay between batches to respect rate limits
      if (i + batchSize < recipients.length && delay > 0) {
        await this.delay(delay);
      }
    }

    return {
      successful,
      failed,
      results,
      errors,
    };
  }

  // Get email analytics
  getAnalytics(filter?: {
    template?: string;
    status?: 'sent' | 'failed' | 'bounced' | 'delivered';
    startDate?: Date;
    endDate?: Date;
  }): EmailAnalytics[] {
    let filtered = this.analytics;

    if (filter) {
      if (filter.template) {
        filtered = filtered.filter((a) => a.templateName === filter.template);
      }
      if (filter.status) {
        filtered = filtered.filter((a) => a.status === filter.status);
      }
      if (filter.startDate) {
        filtered = filtered.filter((a) => a.timestamp >= filter.startDate!);
      }
      if (filter.endDate) {
        filtered = filtered.filter((a) => a.timestamp <= filter.endDate!);
      }
    }

    return filtered;
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: Record<string, unknown>;
  }> {
    try {
      const rateLimitInfo = this.resendClient.getRateLimitInfo();

      return {
        status: 'healthy',
        details: {
          rateLimitRemaining: rateLimitInfo?.remaining || 'unknown',
          analyticsCount: this.analytics.length,
          dryRunMode: this.config.dryRun,
          trackingEnabled: this.config.trackingEnabled,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message,
        },
      };
    }
  }

  // Private helper methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private createAnalyticsEntry(
    templateName: string,
    recipient: string,
    status: 'sent' | 'failed' | 'bounced' | 'delivered',
    metadata?: Record<string, unknown>
  ): EmailAnalytics {
    return {
      templateName,
      recipient,
      status,
      timestamp: new Date(),
      metadata,
    };
  }

  private async trackEmailSent(analytics: EmailAnalytics): Promise<void> {
    // Implement your analytics tracking here
    // This could send to your analytics platform, database, etc.
    console.log('Email analytics tracked:', analytics);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Factory function
export function createEmailService(config?: EmailServiceConfig): EmailService {
  return new EmailService(config);
}

// Default instance
let defaultEmailService: EmailService | null = null;

export function getDefaultEmailService(): EmailService {
  if (!defaultEmailService) {
    defaultEmailService = new EmailService();
  }
  return defaultEmailService;
}

// Export template functions for direct use
export { SSETemplates };

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */
