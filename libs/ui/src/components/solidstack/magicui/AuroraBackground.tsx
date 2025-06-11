import { css } from '@sse/ui/styled-system/css';
import { type Component, type JSX, children, createSignal, mergeProps, onMount } from 'solid-js';

export interface AuroraBackgroundProps {
  children?: JSX.Element;
  className?: string;
  showRadialGradient?: boolean;
}

export const AuroraBackground: Component<AuroraBackgroundProps> = (props) => {
  const merged = mergeProps(
    {
      showRadialGradient: true,
    },
    props
  );

  const resolved = children(() => props.children);

  return (
    <div
      class={css(
        {
          position: 'relative',
          minHeight: '100vh',
          width: 'full',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
        },
        merged.className
      )}
    >
      {/* Aurora background layers */}
      <div
        class={css({
          position: 'absolute',
          inset: 0,
          width: 'full',
          height: 'full',
        })}
      >
        {/* First aurora layer */}
        <div
          class={css({
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background:
              'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(120, 119, 198, 0.3), transparent), radial-gradient(ellipse 80% 80% at 80% 50%, rgba(120, 119, 198, 0.15), transparent)',
            animation: 'aurora1 20s ease-in-out infinite alternate',
          })}
        />

        {/* Second aurora layer */}
        <div
          class={css({
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background:
              'radial-gradient(ellipse 60% 80% at 70% 30%, rgba(184, 148, 255, 0.4), transparent), radial-gradient(ellipse 90% 70% at 30% 70%, rgba(184, 148, 255, 0.2), transparent)',
            animation: 'aurora2 25s ease-in-out infinite alternate-reverse',
          })}
        />

        {/* Third aurora layer */}
        <div
          class={css({
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background:
              'radial-gradient(ellipse 100% 60% at 50% 60%, rgba(255, 154, 158, 0.3), transparent), radial-gradient(ellipse 70% 100% at 80% 20%, rgba(255, 154, 158, 0.15), transparent)',
            animation: 'aurora3 30s ease-in-out infinite alternate',
          })}
        />

        {/* Radial gradient overlay */}
        {merged.showRadialGradient && (
          <div
            class={css({
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.6) 80%)',
            })}
          />
        )}
      </div>

      {/* Content */}
      <div
        class={css({
          position: 'relative',
          zIndex: 10,
          width: 'full',
          height: 'full',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        {resolved()}
      </div>

      <style>{`
        @keyframes aurora1 {
          0% {
            transform: rotate(0deg) translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: rotate(180deg) translate(-60%, -40%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
        }

        @keyframes aurora2 {
          0% {
            transform: rotate(0deg) translate(-40%, -60%) scale(0.9);
            opacity: 0.6;
          }
          33% {
            transform: rotate(120deg) translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
          66% {
            transform: rotate(240deg) translate(-60%, -40%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translate(-40%, -60%) scale(0.9);
            opacity: 0.6;
          }
        }

        @keyframes aurora3 {
          0% {
            transform: rotate(0deg) translate(-60%, -40%) scale(1.1);
            opacity: 0.7;
          }
          40% {
            transform: rotate(144deg) translate(-50%, -60%) scale(0.9);
            opacity: 0.9;
          }
          80% {
            transform: rotate(288deg) translate(-40%, -50%) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: rotate(360deg) translate(-60%, -40%) scale(1.1);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export interface AuroraBackgroundDemoProps {
  className?: string;
}

export const AuroraBackgroundDemo: Component<AuroraBackgroundDemoProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsVisible(true), 300);
  });

  return (
    <AuroraBackground className={props.className}>
      <div
        class={css({
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          alignItems: 'center',
          justifyContent: 'center',
          paddingX: '4',
          opacity: isVisible() ? 1 : 0,
          transform: isVisible() ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transitionDelay: isVisible() ? '0.3s' : '0s',
        })}
      >
        <div
          class={css({
            fontSize: '3xl',
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'white',
            _md: {
              fontSize: '7xl',
            },
            _dark: {
              color: 'white',
            },
          })}
        >
          Background lights are cool you know.
        </div>
        <div
          class={css({
            fontWeight: 'extralight',
            fontSize: 'base',
            paddingY: '4',
            color: 'neutral.200',
            _md: {
              fontSize: '4xl',
            },
            _dark: {
              color: 'neutral.200',
            },
          })}
        >
          And this, is chemical burn.
        </div>
        <button
          class={css({
            backgroundColor: 'black',
            borderRadius: 'full',
            width: 'fit-content',
            color: 'white',
            paddingX: '4',
            paddingY: '2',
            cursor: 'pointer',
            transition: 'all 0.2s',
            _hover: {
              backgroundColor: 'gray.800',
            },
            _dark: {
              backgroundColor: 'white',
              color: 'black',
              _hover: {
                backgroundColor: 'gray.100',
              },
            },
          })}
        >
          Debug now
        </button>
      </div>
    </AuroraBackground>
  );
};

export default AuroraBackgroundDemo;
