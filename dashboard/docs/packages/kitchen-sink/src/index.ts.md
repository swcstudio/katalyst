# index.ts

> Source: `src/index.ts`

**Package:** `@katalyst/kitchen-sink`

## Overview

This module is part of the `@katalyst/kitchen-sink` package.

## Dependencies

- `@katalyst/kitchen-sink`
- `@katalyst/kitchen-sink/hooks`
- `@katalyst/kitchen-sink/design-system`
- `@katalyst/kitchen-sink/build-system`
- `@katalyst/kitchen-sink`
- `@katalyst/kitchen-sink`
- `@katalyst/kitchen-sink`

## Exports

### `Mobile`

<!-- TODO: Add detailed documentation for Mobile -->

### `Desktop`

<!-- TODO: Add detailed documentation for Desktop -->

### `Admin`

<!-- TODO: Add detailed documentation for Admin -->

### `Marketing`

<!-- TODO: Add detailed documentation for Marketing -->

### `Threading`

<!-- TODO: Add detailed documentation for Threading -->

### `DevTools`

<!-- TODO: Add detailed documentation for DevTools -->

### `VERSION`

<!-- TODO: Add detailed documentation for VERSION -->

### `PACKAGE_NAME`

<!-- TODO: Add detailed documentation for PACKAGE_NAME -->

### `FRAMEWORK_INFO`

<!-- TODO: Add detailed documentation for FRAMEWORK_INFO -->

### `isPlatform`

<!-- TODO: Add detailed documentation for isPlatform -->

### `hasFeature`

<!-- TODO: Add detailed documentation for hasFeature -->

### `createKatalystApp`

<!-- TODO: Add detailed documentation for createKatalystApp -->

### `QuickStart`

<!-- TODO: Add detailed documentation for QuickStart -->

## Source Code

