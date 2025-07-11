import { css, cx } from '@sse/ui/styled-system/css';
import { animate, inView } from 'motion';
import { type Component, type JSX, onMount } from 'solid-js';

export interface LampContainerProps {
  children: JSX.Element;
  className?: string;
}

export const LampDemo: Component = () => {
  let textRef: HTMLHeadingElement;

  onMount(() => {
    if (textRef) {
      inView(textRef, () => {
        animate(
          textRef,
          {
            opacity: [0.5, 1],
            y: [100, 0],
          },
          {
            delay: 0.3,
            duration: 0.8,
            easing: [0.4, 0.0, 0.2, 1],
          }
        );
      });
    }
  });

  return (
    <LampContainer>
      <h1
        ref={textRef!}
        class={css({
          marginTop: '32px',
          background: 'linear-gradient(to bottom right, #cbd5e1, #64748b)',
          paddingY: '16px',
          backgroundClip: 'text',
          textAlign: 'center',
          fontSize: '4xl',
          fontWeight: '500',
          letterSpacing: 'tight',
          color: 'transparent',
          opacity: 0.5,
          md: { fontSize: '7xl' },
        })}
      >
        Build lamps <br /> the right way
      </h1>
    </LampContainer>
  );
};

export const LampContainer: Component<LampContainerProps> = (props) => {
  onMount(() => {
    // Animate the lamp beams
    const beams = document.querySelectorAll('.lamp-beam');
    beams.forEach((beam, index) => {
      animate(
        beam,
        {
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.1, 1],
        },
        {
          duration: 4 + index * 0.5,
          repeat: Number.POSITIVE_INFINITY,
          easing: 'ease-in-out',
        }
      );
    });

    // Animate the lamp glow
    const glow = document.querySelector('.lamp-glow');
    if (glow) {
      animate(
        glow,
        {
          opacity: [0.6, 1, 0.6],
          scale: [0.95, 1.05, 0.95],
        },
        {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          easing: 'ease-in-out',
        }
      );
    }
  });

  return (
    <div
      class={cx(
        css({
          position: 'relative',
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #0f172a, #1e293b, #334155)',
          width: '100%',
        }),
        props.className
      )}
    >
      {/* Lamp Structure */}
      <div
        class={css({
          position: 'absolute',
          top: '-50vh',
          width: '100%',
          height: '200vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        {/* Main Lamp Beam */}
        <div
          class={cx(
            'lamp-beam',
            css({
              position: 'absolute',
              top: 0,
              width: '200px',
              height: '100vh',
              background:
                'linear-gradient(to bottom, rgba(147, 197, 253, 0.5) 0%, rgba(147, 197, 253, 0.2) 50%, transparent 100%)',
              clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
              filter: 'blur(2px)',
            })
          )}
        />

        {/* Secondary Lamp Beams */}
        <div
          class={cx(
            'lamp-beam',
            css({
              position: 'absolute',
              top: 0,
              width: '150px',
              height: '80vh',
              background:
                'linear-gradient(to bottom, rgba(239, 246, 255, 0.4) 0%, rgba(219, 234, 254, 0.2) 40%, transparent 100%)',
              clipPath: 'polygon(45% 0%, 55% 0%, 90% 100%, 10% 100%)',
              filter: 'blur(1px)',
            })
          )}
        />

        <div
          class={cx(
            'lamp-beam',
            css({
              position: 'absolute',
              top: 0,
              width: '300px',
              height: '120vh',
              background:
                'linear-gradient(to bottom, rgba(96, 165, 250, 0.3) 0%, rgba(96, 165, 250, 0.1) 30%, transparent 100%)',
              clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
              filter: 'blur(3px)',
            })
          )}
        />

        {/* Lamp Glow Effect */}
        <div
          class={cx(
            'lamp-glow',
            css({
              position: 'absolute',
              top: '-100px',
              width: '400px',
              height: '200px',
              background:
                'radial-gradient(ellipse, rgba(147, 197, 253, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
            })
          )}
        />

        {/* Lamp Top */}
        <div
          class={css({
            position: 'absolute',
            top: '-80px',
            width: '60px',
            height: '20px',
            backgroundColor: '#374151',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(147, 197, 253, 0.5)',
          })}
        />

        {/* Lamp Cord */}
        <div
          class={css({
            position: 'absolute',
            top: '-80px',
            width: '2px',
            height: '40px',
            backgroundColor: '#4b5563',
          })}
        />
      </div>

      {/* Content */}
      <div
        class={css({
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          paddingX: '24px',
        })}
      >
        {props.children}
      </div>

      {/* Ambient Light Spots */}
      <div
        class={css({
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(15px)',
          animation: 'float 6s ease-in-out infinite',
        })}
      />

      <div
        class={css({
          position: 'absolute',
          bottom: '30%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(12px)',
          animation: 'float 8s ease-in-out infinite reverse',
        })}
      />

      <style>
        {`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) scale(1);
              opacity: 0.6;
            }
            50% { 
              transform: translateY(-20px) scale(1.1);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LampDemo;
