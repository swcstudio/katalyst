# demo.ts

> Source: `src/scraper/examples/demo.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Dependencies

- `../types.ts`

## Source Code

```typescript
/**
 * Katalyst Web Scraper - Demo Script
 * Comprehensive examples showing how to use the web scraping tool
 */

import {
  CheerioEngine,
  ExtractionRules,
  PlaywrightEngine,
  ScrapingEngineFactory,
  createScraper,
  scrapeUrl,
  scrapeUrls,
} from '../index.ts';
import type { BaseScrapingConfig, ExtractionRule, ScrapingResult } from '../types.ts';

// Register engines
ScrapingEngineFactory.registerEngine('cheerio', CheerioEngine);
ScrapingEngineFactory.registerEngine('playwright', PlaywrightEngine);

// Demo URLs (using publicly available test sites)
const DEMO_URLS = {
  static: 'https://books.toscrape.com/',
  dynamic: 'https://quotes.toscrape.com/js/',
  ecommerce: 'https://scrapeme.live/shop/',
  blog: 'https://blog.scrapinghub.com/',
};

/**
 * Demo 1: Basic Static Content Scraping with Cheerio
 */
async function demoBasicScraping() {
  console.log('\n🔍 Demo 1: Basic Static Content Scraping');
  console.log('=========================================');

  try {
    const result = await scrapeUrl(DEMO_URLS.static, {
      engine: 'cheerio',
      selectors: {
        title: 'title',
        books_count: '.pager .current',
        first_book_title: 'article.product_pod h3 a',
        first_book_price: 'article.product_pod .price_color',
      },
      timeout: 10000,
    });

    console.log('✅ Scraping completed successfully!');
    console.log(`📄 URL: ${result.data[0]?.url}`);
    console.log(`📊 Data extracted:`, JSON.stringify(result.data[0]?.data, null, 2));
    console.log(`⏱️  Response time: ${result.data[0]?.metadata.responseTime}ms`);
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
  }
}

/**
 * Demo 2: Dynamic Content Scraping with Playwright
 */
async function demoDynamicScraping() {
  console.log('\n🎭 Demo 2: Dynamic Content Scraping with Playwright');
  console.log('=================================================');

  try {
    const result = await scrapeUrl(DEMO_URLS.dynamic, {
      engine: 'playwright',
      browser: 'chromium',
      headless: true,
      selectors: {
        page_title: 'title',
        quotes_count: '.quote',
        first_quote_text: '.quote .text',
        first_quote_author: '.quote .author',
        tags: '.quote .tags .tag',
      },
      timeout: 15000,
    });

    console.log('✅ Dynamic scraping completed!');
    console.log(`📄 URL: ${result.data[0]?.url}`);
    console.log(`📊 Data extracted:`, JSON.stringify(result.data[0]?.data, null, 2));
    console.log(`🎭 Browser: ${result.data[0]?.metadata.browser}`);
  } catch (error) {
    console.error('❌ Dynamic scraping failed:', error.message);
  }
}

/**
 * Demo 3: Advanced Configuration with Custom Rules
 */
async function demoAdvancedConfiguration() {
  console.log('\n⚙️  Demo 3: Advanced Configuration with Custom Rules');
  console.log('==================================================');

  const customRules: ExtractionRule[] = [
    {
      name: 'products',
      selector: '.product',
      multiple: true,
      nested: [
        {
          name: 'name',
          selector: '.woocommerce-loop-product__title',
          attribute: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          selector: '.price .amount',
          attribute: 'text',
          type: 'text',
          transform: [
            {
              type: 'regex',
              params: {
                pattern: '[^0-9.]',
                replacement: '',
                flags: 'g',
              },
            },
          ],
        },
        {
          name: 'image',
          selector: 'img',
          attribute: 'src',
          type: 'url',
        },
        {
          name: 'link',
          selector: 'a',
          attribute: 'href',
          type: 'url',
        },
      ],
    },
    {
      name: 'pagination',
      selector: '.page-numbers',
      attribute: 'text',
      type: 'text',
      multiple: true,
    },
  ];

  const config: BaseScrapingConfig = {
    url: DEMO_URLS.ecommerce,
    engine: 'cheerio',
    output: {
      format: 'json',
      prettyPrint: true,
    },
    extraction: {
      rules: customRules,
      textProcessing: {
        trim: true,
        normalizeWhitespace: true,
        stripHtml: false,
      },
    },
    rateLimit: {
      delay: 1000,
    },
    retry: {
      maxRetries: 3,
      baseDelay: 1000,
    },
  };

  try {
    const scraper = createScraper(config);
    const result = await scraper.scrape();

    console.log('✅ Advanced scraping completed!');
    console.log(`📦 Products found: ${result.data[0]?.data.products?.length || 0}`);
    console.log('🔍 Sample product:');
    console.log(JSON.stringify(result.data[0]?.data.products?.[0] || {}, null, 2));
  } catch (error) {
    console.error('❌ Advanced scraping failed:', error.message);
  }
}

