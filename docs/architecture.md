# SOTA Marketing Stack Architecture

## Overview

The SOTA Marketing Stack is a state-of-the-art, cloud-native, distributed system boilerplate for creating high-performance marketing websites. This document outlines the architecture of the stack and explains how the various components work together.

## Technology Stack

### Frontend

- **SolidJS**: A declarative, efficient, and flexible JavaScript library for building user interfaces with a fine-grained reactivity system.
- **Tanstack Framework**: A collection of high-quality, type-safe libraries for building robust web applications.
  - **Tanstack Router**: Provides routing capabilities for SolidJS applications.
  - **Tanstack Query**: Handles data fetching, caching, and state management.
  - **Tanstack Table**: Creates powerful tables and datagrids.
  - **Tanstack Form**: Manages form state and validation.
  - **Tanstack Virtual**: Efficiently renders large lists.
  - **Tanstack Store**: Manages application state.
- **PandaCSS**: A CSS-in-JS library with atomic CSS generation for optimal performance.
- **Mystic UI & Park UI**: Component libraries providing pre-built UI elements.
- **Zustand**: A small, fast, and scalable state management solution.

### Backend

- **Deno Runtime**: A secure JavaScript and TypeScript runtime with built-in TypeScript support.
- **Convex**: A backend-as-a-service platform for real-time applications, self-hosted in our Kubernetes cluster.
- **CloudNativePG**: A Kubernetes operator for PostgreSQL database management.
- **Clerk**: Authentication and user management service.

### Infrastructure

- **Kubernetes**: Container orchestration platform for managing containerized applications.
- **vCluster**: Virtual Kubernetes clusters for multi-tenancy and isolation.
- **OVHcloud**: Cloud provider for hosting the Kubernetes cluster.
- **Netlify**: Static site hosting and serverless functions.

### Development & CI/CD

- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **rspack/rsbuild**: Fast bundler and build system for web applications.
- **Jest & Solid Testing Library**: Testing frameworks for unit and integration tests.
- **GitOps Framework**: Infrastructure as code and continuous delivery approach.
- **Tekton, Jenkins, Flux-CD**: CI/CD pipeline tools.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                         Netlify CDN                          │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    SolidJS Frontend App                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Tanstack   │  │  PandaCSS   │  │  Mystic UI/Park UI  │  │
│  │  Framework  │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                       Deno Runtime                           │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                      vCluster                        │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │  Convex     │  │CloudNativePG│  │  Clerk      │  │    │
│  │  │  Database   │  │             │  │  Auth       │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Component Interactions

1. **Client Request Flow**:
   - User requests are first served by Netlify's CDN for static assets.
   - Dynamic requests are handled by the SolidJS application.
   - API requests are routed to the Deno server running in the Kubernetes cluster.

2. **Data Flow**:
   - Frontend components use Tanstack Query to fetch data from the backend.
   - The Deno server processes requests and interacts with the Convex database.
   - Authentication is handled by Clerk, which provides user management and access control.

3. **Deployment Flow**:
   - Code changes are pushed to the repository.
   - CI/CD pipeline (GitHub Actions, Tekton, Jenkins) runs tests and builds the application.
   - Flux-CD deploys the application to the Kubernetes cluster using GitOps principles.
   - Netlify deploys the static frontend assets.

## Cloud-Native Aspects

The SOTA Marketing Stack is designed to be truly cloud-native, eliminating infrastructure investments while delivering complete functionality:

1. **Containerization**: All components are containerized for consistent deployment across environments.
2. **Orchestration**: Kubernetes manages container lifecycle, scaling, and self-healing.
3. **Microservices**: The architecture is composed of loosely coupled services.
4. **Declarative Configuration**: Infrastructure is defined as code and managed through GitOps.
5. **Observability**: Built-in monitoring and logging for all components.
6. **Scalability**: Automatic scaling based on demand.
7. **Resilience**: Self-healing capabilities and fault tolerance.

## Multi-Tenancy with vCluster

The vCluster setup provides:

1. **Isolation**: Each tenant gets their own virtual Kubernetes cluster.
2. **Resource Efficiency**: Multiple virtual clusters share the underlying host cluster resources.
3. **Security**: Tenants cannot access each other's resources.
4. **Simplified Management**: Central administration of all virtual clusters.

## Conclusion

The SOTA Marketing Stack provides a comprehensive, cloud-native solution for building high-performance marketing websites. By leveraging modern technologies and best practices, it offers a scalable, reliable, and efficient platform for creating exceptional user experiences.

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
