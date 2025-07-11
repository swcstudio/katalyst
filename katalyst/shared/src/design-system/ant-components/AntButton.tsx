import * as React from 'react';
import { Button as AntdButton } from 'antd';
import type { ButtonProps as AntdButtonProps } from 'antd';
import { cn } from '../utils';
import type { AntComponentProps } from '../types';

export interface AntButtonProps extends AntdButtonProps, AntComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'link' | 'text' | 'dashed';
}

const AntButton = React.forwardRef<HTMLButtonElement, AntButtonProps>(
  ({ className, variant = 'default', size = 'middle', ...props }, ref) => {
    const getButtonType = (variant: AntButtonProps['variant']) => {
      switch (variant) {
        case 'primary':
          return 'primary';
        case 'secondary':
          return 'default';
        case 'ghost':
          return 'default';
        case 'link':
          return 'link';
        case 'text':
          return 'text';
        case 'dashed':
          return 'dashed';
        default:
          return 'default';
      }
    };

    const getButtonGhost = (variant: AntButtonProps['variant']) => {
      return variant === 'ghost';
    };

    return (
      <AntdButton
        ref={ref}
        type={getButtonType(variant)}
        ghost={getButtonGhost(variant)}
        size={size}
        className={cn('katalyst-ant-button', className)}
        {...props}
      />
    );
  }
);

AntButton.displayName = 'AntButton';

export { AntButton };
