import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder Spotlight component - this would need to be implemented separately
const Spotlight: Component<{ className?: string; fill?: string }> = (props) => {
  return (
    <div 
      class={css({
        position: 'absolute',
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle, ${props.fill || 'white'} 0%, transparent 70%)`,
        borderRadius: 'full',
        opacity: 0.3,
        filter: 'blur(20px)',
      }, props.className)}
    />
  );
};

export const SpotlightPreview: Component = () => {
  return (
    <div class={css({
      position: 'relative',
      display: 'flex',
      height: '40rem',
      width: 'full',
      overflow: 'hidden',
      borderRadius: 'md',
      backgroundColor: 'rgba(0, 0, 0, 0.96)',
      WebkitFontSmoothing: 'antialiased',
      md: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    })}>
      <div class={css({
        pointerEvents: 'none',
        position: 'absolute',
        inset: '0',
        backgroundSize: '40px 40px',
        userSelect: 'none',
        backgroundImage: 'linear-gradient(to right, #171717 1px, transparent 1px), linear-gradient(to bottom, #171717 1px, transparent 1px)',
      })} />

      <Spotlight
        className={css({
          top: '-40',
          left: '0',
          md: {
            top: '-20',
            left: '60',
          },
        })}
        fill="white"
      />
      
      <div class={css({
        position: 'relative',
        zIndex: '10',
        marginX: 'auto',
        width: 'full',
        maxWidth: '7xl',
        padding: '4',
        paddingTop: '20',
        md: {
          paddingTop: '0',
        },
      })}>
        <h1 class={css({
          backgroundOpacity: 0.5,
          background: 'linear-gradient(to bottom, rgb(250, 250, 250), rgb(163, 163, 163))',
          backgroundClip: 'text',
          textAlign: 'center',
          fontSize: '4xl',
          fontWeight: 'bold',
          color: 'transparent',
          md: {
            fontSize: '7xl',
          },
        })}>
          Spotlight <br /> is the new trend.
        </h1>
        <p class={css({
          marginX: 'auto',
          marginTop: '4',
          maxWidth: 'lg',
          textAlign: 'center',
          fontSize: 'base',
          fontWeight: 'normal',
          color: 'rgb(212, 212, 212)',
        })}>
          Spotlight effect is a great way to draw attention to a specific part
          of the page. Here, we are drawing the attention towards the text
          section of the page. I don't know why but I'm running out of
          copy.
        </p>
      </div>
    </div>
  );
};

export default SpotlightPreview;