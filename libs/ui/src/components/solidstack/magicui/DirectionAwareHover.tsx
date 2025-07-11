import { css, cx } from '@sse/ui/styled-system/css';
import { animate } from 'motion';
import { type Component, createSignal, type JSX, onCleanup, onMount } from 'solid-js';

export interface DirectionAwareHoverProps {
  imageUrl: string;
  children: JSX.Element;
  className?: string;
  overlayClassName?: string;
}

type Direction = 'top' | 'bottom' | 'left' | 'right';

export const DirectionAwareHoverDemo: Component = () => {
  const imageUrl =
    'https://images.unsplash.com/photo-1663765970236-f2acfde22237?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div
      class={css({
        height: '640px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <DirectionAwareHover imageUrl={imageUrl}>
        <p class={css({ fontWeight: 'bold', fontSize: 'xl' })}>In the mountains</p>
        <p class={css({ fontWeight: 'normal', fontSize: 'sm' })}>$1299 / night</p>
      </DirectionAwareHover>
    </div>
  );
};

export const DirectionAwareHover: Component<DirectionAwareHoverProps> = (props) => {
  const [isHovered, setIsHovered] = createSignal(false);
  const [direction, setDirection] = createSignal<Direction>('top');

  let containerRef: HTMLDivElement;
  let overlayRef: HTMLDivElement;
  let imageRef: HTMLImageElement;

  const getDirection = (e: MouseEvent, element: HTMLElement): Direction => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Calculate which edge is closest
    const distances = {
      top: y,
      bottom: height - y,
      left: x,
      right: width - x,
    };

    const minDistance = Math.min(...Object.values(distances));

    return (
      (Object.entries(distances).find(
        ([_, distance]) => distance === minDistance
      )?.[0] as Direction) || 'top'
    );
  };

  const getOverlayTransform = (dir: Direction, isEntering: boolean) => {
    const offset = isEntering ? '0%' : getExitOffset(dir);

    switch (dir) {
      case 'top':
        return `translateY(${isEntering ? '0%' : '-100%'})`;
      case 'bottom':
        return `translateY(${isEntering ? '0%' : '100%'})`;
      case 'left':
        return `translateX(${isEntering ? '0%' : '-100%'})`;
      case 'right':
        return `translateX(${isEntering ? '0%' : '100%'})`;
      default:
        return 'translateY(0%)';
    }
  };

  const getExitOffset = (dir: Direction) => {
    switch (dir) {
      case 'top':
        return '-100%';
      case 'bottom':
        return '100%';
      case 'left':
        return '-100%';
      case 'right':
        return '100%';
      default:
        return '0%';
    }
  };

  const handleMouseEnter = (e: MouseEvent) => {
    const dir = getDirection(e, containerRef);
    setDirection(dir);
    setIsHovered(true);

    if (overlayRef && imageRef) {
      // Animate overlay entrance
      animate(
        overlayRef,
        {
          opacity: [0, 1],
          transform: [getOverlayTransform(dir, false), getOverlayTransform(dir, true)],
        },
        { duration: 0.3, easing: 'ease-out' }
      );

      // Animate image scale
      animate(imageRef, { scale: [1, 1.1] }, { duration: 0.6, easing: 'ease-out' });
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const dir = getDirection(e, containerRef);
    setDirection(dir);
    setIsHovered(false);

    if (overlayRef && imageRef) {
      // Animate overlay exit
      animate(
        overlayRef,
        {
          opacity: [1, 0],
          transform: [getOverlayTransform(dir, true), getOverlayTransform(dir, false)],
        },
        { duration: 0.3, easing: 'ease-in' }
      );

      // Animate image scale back
      animate(imageRef, { scale: [1.1, 1] }, { duration: 0.6, easing: 'ease-out' });
    }
  };

  return (
    <div
      ref={containerRef!}
      class={cx(
        css({
          position: 'relative',
          width: '400px',
          height: '300px',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }),
        props.className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <img
        ref={imageRef!}
        src={props.imageUrl}
        alt="Direction aware hover"
        class={css({
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        })}
      />

      {/* Overlay */}
      <div
        ref={overlayRef!}
        class={cx(
          css({
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            padding: '24px',
            opacity: 0,
          }),
          props.overlayClassName
        )}
        style={{
          transform: getOverlayTransform(direction(), false),
        }}
      >
        {props.children}
      </div>

      {/* Gradient overlay for better text readability */}
      <div
        class={css({
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        })}
        style={{
          opacity: isHovered() ? 1 : 0,
        }}
      />
    </div>
  );
};