/**
 * Demo 4: Bulk Scraping with Progress Tracking
 */
async function demoBulkScraping() {
  console.log('\n📦 Demo 4: Bulk Scraping with Progress Tracking');
  console.log('==============================================');

  const urls = [
    'https://quotes.toscrape.com/page/1/',
    'https://quotes.toscrape.com/page/2/',
    'https://quotes.toscrape.com/page/3/',
  ];

  try {
    const result = await scrapeUrls(urls, {
      engine: 'cheerio',
      concurrency: 2,
      delay: 1000,
      selectors: {
        quotes: '.quote .text',
        authors: '.quote .author',
        page_number: '.pager .current',
      },
    });

    console.log('✅ Bulk scraping completed!');
    console.log(`📊 Total URLs processed: ${result.summary.totalUrls}`);
    console.log(`✅ Successful: ${result.summary.successfulExtractions}`);
    console.log(`❌ Failed: ${result.summary.failedExtractions}`);
    console.log(`⏱️  Total time: ${Math.round(result.summary.processingTime / 1000)}s`);
  } catch (error) {
    console.error('❌ Bulk scraping failed:', error.message);
  }
}

/**
 * Demo 5: Event Handling and Monitoring
 */
async function demoEventHandling() {
  console.log('\n📡 Demo 5: Event Handling and Monitoring');
  console.log('=======================================');

  const config: BaseScrapingConfig = {
    url: [DEMO_URLS.static, DEMO_URLS.blog],
    engine: 'cheerio',
    extraction: {
      rules: [
        ...ExtractionRules.metadata(),
        {
          name: 'headings',
          selector: 'h1, h2, h3',
          attribute: 'text',
          type: 'text',
          multiple: true,
        },
      ],
    },
    rateLimit: {
      delay: 2000,
    },
  };

  try {
    const scraper = createScraper(config);

    // Set up event listeners
    scraper.on('session_start', (event) => {
      console.log('🚀 Scraping session started');
    });

    scraper.on('progress', (event) => {
      const { progress } = event;
      const percentage = Math.round(progress.percentage);
      console.log(`⏳ Progress: ${percentage}% (${progress.completed}/${progress.total})`);
    });

    scraper.on('url_start', (event) => {
      console.log(`🔍 Starting: ${event.url}`);
    });

    scraper.on('url_end', (event) => {
      if (event.success) {
        console.log(`✅ Completed: ${event.url}`);
      } else {
        console.log(`❌ Failed: ${event.url} - ${event.error?.message}`);
      }
    });

    scraper.on('error', (event) => {
      console.error(`🚨 Error: ${event.error.message}`);
    });

    scraper.on('session_end', (event) => {
      console.log('🏁 Scraping session completed');
    });

    const result = await scraper.scrape();
    console.log(`📊 Final result: ${result.data.length} pages scraped`);
  } catch (error) {
    console.error('❌ Event handling demo failed:', error.message);
  }
}

/**
 * Demo 6: Using Predefined Extraction Rules
 */
async function demoPredefinedRules() {
  console.log('\n📋 Demo 6: Using Predefined Extraction Rules');
  console.log('==========================================');

  try {
    // Combine multiple predefined rule sets
    const rules = [
      ...ExtractionRules.metadata(),
      ...ExtractionRules.openGraph(),
      ...ExtractionRules.links(),
      ...ExtractionRules.headings(),
    ];

    const result = await scrapeUrl(DEMO_URLS.blog, {
      engine: 'cheerio',
      selectors: {}, // Using custom rules instead
    });

    // Manual rule application for demo
    const scraper = createScraper({
      url: DEMO_URLS.blog,
      engine: 'cheerio',
      extraction: {
        rules: rules,
      },
    });

    const detailedResult = await scraper.scrape();

    console.log('✅ Predefined rules scraping completed!');
    console.log('📊 Extracted metadata:');
    console.log(`   Title: ${detailedResult.data[0]?.data.title}`);
    console.log(`   Description: ${detailedResult.data[0]?.data.description}`);
    console.log(`   Links found: ${detailedResult.data[0]?.data.links?.length || 0}`);
    console.log(`   Headings found: ${detailedResult.data[0]?.data.h1?.length || 0}`);
  } catch (error) {
    console.error('❌ Predefined rules demo failed:', error.message);
  }
}

/**
 * Demo 7: Error Handling and Retry Logic
 */
