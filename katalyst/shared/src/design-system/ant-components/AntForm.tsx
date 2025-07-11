import * as React from 'react';
import { Form as AntdForm, Input as AntdInput, Select as AntdSelect, Button as AntdButton } from 'antd';
import type { FormProps as AntdFormProps, InputProps as AntdInputProps, SelectProps as AntdSelectProps } from 'antd';
import { cn } from '../utils';
import type { AntComponentProps } from '../types';

export interface AntFormProps extends AntdFormProps, AntComponentProps {
  variant?: 'default' | 'horizontal' | 'vertical' | 'inline';
}

const AntForm = React.forwardRef<HTMLFormElement, AntFormProps>(
  ({ className, variant = 'default', size = 'middle', ...props }, ref) => {
    const getLayout = (variant: AntFormProps['variant']) => {
      switch (variant) {
        case 'horizontal':
          return 'horizontal';
        case 'vertical':
          return 'vertical';
        case 'inline':
          return 'inline';
        default:
          return 'vertical';
      }
    };

    return (
      <AntdForm
        ref={ref}
        layout={getLayout(variant)}
        size={size}
        className={cn('katalyst-ant-form', className)}
        {...props}
      />
    );
  }
);

AntForm.displayName = 'AntForm';

const AntFormItem = AntdForm.Item;
const AntFormList = AntdForm.List;
const AntFormProvider = AntdForm.Provider;

export interface AntInputProps extends AntdInputProps, AntComponentProps {}

const AntInput = React.forwardRef<HTMLInputElement, AntInputProps>(
  ({ className, size = 'middle', ...props }, ref) => (
    <AntdInput
      ref={ref}
      size={size}
      className={cn('katalyst-ant-input', className)}
      {...props}
    />
  )
);

AntInput.displayName = 'AntInput';

const AntInputPassword = AntdInput.Password;
const AntInputSearch = AntdInput.Search;
const AntInputTextArea = AntdInput.TextArea;

export interface AntSelectProps extends AntdSelectProps, AntComponentProps {}

const AntSelect = React.forwardRef<HTMLSelectElement, AntSelectProps>(
  ({ className, size = 'middle', ...props }, ref) => (
    <AntdSelect
      ref={ref}
      size={size}
      className={cn('katalyst-ant-select', className)}
      {...props}
    />
  )
);

AntSelect.displayName = 'AntSelect';

const AntSelectOption = AntdSelect.Option;

export {
  AntForm,
  AntFormItem,
  AntFormList,
  AntFormProvider,
  AntInput,
  AntInputPassword,
  AntInputSearch,
  AntInputTextArea,
  AntSelect,
  AntSelectOption,
};
