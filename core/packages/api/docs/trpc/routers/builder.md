# Builder Router

The Builder Router provides a comprehensive visual website and application builder system with drag-and-drop functionality, component management, templates, and publishing capabilities.

## Overview

This router enables users to create, manage, and deploy websites and applications without writing code through a visual interface. It includes project management, component libraries, asset handling, data integration, and deployment features.

## Features

### Project Management
- Create and manage multiple projects
- Support for different project types (website, app, landing, dashboard, form)
- Project duplication and deletion
- Custom project settings and configurations

### Visual Page Builder
- Drag-and-drop component placement
- Real-time preview
- Component customization with props and styles
- Animation and event handling

### Component System
- Pre-built component library
- Custom component creation
- Component categorization and search
- Reusable components across projects

### Template System
- Pre-designed templates for various use cases
- Template-based project creation
- Customizable template content

### Asset Management
- File upload and organization
- Support for images, videos, fonts, and icons
- Folder-based asset organization
- CDN integration

### Data Integration
- Multiple data source types (API, database, CSV, JSON, GraphQL)
- Real-time data binding
- Data source testing and validation

### Form Builder
- Dynamic form creation
- Field validation
- Multiple action types (email, webhook, database, integrations)
- Form submission handling

### Publishing & Deployment
- Staging and production environments
- One-click publishing
- Deployment history and management
- Custom domain support

### Code Export
- Export to multiple frameworks (React, Vue, Angular, HTML, Next.js, Nuxt.js)
- Asset bundling options
- Download management

### Collaboration
- Project sharing with role-based permissions
- Collaborator management
- Real-time collaboration support

## API Procedures

### Project Management

#### `createProject`
**Type**: Protected Mutation  
**Description**: Create a new builder project.

**Input Schema**:
```typescript
{
  name: string,
  type: 'website' | 'app' | 'landing' | 'dashboard' | 'form',
  template?: string,
  settings?: {
    domain?: string,
    subdomain?: string,
    favicon?: string,
    analytics?: {
      google?: string,
      facebook?: string,
      custom?: string,
    }
  }
}
```

**Response**:
```typescript
{
  id: string,
  name: string,
  type: string,
  template?: string,
  settings?: object
}
```

**Usage Example**:
```typescript
// Create a new website project
const project = await trpc.builder.createProject.mutate({
  name: 'My Business Website',
  type: 'website',
  template: 'business-template-1',
  settings: {
    subdomain: 'my-business',
    analytics: {
      google: 'GA-XXXXXXXXX'
    }
  }
});

// Create a landing page project
const landingPage = await trpc.builder.createProject.mutate({
  name: 'Product Launch',
  type: 'landing',
  settings: {
    domain: 'launch.mycompany.com'
  }
});
```

#### `getProject`
**Type**: Protected Query  
**Description**: Retrieve project details and configuration.

**Input Schema**:
```typescript
{
  id: string
}
```

**Usage Example**:
```typescript
const project = await trpc.builder.getProject.query({
  id: 'project-123'
});
```

#### `listProjects`
**Type**: Protected Query  
**Description**: List all projects for the authenticated user.

**Usage Example**:
```typescript
const projects = await trpc.builder.listProjects.query();
console.log(`You have ${projects.projects.length} projects`);
```

#### `deleteProject`
**Type**: Protected Mutation  
**Description**: Delete a project permanently.

**Input Schema**:
```typescript
{
  id: string
}
```

**Usage Example**:
```typescript
await trpc.builder.deleteProject.mutate({
  id: 'project-to-delete'
});
```

#### `duplicateProject`
**Type**: Protected Mutation  
**Description**: Create a duplicate of an existing project.

**Input Schema**:
```typescript
{
  projectId: string,
  name: string
}
```

**Usage Example**:
```typescript
const duplicate = await trpc.builder.duplicateProject.mutate({
  projectId: 'original-project-id',
  name: 'Copy of Original Project'
});
```

### Page Management

#### `createPage`
**Type**: Protected Mutation  
**Description**: Create a new page within a project.

**Input Schema**:
```typescript
{
  projectId: string,
  name: string,
  path: string,
  title: string,
  description?: string,
  isHomePage?: boolean
}
```

**Response**:
```typescript
{
  id: string,
  projectId: string,
  name: string,
  path: string,
  title: string,
  description?: string,
  isHomePage: boolean
}
```

