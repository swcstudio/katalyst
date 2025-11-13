# Katalyst Forms API Documentation

## Overview

The Katalyst Forms API provides powerful dynamic form creation and management capabilities for modern web applications. Built with tRPC and TypeScript, it offers type-safe form building with 20+ field types, advanced validation, file uploads, and comprehensive submission handling.

## Features

- **Dynamic Form Builder**: Create forms with 20+ field types
- **Advanced Validation**: Client and server-side validation
- **File Uploads**: Multi-file upload with progress tracking
- **Conditional Logic**: Show/hide fields based on user input
- **Email Notifications**: Automated email workflows
- **Analytics & Reporting**: Form submission analytics
- **Spam Protection**: Built-in spam and abuse prevention
- **Third-party Integrations**: Connect with external services

## Field Types

The Forms API supports 20 different field types:

```typescript
type FieldType = 
  | 'text'          // Single line text input
  | 'email'         // Email address validation
  | 'number'        // Numeric input with min/max
  | 'tel'           // Phone number format
  | 'url'           // URL validation
  | 'password'      // Password input with strength
  | 'textarea'      // Multi-line text input
  | 'select'        // Dropdown selection
  | 'multiselect'   // Multiple selection
  | 'checkbox'      // Single checkbox
  | 'radio'         // Radio button group
  | 'date'          // Date picker
  | 'time'          // Time picker
  | 'datetime'      // Date and time picker
  | 'file'          // File upload
  | 'image'         // Image upload with preview
  | 'signature'     // Digital signature pad
  | 'rating'        // Star rating component
  | 'slider'        // Range slider
  | 'toggle'        // Toggle switch
  | 'color'         // Color picker
  | 'location'      // Address/location input
  | 'payment'       // Payment field integration
```

## API Reference

### Form Creation

#### Create Basic Form

```typescript
mutation {
  createForm({
    name: "Contact Us",
    description: "Get in touch with our team",
    fields: [
      {
        id: "name",
        type: "text",
        name: "name",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          pattern: "^[a-zA-Z\\s]+$",
          errorMessage: "Please enter a valid name"
        },
        layout: {
          width: "full",
          order: 1
        }
      },
      {
        id: "email",
        type: "email",
        name: "email",
        label: "Email Address",
        placeholder: "your@email.com",
        required: true,
        validation: {
          errorMessage: "Please enter a valid email address"
        },
        layout: {
          width: "full",
          order: 2
        }
      },
      {
        id: "message",
        type: "textarea",
        name: "message",
        label: "Message",
        placeholder: "How can we help you?",
        required: true,
        validation: {
          minLength: 10,
          maxLength: 1000,
          errorMessage: "Message must be between 10-1000 characters"
        },
        layout: {
          width: "full",
          order: 3
        }
      }
    ],
    settings: {
      submitButtonText: "Send Message",
      resetButtonText: "Clear Form",
      showProgressBar: true,
      enableSaveProgress: true,
      redirectUrl: "/thank-you",
      confirmationMessage: "Thank you for contacting us!"
    }
  })
}
```

#### Create Form with Conditional Logic

```typescript
mutation {
  createForm({
    name: "Event Registration",
    fields: [
      {
        id: "attendeeType",
        type: "select",
        name: "attendeeType",
        label: "I am a",
        required: true,
        options: [
          { label: "Student", value: "student" },
          { label: "Professional", value: "professional" },
          { label: "Speaker", value: "speaker" }
        ],
        layout: { width: "full", order: 1 }
      },
      {
        id: "studentId",
        type: "text",
        name: "studentId",
        label: "Student ID",
        required: true,
        conditional: {
          field: "attendeeType",
          operator: "equals",
          value: "student"
        },
        layout: { width: "half", order: 2 }
      },
      {
        id: "company",
        type: "text",
        name: "company",
        label: "Company Name",
        required: true,
        conditional: {
          field: "attendeeType",
          operator: "equals",
          value: "professional"
        },
        layout: { width: "half", order: 2 }
      },
      {
        id: "speakerTopic",
        type: "textarea",
        name: "speakerTopic",
        label: "Presentation Topic",
        required: true,
        conditional: {
          field: "attendeeType",
          operator: "equals",
          value: "speaker"
        },
        layout: { width: "full", order: 3 }
      }
    ]
  })
}
```

### Form Submission

#### Submit Form

```typescript
mutation {
  submitForm({
    formId: "form-123",
    data: {
      name: "John Doe",
      email: "john@example.com",
      attendeeType: "professional",
      company: "Tech Corp"
    },
    metadata: {
      userAgent: "Mozilla/5.0...",
      ipAddress: "192.168.1.1",
      referrer: "https://example.com",
      utmSource: "google",
      utmCampaign: "spring2024"
    }
  })
}
```

