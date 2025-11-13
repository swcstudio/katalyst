# Katalyst CMS API Documentation

## Overview

The Katalyst CMS API provides comprehensive content management capabilities for building modern web applications. Built with tRPC and TypeScript, it offers type-safe content management with support for articles, pages, media, and structured content blocks.

## Features

- **Article Management**: Create, update, and manage blog posts and articles
- **Page Builder**: Dynamic page creation with structured content blocks
- **Media Management**: Upload and organize media assets
- **SEO Optimization**: Built-in SEO metadata and optimization tools
- **Content Versioning**: Draft, scheduled, and archived content states
- **Multi-language Support**: Internationalization capabilities
- **Content Categories**: Hierarchical categorization and tagging

## API Reference

### Content Block Types

The CMS supports 10 types of content blocks:

```typescript
type ContentBlockType = 
  | 'text'      // Rich text content
  | 'image'     // Image with captions and alt text
  | 'video'     // Video embeds and uploads
  | 'code'      // Code snippets with syntax highlighting
  | 'quote'     // Blockquotes and testimonials
  | 'gallery'   // Image galleries and carousels
  | 'embed'     // Third-party embeds (YouTube, Twitter, etc.)
  | 'table'     // Structured data tables
  | 'divider'   // Section dividers and spacing
```

### Article Management

#### Create Article

```typescript
mutation {
  createArticle({
    title: "Getting Started with Katalyst",
    slug: "getting-started-katalyst",
    excerpt: "Learn how to build modern applications with Katalyst",
    content: [
      {
        type: "text",
        content: {
          text: "Katalyst is a modern framework for building...",
          format: "markdown"
        }
      },
      {
        type: "image",
        content: {
          src: "/images/katalyst-hero.jpg",
          alt: "Katalyst Framework",
          caption: "Modern application development"
        }
      }
    ],
    author: "john-doe",
    categories: ["Development", "Framework"],
    tags: ["katalyst", "typescript", "react"],
    status: "published",
    seo: {
      title: "Getting Started with Katalyst Framework",
      description: "Complete guide to building applications with Katalyst",
      keywords: ["katalyst", "framework", "tutorial"],
      ogImage: "/images/og-katalyst.jpg"
    }
  })
}
```

#### Update Article

```typescript
mutation {
  updateArticle({
    id: "article-123",
    data: {
      title: "Updated: Getting Started with Katalyst",
      content: [
        // Updated content blocks
      ],
      status: "published"
    }
  })
}
```

#### Get Articles

```typescript
query {
  getArticles({
    status: "published",
    category: "Development",
    limit: 10,
    offset: 0,
    featured: true
  })
}
```

### Page Management

#### Create Page

```typescript
mutation {
  createPage({
    title: "About Us",
    slug: "about",
    template: "default",
    content: [
      {
        type: "hero",
        content: {
          title: "About Katalyst",
          subtitle: "Modern Application Framework",
          backgroundImage: "/images/about-hero.jpg",
          cta: {
            text: "Get Started",
            link: "/docs"
          }
        }
      },
      {
        type: "text",
        content: {
          text: "Katalyst is built for developers who need...",
          format: "markdown"
        }
      }
    ],
    seo: {
      title: "About Katalyst Framework",
      description: "Learn about our mission and vision"
    }
  })
}
```

### Media Management

#### Upload Media

```typescript
mutation {
  uploadMedia({
    file: File, // Multipart file upload
    name: "hero-image.jpg",
    alt: "Katalyst Hero Image",
    caption: "Modern application development framework",
    tags: ["hero", "homepage", "framework"],
    metadata: {
      width: 1920,
      height: 1080,
      format: "jpeg",
      size: 245760
    }
  })
}
```

#### Get Media Library

```typescript
query {
  getMediaLibrary({
    type: "image",
    tags: ["hero"],
    search: "katalyst",
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc"
  })
}
```

### Category Management

#### Create Category

```typescript
mutation {
  createCategory({
    name: "Development",
    slug: "development",
    description: "Development tutorials and guides",
    parent: null, // Top-level category
    seo: {
      title: "Development Articles - Katalyst",
      description: "Development tutorials and guides"
    }
  })
}
```

#### Get Categories

```typescript
query {
  getCategories({
    includeEmpty: false,
    depth: 2, // Include subcategories
    sortBy: "name"
  })
}
```

## Content Workflows

### Draft to Published Workflow

