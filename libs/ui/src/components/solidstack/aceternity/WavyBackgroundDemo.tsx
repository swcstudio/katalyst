import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';

// Placeholder WavyBackground component - this would need to be implemented separately
const WavyBackground: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          width: 'full',
          height: 'full',
          overflow: 'hidden',
          background: 'linear-gradient(45deg, #1e293b, #334155, #475569)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        },
        props.className
      )}
    >
      {/* Placeholder wavy animation */}
      <div
        class={css({
          position: 'absolute',
          inset: '0',
          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'wavyMove 8s ease-in-out infinite',
          transform: 'translateX(-100%)',
        })}
      />

      <div
        class={css({
          position: 'absolute',
          inset: '0',
          background:
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          animation: 'wavyPulse 6s ease-in-out infinite',
        })}
      />

      <div
        class={css({
          position: 'relative',
          zIndex: '10',
          width: 'full',
          height: 'full',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '8',
        })}
      >
        {props.children}
      </div>

      <style>{`
        @keyframes wavyMove {
          0% { transform: translateX(-100%) skew(-12deg); }
          50% { transform: translateX(100%) skew(12deg); }
          100% { transform: translateX(-100%) skew(-12deg); }
        }
        @keyframes wavyPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export const WavyBackgroundDemo: Component = () => {
  return (
    <WavyBackground
      className={css({
        maxWidth: '4xl',
        marginX: 'auto',
        paddingBottom: '40',
      })}
    >
      <p
        class={css({
          fontSize: '2xl',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          md: {
            fontSize: '4xl',
          },
          lg: {
            fontSize: '7xl',
          },
        })}
      >
        Hero waves are cool
      </p>
      <p
        class={css({
          fontSize: 'base',
          marginTop: '4',
          color: 'white',
          fontWeight: 'normal',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          md: {
            fontSize: 'lg',
          },
        })}
      >
        Leverage the power of canvas to create a beautiful hero section
      </p>
    </WavyBackground>
  );
};

export default WavyBackgroundDemo;
