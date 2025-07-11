import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, For, onMount } from 'solid-js';

// Placeholder TextHoverEffect component - this would need to be implemented separately
const TextHoverEffect: Component<{
  text: string;
  className?: string;
}> = (props) => {
  const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null);
  const letters = () => props.text.split('');

  return (
    <div
      class={css(
        {
          fontSize: '8xl',
          fontWeight: 'bold',
          fontFamily: 'mono',
          cursor: 'default',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lg: {
            fontSize: '9xl',
          },
        },
        props.className
      )}
    >
      <For each={letters()}>
        {(letter, index) => (
          <span
            class={css({
              display: 'inline-block',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              color: hoveredIndex() === index() ? 'blue.500' : 'white',
              transform:
                hoveredIndex() === index() ? 'scale(1.2) rotateY(15deg)' : 'scale(1) rotateY(0deg)',
              textShadow:
                hoveredIndex() === index()
                  ? '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'
                  : 'none',
              filter: hoveredIndex() === index() ? 'brightness(1.2)' : 'brightness(1)',
              zIndex: hoveredIndex() === index() ? '10' : '1',
              position: 'relative',
              _hover: {
                transform: 'scale(1.2) rotateY(15deg)',
              },
            })}
            onMouseEnter={() => setHoveredIndex(index())}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {letter}
          </span>
        )}
      </For>
      <style>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
        }
      `}</style>
    </div>
  );
};

export const TextHoverEffectDemo: Component = () => {
  return (
    <div
      class={css({
        height: '40rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        borderRadius: 'lg',
        overflow: 'hidden',
        position: 'relative',
      })}
    >
      {/* Background gradient */}
      <div
        class={css({
          position: 'absolute',
          inset: '0',
          background:
            'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        })}
      />

      {/* Grid pattern */}
      <div
        class={css({
          position: 'absolute',
          inset: '0',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.5,
          pointerEvents: 'none',
        })}
      />

      <TextHoverEffect text="ACET" />
    </div>
  );
};

export default TextHoverEffectDemo;
