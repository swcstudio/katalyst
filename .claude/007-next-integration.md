# Next.js Integration

## Overview

The Katalyst-Next integration represents a cutting-edge marketing website framework built on Next.js 15 with React 19. It combines server-side rendering, static generation, and advanced marketing features with the performance benefits of Katalyst's multithreading and shared component system. This integration is specifically designed for high-performance marketing sites, blogs, and content-driven applications.

## Key Features

### 1. Next.js 15 App Router
- Full App Router implementation
- React Server Components by default
- Streaming SSR for optimal performance
- Parallel and intercepted routes support
- Advanced layouts with nesting

### 2. Payload CMS Integration
- Headless CMS for content management
- SQLite database for lightweight deployment
- Rich text editing with Lexical
- Media management with Sharp optimization
- SEO management per content piece

### 3. Marketing Automation
- Popup management system
- Ad slot positioning
- A/B testing infrastructure
- Analytics integration (GA, GTM, Facebook)
- Redirect management

### 4. Advanced UI Components
- 100+ pre-built marketing components
- 3D effects and animations
- Motion design with Framer Motion
- Responsive and accessible by default

## Architecture

### Project Structure
```
next/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (payload)/          # CMS admin routes
│   │   ├── blog/               # Blog pages
│   │   ├── work/               # Portfolio pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── providers.tsx       # Client providers
│   ├── components/             # Next-specific components
│   │   ├── ui/                 # UI component library
│   │   ├── marketing/          # Marketing sections
│   │   └── theme-provider.tsx  # Theme management
│   ├── collections/            # Payload CMS collections
│   ├── config/                 # Configuration files
│   └── lib/                    # Utilities and helpers
├── public/                     # Static assets
├── next.config.ts              # Next.js configuration
├── payload.config.ts           # Payload CMS config
├── rsbuild.config.ts           # RSBuild configuration
└── package.json
```

### Integration Architecture
```typescript
// App Router Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

// Providers setup with Katalyst integration
function Providers({ children }) {
  return (
    <KatalystProvider config={{ framework: 'next' }}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
      </QueryClientProvider>
    </KatalystProvider>
  );
}
```

## Getting Started

### Installation
```bash
# Navigate to Next.js app
cd next

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:20009
DATABASE_URI=file:./database.db
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Core Features

### 1. Server Components & Streaming

```typescript
// app/blog/page.tsx - Server Component
import { getPosts } from '@/lib/payload';

export default async function BlogPage() {
  // This runs on the server
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog</h1>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsList posts={posts} />
      </Suspense>
    </div>
  );
}

// Streaming with loading states
export const loading = () => <BlogPageSkeleton />;
```

### 2. Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt,
    openGraph: {
      title: post.meta?.title || post.title,
      description: post.meta?.description,
      images: [post.meta?.image || post.featuredImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta?.title || post.title,
      description: post.meta?.description,
      images: [post.meta?.image || post.featuredImage],
    },
  };
}
```

### 3. Payload CMS Integration

```typescript
// payload.config.ts
import { buildConfig } from 'payload/config';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  collections: [Posts, Users, Media, Categories],
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: lexicalEditor({}),
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI },
  }),
  sharp,
});
```

### 4. Marketing Components

#### Hero Sections
```typescript
import { HeroParallax } from '@/components/ui/hero-parallax';
import { BackgroundBeams } from '@/components/ui/background-beams';

export function MarketingHero() {
  return (
    <HeroParallax products={products}>
      <div className="relative z-10">
        <h1>Welcome to Katalyst</h1>
        <p>The fastest React framework ever built</p>
        <BackgroundBeams />
      </div>
    </HeroParallax>
  );
}
```

#### Feature Sections
```typescript
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal';

export function Features() {
  return (
    <>
      <BentoGrid>
        {features.map((feature, i) => (
          <BentoGridItem
            key={i}
            title={feature.title}
            description={feature.description}
            header={feature.header}
            icon={feature.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>

      <StickyScroll content={scrollContent} />
    </>
  );
}
```

#### Testimonials
```typescript
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

export function Testimonials() {
  return (
    <section>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
      
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  );
}
```

### 5. Multithreading in Next.js

```typescript
// app/api/process/route.ts
import { MultithreadingManager } from '@katalyst/shared';

export async function POST(request: Request) {
  const { data } = await request.json();
  
  const manager = new MultithreadingManager();
  await manager.initializeRayon({ numThreads: 4 });

  // Process data in parallel
  const results = await manager.parallelMap(data, (item) => {
    // CPU-intensive processing
    return processItem(item);
  });

  return Response.json({ results });
}

// Client-side usage
function DataProcessor() {
  const processData = async (data: any[]) => {
    const response = await fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
    
    return response.json();
  };
}
```

