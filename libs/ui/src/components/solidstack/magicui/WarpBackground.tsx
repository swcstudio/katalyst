import { type Component, createSignal, type JSX, onCleanup, onMount } from 'solid-js';
import { css } from '../../styled-system/css';

interface WarpBackgroundProps {
  children?: JSX.Element;
  className?: string;
  intensity?: number;
  speed?: number;
  colors?: string[];
}

export const WarpBackground: Component<WarpBackgroundProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const intensity = () => props.intensity ?? 0.5;
  const speed = () => props.speed ?? 1;
  const colors = () =>
    props.colors ?? ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];

  onMount(() => {
    setMounted(true);
  });

  const warpStyles = css({
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    background: 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)',
  });

  const warpLayerStyles = css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle, ${colors().join(', ')})`,
    opacity: 0.3,
    animation: `warpMove ${20 / speed()}s linear infinite`,
    filter: 'blur(3px)',
    transform: 'scale(1.5)',
  });

  const warpLayer2Styles = css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '150%',
    height: '150%',
    background: `conic-gradient(from 0deg, ${colors().slice(0, 4).join(', ')})`,
    opacity: 0.2,
    animation: `warpRotate ${30 / speed()}s linear infinite reverse`,
    filter: 'blur(5px)',
    transform: 'scale(1.2)',
  });

  const warpLayer3Styles = css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '180%',
    height: '180%',
    background: `linear-gradient(90deg, ${colors().slice(2).join(', ')})`,
    opacity: 0.15,
    animation: `warpPulse ${15 / speed()}s ease-in-out infinite`,
    filter: 'blur(8px)',
    transform: 'scale(1.3)',
  });

  const contentStyles = css({
    position: 'relative',
    zIndex: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  return (
    <div
      ref={containerRef}
      class={`${warpStyles} ${props.className || ''}`}
      style={{
        '--warp-intensity': intensity().toString(),
      }}
    >
      <style>{`
        @keyframes warpMove {
          0% { transform: scale(1.5) translate(-25%, -25%) rotate(0deg); }
          25% { transform: scale(1.6) translate(-30%, -20%) rotate(90deg); }
          50% { transform: scale(1.4) translate(-20%, -30%) rotate(180deg); }
          75% { transform: scale(1.7) translate(-35%, -25%) rotate(270deg); }
          100% { transform: scale(1.5) translate(-25%, -25%) rotate(360deg); }
        }

        @keyframes warpRotate {
          0% { transform: scale(1.2) rotate(0deg); }
          100% { transform: scale(1.2) rotate(-360deg); }
        }

        @keyframes warpPulse {
          0%, 100% { 
            transform: scale(1.3) translateX(-20%); 
            opacity: 0.15;
          }
          50% { 
            transform: scale(1.5) translateX(-25%); 
            opacity: 0.25;
          }
        }

        @keyframes warpDistort {
          0%, 100% { filter: blur(8px) hue-rotate(0deg); }
          25% { filter: blur(12px) hue-rotate(90deg); }
          50% { filter: blur(6px) hue-rotate(180deg); }
          75% { filter: blur(10px) hue-rotate(270deg); }
        }
      `}</style>

      {mounted() && (
        <>
          <div class={warpLayerStyles} />
          <div class={warpLayer2Styles} />
          <div class={warpLayer3Styles} />
        </>
      )}

      <div class={contentStyles}>{props.children}</div>
    </div>
  );
};

export default WarpBackground;
