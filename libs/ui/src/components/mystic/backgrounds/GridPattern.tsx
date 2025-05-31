import { Component, JSX, mergeProps } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string | number;
  strokeWidth?: number;
  className?: string;
  style?: JSX.CSSProperties;
}

const GridPattern: Component<GridPatternProps> = (props) => {
  const merged = mergeProps(
    {
      width: 40,
      height: 40,
      x: -1,
      y: -1,
      strokeDasharray: 0,
      strokeWidth: 1,
    },
    props
  );

  const id = `grid-pattern-${Math.random().toString(36).substr(2, 9)}`;

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
          x={merged.x}
          y={merged.y}
        >
          <path
            d={`M.5 ${merged.height}V.5H${merged.width}`}
            fill="none"
            stroke="currentColor"
            stroke-width={merged.strokeWidth}
            stroke-dasharray={merged.strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" stroke-width={0} fill={`url(#${id})`} />
    </svg>
  );
};

export default GridPattern;