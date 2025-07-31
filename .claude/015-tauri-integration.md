# Tauri 2.0 Integration - Unified Desktop, Mobile & WebXR Applications

## Overview

Katalyst's Tauri 2.0 integration provides a unified platform for building desktop, mobile, and WebXR applications with a single codebase. This system replaces Vite with RSpack for faster builds and better performance across all platforms, while maintaining the full power of Rust backend with React 19 frontend.

## Key Features

- **Unified Build System** - Single codebase for Desktop, Mobile, and WebXR platforms
- **RSpack Integration** - Fast, optimized builds replacing Vite across all platforms
- **Native Performance** - Rust backend with React 19 frontend for maximum speed
- **Cross-Platform APIs** - Consistent API surface across desktop, mobile, and WebXR
- **Advanced Features** - WebXR support, mobile device APIs, desktop system integration
- **Hot Reloading** - Fast development workflow with instant updates
- **Type Safety** - Full TypeScript integration with Rust bindings
- **Auto Updates** - Built-in updater for seamless application maintenance

## Architecture

### Tauri Integration Stack

```
┌─────────────────────────────────────────────────────────┐
│                 Katalyst Tauri System                  │
├─────────────────────────────────────────────────────────┤
│  Desktop Apps    │  Mobile Apps     │  WebXR Apps      │
│  (Native Window) │  (iOS/Android)   │  (VR/AR)         │
├─────────────────────────────────────────────────────────┤
│  React 19 Frontend (TypeScript + Tailwind CSS)        │
│           RSpack Build System (Replaces Vite)          │
├─────────────────────────────────────────────────────────┤
│  Tauri 2.0 Core │  Platform APIs   │  Device Features │
│  (IPC Bridge)    │  (Camera, GPS)   │  (Haptics, Bio)  │
├─────────────────────────────────────────────────────────┤
│           Rust Backend (High Performance)              │
│   (Tokio, Crossbeam, Rayon, WebAssembly Support)      │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Project Setup

```bash
# Clone and setup
git clone https://github.com/swcstudio/katalyst.git
cd katalyst

# Install dependencies
deno run --allow-all scripts/unified-runner.ts --install
```

### 2. Desktop Development

```bash
# Start desktop development server
deno run --allow-all scripts/tauri-builder.ts --dev --platform desktop

# Build desktop application
deno run --allow-all scripts/tauri-builder.ts --build --platform desktop --mode production --bundle dmg
```

### 3. Mobile Development

```bash
# Start mobile development server
deno run --allow-all scripts/tauri-builder.ts --dev --platform mobile

# Build mobile application
deno run --allow-all scripts/tauri-builder.ts --build --platform mobile --mode production --bundle apk
```

### 4. WebXR Development

```bash
# Start WebXR development server
deno run --allow-all scripts/tauri-builder.ts --dev --platform webxr

