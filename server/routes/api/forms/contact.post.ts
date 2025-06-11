import { z } from 'npm:zod';
import { getDefaultEmailService } from '../../../libs/email/src/email-service.ts';

const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.enum(['general', 'consultation', 'enterprise', 'support', 'partnership', 'custom']),
  message: z.string().min(10).max(2000),
  source: z.enum(['marketing', 'blog', 'docs', 'storefront']).default('marketing'),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

const emailService = getDefaultEmailService();

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  assertMethod(event, 'POST');

  try {
    // Parse and validate request body
    const body = await readBody(event);
    const validatedData = contactFormSchema.parse(body);

    // Rate limiting check (basic implementation)
    const clientIP = getClientIP(event);
    const rateLimitKey = `contact_form:${clientIP}`;

    // Check if this IP has submitted recently (implement with Redis/KV in production)
    const recentSubmission = await checkRateLimit(rateLimitKey);
    if (recentSubmission) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too many requests. Please wait before submitting again.',
      });
    }

    // Generate reference ID
    const referenceId = generateReferenceId();

    // Send confirmation email to user using SSE template
    const userEmailResult = await emailService.sendContactConfirmation({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      referenceId,
    });

    // Send notification email to team (plain text for internal use)
    const emailContent = `
New Contact Form Submission - SolidStack Enterprise

Name: ${validatedData.name}
Email: ${validatedData.email}
Company: ${validatedData.company || 'Not provided'}
Phone: ${validatedData.phone || 'Not provided'}
Subject: ${validatedData.subject}
Source: ${validatedData.source}

UTM Tracking:
- Source: ${validatedData.utm_source || 'Not provided'}
- Medium: ${validatedData.utm_medium || 'Not provided'}
- Campaign: ${validatedData.utm_campaign || 'Not provided'}

Message:
${validatedData.message}

---
Reference ID: ${referenceId}
Submitted at: ${new Date().toISOString()}
Client IP: ${clientIP}
User Agent: ${getHeader(event, 'user-agent')}
    `.trim();

    const adminEmailResult = await emailService.sendEmail({
      template: 'admin-notification',
      to: 'team@spectrumwebco.com.au',
      subject: `New ${validatedData.subject} inquiry from ${validatedData.name}`,
      html: emailContent.replace(/\n/g, '<br>'),
      text: emailContent,
      tags: [
        { name: 'type', value: 'admin-notification' },
        { name: 'source', value: validatedData.source },
        { name: 'subject', value: validatedData.subject },
      ],
      metadata: {
        template: 'admin-notification',
        referenceId,
        source: validatedData.source,
      },
    });

    // Store in database (implement with your preferred DB)
    await storeContactSubmission({
      ...validatedData,
      reference_id: referenceId,
      ip_address: clientIP,
      user_agent: getHeader(event, 'user-agent'),
      submitted_at: new Date(),
      admin_email_id: adminEmailResult.messageId,
      user_email_id: userEmailResult.messageId,
    });

    // Set rate limit (implement with Redis/KV in production)
    await setRateLimit(rateLimitKey, 300); // 5 minutes cooldown

    return {
      success: true,
      message: "Thank you for your message. We'll be in touch soon!",
      reference_id: referenceId,
      email_sent: userEmailResult.success,
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid form data',
        data: error.errors,
      });
    }

    // Log error for monitoring
    console.error('Contact form submission error:', error);

    // Return generic error to user
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to process your request. Please try again later.',
    });
  }
});

// Helper functions
async function checkRateLimit(key: string): Promise<boolean> {
  // Implement with Redis, Upstash, or Vercel KV
  // For now, return false (no rate limiting)
  return false;
}

async function setRateLimit(key: string, ttl: number): Promise<void> {
  // Implement with Redis, Upstash, or Vercel KV
  // Store the key with TTL
}

async function storeContactSubmission(data: any): Promise<void> {
  // Implement with your database (Convex, Supabase, PlanetScale, etc.)
  // For now, just log
  console.log('Contact submission stored:', data.name, data.email);
}

function generateReferenceId(): string {
  return `CONTACT_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */
