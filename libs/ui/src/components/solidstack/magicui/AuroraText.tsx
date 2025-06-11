import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, type ParentComponent, mergeProps } from 'solid-js';

export interface AuroraTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  colors?: string[];
  animationDuration?: number;
}

export const AuroraText: ParentComponent<AuroraTextProps> = (props) => {
  const merged = mergeProps(
    {
      colors: ['#FF0080', '#7928CA', '#FF4D6D', '#C084FC', '#06B6D4', '#3B82F6', '#8B5CF6'],
      animationDuration: 3,
    },
    props
  );

  const gradientStops = merged.colors
    .map((color, index) => {
      const percentage = (index / (merged.colors.length - 1)) * 100;
      return `${color} ${percentage}%`;
    })
    .join(', ');

  return (
    <span
      class={css(
        {
          display: 'inline-block',
          background: `linear-gradient(90deg, ${gradientStops})`,
          backgroundSize: '200% 200%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          animation: `auroraFlow ${merged.animationDuration}s ease-in-out infinite`,

          '@keyframes auroraFlow': {
            '0%, 100%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
          },
        },
        merged.class
      )}
      style={merged.style}
    >
      {props.children}
    </span>
  );
};

export interface AuroraTextDemoProps {
  class?: string;
}

export const AuroraTextDemo: Component<AuroraTextDemoProps> = (props) => {
  return (
    <h1
      class={css(
        {
          fontSize: '2.25rem',
          fontWeight: 'bold',
          letterSpacing: '-0.025em',
          '@media (min-width: 768px)': {
            fontSize: '3rem',
          },
          '@media (min-width: 1024px)': {
            fontSize: '4.5rem',
          },
        },
        props.class
      )}
    >
      Ship <AuroraText>beautiful</AuroraText>
    </h1>
  );
};

export type { AuroraTextProps, AuroraTextDemoProps };
