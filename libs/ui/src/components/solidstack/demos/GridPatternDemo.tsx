import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';
import GridPattern from '../../mystic/backgrounds/GridPattern';

export const GridPatternDemo: Component = () => {
  const squares = [
    [4, 4],
    [5, 1],
    [8, 2],
    [5, 3],
    [5, 5],
    [10, 10],
    [12, 15],
    [15, 10],
    [10, 15],
    [15, 10],
    [10, 15],
    [15, 10],
  ];

  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        height: '500px',
        width: 'full',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'border',
        backgroundColor: 'background',
      })}
    >
      <GridPattern
        className={css({
          maskImage: 'radial-gradient(400px circle at center, white, transparent)',
          WebkitMaskImage: 'radial-gradient(400px circle at center, white, transparent)',
          insetX: '0',
          insetY: '-30%',
          height: '200%',
          transform: 'skewY(12deg)',
        })}
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray={0}
      />
    </div>
  );
};

export default GridPatternDemo;
