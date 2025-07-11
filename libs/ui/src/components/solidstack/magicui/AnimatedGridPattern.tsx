import { type Component, For, createSignal, onCleanup, onMount } from 'solid-js';
import { css } from '../../styled-system/css';

interface AnimatedGridPatternProps {
  className?: string;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
  width?: number;
  height?: number;
  x?: string;
  y?: string;
  strokeDasharray?: string;
  fill?: string;
  stroke?: string;
}

export const AnimatedGridPattern: Component<AnimatedGridPatternProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [squares, setSquares] = createSignal<
    Array<{ id: number; x: number; y: number; opacity: number }>
  >([]);

  const numSquares = () => props.numSquares ?? 30;
  const maxOpacity = () => props.maxOpacity ?? 0.1;
  const duration = () => props.duration ?? 3;
  const repeatDelay = () => props.repeatDelay ?? 1;
  const width = () => props.width ?? 40;
  const height = () => props.height ?? 40;
  const x = () => props.x ?? '-1';
  const y = () => props.y ?? '-1';
  const strokeDasharray = () => props.strokeDasharray ?? '0';
  const fill = () => props.fill ?? 'none';
  const stroke = () => props.stroke ?? '#e5e7eb';

  const generateSquares = () => {
    const newSquares = Array.from({ length: numSquares() }, (_, i) => ({
      id: i,
      x: Math.floor(Math.random() * 40),
      y: Math.floor(Math.random() * 40),
      opacity: 0,
    }));
    setSquares(newSquares);
  };

  const animateSquares = () => {
    const currentSquares = squares();

    currentSquares.forEach((square, index) => {
      setTimeout(() => {
        setSquares((prev) =>
          prev.map((s) =>
            s.id === square.id ? { ...s, opacity: Math.random() * maxOpacity() } : s
          )
        );

        setTimeout(() => {
          setSquares((prev) => prev.map((s) => (s.id === square.id ? { ...s, opacity: 0 } : s)));
        }, duration() * 1000);
      }, index * 100);
    });
  };

  let intervalId: number;

  onMount(() => {
    setMounted(true);
    generateSquares();

    const animate = () => {
      animateSquares();
      setTimeout(() => {
        generateSquares();
      }, duration() * 1000);
    };

    animate();
    intervalId = setInterval(animate, (duration() + repeatDelay()) * 1000);
  });

  onCleanup(() => {
    if (intervalId) {
      clearInterval(intervalId);
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
  });

  const squareStyles = css({
    transition: `opacity ${duration()}s ease-in-out`,
  });

  return (
    <svg class={`${svgStyles} ${props.className || ''}`} aria-hidden="true">
      <defs>
        <pattern
          id="animated-grid-pattern"
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
            stroke-width="1"
            stroke-dasharray={strokeDasharray()}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#animated-grid-pattern)" />
      <For each={squares()}>
        {(square) => (
          <rect
            x={square.x * width()}
            y={square.y * height()}
            width={width()}
            height={height()}
            fill="currentColor"
            class={squareStyles}
            style={{
              opacity: square.opacity,
            }}
          />
        )}
      </For>
    </svg>
  );
};

export default AnimatedGridPattern;
