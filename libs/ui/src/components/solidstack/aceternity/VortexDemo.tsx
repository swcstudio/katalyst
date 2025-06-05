import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder Vortex component - this would need to be implemented separately
const Vortex: Component<{
  backgroundColor?: string;
  rangeY?: number;
  particleCount?: number;
  baseHue?: number;
  className?: string;
  children: any;
}> = (props) => {
  return (
    <div 
      class={css({
        position: 'relative',
        width: 'full',
        height: 'full',
        overflow: 'hidden',
        backgroundColor: props.backgroundColor || 'black',
      }, props.className)}
    >
      {/* Placeholder vortex effect */}
      <div class={css({
        position: 'absolute',
        inset: '0',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        animation: 'vortexSpin 20s linear infinite',
      })} />
      
      <div class={css({
        position: 'relative',
        zIndex: '10',
        width: 'full',
        height: 'full',
      })}>
        {props.children}
      </div>
      
      <style>{`
        @keyframes vortexSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const VortexDemo: Component = () => {
  return (
    <div class={css({
      width: 'calc(100% - 4rem)',
      marginX: 'auto',
      borderRadius: 'md',
      height: '30rem',
      overflow: 'hidden',
    })}>
      <Vortex
        backgroundColor="black"
        className={css({
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingX: '2',
          paddingY: '4',
          width: 'full',
          height: 'full',
          md: {
            paddingX: '10',
          },
        })}
      >
        <h2 class={css({
          color: 'white',
          fontSize: '2xl',
          fontWeight: 'bold',
          textAlign: 'center',
          md: {
            fontSize: '6xl',
          },
        })}>
          The hell is this?
        </h2>
        <p class={css({
          color: 'white',
          fontSize: 'sm',
          maxWidth: 'xl',
          marginTop: '6',
          textAlign: 'center',
          md: {
            fontSize: '2xl',
          },
        })}>
          This is chemical burn. It'll hurt more than you've ever been
          burned and you'll have a scar.
        </p>
        <div class={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4',
          marginTop: '6',
          sm: {
            flexDirection: 'row',
          },
        })}>
          <button class={css({
            paddingX: '4',
            paddingY: '2',
            backgroundColor: 'blue.600',
            borderRadius: 'lg',
            color: 'white',
            boxShadow: '0px 2px 0px 0px rgba(255, 255, 255, 0.25) inset',
            transition: 'all 0.2s',
            _hover: {
              backgroundColor: 'blue.700',
            },
          })}>
            Order now
          </button>
          <button class={css({
            paddingX: '4',
            paddingY: '2',
            color: 'white',
          })}>
            Watch trailer
          </button>
        </div>
      </Vortex>
    </div>
  );
};

export const VortexDemoSecond: Component = () => {
  return (
    <div class={css({
      width: 'calc(100% - 4rem)',
      marginX: 'auto',
      borderRadius: 'md',
      height: 'screen',
      overflow: 'hidden',
    })}>
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className={css({
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingX: '2',
          paddingY: '4',
          width: 'full',
          height: 'full',
          md: {
            paddingX: '10',
          },
        })}
      >
        <h2 class={css({
          color: 'white',
          fontSize: '2xl',
          fontWeight: 'bold',
          textAlign: 'center',
          md: {
            fontSize: '6xl',
          },
        })}>
          The hell is this?
        </h2>
        <p class={css({
          color: 'white',
          fontSize: 'sm',
          maxWidth: 'xl',
          marginTop: '6',
          textAlign: 'center',
          md: {
            fontSize: '2xl',
          },
        })}>
          This is chemical burn. It'll hurt more than you've ever been
          burned and you'll have a scar.
        </p>
        <div class={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4',
          marginTop: '6',
          sm: {
            flexDirection: 'row',
          },
        })}>
          <button class={css({
            paddingX: '4',
            paddingY: '2',
            backgroundColor: 'blue.600',
            borderRadius: 'lg',
            color: 'white',
            boxShadow: '0px 2px 0px 0px rgba(255, 255, 255, 0.25) inset',
            transition: 'all 0.2s',
            _hover: {
              backgroundColor: 'blue.700',
            },
          })}>
            Order now
          </button>
          <button class={css({
            paddingX: '4',
            paddingY: '2',
            color: 'white',
          })}>
            Watch trailer
          </button>
        </div>
      </Vortex>
    </div>
  );
};

export default VortexDemo;