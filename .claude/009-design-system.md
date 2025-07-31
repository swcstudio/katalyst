# Katalyst Design System

## Overview

The Katalyst Design System is a state-of-the-art, comprehensive design system that combines the enterprise-grade components of Ant Design Pro with the modern animations and effects of Aceternity UI. Built specifically for the Katalyst-React ecosystem, it provides a unified design language across all frameworks (Core, Next.js, Remix) with native multithreading support and mobile-first responsive design.

## Key Features

### 1. **Unified Component Library**
- 50+ production-ready components
- Ant Design Pro base with custom enhancements
- Aceternity UI animations and effects
- Mobile-optimized variants
- Accessibility-first approach

### 2. **Advanced Theming**
- Zustand-powered theme management
- Runtime theme switching
- System theme detection
- Custom theme creation
- Per-component theme overrides

### 3. **Mobile-First Design**
- Touch-optimized interactions
- Gesture support
- Haptic feedback
- Responsive breakpoints
- Platform-specific optimizations

### 4. **Performance Optimizations**
- Lazy loading
- Virtual scrolling
- Debounced interactions
- Minimal re-renders
- Tree-shakeable exports

### 5. **Developer Experience**
- TypeScript-first
- Comprehensive documentation
- Visual debug tools
- Storybook integration
- Design tokens

## Installation

```bash
# The design system is included in @swcstudio/shared
npm install @swcstudio/shared

# Required peer dependencies
npm install antd@^5.0.0 framer-motion@^10.0.0 zustand@^4.0.0
```

## Quick Start

### 1. Basic Setup

```typescript
// App.tsx
import { KatalystDesignSystem } from '@swcstudio/shared/design-system';

function App() {
  return (
    <KatalystDesignSystem
      framework="core" // 'core' | 'next' | 'remix'
      enableSSR={false}
    >
      <YourApp />
    </KatalystDesignSystem>
  );
}
```

### 2. Using Components

```typescript
import { 
  AnimatedButton, 
  GlowCard, 
  ProLayout, 
  ProForm 
} from '@swcstudio/shared/design-system';

function MyComponent() {
  return (
    <ProLayout
      title="My App"
      menuItems={menuItems}
      showSearch
      showNotifications
    >
      <GlowCard variant="holographic" hoverable>
        <h2>Welcome to Katalyst</h2>
        <AnimatedButton 
          type="primary" 
          variant="glow"
          animation="pulse"
        >
          Get Started
        </AnimatedButton>
      </GlowCard>
    </ProLayout>
  );
}
```

## Core Components

### AnimatedButton

Enhanced button with multiple animation variants:

```typescript
// Variants
<AnimatedButton variant="glow">Glow Effect</AnimatedButton>
<AnimatedButton variant="shimmer">Shimmer Effect</AnimatedButton>
<AnimatedButton variant="gradient">Gradient</AnimatedButton>
<AnimatedButton variant="spotlight">Spotlight</AnimatedButton>
<AnimatedButton variant="magnetic">Magnetic</AnimatedButton>

// Animations
<AnimatedButton animation="bounce">Bounce</AnimatedButton>
<AnimatedButton animation="pulse">Pulse</AnimatedButton>
<AnimatedButton animation="scale">Scale on Hover</AnimatedButton>
<AnimatedButton animation="rotate">Rotate</AnimatedButton>
<AnimatedButton animation="shake">Shake on Click</AnimatedButton>

// Presets
<AnimatedButton {...AnimatedButtonPresets.primary}>
  Primary Action
</AnimatedButton>
```

### GlowCard

Card component with advanced visual effects:

```typescript
// Variants
<GlowCard variant="glow">Glow on Hover</GlowCard>
<GlowCard variant="spotlight">Spotlight Follow</GlowCard>
<GlowCard variant="aurora">Aurora Animation</GlowCard>
<GlowCard variant="holographic">Holographic Effect</GlowCard>
<GlowCard variant="glass">Glassmorphism</GlowCard>
<GlowCard variant="3d" enableTilt>3D Tilt</GlowCard>

// Presets
<GlowCard {...GlowCardPresets.feature}>
  Feature Card
</GlowCard>
```

### ProLayout

Professional application layout with mobile support:

