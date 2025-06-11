import type { WaitlistRequest, WaitlistResponse } from '@sse/types';
import { createError, defineEventHandler, getClientIP, getHeader, readBody, setHeader } from 'h3';

// Available software products for waitlist
const AVAILABLE_PRODUCTS = {
  'sse-framework': {
    name: 'SolidStack Enterprise Framework',
    description: 'Complete micro frontend boilerplate with 4 apps',
    tier: 'premium',
    estimatedLaunch: '2025-Q2',
  },
  'cloud-architect-ai': {
    name: 'Cloud Architect AI Agent',
    description: 'AI-powered cloud-native architecture generator',
    tier: 'enterprise',
    estimatedLaunch: '2025-Q3',
  },
  'terraform-generator': {
    name: 'Multi-Tenant Terraform Generator',
    description: 'Automated infrastructure as code with strict node isolation',
    tier: 'professional',
    estimatedLaunch: '2025-Q2',
  },
  'devops-suite': {
    name: 'Complete DevOps Automation Suite',
    description: 'End-to-end CI/CD with Kubernetes and vCluster support',
    tier: 'enterprise',
    estimatedLaunch: '2025-Q4',
  },
} as const;

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

    // Rate limiting: 3 waitlist joins per hour per IP
    const now = Date.now();
    const rateLimit = rateLimitMap.get(clientIP);

    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= 3) {
          throw createError({
            statusCode: 429,
            statusMessage: 'Too many waitlist requests. Please try again later.',
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

    const body: WaitlistRequest = await readBody(event);

    // Validate required fields
    if (!body.email || !body.productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and product selection are required',
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

    // Validate product exists
    if (!AVAILABLE_PRODUCTS[body.productId as keyof typeof AVAILABLE_PRODUCTS]) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid product selection',
      });
    }

    // Validate optional fields
    if (body.firstName && body.firstName.length > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: 'First name must be less than 50 characters',
      });
    }

    if (body.lastName && body.lastName.length > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Last name must be less than 50 characters',
      });
    }

    if (body.company && body.company.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Company name must be less than 100 characters',
      });
    }

    // Validate role if provided
    const validRoles = ['developer', 'architect', 'devops', 'manager', 'cto', 'founder', 'other'];
    if (body.role && !validRoles.includes(body.role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid role selection',
      });
    }

    // Validate team size if provided
    const validTeamSizes = ['1', '2-5', '6-20', '21-50', '51-200', '200+'];
    if (body.teamSize && !validTeamSizes.includes(body.teamSize)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid team size selection',
      });
    }

    const selectedProduct = AVAILABLE_PRODUCTS[body.productId as keyof typeof AVAILABLE_PRODUCTS];

    // Sanitize and prepare data
    const waitlistData = {
      email: body.email.trim().toLowerCase(),
      firstName: body.firstName?.trim() || '',
      lastName: body.lastName?.trim() || '',
      company: body.company?.trim() || '',
      role: body.role || 'other',
      teamSize: body.teamSize || '1',
      productId: body.productId,
      productName: selectedProduct.name,
      productTier: selectedProduct.tier,
      interests: body.interests || [],
      source: body.source || 'waitlist-form',
      newsletter: body.newsletter || false,
      earlyAccess: body.earlyAccess || false,
      metadata: {
        ip: clientIP,
        userAgent,
        timestamp: new Date().toISOString(),
        referer: getHeader(event, 'referer') || '',
        estimatedLaunch: selectedProduct.estimatedLaunch,
      },
    };

    // Check if already subscribed to this product waitlist
    try {
      // In production, check your database
      // const existingSubscription = await db.waitlist.findFirst({
      //   where: { email: waitlistData.email, productId: waitlistData.productId }
      // });
      // if (existingSubscription) {
      //   return {
      //     success: true,
      //     message: 'You are already subscribed to this waitlist.',
      //     position: existingSubscription.position,
      //     estimatedLaunch: selectedProduct.estimatedLaunch,
      //   };
      // }
    } catch (dbError) {
      console.error('Database check failed:', dbError);
    }

    // Store in database
    let waitlistPosition = 1;
    try {
      // In production, store in your database and get position
      // const result = await db.waitlist.create({
      //   data: waitlistData,
      // });
      // waitlistPosition = result.position;

      // For now, generate a mock position
      waitlistPosition = Math.floor(Math.random() * 500) + 1;

      console.info('Waitlist subscription stored:', {
        email: waitlistData.email,
        productId: waitlistData.productId,
        position: waitlistPosition,
        timestamp: waitlistData.metadata.timestamp,
      });
    } catch (dbError) {
      console.error('Database storage failed:', dbError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to process your waitlist request',
      });
    }

    // Send confirmation email
    try {
      await sendWaitlistConfirmationEmail({
        to: waitlistData.email,
        firstName: waitlistData.firstName,
        product: selectedProduct,
        position: waitlistPosition,
        earlyAccess: waitlistData.earlyAccess,
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
      // Don't fail the request if email fails
    }

    // If they opted for newsletter, add to mailing list
    if (waitlistData.newsletter) {
      try {
        await addToMailingList({
          email: waitlistData.email,
          firstName: waitlistData.firstName,
          lastName: waitlistData.lastName,
          source: 'waitlist-newsletter-opt-in',
        });
      } catch (mailingListError) {
        console.error('Mailing list subscription failed:', mailingListError);
        // Don't fail the request if mailing list fails
      }
    }

    const response: WaitlistResponse = {
      success: true,
      message: `Successfully joined the waitlist for ${selectedProduct.name}!`,
      productName: selectedProduct.name,
      position: waitlistPosition,
      estimatedLaunch: selectedProduct.estimatedLaunch,
      perks: getWaitlistPerks(selectedProduct.tier),
      nextSteps: [
        'Check your email for confirmation',
        'Follow us on social media for updates',
        'Refer friends to move up in the waitlist',
      ],
    };

    // Set CORS headers
    setHeader(event, 'Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    setHeader(event, 'Access-Control-Allow-Credentials', 'true');

    return response;
  } catch (error: Error) {
    // Log error for monitoring
    console.error('Waitlist error:', {
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
      statusMessage: 'Unable to process your waitlist request. Please try again later.',
    });
  }
});

