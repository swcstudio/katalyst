import { Component, JSX, createSignal, onMount, onCleanup } from 'solid-js';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';

export interface CompareProps {
  firstImage: string;
  secondImage: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  className?: string;
  slideMode?: 'hover' | 'drag';
  showHandle?: boolean;
  autoPlay?: boolean;
  autoPlayDuration?: number;
}

export const CompareDemo: Component = () => {
  return (
    <div class={css({
      padding: '16px',
      border: '1px solid',
      borderRadius: '24px',
      backgroundColor: 'neutral.100',
      borderColor: 'neutral.200',
      paddingX: '16px',
      _dark: {
        backgroundColor: 'neutral.900',
        borderColor: 'neutral.800'
      }
    })}>
      <Compare
        firstImage="https://assets.aceternity.com/code-problem.png"
        secondImage="https://assets.aceternity.com/code-solution.png"
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  );
};

export const Compare: Component<CompareProps> = (props) => {
  const [sliderPosition, setSliderPosition] = createSignal(50);
  const [isDragging, setIsDragging] = createSignal(false);
  const [isHovering, setIsHovering] = createSignal(false);
  
  let containerRef: HTMLDivElement;
  let animationFrame: number;
  
  const slideMode = () => props.slideMode || 'hover';
  const showHandle = () => props.showHandle ?? true;
  const autoPlay = () => props.autoPlay ?? false;
  const autoPlayDuration = () => props.autoPlayDuration ?? 5000;

  const getPositionFromEvent = (clientX: number): number => {
    if (!containerRef) return 50;
    
    const rect = containerRef.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    return Math.min(Math.max(position, 0), 100);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (slideMode() === 'hover' && isHovering()) {
      const newPosition = getPositionFromEvent(e.clientX);
      setSliderPosition(newPosition);
    } else if (slideMode() === 'drag' && isDragging()) {
      const newPosition = getPositionFromEvent(e.clientX);
      setSliderPosition(newPosition);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (slideMode() === 'drag') {
      setIsDragging(true);
      const newPosition = getPositionFromEvent(e.clientX);
      setSliderPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (slideMode() === 'hover') {
      setSliderPosition(50);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (slideMode() === 'drag' && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const newPosition = getPositionFromEvent(touch.clientX);
      setSliderPosition(newPosition);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (slideMode() === 'drag' && e.touches.length === 1) {
      const touch = e.touches[0];
      const newPosition = getPositionFromEvent(touch.clientX);
      setSliderPosition(newPosition);
    }
  };

  onMount(() => {
    if (slideMode() === 'drag') {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    // Auto-play functionality
    if (autoPlay()) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % autoPlayDuration()) / autoPlayDuration();
        const position = 50 + Math.sin(progress * Math.PI * 2) * 40;
        setSliderPosition(position);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }

    onCleanup(() => {
      if (slideMode() === 'drag') {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    });
  });

  return (
    <div
      ref={containerRef!}
      class={cx(
        css({
          position: 'relative',
          overflow: 'hidden',
          cursor: slideMode() === 'drag' ? 'grab' : 'default',
          userSelect: 'none',
          _active: slideMode() === 'drag' ? { cursor: 'grabbing' } : {}
        }),
        props.className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={slideMode() === 'hover' ? handleMouseMove : undefined}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* First Image (Background) */}
      <div class={css({
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      })}>
        <img
          src={props.firstImage}
          alt="First comparison image"
          class={cx(
            css({
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }),
            props.firstImageClassName
          )}
          draggable={false}
        />
      </div>

      {/* Second Image (Overlay with clip-path) */}
      <div
        class={css({
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transition: 'clip-path 0.3s ease',
          clipPath: `polygon(0 0, ${sliderPosition()}% 0, ${sliderPosition()}% 100%, 0 100%)`
        })}
      >
        <img
          src={props.secondImage}
          alt="Second comparison image"
          class={cx(
            css({
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }),
            props.secondImageClassname
          )}
          draggable={false}
        />
      </div>

      {/* Slider Handle */}
      {showHandle() && (
        <div
          class={css({
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '2px',
            backgroundColor: 'white',
            transform: 'translateX(-50%)',
            transition: 'left 0.3s ease',
            zIndex: 10,
            pointerEvents: 'none'
          })}
          style={{ left: `${sliderPosition()}%` }}
        >
          {/* Handle Circle */}
          <div class={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            backgroundColor: 'white',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'gray.300',
            cursor: slideMode() === 'drag' ? 'grab' : 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            pointerEvents: 'auto',
            _active: slideMode() === 'drag' ? { cursor: 'grabbing' } : {},
            _hover: {
              transform: 'translate(-50%, -50%) scale(1.1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }
          })}>
            {/* Arrow Icons */}
            <div class={css({
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            })}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={css({ color: 'gray.600' })}
              >
                <path d="M18 8L22 12L18 16" />
                <path d="M6 8L2 12L6 16" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Labels */}
      <div class={css({
        position: 'absolute',
        top: '16px',
        left: '16px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        paddingX: '8px',
        paddingY: '4px',
        borderRadius: '4px',
        fontSize: 'sm',
        fontWeight: '500'
      })}>
        Before
      </div>
      
      <div class={css({
        position: 'absolute',
        top: '16px',
        right: '16px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        paddingX: '8px',
        paddingY: '4px',
        borderRadius: '4px',
        fontSize: 'sm',
        fontWeight: '500'
      })}>
        After
      </div>
    </div>
  );
};