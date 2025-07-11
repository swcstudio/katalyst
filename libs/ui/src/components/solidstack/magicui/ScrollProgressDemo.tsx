import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, onCleanup, onMount } from 'solid-js';

// Placeholder ScrollProgress component - this would need to be implemented separately
const ScrollProgress: Component<{
  className?: string;
}> = (props) => {
  const [scrollProgress, setScrollProgress] = createSignal(0);

  onMount(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial calculation

    onCleanup(() => {
      window.removeEventListener('scroll', updateScrollProgress);
    });
  });

  return (
    <div
      class={css(
        {
          position: 'fixed',
          top: '16',
          left: '0',
          width: 'full',
          height: '1',
          backgroundColor: 'gray.200',
          zIndex: '50',
          _dark: {
            backgroundColor: 'gray.800',
          },
        },
        props.className
      )}
    >
      <div
        class={css({
          height: 'full',
          backgroundColor: 'blue.500',
          transition: 'width 0.1s ease-out',
          borderRadius: 'full',
        })}
        style={{
          width: `${scrollProgress()}%`,
        }}
      />
    </div>
  );
};

export const ScrollProgressDemo: Component = () => {
  return (
    <div
      class={css({
        zIndex: '10',
        borderRadius: 'lg',
        padding: '4',
      })}
    >
      <ScrollProgress className={css({ top: '16' })} />
      <h2
        class={css({
          paddingBottom: '4',
          fontWeight: 'bold',
          color: 'gray.900',
          _dark: {
            color: 'white',
          },
        })}
      >
        Note: The scroll progress is shown below the navbar of the page.
      </h2>

      {/* Demo content to enable scrolling */}
      <div
        class={css({
          marginTop: '8',
          space: '4',
        })}
      >
        <p
          class={css({
            marginBottom: '4',
            color: 'gray.700',
            _dark: {
              color: 'gray.300',
            },
          })}
        >
          Scroll down to see the progress bar in action. The blue bar at the top will fill as you
          scroll through the page content.
        </p>

        {/* Generate content for scrolling */}
        <div
          class={css({
            height: '200vh',
            background:
              'linear-gradient(to bottom, transparent, gray.50, gray.100, gray.50, transparent)',
            borderRadius: 'lg',
            padding: '8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            _dark: {
              background:
                'linear-gradient(to bottom, transparent, gray.900, gray.800, gray.900, transparent)',
            },
          })}
        >
          <div
            class={css({
              textAlign: 'center',
              color: 'gray.600',
              _dark: {
                color: 'gray.400',
              },
            })}
          >
            <h3
              class={css({
                fontSize: 'xl',
                fontWeight: 'semibold',
                marginBottom: '2',
              })}
            >
              Demo Content Area
            </h3>
            <p>Keep scrolling to see the progress bar update...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressDemo;
