import * as React from 'react';
import { cn } from '../utils';
import type { BaseComponentProps } from '../types';

const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & BaseComponentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
);
Container.displayName = 'Container';

const Grid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & BaseComponentProps & {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}>(({ className, cols = 1, gap = 'md', ...props }, ref) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  };

  const gridGap = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      ref={ref}
      className={cn('grid', gridCols[cols], gridGap[gap], className)}
      {...props}
    />
  );
});
Grid.displayName = 'Grid';

const Flex = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & BaseComponentProps & {
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}>(({ className, direction = 'row', align = 'start', justify = 'start', wrap = false, gap = 'none', ...props }, ref) => {
  const flexDirection = direction === 'col' ? 'flex-col' : 'flex-row';
  const alignItems = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  const justifyContent = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  const flexGap = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex',
        flexDirection,
        alignItems[align],
        justifyContent[justify],
        wrap && 'flex-wrap',
        flexGap[gap],
        className
      )}
      {...props}
    />
  );
});
Flex.displayName = 'Flex';

const Stack = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & BaseComponentProps & {
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}>(({ className, gap = 'md', ...props }, ref) => {
  const stackGap = {
    none: 'space-y-0',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  };

  return (
    <div
      ref={ref}
      className={cn('flex flex-col', stackGap[gap], className)}
      {...props}
    />
  );
});
Stack.displayName = 'Stack';

export { Container, Grid, Flex, Stack };
