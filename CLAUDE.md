# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Katalyst is a comprehensive full-stack framework that combines multiple technologies into a unified development system. The project is structured as a multi-component architecture with:

- **Core Frontend** (`/core`): React 19 applications using TanStack Router, RSpack, and Deno
- **Elixir Backend** (`/server`): Phoenix framework with Rust NIFs and Claude Code integration
- **Rust Runtime** (`/runtime`): Terminal emulators, TUI applications, and WebAssembly components

## Essential Build Commands

### Primary Development Commands
```bash
# Install dependencies (uses Deno primarily, Bun fallback)
make install

# Start all development servers
make dev

# Build all components
make build

# Run all tests
make test

# Lint and format code
make lint
make format

# Type checking
make typecheck

# Clean build artifacts
make clean
```

### Framework-Specific Commands
```bash
# Core application (port 20007)
make dev-core
make build-core
make test-core

# Admin dashboard (Remix)
make dev-remix
make build-remix
make test-remix

# Marketing website (Next.js)
make dev-nextjs
make build-nextjs
make test-nextjs
```

### Server Commands (Elixir Phoenix)
```bash
# Server development (from /server directory)
mix setup                    # Install and setup dependencies
mix phx.server              # Start Phoenix server on port 4000
mix test                    # Run server tests
mix deps.get               # Install Elixir dependencies
mix ecto.migrate           # Run database migrations
```

### Rust Runtime Commands (from /runtime directory)
```bash
# Build Rust components
cargo build --release
cargo test

# Start terminal applications
./katalyst-terminal-pro
./katalyst-tui
```

### Testing Commands
```bash
# Comprehensive testing
make test                   # All tests
make test-unit             # Unit tests only
make test-integration      # Integration tests only
make test-e2e             # End-to-end tests
make test-performance     # Performance benchmarks
make test-coverage        # Tests with coverage report
```

## Architecture Overview

### Multi-Runtime System
- **Deno**: Primary runtime for modern JavaScript/TypeScript
- **Node.js**: Compatibility layer for existing tooling
- **Bun**: Fallback package manager and runtime
- **Rust**: High-performance native components
- **Elixir**: Backend services with actor model concurrency

### Build System Orchestration
- **Turborepo**: Primary task runner with cloud caching
- **NX**: Fallback task runner with intelligent builds
- **RSpack**: Rust-powered bundler for core applications
- **Biome**: Code formatting and linting

### Framework Integration
1. **Core App** (`/core/apps/app`): TanStack Router + RSpack + React 19
2. **Admin App** (`/core/apps/admin`): Remix for server-side rendering
3. **Marketing App** (`/core/apps/marketing`): Next.js + Payload CMS for content
4. **Terminal App** (`/runtime/katalyst-tui`): Rust TUI with ratatui
5. **Backend** (`/server`): Phoenix with Rust NIFs for Claude Code integration

### Key Technologies
- **Frontend**: React 19, TypeScript, TailwindCSS, Arco Design
- **Backend**: Elixir/Phoenix, PostgreSQL, Rust NIFs
- **Build**: RSpack, Deno, Turborepo, NX
- **Runtime**: Tauri (desktop), WebAssembly, Node.js compat
- **AI Integration**: Claude Code SDK via Rust/Elixir bridge

## Development Workflow

### Getting Started
```bash
# 1. Initial setup
make setup                 # Installs deps, configures caching
make check-env            # Verify required tools are installed
make dev                  # Start all development servers
```

### Common Development Tasks
```bash
# Full development cycle
make install && make dev

# Before committing
make lint && make typecheck && make test

# Production build
make build-all            # All platforms
make deploy              # Deploy to configured platforms
```

### Performance Optimization
- **Cloud Caching**: Turborepo/NX cloud caching enabled by default
- **Parallel Builds**: Multi-framework builds run concurrently
- **Multithreading**: Web Workers and Rust for heavy computations
- **WebAssembly**: Performance-critical code compiled to WASM

## Server-Specific Development

### Claude Code Integration
The server includes a sophisticated Claude Code integration via:
- **Python SDK**: Full Claude Code functionality
- **Rust Bridge**: PyO3 bindings for performance
- **Elixir Wrapper**: Phoenix controllers and GenServer session management

### Database Operations
```bash
# Database setup and migrations
mix ecto.create
mix ecto.migrate
mix ecto.rollback
mix ecto.reset
```

### Server Testing
```bash
# Elixir tests
mix test

# Claude Code integration tests
elixir test_claude_integration.exs
elixir test_python_minimal.exs
```

## Platform Targets

### Web Applications
- **Core**: Email management, real-time dashboard, Web3 integration
- **Admin**: Analytics, content management, user administration  
- **Marketing**: Static site, blog, NFT storefront

### Desktop Applications (Tauri)
- Cross-platform native apps for Windows, macOS, Linux
- Access to system APIs and file operations

### Terminal Applications (Rust)
- TUI interfaces with ratatui
- Terminal multiplexing and session management
- Language server integration

## Code Quality Standards

### TypeScript Configuration
- Strict mode enabled across all projects
- Consistent formatting with Biome
- Import type enforcement
- Exhaustive dependency checks

### Testing Requirements
- Unit test coverage: 80% minimum
- Integration tests for cross-framework functionality
- E2E tests for critical user flows
- Performance benchmarks for optimization tracking

### Code Style
- 2-space indentation
- Single quotes for JavaScript/TypeScript
- 100-character line width
- Consistent naming conventions across frameworks

## Environment Configuration

### Required Environment Variables
```bash
# Core development
NODE_ENV=development
DENO_ENV=development
CI=false

# Server development  
DATABASE_URL=postgres://localhost:5432/katalyst_dev
CLAUDE_CODE_API_KEY=your_api_key

# Build optimization
TURBO_TOKEN=your_turbo_token
NX_CLOUD_ACCESS_TOKEN=your_nx_token
```

### Development Ports
- Core App: http://localhost:20007
- Admin Dashboard: http://localhost:20008  
- Marketing Site: http://localhost:20009
- Phoenix Server: http://localhost:4000

## Troubleshooting

### Common Issues
1. **NIF Compilation Errors**: Run `mix clean && mix compile` from `/server`
2. **Deno Import Issues**: Check import map in `deno.json`
3. **Build Cache Issues**: Run `make clean-all` for deep clean
4. **Python SDK Missing**: Install with `pip3 install claude-code-sdk`

### Diagnostic Commands
```bash
make doctor                # Comprehensive system check
make status               # Current system status
make check-env           # Verify tool availability
```

This repository leverages cutting-edge web technologies in a unified development experience, optimizing for both developer productivity and runtime performance across multiple platforms.