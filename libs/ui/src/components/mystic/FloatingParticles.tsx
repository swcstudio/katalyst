import { createSignal, For, type JSX, onCleanup, onMount, splitProps } from 'solid-js';
import { cn } from './utils.ts';

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export interface FloatingParticlesProps extends JSX.HTMLAttributes<HTMLDivElement> {
  count?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speed?: 'slow' | 'normal' | 'fast';
  colors?: string[];
  shape?: 'circle' | 'square' | 'triangle' | 'star' | 'dot';
  pattern?: 'random' | 'wave' | 'orbit' | 'flow';
  density?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  pause?: boolean;
  fadeEdges?: boolean;
  glow?: boolean;
}

export function FloatingParticles(props: FloatingParticlesProps) {
  const [local, others] = splitProps(props, [
    'count',
    'size',
    'speed',
    'colors',
    'shape',
    'pattern',
    'density',
    'interactive',
    'pause',
    'fadeEdges',
    'glow',
    'class',
  ]);

  const [particles, setParticles] = createSignal<Particle[]>([]);
  const [dimensions, setDimensions] = createSignal({ width: 0, height: 0 });
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });

  let containerRef: HTMLDivElement | undefined;
  let animationId: number | undefined;
  let resizeObserver: ResizeObserver | undefined;

  const getParticleCount = () => {
    const density = local.density || 'medium';
    const baseCount = local.count || 50;
    const densityMultiplier = { low: 0.5, medium: 1, high: 1.5 };
    return Math.floor(baseCount * densityMultiplier[density]);
  };

  const getParticleSize = () => {
    const sizeMap = {
      sm: { min: 1, max: 3 },
      md: { min: 2, max: 6 },
      lg: { min: 4, max: 10 },
      xl: { min: 6, max: 16 },
    };
    return sizeMap[local.size || 'md'];
  };

  const getSpeedMultiplier = () => {
    const speedMap = { slow: 0.3, normal: 0.6, fast: 1.2 };
    return speedMap[local.speed || 'normal'];
  };

  const getRandomColor = () => {
    const defaultColors = [
      'rgba(59, 130, 246, 0.5)', // blue
      'rgba(147, 51, 234, 0.5)', // purple
      'rgba(236, 72, 153, 0.5)', // pink
      'rgba(6, 182, 212, 0.5)', // cyan
      'rgba(16, 185, 129, 0.5)', // emerald
      'rgba(245, 158, 11, 0.5)', // amber
    ];
    const colors = local.colors || defaultColors;
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const createParticle = (id: number): Particle => {
    const { width, height } = dimensions();
    const sizeRange = getParticleSize();
    const speedMultiplier = getSpeedMultiplier();

    return {
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
      speedX: (Math.random() - 0.5) * speedMultiplier,
      speedY: (Math.random() - 0.5) * speedMultiplier,
      color: getRandomColor(),
      opacity: Math.random() * 0.6 + 0.2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    };
  };

  const updateParticle = (particle: Particle): Particle => {
    const { width, height } = dimensions();
    const pattern = local.pattern || 'random';
    let newX = particle.x;
    let newY = particle.y;

    switch (pattern) {
      case 'wave':
        newX += particle.speedX;
        newY += Math.sin(particle.x * 0.01) * 0.5 + particle.speedY;
        break;
      case 'orbit': {
        const centerX = width / 2;
        const centerY = height / 2;
        const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
        const radius = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
        const newAngle = angle + particle.speedX * 0.01;
        newX = centerX + Math.cos(newAngle) * radius;
        newY = centerY + Math.sin(newAngle) * radius;
        break;
      }
      case 'flow':
        newX += particle.speedX + Math.sin(particle.y * 0.01) * 0.2;
        newY += particle.speedY * 0.3;
        break;
      default: // random
        newX += particle.speedX;
        newY += particle.speedY;
    }

    // Interactive mouse effect
    if (local.interactive) {
      const mouse = mousePos();
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 100;

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        newX -= (dx / distance) * force * 2;
        newY -= (dy / distance) * force * 2;
      }
    }

    // Wrap around edges
    if (newX < -particle.size) newX = width + particle.size;
    if (newX > width + particle.size) newX = -particle.size;
    if (newY < -particle.size) newY = height + particle.size;
    if (newY > height + particle.size) newY = -particle.size;

    return {
      ...particle,
      x: newX,
      y: newY,
      rotation: particle.rotation + particle.rotationSpeed,
    };
  };

  const animate = () => {
    if (local.pause) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    setParticles((prevParticles) => prevParticles.map(updateParticle));

    animationId = requestAnimationFrame(animate);
  };

  const initializeParticles = () => {
    const count = getParticleCount();
    const newParticles = Array.from({ length: count }, (_, i) => createParticle(i));
    setParticles(newParticles);
  };

  const updateDimensions = () => {
    if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef && local.interactive) {
      const rect = containerRef.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  onMount(() => {
    updateDimensions();
    initializeParticles();

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateDimensions);
      if (containerRef) {
        resizeObserver.observe(containerRef);
      }
    }

    if (local.interactive) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    animationId = requestAnimationFrame(animate);
  });

  onCleanup(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    if (local.interactive) {
      document.removeEventListener('mousemove', handleMouseMove);
    }
  });

  const getShapeElement = (particle: Particle) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      opacity: particle.opacity,
      transform: `rotate(${particle.rotation}deg)`,
      transition: 'opacity 0.3s ease',
    };

    const shapeClasses = cn('pointer-events-none', local.glow && 'filter blur-[0.5px]');

    switch (local.shape) {
      case 'square':
        return (
          <div
            style={{ ...baseStyle, 'background-color': particle.color }}
            class={cn(shapeClasses, 'rounded-sm')}
          />
        );
      case 'triangle':
        return (
          <div style={baseStyle} class={shapeClasses}>
            <div
              style={{
                width: 0,
                height: 0,
                'border-left': `${particle.size / 2}px solid transparent`,
                'border-right': `${particle.size / 2}px solid transparent`,
                'border-bottom': `${particle.size}px solid ${particle.color}`,
              }}
            />
          </div>
        );
      case 'star':
        return (
          <div style={baseStyle} class={shapeClasses}>
            <svg
              width={particle.size}
              height={particle.size}
              viewBox="0 0 24 24"
              fill={particle.color}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      case 'dot':
        return (
          <div
            style={{ ...baseStyle, 'background-color': particle.color }}
            class={cn(shapeClasses, 'rounded-full', particle.size < 3 ? 'w-1 h-1' : '')}
          />
        );
      default: // circle
        return (
          <div
            style={{ ...baseStyle, 'background-color': particle.color }}
            class={cn(shapeClasses, 'rounded-full')}
          />
        );
    }
  };

  const containerClasses = cn(
    'absolute inset-0 overflow-hidden pointer-events-none',
    local.fadeEdges && 'mask-gradient-radial',
    local.class
  );

  return (
    <div ref={containerRef} {...others} class={containerClasses}>
      <For each={particles()}>{(particle) => getShapeElement(particle)}</For>

      {local.fadeEdges && (
        <div class="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/20 pointer-events-none" />
      )}
    </div>
  );
}
