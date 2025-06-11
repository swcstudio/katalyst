import { type Component, createSignal, onMount } from 'solid-js';
import { css } from '../../styled-system/css';

interface DotPatternProps {
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  fill?: string;
  glow?: boolean;
  glowColor?: string;
  glowSize?: number;
}

export const DotPattern: Component<DotPatternProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);

  const width = () => props.width ?? 16;
  const height = () => props.height ?? 16;
  const x = () => props.x ?? 0;
  const y = () => props.y ?? 0;
  const cx = () => props.cx ?? 1;
  const cy = () => props.cy ?? 1;
  const cr = () => props.cr ?? 1;
  const fill = () => props.fill ?? '#d1d5db';
  const glow = () => props.glow ?? false;
  const glowColor = () => props.glowColor ?? '#3b82f6';
  const glowSize = () => props.glowSize ?? 3;

  onMount(() => {
    setMounted(true);
  });

  const svgStyles = css({
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%',
    fill: 'rgba(255, 255, 255, 0.03)',
    pointerEvents: 'none',
  });

  const patternId = `dot-pattern-${Math.random().toString(36).substr(2, 9)}`;
  const glowPatternId = `dot-pattern-glow-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg class={`${svgStyles} ${props.className || ''}`} aria-hidden="true">
      <defs>
        <pattern
          id={patternId}
          width={width()}
          height={height()}
          patternUnits="userSpaceOnUse"
          x={x()}
          y={y()}
        >
          <circle cx={cx()} cy={cy()} r={cr()} fill={fill()} />
        </pattern>

        {glow() && (
          <pattern
            id={glowPatternId}
            width={width()}
            height={height()}
            patternUnits="userSpaceOnUse"
            x={x()}
            y={y()}
          >
            <circle
              cx={cx()}
              cy={cy()}
              r={cr()}
              fill={glowColor()}
              filter={`blur(${glowSize()}px)`}
              opacity="0.5"
            />
            <circle cx={cx()} cy={cy()} r={cr()} fill={glowColor()} opacity="0.8" />
          </pattern>
        )}
      </defs>

      {glow() && <rect width="100%" height="100%" fill={`url(#${glowPatternId})`} />}

      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export default DotPattern;
