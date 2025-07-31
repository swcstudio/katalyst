# SVGR Integration - Advanced SVG to React Component System

## Overview

Katalyst's SVGR integration transforms SVG files into optimized React components with full TypeScript support. This system provides a seamless workflow for working with vector graphics, ensuring optimal performance, accessibility, and developer experience across all platforms.

## Key Features

- **Automatic SVG Optimization** - SVGO integration removes unnecessary code and optimizes file sizes
- **TypeScript Support** - Full type safety with custom SVG component interfaces
- **Accessibility First** - Built-in ARIA attributes and screen reader support
- **Theme Integration** - SVGs inherit CSS colors and respond to design system changes
- **Performance Optimized** - Tree-shaking, lazy loading, and efficient bundling
- **Cross-Platform** - Consistent SVG handling across Core, Next.js, and Remix frameworks
- **Developer Experience** - Auto-completion, error checking, and hot reloading

## Architecture

### SVGR Integration Stack

```
┌─────────────────────────────────────────────────────────┐
│                  Katalyst SVGR System                  │
├─────────────────────────────────────────────────────────┤
│  Icon Component   │  Direct Imports   │  Theme System   │
│  (Unified API)    │  (Raw Components) │  (CSS Colors)   │
├─────────────────────────────────────────────────────────┤
│  TypeScript Types │  SVGO Optimizer   │  Asset Pipeline │
│  (Auto-generated) │  (Size Reduction) │  (Build Tools)  │
├─────────────────────────────────────────────────────────┤
│           SVGR Core (SVG → React Components)           │
│        (RSpack Plugin + Webpack Loader + Next.js)      │
├─────────────────────────────────────────────────────────┤
│  SVG Source Files │  Configuration    │  Build System   │
│  (Assets Folder)  │  (Templates)      │  (Optimization) │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Adding SVG Files

Place your SVG files in the assets directory:

```
shared/src/assets/icons/
├── katalyst-logo.svg
├── arrow-right.svg
├── heart.svg
├── star.svg
└── check.svg
```

### 2. Direct Import Usage

```tsx
// Direct import as React component
import Logo from '@/assets/icons/katalyst-logo.svg';
import ArrowRight from '@/assets/icons/arrow-right.svg';

export function Header() {
  return (
    <header className="flex items-center gap-4">
      <Logo 
        className="w-8 h-8 text-blue-500"
        title="Katalyst Framework"
      />
      <button className="flex items-center gap-2">
        Get Started
        <ArrowRight className="w-4 h-4" />
      </button>
    </header>
  );
}
```

### 3. Icon Component System

```tsx
// Using the unified Icon component
import { Icon } from '@katalyst/shared';

