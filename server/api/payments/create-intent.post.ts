import { createError, defineEventHandler, getHeader, readBody, setHeader } from 'h3';

// Product pricing configuration
const PRODUCTS = {
  'sse-framework-starter': {
    name: 'SolidStack Enterprise Framework - Starter',
    price: 29900, // $299.00 in cents
    currency: 'usd',
    description: 'Complete micro frontend boilerplate with 4 apps',
    features: ['4 Micro Frontend Apps', 'Basic Documentation', 'Email Support', '1 Year Updates'],
  },
  'sse-framework-professional': {
    name: 'SolidStack Enterprise Framework - Professional',
    price: 59900, // $599.00 in cents
    currency: 'usd',
    description: 'Everything in Starter plus advanced features',
    features: [
      'Everything in Starter',
      'Advanced Components',
      'Priority Support',
      'Custom Themes',
      'Commercial License',
    ],
  },
  'sse-framework-enterprise': {
    name: 'SolidStack Enterprise Framework - Enterprise',
    price: 149900, // $1,499.00 in cents
    currency: 'usd',
    description: 'Full enterprise solution with white-label rights',
    features: [
      'Everything in Professional',
      'White-label Rights',
      'Direct Engineering Support',
      'Custom Features',
      'Lifetime Updates',
    ],
  },
  'cloud-architect-ai': {
    name: 'Cloud Architect AI Agent',
    price: 99900, // $999.00 in cents
    currency: 'usd',
    description: 'AI-powered cloud-native architecture generator',
    features: [
      'AI Architecture Generation',
      'Terraform Templates',
      'Multi-Cloud Support',
      'API Access',
    ],
  },
  'terraform-generator': {
    name: 'Multi-Tenant Terraform Generator',
    price: 79900, // $799.00 in cents
    currency: 'usd',
    description: 'Automated infrastructure as code with strict node isolation',
    features: ['Multi-Tenant Templates', 'Node Isolation', 'Security Policies', 'CLI Tool'],
  },
  'devops-suite': {
    name: 'Complete DevOps Automation Suite',
    price: 199900, // $1,999.00 in cents
    currency: 'usd',
    description: 'End-to-end CI/CD with Kubernetes and vCluster support',
    features: [
      'Full CI/CD Pipeline',
      'Kubernetes Integration',
      'vCluster Support',
      'Monitoring Stack',
    ],
  },
} as const;

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  try {
    const clientIP = 'unknown';
    const userAgent = getHeader(event, 'user-agent') || '';

    // Rate limiting: 10 payment attempts per hour per IP
    const now = Date.now();
    const rateLimit = rateLimitMap.get(clientIP);

    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= 10) {
          throw createError({
            statusCode: 429,
            statusMessage: 'Too many payment attempts. Please try again later.',
          });
        }
        rateLimit.count++;
      } else {
        rateLimit.count = 1;
        rateLimit.resetTime = now + 60 * 60 * 1000;
      }
    } else {
      rateLimitMap.set(clientIP, {
        count: 1,
        resetTime: now + 60 * 60 * 1000,
      });
    }

    const body: any = await readBody(event);

    // Validate required fields
    if (!body.productId || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID and email are required',
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
    const product = PRODUCTS[body.productId as keyof typeof PRODUCTS];
    if (!product) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid product selection',
      });
    }

    // Validate optional fields
    if (body.name && body.name.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name must be less than 100 characters',
      });
    }

    if (body.company && body.company.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Company name must be less than 100 characters',
      });
    }

    // Apply discount if provided
    let finalAmount = product.price;
    let discountInfo = null;

    if (body.discountCode) {
      const discount = await validateDiscountCode(body.discountCode, body.productId);
      if (discount) {
        finalAmount = Math.round(product.price * (1 - discount.percentage / 100)) as typeof product.price;
        discountInfo = {
          code: body.discountCode,
          percentage: discount.percentage,
          amount: product.price - finalAmount,
        } as any;
      }
    }

    // Create customer if not exists
    let customer: any;
    try {
      const existingCustomers = { data: [] };

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = {
          id: 'mock-customer-id',
          email: body.email,
        };
      }
    } catch (stripeError: unknown) {
      console.error('Stripe customer creation failed:', stripeError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Unable to process payment information',
      });
    }

    // Create payment intent
    const paymentIntent = {
      id: 'mock-payment-intent-id',
      client_secret: 'mock-client-secret',
      amount: finalAmount,
      currency: product.currency,
    };

    // Log payment intent creation
    console.info('Payment intent created:', {
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
      productId: body.productId,
      amount: finalAmount,
      email: body.email,
      timestamp: new Date().toISOString(),
    });

    // Store payment attempt in database
    try {
      // await db.paymentAttempts.create({
      //   data: {
      //     paymentIntentId: paymentIntent.id,
      //     customerId: customer.id,
      //     productId: body.productId,
      //     amount: finalAmount,
      //     currency: product.currency,
      //     email: body.email,
      //     name: body.name,
      //     company: body.company,
      //     discountCode: body.discountCode,
      //     status: 'created',
      //     metadata: {
      //       ip: clientIP,
      //       userAgent,
      //       timestamp: new Date().toISOString(),
      //     },
      //   },
      // });
    } catch (dbError) {
      console.error('Database logging failed:', dbError);
      // Don't fail the payment if logging fails
    }

    const response = {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      amount: finalAmount,
      currency: product.currency,
      product: {
        id: body.productId,
        name: product.name,
        description: product.description,
        features: product.features,
      },
      discount: discountInfo,
      customer: {
        id: customer.id,
        email: customer.email!,
        name: customer.name || body.name || '',
      },
    };

    // Set CORS headers
    setHeader(event, 'Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    setHeader(event, 'Access-Control-Allow-Credentials', 'true');

    return response;
  } catch (error: unknown) {
    // Log error for monitoring
    console.error('Payment intent creation error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userAgent: getHeader(event, 'user-agent'),
      ip: 'unknown',
      requestBody: null,
    });

    // Handle Stripe-specific errors
    if (error && typeof error === 'object' && 'type' in error) {
      switch ((error as any).type) {
        case 'StripeCardError':
          throw createError({
            statusCode: 400,
            statusMessage: (error as any).message,
          });
        case 'StripeRateLimitError':
          throw createError({
            statusCode: 429,
            statusMessage: 'Too many requests. Please try again later.',
          });
        case 'StripeInvalidRequestError':
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid payment information',
          });
        case 'StripeAPIError':
          throw createError({
            statusCode: 500,
            statusMessage: 'Payment processing temporarily unavailable',
          });
        case 'StripeConnectionError':
          throw createError({
            statusCode: 500,
            statusMessage: 'Network error. Please try again.',
          });
        case 'StripeAuthenticationError':
          throw createError({
            statusCode: 500,
            statusMessage: 'Payment configuration error',
          });
        default:
          throw createError({
            statusCode: 500,
            statusMessage: 'Payment processing error',
          });
      }
    }

    // Handle known error types
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    // Generic error for unexpected issues
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to process payment. Please try again later.',
    });
  }
});

// Helper function to validate discount codes
async function validateDiscountCode(
  code: string,
  productId: string
): Promise<{ percentage: number } | null> {
  // In production, validate against your database
  const validDiscounts: Record<string, { percentage: number; validProducts?: string[] }> = {
    LAUNCH20: { percentage: 20 },
    EARLY30: { percentage: 30 },
    WAITLIST25: { percentage: 25 },
    ENTERPRISE40: { percentage: 40, validProducts: ['sse-framework-enterprise', 'devops-suite'] },
  };

  const discount = validDiscounts[code.toUpperCase()];
  if (!discount) return null;

  if (discount.validProducts && !discount.validProducts.includes(productId)) {
    return null;
  }

  return { percentage: discount.percentage };
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License Agreement.
 */
