// Core email service
export {
  EmailService,
  createEmailService,
  getDefaultEmailService,
  type EmailServiceConfig,
  type EmailAnalytics,
  type ContactFormEmailData,
  type WaitlistEmailData,
  type NewsletterEmailData,
  type UserWelcomeEmailData,
  type AIAgentEmailData,
  type PaymentEmailData,
  type BatchEmailRequest,
  type EmailSendResult,
  type BatchEmailResult,
} from './email-service.ts';

// Custom Resend client
export {
  ResendClient,
  ResendError,
  createResendClient,
  getDefaultResendClient,
  type ResendConfig,
  type EmailAddress,
  type EmailAttachment,
  type EmailTag,
  type EmailHeaders,
  type SendEmailOptions,
  type EmailResponse,
  type BatchEmailResponse,
} from './resend-client.ts';

// Template engine
export {
  EmailTemplateEngine,
  createEmailTemplateEngine,
  defaultTemplateEngine,
  type TemplateProps,
  type EmailComponent,
  type TemplateConfig,
  type EmailTheme,
} from './template-engine.ts';

// Pre-built SSE templates
export { SSETemplates } from './templates/sse-templates.ts';

// Re-export commonly used types
export type { Component, JSX } from 'solid-js';

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */
