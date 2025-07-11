import { css } from '@sse/ui/styled-system/css';
import { type Component, children, type JSX, mergeProps } from 'solid-js';

export interface BorderBeamProps {
  children?: JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
  size?: number;
  duration?: number;
  anchor?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

const BorderBeam: Component<BorderBeamProps> = (props) => {
  const merged = mergeProps(
    {
      size: 200,
      duration: 15,
      anchor: 90,
      borderWidth: 1.5,
      colorFrom: '#ffaa40',
      colorTo: '#9c40ff',
      delay: 0,
    },
    props
  );

  const resolved = children(() => props.children);

  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'inline-block',
          overflow: 'hidden',
          borderRadius: 'inherit',
        },
        merged.className
      )}
      style={merged.style}
    >
      {resolved()}

      <div
        class={css({
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: `${merged.borderWidth}px`,
          background: `conic-gradient(from ${merged.anchor}deg, transparent, ${merged.colorFrom}, ${merged.colorTo}, transparent)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          animation: `border-beam ${merged.duration}s linear infinite`,
          animationDelay: `${merged.delay}s`,
        })}
        style={{
          '--size': `${merged.size}px`,
        }}
      />

      <style>{`
        @keyframes border-beam {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default BorderBeam;
