import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder WobbleCard component - this would need to be implemented separately
const WobbleCard: Component<{
  containerClassName?: string;
  className?: string;
  children: any;
}> = (props) => {
  return (
    <div 
      class={css({
        position: 'relative',
        borderRadius: 'lg',
        padding: '6',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        transition: 'all 0.3s ease',
        _hover: {
          transform: 'translateY(-2px)',
        },
      }, props.containerClassName)}
    >
      <div class={css({
        position: 'relative',
        zIndex: '10',
      }, props.className)}>
        {props.children}
      </div>
      
      {/* Wobble effect overlay */}
      <div class={css({
        position: 'absolute',
        inset: '0',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
        animation: 'wobble 4s ease-in-out infinite',
        pointerEvents: 'none',
      })} />
      
      <style>{`
        @keyframes wobble {
          0%, 100% { transform: translateX(0%) rotate(0deg); }
          15% { transform: translateX(-25px) rotate(-5deg); }
          30% { transform: translateX(20px) rotate(3deg); }
          45% { transform: translateX(-15px) rotate(-3deg); }
          60% { transform: translateX(10px) rotate(2deg); }
          75% { transform: translateX(-5px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
};

export const WobbleCardDemo: Component = () => {
  return (
    <div class={css({
      display: 'grid',
      gridTemplateColumns: '1',
      gap: '4',
      maxWidth: '7xl',
      marginX: 'auto',
      width: 'full',
      lg: {
        gridTemplateColumns: '3',
      },
    })}>
      <WobbleCard
        containerClassName={css({
          gridColumn: '1',
          height: 'full',
          backgroundColor: 'pink.800',
          minHeight: '500px',
          lg: {
            gridColumn: 'span 2',
            minHeight: '300px',
          },
        })}
        className=""
      >
        <div class={css({
          maxWidth: 'xs',
        })}>
          <h2 class={css({
            textAlign: 'left',
            fontSize: 'base',
            fontWeight: 'semibold',
            letterSpacing: 'tight',
            color: 'white',
            md: {
              fontSize: 'xl',
            },
            lg: {
              fontSize: '3xl',
            },
          })}>
            Gippity AI powers the entire universe
          </h2>
          <p class={css({
            marginTop: '4',
            textAlign: 'left',
            fontSize: 'base',
            lineHeight: '1.5',
            color: 'neutral.200',
          })}>
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p>
        </div>
        <img
          src="/linear.webp"
          width="500"
          height="500"
          alt="linear demo image"
          class={css({
            position: 'absolute',
            right: '-4',
            bottom: '-10',
            objectFit: 'contain',
            borderRadius: '2xl',
            filter: 'grayscale(100%)',
            lg: {
              right: '-40%',
            },
          })}
        />
      </WobbleCard>
      
      <WobbleCard containerClassName={css({
        gridColumn: '1',
        minHeight: '300px',
      })}>
        <h2 class={css({
          maxWidth: '80',
          textAlign: 'left',
          fontSize: 'base',
          fontWeight: 'semibold',
          letterSpacing: 'tight',
          color: 'white',
          md: {
            fontSize: 'xl',
          },
          lg: {
            fontSize: '3xl',
          },
        })}>
          No shirt, no shoes, no weapons.
        </h2>
        <p class={css({
          marginTop: '4',
          maxWidth: '26rem',
          textAlign: 'left',
          fontSize: 'base',
          lineHeight: '1.5',
          color: 'neutral.200',
        })}>
          If someone yells "stop!", goes limp, or taps out, the fight is over.
        </p>
      </WobbleCard>
      
      <WobbleCard containerClassName={css({
        gridColumn: '1',
        backgroundColor: 'blue.900',
        minHeight: '500px',
        lg: {
          gridColumn: 'span 3',
          minHeight: '600px',
        },
        xl: {
          minHeight: '300px',
        },
      })}>
        <div class={css({
          maxWidth: 'sm',
        })}>
          <h2 class={css({
            maxWidth: 'sm',
            textAlign: 'left',
            fontSize: 'base',
            fontWeight: 'semibold',
            letterSpacing: 'tight',
            color: 'white',
            md: {
              maxWidth: 'lg',
              fontSize: 'xl',
            },
            lg: {
              fontSize: '3xl',
            },
          })}>
            Signup for blazing-fast cutting-edge state of the art Gippity AI
            wrapper today!
          </h2>
          <p class={css({
            marginTop: '4',
            maxWidth: '26rem',
            textAlign: 'left',
            fontSize: 'base',
            lineHeight: '1.5',
            color: 'neutral.200',
          })}>
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p>
        </div>
        <img
          src="/linear.webp"
          width="500"
          height="500"
          alt="linear demo image"
          class={css({
            position: 'absolute',
            right: '-10',
            bottom: '-10',
            objectFit: 'contain',
            borderRadius: '2xl',
            md: {
              right: '-40%',
            },
            lg: {
              right: '-20%',
            },
          })}
        />
      </WobbleCard>
    </div>
  );
};

export default WobbleCardDemo;