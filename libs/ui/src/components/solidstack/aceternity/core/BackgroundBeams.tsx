import { Component, createSignal, onMount, onCleanup } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface BackgroundBeamsProps {
  className?: string;
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: number;
  blendingValue?: string;
}

export const BackgroundBeams: Component<BackgroundBeamsProps> = (props) => {
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(() => {
    setIsMounted(true);
  });

  const containerStyles = css({
    position: 'absolute',
    inset: '0',
    width: 'full',
    height: 'full',
    overflow: 'hidden',
    zIndex: '0',
    pointerEvents: 'none'
  });

  const svgStyles = css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: 'full',
    height: 'full',
    opacity: '0.4'
  });

  const gradientBackgroundStart = props.gradientBackgroundStart || '#18181b';
  const gradientBackgroundEnd = props.gradientBackgroundEnd || '#000';
  const firstColor = props.firstColor || '#ffaa40';
  const secondColor = props.secondColor || '#9c40ff';
  const thirdColor = props.thirdColor || '#ffaa40';
  const fourthColor = props.fourthColor || '#9c40ff';
  const fifthColor = props.fifthColor || '#ffaa40';
  const pointerColor = props.pointerColor || '#ffffff';
  const size = props.size || 700;
  const blendingValue = props.blendingValue || 'hard-light';

  return (
    <div class={`${containerStyles} ${props.className || ''}`}>
      <svg
        class={svgStyles}
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={`stop-color:${firstColor};stop-opacity:0.8`}>
              <animate
                attributeName="stop-opacity"
                values="0.8;0.3;0.8"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" style={`stop-color:${secondColor};stop-opacity:0.4`}>
              <animate
                attributeName="stop-opacity"
                values="0.4;0.8;0.4"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={`stop-color:${thirdColor};stop-opacity:0.6`}>
              <animate
                attributeName="stop-opacity"
                values="0.6;0.2;0.6"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" style={`stop-color:${fourthColor};stop-opacity:0.3`}>
              <animate
                attributeName="stop-opacity"
                values="0.3;0.7;0.3"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={`stop-color:${fifthColor};stop-opacity:0.8`}>
              <animate
                attributeName="stop-opacity"
                values="0.8;0.1;0.8"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" style={`stop-color:${pointerColor};stop-opacity:0`} />
          </radialGradient>

          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>

        {/* Animated beam paths */}
        <path
          d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875"
          stroke="url(#gradient1)"
          stroke-width="2"
          stroke-linecap="round"
          fill="none"
          filter="url(#blur)"
        >
          <animate
            attributeName="d"
            values="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875;M-390 -199C-390 -199 -322 206 142 333C606 460 674 865 674 865;M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867"
          stroke="url(#gradient2)"
          stroke-width="1.5"
          stroke-linecap="round"
          fill="none"
          filter="url(#blur)"
        >
          <animate
            attributeName="d"
            values="M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867;M-383 -207C-383 -207 -315 198 149 325C613 452 681 857 681 857;M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867"
            dur="12s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859"
          stroke="url(#gradient1)"
          stroke-width="1"
          stroke-linecap="round"
          fill="none"
          filter="url(#blur)"
        >
          <animate
            attributeName="d"
            values="M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859;M-376 -215C-376 -215 -308 190 156 317C620 444 688 849 688 849;M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859"
            dur="14s"
            repeatCount="indefinite"
          />
        </path>

        {/* Floating orbs */}
        <circle
          cx="100"
          cy="100"
          r="3"
          fill="url(#gradient3)"
          filter="url(#blur)"
        >
          <animate
            attributeName="cx"
            values="100;300;100"
            dur="20s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="100;200;300;100"
            dur="20s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="3;8;3"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx="300"
          cy="300"
          r="4"
          fill="url(#gradient2)"
          filter="url(#blur)"
        >
          <animate
            attributeName="cx"
            values="300;100;300"
            dur="18s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="300;100;200;300"
            dur="18s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="4;10;4"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx="200"
          cy="200"
          r="2"
          fill="url(#gradient1)"
          filter="url(#blur)"
        >
          <animate
            attributeName="cx"
            values="200;50;350;200"
            dur="25s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="200;350;50;200"
            dur="25s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="2;6;2"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Additional gradient overlay */}
      <div
        class={css({
          position: 'absolute',
          inset: '0',
          background: `linear-gradient(135deg, ${gradientBackgroundStart} 0%, ${gradientBackgroundEnd} 100%)`,
          opacity: '0.3',
          mixBlendMode: blendingValue as any
        })}
      />
    </div>
  );
};