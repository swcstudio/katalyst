import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, onCleanup, onMount } from 'solid-js';

// Placeholder SmoothCursor component - this would need to be implemented separately
const SmoothCursor: Component = () => {
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setMousePosition({ x: touch.clientX, y: touch.clientY });
      setIsVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchstart', handleTouchStart);

    onCleanup(() => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchstart', handleTouchStart);
    });
  });

  return (
    <div
      class={css({
        position: 'fixed',
        top: '0',
        left: '0',
        pointerEvents: 'none',
        zIndex: '9999',
        mixBlendMode: 'difference',
        transition: 'all 0.1s ease-out',
        opacity: isVisible() ? '1' : '0',
      })}
      style={{
        transform: `translate(${mousePosition().x - 10}px, ${mousePosition().y - 10}px)`,
      }}
    >
      {/* Outer ring */}
      <div
        class={css({
          width: '40px',
          height: '40px',
          border: '2px solid white',
          borderRadius: 'full',
          position: 'absolute',
          animation: 'pulse 2s infinite',
        })}
      />

      {/* Inner dot */}
      <div
        class={css({
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: 'full',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        })}
      />

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const SmoothCursorDemo: Component = () => {
  return (
    <div
      class={css({
        padding: '8',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray.50',
        borderRadius: 'lg',
        _dark: {
          backgroundColor: 'gray.900',
        },
      })}
    >
      <span
        class={css({
          display: 'none',
          fontSize: 'lg',
          color: 'gray.700',
          marginBottom: '4',
          md: {
            display: 'block',
          },
          _dark: {
            color: 'gray.300',
          },
        })}
      >
        Move your mouse around
      </span>
      <span
        class={css({
          display: 'block',
          fontSize: 'lg',
          color: 'gray.700',
          marginBottom: '4',
          md: {
            display: 'none',
          },
          _dark: {
            color: 'gray.300',
          },
        })}
      >
        Tap anywhere to see the cursor
      </span>
      <SmoothCursor />
    </div>
  );
};

export default SmoothCursorDemo;