# Build WebXR application
deno run --allow-all scripts/tauri-builder.ts --build --platform webxr --mode production
```

## Platform Configuration

### 1. Desktop Configuration

Desktop applications run as native windows with full system integration:

```rust
// src-tauri/src/desktop/mod.rs
pub fn setup_desktop_features(app: AppHandle) -> Result<()> {
    // Initialize window manager
    let window_manager = WindowManager::new(app.clone());
    app.manage(window_manager);
    
    // Setup system integration
    system_integration::setup_system_features(&app)?;
    
    // Initialize screenshot capability
    screenshot::init_screenshot_service(&app)?;
    
    // Setup theme management
    themes::init_theme_system(&app)?;
    
    Ok(())
}
```

**Desktop Features:**
- Native window management
- System tray integration
- Global shortcuts
- File system access
- Native dialogs
- Auto-updater
- Screenshot capabilities
- Theme management

### 2. Mobile Configuration

Mobile applications provide native iOS and Android functionality:

```rust
// src-tauri/src/mobile/mod.rs
pub fn launch_mobile_preview(app: AppHandle) -> Result<()> {
    let window = WindowBuilder::new(&app, "mobile_preview", window_url)
        .title("Katalyst Mobile Preview")
        .inner_size(375.0, 812.0) // iPhone 12 dimensions
        .center()
        .build()?;
    
    setup_mobile_preview_window(&window)?;
    Ok(())
}
```

**Mobile Features:**
- Device information access
- Camera and microphone
- GPS and location services
- Haptic feedback
- Biometric authentication
- Push notifications
- Native navigation
- Device orientation
- Status bar control

### 3. WebXR Configuration

WebXR applications enable immersive VR/AR experiences:

```rust
// src-tauri/src/webxr/mod.rs
pub fn launch_webxr_window(app: AppHandle) -> Result<()> {
    let window = WindowBuilder::new(&app, "webxr", window_url)
        .title("Katalyst WebXR")
        .inner_size(1200.0, 800.0)
        .fullscreen(false)
        .build()?;
    
    setup_webxr_window(&window)?;
    Ok(())
}
```

**WebXR Features:**
- VR/AR session management
- Hand and eye tracking
- Spatial audio
- 3D object rendering
- Multi-user collaboration
- Performance optimization for 90+ FPS
- Cross-platform XR device support

## RSpack Build Configuration

### 1. Unified Configuration

The RSpack configuration replaces Vite and provides optimized builds:

```typescript
// tauri-rsbuild.config.ts
export default defineConfig({
  plugins: [
    pluginReact({
      reactRefreshOptions: { overlay: true },
    }),
    pluginSvgr({
      svgrOptions: {
        exportType: 'default',
        titleProp: true,
        ref: true,
      },
    }),
    pluginTypeCheck({ enable: true }),
  ],
  
  source: {
    entry: {
      index: getEntryForPlatform(platform),
    },
    define: {
      __TAURI_PLATFORM__: JSON.stringify(platform),
      __IS_DESKTOP__: isDesktop,
      __IS_MOBILE__: isMobile,
      __IS_WEBXR__: isWebXR,
    },
  },
  
  output: {
    target: getTargetForPlatform(platform),
    distPath: {
      root: `dist/${platform}`,
    },
  },
});
```

### 2. Platform-Specific Optimization

```typescript
function getMaxChunkSizeForPlatform(platform: string): number {
  switch (platform) {
    case 'mobile':
      return 200000; // 200KB for mobile
    case 'webxr':
      return 500000; // 500KB for WebXR (larger assets)
    default:
      return 244000; // 244KB for desktop
  }
}
```

## API Integration

### 1. Desktop API Usage

```typescript
// Desktop-specific functionality
import { invoke } from '@tauri-apps/api/tauri';

// Window management
const createWindow = async () => {
  await invoke('create_desktop_window', {
    label: 'settings',
    title: 'Settings',
    url: '/settings',
    width: 800,
    height: 600,
  });
};

// System integration
const takeScreenshot = async () => {
  const path = await invoke('capture_screenshot', {
    windowLabel: 'main',
  });
  console.log('Screenshot saved:', path);
};

// Theme management
const setTheme = async (theme: string) => {
  await invoke('set_theme', { theme });
};
```

### 2. Mobile API Usage

```typescript
// Mobile-specific functionality
import { invoke } from '@tauri-apps/api/tauri';

// Device information
const getDeviceInfo = async () => {
  const info = await invoke('get_device_info');
  console.log('Device:', info);
};

// Haptic feedback
const triggerHaptic = async (pattern: string) => {
  await invoke('trigger_haptic_feedback', {
    pattern,
    intensity: 0.8,
  });
};

// Camera access
const openCamera = async () => {
  const result = await invoke('open_camera', {
    cameraType: 'back',
  });
  console.log('Camera opened:', result);
};

// Permissions
const requestPermissions = async () => {
  const permissions = await invoke('request_permissions', {
    permissions: ['camera', 'microphone', 'location'],
  });
  console.log('Permissions:', permissions);
};
```

### 3. WebXR API Usage

```typescript
// WebXR-specific functionality
import { invoke } from '@tauri-apps/api/tauri';

// Initialize WebXR
const initializeXR = async () => {
  const devices = await invoke('initialize_webxr');
  console.log('XR Devices:', devices);
};

// Create XR session
const startXRSession = async (deviceId: string) => {
  const session = await invoke('create_webxr_session', {
    deviceId,
    mode: 'immersive-vr',
  });
  console.log('XR Session:', session);
};

// Toggle XR mode
const toggleXR = async (enable: boolean) => {
  const result = await invoke('toggle_xr_mode', { enable });
  console.log('XR Mode:', result ? 'enabled' : 'disabled');
};
```

## Component Integration

### 1. Platform-Aware Components

```tsx
// Universal component that adapts to platform
import React from 'react';
import { Icon } from '@katalyst/shared';

interface PlatformButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const PlatformButton: React.FC<PlatformButtonProps> = ({ 
  onClick, 
  children 
}) => {
  const platform = window.__TAURI_PLATFORM__;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg transition-colors',
        {
          // Desktop styling
          'hover:bg-gray-100 focus:ring-2': platform === 'desktop',
          // Mobile styling
          'active:bg-gray-200 touch-manipulation': platform === 'mobile',
          // WebXR styling
          'bg-blue-500 text-white hover:bg-blue-600': platform === 'webxr',
        }
      )}
    >
      {children}
      {platform === 'mobile' && (
        <Icon name="arrow-right" size="sm" className="ml-2" />
      )}
    </button>
  );
};
```

### 2. Feature Detection Hook

```tsx
// Hook for platform and feature detection
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface PlatformFeatures {
  platform: 'desktop' | 'mobile' | 'webxr';
  hasCamera: boolean;
  hasGPS: boolean;
  hasHaptics: boolean;
  hasWebXR: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  isWebXR: boolean;
}

export const usePlatformFeatures = (): PlatformFeatures => {
  const [features, setFeatures] = useState<PlatformFeatures>({
    platform: 'desktop',
    hasCamera: false,
    hasGPS: false,
    hasHaptics: false,
    hasWebXR: false,
    isDesktop: true,
    isMobile: false,
    isWebXR: false,
  });

  useEffect(() => {
    const detectFeatures = async () => {
      try {
        const platform = window.__TAURI_PLATFORM__;
        
        let deviceCapabilities = {};
        if (platform === 'mobile') {
          const deviceInfo = await invoke('get_device_info');
          deviceCapabilities = deviceInfo.capabilities;
        } else if (platform === 'webxr') {
          const xrDevices = await invoke('get_xr_devices');
          deviceCapabilities = {
            hasWebXR: xrDevices.length > 0,
          };
        }

        setFeatures({
          platform,
          isDesktop: platform === 'desktop',
          isMobile: platform === 'mobile',
          isWebXR: platform === 'webxr',
          ...deviceCapabilities,
        });
      } catch (error) {
        console.warn('Failed to detect platform features:', error);
      }
    };

    detectFeatures();
  }, []);

  return features;
};
```

### 3. Platform Router

```tsx
// Router that adapts to platform capabilities
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePlatformFeatures } from './hooks/usePlatformFeatures';

// Platform-specific pages
import DesktopDashboard from './pages/DesktopDashboard';
import MobileDashboard from './pages/MobileDashboard';
import WebXRDashboard from './pages/WebXRDashboard';

export const PlatformRouter: React.FC = () => {
  const { platform, isDesktop, isMobile, isWebXR } = usePlatformFeatures();

  return (
    <Routes>
      <Route path="/" element={
        <>
          {isDesktop && <DesktopDashboard />}
          {isMobile && <MobileDashboard />}
          {isWebXR && <WebXRDashboard />}
        </>
      } />
      
      {/* Desktop-specific routes */}
      {isDesktop && (
        <>
          <Route path="/settings" element={<DesktopSettings />} />
          <Route path="/system" element={<SystemInfo />} />
        </>
      )}
      
      {/* Mobile-specific routes */}
      {isMobile && (
        <>
          <Route path="/camera" element={<CameraView />} />
          <Route path="/location" element={<LocationView />} />
        </>
      )}
      
      {/* WebXR-specific routes */}
      {isWebXR && (
        <>
          <Route path="/vr" element={<VRExperience />} />
          <Route path="/ar" element={<ARExperience />} />
        </>
      )}
    </Routes>
  );
};
```

## Build Optimization

### 1. Platform-Specific Bundling

```bash
# Desktop builds with native installers
deno run --allow-all scripts/tauri-builder.ts \
  --build --platform desktop --mode production \
  --bundle dmg --features "desktop,auto-updater"

# Mobile builds with platform packages
deno run --allow-all scripts/tauri-builder.ts \
  --build --platform mobile --mode production \
  --bundle apk --features "mobile,camera,gps"

# WebXR builds with 3D optimizations
deno run --allow-all scripts/tauri-builder.ts \
  --build --platform webxr --mode production \
  --features "webxr,wasm,webgl"
```

### 2. Performance Optimization

```typescript
// Platform-specific optimizations in RSpack config
const getSplitChunksConfig = (platform: string) => {
  return {
    cacheGroups: {
      // Platform-specific vendor chunks
      tauri: {
        test: /[\\/]node_modules[\\/]@tauri-apps[\\/]/,
        name: 'tauri',
        chunks: 'all',
        priority: 25,
      },
      webxr: {
        test: /[\\/]node_modules[\\/](three|@react-three|@webxr)[\\/]/,
        name: 'webxr',
        chunks: 'all',
        priority: 18,
        enforce: platform === 'webxr',
      },
      mobile: {
        test: /[\\/](mobile|capacitor)[\\/]/,
        name: 'mobile',
        chunks: 'all',
        priority: 18,
        enforce: platform === 'mobile',
      },
    },
  };
};
```

## Development Workflow

### 1. Hot Reloading

The development server provides instant updates across all platforms:

```bash
# Start development with hot reloading
deno run --allow-all scripts/tauri-builder.ts --dev --platform desktop

# The server will automatically:
# 1. Start RSpack dev server on http://localhost:20007
# 2. Start Tauri dev process with Rust hot reloading
# 3. Enable React Fast Refresh for instant UI updates
# 4. Watch for file changes and rebuild automatically
```

### 2. Debugging

Debug applications across platforms with integrated tools:

```typescript
// Enable debug mode in development
const debugConfig = {
  rust_log: 'debug',
  console_log: true,
  devtools: true,
  source_maps: true,
};

// Access debugging features
import { invoke } from '@tauri-apps/api/tauri';

const openDevTools = async () => {
  await invoke('open_devtools');
};

const getLogs = async () => {
  const logs = await invoke('get_logs', { lines: 100 });
  console.log('Application logs:', logs);
};
```

### 3. Testing

Test applications across platforms with unified testing:

```typescript
// Platform-aware testing
import { test, expect } from '@playwright/test';

test.describe('Cross-platform functionality', () => {
  test('desktop window management', async ({ page }) => {
    // Test desktop-specific features
    await page.goto('http://localhost:20007');
    await page.click('[data-testid="create-window"]');
    await expect(page.locator('.window-created')).toBeVisible();
  });

  test('mobile touch interactions', async ({ page }) => {
    // Test mobile-specific features
    await page.goto('http://localhost:20010');
    await page.tap('[data-testid="mobile-button"]');
    await expect(page.locator('.haptic-triggered')).toBeVisible();
  });

  test('webxr initialization', async ({ page }) => {
    // Test WebXR-specific features
    await page.goto('http://localhost:20011');
    await page.click('[data-testid="init-xr"]');
    await expect(page.locator('.xr-ready')).toBeVisible();
  });
});
```

## Deployment

### 1. Desktop Deployment

```bash
# Build and package desktop applications
deno run --allow-all scripts/tauri-builder.ts \
  --build --platform desktop --mode production

# Available bundle types:
# --bundle dmg     # macOS disk image
# --bundle app     # macOS application bundle
# --bundle deb     # Debian package
# --bundle appimage # Linux AppImage
# --bundle msi     # Windows installer
# --bundle nsis    # Windows NSIS installer
```

### 2. Mobile Deployment

```bash
# Build mobile applications
deno run --allow-all scripts/tauri-builder.ts \
  --build --platform mobile --mode production

# iOS deployment
# --bundle ios     # iOS application bundle
# --target aarch64-apple-ios

# Android deployment
# --bundle apk     # Android APK
# --bundle aab     # Android App Bundle
# --target aarch64-linux-android
```

### 3. WebXR Deployment

```bash
# Build WebXR applications
deno run --allow-all scripts/tauri-builder.ts \
  --build --platform webxr --mode production

# Deploy to web servers with WebXR support
# Requires HTTPS for WebXR API access
# Optimize for VR/AR performance requirements
```

## Advanced Features

### 1. Auto Updates

Desktop applications support automatic updates:

```rust
// Auto-updater setup in main.rs
#[cfg(not(debug_assertions))]
{
    let handle = app.handle();
    tauri::async_runtime::spawn(async move {
        if let Err(e) = update::check_for_updates(handle).await {
            eprintln!("Failed to check for updates: {}", e);
        }
    });
}
```

### 2. System Integration

```typescript
// System tray and global shortcuts
import { invoke } from '@tauri-apps/api/tauri';

