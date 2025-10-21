# Forms Router

The Forms Router provides a comprehensive form building and management system with advanced field types, conditional logic, multi-step forms, analytics, and extensive integration capabilities.

## Overview

This router enables the creation, management, and processing of dynamic forms with features like conditional field logic, multi-step forms, file uploads, spam protection, analytics, and seamless integration with third-party services.

## Features

### Form Creation & Management
- Dynamic form builder with 18+ field types
- Conditional field logic and validation
- Multi-step form support with progress tracking
- Form duplication and template management
- Advanced form settings and customization

### Field Types
- **Input Fields**: text, email, number, tel, url, password
- **Text Areas**: textarea with rich text support
- **Selection Fields**: select, multiselect, checkbox, radio
- **Date/Time Fields**: date, time, datetime
- **File Fields**: file, image with secure uploads
- **Interactive Fields**: rating, slider, toggle, color
- **Advanced Fields**: location, payment, signature

### Form Submissions
- Secure form submission handling
- Submission management and status tracking
- Bulk operations and export capabilities
- Real-time submission notifications

### Analytics & Insights
- Form performance analytics
- Conversion rate tracking
- Field drop-off analysis
- Device and referral tracking

### Integrations
- Email notifications (SMTP, SendGrid)
- Chat and collaboration (Slack, Discord)
- CRM and marketing (HubSpot, Salesforce, Mailchimp)
- Automation (Zapier, webhooks)
- Spreadsheets (Google Sheets)

### Security & Protection
- CAPTCHA integration
- Spam detection and filtering
- File upload security
- Rate limiting and abuse prevention

## API Procedures

### Form Management

#### `createForm`
**Type**: Protected Mutation  
**Description**: Create a new dynamic form with advanced settings.

**Input Schema**:
```typescript
{
  name: string,
  description?: string,
  fields: Array<Field>,
  settings?: {
    submitButtonText?: string,
    successMessage?: string,
    redirectUrl?: string,
    requireAuth?: boolean,
    captcha?: boolean,
    saveProgress?: boolean,
    multiStep?: boolean,
    steps?: Array<{
      title: string,
      fields: Array<string>
    }>
  },
  notifications?: {
    email?: {
      enabled: boolean,
      to: Array<string>,
      subject: string,
      replyTo?: string
    },
    slack?: {
      enabled: boolean,
      webhook: string
    },
    webhook?: {
      enabled: boolean,
      url: string,
      headers?: Record<string, string>
    }
  },
  integrations?: Array<{
    type: 'mailchimp' | 'sendgrid' | 'hubspot' | 'salesforce' | 'zapier' | 'google_sheets',
    config: Record<string, any>
  }>
}
```

**Field Schema**:
```typescript
{
  id: string,
  type: 'text' | 'email' | 'number' | 'tel' | 'url' | 'password' |
        'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' |
        'date' | 'time' | 'datetime' | 'file' | 'image' | 'signature' |
        'rating' | 'slider' | 'toggle' | 'color' | 'location' | 'payment',
  name: string,
  label: string,
  placeholder?: string,
  defaultValue?: any,
  required?: boolean,
  validation?: {
    min?: number,
    max?: number,
    minLength?: number,
    maxLength?: number,
    pattern?: string,
    custom?: string,
    errorMessage?: string
  },
  conditional?: {
    field: string,
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than',
    value: any
  },
  options?: Array<{
    label: string,
    value: string,
    disabled?: boolean
  }>,
  layout?: {
    width: 'full' | 'half' | 'third' | 'quarter',
    order: number
  }
}
```

