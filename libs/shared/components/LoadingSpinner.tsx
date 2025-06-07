import { css } from '../../../src/styled-system/css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: '4',
    md: '8',
    lg: '12'
  };

  return (
    <div
      class={css({
        width: sizeMap[props.size || 'md'],
        height: sizeMap[props.size || 'md'],
        border: '2px solid',
        borderColor: 'gray.200',
        borderTopColor: props.color || 'emerald.500',
        borderRadius: 'full',
        animation: 'spin 1s linear infinite',
      })}
    />
  );
};
