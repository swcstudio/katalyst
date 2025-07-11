import { css } from '@sse/ui/styled-system/css';
import { Component, type JSX, type ParentComponent, mergeProps } from 'solid-js';

export interface ShineBorderProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  shineColor?: string | string[];
  duration?: number;
  borderRadius?: number;
  borderWidth?: number;
}

export const ShineBorder: ParentComponent<ShineBorderProps> = (props) => {
  const merged = mergeProps(
    {
      shineColor: '#ffffff',
      duration: 14,
      borderRadius: 8,
      borderWidth: 1,
    },
    props
  );

  const shineColors = Array.isArray(merged.shineColor) ? merged.shineColor : [merged.shineColor];
  const gradientColors = shineColors.join(', ');

  return (
    <div
      class={css(
        {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: `${merged.borderRadius}px`,
          padding: `${merged.borderWidth}px`,
          background: `linear-gradient(45deg, transparent 30%, ${gradientColors}, transparent 70%)`,
          backgroundSize: '200% 200%',
          animation: `shine ${merged.duration}s ease-in-out infinite`,

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: `${merged.borderWidth}px`,
            borderRadius: `${merged.borderRadius - merged.borderWidth}px`,
            background: 'white',
            zIndex: 1,
          },
        },
        merged.class
      )}
      style={{
        '--shine-duration': `${merged.duration}s`,
        '--shine-colors': gradientColors,
        ...merged.style,
      }}
    >
      <div
        class={css({
          position: 'relative',
          zIndex: 2,
          borderRadius: `${merged.borderRadius - merged.borderWidth}px`,
          overflow: 'hidden',
        })}
      >
        {props.children}
      </div>
    </div>
  );
};

export interface ShineBorderCardDemoProps {
  class?: string;
  children?: JSX.Element;
  shineColor?: string | string[];
}

export const ShineBorderCardDemo: ParentComponent<ShineBorderCardDemoProps> = (props) => {
  return (
    <ShineBorder
      class={css(
        {
          maxWidth: '350px',
          width: '100%',
        },
        props.class
      )}
      shineColor={props.shineColor || ['#A07CFE', '#FE8FB5', '#FFBE7B']}
    >
      <div
        class={css({
          backgroundColor: 'white',
          borderRadius: '6px',
          padding: '16px',
        })}
      >
        {props.children}
      </div>
    </ShineBorder>
  );
};

// CSS Animation keyframes - this would typically be added to global styles
const shineStyles = `
@keyframes shine {
  0% {
    background-position: -200% -200%;
  }
  100% {
    background-position: 200% 200%;
  }
}
`;

export type { ShineBorderProps, ShineBorderCardDemoProps };
