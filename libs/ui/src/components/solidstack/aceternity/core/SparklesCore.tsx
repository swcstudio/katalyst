import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, onCleanup, onMount } from 'solid-js';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export interface SparklesCoreProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

export const SparklesCore: Component<SparklesCoreProps> = (props) => {
  let canvasRef: HTMLCanvasElement | undefined;
  let animationId: number;
  const [particles, setParticles] = createSignal<Particle[]>([]);

  const config = {
    minSize: props.minSize || 0.4,
    maxSize: props.maxSize || 1,
    particleDensity: props.particleDensity || 100,
    particleColor: props.particleColor || '#FFFFFF',
    background: props.background || 'transparent',
  };

  const createParticle = (width: number, height: number): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (config.maxSize - config.minSize) + config.minSize,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random(),
      life: 0,
      maxLife: Math.random() * 120 + 60,
    };
  };

  const initParticles = (width: number, height: number) => {
    const particleCount = Math.floor(((width * height) / 10000) * config.particleDensity);
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(width, height));
    }

    setParticles(newParticles);
  };

  const updateParticle = (particle: Particle, width: number, height: number): Particle => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.life++;

    // Fade in and out
    const fadeProgress = particle.life / particle.maxLife;
    if (fadeProgress < 0.1) {
      particle.opacity = fadeProgress * 10;
    } else if (fadeProgress > 0.9) {
      particle.opacity = (1 - fadeProgress) * 10;
    } else {
      particle.opacity = 1;
    }

    // Reset particle if it's dead or out of bounds
    if (
      particle.life >= particle.maxLife ||
      particle.x < 0 ||
      particle.x > width ||
      particle.y < 0 ||
      particle.y > height
    ) {
      return createParticle(width, height);
    }

    return particle;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = config.particleColor;

    // Create a glowing effect
    ctx.shadowColor = config.particleColor;
    ctx.shadowBlur = particle.size * 2;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    // Add a bright center
    ctx.shadowBlur = 0;
    ctx.globalAlpha = particle.opacity * 0.8;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const animate = () => {
    if (!canvasRef) return;

    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasRef;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    const currentParticles = particles();
    const updatedParticles = currentParticles.map((particle) =>
      updateParticle(particle, width, height)
    );

    updatedParticles.forEach((particle) => {
      drawParticle(ctx, particle);
    });

    setParticles(updatedParticles);
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

    initParticles(rect.width, rect.height);
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
      id={props.id}
      class={css(
        {
          position: 'absolute',
          inset: '0',
          width: 'full',
          height: 'full',
          pointerEvents: 'none',
          backgroundColor: config.background,
        },
        props.className
      )}
    />
  );
};

export default SparklesCore;
