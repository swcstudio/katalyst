import { css } from '@sse/ui/styled-system/css';
import { type Component, createEffect, createSignal, For, onCleanup } from 'solid-js';

// Placeholder Globe component
const Globe: Component<{ className?: string }> = (props) => {
  let canvasRef: HTMLCanvasElement | undefined;
  let animationId: number;

  createEffect(() => {
    if (!canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw globe background
      const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 200);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(30, 58, 138, 0.4)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(300, 300, 200, 0, Math.PI * 2);
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + rotation;
        ctx.beginPath();
        ctx.moveTo(300 + Math.cos(angle) * 100, 300 + Math.sin(angle) * 100);
        ctx.lineTo(300 + Math.cos(angle) * 200, 300 + Math.sin(angle) * 200);
        ctx.stroke();
      }

      // Draw markers
      const markers = [
        { x: 300 + Math.cos(rotation) * 150, y: 300 + Math.sin(rotation) * 150 },
        { x: 300 + Math.cos(rotation + 1) * 120, y: 300 + Math.sin(rotation + 1) * 120 },
      ];

      ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
      markers.forEach((marker) => {
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      rotation += 0.01;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    onCleanup(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  });

  return (
    <canvas
      ref={canvasRef}
      class={css(
        {
          width: '600px',
          height: '600px',
          maxWidth: '100%',
          aspectRatio: '1',
        },
        props.className
      )}
    />
  );
};

// Feature Card Components
const FeatureCard: Component<{
  children: JSX.Element;
  className?: string;
}> = (props) => {
  return (
    <div
      class={css(
        {
          padding: '4',
          position: 'relative',
          overflow: 'hidden',
          sm: {
            padding: '8',
          },
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const FeatureTitle: Component<{ children: JSX.Element }> = (props) => {
  return (
    <p
      class={css({
        maxWidth: '5xl',
        marginX: 'auto',
        textAlign: 'left',
        letterSpacing: 'tight',
        color: 'black',
        fontSize: 'xl',
        _dark: {
          color: 'white',
        },
        md: {
          fontSize: '2xl',
          lineHeight: 'snug',
        },
      })}
    >
      {props.children}
    </p>
  );
};

const FeatureDescription: Component<{ children: JSX.Element }> = (props) => {
  return (
    <p
      class={css({
        fontSize: 'sm',
        color: 'neutral.500',
        fontWeight: 'normal',
        _dark: {
          color: 'neutral.300',
        },
        textAlign: 'left',
        maxWidth: 'sm',
        marginX: '0',
        marginY: '2',
        md: {
          fontSize: 'sm',
        },
      })}
    >
      {props.children}
    </p>
  );
};

// Skeleton Components
export const SkeletonOne: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        paddingY: '8',
        paddingX: '2',
        gap: '10',
        height: 'full',
      })}
    >
      <div
        class={css({
          width: 'full',
          padding: '5',
          marginX: 'auto',
          backgroundColor: 'white',
          boxShadow: '2xl',
          height: 'full',
          _dark: {
            backgroundColor: 'neutral.900',
          },
          _groupHover: {},
        })}
      >
        <div
          class={css({
            display: 'flex',
            flex: '1',
            width: 'full',
            height: 'full',
            flexDirection: 'column',
            gap: '2',
          })}
        >
          <img
            src="/linear.webp"
            alt="header"
            width="800"
            height="800"
            class={css({
              height: 'full',
              width: 'full',
              aspectRatio: 'square',
              objectFit: 'cover',
              objectPosition: 'left top',
              borderRadius: 'sm',
            })}
          />
        </div>
      </div>

      <div
        class={css({
          position: 'absolute',
          bottom: '0',
          zIndex: '40',
          insetX: '0',
          height: '60',
          background: 'linear-gradient(to top, white, white, transparent)',
          width: 'full',
          pointerEvents: 'none',
          _dark: {
            background: 'linear-gradient(to top, black, black, transparent)',
          },
        })}
      />
      <div
        class={css({
          position: 'absolute',
          top: '0',
          zIndex: '40',
          insetX: '0',
          height: '60',
          background: 'linear-gradient(to bottom, white, transparent, transparent)',
          width: 'full',
          pointerEvents: 'none',
          _dark: {
            background: 'linear-gradient(to bottom, black, transparent, transparent)',
          },
        })}
      />
    </div>
  );
};

export const SkeletonThree: Component = () => {
  return (
    <a
      href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
      target="_blank"
      class={css({
        position: 'relative',
        display: 'flex',
        gap: '10',
        height: 'full',
        _groupHover: {},
      })}
      rel="noreferrer"
    >
      <div
        class={css({
          width: 'full',
          marginX: 'auto',
          backgroundColor: 'transparent',
          height: 'full',
          _dark: {
            backgroundColor: 'transparent',
          },
        })}
      >
        <div
          class={css({
            display: 'flex',
            flex: '1',
            width: 'full',
            height: 'full',
            flexDirection: 'column',
            gap: '2',
            position: 'relative',
          })}
        >
          {/* YouTube Icon */}
          <div
            class={css({
              position: 'absolute',
              zIndex: '10',
              inset: '0',
              margin: 'auto',
              height: '20',
              width: '20',
              color: 'red.500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4xl',
            })}
          >
            ▶
          </div>
          <img
            src="https://assets.aceternity.com/fireship.jpg"
            alt="header"
            width="800"
            height="800"
            class={css({
              height: 'full',
              width: 'full',
              aspectRatio: 'square',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: 'sm',
              filter: 'blur(0px)',
              transition: 'all 0.2s',
              _groupHover: {
                filter: 'blur(4px)',
              },
            })}
          />
        </div>
      </div>
    </a>
  );
};

export const SkeletonTwo: Component = () => {
  const images = [
    'https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        padding: '8',
        gap: '10',
        height: 'full',
        overflow: 'hidden',
      })}
    >
      <div
        class={css({
          display: 'flex',
          flexDirection: 'row',
          marginLeft: '-20',
        })}
      >
        <For each={images}>
          {(image, idx) => (
            <div
              class={css({
                borderRadius: 'xl',
                marginRight: '-4',
                marginTop: '4',
                padding: '1',
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: 'neutral.100',
                flexShrink: '0',
                overflow: 'hidden',
                transition: 'all 0.2s',
                _hover: {
                  transform: 'scale(1.1)',
                  rotate: '0deg',
                  zIndex: '100',
                },
                _dark: {
                  backgroundColor: 'neutral.800',
                  borderColor: 'neutral.700',
                },
              })}
              style={{
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
              }}
            >
              <img
                src={image}
                alt="bali images"
                width="500"
                height="500"
                class={css({
                  borderRadius: 'lg',
                  height: '20',
                  width: '20',
                  objectFit: 'cover',
                  flexShrink: '0',
                  md: {
                    height: '40',
                    width: '40',
                  },
                })}
              />
            </div>
          )}
        </For>
      </div>
      <div
        class={css({
          display: 'flex',
          flexDirection: 'row',
        })}
      >
        <For each={images}>
          {(image, idx) => (
            <div
              class={css({
                borderRadius: 'xl',
                marginRight: '-4',
                marginTop: '4',
                padding: '1',
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: 'neutral.100',
                flexShrink: '0',
                overflow: 'hidden',
                transition: 'all 0.2s',
                _hover: {
                  transform: 'scale(1.1)',
                  rotate: '0deg',
                  zIndex: '100',
                },
                _dark: {
                  backgroundColor: 'neutral.800',
                  borderColor: 'neutral.700',
                },
              })}
              style={{
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
              }}
            >
              <img
                src={image}
                alt="bali images"
                width="500"
                height="500"
                class={css({
                  borderRadius: 'lg',
                  height: '20',
                  width: '20',
                  objectFit: 'cover',
                  flexShrink: '0',
                  md: {
                    height: '40',
                    width: '40',
                  },
                })}
              />
            </div>
          )}
        </For>
      </div>

      <div
        class={css({
          position: 'absolute',
          left: '0',
          zIndex: '100',
          insetY: '0',
          width: '20',
          background: 'linear-gradient(to right, white, transparent)',
          height: 'full',
          pointerEvents: 'none',
          _dark: {
            background: 'linear-gradient(to right, black, transparent)',
          },
        })}
      />
      <div
        class={css({
          position: 'absolute',
          right: '0',
          zIndex: '100',
          insetY: '0',
          width: '20',
          background: 'linear-gradient(to left, white, transparent)',
          height: 'full',
          pointerEvents: 'none',
          _dark: {
            background: 'linear-gradient(to left, black, transparent)',
          },
        })}
      />
    </div>
  );
};

