import { Component, JSX, mergeProps } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface DotPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  style?: JSX.CSSProperties;
}

const DotPattern: Component<DotPatternProps> = (props) => {
  const merged = mergeProps(
    {
      width: 16,
      height: 16,
      x: 0,
      y: 0,
      cx: 1,
      cy: 1,
      cr: 1,
    },
    props
  );

  const id = `dot-pattern-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      aria-hidden="true"
      class={css({
        position: 'absolute',
        inset: 0,
        width: 'full',
        height: 'full',
        pointerEvents: 'none',
      }, merged.className)}
      style={merged.style}
    >
      <defs>
        <pattern
          id={id}
          width={merged.width}
          height={merged.height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={merged.x}
          y={merged.y}
        >
          <circle
            id="pattern-circle"
            cx={merged.cx}
            cy={merged.cy}
            r={merged.cr}
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" stroke-width={0} fill={`url(#${id})`} />
    </svg>
  );
};

export default DotPattern;