// Helper function to send waitlist confirmation email
async function sendWaitlistConfirmationEmail(params: {
  to: string;
  firstName: string;
  product: any;
  position: number;
  earlyAccess: boolean;
}) {
  const emailPayload = {
    to: params.to,
    subject: `Welcome to the ${params.product.name} waitlist!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">You're on the list! 🎉</h1>
        
        <p>Hi ${params.firstName || 'there'},</p>
        
        <p>Thank you for joining the waitlist for <strong>${params.product.name}</strong>!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Your Waitlist Details:</h3>
          <ul>
            <li><strong>Position:</strong> #${params.position}</li>
            <li><strong>Product:</strong> ${params.product.name}</li>
            <li><strong>Tier:</strong> ${params.product.tier}</li>
            <li><strong>Estimated Launch:</strong> ${params.product.estimatedLaunch}</li>
          </ul>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ul>
          <li>We'll keep you updated on development progress</li>
          <li>${params.earlyAccess ? "You'll get early access before public launch" : "You'll be notified when we launch"}</li>
          <li>Exclusive waitlist member perks and discounts</li>
          <li>Priority support and onboarding</li>
        </ul>
        
        <p>Want to move up in the waitlist? Refer friends and colleagues!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/waitlist/share?ref=${params.to}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Share & Move Up
          </a>
        </div>
        
        <p>Best regards,<br>
        The Spectrum Web Co Team</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          If you have any questions, reply to this email or contact us at 
          <a href="mailto:support@spectrumwebco.com.au">support@spectrumwebco.com.au</a>
        </p>
      </div>
    `,
  };

  // Replace with your actual email service integration
  // await emailService.send(emailPayload);
}

// Helper function to add to mailing list
async function addToMailingList(params: {
  email: string;
  firstName: string;
  lastName: string;
  source: string;
}) {
  // Integration with your mailing list service (Mailchimp, ConvertKit, etc.)
  // await mailingListService.subscribe(params);
}

// Helper function to get waitlist perks based on tier
function getWaitlistPerks(tier: string): string[] {
  switch (tier) {
    case 'enterprise':
      return [
        '50% discount on first year',
        'Priority onboarding and training',
        'Direct access to engineering team',
        'Custom feature requests',
        'White-label options',
      ];
    case 'professional':
      return [
        '30% discount on first year',
        'Priority support',
        'Advanced documentation access',
        'Beta feature access',
      ];
    case 'premium':
      return [
        '20% discount on launch',
        'Early access to documentation',
        'Community access',
        'Email support',
      ];
    default:
      return ['10% discount on launch', 'Launch day notification', 'Community access'];
  }
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License Agreement.
 */
