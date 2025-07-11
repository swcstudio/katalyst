import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, mergeProps, type ParentComponent } from 'solid-js';

export interface BorderBeamProps {
  class?: string;
  style?: JSX.CSSProperties;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam: Component<BorderBeamProps> = (props) => {
  const merged = mergeProps(
    {
      size: 200,
      duration: 15,
      borderWidth: 1.5,
      colorFrom: '#ffaa40',
      colorTo: '#9c40ff',
      delay: 0,
    },
    props
  );

  return (
    <div
      class={css(
        {
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: `${merged.borderWidth}px`,
          background: `linear-gradient(90deg, transparent, transparent, ${merged.colorFrom}, ${merged.colorTo}, transparent, transparent)`,
          backgroundSize: `${merged.size * 2}px ${merged.borderWidth * 2}px`,
          maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          animation: `borderBeam ${merged.duration}s infinite linear`,
          animationDelay: `${merged.delay}s`,

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: `${merged.borderWidth}px`,
            background: `linear-gradient(90deg, transparent, transparent, ${merged.colorFrom}, ${merged.colorTo}, transparent, transparent)`,
            backgroundSize: `${merged.size * 2}px ${merged.borderWidth * 2}px`,
            maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            animation: `borderBeam ${merged.duration}s infinite linear`,
            animationDelay: `${merged.delay}s`,
          },
        },
        merged.class
      )}
      style={{
        '--border-beam-size': `${merged.size}px`,
        '--border-beam-duration': `${merged.duration}s`,
        '--border-beam-color-from': merged.colorFrom,
        '--border-beam-color-to': merged.colorTo,
        ...merged.style,
      }}
    />
  );
};

export interface BorderBeamCardProps {
  children?: JSX.Element;
  class?: string;
  borderBeamProps?: BorderBeamProps;
}

export const BorderBeamCard: ParentComponent<BorderBeamCardProps> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
        },
        props.class
      )}
    >
      {props.children}
      <BorderBeam {...props.borderBeamProps} />
    </div>
  );
};

// CSS Animation keyframes - this would typically be added to global styles
const borderBeamStyles = `
@keyframes borderBeam {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
`;

export type { BorderBeamProps, BorderBeamCardProps };
