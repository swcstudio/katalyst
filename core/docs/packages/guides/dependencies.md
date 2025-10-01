# Package Dependencies

Understanding package dependencies in the Katalyst monorepo.

## Dependency Graph

```
core → design-system → hooks
api → core
ai → core + multithreading
pwa → core + design-system
```

## Managing Dependencies

All packages use workspace dependencies:

```json
{
  "dependencies": {
    "@katalyst/core": "workspace:*"
  }
}
```

## See Also

- [Architecture Overview](../README.md#architecture-principles)
