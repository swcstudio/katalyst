// Core email service

// Re-export commonly used types
export type { Component, JSX } from 'solid-js';
export {
  type AIAgentEmailData,
  type BatchEmailRequest,
  type BatchEmailResult,
  type ContactFormEmailData,
  createEmailService,
  type EmailAnalytics,
  type EmailSendResult,
  EmailService,
  type EmailServiceConfig,
  getDefaultEmailService,
  type NewsletterEmailData,
  type PaymentEmailData,
  type UserWelcomeEmailData,
  type WaitlistEmailData,
} from './email-service.ts';
// Custom Resend client
export {
  type BatchEmailResponse,
  createResendClient,
  type EmailAddress,
  type EmailAttachment,
  type EmailHeaders,
  type EmailResponse,
  type EmailTag,
  getDefaultResendClient,
  ResendClient,
  type ResendConfig,
  ResendError,
  type SendEmailOptions,
} from './resend-client.ts';
// Template engine
export {
  createEmailTemplateEngine,
  defaultTemplateEngine,
  type EmailComponent,
  EmailTemplateEngine,
  type EmailTheme,
  type TemplateConfig,
  type TemplateProps,
} from './template-engine.ts';
// Pre-built SSE templates
export { SSETemplates } from './templates/sse-templates.ts';

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */
