# Troubleshooting

Common issues and solutions for Katalyst packages.

## Build Issues

### TypeScript Errors

Ensure you're using TypeScript 5.3+:

```bash
npm install -D typescript@^5.3
```

### Module Resolution

Check your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "paths": {
      "@katalyst/*": ["./packages/*/src"]
    }
  }
}
```

## Runtime Issues

### Package Not Found

Ensure the package is installed:

```bash
make install
```

### Build Failures

Clean and rebuild:

```bash
make clean
make build
```

## Getting Help

1. Check package-specific troubleshooting sections
2. Search [GitHub Issues](https://github.com/swcstudio/katalyst/issues)
3. Open a new issue with details
4. Join our Discord community