**Usage Example**:
```typescript
// Create a home page
const homePage = await trpc.builder.createPage.mutate({
  projectId: 'project-123',
  name: 'Home',
  path: '/',
  title: 'Welcome to My Site',
  isHomePage: true
});

// Create an about page
const aboutPage = await trpc.builder.createPage.mutate({
  projectId: 'project-123',
  name: 'About Us',
  path: '/about',
  title: 'About Our Company',
  description: 'Learn more about our team and mission'
});
```

#### `updatePage`
**Type**: Protected Mutation  
**Description**: Update page content and settings.

**Input Schema**:
```typescript
{
  id: string,
  components: Array<Component>,
  globalStyles?: Record<string, any>,
  pageSettings?: {
    title?: string,
    description?: string,
    ogImage?: string
  }
}
```

**Component Schema**:
```typescript
{
  id: string,
  type: string,
  props: Record<string, any>,
  children?: Array<Component>,
  styles?: Record<string, any>,
  animations?: Array<{
    trigger: 'onMount' | 'onScroll' | 'onHover' | 'onClick',
    animation: string,
    duration: number,
    delay?: number
  }>,
  events?: Array<{
    type: string,
    action: string,
    params?: Record<string, any>
  }>
}
```

**Usage Example**:
```typescript
await trpc.builder.updatePage.mutate({
  id: 'page-123',
  components: [
    {
      id: 'hero-section',
      type: 'Hero',
      props: {
        title: 'Welcome to Our Platform',
        subtitle: 'Building amazing experiences',
        backgroundImage: 'https://cdn.example.com/hero-bg.jpg'
      },
      styles: {
        padding: '100px 20px',
        textAlign: 'center'
      },
      animations: [
        {
          trigger: 'onMount',
          animation: 'fadeInUp',
          duration: 1000,
          delay: 200
        }
      ]
    }
  ],
  pageSettings: {
    title: 'Welcome to Our Platform',
    description: 'Building amazing digital experiences'
  }
});
```

### Component Management

#### `saveComponent`
**Type**: Protected Mutation  
**Description**: Save a component to a page.

**Input Schema**:
```typescript
{
  pageId: string,
  component: Component
}
```

**Usage Example**:
```typescript
await trpc.builder.saveComponent.mutate({
  pageId: 'page-123',
  component: {
    id: 'unique-component-id',
    type: 'Button',
    props: {
      text: 'Get Started',
      variant: 'primary',
      size: 'large'
    },
    events: [
      {
        type: 'onClick',
        action: 'navigate',
        params: { path: '/signup' }
      }
    ]
  }
});
```

#### `createCustomComponent`
**Type**: Protected Mutation  
**Description**: Create a reusable custom component.

**Input Schema**:
```typescript
{
  name: string,
  category: string,
  component: Component,
  thumbnail?: string,
  isGlobal?: boolean
}
```

**Usage Example**:
```typescript
const customComponent = await trpc.builder.createCustomComponent.mutate({
  name: 'Contact Form',
  category: 'forms',
  component: {
    id: 'contact-form-template',
    type: 'Form',
    props: {
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'message', type: 'textarea', label: 'Message', required: true }
      ]
    }
  },
  thumbnail: 'https://cdn.example.com/contact-form-thumb.png',
  isGlobal: true
});
```

#### `getComponentLibrary`
**Type**: Protected Query  
**Description**: Retrieve available components from the library.

**Input Schema**:
```typescript
{
  category?: string,
  search?: string
}
```

**Usage Example**:
```typescript
// Get all hero sections
const heroComponents = await trpc.builder.getComponentLibrary.query({
  category: 'hero'
});

// Search for button components
const buttonComponents = await trpc.builder.getComponentLibrary.query({
  search: 'button'
});

// Get all components
const allComponents = await trpc.builder.getComponentLibrary.query({});

console.log(`Found ${allComponents.components.length} components`);
```

### Template Management

#### `getTemplates`
**Type**: Public Query  
**Description**: Retrieve available templates for project creation.

**Input Schema**:
```typescript
{
  type?: 'website' | 'app' | 'landing' | 'dashboard' | 'form',
  category?: string,
  search?: string
}
```

