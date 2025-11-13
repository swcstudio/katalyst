import { cn } from '@/lib/utils';
import Link from 'next/link';

type ButtonProps = {
  invert?: boolean;
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
);

export function Button({ invert = false, className, children, ...props }: ButtonProps) {
  className = cn(
    // Base styles using Katalyst design tokens
    'inline-flex items-center justify-center rounded-full transition-all duration-200',
    'text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    // Use Katalyst component tokens for consistent sizing
    'px-4 py-1.5 min-h-[2.25rem]',
    // Theme-aware colors using Katalyst tokens
    invert
      ? [
          'bg-white text-neutral-950 hover:bg-neutral-200',
          'dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200',
          'focus-visible:ring-white focus-visible:ring-offset-neutral-950',
        ]
      : [
          'bg-neutral-950 text-white hover:bg-neutral-800',
          'dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200',
          'focus-visible:ring-neutral-950 focus-visible:ring-offset-white',
          'dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950',
        ],
    className
  );

  const inner = <span className="relative top-px">{children}</span>;

  if (typeof props.href === 'undefined') {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    );
  }

  return (
    <Link className={className} {...props}>
      {inner}
    </Link>
  );
}
