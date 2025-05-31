import { EmailTemplateEngine, EmailTheme, TemplateProps } from '../template-engine.ts';

// SolidStack Enterprise Brand Theme
const sseTheme: EmailTheme = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b', 
    accent: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace'
  },
  spacing: {
    xs: '4px',
    sm: '8px', 
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }
};

const templateEngine = new EmailTemplateEngine(sseTheme);

export const SSETemplates = {
  // Contact form confirmation template
  contactConfirmation: (props: {
    name: string;
    email: string;
    subject: string;
    message: string;
    referenceId: string;
  }) => {
    const content = `
      ${templateEngine.createHeader({
        logo: 'https://spectrumwebco.com.au/assets/logo-email.png',
        title: 'Thank You for Contacting Us',
        subtitle: 'We\'ve received your message and will respond within 24 hours'
      })}
      
      <div style="padding: 32px; background-color: #ffffff;">
        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Hi ${props.name},
        </p>
        
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Thank you for reaching out to Spectrum Web Co regarding <strong>${props.subject}</strong>. We've received your inquiry and will get back to you within 24 hours.
        </p>
        
        ${templateEngine.createCard({
          title: 'Your Message:',
          content: `<p style="font-style: italic; color: #64748b;">"${props.message}"</p>`,
          footer: `Reference ID: ${props.referenceId}`
        })}
        
        ${templateEngine.createCard({
          title: 'While You Wait',
          content: `
            <p style="margin: 0 0 16px 0;">Explore our resources:</p>
            ${templateEngine.createList([
              '<a href="https://docs.spectrumwebco.com.au" style="color: #2563eb; text-decoration: underline;">SolidStack Enterprise Documentation</a>',
              '<a href="https://blog.spectrumwebco.com.au" style="color: #2563eb; text-decoration: underline;">Technical Blog & Tutorials</a>',
              '<a href="https://spectrumwebco.com.au/case-studies" style="color: #2563eb; text-decoration: underline;">Case Studies & Success Stories</a>',
              '<a href="https://store.spectrumwebco.com.au" style="color: #2563eb; text-decoration: underline;">Premium Boilerplates & Tools</a>'
            ])}
          `
        })}
        
        <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Best regards,<br>
          <strong>The Spectrum Web Co Team</strong><br>
          <span style="color: #64748b;">Building the future of cloud-native development</span>
        </p>
      </div>
      
      ${templateEngine.createFooter({
        companyName: 'Spectrum Web Co LLC',
        address: 'Brisbane, Australia',
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com/spectrum-web-co' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/company/spectrum-web-co' },
          { platform: 'Twitter', url: 'https://twitter.com/spectrumwebco' }
        ]
      })}
    `;

    return templateEngine.createLayout({
      name: 'contact-confirmation',
      subject: 'Thank you for contacting Spectrum Web Co',
      preheader: 'We\'ve received your message and will respond within 24 hours'
    }, content);
  },

  // Waitlist confirmation template
  waitlistConfirmation: (props: {
    firstName: string;
    email: string;
    product: string;
    position: number;
    estimatedLaunch: string;
    benefits: string[];
    referralCode: string;
  }) => {
    const productNames = {
      'solidstack-enterprise': 'SolidStack Enterprise',
      'cloud-native-boilerplate': 'Cloud-Native Boilerplate',
      'ai-agent-framework': 'AI Agent Framework',
      'micro-frontend-toolkit': 'Micro Frontend Toolkit'
    };

    const productName = productNames[props.product as keyof typeof productNames] || props.product;

    const content = `
      ${templateEngine.createHeader({
        logo: 'https://spectrumwebco.com.au/assets/logo-email.png',
        title: `Welcome to the ${productName} Waitlist! 🎉`,
        subtitle: 'You\'re one step closer to next-generation development tools'
      })}
      
      <div style="padding: 32px; background-color: #ffffff;">
        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Hi ${props.firstName},
        </p>
        
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Thank you for joining the waitlist for <strong>${productName}</strong>! You're now part of an exclusive group of developers who will get first access to our revolutionary development tools.
        </p>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
          <h2 style="margin: 0; font-size: 32px; font-weight: 700;">You're #${props.position}</h2>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">in line for early access</p>
        </div>
        
        ${templateEngine.createCard({
          title: 'What You\'ll Get:',
          content: templateEngine.createList(props.benefits)
        })}
        
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="margin: 0; color: #1e40af;"><strong>🎁 Early Bird Bonus:</strong> 30% off launch price + exclusive beta access!</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 18px;">Share & Earn Rewards</h3>
          <p style="margin: 0 0 16px 0; color: #64748b;">Your referral code: <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${props.referralCode}</code></p>
          ${templateEngine.createButton({
            text: 'Share with Friends',
            url: `https://spectrumwebco.com.au/waitlist/share?product=${props.product}&ref=${props.referralCode}`,
            variant: 'outline'
          })}
        </div>
        
        <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          <strong>Estimated Launch:</strong> ${props.estimatedLaunch}
        </p>
        
        <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          We'll keep you updated on our progress and notify you immediately when early access is available.
        </p>
        
        <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Best regards,<br>
          <strong>The Spectrum Web Co Team</strong>
        </p>
      </div>
      
      ${templateEngine.createFooter({
        companyName: 'Spectrum Web Co LLC',
        address: 'Brisbane, Australia',
        unsubscribeUrl: `https://spectrumwebco.com.au/unsubscribe?email=${props.email}&type=waitlist`
      })}
    `;

    return templateEngine.createLayout({
      name: 'waitlist-confirmation',
      subject: `Welcome to the ${productName} waitlist! You're #${props.position}`,
      preheader: `You're #${props.position} in line for early access to ${productName}`
    }, content);
  },

  // Newsletter double opt-in template
  newsletterConfirmation: (props: {
    email: string;
    firstName?: string;
    interests: string[];
    frequency: string;
    confirmationUrl: string;
  }) => {
    const interestDescriptions = {
      'solidjs': 'SolidJS tutorials and best practices',
      'cloud-native': 'Cloud-native architecture patterns',
      'micro-frontends': 'Micro frontend implementation guides',
      'kubernetes': 'Kubernetes deployment strategies',
      'ai-automation': 'AI-powered development tools',
      'devops': 'DevOps practices and CI/CD',
      'enterprise': 'Enterprise-grade solutions',
      'tutorials': 'Step-by-step development tutorials'
    };

    const content = `
      ${templateEngine.createHeader({
        logo: 'https://spectrumwebco.com.au/assets/logo-email.png',
        title: 'Almost There! 📧',
        subtitle: 'Please confirm your newsletter subscription'
      })}
      
      <div style="padding: 32px; background-color: #ffffff;">
        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Hi${props.firstName ? ` ${props.firstName}` : ''},
        </p>
        
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Thank you for subscribing to the Spectrum Web Co newsletter! To complete your subscription and start receiving our premium content, please confirm your email address.
        </p>
        
        ${templateEngine.createButton({
          text: 'Confirm Subscription',
          url: props.confirmationUrl,
          variant: 'primary',
          fullWidth: true
        })}
        
        ${templateEngine.createCard({
          title: 'What You\'ll Receive:',
          content: `
            ${templateEngine.createList(
              props.interests.map(interest => 
                interestDescriptions[interest as keyof typeof interestDescriptions] || interest
              )
            )}
            <p style="margin: 16px 0 0 0; color: #64748b;"><strong>Frequency:</strong> ${props.frequency.charAt(0).toUpperCase() + props.frequency.slice(1)} updates</p>
          `
        })}
        
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #0c4a6e;"><strong>💡 What makes our newsletter special:</strong></p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #0c4a6e;">
            <li>Exclusive early access to new boilerplates</li>
            <li>Behind-the-scenes development insights</li>
            <li>Free code snippets and mini-tutorials</li>
            <li>Community spotlights and success stories</li>
          </ul>
        </div>
        
        <p style="margin: 24px 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
          If you didn't sign up for this newsletter, you can safely ignore this email. The subscription will not be activated without confirmation.
        </p>
        
        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
          This confirmation link expires in 24 hours. Need a new link? <a href="https://spectrumwebco.com.au/newsletter/resend?email=${encodeURIComponent(props.email)}" style="color: #2563eb; text-decoration: underline;">Click here</a>.
        </p>
      </div>
      
      ${templateEngine.createFooter({
        companyName: 'Spectrum Web Co LLC',
        address: 'Brisbane, Australia',
        unsubscribeUrl: 'https://spectrumwebco.com.au/unsubscribe'
      })}
    `;

    return templateEngine.createLayout({
      name: 'newsletter-confirmation',
      subject: 'Please confirm your newsletter subscription',
      preheader: 'One click to start receiving premium development content'
    }, content);
  },

  // Welcome email for new authenticated users
  userWelcome: (props: {
    firstName: string;
    lastName: string;
    email: string;
    plan: string;
    dashboardUrl: string;
    features: string[];
  }) => {
    const content = `
      ${templateEngine.createHeader({
        logo: 'https://spectrumwebco.com.au/assets/logo-email.png',
        title: `Welcome to SolidStack Enterprise, ${props.firstName}!`,
        subtitle: 'Your cloud-native development journey starts now'
      })}
      
      <div style="padding: 32px; background-color: #ffffff;">
        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Hi ${props.firstName},
        </p>
        
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Welcome to SolidStack Enterprise! Your account is now active and you have access to the most comprehensive cloud-native development platform available.
        </p>
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
          <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">🚀 ${props.plan.toUpperCase()} PLAN ACTIVATED</h2>
          <p style="margin: 0; opacity: 0.9;">All features unlocked and ready to use</p>
        </div>
        
        ${templateEngine.createButton({
          text: 'Access Your Dashboard',
          url: props.dashboardUrl,
          variant: 'primary'
        })}
        
        ${templateEngine.createCard({
          title: 'Your Features & Benefits:',
          content: templateEngine.createList(props.features)
        })}
        
        ${templateEngine.createCard({
          title: '🎯 Quick Start Guide',
          content: `
            <p style="margin: 0 0 16px 0;">Get up and running in minutes:</p>
            <ol style="margin: 0; padding-left: 20px;">
              <li style="margin: 8px 0;"><a href="${props.dashboardUrl}/tutorials" style="color: #2563eb; text-decoration: underline;">Complete the onboarding tutorial</a></li>
              <li style="margin: 8px 0;"><a href="${props.dashboardUrl}/projects/new" style="color: #2563eb; text-decoration: underline;">Create your first project</a></li>
              <li style="margin: 8px 0;"><a href="${props.dashboardUrl}/ai-agent" style="color: #2563eb; text-decoration: underline;">Try our AI coding assistant</a></li>
              <li style="margin: 8px 0;"><a href="https://docs.spectrumwebco.com.au" style="color: #2563eb; text-decoration: underline;">Explore the documentation</a></li>
            </ol>
          `
        })}
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="margin: 0; color: #92400e;"><strong>💬 Need Help?</strong> Our support team is available 24/7 via chat in your dashboard, or email us at <a href="mailto:support@spectrumwebco.com.au" style="color: #92400e; text-decoration: underline;">support@spectrumwebco.com.au</a></p>
        </div>
        
        <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          We're excited to see what you'll build!<br><br>
          Best regards,<br>
          <strong>The Spectrum Web Co Team</strong>
        </p>
      </div>
      
      ${templateEngine.createFooter({
        companyName: 'Spectrum Web Co LLC',
        address: 'Brisbane, Australia',
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com/spectrum-web-co' },
          { platform: 'Docs', url: 'https://docs.spectrumwebco.com.au' },
          { platform: 'Support', url: `${props.dashboardUrl}/support` }
        ]
      })}
    `;

    return templateEngine.createLayout({
      name: 'user-welcome',
      subject: `Welcome to SolidStack Enterprise, ${props.firstName}! 🚀`,
      preheader: 'Your cloud-native development platform is ready'
    }, content);
  },

  // AI Agent usage notification
  aiAgentNotification: (props: {
    userName: string;
    context: string;
    tokensUsed: number;
    remainingCalls: number;
    conversationUrl: string;
    upgradeUrl?: string;
  }) => {
    const contextLabels = {
      'infrastructure': 'Infrastructure Architecture',
      'terraform': 'Terraform Configuration',
      'kubernetes': 'Kubernetes Deployment',
      'code-generation': 'Code Generation',
      'troubleshooting': 'Troubleshooting',
      'security': 'Security Analysis'
    };

    const contextLabel = contextLabels[props.context as keyof typeof contextLabels] || props.context;

    const content = `
      ${templateEngine.createHeader({
        logo: 'https://spectrumwebco.com.au/assets/logo-email.png',
        title: '🤖 AI Assistant Session Complete',
        subtitle: 'Your cloud-native architecture consultation is ready'
      })}
      
      <div style="padding: 32px; background-color: #ffffff;">
        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Hi ${props.userName},
        </p>
        
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Your AI assistant has completed analysis for your <strong>${contextLabel}</strong> request. The detailed solution and recommendations are now available.
        </p>
        
        ${templateEngine.createButton({
          text: 'View Complete Response',
          url: props.conversationUrl,
          variant: 'primary'
        })}
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 18px;">Session Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748b;">Context:</span>
            <strong style="color: #1e293b;">${contextLabel}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748b;">Tokens Used:</span>
            <strong style="color: #1e293b;">${props.tokensUsed.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Remaining Calls Today:</span>
            <strong style="color: ${props.remainingCalls < 10 ? '#ef4444' : '#10b981'};">${props.remainingCalls}</strong>
          </div>
        </div>
        
        ${props.remainingCalls < 10 ? `
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 8px;">
            <p style="margin: 0; color: #dc2626;"><strong>⚠️ Low AI Credits:</strong> You have ${props.remainingCalls} AI calls remaining today. ${props.upgradeUrl ? `<a href="${props.upgradeUrl}" style="color: #dc2626; text-decoration: underline;">Upgrade your plan</a> for unlimited access.` : ''}</p>
          </div>
        ` : ''}
        
        <div style="background: #eff6ff; border: 1px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; color: #1e40af; font-weight: 600;">💡 Pro Tip:</p>
          <p style="margin: 0; color: #1e40af;">Save this conversation to your project notes for future reference. All AI-generated code includes production-ready error handling and security best practices.</p>
        </div>
        
        <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Questions about the solution? Reply to this email or continue the conversation in your dashboard.
        </p>
      </div>
      
      ${templateEngine.createFooter({
        companyName: 'Spectrum Web Co LLC',
        address: 'Brisbane, Australia'
      })}
    `;

    return templateEngine.createLayout({
      name: 'ai-agent-notification',
      subject: `🤖 Your ${contextLabel} solution is ready`,
      preheader: `AI assistant has completed your ${contextLabel} analysis`
    }, content);
  },

  // Payment confirmation template
  paymentConfirmation: (props: {
    customerName: string;
    email: string;
    amount: number;
    currency: string;
    plan: string;
    period: string;
    invoiceUrl: string;
    dashboardUrl: string;
    features: string[];
  }) => {
    const content = `
      ${templateEngine.createHeader({
        logo: 'https://spectrumwebco.com.au/assets/logo-email.png',
        title: 'Payment Confirmed! 💳',
        subtitle: 'Thank you for your purchase'
      })}
      
      <div style="padding: 32px; background-color: #ffffff;">
        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Hi ${props.customerName},
        </p>
        
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Your payment has been successfully processed! Your <strong>${props.plan}</strong> plan is now active and ready to use.
        </p>
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
          <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">✅ PAYMENT CONFIRMED</h2>
          <p style="margin: 0; opacity: 0.9; font-size: 18px;">${props.currency.toUpperCase()} ${props.amount.toLocaleString()} - ${props.plan} (${props.period})</p>
        </div>
        
        <div style="display: flex; gap: 16px; margin: 24px 0;">
          ${templateEngine.createButton({
            text: 'Access Dashboard',
            url: props.dashboardUrl,
            variant: 'primary'
          })}
          <div style="flex: 1;"></div>
          ${templateEngine.createButton({
            text: 'Download Invoice',
            url: props.invoiceUrl,
            variant: 'outline'
          })}
        </div>
        
        ${templateEngine.createCard({
          title: 'Your Active Features:',
          content: templateEngine.createList(props.features)
        })}
        
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; color: #0c4a6e; font-weight: 600;">📧 What's Next?</p>
          <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
            <li>Your features are immediately available in your dashboard</li>
            <li>Download invoice and receipt for your records</li>
            <li>Explore tutorials to maximize your productivity</li>
            <li>Join our community Discord for support and networking</li>
          </ul>
        </div>
        
        <p style="margin: 24px 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
          <strong>Billing Questions?</strong> Contact our billing support at <a href="mailto:billing@spectrumwebco.com.au" style="color: #2563eb; text-decoration: underline;">billing@spectrumwebco.com.au</a>
        </p>
        
        <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #1e293b;">
          Thank you for choosing SolidStack Enterprise!<br><br>
          Best regards,<br>
          <strong>The Spectrum Web Co Team</strong>
        </p>
      </div>
      
      ${templateEngine.createFooter({
        companyName: 'Spectrum Web Co LLC',
        address: 'Brisbane, Australia',
        socialLinks: [
          { platform: 'Support', url: `${props.dashboardUrl}/support` },
          { platform: 'Billing', url: 'mailto:billing@spectrumwebco.com.au' },
          { platform: 'Community', url: 'https://discord.gg/spectrumwebco' }
        ]
      })}
    `;

    return templateEngine.createLayout({
      name: 'payment-confirmation',
      subject: `Payment Confirmed - ${props.plan} Plan Activated! 💳`,
      preheader: `Your ${props.currency.toUpperCase()} ${props.amount} payment has been processed successfully`
    }, content);
  }
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */