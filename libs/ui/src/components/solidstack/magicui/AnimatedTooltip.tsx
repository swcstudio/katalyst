import { Component, JSX, mergeProps, createSignal, onMount, onCleanup, For, Show } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface TooltipItem {
  id: number;
  name: string;
  designation: string;
  image: string;
}

export interface AnimatedTooltipProps {
  items: TooltipItem[];
  className?: string;
}

export const AnimatedTooltip: Component<AnimatedTooltipProps> = (props) => {
  const merged = mergeProps({}, props);
  const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null);
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove);
  });

  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove);
  });

  return (
    <div class={css({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2',
      position: 'relative',
    }, merged.className)}>
      <For each={merged.items}>
        {(item, index) => (
          <>
            <div
              class={css({
                position: 'relative',
                zIndex: hoveredIndex() === index() ? 50 : 10,
                transition: 'all 0.3s ease',
                transform: hoveredIndex() === index() ? 'scale(1.1)' : 'scale(1)',
              })}
              onMouseEnter={() => setHoveredIndex(index())}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={item.image}
                alt={item.name}
                class={css({
                  width: '14',
                  height: '14',
                  borderRadius: 'full',
                  border: '3px solid',
                  borderColor: hoveredIndex() === index() ? 'white' : 'transparent',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: hoveredIndex() === index() 
                    ? '0 10px 25px rgba(0, 0, 0, 0.2)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.1)',
                })}
              />
            </div>

            <Show when={hoveredIndex() === index()}>
              <div
                class={css({
                  position: 'fixed',
                  zIndex: 60,
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-12px',
                })}
                style={{
                  left: `${mousePosition().x}px`,
                  top: `${mousePosition().y}px`,
                }}
              >
                <div class={css({
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '3',
                  borderRadius: 'lg',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  minWidth: '48',
                  textAlign: 'center',
                  animation: 'fadeInScale 0.2s ease-out',
                  _dark: {
                    backgroundColor: 'white',
                    color: 'black',
                  },
                })}>
                  <div class={css({
                    fontSize: 'sm',
                    fontWeight: 'semibold',
                    marginBottom: '1',
                  })}>
                    {item.name}
                  </div>
                  <div class={css({
                    fontSize: 'xs',
                    opacity: 0.8,
                  })}>
                    {item.designation}
                  </div>
                  
                  {/* Arrow */}
                  <div class={css({
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid black',
                    _dark: {
                      borderTopColor: 'white',
                    },
                  })} />
                </div>
              </div>
            </Show>
          </>
        )}
      </For>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -100%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -100%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export interface AnimatedTooltipPreviewProps {
  className?: string;
}

export const AnimatedTooltipPreview: Component<AnimatedTooltipPreviewProps> = (props) => {
  const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "Software Engineer",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Product Manager",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      name: "Jane Smith",
      designation: "Data Scientist",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 4,
      name: "Emily Davis",
      designation: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 5,
      name: "Tyler Durden",
      designation: "Soap Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    },
    {
      id: 6,
      name: "Dora",
      designation: "The Explorer",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    },
  ];

  return (
    <div class={css({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10',
      width: 'full',
    }, props.className)}>
      <AnimatedTooltip items={people} />
    </div>
  );
};

export default AnimatedTooltipPreview;