### 6. Image Optimization

```typescript
import Image from 'next/image';

export function OptimizedImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={85}
      placeholder="blur"
      blurDataURL={generateBlurDataURL(src)}
      priority={false}
      loading="lazy"
    />
  );
}
```

## Advanced Features

### 1. Popup Management

```typescript
// collections/Posts.ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    // ... other fields
    {
      name: 'popup',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'content',
          type: 'richText',
        },
        {
          name: 'delay',
          type: 'number',
          defaultValue: 5000,
        },
      ],
    },
  ],
};

// Component usage
export function BlogPost({ post }) {
  useEffect(() => {
    if (post.popup?.enabled) {
      setTimeout(() => {
        showPopup(post.popup.content);
      }, post.popup.delay);
    }
  }, [post]);
}
```

### 2. A/B Testing

```typescript
import { useABTest } from '@/hooks/use-ab-test';

export function CTAButton() {
  const variant = useABTest('cta-button', {
    variants: ['primary', 'secondary', 'gradient'],
    weights: [0.33, 0.33, 0.34],
  });

  return (
    <Button variant={variant} tracking={{ test: 'cta-button', variant }}>
      Get Started
    </Button>
  );
}
```

### 3. Analytics Integration

```typescript
// app/providers.tsx
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTagManager } from '@next/third-parties/google';
import { FacebookPixel } from '@/components/analytics/facebook-pixel';

export function Providers({ children }) {
  return (
    <>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID} />
      {children}
    </>
  );
}
```

### 4. MDX Work Portfolio

```typescript
// app/work/[slug]/page.tsx
import { compileMDX } from 'next-mdx-remote/rsc';
import { components } from '@/components/mdx';

export default async function WorkPage({ params }) {
  const source = await getWorkContent(params.slug);
  
  const { content } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
    },
  });

  return <article>{content}</article>;
}
```

## Performance Optimization

### 1. Bundle Optimization
```typescript
// rsbuild.config.ts
export default defineConfig({
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      chunks: {
        'next-vendor': {
          test: /[\\/]node_modules[\\/](next)[\\/]/,
          priority: 40,
          name: 'next-vendor',
        },
        'ui-components': {
          test: /[\\/]components[\\/]ui[\\/]/,
          priority: 30,
          name: 'ui-components',
        },
      },
    },
  },
});
```

### 2. Route Prefetching
```typescript
import { prefetch } from '@/lib/navigation';

export function Navigation() {
  // Prefetch on hover
  const handleHover = (href: string) => {
    prefetch(href);
  };

  return (
    <nav>
      <Link href="/blog" onMouseEnter={() => handleHover('/blog')}>
        Blog
      </Link>
    </nav>
  );
}
```

### 3. Static Generation
```typescript
// Generate static params for dynamic routes
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Revalidate static pages
export const revalidate = 3600; // 1 hour
```

## Deployment

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### 2. Docker Deployment
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Environment Configuration
```typescript
// next.config.ts
export default {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

## Best Practices

### 1. Component Organization
- Use Server Components by default
- Client Components only when needed
- Proper component composition
- Leverage suspense boundaries

### 2. Data Fetching
- Use Server Components for data fetching
- Implement proper caching strategies
- Use React Query for client-side fetching
- Optimize with parallel data fetching

### 3. SEO Optimization
- Dynamic metadata for all pages
- Structured data implementation
- Proper canonical URLs
- XML sitemap generation

### 4. Performance
- Lazy load components and routes
- Optimize images with Next.js Image
- Use static generation where possible
- Implement proper caching headers

## Troubleshooting

### Common Issues

1. **Hydration Mismatches**
```typescript
// Use the Katalyst hydration hook
const isHydrated = useHydration();

if (!isHydrated) {
  return <ServerOnlyContent />;
}

return <ClientContent />;
```

2. **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

3. **CMS Issues**
```bash
# Reset Payload CMS
npm run payload migrate:fresh

# Seed data
npm run payload seed
```

## Next Steps

- [008-remix-integration.md](./008-remix-integration.md) - Remix integration
- [009-deployment-guide.md](./009-deployment-guide.md) - Deployment strategies
- [010-marketing-components.md](./010-marketing-components.md) - Component catalog
- [011-cms-guide.md](./011-cms-guide.md) - Payload CMS deep dive