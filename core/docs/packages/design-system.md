# @katalyst/design-system

Comprehensive design token system and UI component library with theming support for the Katalyst framework.

## Overview

The `@katalyst/design-system` package provides a unified design language through design tokens, a theme system, and production-ready UI components. It supports light/dark themes and framework-agnostic styling.

### Key Features

- 🎨 **Design Tokens** - Primitive and semantic token system
- 🌓 **Theme System** - Light, dark, and system themes with CSS variables
- 🧩 **UI Components** - Production-ready React components
- 🎯 **Framework Agnostic** - Works with Next.js, Remix, and Core React
- 💅 **TailwindCSS Integration** - Generate Tailwind config from tokens
- 🔧 **Customizable** - Override tokens and create custom themes
- 📱 **Responsive** - Mobile-first design patterns
- ♿ **Accessible** - WCAG 2.1 AA compliant components

## Installation

```typescript
import { ThemeProvider, Button } from '@katalyst/design-system';
```

## Quick Start

```tsx
import { ThemeProvider, Button, Card } from '@katalyst/design-system';
import '@katalyst/design-system/css';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Card>
        <h1>Hello World</h1>
        <Button variant="primary">Click Me</Button>
      </Card>
    </ThemeProvider>
  );
}
```

## Design Tokens

### Primitive Tokens

```typescript
import { primitiveTokens } from '@katalyst/design-system';

// Colors
primitiveTokens.colors.neutral[500];     // "215 16% 57%"
primitiveTokens.colors.primary[600];     // Brand color

// Spacing
primitiveTokens.spacing[4];              // "1rem"
primitiveTokens.spacing[8];              // "2rem"

// Typography
primitiveTokens.typography.fontSize.lg;  // { size: "1.125rem", lineHeight: "1.75rem" }

// Border Radius
primitiveTokens.borderRadius.md;         // "0.375rem"
```

### Semantic Tokens

```typescript
import { semanticTokens } from '@katalyst/design-system';

// Text colors
semanticTokens.color.text.primary;       // "var(--katalyst-color-text-primary)"
semanticTokens.color.text.secondary;     // "var(--katalyst-color-text-secondary)"

// Background colors
semanticTokens.color.background.primary; // "var(--katalyst-color-background)"

// Component tokens
semanticTokens.component.button.padding; // "var(--katalyst-component-button-padding-x)"
```

## Theme System

### Using ThemeProvider

```tsx
import { ThemeProvider, useTheme } from '@katalyst/design-system';

function App() {
  return (
    <ThemeProvider 
      defaultTheme="system"
      storageKey="my-app-theme"
      disableTransitions={false}
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### useTheme Hook

```tsx
import { useTheme } from '@katalyst/design-system';

function ThemeToggle() {
  const { theme, setTheme, toggleTheme, resolvedTheme } = useTheme();
  
  return (
    <div>
      <p>Current: {theme}</p>
      <p>Resolved: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
    </div>
  );
}
```

### CSS Variables

```css
:root {
  --katalyst-color-background: hsl(0 0% 100%);
  --katalyst-color-text-primary: hsl(222 84% 5%);
  --katalyst-component-button-border-radius: 0.375rem;
}

[data-theme="dark"] {
  --katalyst-color-background: hsl(222 84% 5%);
  --katalyst-color-text-primary: hsl(0 0% 100%);
}
```

## UI Components

### Button

```tsx
import { Button } from '@katalyst/design-system';

<Button variant="primary" size="lg">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
```

### Card

```tsx
import { Card } from '@katalyst/design-system';

<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

<Card
  title="With Header"
  footer={<Button>Action</Button>}
>
  Content
</Card>
```

### Input

```tsx
import { Input } from '@katalyst/design-system';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

### Select

```tsx
import { Select } from '@katalyst/design-system';

<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
  value={selected}
  onChange={setSelected}
/>
```

## Tailwind Integration

```typescript
// tailwind.config.ts
import { toTailwindConfig } from '@katalyst/design-system';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: toTailwindConfig('nextjs'),
  },
};
```

## Component Tokens

### Button Tokens

```css
--katalyst-component-button-border-radius: 0.375rem;
--katalyst-component-button-font-size: 0.875rem;
--katalyst-component-button-padding-x: 1rem;
--katalyst-component-button-padding-y: 0.5rem;
```

### Card Tokens

```css
--katalyst-component-card-border-radius: 0.5rem;
--katalyst-component-card-padding: 1.5rem;
--katalyst-component-card-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
```

## Animation Utilities

```tsx
import { animationPresets } from '@katalyst/design-system';

<div className="katalyst-animate-fadeIn">Fade in</div>
<div className="katalyst-animate-slideUp">Slide up</div>
<div className="katalyst-animate-scaleIn">Scale in</div>
```

## Best Practices

1. **Use ThemeProvider** - Wrap app root
2. **Import CSS** - Include theme CSS file
3. **Use semantic tokens** - Prefer semantic over primitive
4. **Leverage CSS variables** - Use var() in custom styles
5. **Follow token hierarchy** - Primitives → CSS vars → Semantics
6. **Test both themes** - Ensure components work in light and dark
7. **Use component tokens** - Follow component-specific tokens

## Related Documentation

- [Core Package](./core.md) - Using design system components
- [Hooks Package](./hooks.md) - Theme hooks

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Status**: Production Ready
