import { createSignal, createEffect, Show } from 'solid-js';
import { useParams, Link } from '@tanstack/solid-router';
import { css } from '../../styled-system/css';
import { flex } from '../../styled-system/patterns';

const BLOG_POSTS = {
  'cloud-native-marketing-websites': {
    id: '003',
    title: 'Building Cloud-Native Marketing Websites',
    date: '2025-05-15',
    author: 'Jane Smith',
    readTime: '8 min read',
    tags: ['cloud-native', 'kubernetes', 'marketing'],
    content: `
# Building Cloud-Native Marketing Websites

## Introduction

Marketing websites are often the first point of contact between a company and its potential customers. In today's digital landscape, these websites need to be fast, reliable, and scalable. Cloud-native technologies offer a powerful solution to these requirements.

## What is Cloud-Native?

Cloud-native refers to applications designed specifically to run in cloud environments. These applications are:

- Containerized
- Dynamically orchestrated
- Microservices-oriented

## Benefits of Cloud-Native Marketing Websites

### Scalability

Cloud-native marketing websites can automatically scale up during high-traffic periods (like product launches or marketing campaigns) and scale down during quieter periods, optimizing resource usage and cost.

### Reliability

With proper orchestration using Kubernetes, your marketing website can achieve high availability with automatic failover and self-healing capabilities.

### Performance

By leveraging global CDNs and edge computing, cloud-native websites can deliver content to users with minimal latency, regardless of their geographic location.

## Implementing Cloud-Native Marketing Websites

### Step 1: Containerization

Package your website into containers using Docker. This ensures consistency across different environments and simplifies deployment.

### Step 2: Kubernetes Orchestration

Use Kubernetes to manage your containers, providing features like:

- Automatic scaling
- Load balancing
- Self-healing
- Rolling updates

### Step 3: vCluster Deployment

For multi-tenant scenarios or to isolate different environments (development, staging, production), vCluster provides a lightweight solution for creating virtual Kubernetes clusters within a host cluster.

## Conclusion

Cloud-native technologies offer powerful capabilities for marketing websites, enabling them to be more scalable, reliable, and performant. By leveraging containerization, Kubernetes orchestration, and vCluster deployment, you can create a marketing website infrastructure that grows with your business and delivers exceptional user experiences.
    `,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'what-is-cloud-native', title: 'What is Cloud-Native?', level: 2 },
      { id: 'benefits-of-cloud-native-marketing-websites', title: 'Benefits of Cloud-Native Marketing Websites', level: 2 },
      { id: 'scalability', title: 'Scalability', level: 3 },
      { id: 'reliability', title: 'Reliability', level: 3 },
      { id: 'performance', title: 'Performance', level: 3 },
      { id: 'implementing-cloud-native-marketing-websites', title: 'Implementing Cloud-Native Marketing Websites', level: 2 },
      { id: 'step-1-containerization', title: 'Step 1: Containerization', level: 3 },
      { id: 'step-2-kubernetes-orchestration', title: 'Step 2: Kubernetes Orchestration', level: 3 },
      { id: 'step-3-vcluster-deployment', title: 'Step 3: vCluster Deployment', level: 3 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
  },
  'solidjs-vs-react': {
    id: '002',
    title: 'SolidJS vs React: A Performance Comparison',
    date: '2025-04-22',
    author: 'John Doe',
    readTime: '6 min read',
    tags: ['solidjs', 'react', 'performance'],
    content: `
# SolidJS vs React: A Performance Comparison

## Introduction

Frontend frameworks are constantly evolving, with each new framework promising better performance and developer experience. SolidJS has emerged as a compelling alternative to React, offering similar syntax but with a fundamentally different approach to reactivity.

## Understanding the Differences

### Reactivity Model

**React** uses a virtual DOM and reconciliation process. When state changes, React:
1. Creates a new virtual DOM
2. Compares it with the previous one (diffing)
3. Updates only the parts of the real DOM that changed

**SolidJS** uses a fine-grained reactivity system without a virtual DOM. When state changes, SolidJS:
1. Directly updates only the specific DOM elements affected
2. Skips the diffing process entirely

### Component Model

**React** re-renders components when state or props change, potentially re-executing the entire component function.

**SolidJS** components run only once during initialization, setting up reactive dependencies that update specific parts of the DOM when needed.

## Performance Benchmarks

### Bundle Size

- **React + ReactDOM**: ~40KB (minified and gzipped)
- **SolidJS**: ~7KB (minified and gzipped)

### Memory Usage

SolidJS typically uses less memory than React due to its lack of virtual DOM overhead.

### Rendering Speed

In benchmark tests, SolidJS consistently outperforms React, especially in scenarios with frequent updates to large datasets.

## When to Choose SolidJS

SolidJS is particularly well-suited for:

- Performance-critical applications
- Applications with frequent updates
- Projects where bundle size is a concern
- Teams familiar with React who want better performance

## When to Stick with React

React might still be the better choice when:

- You need a mature ecosystem with extensive libraries
- Your team has deep React expertise
- You rely heavily on React-specific libraries

## Conclusion

SolidJS offers significant performance advantages over React while maintaining a familiar developer experience. For marketing websites where performance directly impacts user engagement and conversion rates, SolidJS represents an excellent choice.

By adopting SolidJS in the SOTA Marketing Stack, we've been able to create lightning-fast, responsive websites that provide exceptional user experiences while reducing server costs through more efficient resource utilization.
    `,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'understanding-the-differences', title: 'Understanding the Differences', level: 2 },
      { id: 'reactivity-model', title: 'Reactivity Model', level: 3 },
      { id: 'component-model', title: 'Component Model', level: 3 },
      { id: 'performance-benchmarks', title: 'Performance Benchmarks', level: 2 },
      { id: 'bundle-size', title: 'Bundle Size', level: 3 },
      { id: 'memory-usage', title: 'Memory Usage', level: 3 },
      { id: 'rendering-speed', title: 'Rendering Speed', level: 3 },
      { id: 'when-to-choose-solidjs', title: 'When to Choose SolidJS', level: 2 },
      { id: 'when-to-stick-with-react', title: 'When to Stick with React', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
  },
  'getting-started-with-sota-stack': {
    id: '001',
    title: 'Getting Started with SOTA Marketing Stack',
    date: '2025-03-10',
    author: 'Emily Chen',
    readTime: '10 min read',
    tags: ['sota-stack', 'tutorial', 'getting-started'],
    content: `
# Getting Started with SOTA Marketing Stack

## Introduction

The SOTA Marketing Stack is a state-of-the-art, cloud-native boilerplate for building high-performance marketing websites. This guide will walk you through setting up your first project using the SOTA Marketing Stack.

## Prerequisites

Before getting started, ensure you have the following installed:

- Deno (v1.32 or later)
- kubectl (for Kubernetes deployment)
- vCluster CLI (for virtual Kubernetes clusters)
- Git

## Installation

Clone the SOTA Marketing Stack repository:

\`\`\`bash
git clone https://github.com/spectrumwebco/sota-marketing-stack.git
cd sota-marketing-stack
\`\`\`

## Project Structure

The SOTA Marketing Stack follows a well-organized structure:

\`\`\`
sota-marketing-stack/
├── docs/               # Documentation
├── k8s/                # Kubernetes manifests
├── scripts/            # Build and deployment scripts
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components
│   │   └── blog/       # Blog-related pages
│   ├── styled-system/  # PandaCSS generated styles
│   ├── index.tsx       # Entry point
│   ├── routes.tsx      # Route definitions
│   └── server.ts       # Deno server
├── deno.json           # Deno configuration
├── panda.config.ts     # PandaCSS configuration
└── tsconfig.json       # TypeScript configuration
\`\`\`

## Development Workflow

### Starting the Development Server

Run the development server:

\`\`\`bash
deno task dev
\`\`\`

This will start the server at http://localhost:3000.

### Building for Production

Build the project for production:

\`\`\`bash
deno task build
\`\`\`

### Running Tests

Execute the test suite:

\`\`\`bash
deno task test
\`\`\`

## Creating Your First Page

1. Create a new file in \`src/pages\`, e.g., \`ProductPage.tsx\`:

\`\`\`tsx
import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

const ProductPage = () => {
  return (
    <div>
      <h1 class={css({ fontSize: '2xl', fontWeight: 'bold' })}>
        Our Products
      </h1>
      <p>Welcome to our products page!</p>
    </div>
  );
};

export default ProductPage;
\`\`\`

2. Add the route in \`src/routes.tsx\`:

\`\`\`tsx
const productRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/products',
  component: ProductPage,
});

export const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    productRoute,
  ]),
  notFoundRoute,
]);
\`\`\`

## Deploying to Kubernetes

1. Create a Kubernetes namespace:

\`\`\`bash
kubectl create namespace sota-marketing
\`\`\`

2. Apply the Kubernetes manifests:

\`\`\`bash
kubectl apply -f k8s/
\`\`\`

3. For vCluster deployment:

\`\`\`bash
vcluster create sota-marketing -n sota-marketing
\`\`\`

## Conclusion

You've now set up your first project using the SOTA Marketing Stack! This boilerplate provides a solid foundation for building high-performance, cloud-native marketing websites. Explore the documentation to learn more about advanced features and customization options.
    `,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'prerequisites', title: 'Prerequisites', level: 2 },
      { id: 'installation', title: 'Installation', level: 2 },
      { id: 'project-structure', title: 'Project Structure', level: 2 },
      { id: 'development-workflow', title: 'Development Workflow', level: 2 },
      { id: 'starting-the-development-server', title: 'Starting the Development Server', level: 3 },
      { id: 'building-for-production', title: 'Building for Production', level: 3 },
      { id: 'running-tests', title: 'Running Tests', level: 3 },
      { id: 'creating-your-first-page', title: 'Creating Your First Page', level: 2 },
      { id: 'deploying-to-kubernetes', title: 'Deploying to Kubernetes', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
  },
};

