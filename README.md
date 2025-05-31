# SolidStack Enterprise (SSE Framework) Beta Release

![Spectrum Web Co](https://via.placeholder.com/150x50?text=Spectrum+Web+Co)

> The ultimate state-of-the-art, cloud-native, distributed system framework for enterprise-grade marketing websites.

## Overview

SolidStack Enterprise is a revolutionary, production-ready framework for creating lightning-fast, enterprise-grade marketing websites using bleeding-edge technologies. Built with a cloud-native distributed system architecture, this framework delivers unparalleled performance, scalability, and developer experience that traditional stacks simply cannot match.

## Project Structure

SolidStack Enterprise follows industry-standard micro frontend architecture principles:

```
sse/
├── apps/                    # Micro Frontend Applications
│   ├── marketing/          # Main website (spectrumwebco.com.au)
│   │   ├── src/           # Marketing app source code
│   │   ├── public/        # Static assets
│   │   ├── tests/         # Marketing app tests
│   │   └── rsbuild.config.ts (port 30000)
│   ├── blog/              # Blog platform (blog.spectrumwebco.com.au)
│   │   ├── src/           # Blog app source code
│   │   ├── content/posts/ # Blog MDX content
│   │   ├── public/        # Blog assets
│   │   ├── tests/         # Blog app tests
│   │   └── astro.config.mjs (port 30001)
│   ├── docs/              # Documentation (docs.spectrumwebco.com.au)
│   │   ├── src/           # Docs app source code
│   │   ├── content/       # Documentation content
│   │   ├── public/        # Docs assets
│   │   ├── tests/         # Docs app tests
│   │   └── astro.config.mjs (port 30002)
│   └── storefront/        # E-commerce (store.spectrumwebco.com.au)
│       ├── src/           # Storefront source code
│       ├── public/        # Storefront assets
│       ├── tests/         # Storefront tests
│       └── rsbuild.config.ts (port 30003)
├── libs/                   # Shared Libraries
│   ├── ui/                # Shared UI components (@sse/ui)
│   ├── utils/             # Shared utilities (@sse/utils)
│   ├── types/             # Shared TypeScript types (@sse/types)
│   └── assets/            # Shared assets
├── infrastructure/         # Deployment configurations
├── .github/               # CI/CD workflows
├── .nx/                   # Nx cache
└── scripts/               # Build scripts
```

Each micro frontend operates independently with its own development server, build process, and deployment pipeline, while sharing common components and utilities through the `libs/` packages.

### Key Features

- **🚀 Revolutionary Micro-Frontend Architecture**: Four independent frontends (Marketing, Blog, Storefront, Docs) with shared state management
- **⚡ Unparalleled Performance**: Built with SolidJS and the complete Tanstack Framework suite for lightning-fast rendering
- **☁️ Enterprise-Grade Cloud-Native Architecture**: Designed for Kubernetes and vCluster deployment with production-ready scalability
- **🔒 Type-Safe Development**: 100% TypeScript codebase delivering superior developer experience and runtime safety
- **🧪 Comprehensive Testing Suite**: Robust unit, E2E, snapshot, and asynchronous code testing infrastructure
- **💾 Self-Hosted Database**: Convex with CloudNativePG for secure, high-performance data persistence
- **📝 Integrated Content Platform**: Built-in blog and documentation system with advanced MDX support
- **🔑 Enterprise Authentication & Billing**: Seamlessly integrated with Clerk for secure user management
- **🔄 Complete CI/CD Pipeline**: State-of-the-art GitOps workflow with Tekton, Jenkins, Flux-CD, and GitHub Actions
- **⚙️ Zero-Config Deployments**: Optimized for Vercel with planned Cloudflare integration

## Tech Stack

### Frontend
- **Framework**: [SolidJS](https://www.solidjs.com/) with complete [Tanstack](https://tanstack.com/) suite
  - Router, Query, Table, Form, Virtual, Pacer, Store, Ranger & Config
- **Build System**: Complete rstack ecosystem
  - [rspack](https://rspack.dev/) - Blazing fast Rust-based bundler
  - [rsbuild](https://rsbuild.dev/) - Enterprise-grade build system
  - [rslib](https://github.com/web-infra-dev/rslib) - Shared library management
  - [rspress](https://rspress.dev/) - Documentation site generator
  - [rsdoctor](https://rsdoctor.dev/) - Build performance analysis
  - [rstest](https://github.com/web-infra-dev/rstest) - Modern testing framework
- **Runtime**: [Deno](https://deno.land/) - Secure TypeScript runtime with zero configuration
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management with shared authentication
- **Styling**: 
  - [PandaCSS](https://panda-css.com/) - Type-safe CSS-in-JS
  - [Mystic UI](https://mysticui.dev/) - Enterprise component library
  - [Park UI](https://park-ui.com/) - Accessible design system
- **Language**: TypeScript (100% of codebase) - Maximum type safety and developer experience

### Backend
- **Database**: [Convex](https://www.convex.dev/) (self-hosted)
- **Database Engine**: [CloudNativePG](https://cloudnative-pg.io/)

### Testing
- **Frameworks**:
  - [Deno Testing](https://deno.land/manual/testing) - Native TypeScript testing
  - [Solid Testing Library](https://github.com/solidjs/solid-testing-library) - Component testing
  - [rstest](https://github.com/web-infra-dev/rstest) - Modern Rust-powered testing
- **Testing Types**:
  - Unit Testing - Comprehensive component and function tests
  - E2E Testing - Full user flow validation
  - Snapshot Testing - UI regression prevention
  - Asynchronous Code Testing - Robust async operation validation
  - Performance Testing - Ensuring enterprise-grade speed

### Infrastructure
- **Container Orchestration**: Kubernetes - Enterprise-grade container orchestration
- **Virtual Clusters**: [vCluster](https://www.vcluster.com/) (loft.sh) - Multi-tenant isolation
- **Cloud Provider**: OVHcloud (Managed Kubernetes) - European cloud sovereignty
- **Secret Management**: [HashiCorp Vault](https://www.vaultproject.io/) - Enterprise-grade security
- **Air-Gapped Support**: [Zarf](https://zarf.dev/) - Deployment in restricted environments
- **Monitoring Stack**:
  - [Prometheus](https://prometheus.io/) - Metrics collection
  - [Grafana](https://grafana.com/) - Visualization dashboards
  - [Thanos](https://thanos.io/) - Long-term metrics storage
  - [Loki](https://grafana.com/oss/loki/) - Log aggregation

### CI/CD & GitOps
- **Build System**: [Nx Cloud Premium](https://nx.dev/) - AI-powered CI with distributed execution
- **Pipeline Tools**:
  - [Tekton](https://tekton.dev/) - Kubernetes-native CI/CD
  - [Jenkins](https://www.jenkins.io/) - Enterprise automation server
  - [Flux CD](https://fluxcd.io/) - GitOps for Kubernetes
  - [GitHub Actions](https://github.com/features/actions) - Workflow automation
- **GitOps Framework**: [KubeStack](https://www.kubestack.com/) - Infrastructure as Code for Kubernetes

### Hosting & Authentication
- **Hosting**: [Vercel](https://vercel.com/) - Enterprise-grade edge deployment
- **Authentication & Billing**: [Clerk](https://clerk.dev/) - Complete user management
- **Database**: [Convex](https://www.convex.dev/) - Self-hosted with CloudNativePG

### AI Agent Companion (Coming Soon)
- **Interactive Site Guide**: Anime-style "Mini Me" avatar that provides personalized assistance
- **Voice Mode**: Natural conversation with your site visitors
- **Content Generation**: Dynamic photo creation and design pattern visualization
- **Engagement Features**: Special discounts, community building, and subscription management
- **Technical Support**: Detailed answers about your software engineering services
- **Implementation**: Built with LangGraph and Langchain for enterprise-grade AI capabilities

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) (v1.32 or later) - Primary runtime environment
- [Node.js](https://nodejs.org/) (v18 or later) - For npm package compatibility
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) - Container management
- [kubectl](https://kubernetes.io/docs/tasks/tools/) - Kubernetes CLI
- [vcluster CLI](https://www.vcluster.com/docs/getting-started/setup) - Virtual cluster management
- [Nx CLI](https://nx.dev/getting-started/nx-setup) - Build system orchestration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/spectrumwebco/sota-marketing-stack.git
   cd sota-marketing-stack
   ```

2. Install dependencies:
   ```bash
   deno task setup
   ```

3. Start the development server for all micro-frontends:
   ```bash
   npm run dev:all
   ```
   
   Or start individual micro-frontends:
   ```bash
   npm run marketing    # Marketing website
   npm run blog         # Blog platform
   npm run docs         # Documentation site
   npm run storefront   # E-commerce storefront
   ```

4. Open your browser and navigate to:
   - Marketing: `http://localhost:30000`
   - Blog: `http://localhost:30001`
   - Docs: `http://localhost:30002`
   - Storefront: `http://localhost:30003`

5. Build shared libraries (if needed):
   ```bash
   npm run build:libs   # Build all shared libraries
   npm run ui:build     # Build UI library only
   npm run utils:build  # Build utils library only
   npm run types:build  # Build types library only
   ```

## Documentation

Comprehensive documentation is available in the [docs](./docs) directory:

- [Architecture Overview](./docs/architecture.md) - Detailed system design and patterns
- [Component Guide](./docs/components.md) - Reusable UI components and patterns
- [Testing Guide](./docs/testing.md) - Complete testing strategy and examples
- [Deployment Guide](./docs/deployment.md) - Production deployment instructions
- [Blog Setup](./docs/blog.md) - Content management configuration
- [Authentication & Billing](./docs/auth-billing.md) - User management and payment processing
- [Micro-Frontend Architecture](./docs/micro-frontends.md) - Independent deployment strategy

## Cloud-Native Deployment

SolidStack Enterprise is designed for true cloud-native deployment with zero infrastructure investment.

### Enterprise Kubernetes Deployment

1. Create a Managed Kubernetes cluster on your preferred provider:
   ```bash
   # For OVHcloud
   ovhai kube create --name sse-cluster --version 1.26 --region GRA
   
   # For AWS EKS
   eksctl create cluster --name sse-cluster --region eu-west-1
   ```

2. Configure your local machine with kubectl:
   ```bash
   kubectl config use-context your-cluster-context
   ```

3. Deploy the complete infrastructure stack:
   ```bash
   # Apply Kubestack terraform configuration
   cd infrastructure/kubestack
   terraform init && terraform apply
   
   # Deploy application components
   kubectl apply -f infrastructure/kubernetes/manifests/
   ```

4. Access your deployed micro-frontends:
   - Marketing: `https://spectrumwebco.com.au`
   - Blog: `https://blog.spectrumwebco.com.au`
   - Docs: `https://docs.spectrumwebco.com.au`
   - Storefront: `https://store.spectrumwebco.com.au`

For detailed deployment instructions, see the [Deployment Guide](./docs/deployment.md).

## Why SolidStack Enterprise?

SolidStack Enterprise represents thousands of engineering hours condensed into a single framework. Here's why it stands apart:

- **Unmatched Performance**: Lightning-fast rendering with SolidJS and optimized build system
- **Enterprise-Ready**: Production-grade security, monitoring, and scalability built-in
- **Developer Experience**: Zero-config setup with comprehensive documentation and type safety
- **Future-Proof Architecture**: Micro-frontend approach allows incremental upgrades and technology shifts
- **Complete Solution**: From frontend to infrastructure, everything is included and integrated

## Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

© 2025 Spectrum Web Co LLC. All rights reserved.

## Trademark

SolidStack Enterprise, SSE Framework, and the SolidStack logo are trademarks of Spectrum Web Co LLC. All other trademarks are the property of their respective owners.