**Usage Example**:
```typescript
// Create a contact form
const contactForm = await trpc.forms.createForm.mutate({
  name: 'Contact Us Form',
  description: 'Get in touch with our team',
  fields: [
    {
      id: 'name',
      type: 'text',
      name: 'name',
      label: 'Full Name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
        errorMessage: 'Please enter your full name'
      },
      layout: { width: 'full', order: 1 }
    },
    {
      id: 'email',
      type: 'email',
      name: 'email',
      label: 'Email Address',
      required: true,
      validation: {
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        errorMessage: 'Please enter a valid email address'
      },
      layout: { width: 'full', order: 2 }
    },
    {
      id: 'message',
      type: 'textarea',
      name: 'message',
      label: 'Message',
      placeholder: 'Tell us how we can help you...',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 1000
      },
      layout: { width: 'full', order: 3 }
    }
  ],
  settings: {
    submitButtonText: 'Send Message',
    successMessage: 'Thank you! We\'ll get back to you soon.',
    captcha: true,
    requireAuth: false
  },
  notifications: {
    email: {
      enabled: true,
      to: ['contact@company.com'],
      subject: 'New Contact Form Submission',
      replyTo: 'noreply@company.com'
    },
    slack: {
      enabled: true,
      webhook: 'https://hooks.slack.com/services/xxx'
    }
  }
});

// Create a multi-step registration form
const registrationForm = await trpc.forms.createForm.mutate({
  name: 'User Registration',
  fields: [
    {
      id: 'account-email',
      type: 'email',
      name: 'email',
      label: 'Email Address',
      required: true
    },
    {
      id: 'account-password',
      type: 'password',
      name: 'password',
      label: 'Password',
      required: true
    },
    {
      id: 'profile-name',
      type: 'text',
      name: 'name',
      label: 'Full Name',
      required: true
    },
    {
      id: 'profile-phone',
      type: 'tel',
      name: 'phone',
      label: 'Phone Number',
      required: false
    },
    {
      id: 'preferences-newsletter',
      type: 'checkbox',
      name: 'newsletter',
      label: 'Subscribe to newsletter',
      required: false
    }
  ],
  settings: {
    multiStep: true,
    saveProgress: true,
    steps: [
      {
        title: 'Account Information',
        fields: ['account-email', 'account-password']
      },
      {
        title: 'Profile Information',
        fields: ['profile-name', 'profile-phone']
      },
      {
        title: 'Preferences',
        fields: ['preferences-newsletter']
      }
    ]
  }
});
```

#### `updateForm`
**Type**: Protected Mutation  
**Description**: Update an existing form's configuration.

**Input Schema**:
```typescript
{
  id: string,
  data: {
    name?: string,
    description?: string,
    fields?: Array<Field>,
    settings?: any,
    notifications?: any,
    integrations?: any
  }
}
```

**Usage Example**:
```typescript
await trpc.forms.updateForm.mutate({
  id: 'form-123',
  data: {
    name: 'Updated Contact Form',
    fields: [
      // Updated field configuration
      {
        id: 'company',
        type: 'text',
        name: 'company',
        label: 'Company Name',
        required: false,
        layout: { width: 'half', order: 3 }
      }
    ]
  }
});
```

#### `deleteForm`
**Type**: Protected Mutation  
**Description**: Delete a form and all its submissions.

**Input Schema**:
```typescript
{
  id: string
}
```

**Usage Example**:
```typescript
await trpc.forms.deleteForm.mutate({
  id: 'form-to-delete'
});
```

#### `getForm`
**Type**: Public Query  
**Description**: Retrieve form configuration for rendering.

**Input Schema**:
```typescript
{
  id?: string,
  slug?: string
}
```

**Usage Example**:
```typescript
// Get form by ID
const form = await trpc.forms.getForm.query({
  id: 'form-123'
});

// Get form by slug
const formBySlug = await trpc.forms.getForm.query({
  slug: 'contact-us'
});
```

#### `listForms`
**Type**: Protected Query  
**Description**: List all forms with pagination and search.

**Input Schema**:
```typescript
{
  page?: number,
  limit?: number,
  search?: string
}
```

**Usage Example**:
```typescript
const forms = await trpc.forms.listForms.query({
  page: 1,
  limit: 20,
  search: 'contact'
});

console.log(`Found ${forms.total} forms`);
```

#### `duplicateForm`
**Type**: Protected Mutation  
**Description**: Create a duplicate of an existing form.

**Input Schema**:
```typescript
{
  formId: string,
  name: string
}
```

**Usage Example**:
```typescript
const duplicate = await trpc.forms.duplicateForm.mutate({
  formId: 'original-form-id',
  name: 'Copy of Contact Form'
});
```

### Form Submissions

#### `submitForm`
**Type**: Public Mutation  
**Description**: Submit a form with validation and processing.

**Input Schema**:
```typescript
{
  formId: string,
  data: Record<string, any>,
  recaptchaToken?: string,
  sessionId?: string
}
```

**Response**:
```typescript
{
  success: boolean,
  submissionId: string,
  message: string
}
```

**Usage Example**:
```typescript
// Submit a form
const submission = await trpc.forms.submitForm.mutate({
  formId: 'form-123',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I need help with your product'
  },
  recaptchaToken: 'recaptcha-token-here'
});

if (submission.success) {
  console.log(`Form submitted with ID: ${submission.submissionId}`);
}
```