#### Get Form Submissions

```typescript
query {
  getFormSubmissions({
    formId: "form-123",
    status: "new",
    dateRange: {
      start: "2024-01-01",
      end: "2024-01-31"
    },
    limit: 50,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc"
  })
}
```

### File Upload Handling

#### Configure File Upload Fields

```typescript
mutation {
  createForm({
    name: "Job Application",
    fields: [
      {
        id: "resume",
        type: "file",
        name: "resume",
        label: "Resume/CV",
        required: true,
        validation: {
          allowedTypes: ["pdf", "doc", "docx"],
          maxSize: 5, // 5MB
          maxFiles: 1,
          errorMessage: "Please upload a PDF or Word document (max 5MB)"
        },
        settings: {
          showPreview: true,
          allowDragDrop: true,
          uploadUrl: "/api/upload",
          storageProvider: "s3"
        }
      },
      {
        id: "portfolio",
        type: "image",
        name: "portfolio",
        label: "Portfolio Images",
        required: false,
        validation: {
          allowedTypes: ["jpg", "png", "gif", "webp"],
          maxSize: 2, // 2MB per image
          maxFiles: 5,
          errorMessage: "Upload up to 5 images (max 2MB each)"
        },
        settings: {
          showPreview: true,
          allowMultiple: true,
          imageEditor: true,
          compressionQuality: 0.8
        }
      }
    ]
  })
}
```

#### Handle File Upload Progress

```typescript
// Upload file with progress tracking
const uploadFile = async (file: File, formId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('formId', formId);
  formData.append('fieldId', 'resume');

  const response = await fetch('/api/forms/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'X-Upload-Progress': 'true'
    }
  });

  // Handle progress events
  response.body?.getReader().read().then(({ done, value }) => {
    if (!done) {
      const progress = JSON.parse(new TextDecoder().decode(value));
      console.log(`Upload progress: ${progress.percentage}%`);
    }
  });

  return response.json();
};
```

### Email Notifications

#### Configure Email Workflows

```typescript
mutation {
  updateFormSettings({
    formId: "form-123",
    settings: {
      notifications: {
        admin: {
          enabled: true,
          emails: ["admin@company.com", "team@company.com"],
          subject: "New Form Submission: {{formName}}",
          template: "admin-notification",
          includeAttachments: true,
          conditions: {
            field: "priority",
            operator: "equals",
            value: "urgent"
          }
        },
        submitter: {
          enabled: true,
          subject: "Thank you for your submission",
          template: "auto-reply",
          delayMinutes: 5,
          includeData: true
        },
        custom: [
          {
            name: "sales-team",
            enabled: true,
            emails: ["sales@company.com"],
            subject: "New Lead: {{data.company}}",
            conditions: {
              field: "requestType",
              operator: "equals",
              value: "sales"
            }
          }
        ]
      }
    }
  })
}
```

#### Email Template Examples

```typescript
// Admin notification template
const adminTemplate = `
<h2>New Form Submission</h2>
<p><strong>Form:</strong> {{formName}}</p>
<p><strong>Date:</strong> {{createdAt}}</p>

