# Katalyst Component Migration Guide

## Overview

This guide provides step-by-step instructions for migrating existing Aceternity UI components in the Next.js marketing website to use the unified Katalyst Design System and shared components. This ensures consistency across all meta frameworks (Core, Next.js, Remix) while maintaining accessibility and performance standards.

## Migration Strategy

### Phase 1: Foundation Components ✅ Complete

1. **Button Component** - Migrated to shared Katalyst Button
2. **Input Component** - Migrated with optional motion effects
3. **Card Component** - Migrated to shared Katalyst Card
4. **Accessibility Provider** - Added comprehensive a11y support

### Phase 2: Core UI Components (In Progress)

These are the essential UI components that need immediate migration:

#### 2.1 Form Components
- [ ] **Textarea** - Extend shared Input patterns
- [ ] **Select** - Create with Katalyst design tokens
- [ ] **Checkbox** - Accessible checkbox with Katalyst styling
- [ ] **Radio** - Radio button group component
- [ ] **Switch** - Toggle switch component
- [ ] **Label** - Form label component

#### 2.2 Navigation Components
- [ ] **Tabs** - Accessible tab navigation
- [ ] **Breadcrumb** - Navigation breadcrumb
- [ ] **Pagination** - Page navigation component
- [ ] **Menu/Dropdown** - Dropdown menu system

#### 2.3 Feedback Components
- [ ] **Alert** - Status alert component
- [ ] **Toast** - Notification system
- [ ] **Dialog** - Modal dialog system
- [ ] **Popover** - Contextual popup
- [ ] **Tooltip** - Information tooltip

### Phase 3: Advanced Components

#### 3.1 Data Display
- [ ] **Table** - Data table with sorting/filtering
- [ ] **Badge** - Status badges and labels
- [ ] **Avatar** - User avatar component
- [ ] **Progress** - Progress indicators
- [ ] **Skeleton** - Loading placeholders

#### 3.2 Layout Components
- [ ] **Container** - Layout container
- [ ] **Grid** - Grid layout system
- [ ] **Stack** - Flexible layout stack
- [ ] **Divider** - Content dividers

## Migration Process

### Step 1: Analyze Current Component

Before migrating any component, analyze its current implementation:

```typescript
// Example: Analyzing the current 3d-card component
import { Card3D } from '@/components/ui/3d-card';

// Check:
// 1. Props interface
// 2. Styling approach
// 3. Animation usage
// 4. Accessibility features
// 5. Framework dependencies
```

### Step 2: Create Shared Component

Create the new component in the shared library:

```typescript
// shared/src/components/ui/Card3D.tsx
import * as React from 'react';
import { cn } from '../../utils/cn';
import { Card, CardContent } from './Card';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  // Add Katalyst-specific props
}

export const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="elevated"
        className={cn(
          // Base 3D transform styles using Katalyst tokens
          'transform-gpu perspective-1000',
          'hover:rotateX-2 hover:rotateY-2',
          'transition-transform duration-300',
          className
        )}
        {...props}
      >
        <CardContent>
          {children}
        </CardContent>
      </Card>
    );
  }
);
```

### Step 3: Update Framework-Specific Files

Update the Next.js component to use the shared version:

```typescript
// next/src/components/ui/3d-card.tsx
'use client'

export {
  Card3D,
  type Card3DProps
} from '@katalyst-react/shared/components/ui/Card3D';

// Legacy compatibility if needed
import { Card3D as KatalystCard3D } from '@katalyst-react/shared/components/ui/Card3D';
export default KatalystCard3D;
```

### Step 4: Update Imports

Update all import statements across the codebase:

```typescript
// Before
import { Card3D } from '@/components/ui/3d-card';

// After (preferred)
import { Card3D } from '@katalyst-react/shared/components/ui/Card3D';

// Or (using Next.js wrapper)
import { Card3D } from '@/components/ui/3d-card';
```

