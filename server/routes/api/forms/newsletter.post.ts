import { z } from 'npm:zod';
import { Resend } from 'npm:resend';

const newsletterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  company: z.string().max(100).optional(),
  interests: z.array(z.enum([
    'solidjs',
    'cloud-native',
    'micro-frontends',
    'kubernetes',
    'ai-automation',
    'devops',
    'enterprise',
    'tutorials'
  ])).default(['solidjs']),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  source: z.enum(['marketing', 'blog', 'docs', 'storefront']).default('marketing'),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  referralCode: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, {
    message: 'GDPR consent is required'
  })
});

const resend = new Resend(process.env.RESEND_API_KEY);

const interestDescriptions = {
  'solidjs': 'SolidJS tutorials, tips, and best practices',
  'cloud-native': 'Cloud-native architecture and deployment strategies',
  'micro-frontends': 'Micro frontend patterns and implementation guides',
  'kubernetes': 'Kubernetes deployment, management, and optimization',
  'ai-automation': 'AI-powered development tools and automation',
  'devops': 'DevOps practices, CI/CD, and infrastructure as code',
  'enterprise': 'Enterprise-grade solutions and case studies',
  'tutorials': 'Step-by-step development tutorials and workshops'
};

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  try {
    const body = await readBody(event);
    const validatedData = newsletterSchema.parse(body);

    // Rate limiting
    const clientIP = getClientIP(event);
    const rateLimitKey = `newsletter:${clientIP}`;
    
    const recentSubmission = await checkRateLimit(rateLimitKey);
    if (recentSubmission) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Please wait before subscribing again.'
      });
    }

    // Check for existing subscription
    const existingSubscriber = await checkExistingSubscriber(validatedData.email);
    if (existingSubscriber) {
      // Update preferences instead of creating new subscription
      await updateSubscriberPreferences(validatedData.email, {
        interests: validatedData.interests,
        frequency: validatedData.frequency,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        company: validatedData.company
      });

      return {
        success: true,
        message: 'Your newsletter preferences have been updated!',
        data: {
          status: 'updated',
          interests: validatedData.interests,
          frequency: validatedData.frequency
        }
      };
    }

    // Generate confirmation token
    const confirmationToken = generateConfirmationToken();
    const confirmationUrl = `https://spectrumwebco.com.au/newsletter/confirm?token=${confirmationToken}&email=${encodeURIComponent(validatedData.email)}`;

    // Send double opt-in confirmation email
    const confirmationEmailResult = await resend.emails.send({
      from: 'newsletter@spectrumwebco.com.au',
      to: [validatedData.email],
      subject: 'Please confirm your newsletter subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://spectrumwebco.com.au/logo.png" alt="Spectrum Web Co" style="height: 50px;">
          </div>
          
          <h1 style="color: #2563eb; text-align: center;">Almost there! 📧</h1>
          
          <p>Hi${validatedData.firstName ? ` ${validatedData.firstName}` : ''},</p>
          
          <p>Thank you for subscribing to the Spectrum Web Co newsletter! To complete your subscription and start receiving our content, please confirm your email address.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Confirm Subscription
            </a>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">What you'll receive:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${validatedData.interests.map(interest => 
                `<li style="margin: 5px 0;">${interestDescriptions[interest]}</li>`
              ).join('')}
            </ul>
            <p style="margin-bottom: 0;"><strong>Frequency:</strong> ${validatedData.frequency.charAt(0).toUpperCase() + validatedData.frequency.slice(1)} updates</p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">
            If you didn't sign up for this newsletter, you can safely ignore this email. 
            The subscription will not be activated without confirmation.
          </p>
          
          <p style="font-size: 14px; color: #6b7280;">
            This link expires in 24 hours. If you need a new confirmation link, 
            <a href="https://spectrumwebco.com.au/newsletter/resend?email=${encodeURIComponent(validatedData.email)}">click here</a>.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            Spectrum Web Co | Brisbane, Australia<br>
            <a href="https://spectrumwebco.com.au/privacy">Privacy Policy</a> | 
            <a href="https://spectrumwebco.com.au/unsubscribe">Unsubscribe</a>
          </p>
        </div>
      `,
      tags: [
        { name: 'type', value: 'newsletter_confirmation' },
        { name: 'source', value: validatedData.source }
      ]
    });

    // Store pending subscription
    const subscription = await storePendingSubscription({
      ...validatedData,
      confirmation_token: confirmationToken,
      confirmation_sent_at: new Date(),
      ip_address: clientIP,
      user_agent: getHeader(event, 'user-agent'),
      status: 'pending_confirmation',
      subscribed_at: new Date(),
      confirmation_email_id: confirmationEmailResult.data?.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Notify team of new subscription
    await resend.emails.send({
      from: 'newsletter@spectrumwebco.com.au',
      to: ['team@spectrumwebco.com.au'],
      subject: 'New newsletter subscription (pending confirmation)',
      text: `
New Newsletter Subscription (Pending)

Email: ${validatedData.email}
Name: ${validatedData.firstName || ''} ${validatedData.lastName || ''}
Company: ${validatedData.company || 'Not provided'}
Interests: ${validatedData.interests.join(', ')}
Frequency: ${validatedData.frequency}
Source: ${validatedData.source}

UTM Data:
- Source: ${validatedData.utm_source || 'Direct'}
- Medium: ${validatedData.utm_medium || 'None'}
- Campaign: ${validatedData.utm_campaign || 'None'}
- Referral: ${validatedData.referralCode || 'None'}

Submitted at: ${new Date().toISOString()}
IP: ${clientIP}
      `.trim(),
      tags: [
        { name: 'type', value: 'team_notification' },
        { name: 'source', value: validatedData.source }
      ]
    });

    // Set rate limit
    await setRateLimit(rateLimitKey, 300); // 5 minutes cooldown

    // Track subscription attempt
    await trackNewsletterSubscription({
      email: validatedData.email,
      source: validatedData.source,
      utm_source: validatedData.utm_source,
      utm_medium: validatedData.utm_medium,
      utm_campaign: validatedData.utm_campaign,
      interests: validatedData.interests,
      status: 'pending_confirmation'
    });

    return {
      success: true,
      message: 'Please check your email to confirm your subscription.',
      data: {
        status: 'pending_confirmation',
        email: validatedData.email,
        interests: validatedData.interests,
        frequency: validatedData.frequency,
        confirmationRequired: true
      }
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid subscription data',
        data: error.errors
      });
    }

    console.error('Newsletter subscription error:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to process your subscription. Please try again later.'
    });
  }
});

// Helper functions
async function checkRateLimit(key: string): Promise<boolean> {
  // Implement with Redis/KV
  return false;
}

async function setRateLimit(key: string, ttl: number): Promise<void> {
  // Implement with Redis/KV
}

async function checkExistingSubscriber(email: string): Promise<boolean> {
  // Check database for existing active subscription
  return false;
}

async function updateSubscriberPreferences(email: string, preferences: any): Promise<void> {
  // Update existing subscriber preferences
  console.log('Updated preferences for:', email, preferences);
}

async function storePendingSubscription(data: any): Promise<any> {
  // Store pending subscription in database
  console.log('Pending subscription stored:', data.email);
  return data;
}

function generateConfirmationToken(): string {
  return crypto.randomUUID().replace(/-/g, '') + Date.now().toString(36);
}

async function trackNewsletterSubscription(data: any): Promise<void> {
  // Send to analytics platform
  console.log('Newsletter subscription tracked:', data);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */