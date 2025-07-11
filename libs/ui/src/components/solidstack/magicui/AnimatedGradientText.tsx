import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, type ParentComponent, mergeProps } from 'solid-js';

export interface AnimatedGradientTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  colors?: string[];
  colorFrom?: string;
  colorTo?: string;
  speed?: number;
  animationDuration?: number;
}

export const AnimatedGradientText: ParentComponent<AnimatedGradientTextProps> = (props) => {
  const merged = mergeProps(
    {
      colors: ['#ffaa40', '#9c40ff', '#ffaa40'],
      speed: 1,
      animationDuration: 3,
    },
    props
  );

  const getGradientColors = (): string => {
    if (merged.colorFrom && merged.colorTo) {
      return `${merged.colorFrom}, ${merged.colorTo}, ${merged.colorFrom}`;
    }
    return merged.colors.join(', ');
  };

  const animationSpeed = merged.speed
    ? merged.animationDuration / merged.speed
    : merged.animationDuration;

  return (
    <span
      class={css(
        {
          display: 'inline-block',
          background: `linear-gradient(-45deg, ${getGradientColors()})`,
          backgroundSize: '300% 300%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          animation: `gradient ${animationSpeed}s ease infinite`,

          '@keyframes gradient': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
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

export interface AnimatedGradientTextDemoProps {
  class?: string;
}

export const AnimatedGradientTextDemo: Component<AnimatedGradientTextDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          group: true,
          position: 'relative',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '9999px',
          paddingX: '16px',
          paddingY: '6px',
          boxShadow: 'inset 0 -8px 10px #8fdfff1f',
          transition: 'box-shadow 500ms ease-out',
          '&:hover': {
            boxShadow: 'inset 0 -5px 10px #8fdfff3f',
          },
        },
        props.class
      )}
    >
      <span
        class={css({
          position: 'absolute',
          inset: 0,
          display: 'block',
          height: '100%',
          width: '100%',
          borderRadius: 'inherit',
          background: 'linear-gradient(-45deg, #ffaa4050, #9c40ff50, #ffaa4050)',
          backgroundSize: '300% 300%',
          padding: '1px',
          animation: 'gradient 3s ease infinite',
        })}
        style={{
          'webkit-mask': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          'webkit-mask-composite': 'destination-out',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          'mask-composite': 'subtract',
          'webkit-clip-path': 'padding-box',
        }}
      />
      <span>🎉</span>
      <hr
        class={css({
          marginX: '8px',
          height: '16px',
          width: '1px',
          flexShrink: 0,
          backgroundColor: 'rgb(115, 115, 115)',
        })}
      />
      <AnimatedGradientText
        class={css({
          fontSize: '14px',
          fontWeight: 'medium',
        })}
      >
        Introducing Magic UI
      </AnimatedGradientText>
      <svg
        class={css({
          marginLeft: '4px',
          width: '16px',
          height: '16px',
          stroke: 'rgb(115, 115, 115)',
          transition: 'transform 300ms ease-in-out',
          '.group:hover &': {
            transform: 'translateX(2px)',
          },
        })}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

export const AnimatedGradientTextFastDemo: Component<AnimatedGradientTextDemoProps> = (props) => {
  return (
    <AnimatedGradientText
      speed={2}
      colorFrom="#4ade80"
      colorTo="#06b6d4"
      class={css(
        {
          fontSize: '2.25rem',
          fontWeight: '600',
          letterSpacing: '-0.025em',
        },
        props.class
      )}
    >
      Fast Gradient
    </AnimatedGradientText>
  );
};

export type { AnimatedGradientTextProps, AnimatedGradientTextDemoProps };
