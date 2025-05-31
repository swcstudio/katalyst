import { css } from '../../../panda.config.ts';

export interface TemplateProps {
  [key: string]: any;
}

export interface EmailComponent {
  render(props: TemplateProps): string;
}

export interface TemplateConfig {
  name: string;
  subject: string;
  preheader?: string;
  preview?: string;
  darkMode?: boolean;
  width?: number;
}

export interface EmailTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

const defaultTheme: EmailTheme = {
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
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace'
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
    sm: '4px',
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

class EmailStyler {
  private theme: EmailTheme;

  constructor(theme: EmailTheme = defaultTheme) {
    this.theme = theme;
  }

  // Generate email-safe inline styles
  inlineStyles(styles: Record<string, string>): string {
    return Object.entries(styles)
      .map(([property, value]) => `${this.kebabCase(property)}: ${value}`)
      .join('; ');
  }

  // Email container styles
  container(width: number = 600): string {
    return this.inlineStyles({
      maxWidth: `${width}px`,
      margin: '0 auto',
      backgroundColor: this.theme.colors.background,
      fontFamily: this.theme.fonts.primary,
      fontSize: '16px',
      lineHeight: '1.6',
      color: this.theme.colors.text
    });
  }

  // Header styles
  header(): string {
    return this.inlineStyles({
      backgroundColor: this.theme.colors.primary,
      padding: this.theme.spacing.lg,
      textAlign: 'center'
    });
  }

  // Content section styles
  content(): string {
    return this.inlineStyles({
      padding: this.theme.spacing.xl,
      backgroundColor: this.theme.colors.background
    });
  }

  // Button styles
  button(variant: 'primary' | 'secondary' | 'outline' = 'primary'): string {
    const baseStyles = {
      display: 'inline-block',
      padding: `${this.theme.spacing.md} ${this.theme.spacing.lg}`,
      textDecoration: 'none',
      borderRadius: this.theme.borderRadius.md,
      fontWeight: '600',
      textAlign: 'center',
      fontSize: '16px',
      lineHeight: '1',
      cursor: 'pointer'
    };

    const variants = {
      primary: {
        ...baseStyles,
        backgroundColor: this.theme.colors.primary,
        color: '#ffffff',
        border: `2px solid ${this.theme.colors.primary}`
      },
      secondary: {
        ...baseStyles,
        backgroundColor: this.theme.colors.secondary,
        color: '#ffffff',
        border: `2px solid ${this.theme.colors.secondary}`
      },
      outline: {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: this.theme.colors.primary,
        border: `2px solid ${this.theme.colors.primary}`
      }
    };

    return this.inlineStyles(variants[variant]);
  }

  // Card styles
  card(): string {
    return this.inlineStyles({
      backgroundColor: this.theme.colors.surface,
      border: `1px solid ${this.theme.colors.border}`,
      borderRadius: this.theme.borderRadius.lg,
      padding: this.theme.spacing.lg,
      margin: `${this.theme.spacing.md} 0`
    });
  }

  // Footer styles
  footer(): string {
    return this.inlineStyles({
      backgroundColor: this.theme.colors.surface,
      padding: this.theme.spacing.lg,
      textAlign: 'center',
      fontSize: '14px',
      color: this.theme.colors.textSecondary,
      borderTop: `1px solid ${this.theme.colors.border}`
    });
  }

  // Text styles
  heading(level: 1 | 2 | 3 | 4 = 1): string {
    const sizes = {
      1: '32px',
      2: '24px',
      3: '20px',
      4: '18px'
    };

    return this.inlineStyles({
      fontSize: sizes[level],
      fontWeight: '700',
      lineHeight: '1.2',
      margin: `${this.theme.spacing.lg} 0 ${this.theme.spacing.md} 0`,
      color: this.theme.colors.text
    });
  }

  paragraph(): string {
    return this.inlineStyles({
      margin: `${this.theme.spacing.md} 0`,
      lineHeight: '1.6',
      color: this.theme.colors.text
    });
  }

  link(): string {
    return this.inlineStyles({
      color: this.theme.colors.primary,
      textDecoration: 'underline'
    });
  }

  // Utility method
  private kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}

export class EmailTemplateEngine {
  private styler: EmailStyler;
  private theme: EmailTheme;

  constructor(theme: EmailTheme = defaultTheme) {
    this.theme = theme;
    this.styler = new EmailStyler(theme);
  }

  // Base layout component
  createLayout(config: TemplateConfig, content: string): string {
    const { width = 600, preheader = '', darkMode = false } = config;

    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light${darkMode ? ' dark' : ''}">
  <meta name="supported-color-schemes" content="light${darkMode ? ' dark' : ''}">
  <title>${config.subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Email client resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      ${darkMode ? `
        .dark-mode { background-color: #1a1a1a !important; color: #ffffff !important; }
        .dark-surface { background-color: #2d2d2d !important; }
        .dark-border { border-color: #404040 !important; }
      ` : ''}
    }
    
    /* Mobile responsive */
    @media only screen and (max-width: 620px) {
      .mobile-full { width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .mobile-hide { display: none !important; }
      .mobile-padding { padding: 16px !important; }
    }
  </style>
</head>
<body style="${this.styler.inlineStyles({
  margin: '0',
  padding: '0',
  backgroundColor: this.theme.colors.background,
  fontFamily: this.theme.fonts.primary
})}">
  ${preheader ? `
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: transparent;">
    ${preheader}
  </div>
  ` : ''}
  
  <div role="article" aria-roledescription="email" lang="en" style="${this.styler.container(width)}">
    ${content}
  </div>
</body>
</html>`;
  }

  // Header component
  createHeader(props: { logo?: string; title?: string; subtitle?: string }): string {
    return `
    <div style="${this.styler.header()}">
      ${props.logo ? `
        <img src="${props.logo}" alt="Logo" style="height: 50px; margin-bottom: ${this.theme.spacing.md};">
      ` : ''}
      ${props.title ? `
        <h1 style="${this.styler.heading(1)}; color: white; margin: 0;">
          ${props.title}
        </h1>
      ` : ''}
      ${props.subtitle ? `
        <p style="${this.styler.paragraph()}; color: rgba(255, 255, 255, 0.9); margin: ${this.theme.spacing.sm} 0 0 0;">
          ${props.subtitle}
        </p>
      ` : ''}
    </div>`;
  }

  // Button component
  createButton(props: { 
    text: string; 
    url: string; 
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
  }): string {
    const { text, url, variant = 'primary', fullWidth = false } = props;
    
    return `
    <div style="text-align: center; margin: ${this.theme.spacing.lg} 0;">
      <a href="${url}" style="${this.styler.button(variant)}${fullWidth ? '; width: 100%; box-sizing: border-box;' : ''}">
        ${text}
      </a>
    </div>`;
  }

  // Card component
  createCard(props: { title?: string; content: string; footer?: string }): string {
    return `
    <div style="${this.styler.card()}">
      ${props.title ? `
        <h3 style="${this.styler.heading(3)}; margin-top: 0;">
          ${props.title}
        </h3>
      ` : ''}
      <div style="${this.styler.paragraph()}">
        ${props.content}
      </div>
      ${props.footer ? `
        <div style="margin-top: ${this.theme.spacing.md}; padding-top: ${this.theme.spacing.md}; border-top: 1px solid ${this.theme.colors.border}; font-size: 14px; color: ${this.theme.colors.textSecondary};">
          ${props.footer}
        </div>
      ` : ''}
    </div>`;
  }

  // List component
  createList(items: string[], ordered: boolean = false): string {
    const tag = ordered ? 'ol' : 'ul';
    const listItems = items.map(item => `<li style="margin: ${this.theme.spacing.sm} 0;">${item}</li>`).join('');
    
    return `
    <${tag} style="margin: ${this.theme.spacing.md} 0; padding-left: ${this.theme.spacing.lg}; color: ${this.theme.colors.text};">
      ${listItems}
    </${tag}>`;
  }

  // Footer component
  createFooter(props: {
    companyName: string;
    address?: string;
    unsubscribeUrl?: string;
    socialLinks?: Array<{ platform: string; url: string; icon?: string }>;
  }): string {
    return `
    <div style="${this.styler.footer()}">
      <p style="margin: 0 0 ${this.theme.spacing.md} 0; font-weight: 600;">
        ${props.companyName}
      </p>
      ${props.address ? `
        <p style="margin: 0 0 ${this.theme.spacing.md} 0;">
          ${props.address}
        </p>
      ` : ''}
      ${props.socialLinks?.length ? `
        <div style="margin: ${this.theme.spacing.md} 0;">
          ${props.socialLinks.map(link => `
            <a href="${link.url}" style="color: ${this.theme.colors.textSecondary}; text-decoration: none; margin: 0 ${this.theme.spacing.sm};">
              ${link.icon || link.platform}
            </a>
          `).join('')}
        </div>
      ` : ''}
      ${props.unsubscribeUrl ? `
        <p style="margin: ${this.theme.spacing.md} 0 0 0; font-size: 12px;">
          <a href="${props.unsubscribeUrl}" style="${this.styler.link()}; font-size: 12px;">
            Unsubscribe
          </a> from these emails
        </p>
      ` : ''}
    </div>`;
  }

  // Pre-built templates
  createWelcomeTemplate(props: {
    userName: string;
    companyName: string;
    ctaText: string;
    ctaUrl: string;
    logo?: string;
    benefits?: string[];
  }): string {
    const content = `
      ${this.createHeader({ 
        logo: props.logo, 
        title: `Welcome to ${props.companyName}!`,
        subtitle: 'We\'re excited to have you on board'
      })}
      
      <div style="${this.styler.content()}">
        <p style="${this.styler.paragraph()}">
          Hi ${props.userName},
        </p>
        
        <p style="${this.styler.paragraph()}">
          Welcome to ${props.companyName}! We're thrilled that you've joined our community of developers building the future of cloud-native applications.
        </p>
        
        ${props.benefits?.length ? `
          ${this.createCard({
            title: 'What you get access to:',
            content: this.createList(props.benefits)
          })}
        ` : ''}
        
        ${this.createButton({
          text: props.ctaText,
          url: props.ctaUrl,
          variant: 'primary'
        })}
        
        <p style="${this.styler.paragraph()}">
          If you have any questions, don't hesitate to reach out. We're here to help!
        </p>
        
        <p style="${this.styler.paragraph()}">
          Best regards,<br>
          The ${props.companyName} Team
        </p>
      </div>
      
      ${this.createFooter({
        companyName: props.companyName,
        address: 'Brisbane, Australia',
        unsubscribeUrl: '#unsubscribe'
      })}
    `;

    return this.createLayout({
      name: 'welcome',
      subject: `Welcome to ${props.companyName}!`,
      preheader: 'Get started with your new account'
    }, content);
  }

  createNotificationTemplate(props: {
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    ctaText?: string;
    ctaUrl?: string;
    companyName: string;
  }): string {
    const typeColors = {
      success: this.theme.colors.success,
      warning: this.theme.colors.warning,
      error: this.theme.colors.error,
      info: this.theme.colors.primary
    };

    const content = `
      <div style="${this.styler.content()}">
        <div style="padding: ${this.theme.spacing.lg}; background-color: ${typeColors[props.type]}15; border-left: 4px solid ${typeColors[props.type]}; margin-bottom: ${this.theme.spacing.lg};">
          <h2 style="${this.styler.heading(2)}; color: ${typeColors[props.type]}; margin-top: 0;">
            ${props.title}
          </h2>
        </div>
        
        <p style="${this.styler.paragraph()}">
          ${props.message}
        </p>
        
        ${props.ctaText && props.ctaUrl ? this.createButton({
          text: props.ctaText,
          url: props.ctaUrl,
          variant: 'primary'
        }) : ''}
      </div>
      
      ${this.createFooter({
        companyName: props.companyName,
        address: 'Brisbane, Australia'
      })}
    `;

    return this.createLayout({
      name: 'notification',
      subject: props.title,
      preheader: props.message.substring(0, 100)
    }, content);
  }

  // Template compilation method
  compile(templateName: string, props: TemplateProps): string {
    switch (templateName) {
      case 'welcome':
        return this.createWelcomeTemplate(props);
      case 'notification':
        return this.createNotificationTemplate(props);
      default:
        throw new Error(`Unknown template: ${templateName}`);
    }
  }
}

// Export factory function
export function createEmailTemplateEngine(theme?: EmailTheme): EmailTemplateEngine {
  return new EmailTemplateEngine(theme);
}

// Default instance
export const defaultTemplateEngine = new EmailTemplateEngine();

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under Commercial License.
 */