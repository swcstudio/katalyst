# Getting Started with Katalyst-React

## System Requirements

### Minimum Requirements
- **OS**: macOS 12+, Linux (Ubuntu 20.04+), Windows 10+ with WSL2
- **Node.js**: 20.0.0 or higher (via nvm recommended)
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Storage**: 2GB free space for dependencies and build cache
- **CPU**: 4 cores minimum, 8+ cores recommended for optimal performance

### Required Tools
- **Git**: For version control
- **Rust**: Latest stable (for native modules)
- **Make**: For running build commands
- **Docker**: Optional, for containerized development

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/swcstudio/katalyst-react.git
cd katalyst-react
```

### 2. Install Node.js via nvm
```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

### 3. Install Rust Toolchain
```bash
# Install Rust via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add to PATH
source $HOME/.cargo/env

# Verify installation
rustc --version
cargo --version
```

### 4. Install Package Managers

#### Option A: Deno (Recommended)
```bash
# macOS/Linux
curl -fsSL https://deno.land/x/install/install.sh | sh

# Add to PATH
export DENO_INSTALL="$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
```

#### Option B: Bun (Alternative)
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### 5. Install Dependencies
```bash
# Using Make (recommended)
make install

# Or manually
deno install
# or
bun install
```

### 6. Build Native Modules
```bash
# Build the Rust multithreading module
make build-native

# This compiles the native module in shared/src/native/
```

## Project Structure

### Understanding the Monorepo
```
katalyst-react/
├── .claude/              # Documentation
├── .github/              # GitHub workflows
├── .nx/                  # NX cache and metadata
├── build/                # Build outputs
├── core/                 # Katalyst-Core (Vanilla React 19)
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   └── package.json      # Dependencies
├── next/                 # Next.js integration
│   ├── src/
│   │   ├── app/          # App directory (Next.js 15)
│   │   └── components/   # Next-specific components
│   └── package.json
├── remix/                # Remix integration
│   ├── app/              # Remix app directory
│   └── package.json
├── shared/               # Shared libraries
│   ├── src/
│   │   ├── components/   # Shared React components
│   │   ├── design-system/# Token-based theming
│   │   ├── hooks/        # Shared React hooks
│   │   ├── native/       # Rust multithreading module
│   │   └── stores/       # State management
│   └── package.json
├── scripts/              # Build and utility scripts
├── tests/                # Test suites
├── Makefile              # Command interface
├── nx.json               # NX configuration
├── turbo.json            # Turborepo configuration
└── deno.json             # Deno configuration
```

## Development Workflow

### 1. Start Development Servers
```bash
# Start all frameworks in development mode
make dev

# Or start individually
make dev-core   # http://localhost:20007
make dev-remix  # http://localhost:20008
make dev-next   # http://localhost:20009
```

### 2. Running Tests
```bash
# Run all tests
make test

# Run specific test suites
make test-unit         # Unit tests
make test-integration  # Integration tests
make test-e2e          # End-to-end tests
make test-performance  # Performance benchmarks
```

### 3. Building for Production
```bash
# Build all frameworks
make build

# Build individually
make build-core
make build-remix
make build-next

# Build with profiling
make build-profile
```

### 4. Type Checking and Linting
```bash
# Run type checking
make typecheck

# Run linting
make lint

# Fix linting issues
make lint-fix

# Format code
make format
```

## Configuration

### Environment Variables
Create `.env.local` files in each framework directory:

```bash
# core/.env.local
VITE_API_URL=http://localhost:3000
VITE_ENABLE_MULTITHREADING=true
VITE_WORKER_POOL_SIZE=4

# next/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# remix/.env.local
REMIX_API_URL=http://localhost:3000
REMIX_SESSION_SECRET=your-secret-key
```

### Build Configuration

#### RSpack Configuration
Each framework uses RSpack for bundling. Configuration files:
- `core/rsbuild.config.ts`
- `next/rsbuild.config.ts`
- `remix/rsbuild.config.ts`

#### TypeScript Configuration
- Root `tsconfig.json` for shared configuration
- Framework-specific configs extend the root

### Design System Tokens
Configure design tokens in `shared/src/design-system/tokens.ts`:
```typescript
export const tokens = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    // Add your colors
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    // Add your spacing
  },
  // Add more token categories
};
```

## Common Tasks

### Creating a New Component
```bash
# Use the component generator
make generate-component name=MyComponent framework=shared

# This creates:
# - shared/src/components/MyComponent.tsx
# - shared/src/components/MyComponent.test.tsx
# - shared/src/components/MyComponent.stories.tsx
```

### Adding a New Route

#### In Core (TanStack Router)
```typescript
// core/src/routes/my-route.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-route')({
  component: MyRouteComponent,
});
```

#### In Next.js
```typescript
// next/src/app/my-route/page.tsx
export default function MyRoutePage() {
  return <div>My Route</div>;
}
```

#### In Remix
```typescript
// remix/app/routes/my-route.tsx
export default function MyRoute() {
  return <div>My Route</div>;
}
```

### Using Multithreading
```typescript
import { MultithreadingManager } from '@katalyst/native';

const manager = new MultithreadingManager();
await manager.initializeRayon({ numThreads: 4 });

// Use parallel processing
const result = await manager.parallelMap(data, (item) => {
  // CPU-intensive operation
  return processItem(item);
});
```

## Troubleshooting

### Common Issues

#### 1. Native Module Build Fails
```bash
# Clean and rebuild
make clean-native
make build-native

# Check Rust toolchain
rustup update
```

#### 2. Port Already in Use
```bash
# Find and kill process
lsof -ti:20007 | xargs kill -9

# Or use different ports
PORT=3000 make dev-core
```

#### 3. Memory Issues During Build
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=8192"
make build
```

#### 4. Type Errors After Update
```bash
# Clear caches and reinstall
make clean
make install
make typecheck
```

### Getting Help

1. Check the [documentation](./)
2. Search [existing issues](https://github.com/swcstudio/katalyst-react/issues)
3. Join our [Discord community](https://discord.gg/katalyst)
4. Create a [new issue](https://github.com/swcstudio/katalyst-react/issues/new)

## Next Steps

- [003-core-framework.md](./003-core-framework.md) - Deep dive into Katalyst-Core
- [004-shared-components.md](./004-shared-components.md) - Using shared components
- [005-multithreading.md](./005-multithreading.md) - Advanced multithreading
- [006-build-system.md](./006-build-system.md) - Build system internals