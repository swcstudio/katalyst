# Button Component

> A versatile button component with multiple variants, sizes, and states for user interactions

## Overview

The Button component is a fundamental UI element that provides consistent styling and behavior across the SWC Studio ecosystem. It supports multiple variants, sizes, loading states, and accessibility features out of the box.

**Key Features:**
- Multiple visual variants (primary, secondary, outline, ghost, link)
- Responsive sizing system (xs, sm, md, lg, xl)
- Built-in loading and disabled states
- Full accessibility support with ARIA attributes
- Icon support with proper spacing
- Customizable through design system tokens

## Installation

```bash
import { Button } from '@swcstudio/shared';
```

## Basic Usage

```tsx
import React from 'react';
import { Button } from '@swcstudio/shared';

function Example() {
  return (
    <div className="space-x-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'link' \| 'destructive'` | `'primary'` | ❌ | Visual style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | ❌ | Button size |
| `loading` | `boolean` | `false` | ❌ | Shows loading spinner and disables interaction |
| `disabled` | `boolean` | `false` | ❌ | Disables the button |
| `fullWidth` | `boolean` | `false` | ❌ | Makes button take full width of container |
| `leftIcon` | `React.ReactNode` | `undefined` | ❌ | Icon displayed before the text |
| `rightIcon` | `React.ReactNode` | `undefined` | ❌ | Icon displayed after the text |
| `onClick` | `(event: React.MouseEvent) => void` | `undefined` | ❌ | Click event handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | ❌ | HTML button type |
| `className` | `string` | `undefined` | ❌ | Additional CSS classes |
| `children` | `React.ReactNode` | `undefined` | ✅ | Button content |

## Examples

### Variants

```tsx
import { Button } from '@swcstudio/shared';

function VariantExamples() {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  );
}
```

### Sizes

```tsx
import { Button } from '@swcstudio/shared';

function SizeExamples() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
    </div>
  );
}
```

### With Icons

```tsx
import { Button } from '@swcstudio/shared';
import { ChevronRightIcon, DownloadIcon, PlusIcon } from '@heroicons/react/24/outline';

function IconExamples() {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button 
          variant="primary" 
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          Add Item
        </Button>
        <Button 
          variant="secondary" 
          rightIcon={<ChevronRightIcon className="w-4 h-4" />}
        >
          Continue
        </Button>
        <Button 
          variant="outline" 
          leftIcon={<DownloadIcon className="w-4 h-4" />}
        >
          Download
        </Button>
      </div>
    </div>
  );
}
```

### Loading States

```tsx
import React, { useState } from 'react';
import { Button } from '@swcstudio/shared';

function LoadingExample() {
  const [loading, setLoading] = useState(false);
  
  const handleAsyncAction = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Action completed!');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-x-4">
      <Button 
        variant="primary" 
        loading={loading}
        onClick={handleAsyncAction}
      >
        {loading ? 'Processing...' : 'Start Process'}
      </Button>
      <Button 
        variant="secondary" 
        disabled={loading}
      >
        Cancel
      </Button>
    </div>
  );
}
```

### Form Integration

```tsx
import React from 'react';
import { Button } from '@swcstudio/shared';
import { useForm } from 'react-hook-form';

function FormExample() {
  const { register, handleSubmit, formState } = useForm();
  
  const onSubmit = (data) => {
    console.log('Form data:', data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register('email', { required: true })}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="flex space-x-3">
        <Button 
          type="submit" 
          variant="primary"
          disabled={formState.isSubmitting}
          loading={formState.isSubmitting}
        >
          Submit Form
        </Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
    </form>
  );
}
```

### Full Width Button

```tsx
import { Button } from '@swcstudio/shared';

function FullWidthExample() {
  return (
    <div className="max-w-md">
      <Button variant="primary" fullWidth>
        Full Width Button
      </Button>
    </div>
  );
}
```

## Styling & Theming

### CSS Classes

The Button component applies these CSS classes based on props:

- `.swc-button` - Base button class
- `.swc-button--{variant}` - Variant-specific styling
- `.swc-button--{size}` - Size-specific styling
- `.swc-button--loading` - Applied when loading
- `.swc-button--disabled` - Applied when disabled
- `.swc-button--full-width` - Applied when fullWidth is true

### Custom Styling