**Usage Example**:
```typescript
// Get website templates
const websiteTemplates = await trpc.builder.getTemplates.query({
  type: 'website'
});

// Get business category templates
const businessTemplates = await trpc.builder.getTemplates.query({
  category: 'business'
});

// Search for e-commerce templates
const ecommerceTemplates = await trpc.builder.getTemplates.query({
  search: 'ecommerce'
});
```

#### `useTemplate`
**Type**: Protected Mutation  
**Description**: Create a new project from a template.

**Input Schema**:
```typescript
{
  templateId: string,
  projectName: string
}
```

**Usage Example**:
```typescript
const newProject = await trpc.builder.useTemplate.mutate({
  templateId: 'ecommerce-store-template',
  projectName: 'My Online Store'
});

console.log(`Created project: ${newProject.projectId}`);
```

### Asset Management

#### `uploadAsset`
**Type**: Protected Mutation  
**Description**: Upload files to project asset library.

**Input Schema**:
```typescript
{
  projectId: string,
  filename: string,
  mimeType: string,
  size: number,
  folder?: string
}
```

**Response**:
```typescript
{
  id: string,
  url: string
}
```

**Usage Example**:
```typescript
// Upload an image
const imageAsset = await trpc.builder.uploadAsset.mutate({
  projectId: 'project-123',
  filename: 'hero-bg.jpg',
  mimeType: 'image/jpeg',
  size: 1024000, // 1MB
  folder: 'images/hero'
});

// Upload a video
const videoAsset = await trpc.builder.uploadAsset.mutate({
  projectId: 'project-123',
  filename: 'intro.mp4',
  mimeType: 'video/mp4',
  size: 5120000, // 5MB
  folder: 'videos'
});

console.log(`Image uploaded to: ${imageAsset.url}`);
```

#### `getAssets`
**Type**: Protected Query  
**Description**: Retrieve project assets.

**Input Schema**:
```typescript
{
  projectId: string,
  type?: 'image' | 'video' | 'font' | 'icon',
  folder?: string
}
```

**Usage Example**:
```typescript
// Get all images
const images = await trpc.builder.getAssets.query({
  projectId: 'project-123',
  type: 'image'
});

// Get assets from specific folder
const heroAssets = await trpc.builder.getAssets.query({
  projectId: 'project-123',
  folder: 'images/hero'
});

// Get all assets
const allAssets = await trpc.builder.getAssets.query({
  projectId: 'project-123'
});
```

### Style Management

#### `saveGlobalStyles`
**Type**: Protected Mutation  
**Description**: Save global project styles and theme settings.

**Input Schema**:
```typescript
{
  projectId: string,
  styles: {
    colors?: Record<string, string>,
    fonts?: Record<string, any>,
    spacing?: Record<string, number>,
    breakpoints?: Record<string, number>,
    custom?: string
  }
}
```

**Usage Example**:
```typescript
await trpc.builder.saveGlobalStyles.mutate({
  projectId: 'project-123',
  styles: {
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32
    },
    breakpoints: {
      mobile: 640,
      tablet: 768,
      desktop: 1024,
      wide: 1280
    },
    custom: `
      .custom-button {
        border-radius: 8px;
        transition: all 0.2s ease;
      }
    `
  }
});
```

### Data Source Management

#### `createDataSource`
**Type**: Protected Mutation  
**Description**: Create a new data source for dynamic content.

**Input Schema**:
```typescript
{
  projectId: string,
  name: string,
  type: 'api' | 'database' | 'csv' | 'json' | 'graphql',
  config: Record<string, any>
}
```

**Usage Example**:
```typescript
// Create REST API data source
const apiSource = await trpc.builder.createDataSource.mutate({
  projectId: 'project-123',
  name: 'Products API',
  type: 'api',
  config: {
    url: 'https://api.example.com/products',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer token123'
    }
  }
});

// Create GraphQL data source
const graphqlSource = await trpc.builder.createDataSource.mutate({
  projectId: 'project-123',
  name: 'CMS GraphQL',
  type: 'graphql',
  config: {
    endpoint: 'https://cms.example.com/graphql',
    headers: {
      'Authorization': 'Bearer token123'
    }
  }
});
```

#### `testDataSource`
**Type**: Protected Mutation  
**Description**: Test data source connectivity and return sample data.

**Input Schema**:
```typescript
{
  config: Record<string, any>
}
```

