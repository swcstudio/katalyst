# @katalyst/test-utils

AI-powered testing utilities including test generation, component testing, coverage analysis, and visual regression.

## Overview

The `@katalyst/test-utils` package provides advanced testing tools with AI-powered test generation, making it easier to maintain high test coverage.

### Key Features

- 🤖 **AI Test Generation** - Generate tests from code
- 🧪 **Component Testing** - React component test utilities
- 📊 **Coverage Analysis** - Advanced coverage reporting
- 📸 **Visual Regression** - Screenshot comparison
- 🎯 **Type-Safe** - Full TypeScript support
- 🔧 **Test Fixtures** - Pre-built test data
- ⚡ **Fast** - Optimized test execution

## Installation

```typescript
import { generateTests } from '@katalyst/test-utils';
```

## Quick Start

```typescript
import { generateTests } from '@katalyst/test-utils';

// Generate tests for a component
const tests = await generateTests({
  componentPath: './src/Button.tsx',
  outputPath: './tests/Button.test.tsx'
});
```

## AI Test Generator

```typescript
import { AITestGenerator } from '@katalyst/test-utils';

const generator = new AITestGenerator({
  model: 'claude-3-opus',
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Generate tests
const tests = await generator.generateTests({
  code: componentCode,
  framework: 'vitest',
  coverage: 'comprehensive'
});
```

## Component Test Generator

```typescript
import { ComponentTestGenerator } from '@katalyst/test-utils';

const generator = new ComponentTestGenerator();

// Generate component tests
const tests = await generator.generate({
  componentPath: './src/MyComponent.tsx',
  testPath: './tests/MyComponent.test.tsx',
  includeSnapshots: true,
  includeAccessibility: true
});
```

## Coverage Analyzer

```typescript
import { CoverageAnalyzer } from '@katalyst/test-utils';

const analyzer = new CoverageAnalyzer();

// Analyze coverage
const report = await analyzer.analyze({
  coverageFile: './coverage/coverage-final.json',
  threshold: 80
});

console.log('Coverage:', report.overall);
console.log('Uncovered files:', report.uncovered);
```

## Visual Regression

```typescript
import { VisualRegression } from '@katalyst/test-utils';

const vr = new VisualRegression({
  baselineDir: './tests/baselines',
  snapshotsDir: './tests/snapshots'
});

// Take screenshot
await vr.capture('button-default', <Button>Click</Button>);

// Compare with baseline
const diff = await vr.compare('button-default');

if (diff.hasDifference) {
  console.log('Visual regression detected');
}
```

## Test Fixtures

```typescript
import { fixtures } from '@katalyst/test-utils';

// User fixtures
const user = fixtures.user();
const admin = fixtures.user({ role: 'admin' });

// Data fixtures
const products = fixtures.products(10);
const orders = fixtures.orders(5);
```

## Testing Utilities

```typescript
import { 
  render, 
  screen, 
  waitFor, 
  userEvent 
} from '@katalyst/test-utils';

test('button clicks', async () => {
  render(<Button onClick={handleClick}>Click</Button>);
  
  const button = screen.getByText('Click');
  await userEvent.click(button);
  
  await waitFor(() => {
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Best Practices

1. **Generate tests early** - Use AI generation as starting point
2. **Review generated tests** - Always review AI-generated tests
3. **Maintain coverage** - Keep coverage above 80%
4. **Visual regression** - Test visual changes
5. **Use fixtures** - Consistent test data
6. **Test accessibility** - Include a11y tests

## Related Documentation

- [Core Package](./core.md) - Components to test
- [Hooks Package](./hooks.md) - Testing hooks

---

**Version**: N/A (Monorepo)  
**Last Updated**: 2024  
**Status**: Production Ready
