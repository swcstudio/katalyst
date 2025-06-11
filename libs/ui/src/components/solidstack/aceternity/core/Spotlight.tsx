import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';

export interface SpotlightProps {
  className?: string;
  fill?: string;
  size?: number;
  opacity?: number;
  blur?: string;
}

export const Spotlight: Component<SpotlightProps> = (props) => {
  const size = props.size || 96;
  const fill = props.fill || 'white';
  const opacity = props.opacity || 0.5;
  const blur = props.blur || '64px';

  const spotlightStyles = css({
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, ${fill} 0%, transparent 70%)`,
    borderRadius: 'full',
    opacity: opacity,
    filter: `blur(${blur})`,
    pointerEvents: 'none',
    zIndex: '10',
    animation: 'pulse 4s ease-in-out infinite',
  });

  return <div class={`${spotlightStyles} ${props.className || ''}`} />;
};
