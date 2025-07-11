import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, onCleanup, onMount } from 'solid-js';

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export interface ShootingStarsProps {
  starCount?: number;
  starColor?: string;
  trailLength?: number;
  minSpeed?: number;
  maxSpeed?: number;
  className?: string;
}

export const ShootingStars: Component<ShootingStarsProps> = (props) => {
  let canvasRef: HTMLCanvasElement | undefined;
  let animationId: number;
  const [stars, setStars] = createSignal<ShootingStar[]>([]);

  const config = {
    starCount: props.starCount || 5,
    starColor: props.starColor || '#FFFFFF',
    trailLength: props.trailLength || 100,
    minSpeed: props.minSpeed || 2,
    maxSpeed: props.maxSpeed || 8,
  };

  const createShootingStar = (width: number, height: number): ShootingStar => {
    const angle = (Math.random() * Math.PI) / 3 + Math.PI / 6; // 30-60 degrees
    const speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;

    return {
      x: Math.random() * width * 0.5, // Start from left half
      y: Math.random() * height * 0.3, // Start from top third
      length: Math.random() * config.trailLength + 20,
      speed,
      angle,
      opacity: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: Math.random() * 200 + 100,
    };
  };

  const initStars = (width: number, height: number) => {
    const newStars: ShootingStar[] = [];
    for (let i = 0; i < config.starCount; i++) {
      newStars.push(createShootingStar(width, height));
    }
    setStars(newStars);
  };

  const updateStar = (star: ShootingStar, width: number, height: number): ShootingStar => {
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;
    star.life++;

    // Fade in and out
    const fadeProgress = star.life / star.maxLife;
    if (fadeProgress < 0.1) {
      star.opacity = fadeProgress * 10 * 0.8;
    } else if (fadeProgress > 0.7) {
      star.opacity = (1 - fadeProgress) * 3.33 * 0.8;
    }

    // Reset star if it's off screen or dead
    if (
      star.life >= star.maxLife ||
      star.x > width + star.length ||
      star.y > height + star.length
    ) {
      return createShootingStar(width, height);
    }

    return star;
  };

  const drawStar = (ctx: CanvasRenderingContext2D, star: ShootingStar) => {
    ctx.save();

    const gradient = ctx.createLinearGradient(
      star.x,
      star.y,
      star.x - Math.cos(star.angle) * star.length,
      star.y - Math.sin(star.angle) * star.length
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
    gradient.addColorStop(0.3, `rgba(255, 255, 255, ${star.opacity * 0.6})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    // Draw the main trail
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(
      star.x - Math.cos(star.angle) * star.length,
      star.y - Math.sin(star.angle) * star.length
    );
    ctx.stroke();

    // Draw a bright head
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.shadowColor = config.starColor;
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const animate = () => {
    if (!canvasRef) return;

    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasRef;

    // Clear canvas with slight fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    // Update and draw stars
    const currentStars = stars();
    const updatedStars = currentStars.map((star) => updateStar(star, width, height));

    updatedStars.forEach((star) => {
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

    canvasRef.style.width = `${rect.width}px`;
    canvasRef.style.height = `${rect.height}px`;

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
      class={css(
        {
          position: 'absolute',
          inset: '0',
          width: 'full',
          height: 'full',
          pointerEvents: 'none',
          backgroundColor: 'transparent',
        },
        props.className
      )}
    />
  );
};

export default ShootingStars;
