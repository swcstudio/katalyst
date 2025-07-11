import { css, cx } from '@sse/ui/styled-system/css';
import { animate, scroll } from 'motion';
import { type Component, createSignal, type JSX, onCleanup, onMount } from 'solid-js';

export interface ContainerScrollProps {
  titleComponent: JSX.Element;
  children: JSX.Element;
  className?: string;
}

export const HeroScrollDemo: Component = () => {
  return (
    <div class={css({ display: 'flex', flexDirection: 'column', overflow: 'hidden' })}>
      <ContainerScroll
        titleComponent={
          <>
            <h1
              class={css({
                fontSize: '4xl',
                fontWeight: '600',
                color: 'black',
                _dark: { color: 'white' },
              })}
            >
              Unleash the power of <br />
              <span
                class={css({
                  fontSize: '4xl',
                  fontWeight: 'bold',
                  marginTop: '4px',
                  lineHeight: 'none',
                  md: { fontSize: '6rem' },
                })}
              >
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img
          src="/linear.webp"
          alt="hero"
          height={720}
          width={1400}
          class={css({
            marginX: 'auto',
            borderRadius: '16px',
            objectFit: 'cover',
            height: '100%',
            objectPosition: 'left top',
          })}
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
};

export const ContainerScroll: Component<ContainerScrollProps> = (props) => {
  const [scrollY, setScrollY] = createSignal(0);
  const [containerHeight, setContainerHeight] = createSignal(0);

  let containerRef: HTMLDivElement;

  const handleResize = () => {
    if (containerRef) {
      setContainerHeight(containerRef.offsetHeight);
    }
  };

  onMount(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    // Use Motion's scroll API for smoother animations
    const scrollAnimation = scroll(
      ({ y }) => {
        setScrollY(y.current);
      },
      { target: containerRef }
    );

    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      scrollAnimation.stop();
    });
  });

  const scrollProgress = () => {
    const containerTop = containerRef?.offsetTop || 0;
    const progress = Math.max(
      0,
      Math.min(
        1,
        (scrollY() - containerTop + window.innerHeight) / (containerHeight() + window.innerHeight)
      )
    );
    return progress;
  };

  const translateY = () => {
    return scrollProgress() * -200;
  };

  const scale = () => {
    return 0.7 + scrollProgress() * 0.3;
  };

  const rotate = () => {
    return (1 - scrollProgress()) * 15;
  };

  const opacity = () => {
    return Math.max(0.3, 1 - scrollProgress() * 0.7);
  };

  return (
    <div
      ref={containerRef!}
      class={cx(
        css({
          height: '300vh',
          position: 'relative',
          background: 'linear-gradient(to bottom, transparent, #f1f5f9, transparent)',
          _dark: {
            background: 'linear-gradient(to bottom, transparent, #0f172a, transparent)',
          },
        }),
        props.className
      )}
    >
      {/* Sticky Title */}
      <div
        class={css({
          position: 'sticky',
          top: '20vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          zIndex: 10,
        })}
        style={{ opacity: opacity() }}
      >
        {props.titleComponent}
      </div>

      {/* Scrolling Content */}
      <div
        class={css({
          position: 'sticky',
          top: '50%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: 'translateY(-50%)',
          perspective: '1000px',
        })}
      >
        <div
          class={css({
            maxWidth: '1200px',
            width: '100%',
            paddingX: '24px',
            transformStyle: 'preserve-3d',
          })}
          style={{
            transform: `translateY(${translateY()}px) scale(${scale()}) rotateX(${rotate()}deg)`,
          }}
        >
          <div
            class={css({
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              background: 'white',
              _dark: { background: 'gray.900' },
            })}
          >
            {props.children}
          </div>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div
        class={css({
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: 'gray.200',
          zIndex: 50,
          _dark: { backgroundColor: 'gray.700' },
        })}
      >
        <div
          class={css({
            height: '100%',
            backgroundColor: 'blue.500',
            transition: 'width 0.2s ease-out',
          })}
          style={{ width: `${scrollProgress() * 100}%` }}
        />
      </div>
    </div>
  );
};
