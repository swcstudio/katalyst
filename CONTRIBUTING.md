# Contributing to Katalyst-React Framework

Thank you for your interest in contributing to Katalyst! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Getting Started

Katalyst is a React 19 Framework with 24 State-of-the-Art integrations, designed as a micro-frontend platform with three variants:

- **Core**: Pure React 19 web application
- **Remix**: Admin dashboard with data-heavy features
- **Next.js**: Marketing website with SSG/SSR

### Prerequisites

- Node.js 18+ 
- Deno 2.0+
- Git
- VS Code or Zed (recommended)

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/swcstudio/sse.git
   cd sse/katalyst
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Deno (if not already installed)**
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   export PATH="$HOME/.deno/bin:$PATH"
   ```

4. **Start development servers**
   ```bash
   # Start all variants
   npm run dev
   
   # Or start individual variants
   npm run dev:core     # http://localhost:3000
   npm run dev:remix    # http://localhost:3001
   npm run dev:nextjs   # http://localhost:3002
   ```

## Project Structure

```
katalyst/
├── core/                 # React 19 Core variant
├── remix/               # Remix admin dashboard variant
├── nextjs/              # Next.js marketing variant
├── shared/              # Shared components and utilities
│   ├── src/
│   │   ├── components/  # Shared React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── integrations/ # 24 technology integrations
│   │   ├── plugins/     # Build plugins
│   │   ├── stores/      # Zustand state management
│   │   └── utils/       # Utility functions
├── tests/               # Test files
├── .storybook/          # Storybook configuration
└── docs/                # Documentation
```

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/integration-name` - New integrations
- `fix/issue-description` - Bug fixes
- `docs/section-name` - Documentation updates
- `refactor/component-name` - Code refactoring

### Commit Messages

Follow conventional commits:
```
type(scope): description

feat(emp): add micro-frontend module federation
fix(stylex): resolve CSS-in-JS compilation issue
docs(readme): update installation instructions
```

### Integration Development

When adding new integrations:

1. **Create integration file**
   ```bash
   touch shared/src/integrations/new-integration.ts
   ```

2. **Implement integration interface**
   ```typescript
   export interface NewIntegrationConfig {
     // Configuration options
   }
   
   export class NewIntegration {
     // Implementation
   }
   ```

3. **Add to integration factory**
   ```typescript
   // shared/src/factory/integration-factory.ts
   import { NewIntegration } from '../integrations/new-integration';
   ```

4. **Update plugin system**
   ```typescript
   // shared/src/plugins/katalyst-plugins.ts
   ```

5. **Add tests**
   ```bash
   touch tests/unit/integrations/new-integration.test.ts
   ```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations for function parameters and return types
- Avoid `any` type - use `unknown` or proper typing

### React

- Use functional components with hooks
- Prefer composition over inheritance
- Use proper prop types and default values
- Implement proper error boundaries

### Styling

- Use Tailwind CSS 4.0 for styling
- Follow mobile-first responsive design
- Use StyleX for component-specific styles
- Maintain consistent design tokens

### File Organization

- Use kebab-case for file names
- Group related files in directories
- Export from index files for clean imports
- Keep components small and focused

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run Playwright tests
npm run test:e2e

# Run tests in headed mode
npm run test:e2e:headed
```

### Component Testing

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

### Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test edge cases and error conditions
- Mock external dependencies

## Submitting Changes

### Pull Request Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. **Run quality checks**
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Fill out PR template**
   - Describe changes made
   - Link related issues
   - Add screenshots for UI changes
   - Confirm all checks pass

### PR Requirements

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered

## Release Process

### Version Management

We follow semantic versioning (SemVer):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

### Release Steps

1. **Update version**
   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG.md**
   - Document all changes
   - Follow Keep a Changelog format

3. **Create release PR**
   - Include version bump
   - Update documentation

4. **Deploy after merge**
   - Automatic deployment via CI/CD
   - Monitor deployment status

## Integration-Specific Guidelines

### TanStack Ecosystem
- Use TanStack Router for routing
- Implement proper data fetching with TanStack Query
- Follow TanStack Form patterns for forms

### Micro-Frontend (EMP)
- Maintain module federation compatibility
- Test cross-application communication
- Document exposed modules

### Web3 (Cosmos/evmOS)
- Handle wallet connections gracefully
- Implement proper error handling for blockchain operations
- Test with testnet before mainnet

### Performance
- Monitor bundle sizes
- Implement proper code splitting
- Use RSpack optimizations

## Getting Help

- **Documentation**: Check the docs/ directory
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our development Discord server

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing to Katalyst, you agree that your contributions will be licensed under the MIT License.