```typescript
/**
 * 🚀 KATALYST KITCHEN SINK - Complete Framework Installation
 * ===============================================================
 * 
 * This is the main entry point for the complete Katalyst framework.
 * Everything you need to build modern applications in one package.
 * 
 * QUICK START:
 * ```bash
 * npm install @katalyst/kitchen-sink
 * ```
 * 
 * IMPORT PATTERNS:
 * ```tsx
 * // Everything from one place
 * import { KatalystApp, useKatalyst, Button, Card } from '@katalyst/kitchen-sink';
 * 
 * // Or specific modules
 * import { useKatalyst } from '@katalyst/kitchen-sink/hooks';
 * import { Button, Card } from '@katalyst/kitchen-sink/design-system';
 * import { createApp } from '@katalyst/kitchen-sink/build-system';
 * ```
 * 
 * FEATURE MODULES:
 * - Core: Framework foundation and providers
 * - Hooks: Unified hook interface with useKatalyst()
 * - Design System: UI components and theming
 * - API: tRPC, AI agents, edge functions
 * - Build System: RSBuild, Tauri, mobile configs
 * - Advanced: Multithreading, WebXR, metaverse
 */

// ========================================
// 🏗️ CORE FRAMEWORK - Always available
// ========================================
export { 
  KatalystProvider, 
  useKatalystContext,
  ConfigProvider,
  DesignSystem,
  KatalystApp,
  DesignProvider,
  DataProvider
} from '@katalyst/core';

// Core UI components
export { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Tabs, 
  Icon,
  AdminLayout, 
  MarketingLayout,
  DataTable,
  Form,
  QueryBoundary,
  cn
} from '@katalyst/core';

// ========================================
// 🪝 UNIFIED HOOKS - Single entry point
// ========================================
export { 
  useKatalyst,
  type KatalystHook,
  katalystCore,
  katalystDOM,
  katalystUtils
} from '@katalyst/hooks';

// React compatibility layer
export { React } from '@katalyst/hooks';

// ========================================
// 🎨 DESIGN SYSTEM - Components and theming
// ========================================
export {
  // Design tokens
  tokens,
  colors,
  spacing,
  typography,
  breakpoints,
  
  // Advanced components
  Modal,
  Drawer,
  Popover,
  Tooltip,
  Dropdown,
  Select,
  DatePicker,
  Slider,
  Switch,
  Checkbox,
  Radio,
  InputGroup,
  Avatar,
  List,
  Table,
  Pagination,
  Breadcrumb,
  Tabs as DSTabs,
  Accordion,
  Collapse,
  Alert,
  Toast,
  Loading,
  Skeleton,
  Empty,
  Result,
  Image,
  Card as DSCard,
  Button as DSButton,
  Input as DSInput,
  
  // Layout components
  Grid,
  Row,
  Col,
  Container,
  Header,
  Footer,
  Sidebar,
  Content,
  
  // Utility components
  Divider,
  Space,
  Typography,
  Anchor,
  BackTop,
  Affix,
  ConfigProvider as DSConfigProvider
} from '@katalyst/design-system';

// ========================================
// 📊 API LAYER - Data and integrations
// ========================================
export {
  // tRPC
  createTRPC,
  useTRPCQuery,
  useTRPCMutation,
  TRPCProvider,
  
  // AI Agents
  ClaudeAgent,
  OpenAIAgent,
  AnthropicAgent,
  useAgent,
  AgentProvider,
  
  // Edge functions
  createEdgeFunction,
  useEdgeQuery,
  
  // WebXR
  WebXRProvider,
  useWebXR,
  XRController,
  XRScene,
  
  // API utilities
  createApiClient,
  useApiAuth,
  ApiProvider
} from '@katalyst/api';

// ========================================
// 🤖 AI & AUTOMATION
// ========================================
export {
  // Claude integration
  ClaudeProvider,
  useClaude,
  claudeConfig,
  
  // Thread management
  ThreadManager,
  useThread,
  ThreadProvider,
  
  // Authentication
  AuthProvider,
  useAuth,
  authenticateUser,
  
  // Agent orchestration
  AgentOrchestrator,
  useAgentOrchestrator,
  createAgent,
  runAgent
} from '@katalyst/ai';

// ========================================
// 🔧 BUILD SYSTEM - Configuration and tools
// ========================================
export {
  // RSBuild configurations
  createCoreConfig,
  createRemixConfig,
  createAdminConfig,
  createMobileConfig,
  createDesktopConfig,
  createWebXRConfig,
  
  // Platform presets
  KatalystBuildPresets,
  RSpackPluginManager,
  
  // Integration configs
  createTauriConfig,
  createReactNativeConfig,
  createNextConfig,
  createViteConfig,
  
  // Build utilities
  buildAnalyzer,
  bundleOptimizations,
  performanceBudget
} from '@katalyst/build-system';

// ========================================
// 📱 MOBILE & DESKTOP APPS
// ========================================

// Mobile app (conditional import)
export const Mobile = () => import('../mobile').then(m => ({
  MobileApp: m.MobileApp,
  MobileNavigation: m.MobileNavigation,
  MobileComponents: m.MobileComponents,
  useMobileOptimizations: m.useMobileOptimizations
}));

// Desktop app (conditional import)
export const Desktop = () => import('../desktop').then(m => ({
  DesktopApp: m.DesktopApp,
  DesktopMenu: m.DesktopMenu,
  DesktopTray: m.DesktopTray,
  useDesktopFeatures: m.useDesktopFeatures
}));

// ========================================
// 📚 ADMIN & MARKETING TEMPLATES
// ========================================

// Admin templates
export const Admin = () => import('../admin').then(m => ({
  AdminDashboard: m.AdminDashboard,
  UserManagement: m.UserManagement,
  ContentManagement: m.ContentManagement,
  SystemSettings: m.SystemSettings,
  AdminLayout: m.AdminLayout
}));

// Marketing templates
export const Marketing = () => import('../marketing').then(m => ({
  MarketingLayout: m.MarketingLayout,
  HeroSection: m.HeroSection,
  FeatureSection: m.FeatureSection,
  PricingSection: m.PricingSection,
  ContactSection: m.ContactSection,
  BlogSection: m.BlogSection
}));

// ========================================
// 🚀 ADVANCED FEATURES (Lazy loaded)
// ========================================

// Multithreading (conditional - requires Rust compilation)
export const Threading = () => import('../multithreading').then(m => ({
  useMultithreading: m.useMultithreading,
  useAdvancedMultithreading: m.useAdvancedMultithreading,
  useAITaskProcessor: m.useAITaskProcessor,
  MultithreadingProvider: m.MultithreadingProvider,
  ThreadManager: m.ThreadManager,
  TaskScheduler: m.TaskScheduler
}));

// Development tools (development only)
export const DevTools = process.env.NODE_ENV === 'development' ? () => 
  import('../dev-tools').then(m => ({
    ComponentExplorer: m.ComponentExplorer,
    PerformanceMonitor: m.PerformanceMonitor,
    StateInspector: m.StateInspector,
    NetworkMonitor: m.NetworkMonitor,
    ConsoleOverride: m.ConsoleOverride
  })) : () => Promise.resolve({});

// ========================================
// 📦 VERSION & METADATA
// ========================================

export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@katalyst/kitchen-sink';
export const FRAMEWORK_INFO = {
  name: 'Katalyst',
  version: VERSION,
  description: 'Complete framework for modern applications',
  features: [
    'react-19',
    'micro-frontends',
    'ai-integration',
    'multithreading',
    'cross-platform',
    'build-system'
  ],
  platforms: ['web', 'mobile', 'desktop', 'webxr'],
  license: 'MIT'
};

// ========================================
// 🔧 UTILITY EXPORTS
// ========================================

// Platform detection
export const isPlatform = {
  web: typeof window !== 'undefined' && !isPlatform.mobile && !isPlatform.desktop,
  mobile: typeof window !== 'undefined' && 'ontouchstart' in window,
  desktop: typeof window !== 'undefined' && !('ontouchstart' in window),
  node: typeof window === 'undefined',
  server: typeof window === 'undefined'
};

// Feature detection
export const hasFeature = {
  multithreading: () => typeof SharedArrayBuffer !== 'undefined',
  webgl: () => {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl') || !!canvas.getContext('experimental-webgl');
    } catch {
      return false;
    }
  },
  webxr: () => 'xr' in navigator,
  serviceWorker: () => 'serviceWorker' in navigator,
  webAssembly: () => typeof WebAssembly !== 'undefined'
};

// ========================================
// 🎯 HELPER FUNCTIONS
// ========================================

/**
 * Create a complete Katalyst app with all features
 */
export function createKatalystApp(config = {}) {
  return {
    App: KatalystApp,
    config: {
      version: VERSION,
      platform: Object.keys(isPlatform).find(key => isPlatform[key]),
      features: config.features || ['core', 'hooks', 'design-system'],
      ...config
    }
  };
}

/**
 * Quick setup for common use cases
 */
export const QuickStart = {
  // Simple SPA
  spa: (components = {}) => createKatalystApp({
    features: ['core', 'hooks', 'design-system'],
    components
  }),
  
  // Admin dashboard
  admin: (routes = {}) => createKatalystApp({
    features: ['core', 'hooks', 'design-system', 'admin'],
    routes
  }),
  
  // Mobile app
  mobile: (screens = {}) => createKatalystApp({
    features: ['core', 'hooks', 'design-system', 'mobile'],
    screens
  }),
  
  // Desktop app
  desktop: (windows = {}) => createKatalystApp({
    features: ['core', 'hooks', 'design-system', 'desktop'],
    windows
  }),
  
  // Full stack (everything)
  fullstack: (config = {}) => createKatalystApp({
    features: ['core', 'hooks', 'design-system', 'api', 'ai', 'build-system'],
    ...config
  })
};

// ========================================
// 📖 USAGE EXAMPLES
// ========================================

/**
 * BASIC USAGE:
 * ```tsx
 * import { createKatalystApp, Button, Card } from '@katalyst/kitchen-sink';
 * 
 * const app = createKatalystApp();
 * 
 * function MyApp() {
 *   return (
 *     <app.App>
 *       <Card>
 *         <Button>Click me</Button>
 *       </Card>
 *     </app.App>
 *   );
 * }
 * ```
 * 
 * ADMIN DASHBOARD:
 * ```tsx
 * import { QuickStart, Admin } from '@katalyst/kitchen-sink';
 * 
 * const app = QuickStart.admin();
 * const { AdminDashboard } = await Admin();
 * 
 * function AdminApp() {
 *   return (
 *     <app.App>
 *       <AdminDashboard />
 *     </app.App>
 *   );
 * }
 * ```
 * 
 * ADVANCED FEATURES:
 * ```tsx
 * import { useKatalyst, Threading, AI } from '@katalyst/kitchen-sink';
 * 
 * function AdvancedApp() {
 *   const k = useKatalyst();
 *   
 *   // Load advanced features only when needed
 *   const loadAdvanced = async () => {
 *     const { useMultithreading } = await Threading();
 *     const { ClaudeProvider } = await AI();
 *     
 *     return { useMultithreading, ClaudeProvider };
 *   };
 *   
 *   return (
 *     <div>
 *       <Button onClick={loadAdvanced}>Enable Advanced Features</Button>
 *     </div>
 *   );
 * }
 * ```
 */

```

---

*Generated documentation for @katalyst/kitchen-sink*
