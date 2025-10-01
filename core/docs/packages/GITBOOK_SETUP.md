# GitBook Setup Instructions

This directory contains comprehensive documentation for all Katalyst Turborepo packages, configured for GitBook.

## Prerequisites

- Node.js 20+
- GitBook CLI (optional for local preview)

## Structure

```
/core/docs/packages/
├── README.md              # Documentation homepage
├── SUMMARY.md             # GitBook table of contents
├── book.json              # GitBook configuration
├── package.json           # GitBook build scripts
├── .gitignore            # Ignore build artifacts
├── *.md                   # Package documentation (12 files)
├── guides/                # Usage guides (5 files)
│   ├── getting-started.md
│   ├── dependencies.md
│   ├── turborepo.md
│   ├── custom-packages.md
│   └── migration.md
└── reference/             # Reference materials (5 files)
    ├── comparison.md
    ├── versions.md
    ├── api-index.md
    ├── troubleshooting.md
    └── faq.md
```

## Local Preview

### Option 1: GitBook CLI (Recommended)

```bash
cd /core/docs/packages

# Install GitBook CLI globally
npm install -g gitbook-cli

# Install GitBook plugins
gitbook install

# Serve documentation locally
gitbook serve
# Open http://localhost:4000
```

### Option 2: Using npm scripts

```bash
cd /core/docs/packages

# Install GitBook plugins
npm run install

# Start local server
npm run serve
# Open http://localhost:4000
```

## Building Documentation

### HTML Build

```bash
# Build static HTML
npm run build
# Output: ./_book/
```

### PDF Build

```bash
# Generate PDF
npm run pdf
# Output: katalyst-packages.pdf
```

### EPUB/MOBI Build

```bash
# Generate EPUB
npm run epub

# Generate MOBI
npm run mobi
```

## Publishing to GitBook

### Option 1: GitBook.com (Recommended)

1. Create account at [gitbook.com](https://www.gitbook.com)
2. Create new space
3. Connect GitHub repository
4. Select `/core/docs/packages` as root directory
5. GitBook will auto-deploy on push

### Option 2: Self-Hosted

1. Build static files: `npm run build`
2. Deploy `_book/` directory to your hosting
3. Options: Netlify, Vercel, GitHub Pages, etc.

### Option 3: GitHub Pages

```bash
# Build documentation
npm run build

# Deploy to gh-pages branch
git subtree push --prefix core/docs/packages/_book origin gh-pages
```

## GitBook Features

### Plugins

Enabled plugins (see `book.json`):
- `expandable-chapters` - Collapsible sidebar chapters
- `copy-code-button` - Copy button for code blocks
- `github` - GitHub repository link
- `search-plus` - Enhanced search
- `prism` - Syntax highlighting
- `anchor-navigation-ex` - Page navigation
- `page-toc-button` - Table of contents
- `back-to-top-button` - Scroll to top
- `mermaid-gb3` - Mermaid diagram support
- `katex` - Math equation support
- `theme-api` - API documentation theme

### Customization

Edit `book.json` to customize:
- Title and description
- Theme settings
- Plugin configuration
- Variables

## Documentation Standards

### File Naming

- Use kebab-case: `my-package.md`
- Package docs: `package-name.md`
- Guide docs: `guides/topic-name.md`
- Reference docs: `reference/topic-name.md`

### Structure

Each package doc should include:
1. Title and overview
2. Key features
3. Installation
4. Quick start
5. Main sections (API, usage, etc.)
6. Examples
7. Best practices
8. Related documentation
9. Version/status footer

### Markdown Guidelines

- Use proper headings hierarchy (H1 → H2 → H3)
- Include code examples with language tags
- Add internal links to related docs
- Use tables for comparisons
- Include mermaid diagrams where helpful

## Maintenance

### Adding New Package

1. Create `package-name.md` in root
2. Add entry to `SUMMARY.md`
3. Follow existing package doc structure
4. Link from README.md
5. Update comparison table in `reference/comparison.md`

### Updating Versions

Update `reference/versions.md` with new package versions.

### Adding Guides

1. Create guide in `guides/` directory
2. Add to `SUMMARY.md` under Guides section
3. Link from relevant package docs

## Troubleshooting

### GitBook CLI Not Found

```bash
npm install -g gitbook-cli
gitbook --version
```

### Plugin Installation Fails

```bash
# Clear GitBook cache
rm -rf ~/.gitbook
gitbook install
```

### Build Errors

```bash
# Clean build
rm -rf _book node_modules
npm install
gitbook install
gitbook build
```

### Port Already in Use

```bash
# Use different port
gitbook serve --port 4001
```

## Resources

- [GitBook Documentation](https://docs.gitbook.com)
- [GitBook CLI GitHub](https://github.com/GitbookIO/gitbook-cli)
- [GitBook Plugins](https://plugins.gitbook.com)
- [Markdown Guide](https://www.markdownguide.org)

## Support

For documentation issues:
1. Check this guide
2. Review [GitBook docs](https://docs.gitbook.com)
3. Open issue in repository
4. Contact documentation team

---

**Last Updated**: 2024  
**Maintained by**: Katalyst Team
