import { Component, JSX, createSignal, onMount, onCleanup, For } from 'solid-js';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { animate } from 'motion';
import createGlobe from 'cobe';

export interface FeatureData {
  title: string;
  description: string;
  skeleton: JSX.Element;
  className: string;
}

export interface FeatureCardProps {
  children?: JSX.Element;
  className?: string;
}

export interface FeatureTitleProps {
  children?: JSX.Element;
}

export interface FeatureDescriptionProps {
  children?: JSX.Element;
}

export const FeaturesSectionWithGlobeDemo: Component = () => {
  const features: FeatureData[] = [
    {
      title: "Track issues effectively",
      description:
        "Track and manage your project issues with ease using our intuitive interface.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Capture pictures with AI",
      description:
        "Capture stunning photos effortlessly using our advanced AI technology.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Watch our AI on YouTube",
      description:
        "Whether its you or Tyler Durden, you can get to know about our product on YouTube",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
    },
    {
      title: "Deploy in seconds",
      description:
        "With our blazing fast, state of the art, cutting edge, we are so back cloud services (read AWS) - you can deploy your model in seconds.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <div class={css({
      position: 'relative',
      zIndex: 20,
      paddingY: '40px',
      maxWidth: '1280px',
      marginX: 'auto',
      lg: { paddingY: '160px' }
    })}>
      <div class={css({ paddingX: '32px' })}>
        <h4 class={css({
          fontSize: '3xl',
          lineHeight: 'tight',
          maxWidth: '1024px',
          marginX: 'auto',
          textAlign: 'center',
          letterSpacing: 'tight',
          fontWeight: '500',
          color: 'black',
          lg: { fontSize: '5xl', lineHeight: 'tight' },
          _dark: { color: 'white' }
        })}>
          Packed with thousands of features
        </h4>

        <p class={css({
          fontSize: 'sm',
          maxWidth: '512px',
          marginY: '16px',
          marginX: 'auto',
          color: 'neutral.500',
          textAlign: 'center',
          fontWeight: 'normal',
          lg: { fontSize: 'base' },
          _dark: { color: 'neutral.300' }
        })}>
          From Image generation to video generation, Everything AI has APIs for
          literally everything. It can even create this website copy for you.
        </p>
      </div>

      <div class={css({ position: 'relative' })}>
        <div class={css({
          display: 'grid',
          gridTemplateColumns: '1fr',
          marginTop: '48px',
          borderRadius: '6px',
          lg: { 
            gridTemplateColumns: 'repeat(6, 1fr)',
            border: '1px solid',
            borderColor: 'neutral.200'
          },
          xl: { border: '1px solid' },
          _dark: { borderColor: 'neutral.800' }
        })}>
          <For each={features}>
            {(feature) => (
              <FeatureCard className={feature.className}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <div class={css({ height: '100%', width: '100%' })}>
                  {feature.skeleton}
                </div>
              </FeatureCard>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: Component<FeatureCardProps> = (props) => {
  return (
    <div class={cx(
      css({
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        sm: { padding: '32px' }
      }),
      props.className
    )}>
      {props.children}
    </div>
  );
};

const FeatureTitle: Component<FeatureTitleProps> = (props) => {
  return (
    <p class={css({
      maxWidth: '1024px',
      marginX: 'auto',
      textAlign: 'left',
      letterSpacing: 'tight',
      color: 'black',
      fontSize: 'xl',
      md: { fontSize: '2xl', lineHeight: 'snug' },
      _dark: { color: 'white' }
    })}>
      {props.children}
    </p>
  );
};

const FeatureDescription: Component<FeatureDescriptionProps> = (props) => {
  return (
    <p class={css({
      fontSize: 'sm',
      maxWidth: '256px',
      textAlign: 'left',
      marginX: 0,
      color: 'neutral.500',
      fontWeight: 'normal',
      marginY: '8px',
      md: { fontSize: 'sm' },
      _dark: { color: 'neutral.300' }
    })}>
      {props.children}
    </p>
  );
};

export const SkeletonOne: Component = () => {
  return (
    <div class={css({
      position: 'relative',
      display: 'flex',
      paddingY: '32px',
      paddingX: '8px',
      gap: '40px',
      height: '100%'
    })}>
      <div class={css({
        width: '100%',
        padding: '20px',
        marginX: 'auto',
        backgroundColor: 'white',
        boxShadow: '2xl',
        height: '100%',
        _dark: { backgroundColor: 'neutral.900' }
      })}>
        <div class={css({
          display: 'flex',
          flex: 1,
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          gap: '8px'
        })}>
          <img
            src="/linear.webp"
            alt="header"
            width={800}
            height={800}
            class={css({
              height: '100%',
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
              objectPosition: 'left top',
              borderRadius: 'sm'
            })}
          />
        </div>
      </div>

      <div class={css({
        position: 'absolute',
        bottom: 0,
        zIndex: 40,
        insetX: 0,
        height: '240px',
        background: 'linear-gradient(to top, white, white, transparent)',
        width: '100%',
        pointerEvents: 'none',
        _dark: {
          background: 'linear-gradient(to top, black, black, transparent)'
        }
      })} />
      <div class={css({
        position: 'absolute',
        top: 0,
        zIndex: 40,
        insetX: 0,
        height: '240px',
        background: 'linear-gradient(to bottom, white, transparent, transparent)',
        width: '100%',
        pointerEvents: 'none',
        _dark: {
          background: 'linear-gradient(to bottom, black, transparent, transparent)'
        }
      })} />
    </div>
  );
};

export const SkeletonTwo: Component = () => {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  onMount(() => {
    images.forEach((_, idx) => {
      const element = document.querySelector(`.image-${idx}`);
      if (element) {
        animate(
          element,
          {
            scale: [1, 1.1, 1],
            rotate: [Math.random() * 20 - 10, 0, Math.random() * 20 - 10],
          },
          {
            duration: 3,
            repeat: Infinity,
            delay: idx * 0.2,
            easing: "ease-in-out"
          }
        );
      }
    });
  });

  return (
    <div class={css({
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      padding: '32px',
      gap: '40px',
      height: '100%',
      overflow: 'hidden'
    })}>
      <div class={css({
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '-80px'
      })}>
        <For each={images}>
          {(image, idx) => (
            <div
              class={cx(
                `image-${idx()}`,
                css({
                  borderRadius: '12px',
                  marginRight: '-16px',
                  marginTop: '16px',
                  padding: '4px',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'neutral.100',
                  flexShrink: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  _dark: {
                    backgroundColor: 'neutral.800',
                    borderColor: 'neutral.700'
                  }
                })
              )}
              style={{ transform: `rotate(${Math.random() * 20 - 10}deg)` }}
            >
              <img
                src={image}
                alt="bali images"
                width="500"
                height="500"
                class={css({
                  borderRadius: '8px',
                  height: '80px',
                  width: '80px',
                  objectFit: 'cover',
                  flexShrink: 0,
                  md: { height: '160px', width: '160px' }
                })}
              />
            </div>
          )}
        </For>
      </div>
      <div class={css({ display: 'flex', flexDirection: 'row' })}>
        <For each={images}>
          {(image, idx) => (
            <div
              class={cx(
                `image-${idx() + 5}`,
                css({
                  borderRadius: '12px',
                  marginRight: '-16px',
                  marginTop: '16px',
                  padding: '4px',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'neutral.100',
                  flexShrink: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  _dark: {
                    backgroundColor: 'neutral.800',
                    borderColor: 'neutral.700'
                  }
                })
              )}
              style={{ transform: `rotate(${Math.random() * 20 - 10}deg)` }}
            >
              <img
                src={image}
                alt="bali images"
                width="500"
                height="500"
                class={css({
                  borderRadius: '8px',
                  height: '80px',
                  width: '80px',
                  objectFit: 'cover',
                  flexShrink: 0,
                  md: { height: '160px', width: '160px' }
                })}
              />
            </div>
          )}
        </For>
      </div>

      <div class={css({
        position: 'absolute',
        left: 0,
        zIndex: 100,
        insetY: 0,
        width: '80px',
        background: 'linear-gradient(to right, white, transparent)',
        height: '100%',
        pointerEvents: 'none',
        _dark: {
          background: 'linear-gradient(to right, black, transparent)'
        }
      })} />
      <div class={css({
        position: 'absolute',
        right: 0,
        zIndex: 100,
        insetY: 0,
        width: '80px',
        background: 'linear-gradient(to left, white, transparent)',
        height: '100%',
        pointerEvents: 'none',
        _dark: {
          background: 'linear-gradient(to left, black, transparent)'
        }
      })} />
    </div>
  );
};

export const SkeletonThree: Component = () => {
  const [isHovered, setIsHovered] = createSignal(false);

  return (
    <a
      href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
      target="_blank"
      class={css({
        position: 'relative',
        display: 'flex',
        gap: '40px',
        height: '100%',
        group: true
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div class={css({
        width: '100%',
        marginX: 'auto',
        backgroundColor: 'transparent',
        height: '100%',
        _dark: { backgroundColor: 'transparent' }
      })}>
        <div class={css({
          display: 'flex',
          flex: 1,
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          gap: '8px',
          position: 'relative'
        })}>
          <YouTubeIcon class={css({
            height: '80px',
            width: '80px',
            position: 'absolute',
            zIndex: 10,
            inset: 0,
            color: 'red.500',
            margin: 'auto'
          })} />
          <img
            src="https://assets.aceternity.com/fireship.jpg"
            alt="header"
            width={800}
            height={800}
            class={css({
              height: '100%',
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: 'sm',
              filter: isHovered() ? 'blur(4px)' : 'blur(0)',
              transition: 'all 0.2s'
            })}
          />
        </div>
      </div>
    </a>
  );
};

export const SkeletonFour: Component = () => {
  return (
    <div class={css({
      height: '240px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: 'transparent',
      marginTop: '40px',
      md: { height: '240px' },
      _dark: { backgroundColor: 'transparent' }
    })}>
      <Globe className={css({
        position: 'absolute',
        right: '-40px',
        bottom: '-320px',
        md: { right: '-40px', bottom: '-288px' }
      })} />
    </div>
  );
};

export const Globe: Component<{ className?: string }> = (props) => {
  let canvasRef: HTMLCanvasElement;

  onMount(() => {
    let phi = 0;

    if (!canvasRef) return;

    const globe = createGlobe(canvasRef, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    onCleanup(() => {
      globe.destroy();
    });
  });

  return (
    <canvas
      ref={canvasRef!}
      style={{ width: '600px', height: '600px', 'max-width': '100%', 'aspect-ratio': '1' }}
      class={props.className}
    />
  );
};

const YouTubeIcon: Component<{ class?: string }> = (props) => {
  return (
    <svg
      class={props.class}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.582 6.186c-.23-1.482-1.15-2.65-2.38-3.05C17.568 2.71 12 2.71 12 2.71s-5.568 0-7.202.426c-1.23.4-2.15 1.568-2.38 3.05C2 8.07 2 12 2 12s0 3.93.418 5.814c.23 1.482 1.15 2.65 2.38 3.05C6.432 21.29 12 21.29 12 21.29s5.568 0 7.202-.426c1.23-.4 2.15-1.568 2.38-3.05C22 15.93 22 12 22 12s0-3.93-.418-5.814zM10 15V9l5.196 3L10 15z" />
    </svg>
  );
};

export default FeaturesSectionWithGlobeDemo;