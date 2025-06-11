import { type Component, createSignal, onCleanup, onMount } from 'solid-js';
import { css } from '../../styled-system/css';

interface FlickeringGridProps {
  className?: string;
  squareSize?: number;
  gridGap?: number;
  color?: string;
  maxOpacity?: number;
  flickerChance?: number;
  width?: number;
  height?: number;
}

export const FlickeringGrid: Component<FlickeringGridProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  let canvasRef: HTMLCanvasElement | undefined;
  let animationId: number;

  const squareSize = () => props.squareSize ?? 4;
  const gridGap = () => props.gridGap ?? 6;
  const color = () => props.color ?? '#6B7280';
  const maxOpacity = () => props.maxOpacity ?? 0.5;
  const flickerChance = () => props.flickerChance ?? 0.1;
  const width = () => props.width ?? 800;
  const height = () => props.height ?? 800;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 107, g: 114, b: 128 };
  };

  const drawGrid = () => {
    if (!canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { r, g, b } = hexToRgb(color());

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.floor(width() / (squareSize() + gridGap()));
    const rows = Math.floor(height() / (squareSize() + gridGap()));

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() < flickerChance()) {
          const opacity = Math.random() * maxOpacity();
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

          const x = i * (squareSize() + gridGap());
          const y = j * (squareSize() + gridGap());

          ctx.fillRect(x, y, squareSize(), squareSize());
        }
      }
    }
  };

  const animate = () => {
    drawGrid();
    animationId = requestAnimationFrame(animate);
  };

  onMount(() => {
    setMounted(true);
    if (canvasRef) {
      canvasRef.width = width();
      canvasRef.height = height();
      animate();
    }
  });

  onCleanup(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });

  const canvasStyles = css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  });

  return (
    <canvas
      ref={canvasRef}
      class={`${canvasStyles} ${props.className || ''}`}
      width={width()}
      height={height()}
    />
  );
};

export default FlickeringGrid;