#### `getSubmissions`
**Type**: Protected Query  
**Description**: Retrieve form submissions with filtering and pagination.

**Input Schema**:
```typescript
{
  formId: string,
  status?: 'pending' | 'processed' | 'spam' | 'deleted',
  dateFrom?: Date,
  dateTo?: Date,
  search?: string,
  page?: number,
  limit?: number
}
```

**Response**:
```typescript
{
  submissions: Array<Submission>,
  total: number,
  stats: {
    total: number,
    today: number,
    week: number,
    month: number
  }
}
```

**Usage Example**:
```typescript
// Get all submissions for a form
const submissions = await trpc.forms.getSubmissions.query({
  formId: 'form-123',
  page: 1,
  limit: 50
});

// Get submissions from last week
const recentSubmissions = await trpc.forms.getSubmissions.query({
  formId: 'form-123',
  dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  dateTo: new Date()
});

// Get only pending submissions
const pendingSubmissions = await trpc.forms.getSubmissions.query({
  formId: 'form-123',
  status: 'pending'
});
```

#### `getSubmission`
**Type**: Protected Query  
**Description**: Retrieve a specific submission's details.

**Input Schema**:
```typescript
{
  submissionId: string
}
```

**Usage Example**:
```typescript
const submission = await trpc.forms.getSubmission.query({
  submissionId: 'submission-123'
});

console.log('Submission data:', submission.data);
```

#### `updateSubmissionStatus`
**Type**: Protected Mutation  
**Description**: Update the status of a form submission.

**Input Schema**:
```typescript
{
  submissionId: string,
  status: 'pending' | 'processed' | 'spam' | 'deleted',
  notes?: string
}
```

**Usage Example**:
```typescript
// Mark submission as processed
await trpc.forms.updateSubmissionStatus.mutate({
  submissionId: 'submission-123',
  status: 'processed',
  notes: 'Contacted customer via email'
});

// Mark as spam
await trpc.forms.updateSubmissionStatus.mutate({
  submissionId: 'submission-456',
  status: 'spam',
  notes: 'Suspicious submission pattern'
});
```

#### `exportSubmissions`
**Type**: Protected Mutation  
**Description**: Export form submissions in various formats.

**Input Schema**:
```typescript
{
  formId: string,
  format: 'csv' | 'excel' | 'json',
  dateFrom?: Date,
  dateTo?: Date
}
```

**Response**:
```typescript
{
  downloadUrl: string,
  expiresAt: Date
}
```

**Usage Example**:
```typescript
// Export all submissions as CSV
const csvExport = await trpc.forms.exportSubmissions.mutate({
  formId: 'form-123',
  format: 'csv'
});

console.log(`Download CSV: ${csvExport.downloadUrl}`);

// Export last month's submissions as Excel
const excelExport = await trpc.forms.exportSubmissions.mutate({
  formId: 'form-123',
  format: 'excel',
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  dateTo: new Date()
});
```

### Multi-step Form Progress

#### `saveProgress`
**Type**: Public Mutation  
**Description**: Save progress for multi-step forms.

**Input Schema**:
```typescript
{
  formId: string,
  sessionId: string,
  step: number,
  data: Record<string, any>
}
```

**Usage Example**:
```typescript
// Save progress on step 2
await trpc.forms.saveProgress.mutate({
  formId: 'form-123',
  sessionId: 'session-abc123',
  step: 2,
  data: {
    name: 'John Doe',
    email: 'john@example.com'
  }
});
```

#### `getProgress`
**Type**: Public Query  
**Description**: Retrieve saved progress for multi-step forms.

**Input Schema**:
```typescript
{
  formId: string,
  sessionId: string
}
```

**Response**:
```typescript
{
  step: number,
  data: Record<string, any>,
  completedSteps: Array<number>
}
```

**Usage Example**:
```typescript
const progress = await trpc.forms.getProgress.query({
  formId: 'form-123',
  sessionId: 'session-abc123'
});

console.log(`Current step: ${progress.step}`);
console.log('Saved data:', progress.data);
```

### Form Analytics

#### `getFormAnalytics`
**Type**: Protected Query  
**Description**: Retrieve comprehensive form analytics.

**Input Schema**:
```typescript
{
  formId: string,
  dateFrom?: Date,
  dateTo?: Date
}
```

**Response**:
```typescript
{
  views: number,
  submissions: number,
  conversionRate: number,
  avgCompletionTime: number,
  fieldDropoff: Record<string, number>,
  deviceBreakdown: {
    desktop: number,
    mobile: number,
    tablet: number
  },
  topReferrers: Array<{ url: string, count: number }>
}
```