```typescript
// 1. Create as draft
const article = await cms.createArticle({
  title: "New Tutorial",
  status: "draft",
  // ... other fields
});

// 2. Preview and review
const preview = await cms.getArticlePreview(article.id);

// 3. Schedule for publishing
await cms.updateArticle({
  id: article.id,
  data: {
    status: "scheduled",
    scheduledAt: new Date("2024-01-15T10:00:00Z")
  }
});

// 4. Auto-publish (handled by scheduler)
```

### Content Versioning

```typescript
// Get revision history
const revisions = await cms.getArticleRevisions(article.id);

// Restore to previous version
await cms.restoreArticleRevision({
  articleId: article.id,
  revisionId: revision.id
});

// Compare versions
const diff = await cms.compareArticleVersions({
  articleId: article.id,
  fromRevisionId: "rev-1",
  toRevisionId: "rev-2"
});
```

## SEO Optimization

### Automatic SEO Generation

```typescript
// Auto-generate SEO from content
const seoOptimized = await cms.optimizeSEO({
  content: article.content,
  title: article.title,
  description: article.excerpt,
  keywords: article.tags
});

// Result includes:
// - Optimized title and meta description
// - Open Graph metadata
// - Structured data (JSON-LD)
// - Twitter Card metadata
```

### SEO Analysis

```typescript
const seoAnalysis = await cms.analyzeSEO({
  content: article.content,
  targetKeywords: ["katalyst", "framework", "development"],
  competitors: ["competitor-site.com"]
});

// Returns:
// - Keyword density analysis
// - Readability score
// - Content length recommendations
// - Internal linking opportunities
// - Technical SEO suggestions
```

## Internationalization

### Multi-language Content

```typescript
// Create multilingual article
await cms.createArticle({
  title: "Getting Started",
  slug: "getting-started",
  defaultLanguage: "en",
  translations: {
    es: {
      title: "Primeros Pasos",
      content: [...],
      seo: { title: "Primeros Pasos con Katalyst" }
    },
    fr: {
      title: "Premiers Pas",
      content: [...],
      seo: { title: "Premiers Pas avec Katalyst" }
    }
  }
});
```

### Language-specific Routing

```typescript
// Get content in preferred language
query {
  getArticle({
    slug: "getting-started",
    language: "es", // Falls back to default if not available
    fallbackLanguage: "en"
  })
}
```

## Performance Optimization

### Content Caching

```typescript
// Cache strategies for different content types
const cacheConfig = {
  articles: {
    ttl: 3600, // 1 hour
    tags: ["articles", "published"],
    invalidateOn: ["article.update", "article.delete"]
  },
  media: {
    ttl: 86400, // 24 hours
    tags: ["media"],
    invalidateOn: ["media.update"]
  }
};
```

### Image Optimization

```typescript
// Automatic image optimization
const optimizedImage = await cms.optimizeImage({
  imageId: "img-123",
  formats: ["webp", "avif", "jpg"],
  sizes: [320, 768, 1024, 1920],
  quality: 80,
  preserveMetadata: true
});
```

## Security Features

### Content Permissions

```typescript
// Role-based access control
const permissions = {
  admin: ["create", "read", "update", "delete", "publish"],
  editor: ["create", "read", "update", "publish"],
  author: ["create", "read", "update"],
  viewer: ["read"]
};

// Check permissions
const canPublish = await cms.checkPermission({
  userId: "user-123",
  action: "publish",
  resourceType: "article"
});
```

### Content Validation

```typescript
// Automatic content validation
const validation = await cms.validateContent({
  content: article.content,
  rules: {
    minWordCount: 300,
    maxWordCount: 3000,
    requiredBlocks: ["text"],
    maxImageSize: "5MB",
    allowedFileTypes: ["jpg", "png", "webp", "gif"],
    seoRequirements: {
      minTitleLength: 30,
      maxTitleLength: 60,
      minDescriptionLength: 120,
      maxDescriptionLength: 160
    }
  }
});
```

## Integration Examples

### React Integration

```typescript
import { trpc } from '@/utils/trpc';

function ArticleList() {
  const { data: articles, isLoading } = trpc.cms.getArticles.useQuery({
    status: 'published',
    limit: 10
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid gap-6">
      {articles?.map(article => (
        <article key={article.id} className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
          <p className="text-gray-600 mb-4">{article.excerpt}</p>
          <div className="flex gap-2 mb-4">
            {article.categories.map(cat => (
              <span key={cat} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {cat}
              </span>
            ))}
          </div>
          <Link href={`/blog/${article.slug}`}>
            Read more →
          </Link>
        </article>
      ))}
    </div>
  );
}
```