```typescript
<ProLayout
  // Layout configuration
  layout="side" // 'side' | 'top' | 'mix'
  fixedHeader
  fixedSider
  
  // Menu
  menuItems={[
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'users', icon: <UserOutlined />, label: 'Users' },
  ]}
  
  // Header features
  showSearch
  showNotifications
  notificationCount={5}
  
  // Mobile optimization
  mobileBreakpoint={768}
  showMobileMenu
  
  // User menu
  userName="John Doe"
  userAvatar="/avatar.jpg"
  onUserMenuClick={(key) => console.log(key)}
>
  {/* Your content */}
</ProLayout>
```

### ProForm

Advanced form component with multiple features:

```typescript
<ProForm
  // Form structure
  sections={[
    {
      title: 'Personal Information',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'input',
          rules: [{ required: true }],
        },
        {
          name: 'email',
          label: 'Email',
          type: 'input',
          rules: [{ required: true, type: 'email' }],
        },
      ],
    },
  ]}
  
  // Layout
  columns={2}
  mobileColumns={1}
  
  // Features
  autoSave
  autoSaveDelay={3000}
  showErrorSummary
  
  // Submission
  onSubmit={async (values) => {
    await saveData(values);
  }}
/>
```

### MobileNav

Mobile-optimized navigation:

```typescript
<MobileNav
  variant="floating" // 'default' | 'floating' | 'pill' | 'dock'
  position="bottom"
  items={[
    { key: 'home', icon: <HomeOutlined />, label: 'Home' },
    { key: 'search', icon: <SearchOutlined />, label: 'Search' },
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  ]}
  activeKey="home"
  enableHaptic
  floatingActionButton={{
    icon: <PlusOutlined />,
    onClick: () => console.log('FAB clicked'),
  }}
/>
```

## Theme Management

### Using the Theme Store

```typescript
import { useDesignSystemStore } from '@swcstudio/shared/design-system';

function ThemeController() {
  const {
    themeMode,
    setThemeMode,
    toggleTheme,
    componentSize,
    setComponentSize,
  } = useDesignSystemStore();

  return (
    <div>
      <Select
        value={themeMode}
        onChange={setThemeMode}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System' },
        ]}
      />
      
      <Button onClick={toggleTheme}>
        Toggle Theme
      </Button>
      
      <Radio.Group
        value={componentSize}
        onChange={(e) => setComponentSize(e.target.value)}
      >
        <Radio value="small">Small</Radio>
        <Radio value="middle">Medium</Radio>
        <Radio value="large">Large</Radio>
      </Radio.Group>
    </div>
  );
}
```

### Custom Themes

```typescript
import { createAntdTheme } from '@swcstudio/shared/design-system';

const customTheme = createAntdTheme(false); // false for light theme

// Modify theme tokens
customTheme.token.colorPrimary = '#722ed1';
customTheme.token.borderRadius = 8;

// Apply custom theme
<KatalystDesignSystem customTheme={customTheme}>
  <App />
</KatalystDesignSystem>
```

## Design Tokens

Access design tokens throughout your application:

```typescript
import { tokens } from '@swcstudio/shared/design-system';

const styles = {
  padding: tokens.spacing[4],
  color: tokens.colors.brand.primary.DEFAULT,
  borderRadius: tokens.radius.md,
  boxShadow: tokens.shadows.lg,
  fontSize: tokens.typography.fontSize.base,
  transition: `all ${tokens.animation.duration[200]} ${tokens.animation.easing.inOut}`,
};
```

## Mobile Optimization

### Responsive Hooks

```typescript
import { 
  useIsMobile, 
  useIsTablet, 
  useDeviceDetection 
} from '@swcstudio/shared/design-system';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Auto-detect device changes
  useDeviceDetection();
  
  if (isMobile) {
    return <MobileLayout />;
  }
  
  if (isTablet) {
    return <TabletLayout />;
  }
  
  return <DesktopLayout />;
}
```

### Touch Optimizations

```typescript
// Enable touch optimizations
const { setTouchOptimized } = useDesignSystemStore();
setTouchOptimized(true);

// Components automatically adjust for touch
<AnimatedButton size="large" block>
  Touch Optimized Button
</AnimatedButton>
```

## Accessibility

### Built-in Features