export const SkeletonFour: Component = () => {
  return (
    <div
      class={css({
        height: '60',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'transparent',
        marginTop: '10',
        _dark: {
          backgroundColor: 'transparent',
        },
        md: {
          height: '60',
        },
      })}
    >
      <Globe
        className={css({
          position: 'absolute',
          right: '-10',
          bottom: '-80',
          md: {
            right: '-10',
            bottom: '-72',
          },
        })}
      />
    </div>
  );
};

export const FeaturesSectionDemo: Component = () => {
  const features = [
    {
      title: 'Track issues effectively',
      description: 'Track and manage your project issues with ease using our intuitive interface.',
      skeleton: <SkeletonOne />,
      className: css({
        gridColumn: '1',
        borderBottom: '1px solid',
        borderColor: 'neutral.800',
        lg: {
          gridColumn: 'span 4',
          borderRight: '1px solid',
          borderColor: 'neutral.800',
        },
        _dark: {
          borderColor: 'neutral.800',
        },
      }),
    },
    {
      title: 'Capture pictures with AI',
      description: 'Capture stunning photos effortlessly using our advanced AI technology.',
      skeleton: <SkeletonTwo />,
      className: css({
        borderBottom: '1px solid',
        gridColumn: '1',
        borderColor: 'neutral.800',
        lg: {
          gridColumn: 'span 2',
        },
        _dark: {
          borderColor: 'neutral.800',
        },
      }),
    },
    {
      title: 'Watch our AI on YouTube',
      description:
        'Whether its you or Tyler Durden, you can get to know about our product on YouTube',
      skeleton: <SkeletonThree />,
      className: css({
        gridColumn: '1',
        borderColor: 'neutral.800',
        lg: {
          gridColumn: 'span 3',
          borderRight: '1px solid',
          borderColor: 'neutral.800',
        },
        _dark: {
          borderColor: 'neutral.800',
        },
      }),
    },
    {
      title: 'Deploy in seconds',
      description:
        'With our blazing fast, state of the art, cutting edge, we are so back cloud servies (read AWS) - you can deploy your model in seconds.',
      skeleton: <SkeletonFour />,
      className: css({
        gridColumn: '1',
        borderBottom: '1px solid',
        borderColor: 'neutral.800',
        lg: {
          gridColumn: 'span 3',
          borderBottom: 'none',
        },
        _dark: {
          borderColor: 'neutral.800',
        },
      }),
    },
  ];

  return (
    <div
      class={css({
        position: 'relative',
        zIndex: '20',
        paddingY: '10',
        maxWidth: '7xl',
        marginX: 'auto',
        lg: {
          paddingY: '40',
        },
      })}
    >
      <div
        class={css({
          paddingX: '8',
        })}
      >
        <h4
          class={css({
            fontSize: '3xl',
            maxWidth: '5xl',
            marginX: 'auto',
            textAlign: 'center',
            letterSpacing: 'tight',
            fontWeight: 'medium',
            color: 'black',
            _dark: {
              color: 'white',
            },
            lg: {
              fontSize: '5xl',
              lineHeight: 'tight',
            },
          })}
        >
          Packed with thousands of features
        </h4>

        <p
          class={css({
            fontSize: 'sm',
            maxWidth: '2xl',
            marginY: '4',
            marginX: 'auto',
            color: 'neutral.500',
            textAlign: 'center',
            fontWeight: 'normal',
            _dark: {
              color: 'neutral.300',
            },
            lg: {
              fontSize: 'base',
            },
          })}
        >
          From Image generation to video generation, Everything AI has APIs for literally
          everything. It can even create this website copy for you.
        </p>
      </div>

      <div
        class={css({
          position: 'relative',
        })}
      >
        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: '1',
            marginTop: '12',
            border: '1px solid',
            borderColor: 'neutral.800',
            borderRadius: 'md',
            lg: {
              gridTemplateColumns: '6',
            },
            xl: {
              border: '1px solid',
              borderColor: 'neutral.800',
            },
            _dark: {
              borderColor: 'neutral.800',
            },
          })}
        >
          <For each={features}>
            {(feature) => (
              <FeatureCard className={feature.className}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <div class={css({ height: 'full', width: 'full' })}>{feature.skeleton}</div>
              </FeatureCard>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSectionDemo;
