import { Component, JSX, mergeProps, onCleanup, createSignal, onMount } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface NoSignalScreenProps {
  className?: string;
  style?: JSX.CSSProperties;
  opacity?: number;
  animationSpeed?: number;
}

const NoSignalScreen: Component<NoSignalScreenProps> = (props) => {
  const merged = mergeProps(
    {
      opacity: 0.8,
      animationSpeed: 100,
    },
    props
  );

  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
  let animationId: number;

  const generateNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // Red
      data[i + 1] = noise; // Green
      data[i + 2] = noise; // Blue
      data[i + 3] = 255;   // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const animate = () => {
    const canvas = canvasRef();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    generateNoise(ctx, canvas.width, canvas.height);

    animationId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, merged.animationSpeed);
  };

  onMount(() => {
    const canvas = canvasRef();
    if (canvas) {
      animate();
    }
  });

  onCleanup(() => {
    if (animationId) {
      clearTimeout(animationId);
    }
  });

  return (
    <canvas
      ref={setCanvasRef}
      class={css({
        position: 'absolute',
        inset: 0,
        width: 'full',
        height: 'full',
        pointerEvents: 'none',
        opacity: merged.opacity,
      }, merged.className)}
      style={merged.style}
    />
  );
};

export default NoSignalScreen;