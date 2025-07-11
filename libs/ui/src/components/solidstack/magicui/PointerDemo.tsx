import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, type JSX, onCleanup, onMount } from 'solid-js';

// Placeholder Card components
const Card: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <div
      class={css(
        {
          borderRadius: 'lg',
          border: '1px solid',
          borderColor: 'gray.200',
          backgroundColor: 'white',
          boxShadow: 'sm',
          overflow: 'hidden',
          transition: 'all 0.3s',
          _dark: {
            borderColor: 'gray.800',
            backgroundColor: 'gray.900',
          },
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const CardHeader: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          paddingBottom: '2',
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const CardContent: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          display: 'flex',
          height: '40',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6',
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const CardTitle: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <h3
      class={css(
        {
          fontSize: 'xl',
          fontWeight: 'bold',
        },
        props.className
      )}
    >
      {props.children}
    </h3>
  );
};

const CardDescription: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <p
      class={css(
        {
          fontSize: 'sm',
        },
        props.className
      )}
    >
      {props.children}
    </p>
  );
};

// Placeholder Pointer component
const Pointer: Component<{
  className?: string;
  children?: JSX.Element;
}> = (props) => {
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef) {
        const rect = containerRef.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    if (containerRef) {
      containerRef.addEventListener('mousemove', handleMouseMove);
      containerRef.addEventListener('mouseenter', handleMouseEnter);
      containerRef.addEventListener('mouseleave', handleMouseLeave);
    }

    onCleanup(() => {
      if (containerRef) {
        containerRef.removeEventListener('mousemove', handleMouseMove);
        containerRef.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    });
  });

  return (
    <div
      ref={containerRef}
      class={css({
        position: 'absolute',
        inset: '0',
        cursor: 'none',
      })}
    >
      {isVisible() && (
        <div
          class={css({
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '50',
            transform: 'translate(-50%, -50%)',
          })}
          style={{
            left: `${mousePosition().x}px`,
            top: `${mousePosition().y}px`,
          }}
        >
          {props.children || (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class={css(
                {
                  fill: 'black',
                  _dark: {
                    fill: 'white',
                  },
                },
                props.className
              )}
            >
              <path d="M3 3L17 17M3 17L17 3" stroke="currentColor" stroke-width="2" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

// Animated Heart component
const AnimatedHeart: Component = () => {
  return (
    <div
      class={css({
        animation: 'heartbeat 1.5s ease-in-out infinite',
      })}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class={css({
          color: 'pink.600',
        })}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="currentColor"
        />
      </svg>
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export const PointerDemo: Component = () => {
  return (
    <div
      class={css({
        display: 'grid',
        gridTemplateColumns: '1',
        gap: '6',
        md: {
          gridTemplateColumns: '2',
          gridTemplateRows: '2',
        },
      })}
    >
      <Card
        className={css({
          gridColumn: '1',
          gridRow: '1',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'gray.200',
          background: 'linear-gradient(to bottom right, slate.50, slate.100)',
          transition: 'all 0.3s',
          boxShadow: 'none',
          _dark: {
            background: 'linear-gradient(to bottom right, slate.900, slate.800)',
            borderColor: 'gray.700',
          },
        })}
      >
        <CardHeader
          className={css({
            position: 'relative',
            paddingBottom: '2',
            padding: '4',
          })}
        >
          <CardTitle
            className={css({
              fontSize: 'xl',
              fontWeight: 'bold',
              color: 'gray.900',
              _dark: {
                color: 'white',
              },
            })}
          >
            Animated Pointer
          </CardTitle>
          <CardDescription
            className={css({
              fontSize: 'sm',
              color: 'slate.600',
              _dark: {
                color: 'slate.400',
              },
            })}
          >
            Animated pointer
          </CardDescription>
        </CardHeader>
        <CardContent
          className={css({
            position: 'relative',
            display: 'flex',
            height: '40',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6',
          })}
        >
          <span
            class={css({
              pointerEvents: 'none',
              textAlign: 'center',
              fontSize: 'xl',
              fontWeight: 'medium',
              color: 'slate.800',
              _dark: {
                color: 'slate.200',
              },
            })}
          >
            Move your cursor here
          </span>
        </CardContent>
        <Pointer>
          <AnimatedHeart />
        </Pointer>
      </Card>

      <Card
        className={css({
          gridColumn: '1',
          gridRow: '1',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'gray.200',
          background: 'linear-gradient(to bottom right, blue.50, blue.100)',
          transition: 'all 0.3s',
          boxShadow: 'none',
          _dark: {
            background: 'linear-gradient(to bottom right, blue.900, blue.800)',
            borderColor: 'gray.700',
          },
        })}
      >
        <CardHeader
          className={css({
            position: 'relative',
            paddingBottom: '2',
            padding: '4',
          })}
        >
          <CardTitle
            className={css({
              fontSize: 'xl',
              fontWeight: 'bold',
              color: 'gray.900',
              _dark: {
                color: 'white',
              },
            })}
          >
            Colored Pointer
          </CardTitle>
          <CardDescription
            className={css({
              fontSize: 'sm',
              color: 'blue.700',
              _dark: {
                color: 'blue.300',
              },
            })}
          >
            A custom pointer with different color
          </CardDescription>
        </CardHeader>
        <CardContent
          className={css({
            position: 'relative',
            display: 'flex',
            height: '40',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6',
          })}
        >
          <span
            class={css({
              pointerEvents: 'none',
              textAlign: 'center',
              fontSize: 'xl',
              fontWeight: 'medium',
              color: 'blue.800',
              _dark: {
                color: 'blue.200',
              },
            })}
          >
            Try me out
          </span>
        </CardContent>
        <Pointer className={css({ fill: 'blue.500' })} />
      </Card>

      <Card
        className={css({
          gridColumn: '1',
          gridRow: '1',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'gray.200',
          background: 'linear-gradient(to bottom right, purple.50, purple.100)',
          transition: 'all 0.3s',
          boxShadow: 'none',
          _dark: {
            background: 'linear-gradient(to bottom right, purple.900, purple.800)',
            borderColor: 'gray.700',
          },
        })}
      >
        <CardHeader
          className={css({
            position: 'relative',
            paddingBottom: '2',
            padding: '4',
          })}
        >
          <CardTitle
            className={css({
              fontSize: 'xl',
              fontWeight: 'bold',
              color: 'gray.900',
              _dark: {
                color: 'white',
              },
            })}
          >
            Custom Shape
          </CardTitle>
          <CardDescription
            className={css({
              fontSize: 'sm',
              color: 'purple.700',
              _dark: {
                color: 'purple.300',
              },
            })}
          >
            A pointer with a custom SVG shape
          </CardDescription>
        </CardHeader>
        <CardContent
          className={css({
            position: 'relative',
            display: 'flex',
            height: '40',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6',
          })}
        >
          <span
            class={css({
              pointerEvents: 'none',
              textAlign: 'center',
              fontSize: 'xl',
              fontWeight: 'medium',
              color: 'purple.800',
              _dark: {
                color: 'purple.200',
              },
            })}
          >
            Hover here
          </span>
        </CardContent>
        <Pointer>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" class={css({ fill: 'purple.500' })} />
            <circle cx="12" cy="12" r="5" class={css({ fill: 'white' })} />
          </svg>
        </Pointer>
      </Card>

      <Card
        className={css({
          gridColumn: '1',
          gridRow: '1',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'gray.200',
          background: 'linear-gradient(to bottom right, green.50, green.100)',
          transition: 'all 0.3s',
          boxShadow: 'none',
          _dark: {
            background: 'linear-gradient(to bottom right, green.900, green.800)',
            borderColor: 'gray.700',
          },
        })}
      >
        <CardHeader
          className={css({
            position: 'relative',
            paddingBottom: '2',
            padding: '4',
          })}
        >
          <CardTitle
            className={css({
              fontSize: 'xl',
              fontWeight: 'bold',
              color: 'gray.900',
              _dark: {
                color: 'white',
              },
            })}
          >
            Emoji Pointer
          </CardTitle>
          <CardDescription
            className={css({
              fontSize: 'sm',
              color: 'green.700',
              _dark: {
                color: 'green.300',
              },
            })}
          >
            Using an emoji as a custom pointer
          </CardDescription>
        </CardHeader>
        <CardContent
          className={css({
            position: 'relative',
            display: 'flex',
            height: '40',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6',
          })}
        >
          <span
            class={css({
              pointerEvents: 'none',
              textAlign: 'center',
              fontSize: 'xl',
              fontWeight: 'medium',
              color: 'green.800',
              _dark: {
                color: 'green.200',
              },
            })}
          >
            Check this out
          </span>
        </CardContent>
        <Pointer>
          <div class={css({ fontSize: '2xl' })}>👆</div>
        </Pointer>
      </Card>
    </div>
  );
};

export default PointerDemo;