```tsx
import { Button } from '@swcstudio/shared';

function CustomStyledButton() {
  return (
    <Button 
      variant="primary"
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg"
    >
      Custom Gradient Button
    </Button>
  );
}
```

### Theme Integration

```tsx
import { Button } from '@swcstudio/shared';

function ThemedButton() {
  return (
    <Button 
      variant="primary"
      style={{
        '--button-primary-bg': 'var(--color-brand-500)',
        '--button-primary-hover-bg': 'var(--color-brand-600)',
        '--button-primary-text': 'var(--color-white)',
      } as React.CSSProperties}
    >
      Custom Themed Button
    </Button>
  );
}
```

### Design System Integration

The Button component uses design system tokens for consistent theming:

```css
.swc-button--primary {
  background-color: var(--colors-primary-500);
  color: var(--colors-primary-contrast);
  border-radius: var(--radii-button);
  font-size: var(--fontSizes-button-md);
  padding: var(--space-button-y-md) var(--space-button-x-md);
  font-weight: var(--fontWeights-medium);
  transition: var(--transitions-button);
}

.swc-button--primary:hover {
  background-color: var(--colors-primary-600);
  transform: var(--transforms-button-hover);
}
```

## Accessibility

### ARIA Support

The Button component includes comprehensive accessibility features:

- **Role**: Automatically set to `button` for semantic meaning
- **Labels**: Supports `aria-label` and `aria-labelledby` for screen readers
- **States**: Manages `aria-disabled` and `aria-busy` for interactive states
- **Descriptions**: Supports `aria-describedby` for additional context

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` | Activates the button |
| `Space` | Activates the button |
| `Tab` | Moves focus to next focusable element |
| `Shift + Tab` | Moves focus to previous focusable element |

### Screen Reader Support

```tsx
import { Button } from '@swcstudio/shared';

function AccessibleButton() {
  return (
    <div>
      <Button
        variant="primary"
        aria-label="Add new item to your shopping cart"
        aria-describedby="add-item-help"
      >
        Add to Cart
      </Button>
      <div id="add-item-help" className="sr-only">
        This will add the current item to your shopping cart for purchase
      </div>
    </div>
  );
}
```

### Focus Management

```tsx
import React, { useRef } from 'react';
import { Button } from '@swcstudio/shared';

function FocusExample() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleFocusButton = () => {
    buttonRef.current?.focus();
  };
  
  return (
    <div className="space-x-4">
      <Button onClick={handleFocusButton}>
        Focus Next Button
      </Button>
      <Button 
        ref={buttonRef}
        variant="primary"
      >
        This button will be focused
      </Button>
    </div>
  );
}
```

## Performance

### Optimization Tips

1. **Memoization**: The Button component is wrapped with `React.memo` for performance
2. **Event Handler Stability**: Use `useCallback` for onClick handlers to prevent re-renders
3. **Icon Optimization**: Import icons specifically rather than entire icon libraries

```tsx
import React, { useCallback } from 'react';
import { Button } from '@swcstudio/shared';

function OptimizedButton() {
  // ✅ Stable callback prevents unnecessary re-renders
  const handleClick = useCallback(() => {
    console.log('Button clicked!');
  }, []);
  
  return (
    <Button 
      variant="primary"
      onClick={handleClick}
    >
      Optimized Button
    </Button>
  );
}
```

### Bundle Size

- **Gzipped Size**: ~2.1KB
- **Tree-shakeable**: ✅ (only imports used variants and sizes)
- **Dependencies**: React, clsx, cva
- **CSS**: ~1.2KB for all variants and sizes

### Performance Monitoring

```tsx
import React, { Profiler } from 'react';
import { Button } from '@swcstudio/shared';

function ProfiledButton() {
  const onRenderCallback = (id, phase, actualDuration) => {
    console.log('Button render time:', actualDuration);
  };
  
  return (
    <Profiler id="Button" onRender={onRenderCallback}>
      <Button variant="primary">
        Profiled Button
      </Button>
    </Profiler>
  );
}
```

## Testing

### Unit Tests

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@swcstudio/shared';

describe('Button Component', () => {
  it('renders correctly with text', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('swc-button');
  });
  
  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('swc-button--secondary');
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
```

### Integration Tests

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KatalystProvider, Button } from '@swcstudio/shared';

