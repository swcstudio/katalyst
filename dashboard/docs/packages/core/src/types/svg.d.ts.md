# svg.d.ts

> Source: `src/types/svg.d.ts`

**Package:** `@katalyst/core`

## Overview

This module is part of the `@katalyst/core` package.

## Dependencies

- `react`
- `react`
- `react`

## Exports

### `SVGProps`

<!-- TODO: Add detailed documentation for SVGProps -->

### `SVGProps`

<!-- TODO: Add detailed documentation for SVGProps -->

### `SVGProps`

<!-- TODO: Add detailed documentation for SVGProps -->

## Source Code

```typescript
/**
 * SVG Type Declarations for SVGR
 *
 * Enables TypeScript support for importing SVG files as React components
 */

declare module '*.svg' {
  import type * as React from 'react';

  export interface SVGProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
    titleId?: string;
  }

  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}

declare module '*.svg?react' {
  import type * as React from 'react';

  export interface SVGProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
    titleId?: string;
  }

  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}

declare module '*.svg?component' {
  import type * as React from 'react';

  export interface SVGProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
    titleId?: string;
  }

  const ReactComponent: React.FC<SVGProps>;
  export default ReactComponent;
}

declare module '*.svg?inline' {
  const content: string;
  export default content;
}

```

---

*Generated documentation for @katalyst/core*
