import * as React from 'react';
import { Card as AntdCard } from 'antd';
import type { CardProps as AntdCardProps } from 'antd';
import { cn } from '../utils';
import type { AntComponentProps } from '../types';

export interface AntCardProps extends AntdCardProps, AntComponentProps {
  variant?: 'default' | 'bordered' | 'inner';
}

const AntCard = React.forwardRef<HTMLDivElement, AntCardProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const getBordered = (variant: AntCardProps['variant']) => {
      return variant === 'bordered' || variant === 'default';
    };

    const getType = (variant: AntCardProps['variant']) => {
      return variant === 'inner' ? 'inner' : undefined;
    };

    return (
      <AntdCard
        ref={ref}
        bordered={getBordered(variant)}
        type={getType(variant)}
        size={size}
        className={cn('katalyst-ant-card', className)}
        {...props}
      />
    );
  }
);

AntCard.displayName = 'AntCard';

const AntCardMeta = AntdCard.Meta;

export { AntCard, AntCardMeta };