export function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon name="check" size="sm" className="text-green-500" />
        <span>Task completed</span>
      </div>
      
      <button className="btn-primary">
        Continue
        <Icon name="arrow-right" size="sm" className="ml-2" />
      </button>
    </div>
  );
}
```

## Framework Configuration

### 1. Core Framework (RSpack)

```typescript
// core/rsbuild.config.ts
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig({
  plugins: [
    pluginSvgr({
      svgrOptions: {
        exportType: 'default',
        prettier: false,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  removeUselessStrokeAndFill: false,
                },
              },
            },
            'prefixIds',
          ],
        },
        titleProp: true,
        ref: true,
        replaceAttrValues: {
          '#000': 'currentColor',
          '#000000': 'currentColor',
        },
        template: (variables, { tpl }) => {
          return tpl\`
\${variables.imports};

\${variables.interfaces};

const \${variables.componentName} = (\${variables.props}) => (
  \${variables.jsx}
);

\${variables.componentName}.displayName = "\${variables.componentName}";

\${variables.exports};
\`;
        },
      },
    }),
  ],
});
```

### 2. Next.js Framework

```typescript
// next/next.config.ts
const nextConfig: NextConfig = {
  webpack: (config: any) => {
    // SVGR configuration
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                'prefixIds',
              ],
            },
            titleProp: true,
            ref: true,
          },
        },
      ],
    });

    return config;
  },
};
```

### 3. Remix Framework

```typescript
// remix/rsbuild.config.ts
// Same configuration as Core framework
```

## TypeScript Integration

### 1. SVG Module Declarations

```typescript
// shared/src/types/svg.d.ts
declare module '*.svg' {
  import * as React from 'react';
  
  export interface SVGProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
    titleId?: string;
  }
  
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}

declare module '*.svg?react' {
  import * as React from 'react';
  export interface SVGProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
    titleId?: string;
  }
  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}
```

### 2. Icon Component Types

```typescript
// Icon component with full type safety
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof iconMap;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  title?: string;
}

export type IconName = keyof typeof iconMap;
export type IconSize = keyof typeof sizeMap;
```

## Icon Component System

### 1. Icon Component Implementation

```tsx
// shared/src/components/ui/Icon.tsx
import React, { forwardRef } from 'react';
import { cn } from '../../utils';

// Import SVG icons as React components
import KatalystLogo from '../../assets/icons/katalyst-logo.svg';
import ArrowRight from '../../assets/icons/arrow-right.svg';
import Heart from '../../assets/icons/heart.svg';
import Star from '../../assets/icons/star.svg';
import Check from '../../assets/icons/check.svg';

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

const iconMap = {
  'katalyst-logo': KatalystLogo,
  'arrow-right': ArrowRight,
  heart: Heart,
  star: Star,
  check: Check,
} as const;

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', className, title, ...props }, ref) => {
    const IconComponent = iconMap[name];
    
    if (!IconComponent) {
      console.warn(\`Icon "\${name}" not found.\`);
      return null;
    }

    const iconSize = typeof size === 'number' ? size : sizeMap[size];

    return (
      <IconComponent
        ref={ref}
        width={iconSize}
        height={iconSize}
        title={title}
        className={cn(
          'inline-block flex-shrink-0',
          'transition-colors duration-200',
          className
        )}
        {...props}
      />
    );
  }
);
```

### 2. Usage Patterns

```tsx
// Size variations
<Icon name="check" size="xs" />     // 12px
<Icon name="check" size="sm" />     // 16px  
<Icon name="check" size="md" />     // 24px (default)
<Icon name="check" size="lg" />     // 32px
<Icon name="check" size="xl" />     // 48px
<Icon name="check" size={64} />     // Custom size

// Styling with CSS classes
<Icon name="heart" className="text-red-500 hover:fill-current" />
<Icon name="star" className="text-yellow-400 hover:scale-110" />

// Accessibility
<Icon 
  name="check" 
  title="Task completed successfully"
  aria-label="Completion status indicator"
/>

// Theme integration
<Icon 
  name="arrow-right" 
  className="text-primary hover:text-primary-dark" 
/>
```

## Advanced Features

### 1. SVG Optimization

SVGR automatically optimizes SVGs using SVGO:

```javascript
// Optimization configuration
svgoConfig: {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,        // Keep viewBox for scaling
          removeUselessStrokeAndFill: false, // Keep styling flexibility
        },
      },
    },
    'prefixIds',                     // Prevent ID conflicts
  ],
}
```

**Before optimization:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="m9 18 6-6-6-6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**After optimization:**
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 2. Color Replacement

```javascript
// Automatic color replacement for theming
replaceAttrValues: {
  '#000': 'currentColor',
  '#000000': 'currentColor',
}
```

This allows SVGs to inherit text color from CSS:

```tsx
// SVG will use the text color
<div className="text-blue-500">
  <Icon name="check" />
</div>
```

### 3. Custom Templates

```javascript
// Custom component template
template: (variables, { tpl }) => {
  return tpl\`
\${variables.imports};

\${variables.interfaces};

const \${variables.componentName} = (\${variables.props}) => (
  \${variables.jsx}
);

\${variables.componentName}.displayName = "\${variables.componentName}";

\${variables.exports};
\`;
},
```

### 4. Accessibility Features

```tsx
// Built-in accessibility support
export function AccessibleIcon() {
  return (
    <Icon
      name="heart"
      title="Add to favorites"           // Tooltip text
      aria-label="Favorite button"      // Screen reader text
      role="img"                         // Semantic role
      focusable="false"                  // Keyboard navigation
    />
  );
}
```

## Design System Integration

### 1. Theme Colors

```tsx
// SVGs automatically inherit design system colors
import { useDesignSystemStore } from '@katalyst/shared';

export function ThemedIcon() {
  const { currentTheme } = useDesignSystemStore();
  
  return (
    <Icon 
      name="star" 
      className="text-primary hover:text-primary-dark"
      style={{ color: currentTheme.primaryColor }}
    />
  );
}
```

### 2. Animation Integration

```tsx
// Framer Motion integration
import { motion } from 'framer-motion';

export function AnimatedIcon() {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon name="heart" className="text-red-500" />
    </motion.div>
  );
}
```

### 3. Responsive Sizing

```tsx
// Responsive icon sizes
export function ResponsiveIcon() {
  return (
    <Icon 
      name="katalyst-logo"
      className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
    />
  );
}
```

## Performance Optimization

### 1. Tree Shaking

SVGR supports tree shaking out of the box:

```tsx
// Only imports the specific icon component
import ArrowRight from '@/assets/icons/arrow-right.svg';

// Tree shaking removes unused icons from bundle
```

### 2. Lazy Loading

```tsx
// Lazy load heavy icon sets
const HeavyIcon = React.lazy(() => import('@/assets/icons/complex-diagram.svg'));

export function LazyIcon() {
  return (
    <Suspense fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse" />}>
      <HeavyIcon />
    </Suspense>
  );
}
```

### 3. Bundle Analysis

```bash
# Analyze SVG bundle impact
BUNDLE_ANALYZE=true npm run build

# Check individual SVG sizes
du -sh shared/src/assets/icons/*.svg
```

### 4. Icon Preloading

```tsx
// Preload critical icons
export function preloadIcons() {
  const criticalIcons = [
    () => import('@/assets/icons/katalyst-logo.svg'),
    () => import('@/assets/icons/arrow-right.svg'),
    () => import('@/assets/icons/check.svg'),
  ];
  
  Promise.all(criticalIcons.map(load => load()));
}
```

## Best Practices

### 1. SVG Preparation

```xml
<!-- ✅ Good: Clean, optimized SVG -->
<svg viewBox="0 0 24 24" fill="none">
  <path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2"/>
</svg>

<!-- ❌ Bad: Complex, unoptimized SVG -->
<svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(0,0)">
    <path d="m9 18 6-6-6-6" stroke="#000000" stroke-width="2px" fill="none"/>
  </g>
</svg>
```

### 2. Naming Conventions

```
// File naming
icons/
├── arrow-right.svg          ✅ kebab-case
├── check-circle.svg         ✅ descriptive
├── user-profile.svg         ✅ context-aware
├── ArrowRight.svg           ❌ PascalCase
├── check_circle.svg         ❌ snake_case
└── icon1.svg                ❌ non-descriptive
```

### 3. Component Organization

```tsx
// ✅ Good: Organized icon system
export const iconMap = {
  // Navigation
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  
  // Actions  
  'check': Check,
  'edit': Edit,
  'delete': Delete,
  
  // Status
  'success': CheckCircle,
  'warning': AlertTriangle,
  'error': XCircle,
} as const;

// ❌ Bad: Flat, unorganized
export const iconMap = {
  icon1: Icon1,
  icon2: Icon2,
  // ...
} as const;
```

### 4. Accessibility Guidelines

```tsx
// ✅ Good: Accessible icon usage
<button aria-label="Delete item">
  <Icon name="delete" title="Delete" aria-hidden="true" />
</button>

<Icon 
  name="status-success" 
  role="img"
  aria-label="Operation completed successfully"
  title="Success"
/>

// ❌ Bad: Missing accessibility
<button>
  <Icon name="delete" />
</button>

<Icon name="status" />
```

## Platform Support

### 1. Core Framework Integration

```tsx
// core/src/components/Dashboard.tsx
import { Icon } from '@katalyst/shared';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="flex items-center gap-2">
        <Icon name="katalyst-logo" size="lg" />
        <h1>Dashboard</h1>
      </header>
    </div>
  );
}
```

### 2. Next.js Integration

```tsx
// next/src/components/Hero.tsx
import { Icon } from '@katalyst/shared';

export function Hero() {
  return (
    <section className="hero">
      <h1>Welcome to Katalyst</h1>
      <button className="cta-button">
        Get Started
        <Icon name="arrow-right" size="sm" className="ml-2" />
      </button>
    </section>
  );
}
```

### 3. Remix Integration

```tsx
// remix/app/components/Sidebar.tsx
import { Icon } from '@katalyst/shared';

export function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: 'grid' },
    { name: 'Analytics', icon: 'chart' },
    { name: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="sidebar">
      {menuItems.map(item => (
        <Link key={item.name} className="flex items-center gap-2">
          <Icon name={item.icon} size="sm" />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
```

## Migration Guide

### From Font Icons

```tsx
// Before: Font icons
<i className="fas fa-check"></i>
<i className="material-icons">arrow_forward</i>

// After: SVGR icons
<Icon name="check" />
<Icon name="arrow-right" />
```

### From Inline SVG

```tsx
// Before: Inline SVG
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="m9 18 6-6-6-6" stroke="currentColor" />
</svg>

// After: SVGR component
<Icon name="arrow-right" size="md" />
```

### From Image Assets

```tsx
// Before: Image assets
<img src="/icons/check.svg" alt="Check" width="24" height="24" />

// After: React component
<Icon name="check" size="md" title="Check" />
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**
   ```bash
   # Ensure SVG types are included
   # Add to tsconfig.json
   {
     "include": ["shared/src/types/svg.d.ts"]
   }
   ```

2. **Bundle Size Issues**
   ```tsx
   // Use dynamic imports for large icon sets
   const IconSet = React.lazy(() => import('./IconSet'));
   ```

3. **Color Not Updating**
   ```tsx
   // Ensure SVG uses currentColor
   <Icon name="heart" className="text-red-500" />
   
   // Check SVG source has currentColor
   // stroke="currentColor" not stroke="#000"
   ```

4. **Missing Icons**
   ```tsx
   // Check icon is registered in iconMap
   export const iconMap = {
     'my-icon': MyIcon, // ← Must be here
   } as const;
   ```

## API Reference

### Icon Component Props

```typescript
interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;                    // Icon identifier
  size?: IconSize | number;          // Predefined or custom size
  className?: string;                // CSS classes
  title?: string;                    // Accessibility title
}

type IconName = keyof typeof iconMap;
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

### Available Icons

```typescript
export const availableIcons: IconName[] = [
  'katalyst-logo',
  'arrow-right',
  'heart',
  'star',
  'check',
];

export const hasIcon = (name: string): name is IconName => {
  return name in iconMap;
};
```

### SVGR Configuration Options

```typescript
interface SVGROptions {
  exportType: 'default' | 'named';
  prettier: boolean;
  svgo: boolean;
  svgoConfig: SVGOConfig;
  titleProp: boolean;
  ref: boolean;
  replaceAttrValues: Record<string, string>;
  template: (variables: any, context: any) => string;
}
```

## Testing

### Unit Tests

```tsx
// Icon component tests
import { render, screen } from '@testing-library/react';
import { Icon } from '../Icon';

describe('Icon Component', () => {
  it('renders icon with correct size', () => {
    render(<Icon name="check" size="lg" />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('applies custom className', () => {
    render(<Icon name="check" className="text-red-500" />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('text-red-500');
  });

  it('includes accessibility attributes', () => {
    render(<Icon name="check" title="Success" />);
    const icon = screen.getByTitle('Success');
    expect(icon).toBeInTheDocument();
  });
});
```

### Visual Regression Tests

```tsx
// Storybook stories for visual testing
export default {
  title: 'Components/Icon',
  component: Icon,
} as ComponentMeta<typeof Icon>;

export const AllIcons: ComponentStory<typeof Icon> = () => (
  <div className="grid grid-cols-5 gap-4">
    {availableIcons.map(name => (
      <div key={name} className="text-center">
        <Icon name={name} size="lg" />
        <p className="text-xs mt-1">{name}</p>
      </div>
    ))}
  </div>
);

export const Sizes: ComponentStory<typeof Icon> = () => (
  <div className="flex items-center gap-4">
    <Icon name="check" size="xs" />
    <Icon name="check" size="sm" />
    <Icon name="check" size="md" />
    <Icon name="check" size="lg" />
    <Icon name="check" size="xl" />
  </div>
);
```

## Support & Resources

- **SVGR Documentation**: https://react-svgr.com/
- **SVGO Configuration**: https://github.com/svg/svgo
- **Accessibility Guidelines**: https://www.w3.org/WAI/WCAG21/
- **Performance Best Practices**: Built-in optimization and tree shaking
- **TypeScript Support**: Full type safety with custom declarations

---

**Note**: SVGR integration is production-ready and provides a modern, efficient way to work with SVG icons in React applications. The system is optimized for performance, accessibility, and developer experience across all Katalyst platforms.

---

*Built for scalable icon systems with modern tooling*