const BlogPostPage = () => {
  const params = useParams();
  const [activeSection, setActiveSection] = createSignal('');
  
  const post = BLOG_POSTS[params.slug as keyof typeof BLOG_POSTS];
  
  createEffect(() => {
    if (!post) return;
    
    const handleScroll = () => {
      const sections = post.tableOfContents.map(item => document.getElementById(item.id));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        const id = line.slice(2).toLowerCase().replace(/[^\w]+/g, '-');
        return (
          <h1 
            id={id}
            class={css({
              fontSize: { base: '3xl', md: '4xl' },
              fontWeight: 'bold',
              color: 'gray.900',
              mt: '8',
              mb: '4',
            })}
          >
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        const id = line.slice(3).toLowerCase().replace(/[^\w]+/g, '-');
        return (
          <h2 
            id={id}
            class={css({
              fontSize: { base: '2xl', md: '3xl' },
              fontWeight: 'bold',
              color: 'gray.800',
              mt: '6',
              mb: '3',
            })}
          >
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        const id = line.slice(4).toLowerCase().replace(/[^\w]+/g, '-');
        return (
          <h3 
            id={id}
            class={css({
              fontSize: { base: 'xl', md: '2xl' },
              fontWeight: 'semibold',
              color: 'gray.700',
              mt: '5',
              mb: '2',
            })}
          >
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        return (
          <li
            class={css({
              ml: '6',
              mb: '2',
            })}
          >
            {line.slice(2)}
          </li>
        );
      } else if (line.startsWith('```')) {
        return (
          <pre
            class={css({
              bg: 'gray.100',
              p: '4',
              rounded: 'md',
              overflowX: 'auto',
              my: '4',
              fontFamily: 'mono',
            })}
          >
            <code>{line.slice(3)}</code>
          </pre>
        );
      } else if (line.trim() === '') {
        return <br />;
      } else {
        return (
          <p
            class={css({
              mb: '4',
              lineHeight: 'tall',
            })}
          >
            {line}
          </p>
        );
      }
    });
  };

  return (
    <Show
      when={post}
      fallback={
        <div
          class={css({
            py: '20',
            textAlign: 'center',
          })}
        >
          <h1
            class={css({
              fontSize: '2xl',
              fontWeight: 'bold',
              mb: '4',
            })}
          >
            Blog post not found
          </h1>
          <p
            class={css({
              mb: '6',
            })}
          >
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            class={css({
              color: 'primary.600',
              fontWeight: 'medium',
              _hover: {
                textDecoration: 'underline',
              },
            })}
          >
            ← Back to blog
          </Link>
        </div>
      }
    >
      <div
        class={css({
          py: { base: '8', md: '12' },
        })}
      >
        <Link
          href="/blog"
          class={css({
            display: 'inline-flex',
            alignItems: 'center',
            color: 'primary.600',
            fontWeight: 'medium',
            mb: '6',
            _hover: {
              textDecoration: 'underline',
            },
          })}
        >
          ← Back to blog
        </Link>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '3fr 1fr' },
            gap: '8',
          })}
        >
          {/* Main content */}
          <div>
            <div
              class={css({
                mb: '6',
              })}
            >
              <span
                class={css({
                  display: 'inline-block',
                  bg: 'primary.100',
                  color: 'primary.800',
                  px: '2',
                  py: '1',
                  rounded: 'md',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  mb: '3',
                })}
              >
                {post.id}
              </span>
              <h1
                class={css({
                  fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
                  fontWeight: 'bold',
                  color: 'gray.900',
                  lineHeight: 'tight',
                  mb: '4',
                })}
              >
                {post.title}
              </h1>
              <div
                class={flex({
                  align: 'center',
                  gap: '4',
                  flexWrap: 'wrap',
                })}
              >
                <span
                  class={css({
                    color: 'gray.600',
                  })}
                >
                  {post.date}
                </span>
                <span
                  class={css({
                    color: 'gray.600',
                  })}
                >
                  {post.readTime}
                </span>
                <span
                  class={css({
                    color: 'gray.700',
                    fontWeight: 'medium',
                  })}
                >
                  By {post.author}
                </span>
              </div>
            </div>

            <div
              class={css({
                bg: 'white',
                p: { base: '6', md: '8' },
                rounded: 'lg',
                shadow: 'md',
              })}
            >
              <div
                class={css({
                  color: 'gray.800',
                  lineHeight: 'tall',
                  fontSize: { base: 'md', md: 'lg' },
                })}
              >
                {renderMarkdown(post.content)}
              </div>

              <div
                class={css({
                  mt: '12',
                  pt: '6',
                  borderTop: '1px solid',
                  borderColor: 'gray.200',
                })}
              >
                <div
                  class={css({
                    fontSize: 'sm',
                    fontWeight: 'medium',
                    color: 'gray.700',
                    mb: '3',
                  })}
                >
                  Tags:
                </div>
                <div
                  class={flex({
                    gap: '2',
                    flexWrap: 'wrap',
                  })}
                >
                  <For each={post.tags}>
                    {(tag) => (
                      <Link
                        href={`/blog?tag=${tag}`}
                        class={css({
                          px: '3',
                          py: '1',
                          bg: 'gray.100',
                          color: 'gray.700',
                          rounded: 'full',
                          fontSize: 'sm',
                          _hover: {
                            bg: 'gray.200',
                          },
                        })}
                      >
                        {tag}
                      </Link>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>

          {/* Table of contents */}
          <div
            class={css({
              display: { base: 'none', lg: 'block' },
              position: 'sticky',
              top: '24',
            })}
          >
            <div
              class={css({
                bg: 'white',
                p: '6',
                rounded: 'lg',
                shadow: 'md',
              })}
            >
              <h2
                class={css({
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '4',
                })}
              >
                Table of Contents
              </h2>
              <nav>
                <ul
                  class={css({
                    listStyleType: 'none',
                  })}
                >
                  <For each={post.tableOfContents}>
                    {(item) => (
                      <li
                        class={css({
                          mb: '2',
                          pl: item.level === 3 ? '4' : '0',
                        })}
                      >
                        <a
                          href={`#${item.id}`}
                          class={css({
                            display: 'block',
                            py: '1',
                            px: '2',
                            rounded: 'md',
                            fontSize: item.level === 3 ? 'sm' : 'md',
                            fontWeight: activeSection() === item.id ? 'medium' : 'normal',
                            color: activeSection() === item.id ? 'primary.700' : 'gray.700',
                            bg: activeSection() === item.id ? 'primary.50' : 'transparent',
                            _hover: {
                              color: 'primary.600',
                              bg: 'gray.50',
                            },
                          })}
                        >
                          {item.title}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default BlogPostPage;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
