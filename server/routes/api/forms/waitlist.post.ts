import { z } from 'npm:zod';
import { Resend } from 'npm:resend';

const waitlistSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  product: z.enum([
    'solidstack-enterprise',
    'cloud-native-boilerplate',
    'ai-agent-framework',
    'micro-frontend-toolkit'
  ]),
  useCase: z.string().max(500).optional(),
  teamSize: z.enum([
    '1-5',
    '6-20',
    '21-50',
    '51-200',
    '200+'
  ]).optional(),
  source: z.enum(['marketing', 'blog', 'docs', 'storefront']).default('marketing'),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  referralCode: z.string().optional()
});

const resend = new Resend(process.env.RESEND_API_KEY);

const productDetails = {
  'solidstack-enterprise': {
    name: 'SolidStack Enterprise',
    description: 'Complete micro-frontend boilerplate with SolidJS and cloud-native architecture',
    estimatedLaunch: 'Q2 2025',
    benefits: [
      '4 pre-built micro frontends',
      'Enterprise-grade authentication',
      'Cloud-native deployment ready',
      'Complete CI/CD pipeline'
    ]
  },
  'cloud-native-boilerplate': {
    name: 'Cloud-Native Boilerplate',
    description: 'Kubernetes-ready application templates with multi-tenancy',
    estimatedLaunch: 'Q3 2025',
    benefits: [
      'Multi-tenant architecture',
      'Kubernetes deployment templates',
      'Infrastructure as Code',
      'Monitoring and observability'
    ]
  },
  'ai-agent-framework': {
    name: 'AI Agent Framework',
    description: 'LangGraph-powered AI agents for cloud infrastructure automation',
    estimatedLaunch: 'Q4 2025',
    benefits: [
      'Automated infrastructure provisioning',
      'Natural language infrastructure queries',
      'Code generation assistance',
      'Terraform automation'
    ]
  },
  'micro-frontend-toolkit': {
    name: 'Micro Frontend Toolkit',
    description: 'Tools and utilities for building scalable micro frontend architectures',
    estimatedLaunch: 'Q1 2026',
    benefits: [
      'Module federation setup',
      'Shared state management',
      'Cross-app communication',
      'Performance optimization'
    ]
  }
};

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  try {
    const body = await readBody(event);
    const validatedData = waitlistSchema.parse(body);

    // Rate limiting
    const clientIP = getClientIP(event);
    const rateLimitKey = `waitlist:${clientIP}`;
    
    const recentSubmission = await checkRateLimit(rateLimitKey);
    if (recentSubmission) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Please wait before joining another waitlist.'
      });
    }

    // Check for duplicate email for this product
    const existingEntry = await checkExistingWaitlistEntry(validatedData.email, validatedData.product);
    if (existingEntry) {
      throw createError({
        statusCode: 409,
        statusMessage: 'You are already on the waitlist for this product.'
      });
    }

    const product = productDetails[validatedData.product];
    const fullName = `${validatedData.firstName} ${validatedData.lastName}`;

    // Generate waitlist position
    const waitlistPosition = await getWaitlistPosition(validatedData.product);

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: 'waitlist@spectrumwebco.com.au',
      to: [validatedData.email],
      subject: `Welcome to the ${product.name} waitlist!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://spectrumwebco.com.au/logo.png" alt="Spectrum Web Co" style="height: 50px;">
          </div>
          
          <h1 style="color: #2563eb; text-align: center;">You're on the waitlist! 🎉</h1>
          
          <p>Hi ${validatedData.firstName},</p>
          
          <p>Thank you for joining the waitlist for <strong>${product.name}</strong>!</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0; font-size: 24px;">You're #${waitlistPosition}</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">in line for early access</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">What you'll get:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${product.benefits.map(benefit => `<li style="margin: 5px 0;">${benefit}</li>`).join('')}
            </ul>
          </div>
          
          <p><strong>Estimated Launch:</strong> ${product.estimatedLaunch}</p>
          
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Early Bird Bonus:</strong> As a waitlist member, you'll receive 30% off the launch price and exclusive beta access!</p>
          </div>
          
          <p>We'll keep you updated on our progress and notify you as soon as early access is available.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://spectrumwebco.com.au/waitlist/share?product=${validatedData.product}&ref=${generateReferralCode(validatedData.email)}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Share with Friends (Earn Rewards)
            </a>
          </div>
          
          <p>Questions? Reply to this email or visit our <a href="https://docs.spectrumwebco.com.au">documentation</a>.</p>
          
          <p>Best regards,<br>
          The Spectrum Web Co Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            You're receiving this because you joined our waitlist at spectrumwebco.com.au<br>
            <a href="https://spectrumwebco.com.au/unsubscribe?email=${validatedData.email}&type=waitlist">Unsubscribe</a>
          </p>
        </div>
      `,
      tags: [
        { name: 'type', value: 'waitlist_confirmation' },
        { name: 'product', value: validatedData.product },
        { name: 'source', value: validatedData.source }
      ]
    });

    // Send notification to team
    const teamEmailResult = await resend.emails.send({
      from: 'waitlist@spectrumwebco.com.au',
      to: ['team@spectrumwebco.com.au'],
      subject: `New waitlist signup: ${product.name}`,
      text: `
New Waitlist Signup - ${product.name}

Name: ${fullName}
Email: ${validatedData.email}
Company: ${validatedData.company || 'Not provided'}
Job Title: ${validatedData.jobTitle || 'Not provided'}
Team Size: ${validatedData.teamSize || 'Not provided'}
Use Case: ${validatedData.useCase || 'Not provided'}
Waitlist Position: #${waitlistPosition}

UTM Data:
- Source: ${validatedData.utm_source || 'Direct'}
- Medium: ${validatedData.utm_medium || 'None'}
- Campaign: ${validatedData.utm_campaign || 'None'}
- Referral Code: ${validatedData.referralCode || 'None'}

Submitted from: ${validatedData.source}
Timestamp: ${new Date().toISOString()}
IP: ${clientIP}
      `.trim()
    });

    // Store in database
    const waitlistEntry = await storeWaitlistEntry({
      ...validatedData,
      position: waitlistPosition,
      ip_address: clientIP,
      user_agent: getHeader(event, 'user-agent'),
      joined_at: new Date(),
      user_email_id: userEmailResult.data?.id,
      team_email_id: teamEmailResult.data?.id,
      referral_code: generateReferralCode(validatedData.email),
      status: 'active'
    });

    // Set rate limit
    await setRateLimit(rateLimitKey, 600); // 10 minutes cooldown

    // Track conversion for analytics
    await trackWaitlistConversion({
      product: validatedData.product,
      source: validatedData.source,
      utm_source: validatedData.utm_source,
      utm_medium: validatedData.utm_medium,
      utm_campaign: validatedData.utm_campaign
    });

    return {
      success: true,
      message: `Welcome to the ${product.name} waitlist!`,
      data: {
        position: waitlistPosition,
        product: product.name,
        estimatedLaunch: product.estimatedLaunch,
        referralCode: generateReferralCode(validatedData.email),
        benefits: product.benefits
      }
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid form data',
        data: error.errors
      });
    }

    console.error('Waitlist submission error:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to process your waitlist signup. Please try again later.'
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

async function checkExistingWaitlistEntry(email: string, product: string): Promise<boolean> {
  // Check database for existing entry
  return false;
}

async function getWaitlistPosition(product: string): Promise<number> {
  // Get current waitlist count for product and increment
  // Implement with database
  return Math.floor(Math.random() * 1000) + 1; // Placeholder
}

async function storeWaitlistEntry(data: any): Promise<any> {
  // Store in database
  console.log('Waitlist entry stored:', data.email, data.product);
  return data;
}

function generateReferralCode(email: string): string {
  const hash = email.split('@')[0].toUpperCase();
  return `${hash.substring(0, 4)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

async function trackWaitlistConversion(data: any): Promise<void> {
  // Send to analytics platform
  console.log('Waitlist conversion tracked:', data);
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */