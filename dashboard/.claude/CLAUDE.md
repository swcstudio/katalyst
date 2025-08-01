# Katalyst Mobile Development Guide

## Overview

Katalyst provides a comprehensive mobile app development system using RSpeedy (Lynx) framework for deploying native iOS and Android applications from your React codebase. This system is specifically designed for the **Core** framework and provides equal opportunity deployment to both mobile platforms.

## Quick Start

### 1. Initialize Mobile Development

```bash
# Install dependencies
npm install @katalyst/mobile @katalyst/rspeedy

# Initialize mobile project
npx katalyst mobile init --platform both --name "My Katalyst App"
```

### 2. Basic Mobile App Setup

```tsx
// src/App.mobile.tsx
import React from 'react';
import { 
  SafeAreaView, 
  TouchableOpacity, 
  useRspeedy,
  Platform,
  AceternityCard 
} from '@katalyst/shared';

export default function App() {
  const { initialize, currentPlatform } = useRspeedy();
  
  React.useEffect(() => {
    initialize({
      platform: 'both',
      bundleId: 'com.yourcompany.katalyst',
      appName: 'Katalyst App',
      version: '1.0.0',
      features: {
        nativeNavigation: true,
        biometricAuth: true,
        pushNotifications: true,
      }
    });
  }, []);

  return (
    <SafeAreaView>
      <AceternityCard variant="glass" className="m-4">
        <h1>Welcome to Katalyst Mobile</h1>
        <p>Running on: {currentPlatform}</p>
        
        <TouchableOpacity
          onPress={() => console.log('Native button pressed!')}
          hapticFeedback="medium"
        >
          <AceternityButton variant="shimmer">
            Native Button with Haptics
          </AceternityButton>
        </TouchableOpacity>
      </AceternityCard>
    </SafeAreaView>
  );
}
```

## Mobile System Architecture

### Core Components

1. **RSpeedy Integration** (`/shared/src/integrations/rspeedy.ts`)
   - Native iOS and Android app generation
   - High-performance Rust backend
   - Unified build system

2. **Mobile Components** (`/shared/src/mobile/components/`)
   - SafeAreaView - Handle notches and system UI
   - TouchableOpacity - Native touch interactions
   - HapticFeedback - Tactile feedback system
   - 20+ mobile-optimized components

3. **Build System** (`/shared/src/mobile/build-system/`)
   - Cross-platform build configuration
   - Code signing and packaging
   - App store deployment automation

4. **Native Bridge** (`/shared/src/mobile/bridge/`)
   - JavaScript ↔ Native communication
   - Native module registration
   - Platform-specific API access

## Platform Support

### iOS Requirements
- Xcode 14+ 
- iOS 14.0+ deployment target
- Apple Developer account for device testing
- Valid signing certificates

### Android Requirements
- Android Studio
- Android SDK 24+ (Android 7.0+)
- Java 11+
- Android signing keystore

## Build Commands

### Development Builds

```bash
# iOS Simulator
npx katalyst mobile build --platform ios --target simulator --mode debug

# Android Emulator  
npx katalyst mobile build --platform android --target emulator --mode debug

# Physical Device (requires certificates/keystore)
npx katalyst mobile build --platform ios --target device --mode debug
npx katalyst mobile build --platform android --target device --mode debug
```

### Production Builds

```bash
# iOS App Store
npx katalyst mobile build --platform ios --mode release --optimize size
npx katalyst mobile deploy --platform ios --target appstore

# Google Play Store
npx katalyst mobile build --platform android --mode release --format aab
npx katalyst mobile deploy --platform android --target playstore
```

### Development Workflow

```bash
# Start development server with hot reload
npx katalyst mobile dev --platform ios --device "iPhone 14 Simulator"

# Connect to physical device
npx katalyst mobile connect --device-id "your-device-uuid"

# Hot reload current session
npx katalyst mobile reload
```

## Mobile-Specific Features

### Native Navigation
```tsx
import { useNavigation, NavigationContainer } from '@katalyst/mobile';

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Device Capabilities
```tsx
import { Platform, Device, Permissions } from '@katalyst/mobile';

function CameraFeature() {
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    const requestCameraPermission = async () => {
      const granted = await Permissions.request('camera');
      setHasPermission(granted);
    };
    
    requestCameraPermission();
  }, []);
  
  if (!hasPermission) {
    return <Text>Camera permission required</Text>;
  }
  
  return (
    <CameraView
      style={{ flex: 1 }}
      onCapture={(photo) => {
        // Handle photo capture
      }}
    />
  );
}
```

### Native Module Integration
```tsx
import { useRspeedy } from '@katalyst/shared';

function NativeFeature() {
  const { bridgeToNative, registerNativeModule } = useRspeedy();
  
  const callNativeFunction = async () => {
    const result = await bridgeToNative('CustomModule', 'doSomething', {
      param1: 'value1',
      param2: 42
    });
    
    console.log('Native result:', result);
  };
  
  return (
    <TouchableOpacity onPress={callNativeFunction}>
      <Text>Call Native Function</Text>
    </TouchableOpacity>
  );
}
```

## Performance Optimization

### Bundle Optimization
```javascript
// katalyst.mobile.config.js
export default {
  optimization: {
    bundleSize: true,        // Minimize bundle size
    startupTime: true,       // Optimize app startup
    memoryUsage: true,       // Reduce memory footprint
  },
  
  build: {
    minify: true,
    treeshake: true,
    compress: true,
    sourceMaps: false,       // Disable in production
  },
  
  runtime: {
    jsEngine: 'hermes',      // Use Hermes for Android
    enableMultithreading: true,
    enableWASM: true,
  }
};
```

### Native Performance
```tsx
import { useMultithreading } from '@katalyst/shared';

function PerformantComponent() {
  const { runInBackground } = useMultithreading();
  
  const processLargeDataset = async (data) => {
    // Offload heavy computation to background thread
    const result = await runInBackground(() => {
      return data.map(item => complexProcessing(item));
    });
    
    return result;
  };
}
```

## App Store Deployment

### iOS App Store
```bash
# Build for distribution
npx katalyst mobile build --platform ios --mode release --signing distribution

# Upload to App Store Connect
npx katalyst mobile deploy --platform ios --target appstore \
  --apple-id "your-apple-id" \
  --app-password "app-specific-password" \
  --team-id "TEAM123456"
```

### Google Play Store
```bash
# Build Android App Bundle
npx katalyst mobile build --platform android --mode release --format aab

# Deploy to Play Console
npx katalyst mobile deploy --platform android --target playstore \
  --service-account "path/to/service-account.json" \
  --track "internal"  # or "alpha", "beta", "production"
```

## Testing & Debugging

### Device Testing
```bash
# List connected devices
npx katalyst mobile devices

# Install on specific device
npx katalyst mobile install --device-id "iPhone-123" --build-path "./build/ios/App.ipa"

# View device logs
npx katalyst mobile logs --device-id "iPhone-123" --follow
```

### Performance Profiling
```bash
# Enable performance profiling
npx katalyst mobile profile --platform ios --metrics all

# Generate performance report
npx katalyst mobile report --format html --output "./performance-report.html"
```

## Common Issues & Solutions

### iOS Code Signing
```bash
# List available certificates
security find-identity -v -p codesigning

# Import certificate
security import certificate.p12 -k ~/Library/Keychains/login.keychain

# Update provisioning profiles
npx katalyst mobile certificates --update
```

### Android Keystore
```bash
# Generate debug keystore
keytool -genkey -v -keystore debug.keystore -alias androiddebugkey \
  -keyalg RSA -keysize 2048 -validity 10000

# Sign APK manually
npx katalyst mobile sign --keystore path/to/keystore --alias key-alias
```

### Build Failures
1. **Clean build cache**: `npx katalyst mobile clean`
2. **Update dependencies**: `npm update @katalyst/mobile`
3. **Check platform tools**: `npx katalyst mobile doctor`
4. **Reset Metro cache**: `npx katalyst mobile reset-cache`

## Configuration Files

### Mobile App Configuration
```javascript
// katalyst.mobile.config.js
export default {
  app: {
    name: 'Katalyst Mobile',
    bundleId: 'com.yourcompany.katalyst',
    version: '1.0.0',
    icon: './assets/icon.png',
    splashScreen: './assets/splash.png',
  },
  
  platforms: {
    ios: {
      deploymentTarget: '14.0',
      teamId: 'TEAM123456',
      certificateType: 'development',
    },
    
    android: {
      minSdkVersion: 24,
      targetSdkVersion: 34,
      packageName: 'com.yourcompany.katalyst',
    }
  },
  
  features: {
    nativeNavigation: true,
    biometricAuth: true,
    pushNotifications: true,
    backgroundTasks: true,
    offlineMode: true,
  },
  
  build: {
    optimization: 'size',  // 'size', 'speed', or 'balanced'
    sourceMaps: false,
    minify: true,
  }
};
```

## Best Practices

### 1. Platform-Specific Code
```tsx
import { Platform } from '@katalyst/mobile';

const styles = Platform.select({
  ios: { fontSize: 16, fontFamily: 'San Francisco' },
  android: { fontSize: 14, fontFamily: 'Roboto' },
  web: { fontSize: 14, fontFamily: 'system-ui' },
});
```

### 2. Safe Area Handling
```tsx
// Always wrap your app content
<SafeAreaView edges={['top', 'bottom']}>
  <YourAppContent />
</SafeAreaView>
```

### 3. Performance Monitoring
```tsx
import { usePerformanceMetrics } from '@katalyst/mobile';

function App() {
  const metrics = usePerformanceMetrics();
  
  useEffect(() => {
    console.log('Startup time:', metrics.startupTime);
    console.log('Memory usage:', metrics.memoryUsage);
  }, [metrics]);
}
```

### 4. Error Boundaries
```tsx
import { ErrorBoundary } from '@katalyst/mobile';

<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to crash reporting service
    console.error('Mobile app error:', error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>
```

## Advanced Topics

### Custom Native Modules
See `/shared/src/mobile/native-modules/` for examples of creating custom native modules.

### Deep Linking
Configure URL schemes in your mobile config and handle deep links in your app.

### Background Tasks
Use the background task API for location tracking, data sync, and other background operations.

### Push Notifications
Integrate with Firebase Cloud Messaging (Android) and Apple Push Notification Service (iOS).

## Support & Resources

- **Documentation**: `/shared/src/mobile/README.md`
- **Examples**: `/shared/src/mobile/examples/`
- **API Reference**: Generated TypeScript definitions
- **Community**: GitHub Discussions
- **Issues**: GitHub Issues

---

**Note**: This mobile system is specifically designed for Katalyst Core framework. For Next.js and Remix applications, continue using web deployment strategies as those frameworks are optimized for web environments.