## Design Token Integration

### Using Katalyst Tokens

Replace hardcoded values with design system tokens:

```typescript
// Before
className="bg-blue-500 text-white rounded-lg shadow-lg"

// After
className={cn(
  'bg-[var(--katalyst-color-interactive-primary)]',
  'text-[var(--katalyst-color-text-inverse)]',
  'rounded-[var(--katalyst-component-card-border-radius)]',
  'shadow-[var(--katalyst-component-card-shadow)]'
)}
```

### Motion and Animation

Respect reduced motion preferences:

```typescript
// Before
className="transition-all duration-300 hover:scale-105"

// After
className={cn(
  'transition-all duration-[var(--katalyst-animation-duration-300)]',
  'hover:scale-105',
  // Respect reduced motion
  'motion-reduce:transition-none motion-reduce:hover:scale-100'
)}
```

## Accessibility Enhancements

### Required Accessibility Features

Every component must include:

1. **Proper ARIA attributes**
2. **Keyboard navigation support**
3. **Focus management**
4. **Screen reader announcements**
5. **Color contrast compliance**

```typescript
// Example: Accessible button with Katalyst
import { useAccessibility } from '@katalyst-react/shared/components/AccessibilityProvider';

const MyButton = ({ children, ...props }) => {
  const { announce } = useAccessibility();
  
  const handleClick = () => {
    // Announce state changes
    announce('Action completed', 'polite');
    props.onClick?.();
  };
  
  return (
    <Button
      {...props}
      onClick={handleClick}
      // Proper focus management
      className={cn(
        focusRing(),
        props.className
      )}
    >
      {children}
    </Button>
  );
};
```

## Component Patterns

### 1. Compound Components

Use compound component patterns for complex UI:

```typescript
// Export both individual and compound patterns
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  // Simple interface
  Simple: SimpleSelect
};

// Usage
<Select.Root>
  <Select.Trigger>Choose option</Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
  </Select.Content>
</Select.Root>

// Or simple usage
<Select.Simple options={options} />
```

### 2. Polymorphic Components

Support different underlying elements:

```typescript
interface BoxProps<T extends React.ElementType = 'div'> {
  as?: T;
  children: React.ReactNode;
}

const Box = <T extends React.ElementType = 'div'>({
  as,
  children,
  ...props
}: BoxProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof BoxProps<T>>) => {
  const Component = as || 'div';
  return <Component {...props}>{children}</Component>;
};

// Usage
<Box as="section" className="container">Content</Box>
```

### 3. Variant Systems

Use consistent variant patterns:

```typescript
const componentVariants = cva(
  // Base styles using Katalyst tokens
  [
    'inline-flex items-center justify-center',
    // Use design system tokens
    'rounded-[var(--katalyst-component-button-border-radius)]',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-[var(--katalyst-color-interactive-primary)]'],
        secondary: ['bg-[var(--katalyst-color-interactive-secondary)]'],
      },
      size: {
        sm: ['h-8 px-3 text-xs'],
        default: ['h-10 px-4 py-2'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);
```

## Testing Migration

### Component Testing

Test migrated components thoroughly:

```typescript
// Example test for migrated component
import { render, screen } from '@testing-library/react';
import { AccessibilityProvider } from '@katalyst-react/shared/components';
import { Button } from './Button';

const TestWrapper = ({ children }) => (
  <AccessibilityProvider>
    {children}
  </AccessibilityProvider>
);

test('Button renders with Katalyst design tokens', () => {
  render(
    <Button variant="primary">Click me</Button>,
    { wrapper: TestWrapper }
  );
  
  const button = screen.getByRole('button');
  expect(button).toHaveClass('bg-[var(--katalyst-color-interactive-primary)]');
});

test('Button is accessible', async () => {
  const { container } = render(
    <Button>Accessible button</Button>,
    { wrapper: TestWrapper }
  );
  
  // Test accessibility
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Visual Regression Testing

Test visual consistency:

```typescript
// Visual regression test
import { VisualRegressionTester } from '@katalyst-react/shared/test-utils';