**Usage Example**:
```typescript
const analytics = await trpc.forms.getFormAnalytics.query({
  formId: 'form-123',
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  dateTo: new Date()
});

console.log(`Form views: ${analytics.views}`);
console.log(`Submissions: ${analytics.submissions}`);
console.log(`Conversion rate: ${(analytics.conversionRate * 100).toFixed(1)}%`);
console.log(`Avg completion time: ${analytics.avgCompletionTime}s`);

// Analyze field drop-off
Object.entries(analytics.fieldDropoff).forEach(([field, dropoff]) => {
  console.log(`${field}: ${dropoff}% drop-off rate`);
});
```

### Templates

#### `createFieldTemplate`
**Type**: Protected Mutation  
**Description**: Create a reusable field template.

**Input Schema**:
```typescript
{
  name: string,
  description?: string,
  field: Field,
  category: string
}
```

**Usage Example**:
```typescript
const fieldTemplate = await trpc.forms.createFieldTemplate.mutate({
  name: 'US Phone Number',
  description: 'Phone number field with US format validation',
  field: {
    id: 'us-phone',
    type: 'tel',
    name: 'phone',
    label: 'Phone Number',
    placeholder: '(555) 555-5555',
    required: true,
    validation: {
      pattern: '^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$',
      errorMessage: 'Please enter a valid US phone number'
    }
  },
  category: 'contact'
});
```

#### `getFieldTemplates`
**Type**: Protected Query  
**Description**: Retrieve available field templates.

**Input Schema**:
```typescript
{
  category?: string
}
```

**Usage Example**:
```typescript
// Get all field templates
const allTemplates = await trpc.forms.getFieldTemplates.query({});

// Get contact field templates
const contactTemplates = await trpc.forms.getFieldTemplates.query({
  category: 'contact'
});
```

#### `createFormTemplate`
**Type**: Protected Mutation  
**Description**: Create a reusable form template.

**Input Schema**:
```typescript
{
  name: string,
  description?: string,
  category: string,
  thumbnail?: string,
  form: any
}
```

**Usage Example**:
```typescript
const formTemplate = await trpc.forms.createFormTemplate.mutate({
  name: 'Event Registration Form',
  description: 'Complete event registration with attendee information',
  category: 'events',
  thumbnail: 'https://cdn.example.com/event-form-thumb.jpg',
  form: {
    fields: [
      // Pre-configured fields
    ],
    settings: {
      // Default settings
    }
  }
});
```

#### `getFormTemplates`
**Type**: Public Query  
**Description**: Retrieve available form templates.

**Input Schema**:
```typescript
{
  category?: string,
  search?: string
}
```

**Usage Example**:
```typescript
const templates = await trpc.forms.getFormTemplates.query({
  category: 'contact',
  search: 'simple'
});

templates.templates.forEach(template => {
  console.log(`${template.name}: ${template.description}`);
  console.log(`Fields: ${template.fields}`);
});
```

### Webhooks & Integrations

#### `testWebhook`
**Type**: Protected Mutation  
**Description**: Test webhook connectivity and response.

**Input Schema**:
```typescript
{
  url: string,
  method?: 'GET' | 'POST' | 'PUT',
  headers?: Record<string, string>,
  sampleData: Record<string, any>
}
```

**Response**:
```typescript
{
  success: boolean,
  response: any,
  statusCode: number
}
```

**Usage Example**:
```typescript
const webhookTest = await trpc.forms.testWebhook.mutate({
  url: 'https://api.example.com/webhook',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token123',
    'Content-Type': 'application/json'
  },
  sampleData: {
    formId: 'form-123',
    submission: {
      name: 'Test User',
      email: 'test@example.com'
    }
  }
});

if (webhookTest.success) {
  console.log(`Webhook responded with status: ${webhookTest.statusCode}`);
} else {
  console.log('Webhook test failed');
}
```

### File Uploads

#### `getUploadUrl`
**Type**: Public Mutation  
**Description**: Generate a presigned URL for secure file uploads.

**Input Schema**:
```typescript
{
  formId: string,
  fieldId: string,
  filename: string,
  mimeType: string,
  size: number
}
```

**Response**:
```typescript
{
  uploadUrl: string,
  fileId: string,
  expiresAt: Date
}
```

