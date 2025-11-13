# Katalyst Documentation Development Guide

This guide helps you set up and contribute to the Katalyst Framework documentation.

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+
- Git
- GitBook CLI (optional, for local development)

### Installation

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/katalyst/katalyst-core
cd katalyst-core/docs

# Install dependencies
npm install

# Install GitBook CLI globally (optional)
npm run install:gitbook
```

### Development

```bash
# Start development server
npm run watch

# Or serve locally
npm run serve

# Build documentation
npm run build

# Validate documentation builds
npm run validate
```

## 📚 Project Structure

```
docs/
├── README.md                 # Main landing page
├── SUMMARY.md               # Table of contents
├── book.json               # GitBook configuration
├── .gitbook.yaml           # Alternative GitBook config
├── package.json            # NPM dependencies and scripts
├── styles/                 # Custom styles
│   └── website.css         # Main stylesheet
├── scripts/                # Custom JavaScript
│   └── custom.js           # Enhancements and interactions
├── introduction/           # Introduction section
│   └── what-is-katalyst.md # Framework overview
├── getting-started/        # Getting started guides
├── core/                   # Core framework documentation
├── wasm/                   # WebAssembly documentation
├── server/                 # Server and deployment docs
├── features/               # Feature documentation
├── api/                    # API reference
├── guides/                 # Tutorial guides
├── advanced/               # Advanced topics
├── migration/              # Migration guides
├── contributing/           # Contributing guidelines
├── resources/              # Additional resources
└── community/              # Community information
```

## 🛠️ Available Scripts

| Script | Description |
|---------|-------------|
| `npm run build` | Build static documentation |
| `npm run serve` | Serve documentation locally |
| `npm run watch` | Watch for changes and auto-reload |
| `npm run pdf` | Generate PDF documentation |
| `npm run epub` | Generate EPUB documentation |
| `npm run mobi` | Generate MOBI documentation |
| `npm run lint` | Lint Markdown files |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run link-check` | Check for broken links |
| `npm run stats` | Show documentation statistics |
| `npm run clean` | Clean build artifacts |
| `npm run deploy` | Deploy to GitHub Pages |

## 📝 Writing Guidelines

### Markdown Standards

- Use **semantic headers** (H1 → H2 → H3)
- Keep **lines under 120 characters**
- Use **emoji sparingly** and purposefully
- Include **code examples** with syntax highlighting
- Add **alt text** to all images
- Use **relative links** for internal content

### Content Structure

Each page should include:

```markdown
# Page Title

Brief description of what the page covers.

## Section 1

Content with examples.

## Section 2

More content.

### Subsection

Detailed information.

---

> **💡 Tip**: Include helpful tips where relevant

> **⚠️ Warning**: Include warnings for important considerations

> **📚 Note**: Include additional context where needed
```

### Code Examples

```typescript
// Use TypeScript syntax highlighting
import { KatalystCore } from '@katalyst/core';

const app = new KatalystCore({
  // configuration options
});
```

```bash
# Use shell syntax highlighting for commands
npm install @katalyst/core
npm run dev
```

### Links and References

- Use **descriptive link text**
- Link to **related documentation**
- Include **external references** where helpful
- Use **relative paths** for internal links

```markdown
[Getting Started Guide](./getting-started/installation.md)
[External Documentation](https://example.com)
```

## 🎨 Styling Guidelines

### Custom CSS Classes

The documentation includes several custom CSS classes:

- `.katalyst-feature` - Highlight important features
- `.katalyst-code-example` - Styled code blocks
- `.katalyst-diagram` - Centered diagrams

### Alert Boxes

Use GitBook's flexible alert syntax:

```markdown
{% hint style="info" %}
Information about something important
{% endhint %}

{% hint style="tip" %}
Helpful tip for users
{% endhint %}

{% hint style="warning" %}
Warning about potential issues
{% endhint %}

{% hint style="danger" %}
Critical warning that must be followed
{% endhint %}
```

## 🔄 Git Workflow

### Branch Strategy

- `main` - Production documentation
- `develop` - Development changes
- `feature/*` - Feature branches
- `fix/*` - Bug fixes

### Commit Messages

Use conventional commit format:

```
type(scope): description

feat(docs): add getting started guide
fix(docs): correct installation instructions
docs(docs): update API reference
```

### Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests and linting
4. Create a pull request to `develop`
5. Request review from documentation team
6. Merge after approval

## 📱 Responsive Design

The documentation is fully responsive and works on:

- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet devices (iPad, Android tablets)
- Mobile devices (iPhone, Android phones)

### Mobile Considerations

- Keep **code blocks** readable on small screens
- Use **horizontal scrolling** for wide tables
- Ensure **buttons and links** are easily tappable
- Test **navigation** on touch devices

## 🔍 SEO and Accessibility

### SEO Best Practices

- Use **descriptive page titles**
- Include **meta descriptions** where applicable
- Use **semantic HTML** structure
- Include **alt text** for images
- Create **URL-friendly** file names

### Accessibility

- Use **proper heading hierarchy**
- Include **alt text** for all images
- Ensure **color contrast** meets WCAG standards
- Provide **keyboard navigation** support
- Use **descriptive link text**

## 🚀 Deployment

### Automated Deployment

Documentation is automatically deployed when changes are merged to `main` branch.

### Manual Deployment

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

### Environment Variables

The following environment variables are used:

- `GA_ID` - Google Analytics tracking ID
- `PLAUSIBLE_DOMAIN` - Plausible analytics domain
- `DOCS_URL` - Documentation base URL

## 📊 Analytics

The documentation includes:

- **Page view tracking**
- **Search query analysis**
- **User interaction metrics**
- **Performance monitoring**

### Custom Events

```javascript
// Track custom events
gtag('event', 'documentation_view', {
  page_title: 'Getting Started',
  page_location: '/getting-started/installation.html'
});
```

## 🔧 Troubleshooting

### Common Issues

**Build fails with syntax errors:**
- Check for invalid Markdown syntax
- Validate all links and images
- Run `npm run lint` to catch issues

**Images not displaying:**
- Verify image paths are correct
- Check image file sizes
- Ensure images are optimized

**Links not working:**
- Run `npm run link-check` to find broken links
- Verify relative path syntax
- Check for case sensitivity issues

### Performance Issues

**Slow loading times:**
- Optimize images
- Reduce file sizes
- Enable caching
- Use CDN for static assets

**Large bundle sizes:**
- Split content into smaller pages
- Lazy load images
- Optimize dependencies
- Remove unused plugins

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../contributing/setup.md) for detailed information.

### Areas Where We Need Help

- **Content review** and proofreading
- **Code example** testing and validation
- **Translation** into other languages
- **Accessibility** improvements
- **Performance** optimization

### Getting Started

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you need help with documentation:

- Create an **issue** in the repository
- Join our **Discord** server
- Ask in **GitHub Discussions**
- Email us at **docs@katalyst.io**

---

> **💡 Pro Tip**: The best documentation comes from real user experience. If you're learning Katalyst, document what you learn - it will help others and reinforce your understanding!

---

*Last updated: {{ "now" | date: "%Y-%m-%d" }}*
