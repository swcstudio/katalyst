# React on Rust Framework

Enterprise-grade full-stack framework combining React 19, TypeScript, Inertia.js, and AdonisJS backend within the SolidStack Enterprise (SSE) ecosystem.

## Features

- **React 19**: Latest React features with concurrent rendering and server components
- **TypeScript**: 100% TypeScript implementation with zero JavaScript tolerance
- **Inertia.js**: Seamless full-stack experience without traditional API layers
- **AdonisJS**: Robust MVC backend framework
- **Apache Pulsar**: Event-driven pubsub architecture for real-time communication
- **Nomad Deployment**: Production-ready container orchestration
- **Shared State**: Zustand integration for cross-framework state management

## Development

```bash
# Start development server on port 20007
deno task dev:reactonrust

# Build for production
deno task build:reactonrust

# Run tests
deno test apps/reactonrust/tests/

# Lint code
deno task biome
```

## Architecture

### Frontend
- React 19 + TypeScript
- Inertia.js Client
- PandaCSS Styling
- Zustand State Management

### Backend
- AdonisJS MVC Framework
- Rust Performance Layer
- Inertia.js Server
- Apache Pulsar Messaging

### Infrastructure
- Nomad Orchestration
- Docker Containers
- Vault Security
- Consul Service Discovery

## Deployment

The React on Rust framework is deployed using Nomad with the following configuration:

- **Port**: 20007
- **Replicas**: 2
- **Health Checks**: HTTP endpoint monitoring
- **Resources**: 600 CPU, 768MB memory

Deploy using:
```bash
nomad job run infrastructure/nomad/jobs/sse-reactonrust.nomad
```

## Integration

This framework integrates with the broader SSE ecosystem:

- Shared authentication via Zustand store
- Cross-framework component library
- Unified build and deployment pipeline
- Event-driven communication with other micro-frontends

## License

© 2025 Spectrum Web Co LLC. All rights reserved.
Licensed under MIT License.
