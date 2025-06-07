# SolidStack Enterprise (SSE) Framework

![Spectrum Web Co](https://via.placeholder.com/150x50?text=Spectrum+Web+Co)

> A comprehensive micro-frameworks ecosystem built with SolidJS, rspack, and the complete Tanstack ecosystem for building state-of-the-art marketing websites.

## 🚀 Overview

The SolidStack Enterprise framework provides a cutting-edge foundation for building high-performance marketing websites using modern web technologies and micro-frontend architecture. Built with 100% TypeScript, Deno runtime exclusively, and complete rspack ecosystem integration.

### ✨ Key Features

- **🚀 Revolutionary Micro-Frontend Architecture**: Six specialized micro-frontends (Marketing, Blog, Storefront, Docs, Remix, SvelteKit) with shared state management
- **⚡ Unparalleled Performance**: Built with SolidJS and the complete Tanstack Framework suite for lightning-fast rendering
- **☁️ Enterprise-Grade Cloud-Native Architecture**: Designed for Kubernetes and vCluster deployment with production-ready scalability
- **🔒 Type-Safe Development**: 100% TypeScript codebase delivering superior developer experience and runtime safety
- **🧪 Comprehensive Testing Suite**: Robust unit, E2E, snapshot, and asynchronous code testing infrastructure with rstest
- **💾 Self-Hosted Database**: Convex with CloudNativePG for secure, high-performance data persistence
- **📝 Integrated Content Platform**: Built-in blog and documentation system with advanced MDX support
- **🔑 Enterprise Authentication & Billing**: Seamlessly integrated with Clerk for secure user management
- **🔄 Complete CI/CD Pipeline**: State-of-the-art GitOps workflow with Nx Cloud Premium and GitHub Actions
- **⚙️ Zero-Config Deployments**: Optimized for Vercel with comprehensive multi-framework support

## 🛠️ Tech Stack

### Core Technologies
- **Frontend Framework**: SolidJS with TypeScript
- **Build Tool**: rspack (complete ecosystem, no Vite)
- **Runtime**: Deno (exclusive package management)
- **Styling**: PandaCSS (atomic CSS)
- **Animation**: Anime.js with TypeScript wrappers
- **Testing**: rstest + Deno test
- **Linting**: Biomjs
- **Documentation**: Storybook with SolidJS integration

### Tanstack Ecosystem (Complete Integration)
- **State Management**: Zustand + Tanstack Store
- **Routing**: Tanstack Router v1.120.17
- **Data Fetching**: Tanstack Query
- **Forms**: Tanstack Form
- **Tables**: Tanstack Table
- **Virtualization**: Tanstack Virtual
- **Performance**: Tanstack Pacer

### Development Tools
- **Build Analysis**: rsdoctor with advanced features
- **CI/CD**: Nx Cloud Premium with AI-powered features
- **Deployment**: Vercel with multi-framework support
- **Server**: Nitro with Deno runtime integration

## 🏗️ Architecture

### Micro-Frontends Ecosystem

The SSE framework consists of six specialized micro-frontends, each serving specific purposes:

| Framework | Port | Purpose | Technology Stack |
|-----------|------|---------|------------------|
| **Marketing** | 20000 | Main marketing website | SolidJS + rspack + PandaCSS |
| **Blog** | 20001 | Dynamic blog functionality | Astro + SolidJS + Tanstack Query |
| **Storefront** | 20002 | E-commerce functionality | SolidJS + rspack + Zustand |
| **Docs** | 20003 | Static documentation | Astro Static + SolidJS components |
| **Remix App** | 20004 | Application UIs | Remix + rspack + SSR |
| **SvelteKit SPA** | 20005 | Single Page Applications | SvelteKit + rspack (no Vite) |
| **Storybook** | 20006 | Component development | Storybook + SolidJS |

### Shared Infrastructure

- **State Management**: Zustand with cross-framework adapters
- **Animations**: Anime.js TypeScript wrappers with SolidJS reactivity
- **Components**: Shared component library with TypeScript
- **Authentication**: Clerk integration with shared state
- **Styling**: PandaCSS with framework-specific configurations

### Backend & Database
- **Database**: [Convex](https://www.convex.dev/) (self-hosted)
- **Database Engine**: [CloudNativePG](https://cloudnative-pg.io/)
- **Server**: Nitro with Deno runtime integration

### Testing Infrastructure
- **Frameworks**: Deno test + rstest + Solid Testing Library
- **Testing Types**: Unit, E2E, snapshot, and asynchronous code testing
- **Coverage**: Comprehensive testing across all micro-frontends

### Infrastructure & Deployment
- **Container Orchestration**: Kubernetes
- **Virtual Clusters**: [vCluster](https://www.vcluster.com/) (loft.sh)
- **Cloud Provider**: OVHcloud (Managed Kubernetes)
- **Hosting**: Vercel with multi-framework support
- **Authentication & Billing**: [Clerk](https://clerk.dev/)

### CI/CD & GitOps
- **Build System**: Nx Cloud Premium with AI-powered CI
- **Pipeline Tools**: GitHub Actions with comprehensive testing
- **GitOps Framework**: [KubeStack](https://www.kubestack.com/)
- **Deployment**: Automated Vercel deployment for all frameworks

## Getting Started

### Prerequisites

- **Deno Runtime**: Latest version installed
- **Git**: For version control
- **TypeScript**: Included via Deno

### Installation

```bash
# Clone the repository
git clone https://github.com/spectrumwebco/sse.git
cd sse

# No npm install needed - Deno handles all dependencies
# All packages are imported via npm: specifiers in deno.json
```

### Development Commands

#### Start Individual Micro-Frontends

```bash
# Marketing website (SolidJS)
deno task dev:marketing     # http://localhost:20000

# Blog (Astro + SolidJS)
deno task dev:blog          # http://localhost:20001

# Storefront (SolidJS)
deno task dev:storefront    # http://localhost:20002

# Documentation (Astro Static)
deno task dev:docs          # http://localhost:20003

# Remix application (Remix + rspack)
deno task dev:remix         # http://localhost:20004

# SvelteKit SPA (SvelteKit + rspack)
deno task dev:sveltekit     # http://localhost:20005

# Storybook (Component development)
deno task storybook         # http://localhost:20006
```

#### Build Commands

```bash
# Build all micro-frontends
deno task build

# Build individual frameworks
deno task build:marketing
deno task build:blog
deno task build:storefront
deno task build:docs
deno task build:remix
deno task build:sveltekit
```

#### Testing Commands

```bash
# Comprehensive test suite
deno task test

# Unit tests
deno task test:unit

# Framework-specific tests
deno task test:frameworks

# Test all frameworks
deno task test:all
```

#### Development Tools

```bash
# Code quality and linting
deno task biome
deno task biome:fix

# PandaCSS generation
deno task generate:panda

# Build analysis with rsdoctor
deno task rsdoctor

# Preview built applications
deno task preview:marketing
deno task preview:remix
deno task preview:sveltekit
```

## Documentation

For detailed documentation, please refer to the [docs](./docs) directory:

- [Architecture Overview](./docs/architecture.md)
- [Component Guide](./docs/components.md)
- [Testing Guide](./docs/testing.md)
- [Deployment Guide](./docs/deployment.md)
- [Blog Setup](./docs/blog.md)
- [Authentication & Billing](./docs/auth-billing.md)

## Cloud-Native Deployment

### Setting up a Kubernetes Cluster on OVHcloud

1. Create a Managed Kubernetes cluster on OVHcloud
2. Configure your local machine with kubectl:
   ```bash
   kubectl config use-context your-ovh-context
   ```

3. Install vcluster:
   ```bash
   brew install vcluster
   ```

4. Deploy your marketing website:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   ```

For detailed deployment instructions, see the [Deployment Guide](./docs/deployment.md).

## Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

© 2025 Spectrum Web Co LLC. All rights reserved.

## Trademark

The SOTA Marketing Stack name and logo are trademarks of Spectrum Web Co LLC. All other trademarks are the property of their respective owners.
