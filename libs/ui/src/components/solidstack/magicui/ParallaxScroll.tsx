import { Component, JSX, createSignal, onMount, onCleanup, For } from 'solid-js';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { animate, scroll } from 'motion';

export interface ParallaxScrollProps {
  images: string[];
  className?: string;
}

export const ParallaxScrollDemo: Component = () => {
  return <ParallaxScroll images={images} />;
};

export const ParallaxScroll: Component<ParallaxScrollProps> = (props) => {
  const [scrollY, setScrollY] = createSignal(0);
  let containerRef: HTMLDivElement;
  
  const firstColumn = () => props.images.slice(0, Math.ceil(props.images.length / 3));
  const secondColumn = () => props.images.slice(Math.ceil(props.images.length / 3), Math.ceil((props.images.length * 2) / 3));
  const thirdColumn = () => props.images.slice(Math.ceil((props.images.length * 2) / 3));

  onMount(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  });

  return (
    <div
      ref={containerRef!}
      class={cx(
        css({
          height: '100vh',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '40px',
          padding: '40px',
          maxWidth: '1400px',
          marginX: 'auto',
          md: { gridTemplateColumns: 'repeat(2, 1fr)' },
          lg: { gridTemplateColumns: 'repeat(3, 1fr)' }
        }),
        props.className
      )}
    >
      <div class={css({ display: 'grid', gap: '40px' })}>
        <For each={firstColumn()}>
          {(src, index) => (
            <div
              class={css({
                height: 'auto',
                borderRadius: '12px',
                overflow: 'hidden'
              })}
              style={{
                transform: `translateY(${scrollY() * 0.1}px)`
              }}
            >
              <img
                src={src}
                alt={`parallax-${index()}`}
                class={css({
                  height: 'auto',
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease',
                  _hover: { transform: 'scale(1.05)' }
                })}
                onLoad={() => {
                  // Ensure image heights are calculated properly
                }}
              />
            </div>
          )}
        </For>
      </div>
      
      <div class={css({ display: 'grid', gap: '40px' })}>
        <For each={secondColumn()}>
          {(src, index) => (
            <div
              class={css({
                height: 'auto',
                borderRadius: '12px',
                overflow: 'hidden'
              })}
              style={{
                transform: `translateY(${scrollY() * -0.1}px)`
              }}
            >
              <img
                src={src}
                alt={`parallax-${index()}`}
                class={css({
                  height: 'auto',
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease',
                  _hover: { transform: 'scale(1.05)' }
                })}
              />
            </div>
          )}
        </For>
      </div>
      
      <div class={css({ display: 'grid', gap: '40px' })}>
        <For each={thirdColumn()}>
          {(src, index) => (
            <div
              class={css({
                height: 'auto',
                borderRadius: '12px',
                overflow: 'hidden'
              })}
              style={{
                transform: `translateY(${scrollY() * 0.1}px)`
              }}
            >
              <img
                src={src}
                alt={`parallax-${index()}`}
                class={css({
                  height: 'auto',
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease',
                  _hover: { transform: 'scale(1.05)' }
                })}
              />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const images = [
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  "https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2640&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
];

export default ParallaxScrollDemo;