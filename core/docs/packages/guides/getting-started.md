# Getting Started with Packages

This guide will help you get started with Katalyst's Turborepo packages.

## Prerequisites

- Node.js 20+
- Deno (recommended) or Bun
- Git

## Installation

The packages are already available in the Katalyst monorepo:

```bash
# Clone the repository
git clone https://github.com/swcstudio/katalyst.git
cd katalyst

# Install dependencies
make install

# Build all packages
make build
```

## Using a Package

Import any package directly:

```typescript
import { useKatalyst } from '@katalyst/hooks';
import { Button } from '@katalyst/core';
import { threadController } from '@katalyst/multithreading';
```

## Next Steps

- Explore [Package Documentation](../README.md)
- Check [Examples](https://github.com/swcstudio/katalyst/tree/main/examples)
- Read [Best Practices](#best-practices)
