import { type Component, For, createSignal, onMount } from 'solid-js';
import { css } from '../../styled-system/css';

interface GridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
  squares?: [number, number][];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export const GridPattern: Component<GridPatternProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);

  const width = () => props.width ?? 40;
  const height = () => props.height ?? 40;
  const x = () => props.x ?? -1;
  const y = () => props.y ?? -1;
  const strokeDasharray = () => props.strokeDasharray ?? '0';
  const squares = () => props.squares ?? [];
  const fill = () => props.fill ?? 'none';
  const stroke = () => props.stroke ?? '#e5e7eb';
  const strokeWidth = () => props.strokeWidth ?? 1;

  onMount(() => {
    setMounted(true);
  });

  const svgStyles = css({
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%',
    fill: 'rgba(255, 255, 255, 0.03)',
    stroke: 'rgba(255, 255, 255, 0.03)',
    strokeWidth: '1',
    pointerEvents: 'none',
  });

  const patternId = `grid-pattern-${Math.random().toString(36).substr(2, 9)}`;

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
          <path
            d={`M ${width()} 0 L 0 0 0 ${height()}`}
            fill={fill()}
            stroke={stroke()}
            stroke-width={strokeWidth()}
            stroke-dasharray={strokeDasharray()}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${patternId})`} />

      {mounted() && squares().length > 0 && (
        <For each={squares()}>
          {([x, y]) => (
            <rect
              x={x * width()}
              y={y * height()}
              width={width()}
              height={height()}
              fill="currentColor"
              stroke="currentColor"
              stroke-width="1"
            />
          )}
        </For>
      )}
    </svg>
  );
};

export default GridPattern;
