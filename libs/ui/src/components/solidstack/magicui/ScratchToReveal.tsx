import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  createEffect,
  createSignal,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  type ParentComponent,
} from 'solid-js';

export interface ScratchToRevealProps {
  width: number;
  height: number;
  minScratchPercentage?: number;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  gradientColors?: string[];
  brushSize?: number;
  onComplete?: () => void;
}

export const ScratchToReveal: ParentComponent<ScratchToRevealProps> = (props) => {
  const merged = mergeProps(
    {
      minScratchPercentage: 70,
      gradientColors: ['#A97CF8', '#F38CB8', '#FDCC92'],
      brushSize: 20,
    },
    props
  );

  const [isScratching, setIsScratching] = createSignal(false);
  const [isRevealed, setIsRevealed] = createSignal(false);
  const [scratchPercentage, setScratchPercentage] = createSignal(0);

  let canvasRef: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;
  let totalPixels = 0;
  let scratchedPixels = 0;

  const initializeCanvas = () => {
    if (!canvasRef) return;

    canvasRef.width = merged.width;
    canvasRef.height = merged.height;
    ctx = canvasRef.getContext('2d');

    if (!ctx) return;

    totalPixels = merged.width * merged.height;

    // Create gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, merged.width, merged.height);
    merged.gradientColors.forEach((color, index) => {
      gradient.addColorStop(index / (merged.gradientColors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, merged.width, merged.height);

    // Set up for scratching
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const getEventPos = (event: MouseEvent | TouchEvent) => {
    if (!canvasRef) return { x: 0, y: 0 };

    const rect = canvasRef.getBoundingClientRect();
    let clientX: number;
    let clientY: number;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const scratch = (x: number, y: number) => {
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, merged.brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, merged.width, merged.height);
    scratchedPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) {
        scratchedPixels++;
      }
    }

    const percentage = (scratchedPixels / totalPixels) * 100;
    setScratchPercentage(percentage);

    if (percentage >= merged.minScratchPercentage && !isRevealed()) {
      setIsRevealed(true);
      if (merged.onComplete) {
        merged.onComplete();
      }
    }
  };

  const handleStart = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    setIsScratching(true);
    const pos = getEventPos(event);
    scratch(pos.x, pos.y);
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!isScratching()) return;
    event.preventDefault();
    const pos = getEventPos(event);
    scratch(pos.x, pos.y);
  };

  const handleEnd = () => {
    setIsScratching(false);
  };

  onMount(() => {
    initializeCanvas();

    if (canvasRef) {
      // Mouse events
      canvasRef.addEventListener('mousedown', handleStart);
      canvasRef.addEventListener('mousemove', handleMove);
      canvasRef.addEventListener('mouseup', handleEnd);
      canvasRef.addEventListener('mouseleave', handleEnd);

      // Touch events
      canvasRef.addEventListener('touchstart', handleStart);
      canvasRef.addEventListener('touchmove', handleMove);
      canvasRef.addEventListener('touchend', handleEnd);
    }
  });

  onCleanup(() => {
    if (canvasRef) {
      canvasRef.removeEventListener('mousedown', handleStart);
      canvasRef.removeEventListener('mousemove', handleMove);
      canvasRef.removeEventListener('mouseup', handleEnd);
      canvasRef.removeEventListener('mouseleave', handleEnd);
      canvasRef.removeEventListener('touchstart', handleStart);
      canvasRef.removeEventListener('touchmove', handleMove);
      canvasRef.removeEventListener('touchend', handleEnd);
    }
  });

  createEffect(() => {
    if (isRevealed() && canvasRef && ctx) {
      // Fade out the canvas when revealed
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0;
      ctx.clearRect(0, 0, merged.width, merged.height);
    }
  });

  return (
    <div
      class={css(
        {
          position: 'relative',
          width: `${merged.width}px`,
          height: `${merged.height}px`,
          userSelect: 'none',
          touchAction: 'none',
        },
        merged.class
      )}
      style={merged.style}
    >
      {/* Content to be revealed */}
      <div
        class={css({
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        })}
      >
        {props.children}
      </div>

      {/* Scratch overlay canvas */}
      <canvas
        ref={canvasRef}
        class={css({
          position: 'absolute',
          inset: 0,
          cursor: 'crosshair',
          transition: 'opacity 0.5s ease',
          opacity: isRevealed() ? 0 : 1,
        })}
        style={{
          'pointer-events': isRevealed() ? 'none' : 'auto',
        }}
      />

      {/* Progress indicator (optional) */}
      <div
        class={css({
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '4px 8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          opacity: scratchPercentage() > 0 && !isRevealed() ? 1 : 0,
          transition: 'opacity 0.3s ease',
        })}
      >
        {Math.round(scratchPercentage())}%
      </div>
    </div>
  );
};

export interface ScratchToRevealDemoProps {
  class?: string;
}

export const ScratchToRevealDemo: Component<ScratchToRevealDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        },
        props.class
      )}
    >
      <ScratchToReveal
        width={250}
        height={250}
        minScratchPercentage={70}
        class={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: '16px',
          border: '2px solid',
          borderColor: 'border',
          backgroundColor: 'muted',
        })}
        gradientColors={['#A97CF8', '#F38CB8', '#FDCC92']}
      >
        <p
          class={css({
            fontSize: '72px',
            margin: 0,
          })}
        >
          😎
        </p>
      </ScratchToReveal>
    </div>
  );
};

export type { ScratchToRevealProps, ScratchToRevealDemoProps };
