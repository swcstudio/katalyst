import { Component, JSX } from 'solid-js';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';

export interface CoverProps {
  children: JSX.Element;
  className?: string;
}

export const CoverDemo: Component = () => {
  return (
    <div>
      <h1 class={css({
        fontSize: '4xl',
        fontWeight: '600',
        maxWidth: '1280px',
        marginX: 'auto',
        textAlign: 'center',
        marginTop: '24px',
        position: 'relative',
        zIndex: 20,
        paddingY: '24px',
        backgroundClip: 'text',
        color: 'transparent',
        backgroundImage: 'linear-gradient(to bottom, #525252, #404040, #404040)',
        md: { fontSize: '4xl' },
        lg: { fontSize: '6xl' },
        _dark: {
          backgroundImage: 'linear-gradient(to bottom, #525252, white, white)'
        }
      })}>
        Build amazing websites <br /> at <Cover>warp speed</Cover>
      </h1>
    </div>
  );
};

export const Cover: Component<CoverProps> = (props) => {
  return (
    <span
      class={cx(
        css({
          position: 'relative',
          display: 'inline-block',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          _before: {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            padding: '2px',
            zIndex: -1,
            opacity: 0.1,
            filter: 'blur(10px)'
          },
          _after: {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            zIndex: -2,
            opacity: 0.05,
            filter: 'blur(20px)'
          },
          _hover: {
            _before: {
              opacity: 0.2,
              filter: 'blur(8px)'
            },
            _after: {
              opacity: 0.1,
              filter: 'blur(15px)'
            }
          },
          animation: 'shimmer 3s ease-in-out infinite'
        }),
        props.className
      )}
    >
      {props.children}
      
      <style>
        {`
          @keyframes shimmer {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
    </span>
  );
};