**Usage Example**:
```typescript
// Get upload URL for an image
const uploadInfo = await trpc.forms.getUploadUrl.mutate({
  formId: 'form-123',
  fieldId: 'field-avatar',
  filename: 'profile-picture.jpg',
  mimeType: 'image/jpeg',
  size: 2048000 // 2MB
});

// Upload file directly to the presigned URL
const response = await fetch(uploadInfo.uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});

if (response.ok) {
  console.log(`File uploaded with ID: ${uploadInfo.fileId}`);
}
```

### Spam Protection

#### `reportSpam`
**Type**: Protected Mutation  
**Description**: Report a submission as spam for improved filtering.

**Input Schema**:
```typescript
{
  submissionId: string,
  reason?: string
}
```

**Usage Example**:
```typescript
await trpc.forms.reportSpam.mutate({
  submissionId: 'submission-123',
  reason: 'Suspicious email domain and repetitive content'
});
```

#### `getSpamStats`
**Type**: Protected Query  
**Description**: Retrieve spam protection statistics.

**Input Schema**:
```typescript
{
  formId: string
}
```

**Response**:
```typescript
{
  totalSpam: number,
  spamRate: number,
  topSpamIndicators: Array<{
    indicator: string,
    count: number,
    percentage: number
  }>
}
```

**Usage Example**:
```typescript
const spamStats = await trpc.forms.getSpamStats.query({
  formId: 'form-123'
});

console.log(`Total spam blocked: ${spamStats.totalSpam}`);
console.log(`Spam rate: ${(spamStats.spamRate * 100).toFixed(1)}%`);

spamStats.topSpamIndicators.forEach(indicator => {
  console.log(`${indicator.indicator}: ${indicator.count} occurrences (${indicator.percentage}%)`);
});
```

## Integration Examples

### React Form Component
```typescript
import { trpc } from '@/utils/trpc';
import { useState, useCallback } from 'react';

export function DynamicForm({ formId }: { formId: string }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: form } = trpc.forms.getForm.useQuery({ id: formId });
  const submitForm = trpc.forms.submitForm.useMutation();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitForm.mutateAsync({
        formId,
        data: formData
      });

      if (result.success) {
        alert('Form submitted successfully!');
        setFormData({});
      }
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formId, formData, submitForm]);

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  if (!form) return <div>Loading form...</div>;

  return (
    <form onSubmit={handleSubmit} className="dynamic-form">
      {form.fields.map((field: any) => (
        <div key={field.id} className="form-field">
          <label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          
          {field.type === 'text' && (
            <input
              type="text"
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          )}
          
          {field.type === 'email' && (
            <input
              type="email"
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          )}
          
          {field.type === 'textarea' && (
            <textarea
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          )}
          
          {/* Add other field types as needed */}
        </div>
      ))}
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Submitting...' : form.settings?.submitButtonText || 'Submit'}
      </button>
    </form>
  );
}
```

### Multi-step Form with Progress
```typescript
import { trpc } from '@/utils/trpc';
import { useState, useEffect } from 'react';

export function MultiStepForm({ formId }: { formId: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [sessionId] = useState(() => `session-${Date.now()}`);
  
  const { data: form } = trpc.forms.getForm.useQuery({ id: formId });
  const { data: progress } = trpc.forms.getProgress.useQuery(
    { formId, sessionId },
    { enabled: !!sessionId }
  );
  
  const saveProgress = trpc.forms.saveProgress.useMutation();
  const submitForm = trpc.forms.submitForm.useMutation();

  // Load saved progress on mount
  useEffect(() => {
    if (progress) {
      setCurrentStep(progress.step);
      setFormData(progress.data);
    }
  }, [progress]);

  const handleNext = useCallback(async () => {
    // Save current progress
    await saveProgress.mutateAsync({
      formId,
      sessionId,
      step: currentStep,
      data: formData
    });

    // Move to next step
    if (currentStep < (form?.settings?.steps?.length || 1)) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, formData, formId, sessionId, saveProgress, form]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    const result = await submitForm.mutateAsync({
      formId,
      data: formData,
      sessionId
    });

    if (result.success) {
      alert('Form submitted successfully!');
    }
  }, [formId, formData, sessionId, submitForm]);

  if (!form) return <div>Loading form...</div>;

  const currentStepData = form.settings?.steps?.[currentStep - 1];
  const currentFields = form.fields.filter((field: any) => 
    currentStepData?.fields.includes(field.id)
  );

  return (
    <div className="multi-step-form">
      <div className="step-indicator">
        {form.settings?.steps?.map((step: any, index: number) => (
          <div 
            key={index}
            className={`step ${index + 1 <= currentStep ? 'active' : ''} ${index + 1 === currentStep ? 'current' : ''}`}
          >
            {index + 1}. {step.title}
          </div>
        ))}
      </div>

      <div className="step-content">
        <h2>{currentStepData?.title}</h2>
        
        {currentFields.map((field: any) => (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id}>{field.label}</label>
            <input
              type={field.type}
              id={field.id}
              name={field.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                [field.name]: e.target.value
              }))}
              value={formData[field.name] || ''}
            />
          </div>
        ))}
      </div>

      <div className="step-navigation">
        {currentStep > 1 && (
          <button onClick={handlePrevious} className="previous-button">
            Previous
          </button>
        )}
        
        {currentStep < (form.settings?.steps?.length || 1) ? (
          <button onClick={handleNext} className="next-button">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
```

