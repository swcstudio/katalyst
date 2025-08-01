# Web Scraper Usage Guide

## Quick Start

The improved web scraper is now ready to use with the following features:

### Running the Scraper

```bash
# Interactive mode (recommended)
deno run --allow-net --allow-write --allow-read ./shared/src/scraper/deno-scraper.ts
```

### Example: Scraping Anthropic Docs

```bash
# Direct command
deno run --allow-net --allow-write --allow-read ./shared/src/scraper/deno-scraper.ts \
  --url https://docs.anthropic.com/en/ \
  --depth 3 \
  --max 2000 \
  --output ./docs/anthropic-docs
```

### Example: Scraping GitHub Repository

```bash
# Scrape a public GitHub repo
deno run --allow-net --allow-write --allow-read ./shared/src/scraper/deno-scraper.ts \
  --github https://github.com/anthropics/anthropic-sdk-typescript \
  --output ./docs/github-anthropic-sdk
```

## Output Format

All pages are saved as MDX files with:
- Numbered prefixes (001-, 002-, etc.) for hierarchy
- Clean markdown content
- Extracted images and videos
- Frontmatter metadata
- Navigation links

Example output structure:
```
docs/anthropic-docs/
├── index.mdx
├── 001-home.mdx
├── 002-docs-intro.mdx
├── 003-claude-code-overview.mdx
├── media/
│   └── images/
└── scraping-report.json
```