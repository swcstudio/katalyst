import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import type { BaseComponentProps } from '../types';

const headingVariants = cva('font-bold tracking-tight', {
  variants: {
    level: {
      1: 'text-4xl lg:text-5xl',
      2: 'text-3xl lg:text-4xl',
      3: 'text-2xl lg:text-3xl',
      4: 'text-xl lg:text-2xl',
      5: 'text-lg lg:text-xl',
      6: 'text-base lg:text-lg',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    level: 1,
    color: 'default',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants>,
    BaseComponentProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, color, ...props }, ref) => {
    const Comp = `h${level}` as keyof JSX.IntrinsicElements;
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ level, color, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
      success: 'text-green-600',
      warning: 'text-yellow-600',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants>,
    BaseComponentProps {}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, color, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(textVariants({ size, weight, color, className }))}
      {...props}
    />
  )
);
Text.displayName = 'Text';

const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & BaseComponentProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
      {...props}
    />
  )
);
Code.displayName = 'Code';

const Pre = React.forwardRef<HTMLPreElement, React.HTMLAttributes<HTMLPreElement> & BaseComponentProps>(
  ({ className, ...props }, ref) => (
    <pre
      ref={ref}
      className={cn(
        'overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm',
        className
      )}
      {...props}
    />
  )
);
Pre.displayName = 'Pre';

const Blockquote = React.forwardRef<HTMLQuoteElement, React.HTMLAttributes<HTMLQuoteElement> & BaseComponentProps>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  )
);
Blockquote.displayName = 'Blockquote';

export { Heading, Text, Code, Pre, Blockquote, headingVariants, textVariants };
