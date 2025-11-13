# admin.ts

> Source: `src/admin.ts`

**Package:** `@katalyst/kitchen-sink`

## Overview

This module is part of the `@katalyst/kitchen-sink` package.

## Exports

### `ADMIN_VERSION`

<!-- TODO: Add detailed documentation for ADMIN_VERSION -->

## Source Code

```typescript
// Admin dashboard exports
export { default as AdminDashboard } from '../../apps/admin/app/routes/_index';
export * from '../../apps/admin/app/components/ApplicationList';
export * from '../../apps/admin/app/components/SystemLogs';
export * from '../../apps/admin/app/components/DashboardContent';
export { default as AdminLayout } from '../../apps/admin/app/components/AdminLayout';

// Admin specific exports
export const ADMIN_VERSION = '1.0.0';

```

---

*Generated documentation for @katalyst/kitchen-sink*
