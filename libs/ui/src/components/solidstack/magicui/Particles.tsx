import { Component, JSX, mergeProps, createSignal, onMount, onCleanup, createEffect } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface ParticlesProps {
  class?: string;
  style?: JSX.CSSProperties;
  quantity?: number;
  ease?: number;
  color?: string;
  refresh?: boolean;
  vx?: number;
  vy?: number;
  size?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export const Particles: Component<ParticlesProps> = (props) => {
  const merged = mergeProps(
    {
      quantity: 100,
      ease: 50,
      color: '#ffffff',
      refresh: false,
      vx: 0,
      vy: 0,
      size: 1,
    },
    props
  );

  const [particles, setParticles] = createSignal<Particle[]>([]);
  let canvasRef: HTMLCanvasElement | undefined;
  let animationId: number;
  let ctx: CanvasRenderingContext2D;

  const initializeParticles = () => {
    if (!canvasRef) return;
    
    const canvas = canvasRef;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx = canvas.getContext('2d')!;
    
    const newParticles: Particle[] = [];
    for (let i = 0; i < merged.quantity; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * merged.size + 0.5,
        opacity: Math.random(),
      });
    }
    setParticles(newParticles);
  };

  const updateParticles = () => {
    if (!canvasRef || !ctx) return;
    
    const canvas = canvasRef;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        // Update position
        let newX = particle.x + particle.vx + merged.vx;
        let newY = particle.y + particle.vy + merged.vy;
        
        // Wrap around edges
        if (newX > canvas.width) newX = 0;
        if (newX < 0) newX = canvas.width;
        if (newY > canvas.height) newY = 0;
        if (newY < 0) newY = canvas.height;
        
        // Apply easing
        const easeFactor = merged.ease / 100;
        const newVx = particle.vx * easeFactor;
        const newVy = particle.vy * easeFactor;
        
        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      })
    );
    
    // Draw particles
    ctx.fillStyle = merged.color;
    particles().forEach(particle => {
      ctx.globalAlpha = particle.opacity;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    animationId = requestAnimationFrame(updateParticles);
  };

  const handleResize = () => {
    if (canvasRef) {
      const rect = canvasRef.getBoundingClientRect();
      canvasRef.width = rect.width;
      canvasRef.height = rect.height;
    }
  };

  onMount(() => {
    if (canvasRef) {
      initializeParticles();
      updateParticles();
      window.addEventListener('resize', handleResize);
    }
  });

  onCleanup(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', handleResize);
  });

  createEffect(() => {
    if (merged.refresh && canvasRef) {
      initializeParticles();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      class={css({
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }, merged.class)}
      style={merged.style}
    />
  );
};

export interface ParticlesDemoProps {
  class?: string;
}

export const ParticlesDemo: Component<ParticlesDemoProps> = (props) => {
  const [color, setColor] = createSignal('#ffffff');

  // Simulate theme detection - in a real app this would come from theme context
  createEffect(() => {
    // This would normally be connected to your theme system
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setColor(isDark ? '#ffffff' : '#000000');
  });

  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        height: '500px',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'border',
        backgroundColor: 'background',
      }, props.class)}
    >
      <span
        class={css({
          pointerEvents: 'none',
          zIndex: 10,
          whiteSpace: 'pre-wrap',
          textAlign: 'center',
          fontSize: '64px',
          fontWeight: '600',
          lineHeight: 1,
          color: 'foreground',
        })}
      >
        Particles
      </span>
      <Particles
        class={css({
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        })}
        quantity={100}
        ease={80}
        color={color()}
        refresh
      />
    </div>
  );
};

export type { ParticlesProps, ParticlesDemoProps };