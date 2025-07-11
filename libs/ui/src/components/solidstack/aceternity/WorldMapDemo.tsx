import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, For, onMount } from 'solid-js';

// Placeholder WorldMap component - this would need to be implemented separately
const WorldMap: Component<{
  dots: Array<{
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
  }>;
}> = (props) => {
  return (
    <div
      class={css({
        position: 'relative',
        width: 'full',
        height: '96',
        marginX: 'auto',
        marginTop: '8',
        maxWidth: '6xl',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
        borderRadius: 'xl',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      {/* Placeholder world map visualization */}
      <div
        class={css({
          position: 'relative',
          width: 'full',
          height: 'full',
          background:
            'radial-gradient(circle at 30% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
        })}
      >
        {/* Simulate connection lines */}
        <For each={props.dots}>
          {(dot, index) => (
            <div
              class={css({
                position: 'absolute',
                width: '2px',
                height: '20px',
                backgroundColor: 'cyan.400',
                borderRadius: 'full',
                animation: `pulse 2s ease-in-out infinite ${index() * 0.2}s`,
                left: `${20 + index() * 15}%`,
                top: `${30 + index() * 10}%`,
              })}
            />
          )}
        </For>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

// Animated text component
const AnimatedText: Component<{ text: string }> = (props) => {
  const [visibleChars, setVisibleChars] = createSignal(0);

  onMount(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= props.text.length) {
        setVisibleChars(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);
  });

  return (
    <span class={css({ color: 'neutral.400' })}>
      <For each={props.text.split('')}>
        {(char, index) => (
          <span
            class={css({
              display: 'inline-block',
              opacity: index() < visibleChars() ? '1' : '0',
              transform: index() < visibleChars() ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'all 0.5s ease',
            })}
          >
            {char}
          </span>
        )}
      </For>
    </span>
  );
};

export const WorldMapDemo: Component = () => {
  const dots = [
    {
      start: {
        lat: 64.2008,
        lng: -149.4937,
      }, // Alaska (Fairbanks)
      end: {
        lat: 34.0522,
        lng: -118.2437,
      }, // Los Angeles
    },
    {
      start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
      end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
    },
    {
      start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
      end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
    },
    {
      start: { lat: 51.5074, lng: -0.1278 }, // London
      end: { lat: 28.6139, lng: 77.209 }, // New Delhi
    },
    {
      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
      end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
    },
    {
      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
      end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    },
  ];

  return (
    <div
      class={css({
        paddingY: '40',
        backgroundColor: 'white',
        width: 'full',
        _dark: {
          backgroundColor: 'black',
        },
      })}
    >
      <div
        class={css({
          maxWidth: '7xl',
          marginX: 'auto',
          textAlign: 'center',
        })}
      >
        <p
          class={css({
            fontWeight: 'bold',
            fontSize: 'xl',
            color: 'black',
            _dark: {
              color: 'white',
            },
            md: {
              fontSize: '4xl',
            },
          })}
        >
          Remote <AnimatedText text="Connectivity" />
        </p>
        <p
          class={css({
            fontSize: 'sm',
            color: 'neutral.500',
            maxWidth: '2xl',
            marginX: 'auto',
            paddingY: '4',
            md: {
              fontSize: 'lg',
            },
          })}
        >
          Break free from traditional boundaries. Work from anywhere, at the comfort of your own
          studio apartment. Perfect for Nomads and Travellers.
        </p>
      </div>
      <WorldMap dots={dots} />
    </div>
  );
};

export default WorldMapDemo;
