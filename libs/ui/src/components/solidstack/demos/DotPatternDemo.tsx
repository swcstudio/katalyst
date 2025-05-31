import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';
import DotPattern from '../../mystic/backgrounds/DotPattern';

export const DotPatternDemo: Component = () => {
  return (
    <div class={css({
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
      backgroundColor: 'background'
    })}>
      <DotPattern
        className={css({
          maskImage: 'radial-gradient(300px circle at center, white, transparent)',
          WebkitMaskImage: 'radial-gradient(300px circle at center, white, transparent)'
        })}
      />
    </div>
  );
};

export default DotPatternDemo;