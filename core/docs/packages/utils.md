# @katalyst/utils

Web scraping, MDX generation, and plugin utilities for the Katalyst framework.

## Overview

The `@katalyst/utils` package provides utility functions for web scraping, content generation, and plugin management.

### Key Features

- 🕷️ **Web Scraper** - Scrape websites to MDX
- 📝 **MDX Generator** - Generate MDX from various sources
- 🔌 **Plugin System** - Extensible plugin architecture
- 🎯 **Type-Safe** - Full TypeScript support
- ⚡ **Fast** - Optimized operations
- 🛠️ **Utilities** - General-purpose helpers

## Installation

```typescript
import { scrapeToMDX } from '@katalyst/utils/scraper';
```

## Quick Start

### Web Scraper

```typescript
import { MDXWebScraper } from '@katalyst/utils/scraper';

const scraper = new MDXWebScraper({
  baseUrl: 'https://example.com',
  outputDir: './content',
  depth: 2
});

// Scrape website
await scraper.scrape();

// Generates MDX files in ./content/
```

## Web Scraper

### Configuration

```typescript
const scraper = new MDXWebScraper({
  baseUrl: 'https://docs.example.com',
  outputDir: './docs',
  depth: 3,
  includeImages: true,
  includeLinks: true,
  selectors: {
    content: '.main-content',
    title: 'h1',
    exclude: ['.sidebar', '.footer']
  }
});
```

### Scraping

```typescript
// Scrape entire site
await scraper.scrape();

// Scrape specific pages
await scraper.scrapePages([
  '/docs/getting-started',
  '/docs/api-reference'
]);

// Generate index
await scraper.generateIndex();
```

## MDX Generator

```typescript
import { generateMDX } from '@katalyst/utils';

// Generate from HTML
const mdx = generateMDX.fromHTML(html, {
  frontmatter: {
    title: 'My Page',
    date: '2024-01-01'
  }
});

// Generate from Markdown
const mdx = generateMDX.fromMarkdown(markdown);

// Generate from data
const mdx = generateMDX.fromData({
  title: 'API Docs',
  sections: [/* ... */]
});
```

## Plugin System

```typescript
import { PluginManager } from '@katalyst/utils/plugins';

const plugins = new PluginManager();

// Register plugin
plugins.register({
  name: 'my-plugin',
  hooks: {
    onInit: () => console.log('Initialized'),
    onBuild: (data) => transformData(data)
  }
});

// Execute hooks
await plugins.executeHook('onBuild', data);
```

## Utility Functions

```typescript
import { 
  slugify, 
  sanitizeHTML, 
  extractMetadata,
  parseMarkdown
} from '@katalyst/utils';

// Slugify text
const slug = slugify('Hello World'); // 'hello-world'

// Sanitize HTML
const clean = sanitizeHTML(dirtyHTML);

// Extract metadata
const meta = extractMetadata(content);

// Parse markdown
const ast = parseMarkdown(markdown);
```

## Best Practices

1. **Rate limit scraping** - Respect server limits
2. **Cache results** - Avoid redundant scraping
3. **Validate output** - Check generated MDX
4. **Handle errors** - Implement error handling
5. **Use selectors** - Target specific content
6. **Test plugins** - Test plugin integrations

## Related Documentation

- [Core Package](./core.md) - Using utilities

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Status**: Production Ready