### Next.js Static Generation

```typescript
// pages/blog/[slug].tsx
export async function getStaticPaths() {
  const articles = await cms.getArticles({ status: 'published' });
  
  return {
    paths: articles.map(article => ({
      params: { slug: article.slug }
    })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const article = await cms.getArticle({ slug: params.slug });
  
  if (!article) {
    return { notFound: true };
  }

  return {
    props: { article },
    revalidate: 3600 // Revalidate every hour
  };
}
```

### Content Builder UI

```typescript
function ContentBuilder({ article, onSave }) {
  const [content, setContent] = useState(article.content);

  const addBlock = (type: ContentBlockType) => {
    const newBlock = createEmptyBlock(type);
    setContent([...content, newBlock]);
  };

  const updateBlock = (index: number, block: ContentBlock) => {
    const updated = [...content];
    updated[index] = block;
    setContent(updated);
  };

  return (
    <div className="content-builder">
      <div className="block-types">
        {['text', 'image', 'video', 'code'].map(type => (
          <button key={type} onClick={() => addBlock(type)}>
            Add {type}
          </button>
        ))}
      </div>
      
      {content.map((block, index) => (
        <BlockEditor
          key={index}
          block={block}
          onChange={(updated) => updateBlock(index, updated)}
        />
      ))}
      
      <button onClick={() => onSave(content)}>
        Save Article
      </button>
    </div>
  );
}
```

## Error Handling

### Common Error Types

```typescript
// Content validation errors
class ContentValidationError extends Error {
  constructor(public field: string, public message: string) {
    super(`Validation failed for ${field}: ${message}`);
  }
}

// Permission errors
class PermissionError extends Error {
  constructor(public action: string, public resource: string) {
    super(`Insufficient permissions to ${action} ${resource}`);
  }
}

// SEO optimization errors
class SEOError extends Error {
  constructor(public issue: string, public suggestion: string) {
    super(`SEO issue: ${issue}. Suggestion: ${suggestion}`);
  }
}
```

### Error Recovery

```typescript
// Auto-save and recovery
const autoSave = async (content: Article) => {
  try {
    await cms.updateArticle({ id: content.id, data: content });
  } catch (error) {
    // Save to local storage as backup
    localStorage.setItem(`article-draft-${content.id}`, JSON.stringify(content));
    notifyUser('Auto-save failed. Local backup created.');
  }
};

// Recover from backup
const recoverBackup = (articleId: string) => {
  const backup = localStorage.getItem(`article-draft-${articleId}`);
  if (backup) {
    return JSON.parse(backup);
  }
  return null;
};
```

## Best Practices

### Content Structure

1. **Use semantic block types** for better accessibility
2. **Include alt text** for all images
3. **Structure content hierarchically** with proper headings
4. **Optimize images** before uploading
5. **Use categories and tags** consistently

### SEO Optimization

1. **Write compelling titles** under 60 characters
2. **Create unique meta descriptions** for each page
3. **Use descriptive URLs** with keywords
4. **Include internal linking** between related content
5. **Optimize images** with descriptive filenames and alt text

### Performance

1. **Enable caching** for published content
2. **Optimize images** in multiple formats
3. **Use lazy loading** for media content
4. **Minimize external dependencies** in content blocks
5. **Implement CDN** for media delivery

## Monitoring and Analytics

### Content Performance

```typescript
// Track content engagement
const analytics = await cms.getContentAnalytics({
  articleId: "article-123",
  dateRange: {
    start: new Date("2024-01-01"),
    end: new Date("2024-01-31")
  },
  metrics: [
    "pageviews",
    "timeOnPage", 
    "bounceRate",
    "socialShares",
    "comments"
  ]
});
```

### SEO Monitoring

```typescript
// SEO performance tracking
const seoMetrics = await cms.getSEOMetrics({
  articleId: "article-123",
  metrics: [
    "searchRankings",
    "organicTraffic",
    "clickThroughRate",
    "backlinks"
  ]
});
```

This comprehensive CMS API documentation provides everything needed to build robust content management features with the Katalyst framework, from basic CRUD operations to advanced SEO optimization and performance features.
