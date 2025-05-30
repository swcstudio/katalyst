# SOTA Marketing Stack v1.0.0

![Spectrum Web Co](https://via.placeholder.com/150x50?text=Spectrum+Web+Co)

> A state-of-the-art, cloud-native, distributed system boilerplate for marketing websites.

## Overview

The SOTA Marketing Stack is a comprehensive, production-ready boilerplate for creating high-performance marketing websites using cutting-edge technologies. Built with a cloud-native distributed system architecture, this stack provides a robust foundation for creating scalable, maintainable, and feature-rich marketing websites.

### Key Features

- **Modern Frontend**: Built with SolidJS and the complete Tanstack Framework suite
- **Cloud-Native Architecture**: Designed for Kubernetes and vCluster deployment
- **TypeScript-First**: 100% TypeScript codebase for type safety and developer experience
- **Comprehensive Testing**: Unit, E2E, snapshot, and asynchronous code testing
- **Self-Hosted Database**: Convex with CloudNativePG for data persistence
- **Research Blog**: Built-in blog functionality with MDX support
- **Authentication & Billing**: Integrated with Clerk
- **GitOps Workflow**: Complete CI/CD pipeline with Tekton, Jenkins, Flux-CD, and GitHub Actions

## Tech Stack

### Frontend
- **Framework**: [SolidJS](https://www.solidjs.com/) with [Tanstack](https://tanstack.com/) suite
  - Router, Query, Table, Form, Virtual, Pacer, Store, Ranger & Config
- **Build Tools**: rspack, rsbuild, rslib, rspress, rsdoctor, rstest
- **Runtime**: [Deno](https://deno.land/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: 
  - [PandaCSS](https://panda-css.com/)
  - [Mystic UI](https://mysticui.dev/)
  - [Park UI](https://park-ui.com/)
- **Language**: TypeScript (100% of codebase)

### Backend
- **Database**: [Convex](https://www.convex.dev/) (self-hosted)
- **Database Engine**: [CloudNativePG](https://cloudnative-pg.io/)

### Testing
- **Frameworks**:
  - [Solid Testing Library](https://github.com/solidjs/solid-testing-library)
  - [Jest](https://jestjs.io/)
- **Testing Types**:
  - Unit Testing
  - E2E Testing
  - Snapshot Testing
  - Asynchronous Code Testing

### Infrastructure
- **Container Orchestration**: Kubernetes
- **Virtual Clusters**: [vCluster](https://www.vcluster.com/) (loft.sh)
- **Cloud Provider**: OVHcloud (Managed Kubernetes)

### CI/CD & GitOps
- **Pipeline Tools**:
  - [Tekton](https://tekton.dev/)
  - [Jenkins](https://www.jenkins.io/)
  - [Flux CD](https://fluxcd.io/)
  - [GitHub Actions](https://github.com/features/actions)
- **GitOps Framework**: [KubeStack](https://www.kubestack.com/)

### Hosting & Authentication
- **Hosting**: [Netlify](https://www.netlify.com/)
- **Authentication & Billing**: [Clerk](https://clerk.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Deno](https://deno.land/) (v1.32 or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [vcluster CLI](https://www.vcluster.com/docs/getting-started/setup)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/spectrumwebco/sota-marketing-stack.git
   cd sota-marketing-stack
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

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
