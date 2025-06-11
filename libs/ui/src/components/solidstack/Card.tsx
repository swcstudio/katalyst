import { type JSX, Show, splitProps } from 'solid-js';

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: JSX.Element;
  footer?: JSX.Element;
  children?: JSX.Element;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
}

export function Card(props: CardProps) {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'padding',
    'header',
    'footer',
    'children',
    'headerClass',
    'bodyClass',
    'footerClass',
    'class',
  ]);

  const baseClasses = 'rounded-lg overflow-hidden transition-all duration-200';

  const variantClasses = () => {
    switch (local.variant) {
      case 'elevated':
        return 'bg-white shadow-lg border border-gray-100 hover:shadow-xl';
      case 'outlined':
        return 'bg-white border-2 border-gray-200 hover:border-gray-300';
      case 'filled':
        return 'bg-gray-50 border border-gray-200';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-50';
      default:
        return 'bg-white shadow-md border border-gray-200 hover:shadow-lg';
    }
  };

  const sizeClasses = () => {
    switch (local.size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-4xl';
      default:
        return 'max-w-2xl';
    }
  };

  const paddingClasses = () => {
    switch (local.padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const cardClasses = () => {
    return `${baseClasses} ${variantClasses()} ${sizeClasses()} ${local.class || ''}`;
  };

  const bodyClasses = () => {
    const padding = local.header || local.footer ? '' : paddingClasses();
    return `${padding} ${local.bodyClass || ''}`;
  };

  const headerClasses = () => {
    const padding =
      local.padding === 'none'
        ? ''
        : local.padding === 'sm'
          ? 'px-3 pt-3 pb-2'
          : local.padding === 'lg'
            ? 'px-8 pt-8 pb-4'
            : 'px-6 pt-6 pb-4';
    return `border-b border-gray-200 ${padding} ${local.headerClass || ''}`;
  };

  const footerClasses = () => {
    const padding =
      local.padding === 'none'
        ? ''
        : local.padding === 'sm'
          ? 'px-3 pb-3 pt-2'
          : local.padding === 'lg'
            ? 'px-8 pb-8 pt-4'
            : 'px-6 pb-6 pt-4';
    return `border-t border-gray-200 ${padding} ${local.footerClass || ''}`;
  };

  const contentPadding = () => {
    if (local.padding === 'none') return '';
    if (local.header && local.footer) {
      return local.padding === 'sm'
        ? 'px-3 py-2'
        : local.padding === 'lg'
          ? 'px-8 py-4'
          : 'px-6 py-4';
    }
    if (local.header) {
      return local.padding === 'sm'
        ? 'px-3 pb-3 pt-2'
        : local.padding === 'lg'
          ? 'px-8 pb-8 pt-4'
          : 'px-6 pb-6 pt-4';
    }
    if (local.footer) {
      return local.padding === 'sm'
        ? 'px-3 pt-3 pb-2'
        : local.padding === 'lg'
          ? 'px-8 pt-8 pb-4'
          : 'px-6 pt-6 pb-4';
    }
    return paddingClasses();
  };

  return (
    <div {...others} class={cardClasses()}>
      <Show when={local.header}>
        <div class={headerClasses()}>{local.header}</div>
      </Show>

      <div class={`${contentPadding()} ${bodyClasses()}`}>{local.children}</div>

      <Show when={local.footer}>
        <div class={footerClasses()}>{local.footer}</div>
      </Show>
    </div>
  );
}

export interface CardHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

export function CardHeader(props: CardHeaderProps) {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <div {...others} class={`font-semibold text-lg text-gray-900 ${local.class || ''}`}>
      {local.children}
    </div>
  );
}

export interface CardBodyProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

export function CardBody(props: CardBodyProps) {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <div {...others} class={`text-gray-700 ${local.class || ''}`}>
      {local.children}
    </div>
  );
}

export interface CardFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

export function CardFooter(props: CardFooterProps) {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <div {...others} class={`flex items-center justify-end gap-2 ${local.class || ''}`}>
      {local.children}
    </div>
  );
}
