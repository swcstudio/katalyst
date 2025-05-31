import { Component, JSX, mergeProps, createSignal, For, children, onMount, onCleanup } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface DockItem {
  id: string;
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface DockProps {
  items: DockItem[];
  className?: string;
  style?: JSX.CSSProperties;
  direction?: 'horizontal' | 'vertical';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  size?: 'sm' | 'md' | 'lg';
  distance?: number;
  magnification?: number;
  largeRadius?: number;
  smallRadius?: number;
}

const Dock: Component<DockProps> = (props) => {
  const merged = mergeProps(
    {
      direction: 'horizontal' as const,
      position: 'bottom' as const,
      size: 'md' as const,
      distance: 140,
      magnification: 60,
      largeRadius: 22,
      smallRadius: 14,
    },
    props
  );

  const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null);
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

  const sizeMap = {
    sm: { base: 40, hover: 56 },
    md: { base: 48, hover: 64 },
    lg: { base: 56, hover: 72 },
  };

  const calculateItemScale = (index: number) => {
    const hovered = hoveredIndex();
    if (hovered === null) return 1;

    const distance = Math.abs(index - hovered);
    if (distance === 0) return 1.4;
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.1;
    return 1;
  };

  const getPositionClasses = () => {
    const base = {
      position: 'fixed' as const,
      zIndex: 50,
    };

    switch (merged.position) {
      case 'top':
        return { ...base, top: 4, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { ...base, bottom: 4, left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { ...base, left: 4, top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { ...base, right: 4, top: '50%', transform: 'translateY(-50%)' };
      case 'center':
        return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      default:
        return { ...base, bottom: 4, left: '50%', transform: 'translateX(-50%)' };
    }
  };

  const getDockClasses = () => {
    const positionClasses = getPositionClasses();
    
    return css({
      ...positionClasses,
      display: 'flex',
      flexDirection: merged.direction === 'horizontal' ? 'row' : 'column',
      alignItems: 'center',
      gap: 2,
      padding: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: merged.largeRadius,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }, merged.className);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleItemClick = (item: DockItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.open(item.href, '_blank');
    }
  };

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove);
  });

  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove);
  });

  return (
    <div
      class={getDockClasses()}
      style={merged.style}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <For each={merged.items}>
        {(item, index) => {
          const scale = calculateItemScale(index());
          const baseSize = sizeMap[merged.size].base;
          const finalSize = baseSize * scale;

          return (
            <div
              class={css({
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: merged.smallRadius,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                _hover: {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                _active: {
                  transform: 'scale(0.95)',
                },
              })}
              style={{
                width: `${finalSize}px`,
                height: `${finalSize}px`,
                transform: `scale(${scale})`,
              }}
              onMouseEnter={() => setHoveredIndex(index())}
              onClick={() => handleItemClick(item)}
              title={item.label}
            >
              <div
                class={css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'full',
                  height: 'full',
                  color: 'white',
                  fontSize: merged.size === 'sm' ? 'sm' : merged.size === 'md' ? 'md' : 'lg',
                })}
              >
                {item.icon}
              </div>

              {/* Tooltip */}
              {hoveredIndex() === index() && (
                <div
                  class={css({
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    fontSize: 'xs',
                    borderRadius: 4,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 60,
                    animation: 'fadeIn 0.2s ease-out',
                  })}
                >
                  {item.label}
                  <div
                    class={css({
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: '4px solid rgba(0, 0, 0, 0.8)',
                    })}
                  />
                </div>
              )}
            </div>
          );
        }}
      </For>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dock;