### Form Analytics Dashboard
```typescript
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export function FormAnalytics({ formId }: { formId: string }) {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const { data: analytics } = trpc.forms.getFormAnalytics.useQuery({
    formId,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div className="form-analytics">
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Views</h3>
          <div className="metric-value">{analytics.views.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
          <h3>Submissions</h3>
          <div className="metric-value">{analytics.submissions.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
          <h3>Conversion Rate</h3>
          <div className="metric-value">
            {(analytics.conversionRate * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Avg. Completion Time</h3>
          <div className="metric-value">{analytics.avgCompletionTime}s</div>
        </div>
      </div>

      <div className="analytics-sections">
        <div className="section">
          <h3>Device Breakdown</h3>
          <div className="device-stats">
            <div>Desktop: {analytics.deviceBreakdown.desktop}%</div>
            <div>Mobile: {analytics.deviceBreakdown.mobile}%</div>
            <div>Tablet: {analytics.deviceBreakdown.tablet}%</div>
          </div>
        </div>

        <div className="section">
          <h3>Field Drop-off Analysis</h3>
          {Object.entries(analytics.fieldDropoff).map(([field, dropoff]) => (
            <div key={field} className="dropoff-item">
              <span>{field}</span>
              <span>{dropoff}%</span>
            </div>
          ))}
        </div>

        <div className="section">
          <h3>Top Referrers</h3>
          {analytics.topReferrers.map((referrer, index) => (
            <div key={index} className="referrer-item">
              <span>{referrer.url}</span>
              <span>{referrer.count} visits</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Best Practices

### Form Design
- Keep forms simple and focused
- Use clear and concise labels
- Group related fields together
- Provide helpful error messages
- Use progressive disclosure for complex forms

### Field Validation
- Validate on both client and server side
- Provide real-time validation feedback
- Use appropriate validation rules for each field type
- Display clear error messages with guidance

### Multi-step Forms
- Break complex forms into logical steps
- Show progress indicators
- Save progress automatically
- Allow users to navigate between steps

### Performance
- Optimize form loading with lazy loading
- Use debounced validation for better UX
- Implement rate limiting for submissions
- Cache form templates and field definitions

### Security
- Always validate and sanitize input
- Use CAPTCHA for public forms
- Implement rate limiting
- Secure file uploads with proper validation
- Use HTTPS for all form submissions

### Analytics & Optimization
- Track form performance metrics
- Monitor conversion rates
- Analyze field drop-off patterns
- A/B test form variations
- Use analytics to improve user experience

## Error Handling

```typescript
try {
  const result = await trpc.forms.submitForm.mutate({
    formId: 'form-123',
    data: formData
  });
} catch (error) {
  if (error.data?.code === 'BAD_REQUEST') {
    // Handle validation errors
    const validationErrors = error.data?.validationErrors;
    validationErrors?.forEach((err: any) => {
      console.error(`${err.field}: ${err.message}`);
    });
  } else if (error.data?.code === 'TOO_MANY_REQUESTS') {
    // Handle rate limiting
    alert('Please wait before submitting again.');
  } else {
    // Handle other errors
    alert('Submission failed. Please try again later.');
  }
}
```

## Integration with tRPC

The forms router integrates seamlessly with the tRPC system:

```typescript
// In your main tRPC router
export const appRouter = router({
  forms: formsRouter,
  builder: builderRouter,
  analytics: analyticsRouter,
  // ... other routers
});

export type AppRouter = typeof appRouter;
```

This provides type-safe access to all form procedures throughout your application, enabling seamless integration with dynamic form functionality.
