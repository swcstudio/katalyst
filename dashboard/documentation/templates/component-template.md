# {ComponentName}

> {Brief description of what this component does and when to use it}

## Overview

{Detailed description of the component's purpose, functionality, and key features}

## Installation

```bash
import { {ComponentName} } from '@swcstudio/shared';
```

## Basic Usage

```tsx
import React from 'react';
import { {ComponentName} } from '@swcstudio/shared';

function Example() {
  return (
    <{ComponentName}>
      {/* Basic usage example */}
    </{ComponentName}>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `prop1` | `string` | `undefined` | ✅ | Description of prop1 |
| `prop2` | `boolean` | `false` | ❌ | Description of prop2 |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | ❌ | Visual style variant |

## Examples

### Basic Example

```tsx
<{ComponentName} prop1="value">
  Basic content
</{ComponentName}>
```

### Advanced Example

```tsx
<{ComponentName} 
  prop1="value"
  prop2={true}
  variant="secondary"
  onAction={(data) => console.log(data)}
>
  Advanced usage with callbacks
</{ComponentName}>
```

### Integration Example

```tsx
import { {ComponentName}, KatalystProvider } from '@swcstudio/shared';

function App() {
  return (
    <KatalystProvider>
      <{ComponentName} prop1="integrated">
        Working within the provider ecosystem
      </{ComponentName}>
    </KatalystProvider>
  );
}
```

## Styling & Theming

### CSS Classes

The component applies these CSS classes:

- `.{component-name}` - Base component class
- `.{component-name}--{variant}` - Variant-specific styling
- `.{component-name}__element` - Internal element styling

### Custom Styling

```tsx
<{ComponentName} 
  className="custom-styling"
  style={{ margin: '1rem' }}
>
  Custom styled component
</{ComponentName}>
```

### Theme Integration

```tsx
// Using design system tokens
<{ComponentName} 
  variant="primary"
  theme={{
    colors: {
      primary: 'var(--katalyst-color-primary)',
      secondary: 'var(--katalyst-color-secondary)'
    }
  }}
>
  Themed component
</{ComponentName}>
```

## Accessibility

### ARIA Support

- **Role**: `{aria-role}`
- **Labels**: Supports `aria-label` and `aria-labelledby`
- **States**: Manages `aria-expanded`, `aria-selected` as needed
- **Descriptions**: Supports `aria-describedby` for additional context

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` | Activates the component |
| `Space` | Alternative activation |
| `Tab` | Moves focus to next element |
| `Shift + Tab` | Moves focus to previous element |

### Screen Reader Support

```tsx
<{ComponentName}
  aria-label="Descriptive label"
  aria-describedby="help-text"
>
  Accessible content
</{ComponentName}>
<div id="help-text">Additional context for screen readers</div>
```

## Performance

### Optimization Tips

1. **Memoization**: The component is wrapped with `React.memo` for performance
2. **Lazy Loading**: Use dynamic imports for better code splitting
3. **Props Stability**: Use `useCallback` for event handlers to prevent re-renders

```tsx
const handleAction = useCallback((data) => {
  // Stable callback prevents unnecessary re-renders
  console.log(data);
}, []);

<{ComponentName} onAction={handleAction} />
```

### Bundle Size

- **Gzipped**: ~{X}KB
- **Tree-shakeable**: ✅
- **Dependencies**: {list of dependencies}

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { {ComponentName} } from '@swcstudio/shared';

describe('{ComponentName}', () => {
  it('renders correctly', () => {
    render(<{ComponentName} prop1="test">Content</{ComponentName}>);
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByRole('{role}')).toHaveAttribute('prop1', 'test');
  });

  it('handles interactions', () => {
    const handleAction = jest.fn();
    render(
      <{ComponentName} onAction={handleAction}>
        Interactive content
      </{ComponentName}>
    );

    fireEvent.click(screen.getByRole('{role}'));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

```tsx
import { render, screen } from '@testing-library/react';
import { KatalystProvider, {ComponentName} } from '@swcstudio/shared';

it('works within provider context', () => {
  render(
    <KatalystProvider>
      <{ComponentName} prop1="test">
        Provider integration
      </{ComponentName}>
    </KatalystProvider>
  );

  // Test provider-dependent functionality
  expect(screen.getByText('Provider integration')).toBeInTheDocument();
});
```

## API Reference

### Component Interface

```typescript
interface {ComponentName}Props {
  /** Primary prop description */
  prop1: string;
  
  /** Optional prop description */
  prop2?: boolean;
  
  /** Visual style variant */
  variant?: 'primary' | 'secondary';
  
  /** Event handler for actions */
  onAction?: (data: any) => void;
  
  /** Child elements */
  children?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Inline styles */
  style?: React.CSSProperties;
}
```

### Event Callbacks

```typescript
type ActionHandler = (data: {
  type: string;
  payload: any;
  timestamp: number;
}) => void;
```

## Related Components

- [{RelatedComponent1}](./{related-component-1}.md) - Related functionality
- [{RelatedComponent2}](./{related-component-2}.md) - Complementary component
- [{ProviderComponent}](./{provider-component}.md) - Required provider

## Troubleshooting

### Common Issues

**Issue**: Component not rendering correctly
```tsx
// ❌ Incorrect usage
<{ComponentName} />

// ✅ Correct usage
<{ComponentName} prop1="required-value">
  Content is required
</{ComponentName}>
```

**Issue**: Styling not applied
```tsx
// ❌ Missing provider
<{ComponentName}>Content</{ComponentName}>

// ✅ Wrapped in provider
<KatalystProvider>
  <{ComponentName}>Content</{ComponentName}>
</KatalystProvider>
```

**Issue**: TypeScript errors
```bash
# Make sure you have the correct types installed
npm install @types/react @types/react-dom
```

### Debug Mode

```tsx
<{ComponentName} 
  debug={process.env.NODE_ENV === 'development'}
  onDebug={(info) => console.log('Debug info:', info)}
>
  Content with debug information
</{ComponentName}>
```

## Version History

| Version | Changes |
|---------|---------|
| 1.2.0 | Added accessibility improvements |
| 1.1.0 | Performance optimizations |
| 1.0.0 | Initial release |

## Contributing

To contribute to this component:

1. Update the component source code
2. Add or update tests
3. Update this documentation
4. Submit a pull request

## License

MIT - see [LICENSE](../../LICENSE) for details.