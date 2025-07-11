import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, mergeProps, type ParentComponent } from 'solid-js';

export interface NeonGradientCardProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: {
    firstColor: string;
    secondColor: string;
  };
  backgroundColor?: string;
}

export const NeonGradientCard: ParentComponent<NeonGradientCardProps> = (props) => {
  const merged = mergeProps(
    {
      borderSize: 2,
      borderRadius: 20,
      neonColors: {
        firstColor: '#ff00aa',
        secondColor: '#00FFF1',
      },
      backgroundColor: 'transparent',
    },
    props
  );

  return (
    <div
      class={css(
        {
          position: 'relative',
          borderRadius: `${merged.borderRadius}px`,
          backgroundColor: merged.backgroundColor,
          padding: `${merged.borderSize}px`,
        },
        merged.class
      )}
      style={{
        background: `
          linear-gradient(90deg, transparent, transparent),
          linear-gradient(90deg, ${merged.neonColors.firstColor}, ${merged.neonColors.secondColor})
        `,
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'padding-box, border-box',
        animation: 'neonGlow 4s ease-in-out infinite alternate',
        ...merged.style,
      }}
    >
      <div
        class={css({
          position: 'relative',
          borderRadius: `${merged.borderRadius - merged.borderSize}px`,
          backgroundColor: 'black',
          padding: '20px',
          overflow: 'hidden',

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: `${merged.borderRadius - merged.borderSize}px`,
            background: `
              linear-gradient(45deg, 
                ${merged.neonColors.firstColor}20, 
                transparent, 
                ${merged.neonColors.secondColor}20
              )
            `,
            animation: 'neonPulse 3s ease-in-out infinite',
          },
        })}
      >
        <div class={css({ position: 'relative', zIndex: 1 })}>{props.children}</div>
      </div>
    </div>
  );
};

export interface NeonGradientCardDemoProps {
  class?: string;
}

export const NeonGradientCardDemo: Component<NeonGradientCardDemoProps> = (props) => {
  return (
    <NeonGradientCard
      class={css(
        {
          maxWidth: '384px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        },
        props.class
      )}
    >
      <span
        class={css({
          pointerEvents: 'none',
          zIndex: 10,
          height: '100%',
          whiteSpace: 'pre-wrap',
          background: 'linear-gradient(135deg, #ff2975 35%, #00FFF1)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          textAlign: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          lineHeight: 1,
          letterSpacing: '-0.025em',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.8))',
        })}
      >
        Neon Gradient Card
      </span>
    </NeonGradientCard>
  );
};

// CSS Animation keyframes - this would typically be added to global styles
const neonStyles = `
@keyframes neonGlow {
  0%, 100% {
    box-shadow: 
      0 0 5px #ff00aa,
      0 0 10px #ff00aa,
      0 0 15px #ff00aa,
      0 0 20px #ff00aa;
  }
  50% {
    box-shadow: 
      0 0 5px #00FFF1,
      0 0 10px #00FFF1,
      0 0 15px #00FFF1,
      0 0 20px #00FFF1;
  }
}

@keyframes neonPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
`;

export type { NeonGradientCardProps, NeonGradientCardDemoProps };
