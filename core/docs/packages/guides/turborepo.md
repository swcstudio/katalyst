# Turborepo Configuration

Katalyst uses Turborepo for efficient package management and caching.

## Configuration

See `turbo.json` in the repository root for the complete configuration.

## Common Commands

```bash
# Build all packages
turbo run build

# Build specific package
turbo run build --filter=@katalyst/ai

# Run tests
turbo run test

# Clean cache
turbo run clean
```

## Caching

Turborepo caches build outputs for faster subsequent builds.