**Usage Example**:
```typescript
const testResult = await trpc.builder.testDataSource.mutate({
  config: {
    url: 'https://api.example.com/products',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer token123'
    }
  }
});

if (testResult.success) {
  console.log('Data source is working');
  console.log('Sample data:', testResult.sample);
}
```

### Form Management

#### `createForm`
**Type**: Protected Mutation  
**Description**: Create a dynamic form with custom fields and actions.

**Input Schema**:
```typescript
{
  projectId: string,
  name: string,
  fields: Array<{
    name: string,
    type: string,
    label: string,
    required: boolean,
    validation?: Record<string, any>
  }>,
  actions: Array<{
    type: 'email' | 'webhook' | 'database' | 'integration',
    config: Record<string, any>
  }>
}
```

**Usage Example**:
```typescript
const contactForm = await trpc.builder.createForm.mutate({
  projectId: 'project-123',
  name: 'Contact Form',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      validation: {
        pattern: '^[^@]+@[^@]+\.[^@]+$'
      }
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
      validation: {
        minLength: 10
      }
    }
  ],
  actions: [
    {
      type: 'email',
      config: {
        to: 'contact@company.com',
        subject: 'New Contact Form Submission',
        template: 'contact-notification'
      }
    },
    {
      type: 'webhook',
      config: {
        url: 'https://hooks.zapier.com/xxx',
        method: 'POST'
      }
    }
  ]
});
```

### Publishing & Deployment

#### `publishProject`
**Type**: Protected Mutation  
**Description**: Publish a project to staging or production.

**Input Schema**:
```typescript
{
  projectId: string,
  environment: 'staging' | 'production'
}
```

**Response**:
```typescript
{
  success: boolean,
  url: string,
  deploymentId: string
}
```

**Usage Example**:
```typescript
// Publish to staging
const stagingDeployment = await trpc.builder.publishProject.mutate({
  projectId: 'project-123',
  environment: 'staging'
});

console.log(`Staging site: ${stagingDeployment.url}`);

// Publish to production
const productionDeployment = await trpc.builder.publishProject.mutate({
  projectId: 'project-123',
  environment: 'production'
});

console.log(`Live site: ${productionDeployment.url}`);
```

#### `getDeployments`
**Type**: Protected Query  
**Description**: Retrieve deployment history for a project.

**Input Schema**:
```typescript
{
  projectId: string
}
```

**Usage Example**:
```typescript
const deployments = await trpc.builder.getDeployments.query({
  projectId: 'project-123'
});

deployments.deployments.forEach(deployment => {
  console.log(`${deployment.environment}: ${deployment.url}`);
  console.log(`Status: ${deployment.status}`);
  console.log(`Created: ${deployment.createdAt}`);
});
```

### Preview & Testing

#### `getPreviewUrl`
**Type**: Protected Query  
**Description**: Generate a temporary preview URL for a project.

**Input Schema**:
```typescript
{
  projectId: string,
  pageId?: string
}
```

**Response**:
```typescript
{
  url: string,
  expiresAt: Date
}
```

**Usage Example**:
```typescript
const preview = await trpc.builder.getPreviewUrl.query({
  projectId: 'project-123',
  pageId: 'page-456' // Optional: specific page
});

console.log(`Preview URL: ${preview.url}`);
console.log(`Expires at: ${preview.expiresAt}`);
```

### Code Export

#### `exportCode`
**Type**: Protected Mutation  
**Description**: Export project as downloadable code for various frameworks.

**Input Schema**:
```typescript
{
  projectId: string,
  framework: 'react' | 'vue' | 'angular' | 'html' | 'next' | 'nuxt',
  includeAssets?: boolean
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
// Export as React
const reactExport = await trpc.builder.exportCode.mutate({
  projectId: 'project-123',
  framework: 'react',
  includeAssets: true
});

console.log(`Download React code: ${reactExport.downloadUrl}`);

// Export as Next.js
const nextExport = await trpc.builder.exportCode.mutate({
  projectId: 'project-123',
  framework: 'next',
  includeAssets: true
});

console.log(`Download Next.js code: ${nextExport.downloadUrl}`);
```

### Collaboration

#### `shareProject`
**Type**: Protected Mutation  
**Description**: Share a project with another user.

**Input Schema**:
```typescript
{
  projectId: string,
  email: string,
  role: 'viewer' | 'editor' | 'admin'
}
```