test('Button visual consistency', async () => {
  const tester = new VisualRegressionTester();
  
  const results = await tester.testComponent('Button', [
    { variant: 'primary' },
    { variant: 'secondary' },
    { variant: 'web3' },
  ]);
  
  expect(results.get('Button-primary')).toHaveProperty('passed', true);
});
```

## Performance Optimization

### Bundle Size Optimization

1. **Tree Shaking**: Ensure components are tree-shakable
2. **Dynamic Imports**: Lazy load complex components
3. **Minimal Dependencies**: Avoid unnecessary dependencies

```typescript
// Good: Tree-shakable exports
export { Button } from './Button';
export { Input } from './Input';

// Good: Dynamic imports for complex components
const Chart = React.lazy(() => import('./Chart'));

// Good: Minimal dependencies
import { cn } from '../../utils/cn'; // Internal utility
```

### Runtime Performance

1. **Memoization**: Use React.memo for pure components
2. **Callback Optimization**: Use useCallback for event handlers
3. **Ref Forwarding**: Properly forward refs

```typescript
const Button = React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, ...props }, ref) => {
    const handleClick = React.useCallback((event) => {
      onClick?.(event);
    }, [onClick]);
    
    return (
      <button ref={ref} onClick={handleClick} {...props} />
    );
  }
));
```

## Migration Checklist

### Pre-Migration
- [ ] Analyze current component usage
- [ ] Identify breaking changes
- [ ] Plan migration timeline
- [ ] Set up testing environment

### During Migration
- [ ] Create shared component
- [ ] Implement Katalyst design tokens
- [ ] Add accessibility features
- [ ] Create framework wrappers
- [ ] Update imports
- [ ] Add comprehensive tests

### Post-Migration
- [ ] Run visual regression tests
- [ ] Check accessibility compliance
- [ ] Verify performance metrics
- [ ] Update documentation
- [ ] Monitor for issues

## Common Pitfalls

### 1. Hardcoded Values
❌ **Don't use hardcoded colors/sizes**
```typescript
className="bg-blue-500 h-10 rounded-lg"
```

✅ **Use design tokens**
```typescript
className={cn(
  'bg-[var(--katalyst-color-interactive-primary)]',
  'h-[var(--katalyst-component-button-min-height)]',
  'rounded-[var(--katalyst-component-button-border-radius)]'
)}
```

### 2. Missing Accessibility
❌ **Inaccessible component**
```typescript
<div onClick={handleClick}>Button</div>
```

✅ **Accessible component**
```typescript
<button
  onClick={handleClick}
  aria-label="Descriptive label"
  className={focusRing()}
>
  Button
</button>
```

### 3. Framework-Specific Code
❌ **Next.js specific**
```typescript
import { useRouter } from 'next/router';
```

✅ **Framework agnostic**
```typescript
// In shared component - accept navigation as prop
interface Props {
  onNavigate?: (path: string) => void;
}

// In Next.js wrapper
const NextButton = (props) => {
  const router = useRouter();
  const handleNavigate = (path) => router.push(path);
  
  return <SharedButton {...props} onNavigate={handleNavigate} />;
};
```

## Resources

- [Katalyst Design System Tokens](./shared/src/design-system/tokens.ts)
- [Accessibility Provider](./shared/src/components/AccessibilityProvider.tsx)
- [Testing Strategy](./010-testing-strategy.md)
- [Component Examples](./shared/src/components/ui/)

## Support

For migration assistance:
- Review existing migrated components as examples
- Use the AI test generation tools for comprehensive testing
- Check the accessibility compliance utilities
- Follow the established patterns in shared components

---

*This migration guide is part of the Katalyst-React framework documentation and will be updated as new components are migrated.*