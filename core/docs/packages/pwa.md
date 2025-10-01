# @katalyst/pwa

Progressive Web App features with service workers, offline support, and app manifest.

## Overview

The `@katalyst/pwa` package provides everything needed to build Progressive Web Apps with offline capabilities, push notifications, and installability.

### Key Features

- 📱 **Installable** - Add to home screen
- 🔄 **Service Workers** - Offline functionality
- 📦 **Workbox Integration** - Advanced caching strategies
- 🔔 **Push Notifications** - Web push support
- 🎨 **App Manifest** - PWA configuration
- 🚀 **Performance** - Optimized loading
- 📴 **Offline Support** - Full offline functionality

## Installation

```typescript
import { registerServiceWorker } from '@katalyst/pwa';
```

## Quick Start

```typescript
import { registerServiceWorker } from '@katalyst/pwa';

// Register service worker
registerServiceWorker({
  onUpdate: (registration) => {
    console.log('New version available');
  },
  onSuccess: (registration) => {
    console.log('Service worker registered');
  }
});
```

## Service Workers

### Basic Service Worker

```typescript
import { Workbox } from '@katalyst/pwa';

const wb = new Workbox('/sw.js');

wb.addEventListener('installed', (event) => {
  if (event.isUpdate) {
    // Show update notification
  }
});

wb.register();
```

### Caching Strategies

```typescript
import { 
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate 
} from '@katalyst/pwa';

// Cache first (for assets)
new CacheFirst({
  cacheName: 'assets',
  plugins: [new ExpirationPlugin({ maxEntries: 50 })]
});

// Network first (for API)
new NetworkFirst({
  cacheName: 'api',
  networkTimeoutSeconds: 3
});

// Stale while revalidate (for pages)
new StaleWhileRevalidate({
  cacheName: 'pages'
});
```

## App Manifest

```typescript
import { generateManifest } from '@katalyst/pwa';

const manifest = generateManifest({
  name: 'My App',
  shortName: 'App',
  description: 'My awesome PWA',
  themeColor: '#000000',
  backgroundColor: '#ffffff',
  icons: [
    { src: '/icon-192.png', sizes: '192x192' },
    { src: '/icon-512.png', sizes: '512x512' }
  ]
});
```

## Push Notifications

```typescript
import { requestNotificationPermission, subscribeUser } from '@katalyst/pwa';

// Request permission
const permission = await requestNotificationPermission();

if (permission === 'granted') {
  // Subscribe to push
  const subscription = await subscribeUser();
  // Send subscription to server
}
```

## Offline Support

```typescript
import { precacheAssets, handleOffline } from '@katalyst/pwa';

// Precache critical assets
precacheAssets([
  '/',
  '/offline.html',
  '/styles.css',
  '/app.js'
]);

// Handle offline
handleOffline({
  fallbackPage: '/offline.html'
});
```

## Best Practices

1. **Cache strategically** - Different strategies for different resources
2. **Precache critical assets** - Ensure offline functionality
3. **Handle updates** - Notify users of new versions
4. **Test offline** - Test all offline scenarios
5. **Optimize assets** - Minimize cache size
6. **Monitor performance** - Track PWA metrics

## Related Documentation

- [Build System](./build-system.md) - PWA build configuration
- [Core](./core.md) - PWA components

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Status**: Production Ready
