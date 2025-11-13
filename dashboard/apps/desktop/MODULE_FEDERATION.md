# Module Federation Configuration for Katalyst Desktop

This document outlines the Module Federation setup for the Katalyst desktop application, enabling micro-frontend architecture.

## Configuration Overview

### RSBuild Configuration (`rsbuild.config.ts`)

The desktop application is configured as a Module Federation host with the following key settings:

- **Name**: `katalyst_desktop`
- **Remote Entry**: `remoteEntry.js`
- **Port**: 3000 (default)

### Exposed Modules

The desktop application exposes the following components and modules for consumption by other micro-frontends:

```typescript
exposes: {
  './DesktopApp': './src/federation-entry.ts',      // Main app entry point
  './DesktopLayout': './src/components/DesktopLayout',
  './Header': './src/components/Header',
  './Sidebar': './src/components/Sidebar',
  './components': './src/components',              // All components
  './providers/TauriProvider': './src/providers/TauriProvider',
  './routes': './src/routes',
  './App': './src/federation-entry.ts',
}
```

### Shared Dependencies

Key dependencies are configured as singletons to ensure consistent versions across the federation:

#### React Ecosystem
- `react` (^19.0.0)
- `react-dom` (^19.0.0)

#### State Management & Routing
- `@tanstack/react-query` (^5.0.0)
- `@tanstack/react-router` (^1.0.0)
- `zustand` (^5.0.0)

#### Katalyst Core Packages
- `@katalyst/core`
- `@katalyst/hooks`
- `@katalyst/design-system`
- `@katalyst/api`
- `@katalyst/ai`

#### UI & Utilities
- `@tauri-apps/api` (^2.0.0)
- `lucide-react` (^0.400.0)
- `clsx` (^2.0.0)
- `tailwind-merge` (^2.0.0)
- `sonner` (^1.5.0)

### Remote Applications

The desktop app can consume remote micro-frontends:

```typescript
remotes: {
  katalyst_admin: 'katalyst_admin@http://localhost:3001/remoteEntry.js',
  katalyst_components: 'katalyst_components@http://localhost:3002/remoteEntry.js',
}
```

## Usage Examples

### Consuming Desktop Components in Other Apps

```typescript
// Import desktop layout in another micro-frontend
const DesktopLayout = React.lazy(() => import('katalyst_desktop/DesktopLayout'));

function AdminApp() {
  return (
    <DesktopLayout>
      {/* Your admin content */}
    </DesktopLayout>
  );
}
```

### Loading Remote Modules Dynamically

```typescript
import { loadRemoteModule } from './federation-entry';

// Load a remote component dynamically
const loadRemoteComponent = async () => {
  try {
    const RemoteComponent = await loadRemoteComponent('katalyst_admin', './Dashboard');
    return RemoteComponent;
  } catch (error) {
    console.error('Failed to load remote component:', error);
  }
};
```

## Development Workflow

### Running the Desktop App in Federation Mode

1. **Start the desktop application**:
   ```bash
   npm run dev:web
   ```

2. **The app will be available at**: `http://localhost:3000`
3. **Remote entry file**: `http://localhost:3000/remoteEntry.js`

### Integration with Other Micro-Frontends

Other applications in the Katalyst ecosystem can consume desktop components by configuring their Module Federation remotes:

```typescript
// In another app's rsbuild.config.ts
moduleFederation: {
  options: {
    name: 'katalyst_admin',
    remotes: {
      katalyst_desktop: 'katalyst_desktop@http://localhost:3000/remoteEntry.js',
    },
    shared: {
      // Shared dependencies configuration
    },
  },
}
```

## Benefits of This Setup

1. **Independent Development**: Teams can develop and deploy components independently
2. **Shared Dependencies**: Reduces bundle size by sharing common dependencies
3. **Runtime Integration**: Components can be loaded and integrated at runtime
4. **Type Safety**: TypeScript support across federation boundaries
5. **Hot Module Replacement**: Works seamlessly in development mode
6. **Tauri Integration**: Maintains native desktop functionality while enabling federation

## Testing Federation

To test the federation setup:

1. Start the desktop app: `npm run dev:web`
2. Start a remote app (e.g., admin): `npm run dev:web` in the admin directory
3. Verify that components can be imported and used across applications
4. Check browser console for any federation-related errors

## Troubleshooting

### Common Issues

1. **Version Conflicts**: Ensure shared dependencies have compatible versions
2. **Import Errors**: Verify remote entry URLs are accessible
3. **Type Errors**: Check that TypeScript types are properly exported
4. **Build Failures**: Ensure all exposed modules have valid exports

### Debug Tools

- Browser DevTools Network tab to check remote entry loading
- Console logs for federation bootstrap/mount/unmount events
- React DevTools for component hierarchy inspection

This Module Federation configuration enables a scalable micro-frontend architecture while maintaining the desktop-specific features of the Katalyst application.
