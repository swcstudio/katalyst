import { Component, createSignal, onMount, onCleanup } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  maxOpacity: number;
  phase: number;
}

export interface StarsBackgroundProps {
  starCount?: number;
  starColor?: string;
  minStarSize?: number;
  maxStarSize?: number;
  twinkleSpeed?: number;
  className?: string;
}

export const StarsBackground: Component<StarsBackgroundProps> = (props) => {
  let canvasRef: HTMLCanvasElement | undefined;
  let animationId: number;
  const [stars, setStars] = createSignal<Star[]>([]);
  let time = 0;

  const config = {
    starCount: props.starCount || 200,
    starColor: props.starColor || '#FFFFFF',
    minStarSize: props.minStarSize || 0.5,
    maxStarSize: props.maxStarSize || 3,
    twinkleSpeed: props.twinkleSpeed || 0.02,
  };

  const createStar = (width: number, height: number): Star => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (config.maxStarSize - config.minStarSize) + config.minStarSize,
      opacity: Math.random(),
      twinkleSpeed: Math.random() * config.twinkleSpeed + 0.005,
      maxOpacity: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
    };
  };

  const initStars = (width: number, height: number) => {
    const newStars: Star[] = [];
    for (let i = 0; i < config.starCount; i++) {
      newStars.push(createStar(width, height));
    }
    setStars(newStars);
  };

  const updateStar = (star: Star): Star => {
    // Create twinkling effect using sine wave
    star.opacity = (Math.sin(time * star.twinkleSpeed + star.phase) + 1) * 0.5 * star.maxOpacity;
    return star;
  };

  const drawStar = (ctx: CanvasRenderingContext2D, star: Star) => {
    ctx.save();
    ctx.globalAlpha = star.opacity;
    
    // Create a glowing effect
    ctx.shadowColor = config.starColor;
    ctx.shadowBlur = star.size;
    ctx.fillStyle = config.starColor;
    
    // Draw the star as a small circle
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Add a bright center point
    ctx.shadowBlur = 0;
    ctx.globalAlpha = Math.min(star.opacity * 1.5, 1);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Add sparkle effect for larger stars
    if (star.size > 2) {
      ctx.globalAlpha = star.opacity * 0.8;
      ctx.strokeStyle = config.starColor;
      ctx.lineWidth = 1;
      
      // Draw cross sparkle
      ctx.beginPath();
      ctx.moveTo(star.x - star.size, star.y);
      ctx.lineTo(star.x + star.size, star.y);
      ctx.moveTo(star.x, star.y - star.size);
      ctx.lineTo(star.x, star.y + star.size);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const animate = () => {
    if (!canvasRef) return;

    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasRef;
    time += 1;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw stars
    const currentStars = stars();
    const updatedStars = currentStars.map(star => updateStar(star));

    updatedStars.forEach(star => {
      drawStar(ctx, star);
    });

    setStars(updatedStars);
    animationId = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    if (!canvasRef) return;

    const rect = canvasRef.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvasRef.width = rect.width * dpr;
    canvasRef.height = rect.height * dpr;

    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    canvasRef.style.width = rect.width + 'px';
    canvasRef.style.height = rect.height + 'px';

    initStars(rect.width, rect.height);
  };

  onMount(() => {
    if (!canvasRef) return;

    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  });

  return (
    <canvas
      ref={canvasRef}
      class={css({
        position: 'absolute',
        inset: '0',
        width: 'full',
        height: 'full',
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }, props.className)}
    />
  );
};

export default StarsBackground;