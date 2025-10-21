# text-generate-effect.tsx

> Source: `src/ui/text-generate-effect.tsx`

**Package:** `@katalyst/design-system`

## Overview

This module is part of the `@katalyst/design-system` package.

## Dependencies

- `motion/react`
- `react`
- `/lib/utils`

## Exports

### `TextGenerateEffect`

<!-- TODO: Add detailed documentation for TextGenerateEffect -->

## Source Code

```typescript
'use client';
import { motion, stagger, useAnimate } from 'motion/react';
import { useEffect } from 'react';
import { cn } from '/lib/utils';

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');
  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-black opacity-0"
              style={{
                filter: filter ? 'blur(10px)' : 'none',
              }}
            >
              {word}{' '}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn('font-bold', className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

```

---

*Generated documentation for @katalyst/design-system*
