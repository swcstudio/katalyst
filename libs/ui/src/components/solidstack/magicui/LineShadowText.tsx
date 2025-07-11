import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  createEffect,
  createSignal,
  type JSX,
  mergeProps,
  type ParentComponent,
} from 'solid-js';

export interface LineShadowTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  shadowColor?: string;
  shadowIntensity?: number;
  shadowOffset?: number;
}

export const LineShadowText: ParentComponent<LineShadowTextProps> = (props) => {
  const merged = mergeProps(
    {
      shadowColor: 'currentColor',
      shadowIntensity: 3,
      shadowOffset: 1,
    },
    props
  );

  const generateLineShadow = (color: string, intensity: number, offset: number): string => {
    const shadows: string[] = [];
    for (let i = 1; i <= intensity; i++) {
      shadows.push(`${offset * i}px ${offset * i}px 0 ${color}`);
    }
    return shadows.join(', ');
  };

  return (
    <span
      class={css(
        {
          display: 'inline-block',
          textShadow: generateLineShadow(
            merged.shadowColor,
            merged.shadowIntensity,
            merged.shadowOffset
          ),
        },
        merged.class
      )}
      style={merged.style}
    >
      {props.children}
    </span>
  );
};

export interface LineShadowTextDemoProps {
  class?: string;
}

export const LineShadowTextDemo: Component<LineShadowTextDemoProps> = (props) => {
  const [shadowColor, setShadowColor] = createSignal('black');

  // Simulate theme detection - in a real app this would come from theme context
  createEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setShadowColor(isDark ? 'white' : 'black');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setShadowColor(e.matches ? 'white' : 'black');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  });

  return (
    <h1
      class={css(
        {
          textWrap: 'balance',
          fontSize: '3rem',
          fontWeight: '600',
          lineHeight: 1,
          letterSpacing: '-0.025em',
          '@media (min-width: 640px)': {
            fontSize: '3.75rem',
          },
          '@media (min-width: 768px)': {
            fontSize: '4.5rem',
          },
          '@media (min-width: 1024px)': {
            fontSize: '6rem',
          },
        },
        props.class
      )}
    >
      Ship
      <LineShadowText class={css({ fontStyle: 'italic' })} shadowColor={shadowColor()}>
        Fast
      </LineShadowText>
    </h1>
  );
};

export type { LineShadowTextProps, LineShadowTextDemoProps };
