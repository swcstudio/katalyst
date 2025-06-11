import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, createSignal, mergeProps, onCleanup, onMount } from 'solid-js';

export interface AnimatedBeamProps {
  className?: string;
  style?: JSX.CSSProperties;
  fromRef?: HTMLElement | null;
  toRef?: HTMLElement | null;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

const AnimatedBeam: Component<AnimatedBeamProps> = (props) => {
  const merged = mergeProps(
    {
      curvature: 0,
      reverse: false,
      duration: 2000,
      delay: 0,
      pathColor: '#ffaa40',
      pathWidth: 2,
      pathOpacity: 0.2,
      gradientStartColor: '#ffaa40',
      gradientStopColor: '#9c40ff',
      startXOffset: 0,
      startYOffset: 0,
      endXOffset: 0,
      endYOffset: 0,
    },
    props
  );

  const [svgRef, setSvgRef] = createSignal<SVGSVGElement>();
  const [pathData, setPathData] = createSignal('');
  const [svgDimensions, setSvgDimensions] = createSignal({ width: 0, height: 0 });

  const id = `beam-${Math.random().toString(36).substr(2, 9)}`;

  const updatePath = () => {
    if (!merged.fromRef || !merged.toRef) return;

    const svg = svgRef();
    if (!svg) return;

    const svgRect = svg.getBoundingClientRect();
    const fromRect = merged.fromRef.getBoundingClientRect();
    const toRect = merged.toRef.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2 - svgRect.left + merged.startXOffset;
    const startY = fromRect.top + fromRect.height / 2 - svgRect.top + merged.startYOffset;
    const endX = toRect.left + toRect.width / 2 - svgRect.left + merged.endXOffset;
    const endY = toRect.top + toRect.height / 2 - svgRect.top + merged.endYOffset;

    let path = '';
    if (merged.curvature === 0) {
      path = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      const curvature = merged.curvature * distance * 0.2;

      const angle = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;
      const controlX = midX + Math.cos(angle) * curvature;
      const controlY = midY + Math.sin(angle) * curvature;

      path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
    }

    setPathData(path);

    const maxX = Math.max(startX, endX, startX + merged.curvature * 50);
    const maxY = Math.max(startY, endY, startY + merged.curvature * 50);
    setSvgDimensions({ width: maxX + 100, height: maxY + 100 });
  };

  let resizeObserver: ResizeObserver;

  onMount(() => {
    updatePath();

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updatePath();
      });

      if (merged.fromRef) resizeObserver.observe(merged.fromRef);
      if (merged.toRef) resizeObserver.observe(merged.toRef);
    }

    window.addEventListener('resize', updatePath);
    window.addEventListener('scroll', updatePath);
  });

  onCleanup(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    window.removeEventListener('resize', updatePath);
    window.removeEventListener('scroll', updatePath);
  });

  return (
    <svg
      ref={setSvgRef}
      class={css(
        {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
        },
        merged.className
      )}
      style={merged.style}
      width={svgDimensions().width}
      height={svgDimensions().height}
    >
      <defs>
        <linearGradient id={`${id}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={`stop-color:${merged.gradientStartColor};stop-opacity:0`} />
          <stop offset="50%" style={`stop-color:${merged.gradientStopColor};stop-opacity:1`} />
          <stop offset="100%" style={`stop-color:${merged.gradientStartColor};stop-opacity:0`} />
        </linearGradient>

        <linearGradient id={`${id}-pulse`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={`stop-color:${merged.gradientStartColor};stop-opacity:0`}>
            <animate
              attributeName="stop-opacity"
              values="0;1;0"
              dur={`${merged.duration}ms`}
              begin={`${merged.delay}ms`}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" style={`stop-color:${merged.gradientStopColor};stop-opacity:1`}>
            <animate
              attributeName="stop-opacity"
              values="0;1;0"
              dur={`${merged.duration}ms`}
              begin={`${merged.delay + merged.duration * 0.2}ms`}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" style={`stop-color:${merged.gradientStartColor};stop-opacity:0`}>
            <animate
              attributeName="stop-opacity"
              values="0;1;0"
              dur={`${merged.duration}ms`}
              begin={`${merged.delay + merged.duration * 0.4}ms`}
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>

      {/* Static path */}
      <path
        d={pathData()}
        stroke={merged.pathColor}
        stroke-width={merged.pathWidth}
        fill="none"
        opacity={merged.pathOpacity}
      />

      {/* Animated beam */}
      <path
        d={pathData()}
        stroke={`url(#${id}-pulse)`}
        stroke-width={merged.pathWidth * 2}
        fill="none"
        stroke-linecap="round"
      >
        <animate
          attributeName="stroke-dasharray"
          values={'0 1000;50 1000;0 1000'}
          dur={`${merged.duration}ms`}
          begin={`${merged.delay}ms`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          keyTimes="0;0.5;1"
        />
      </path>
    </svg>
  );
};

export default AnimatedBeam;