// Register global shortcuts
const registerShortcuts = async () => {
  // Cmd/Ctrl+Shift+K to toggle main window
  // Cmd/Ctrl+Shift+X to launch WebXR mode
  // Cmd/Ctrl+Shift+I to open developer tools
  // Cmd/Ctrl+Shift+S to take screenshot
  
  console.log('Global shortcuts registered');
};
```

### 3. Performance Monitoring

```typescript
// Built-in performance monitoring
import { invoke } from '@tauri-apps/api/tauri';

const getSystemInfo = async () => {
  const info = await invoke('get_system_info');
  console.log('System performance:', {
    cpu_count: info.cpu_count,
    total_memory: info.total_memory,
    available_memory: info.available_memory,
  });
};
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Rust toolchain
   rustup update
   cargo --version
   
   # Clean build cache
   cargo clean
   rm -rf dist/
   ```

2. **Platform Detection Issues**
   ```typescript
   // Ensure platform constants are defined
   console.log('Platform:', window.__TAURI_PLATFORM__);
   console.log('Is Desktop:', window.__IS_DESKTOP__);
   console.log('Is Mobile:', window.__IS_MOBILE__);
   console.log('Is WebXR:', window.__IS_WEBXR__);
   ```

3. **Permission Issues**
   ```bash
   # Mobile permissions
   # Ensure permissions are declared in Cargo.toml
   # Request permissions at runtime
   
   # Desktop permissions
   # Check tauri.conf.json allowlist
   # Verify file system access scope
   ```

4. **WebXR Issues**
   ```typescript
   // Check WebXR support
   if ('xr' in navigator) {
     console.log('WebXR supported');
   } else {
     console.warn('WebXR not supported');
   }
   ```

## API Reference

### Build Commands

```bash
# Development
tauri-builder --dev --platform <platform>

# Production builds
tauri-builder --build --platform <platform> --mode production --bundle <type>

# Available platforms: desktop, mobile, webxr
# Available bundles: app, dmg, deb, appimage, msi, nsis, apk, aab, ios
```

### Tauri Commands

```typescript
// Desktop commands
await invoke('create_desktop_window', { label, title, url, width, height });
await invoke('toggle_always_on_top');
await invoke('set_window_transparency', { transparency: 0.8 });
await invoke('capture_screenshot', { windowLabel: 'main' });
await invoke('set_theme', { theme: 'dark' });

// Mobile commands
await invoke('get_device_info');
await invoke('trigger_haptic_feedback', { pattern: 'light', intensity: 0.5 });
await invoke('request_permissions', { permissions: ['camera'] });
await invoke('open_camera', { cameraType: 'back' });

// WebXR commands
await invoke('initialize_webxr');
await invoke('create_webxr_session', { deviceId, mode: 'immersive-vr' });
await invoke('get_xr_devices');
await invoke('toggle_xr_mode', { enable: true });

// General commands
await invoke('get_app_info');
await invoke('get_system_info');
await invoke('read_config_file', { filePath: 'settings.json' });
await invoke('write_config_file', { filePath: 'settings.json', content });
```

### Configuration Options

```typescript
interface TauriConfig {
  platform: 'desktop' | 'mobile' | 'webxr';
  mode: 'development' | 'production';
  features: string[];
  target?: string;
  bundleType?: 'app' | 'dmg' | 'deb' | 'apk' | 'aab';
  windowConfig?: {
    width: number;
    height: number;
    resizable: boolean;
    fullscreen: boolean;
    transparent: boolean;
  };
}
```

## Support & Resources

- **Tauri Documentation**: https://tauri.app/
- **RSpack Documentation**: https://rspack.dev/
- **WebXR Specification**: https://immersive-web.github.io/webxr/
- **Mobile Development**: Platform-specific setup guides
- **Performance Optimization**: Built-in monitoring and profiling tools

---

**Note**: Tauri 2.0 integration is production-ready and provides a unified platform for building cross-platform applications with native performance and modern web technologies. The system replaces Vite with RSpack for faster builds and better optimization across desktop, mobile, and WebXR platforms.

---

*Built for the future of cross-platform development*