async function demoErrorHandling() {
  console.log('\n🔧 Demo 7: Error Handling and Retry Logic');
  console.log('========================================');

  const config: BaseScrapingConfig = {
    url: ['https://httpstat.us/500', 'https://httpstat.us/200'], // Mix of failing and working URLs
    engine: 'cheerio',
    extraction: {
      rules: [
        {
          name: 'status',
          selector: 'body',
          attribute: 'text',
          type: 'text',
        },
      ],
    },
    retry: {
      maxRetries: 2,
      baseDelay: 1000,
      backoffMultiplier: 2,
      retryStatusCodes: [500, 502, 503, 504],
    },
    rateLimit: {
      delay: 500,
    },
  };

  try {
    const scraper = createScraper(config);

    scraper.on('error', (event) => {
      console.log(`⚠️  Error occurred: ${event.error.message} (${event.error.url})`);
    });

    const result = await scraper.scrape();

    console.log('✅ Error handling demo completed!');
    console.log(
      `📊 Success rate: ${result.summary.successfulExtractions}/${result.summary.totalUrls}`
    );
    console.log(`🔄 Errors encountered: ${result.session.errors.length}`);
  } catch (error) {
    console.error('❌ Error handling demo failed:', error.message);
  }
}

/**
 * Demo 8: Performance Comparison
 */
async function demoPerformanceComparison() {
  console.log('\n🏃 Demo 8: Performance Comparison (Cheerio vs Playwright)');
  console.log('=======================================================');

  const testUrl = DEMO_URLS.static;
  const rules = [
    {
      name: 'title',
      selector: 'title',
      attribute: 'text',
      type: 'text' as const,
    },
    {
      name: 'products',
      selector: '.product_pod',
      multiple: true,
      nested: [
        { name: 'title', selector: 'h3 a', attribute: 'title', type: 'text' as const },
        { name: 'price', selector: '.price_color', attribute: 'text', type: 'text' as const },
      ],
    },
  ];

  try {
    // Test Cheerio performance
    console.log('🔍 Testing Cheerio engine...');
    const cheerioStart = Date.now();
    const cheerioResult = await createScraper({
      url: testUrl,
      engine: 'cheerio',
      extraction: { rules },
    }).scrape();
    const cheerioTime = Date.now() - cheerioStart;

    // Test Playwright performance
    console.log('🎭 Testing Playwright engine...');
    const playwrightStart = Date.now();
    const playwrightResult = await createScraper({
      url: testUrl,
      engine: 'playwright',
      browser: { type: 'chromium', headless: true },
      extraction: { rules },
    }).scrape();
    const playwrightTime = Date.now() - playwrightStart;

    console.log('\n📊 Performance Results:');
    console.log(`   Cheerio:    ${cheerioTime}ms`);
    console.log(`   Playwright: ${playwrightTime}ms`);
    console.log(`   Speedup:    ${(playwrightTime / cheerioTime).toFixed(2)}x faster with Cheerio`);

    console.log('\n📦 Data Quality:');
    console.log(`   Cheerio products:    ${cheerioResult.data[0]?.data.products?.length || 0}`);
    console.log(`   Playwright products: ${playwrightResult.data[0]?.data.products?.length || 0}`);
  } catch (error) {
    console.error('❌ Performance comparison failed:', error.message);
  }
}

/**
 * Main demo runner
 */
async function runAllDemos() {
  console.log('🕷️  Katalyst Web Scraper - Comprehensive Demo');
  console.log('============================================');
  console.log('This demo showcases various features of the Katalyst Web Scraper');
  console.log('');

  const demos = [
    { name: 'Basic Scraping', fn: demoBasicScraping },
    { name: 'Dynamic Content', fn: demoDynamicScraping },
    { name: 'Advanced Configuration', fn: demoAdvancedConfiguration },
    { name: 'Bulk Scraping', fn: demoBulkScraping },
    { name: 'Event Handling', fn: demoEventHandling },
    { name: 'Predefined Rules', fn: demoPredefinedRules },
    { name: 'Error Handling', fn: demoErrorHandling },
    { name: 'Performance Comparison', fn: demoPerformanceComparison },
  ];

  for (const demo of demos) {
    try {
      await demo.fn();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Brief pause between demos
    } catch (error) {
      console.error(`❌ Demo "${demo.name}" failed:`, error.message);
    }
  }

  console.log('\n🎉 All demos completed!');
  console.log('');
  console.log('💡 Tips for production use:');
  console.log('  - Always implement proper rate limiting');
  console.log('  - Use proxy rotation for large-scale scraping');
  console.log('  - Implement proper error handling and logging');
  console.log('  - Respect robots.txt and terms of service');
  console.log('  - Consider API alternatives when available');
  console.log('');
  console.log('📚 For more examples and documentation:');
  console.log('   https://github.com/swcstudio/katalyst/tree/main/docs/scraper');
}

/**
 * Individual demo functions for targeted testing
 */
export {
  demoBasicScraping,
  demoDynamicScraping,
  demoAdvancedConfiguration,
  demoBulkScraping,
  demoEventHandling,
  demoPredefinedRules,
  demoErrorHandling,
  demoPerformanceComparison,
  runAllDemos,
};

// Run all demos if this file is executed directly
if (import.meta.main) {
  runAllDemos().catch(console.error);
}

```

---

*Generated documentation for @katalyst/core*