<table>
  {{#each data}}
  <tr>
    <td><strong>{{label}}:</strong></td>
    <td>{{value}}</td>
  </tr>
  {{/each}}
</table>

{{#if attachments}}
<h3>Attachments</h3>
<ul>
  {{#each attachments}}
  <li><a href="{{url}}">{{filename}}</a></li>
  {{/each}}
</ul>
{{/if}}

<p><a href="{{adminUrl}}">View in Admin Panel</a></p>
`;

// Auto-reply template
const autoReplyTemplate = `
<h2>Thank You!</h2>
<p>Dear {{data.name}},</p>
<p>Thank you for your submission. We have received your message and will respond within 24 hours.</p>

{{#if referenceNumber}}
<p><strong>Reference Number:</strong> {{referenceNumber}}</p>
{{/if}}

<p>Best regards,<br>The Team</p>
`;
```

### Analytics & Reporting

#### Form Analytics

```typescript
query {
  getFormAnalytics({
    formId: "form-123",
    dateRange: {
      start: "2024-01-01",
      end: "2024-01-31"
    },
    metrics: [
      "totalSubmissions",
      "completionRate",
      "averageTime",
      "abandonmentRate",
      "deviceBreakdown",
      "sourceBreakdown"
    ]
  })
}
```

#### Field Analytics

```typescript
query {
  getFieldAnalytics({
    formId: "form-123",
    fieldId: "country",
    dateRange: {
      start: "2024-01-01",
      end: "2024-01-31"
    }
  })
}
```

### Spam Protection

#### Configure Anti-Spam Settings

```typescript
mutation {
  updateFormSettings({
    formId: "form-123",
    settings: {
      spamProtection: {
        enabled: true,
        methods: {
          recaptcha: {
            enabled: true,
            siteKey: "your-recaptcha-site-key",
            threshold: 0.5
          },
          honeypot: {
            enabled: true,
            fieldName: "website"
          },
          rateLimit: {
            enabled: true,
            maxSubmissions: 5,
            windowMinutes: 60,
            perIp: true,
            perEmail: true
          },
          blacklist: {
            enabled: true,
            emailDomains: ["tempmail.com", "throwaway.email"],
            ipAddresses: ["192.168.1.100"],
            keywords: ["spam", "advertisement"]
          },
          contentAnalysis: {
            enabled: true,
            checkLinks: true,
            checkEmails: true,
            suspiciousPatterns: true
          }
        }
      }
    }
  })
}
```

#### Spam Detection Rules

```typescript
const spamDetectionRules = {
  // Suspicious patterns
  suspiciousKeywords: [
    'click here', 'free money', 'guaranteed winner',
    'limited time', 'act now', 'special promotion'
  ],
  
  // Invalid email patterns
  invalidEmailPatterns: [
    /^[a-z]+\d+@/, // Letters followed by numbers
    /\.info$/, // Common spam domain
    /tempmail|throwaway|10minutemail/ // Temporary email services
  ],
  
  // Behavioral patterns
  suspiciousBehavior: {
    submissionTime: 5000, // Less than 5 seconds = suspicious
    formFieldChanges: 50, // Too many field changes
    copyPasteActivity: true, // Excessive copy/paste
    keyboardVelocity: 100 // Unusually fast typing
  }
};
```

## Integration Examples

### React Form Component

```typescript
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

interface FormField {
  id: string;
  type: string;
  name: string;
  label: string;
  required: boolean;
  validation?: any;
  conditional?: any;
  options?: Array<{ label: string; value: string }>;
}

function DynamicForm({ formId }: { formId: string }) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: formConfig } = trpc.forms.getForm.useQuery(formId);
  const submitMutation = trpc.forms.submitForm.useMutation();

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { minLength, maxLength, pattern, errorMessage } = field.validation;
      
      if (minLength && value.length < minLength) {
        return errorMessage || `${field.label} must be at least ${minLength} characters`;
      }
      
      if (maxLength && value.length > maxLength) {
        return errorMessage || `${field.label} must be less than ${maxLength} characters`;
      }
      
      if (pattern && !new RegExp(pattern).test(value)) {
        return errorMessage || `${field.label} format is invalid`;
      }
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    formConfig?.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await submitMutation.mutateAsync({
        formId,
        data: formData,
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
      
      // Handle success
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    // Check conditional logic
    if (field.conditional) {
      const { field: conditionalField, operator, value } = field.conditional;
      const conditionalValue = formData[conditionalField];
      
      let shouldShow = false;
      switch (operator) {
        case 'equals':
          shouldShow = conditionalValue === value;
          break;
        case 'not_equals':
          shouldShow = conditionalValue !== value;
          break;
        case 'contains':
          shouldShow = conditionalValue?.includes(value);
          break;
      }
      
      if (!shouldShow) return null;
    }

    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'password':
        return (
          <div key={field.id} className="form-field">
            <label>{field.label} {field.required && '*'}</label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="form-field">
            <label>{field.label} {field.required && '*'}</label>
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="form-field">
            <label>{field.label} {field.required && '*'}</label>
            <select
              name={field.name}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={error ? 'error' : ''}
            >
              <option value="">Select an option</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.id] || false}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              />
              {field.label} {field.required && '*'}
            </label>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="form-field">
            <label>{field.label} {field.required && '*'}</label>
            <input
              type="file"
              name={field.name}
              onChange={(e) => handleFieldChange(field.id, e.target.files?.[0])}
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      default:
        return (
          <div key={field.id} className="form-field">
            <label>{field.label} {field.required && '*'}</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );
    }
  };

  if (!formConfig) return <div>Loading form...</div>;

  return (
    <form onSubmit={handleSubmit} className="dynamic-form">
      <h2>{formConfig.name}</h2>
      {formConfig.description && <p>{formConfig.description}</p>}
      
      <div className="form-fields">
        {formConfig.fields.map(renderField)}
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : formConfig.settings?.submitButtonText || 'Submit'}
        </button>
        
        {formConfig.settings?.resetButtonText && (
          <button 
            type="button" 
            onClick={() => setFormData({})}
            className="reset-button"
          >
            {formConfig.settings.resetButtonText}
          </button>
        )}
      </div>
    </form>
  );
}
```

### Next.js API Route

```typescript
// pages/api/forms/submit.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { formsRouter } from '@/server/api/routers/forms';

const submissionSchema = z.object({
  formId: z.string(),
  data: z.record(z.any()),
  metadata: z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    referrer: z.string().optional(),
    utmSource: z.string().optional(),
    utmCampaign: z.string().optional()
  }).optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validatedData = submissionSchema.parse(req.body);
    
    // Get client IP address
    const forwarded = req.headers['x-forwarded-for'] as string;
    const ipAddress = forwarded 
      ? forwarded.split(',')[0] 
      : req.connection.remoteAddress;

    // Add IP to metadata
    const metadata = {
      ...validatedData.metadata,
      ipAddress,
      timestamp: new Date().toISOString()
    };

    // Submit form via tRPC
    const result = await formsRouter.submitForm({
      input: {
        formId: validatedData.formId,
        data: validatedData.data,
        metadata
      },
      ctx: { req, res }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Form submission error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Advanced Features

### Form Progress Saving

```typescript
// Auto-save form progress
const useFormProgress = (formId: string) => {
  const [saved, setSaved] = useState(false);

  const saveProgress = useCallback((data: Record<string, any>) => {
    const progressKey = `form-progress-${formId}`;
    localStorage.setItem(progressKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [formId]);

  const loadProgress = useCallback(() => {
    const progressKey = `form-progress-${formId}`;
    const saved = localStorage.getItem(progressKey);
    
    if (saved) {
      const { data, timestamp } = JSON.parse(saved);
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours
      
      if (!isExpired) {
        return data;
      } else {
        localStorage.removeItem(progressKey);
      }
    }
    
    return null;
  }, [formId]);

  const clearProgress = useCallback(() => {
    const progressKey = `form-progress-${formId}`;
    localStorage.removeItem(progressKey);
  }, [formId]);

  return { saveProgress, loadProgress, clearProgress, saved };
};
```

### Multi-Step Forms

```typescript
const MultiStepForm = ({ formId }: { formId: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [completed, setCompleted] = useState<string[]>([]);

  const steps = [
    { id: 'personal', title: 'Personal Information' },
    { id: 'professional', title: 'Professional Details' },
    { id: 'preferences', title: 'Preferences' },
    { id: 'review', title: 'Review & Submit' }
  ];

  const handleStepComplete = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCompleted(prev => [...prev, steps[currentStep].id]);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="multi-step-form">
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`step ${index === currentStep ? 'active' : ''} ${completed.includes(step.id) ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <div className="step-content">
        {currentStep === 0 && <PersonalInfoStep onComplete={handleStepComplete} />}
        {currentStep === 1 && <ProfessionalStep onComplete={handleStepComplete} />}
        {currentStep === 2 && <PreferencesStep onComplete={handleStepComplete} />}
        {currentStep === 3 && <ReviewStep data={formData} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
};
```

## Performance Optimization

### Form Caching

```typescript
// Cache form configurations
const useFormConfig = (formId: string) => {
  const { data, isLoading, error } = trpc.forms.getForm.useQuery(formId, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  });

  return { config: data, isLoading, error };
};
```

### Lazy Loading

```typescript
// Load heavy components on demand
const FormFieldEditor = lazy(() => import('./FormFieldEditor'));
const FileUploadComponent = lazy(() => import('./FileUploadComponent'));

const OptimizedForm = ({ formId }: { formId: string }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div>
      {/* Basic form fields render immediately */}
      <BasicFormFields formId={formId} />
      
      {/* Advanced features load on demand */}
      {showAdvanced && (
        <Suspense fallback={<div>Loading advanced options...</div>}>
          <FormFieldEditor />
          <FileUploadComponent />
        </Suspense>
      )}
      
      <button onClick={() => setShowAdvanced(true)}>
        Show Advanced Options
      </button>
    </div>
  );
};
```

## Best Practices

### Form Design

1. **Keep forms simple** - Only ask for essential information
2. **Use clear labels** - Make field labels descriptive and easy to understand
3. **Group related fields** - Use logical sections and grouping
4. **Provide clear feedback** - Show validation errors and success states
5. **Optimize for mobile** - Ensure forms work well on all devices

### Security

1. **Validate all input** - Both client and server-side validation
2. **Use HTTPS** - Always secure form submissions
3. **Implement rate limiting** - Prevent spam and abuse
4. **Sanitize output** - Prevent XSS attacks
5. **Use CSRF protection** - Prevent cross-site request forgery

### Performance

1. **Lazy load heavy components** - Load advanced features on demand
2. **Optimize images** - Compress and resize uploads
3. **Use caching** - Cache form configurations and submissions
4. **Minimize re-renders** - Use React.memo and useMemo appropriately
5. **Optimize bundle size** - Code split form components

This comprehensive Forms API documentation provides everything needed to build sophisticated form management systems with the Katalyst framework, from simple contact forms to complex multi-step applications with advanced validation and file handling.
