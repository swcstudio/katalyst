# Katalyst-React: Overview

## Introduction

Katalyst-React is an advanced High-Performance Computing (HPC) React 19 framework designed to deliver the fastest React development experience ever achieved. Born from the deprecation of Create React App by Meta, Katalyst-React steps up as a comprehensive solution that not only replaces CRA but exceeds it with cutting-edge features and unprecedented performance.

## What Makes Katalyst-React Unique?

### 1. **Rust-Powered Performance**
- Native Rust toolchain integration for blazing-fast build times
- RSpack bundler (Rust-based webpack alternative) for superior bundling performance
- Native multithreading module written in Rust using NAPI bindings
- Lock-free data structures and parallel processing capabilities

### 2. **Multi-Framework Architecture**
Katalyst-React consists of four interconnected parts:

- **Katalyst-Core**: Vanilla React 19 framework with advanced features
- **Katalyst-Next**: Next.js 15 integration for SSR/SSG applications
- **Katalyst-Remix**: Remix integration for full-stack applications
- **Katalyst-Shared**: Shared components, utilities, and the native multithreading module

### 3. **Unified Build System**
- Primary: Deno + Turborepo
- Fallback: Bun + NX
- Intelligent orchestration via unified runner
- Platform-specific optimizations
- Cloud caching for maximum efficiency

### 4. **Native Multithreading**
- Crossbeam for lock-free concurrent data structures
- Rayon for data parallelism
- Tokio for async runtime
- Seamless integration with JavaScript via NAPI

## Key Features

### Performance
- **Sub-second HMR** (Hot Module Replacement)
- **Parallel builds** across all frameworks
- **Incremental compilation** with intelligent caching
- **WebAssembly support** out of the box
- **Native thread pools** for CPU-intensive operations

### Developer Experience
- **React 19 concurrent features** fully supported
- **TypeScript 5.6** with strict mode by default
- **Unified design system** with token-based theming
- **Cross-framework component sharing**
- **Built-in testing framework** with 80% coverage requirements

### Production Ready
- **Multi-platform support**: Web, Desktop (Tauri), Mobile
- **SEO optimization** built-in
- **Performance monitoring** integrated
- **Security best practices** enforced
- **CI/CD pipelines** pre-configured

## Architecture Overview

```
katalyst-react/
├── core/           # Vanilla React 19 framework
├── next/           # Next.js 15 integration
├── remix/          # Remix integration
├── shared/         # Shared libraries
│   ├── src/
│   │   ├── components/     # Shared React components
│   │   ├── design-system/  # Token-based design system
│   │   ├── hooks/          # Shared React hooks
│   │   ├── native/         # Rust multithreading module
│   │   ├── plugins/        # Framework plugins
│   │   └── stores/         # State management
├── scripts/        # Build and utility scripts
├── tests/          # Comprehensive test suite
└── docs/           # Documentation
```

## Getting Started

### Prerequisites
- Node.js 20+ (managed via nvm)
- Rust toolchain (for native modules)
- Deno or Bun (package managers)
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/swcstudio/katalyst-react.git

# Install dependencies
make install

# Start development servers
make dev

# Build for production
make build
```

### Available Ports
- **Core**: http://localhost:20007
- **Remix**: http://localhost:20008
- **Next**: http://localhost:20009

## Why Katalyst-React?

1. **Performance First**: Every decision prioritizes speed and efficiency
2. **Modern Stack**: Latest React 19, TypeScript, and Rust technologies
3. **Enterprise Ready**: Built for scale with proper testing and monitoring
4. **Developer Joy**: Exceptional DX with fast feedback loops
5. **Future Proof**: Designed to evolve with the React ecosystem

## Next Steps

- [002-getting-started.md](./002-getting-started.md) - Detailed setup instructions
- [003-core-framework.md](./003-core-framework.md) - Deep dive into Katalyst-Core
- [004-shared-components.md](./004-shared-components.md) - Using shared components
- [005-multithreading.md](./005-multithreading.md) - Native multithreading guide
- [006-build-system.md](./006-build-system.md) - Understanding the build system

## License

Katalyst-React is open source under the MIT License. See [LICENSE](../LICENSE) for details.