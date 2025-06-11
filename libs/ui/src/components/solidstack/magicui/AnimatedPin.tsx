import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  type JSX,
  children,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js';

export interface PinContainerProps {
  children?: JSX.Element;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}

export const PinContainer: Component<PinContainerProps> = (props) => {
  const [local, others] = splitProps(props, [
    'children',
    'title',
    'href',
    'className',
    'containerClassName',
  ]);
  const [transform, setTransform] = createSignal('');
  const [isHovered, setIsHovered] = createSignal(false);
  let containerRef: HTMLDivElement;

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef) return;
    const { left, top, width, height } = containerRef.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    setTransform(`rotateY(${x * 20}deg) rotateX(${y * -20}deg)`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('');
  };

  const resolved = children(() => local.children);

  return (
    <div
      ref={containerRef!}
      class={css(
        {
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        local.containerClassName
      )}
      style={{
        perspective: '1000px',
      }}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        class={css(
          {
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          },
          local.className
        )}
        style={{
          transform: isHovered() ? transform() : '',
          transition: 'transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
        }}
      >
        {/* Pin */}
        <div
          class={css({
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
          })}
        >
          <div
            class={css({
              width: '8px',
              height: '40px',
              backgroundColor: 'slate.700',
              borderRadius: 'full',
              _dark: {
                backgroundColor: 'slate.200',
              },
            })}
          />
          <div
            class={css({
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '16px',
              backgroundColor: 'slate.700',
              borderRadius: 'full',
              border: '2px solid',
              borderColor: 'slate.200',
              _dark: {
                backgroundColor: 'slate.200',
                borderColor: 'slate.700',
              },
            })}
          />
          {/* Pin Shadow */}
          <div
            class={css({
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%) perspective(400px) rotateX(90deg)',
              width: '20px',
              height: '20px',
              backgroundColor: 'black',
              borderRadius: 'full',
              opacity: 0.4,
              filter: 'blur(6px)',
            })}
          />
        </div>

        {/* Title tooltip */}
        {local.title && (
          <div
            class={css({
              position: 'absolute',
              top: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'black',
              color: 'white',
              padding: '2px 8px',
              borderRadius: 'md',
              fontSize: 'xs',
              whiteSpace: 'nowrap',
              opacity: isHovered() ? 1 : 0,
              transition: 'opacity 0.2s',
              zIndex: 70,
              _dark: {
                backgroundColor: 'white',
                color: 'black',
              },
            })}
          >
            {local.title}
          </div>
        )}

        {/* Card */}
        <div
          class={css({
            position: 'relative',
            zIndex: 20,
            borderRadius: '2xl',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transformStyle: 'preserve-3d',
          })}
          style={{
            transform: isHovered() ? 'translateZ(50px)' : 'translateZ(0px)',
            transition: 'transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
          }}
        >
          {local.href ? (
            <a href={local.href} target="_blank" rel="noopener noreferrer">
              {resolved()}
            </a>
          ) : (
            resolved()
          )}
        </div>
      </div>
    </div>
  );
};

export interface AnimatedPinDemoProps {
  className?: string;
}

export const AnimatedPinDemo: Component<AnimatedPinDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          height: '40rem',
          width: 'full',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.className
      )}
    >
      <PinContainer title="/ui.aceternity.com" href="https://twitter.com/mannupaaji">
        <div
          class={css({
            display: 'flex',
            flexBasis: 'full',
            flexDirection: 'column',
            padding: '4',
            letterSpacing: 'tight',
            color: 'rgba(226, 232, 240, 0.5)',
            width: '20rem',
            height: '20rem',
            _sm: {
              flexBasis: '1/2',
            },
          })}
        >
          <h3
            class={css({
              maxWidth: 'xs',
              paddingBottom: '2',
              margin: '0',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'slate.100',
            })}
          >
            Aceternity UI
          </h3>
          <div
            class={css({
              fontSize: 'base',
              margin: '0',
              padding: '0',
              fontWeight: 'normal',
            })}
          >
            <span
              class={css({
                color: 'slate.500',
              })}
            >
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
          </div>
          <div
            class={css({
              display: 'flex',
              flex: '1',
              width: 'full',
              borderRadius: 'lg',
              marginTop: '4',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #3b82f6)',
            })}
          />
        </div>
      </PinContainer>
    </div>
  );
};

export default AnimatedPinDemo;