**Usage Example**:
```typescript
// Share with editor permissions
await trpc.builder.shareProject.mutate({
  projectId: 'project-123',
  email: 'colleague@company.com',
  role: 'editor'
});

// Share with viewer permissions
await trpc.builder.shareProject.mutate({
  projectId: 'project-123',
  email: 'client@company.com',
  role: 'viewer'
});
```

#### `getCollaborators`
**Type**: Protected Query  
**Description**: Retrieve list of project collaborators.

**Input Schema**:
```typescript
{
  projectId: string
}
```

**Usage Example**:
```typescript
const collaborators = await trpc.builder.getCollaborators.query({
  projectId: 'project-123'
});

collaborators.collaborators.forEach(person => {
  console.log(`${person.email}: ${person.role}`);
});
```

## Integration Examples

### React Builder Component
```typescript
import { trpc } from '@/utils/trpc';
import { useState, useCallback } from 'react';

export function ProjectBuilder({ projectId }: { projectId: string }) {
  const [components, setComponents] = useState([]);
  
  const { data: project } = trpc.builder.getProject.useQuery({ id: projectId });
  const saveComponent = trpc.builder.saveComponent.useMutation();
  const publishProject = trpc.builder.publishProject.useMutation();

  const handleComponentSave = useCallback(async (component: any) => {
    await saveComponent.mutateAsync({
      pageId: project?.pages[0].id,
      component
    });
  }, [saveComponent, project]);

  const handlePublish = useCallback(async () => {
    const result = await publishProject.mutateAsync({
      projectId,
      environment: 'production'
    });
    
    console.log(`Published to: ${result.url}`);
  }, [publishProject, projectId]);

  return (
    <div className="builder-interface">
      <div className="builder-canvas">
        {/* Drag and drop canvas */}
      </div>
      
      <div className="builder-controls">
        <button onClick={handlePublish}>
          Publish Project
        </button>
      </div>
    </div>
  );
}
```

### Template Selection Component
```typescript
import { trpc } from '@/utils/trpc';

export function TemplateGallery() {
  const { data: templates } = trpc.builder.getTemplates.useQuery();
  const useTemplate = trpc.builder.useTemplate.useMutation();

  const handleTemplateSelect = async (templateId: string, projectName: string) => {
    const result = await useTemplate.mutateAsync({
      templateId,
      projectName
    });
    
    // Navigate to new project
    window.location.href = `/builder/${result.projectId}`;
  };

  return (
    <div className="template-gallery">
      {templates?.templates.map(template => (
        <div key={template.id} className="template-card">
          <img src={template.thumbnail} alt={template.name} />
          <h3>{template.name}</h3>
          <p>{template.category}</p>
          <button onClick={() => 
            handleTemplateSelect(template.id, `New ${template.name}`)
          }>
            Use Template
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

### Project Organization
- Use descriptive project names and paths
- Organize assets in logical folder structures
- Implement consistent naming conventions for components

### Performance Optimization
- Optimize images before uploading
- Use CDN links for external resources
- Minimize custom CSS and JavaScript

### SEO & Accessibility
- Add proper meta titles and descriptions
- Use semantic HTML structure
- Implement alt tags for images
- Ensure keyboard navigation support

### Security
- Validate all user inputs
- Use HTTPS for all assets
- Implement proper authentication for projects
- Secure data source connections

### Collaboration
- Use appropriate role-based permissions
- Implement version control for projects
- Document custom components and templates

## Error Handling

```typescript
try {
  const project = await trpc.builder.createProject.mutate({
    name: 'My Project',
    type: 'website'
  });
} catch (error) {
  if (error.data?.code === 'UNAUTHORIZED') {
    // Handle authentication error
  } else if (error.data?.code === 'BAD_REQUEST') {
    // Handle validation error
  } else if (error.data?.code === 'FORBIDDEN') {
    // Handle permission error
  } else {
    // Handle other errors
  }
}
```

## Integration with tRPC

The builder router integrates seamlessly with the tRPC system:

```typescript
// In your main tRPC router
export const appRouter = router({
  builder: builderRouter,
  analytics: analyticsRouter,
  auth: authRouter,
  // ... other routers
});

export type AppRouter = typeof appRouter;
```

This provides type-safe access to all builder procedures throughout your application, enabling seamless integration with visual builder functionality.
