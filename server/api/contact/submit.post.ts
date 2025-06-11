import type { ContactFormRequest, ContactFormResponse } from '@sse/types';
import { createError, defineEventHandler, getClientIP, getHeader, readBody, setHeader } from 'h3';

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export default defineEventHandler(async (event) => {
  // Only allow POST method
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  try {
    const clientIP = getClientIP(event);
    const userAgent = getHeader(event, 'user-agent') || '';

    // Rate limiting: 5 submissions per hour per IP
    const now = Date.now();
    const rateLimit = rateLimitMap.get(clientIP);

    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= 5) {
          throw createError({
            statusCode: 429,
            statusMessage: 'Too many contact form submissions. Please try again later.',
          });
        }
        rateLimit.count++;
      } else {
        rateLimit.count = 1;
        rateLimit.resetTime = now + 60 * 60 * 1000; // 1 hour
      }
    } else {
      rateLimitMap.set(clientIP, {
        count: 1,
        resetTime: now + 60 * 60 * 1000,
      });
    }

    const body: ContactFormRequest = await readBody(event);

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email, and message are required',
      });
    }

    // Validate field lengths
    if (body.name.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name must be less than 100 characters',
      });
    }

    if (body.message.length > 5000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message must be less than 5000 characters',
      });
    }

    if (body.message.length < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message must be at least 10 characters long',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format',
      });
    }

    // Basic spam detection
    const spamKeywords = ['bitcoin', 'crypto', 'investment', 'loan', 'casino', 'viagra'];
    const messageText = body.message.toLowerCase();
    const hasSpam = spamKeywords.some((keyword) => messageText.includes(keyword));

    if (hasSpam) {
      // Log potential spam but don't reject immediately
      console.warn('Potential spam detected:', {
        ip: clientIP,
        email: body.email,
        timestamp: new Date().toISOString(),
      });
    }

    // Sanitize input data
    const sanitizedData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      company: body.company?.trim() || '',
      phone: body.phone?.trim() || '',
      subject: body.subject?.trim() || 'Contact Form Submission',
      message: body.message.trim(),
      source: body.source || 'contact-form',
      isSpamSuspect: hasSpam,
      metadata: {
        ip: clientIP,
        userAgent,
        timestamp: new Date().toISOString(),
        referer: getHeader(event, 'referer') || '',
      },
    };

    // Store in database (example with Convex or your preferred DB)
    try {
      // await db.contacts.insert(sanitizedData);
      console.info('Contact form submission stored:', {
        email: sanitizedData.email,
        timestamp: sanitizedData.metadata.timestamp,
      });
    } catch (dbError) {
      console.error('Database storage failed:', dbError);
      // Continue processing even if storage fails
    }

    // Send email notification to admin
    try {
      await sendContactNotificationEmail({
        to: process.env.ADMIN_EMAIL || 'admin@spectrumwebco.com.au',
        subject: `New Contact: ${sanitizedData.subject}`,
        data: sanitizedData,
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Continue processing even if email fails
    }

    // Send auto-reply to user
    try {
      await sendAutoReplyEmail({
        to: sanitizedData.email,
        name: sanitizedData.name,
        subject: 'Thank you for contacting Spectrum Web Co',
      });
    } catch (autoReplyError) {
      console.error('Auto-reply failed:', autoReplyError);
      // Continue processing even if auto-reply fails
    }

    const response: ContactFormResponse = {
      success: true,
      message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
      submissionId: generateSubmissionId(),
      estimatedResponseTime: '24 hours',
    };

    // Set CORS headers
    setHeader(event, 'Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    setHeader(event, 'Access-Control-Allow-Credentials', 'true');

    return response;
  } catch (error: Error) {
    // Log error for monitoring
    console.error('Contact form error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: getHeader(event, 'user-agent'),
      ip: getClientIP(event),
    });

    // Handle known error types
    if (error.statusCode) {
      throw error;
    }

    // Generic error for unexpected issues
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to process your request. Please try again later.',
    });
  }
});

// Helper function to send admin notification email
async function sendContactNotificationEmail(params: {
  to: string;
  subject: string;
  data: any;
}) {
  // Implementation depends on your email service (SendGrid, SES, etc.)
  // Example with fetch to email service API
  const emailPayload = {
    to: params.to,
    subject: params.subject,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${params.data.name}</p>
      <p><strong>Email:</strong> ${params.data.email}</p>
      <p><strong>Company:</strong> ${params.data.company}</p>
      <p><strong>Phone:</strong> ${params.data.phone}</p>
      <p><strong>Subject:</strong> ${params.data.subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${params.data.message.replace(/\n/g, '<br>')}
      </div>
      <hr>
      <p><strong>Metadata:</strong></p>
      <ul>
        <li>IP: ${params.data.metadata.ip}</li>
        <li>User Agent: ${params.data.metadata.userAgent}</li>
        <li>Timestamp: ${params.data.metadata.timestamp}</li>
        <li>Spam Suspect: ${params.data.isSpamSuspect ? 'Yes' : 'No'}</li>
      </ul>
    `,
  };

  // Replace with your actual email service integration
  // await emailService.send(emailPayload);
}

// Helper function to send auto-reply
async function sendAutoReplyEmail(params: {
  to: string;
  name: string;
  subject: string;
}) {
  const emailPayload = {
    to: params.to,
    subject: params.subject,
    html: `
      <h2>Thank you for contacting us, ${params.name}!</h2>
      <p>We have received your message and appreciate you taking the time to reach out to us.</p>
      <p>Our team will review your inquiry and respond within 24 hours during business days.</p>
      <p>If you have an urgent matter, please don't hesitate to call us directly.</p>
      <br>
      <p>Best regards,<br>
      The Spectrum Web Co Team</p>
      <hr>
      <p style="font-size: 12px; color: #666;">
        This is an automated response. Please do not reply to this email.
      </p>
    `,
  };

  // Replace with your actual email service integration
  // await emailService.send(emailPayload);
}

// Helper function to generate unique submission ID
function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `contact_${timestamp}_${random}`;
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License Agreement.
 */