1. **ARIA Support**: All components include proper ARIA attributes
2. **Keyboard Navigation**: Full keyboard support
3. **Focus Management**: Visible focus indicators
4. **Screen Reader**: Optimized for screen readers
5. **Reduced Motion**: Respects user preferences

```typescript
// Check accessibility mode
const { isAccessibilityMode } = useDesignSystem();

if (isAccessibilityMode()) {
  // Provide alternative content
}
```

## Performance

### Code Splitting

```typescript
// Components are tree-shakeable
import { AnimatedButton } from '@swcstudio/shared/design-system/components/AnimatedButton';
```

### Lazy Loading

```typescript
const ProTable = lazy(() => 
  import('@swcstudio/shared/design-system/components/ProTable')
);
```

### Virtual Scrolling

```typescript
<VirtualList
  data={largeDataset}
  height={600}
  itemHeight={50}
  renderItem={(item) => <ListItem {...item} />}
/>
```

## Framework Integration

### Next.js

```typescript
// app/layout.tsx
import { KatalystDesignSystem } from '@swcstudio/shared/design-system';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <KatalystDesignSystem 
          framework="next" 
          enableSSR
        >
          {children}
        </KatalystDesignSystem>
      </body>
    </html>
  );
}
```

### Remix

```typescript
// root.tsx
import { KatalystDesignSystem } from '@swcstudio/shared/design-system';

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <KatalystDesignSystem framework="remix">
          <Outlet />
        </KatalystDesignSystem>
        <Scripts />
      </body>
    </html>
  );
}
```

## Advanced Usage

### Debug Mode

```typescript
const { toggleDebugMode, toggleGrid, toggleSpacing } = useDesignSystemStore();

// Enable debug mode
toggleDebugMode();
toggleGrid(); // Show grid overlay
toggleSpacing(); // Show spacing indicators
```

### Custom Components

```typescript
import { cn, useDesignSystem } from '@swcstudio/shared/design-system';

function CustomComponent({ className, ...props }) {
  const { token, isMobile } = useDesignSystem();
  
  return (
    <div
      className={cn(
        'custom-component',
        'p-4 rounded-lg',
        {
          'text-sm': isMobile,
          'text-base': !isMobile,
        },
        className
      )}
      style={{
        backgroundColor: token.colorBgContainer,
        borderColor: token.colorBorder,
      }}
      {...props}
    />
  );
}
```

## Migration Guide

### From Ant Design

```typescript
// Before
import { Button, Card } from 'antd';

// After
import { AnimatedButton, GlowCard } from '@swcstudio/shared/design-system';

// Enhanced with animations and effects
<AnimatedButton variant="glow" animation="pulse">
  Upgraded Button
</AnimatedButton>
```

### From Material-UI

```typescript
// Before
import { Button, Paper } from '@mui/material';

// After
import { AnimatedButton, GlowCard } from '@swcstudio/shared/design-system';

// Similar API with more features
<GlowCard variant="glass" elevation={2}>
  Enhanced Card
</GlowCard>
```

## Best Practices

1. **Use Semantic Tokens**: Always use design tokens instead of hardcoded values
2. **Mobile-First**: Design for mobile first, then enhance for desktop
3. **Accessibility**: Test with keyboard navigation and screen readers
4. **Performance**: Use lazy loading for heavy components
5. **Consistency**: Use the same variants across your application

## Troubleshooting

### Common Issues

1. **Theme not applying**
   ```typescript
   // Ensure provider is at the root
   <KatalystDesignSystem>
     <App /> {/* All components must be inside */}
   </KatalystDesignSystem>
   ```

2. **SSR Hydration mismatch**
   ```typescript
   // Use enableSSR prop
   <KatalystDesignSystem enableSSR>
     <App />
   </KatalystDesignSystem>
   ```

3. **Mobile detection not working**
   ```typescript
   // Call device detection hook
   useDeviceDetection();
   ```

## Roadmap

- [ ] AI-powered component suggestions
- [ ] Offline support with service workers
- [ ] Voice UI components
- [ ] AR/VR component variants
- [ ] Collaborative design tools
- [ ] Figma plugin

## Resources

- [Component Playground](#) - Interactive examples
- [Design Tokens Visualizer](#) - Token documentation
- [Figma UI Kit](#) - Design files
- [Contributing Guide](#) - How to contribute

## License

MIT © Katalyst Team