function TestApp() {
  return (
    <KatalystProvider>
      <Button variant="primary">Test Button</Button>
    </KatalystProvider>
  );
}

describe('Button Integration', () => {
  it('works within provider context', () => {
    render(<TestApp />);
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('swc-button--primary');
  });
  
  it('inherits theme from provider', () => {
    render(
      <KatalystProvider theme={{ mode: 'dark' }}>
        <Button variant="primary">Dark Button</Button>
      </KatalystProvider>
    );
    
    // Theme-specific assertions would go here
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Accessibility Tests

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@swcstudio/shared';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Button variant="primary">Accessible Button</Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('provides proper ARIA attributes when loading', async () => {
    const { container } = render(
      <Button loading>Loading Button</Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## API Reference

### Component Interface

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Shows loading spinner and disables interaction */
  loading?: boolean;
  
  /** Makes button take full width of container */
  fullWidth?: boolean;
  
  /** Icon displayed before the text */
  leftIcon?: React.ReactNode;
  
  /** Icon displayed after the text */
  rightIcon?: React.ReactNode;
  
  /** Button content */
  children: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Custom styles */
  style?: React.CSSProperties;
  
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### Ref Interface

```typescript
// The Button component forwards refs to the underlying button element
const ButtonRef = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    // Implementation
  }
);
```

### Event Handlers

```typescript
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

// Event object properties available in onClick
interface ButtonClickEvent extends React.MouseEvent<HTMLButtonElement> {
  currentTarget: HTMLButtonElement;
  target: HTMLButtonElement;
  button: number; // Which button was clicked (0 = left, 1 = middle, 2 = right)
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}
```

## Related Components

- [IconButton](./icon-button.md) - Button optimized for icon-only usage
- [ButtonGroup](./button-group.md) - Group multiple buttons together
- [ActionBar](./action-bar.md) - Container for primary/secondary actions
- [Form](./form.md) - Form components that work well with Button

## Troubleshooting

### Common Issues

**Issue**: Button not responding to clicks
```tsx
// ❌ Incorrect - missing onClick handler
<Button variant="primary">Click me</Button>

// ✅ Correct - with click handler
<Button variant="primary" onClick={() => console.log('clicked')}>
  Click me
</Button>
```

**Issue**: Loading state not working
```tsx
// ❌ Incorrect - loading state not managed
<Button loading>Loading</Button>

// ✅ Correct - loading state managed with state
const [loading, setLoading] = useState(false);
<Button loading={loading} onClick={() => setLoading(true)}>
  {loading ? 'Loading...' : 'Click me'}
</Button>
```

**Issue**: Icons not displaying properly
```tsx
// ❌ Incorrect - icon too large or not styled
<Button leftIcon={<SomeIcon />}>With Icon</Button>

// ✅ Correct - icon properly sized
<Button leftIcon={<SomeIcon className="w-4 h-4" />}>
  With Icon
</Button>
```

**Issue**: Styling not applied in custom themes
```tsx
// ❌ Incorrect - missing provider
<Button variant="primary">Themed</Button>

// ✅ Correct - wrapped in provider
<KatalystProvider theme={customTheme}>
  <Button variant="primary">Themed</Button>
</KatalystProvider>
```

### Debug Mode

```tsx
import { Button } from '@swcstudio/shared';

function DebugButton() {
  return (
    <Button 
      variant="primary"
      data-testid="debug-button"
      onMouseEnter={(e) => console.log('Button hovered:', e)}
      onFocus={(e) => console.log('Button focused:', e)}
      onClick={(e) => console.log('Button clicked:', e)}
    >
      Debug Button
    </Button>
  );
}
```

## Version History

| Version | Changes |
|---------|---------|
| 2.1.0 | Added destructive variant and improved accessibility |
| 2.0.0 | Breaking: Updated prop names, added loading state |
| 1.3.0 | Added icon support and fullWidth prop |
| 1.2.0 | Performance optimizations and bundle size reduction |
| 1.1.0 | Added size variants and improved theming |
| 1.0.0 | Initial release with basic variants |

## Contributing

To contribute to the Button component:

1. Update the component source code in `shared/src/components/ui/Button.tsx`
2. Add or update tests in `shared/src/components/ui/__tests__/Button.test.tsx`
3. Update this documentation if needed
4. Submit a pull request with clear description of changes

## License

MIT - see [LICENSE](../../LICENSE) for details.