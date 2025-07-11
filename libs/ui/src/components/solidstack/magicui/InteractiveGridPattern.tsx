import { type Component, createEffect, createSignal, For, onCleanup, onMount } from 'solid-js';
import { css } from '../../styled-system/css';

interface InteractiveGridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
  squares?: [number, number];
  squaresClassName?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

interface GridSquare {
  x: number;
  y: number;
  isHovered: boolean;
  id: string;
}

export const InteractiveGridPattern: Component<InteractiveGridPatternProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [gridSquares, setGridSquares] = createSignal<GridSquare[]>([]);
  const [containerSize, setContainerSize] = createSignal({ width: 800, height: 600 });

  let containerRef: SVGSVGElement | undefined;

  const width = () => props.width ?? 40;
  const height = () => props.height ?? 40;
  const x = () => props.x ?? -1;
  const y = () => props.y ?? -1;
  const strokeDasharray = () => props.strokeDasharray ?? '0';
  const squares = () => props.squares ?? [20, 20];
  const squaresClassName = () => props.squaresClassName ?? 'hover:fill-blue-500';
  const fill = () => props.fill ?? 'none';
  const stroke = () => props.stroke ?? '#e5e7eb';
  const strokeWidth = () => props.strokeWidth ?? 1;

  const generateGridSquares = () => {
    const [cols, rows] = squares();
    const newSquares: GridSquare[] = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        newSquares.push({
          x: i,
          y: j,
          isHovered: false,
          id: `square-${i}-${j}`,
        });
      }
    }

    setGridSquares(newSquares);
  };

  const handleSquareMouseEnter = (squareId: string) => {
    setGridSquares((prev) =>
      prev.map((square) => (square.id === squareId ? { ...square, isHovered: true } : square))
    );
  };

  const handleSquareMouseLeave = (squareId: string) => {
    setGridSquares((prev) =>
      prev.map((square) => (square.id === squareId ? { ...square, isHovered: false } : square))
    );
  };

  const updateContainerSize = () => {
    if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      setContainerSize({
        width: rect.width || 800,
        height: rect.height || 600,
      });
    }
  };

  onMount(() => {
    setMounted(true);
    generateGridSquares();
    updateContainerSize();

    const resizeObserver = new ResizeObserver(updateContainerSize);
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  createEffect(() => {
    if (mounted()) {
      generateGridSquares();
    }
  });

  const svgStyles = css({
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%',
    fill: 'rgba(255, 255, 255, 0.03)',
    stroke: 'rgba(255, 255, 255, 0.03)',
    strokeWidth: '1',
    pointerEvents: 'auto',
    cursor: 'crosshair',
  });

  const squareStyles = css({
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      fill: '#3b82f6',
      opacity: 0.3,
    },
  });

  const patternId = `interactive-grid-pattern-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg ref={containerRef} class={`${svgStyles} ${props.className || ''}`} aria-hidden="true">
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

      {mounted() && (
        <For each={gridSquares()}>
          {(square) => (
            <rect
              x={square.x * width()}
              y={square.y * height()}
              width={width()}
              height={height()}
              fill="transparent"
              stroke="transparent"
              class={`${squareStyles} ${squaresClassName()}`}
              style={{
                opacity: square.isHovered ? 0.3 : 0,
                fill: square.isHovered ? '#3b82f6' : 'transparent',
              }}
              onMouseEnter={() => handleSquareMouseEnter(square.id)}
              onMouseLeave={() => handleSquareMouseLeave(square.id)}
            />
          )}
        </For>
      )}
    </svg>
  );
};

export default InteractiveGridPattern;
