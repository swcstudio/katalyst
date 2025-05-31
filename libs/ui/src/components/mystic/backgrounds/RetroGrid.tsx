import { Component, JSX, mergeProps } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface RetroGridProps {
  className?: string;
  style?: JSX.CSSProperties;
  angle?: number;
  gridSize?: number;
  strokeWidth?: number;
  strokeColor?: string;
  fadeColor?: string;
  opacity?: number;
}

const RetroGrid: Component<RetroGridProps> = (props) => {
  const merged = mergeProps(
    {
      angle: 65,
      gridSize: 50,
      strokeWidth: 1,
      strokeColor: '#00ff00',
      fadeColor: '#000000',
      opacity: 0.6,
    },
    props
  );

  const id = `retro-grid-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      class={css({
        position: 'absolute',
        inset: 0,
        width: 'full',
        height: 'full',
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: merged.opacity,
        background: `linear-gradient(to bottom, transparent 0%, ${merged.fadeColor} 100%)`,
      }, merged.className)}
      style={merged.style}
    >
      <svg
        aria-hidden="true"
        class={css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'full',
          height: 'full',
          transform: `perspective(1000px) rotateX(${merged.angle}deg)`,
          transformOrigin: 'bottom',
        })}
      >
        <defs>
          <pattern
            id={`${id}-grid`}
            width={merged.gridSize}
            height={merged.gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M 0 0 L 0 ${merged.gridSize} M 0 0 L ${merged.gridSize} 0`}
              fill="none"
              stroke={merged.strokeColor}
              stroke-width={merged.strokeWidth}
              opacity="0.8"
            />
          </pattern>
          <linearGradient id={`${id}-fade`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={`stop-color:${merged.strokeColor};stop-opacity:0.8`} />
            <stop offset="50%" style={`stop-color:${merged.strokeColor};stop-opacity:0.4`} />
            <stop offset="100%" style={`stop-color:${merged.strokeColor};stop-opacity:0`} />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="200%"
          fill={`url(#${id}-grid)`}
          mask={`url(#${id}-fade)`}
        />
      </svg>
      <div
        class={css({
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: `linear-gradient(to top, ${merged.fadeColor} 0%, transparent 100%)`,
        })}
      />
    </div>
  );
};

export default RetroGrid;