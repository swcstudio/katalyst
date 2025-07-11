import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, For, onCleanup, onMount } from 'solid-js';

// Card wrapper component
export const Card: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <div
      class={css(
        {
          maxWidth: 'sm',
          width: 'full',
          marginX: 'auto',
          padding: '8',
          borderRadius: 'xl',
          border: '1px solid rgba(255,255,255,0.10)',
          backgroundColor: 'gray.100',
          boxShadow: '2px 4px 16px 0px rgba(248,248,248,0.06) inset',
          _dark: {
            backgroundColor: 'rgba(40,40,40,0.70)',
          },
          _groupHover: {},
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

export const CardTitle: Component<{
  children: JSX.Element;
  className?: string;
}> = (props) => {
  return (
    <h3
      class={css(
        {
          fontSize: 'lg',
          fontWeight: 'semibold',
          color: 'gray.800',
          paddingY: '2',
          _dark: {
            color: 'white',
          },
        },
        props.className
      )}
    >
      {props.children}
    </h3>
  );
};

export const CardDescription: Component<{
  children: JSX.Element;
  className?: string;
}> = (props) => {
  return (
    <p
      class={css(
        {
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'neutral.600',
          maxWidth: 'sm',
          _dark: {
            color: 'neutral.400',
          },
        },
        props.className
      )}
    >
      {props.children}
    </p>
  );
};

export const CardSkeletonContainer: Component<{
  className?: string;
  children: JSX.Element;
  showGradient?: boolean;
}> = (props) => {
  return (
    <div
      class={css(
        {
          height: '15rem',
          borderRadius: 'xl',
          zIndex: '40',
          ...(props.showGradient !== false && {
            backgroundColor: 'neutral.300',
            maskImage: 'radial-gradient(50% 50% at 50% 50%, white 0%, transparent 100%)',
            _dark: {
              backgroundColor: 'rgba(40,40,40,0.70)',
            },
          }),
          md: {
            height: '20rem',
          },
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

// Container for animated icons
const Container: Component<{
  className?: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <div
      class={css(
        {
          height: '16',
          width: '16',
          borderRadius: 'full',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(248,248,248,0.01)',
          boxShadow:
            '0px 0px 8px 0px rgba(248,248,248,0.25) inset, 0px 32px 24px -16px rgba(0,0,0,0.40)',
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

// Sparkles animation component
const Sparkles: Component = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();

  return (
    <div class={css({ position: 'absolute', inset: '0' })}>
      <For each={Array.from({ length: 12 }, (_, i) => i)}>
        {(i) => (
          <span
            class={css({
              position: 'absolute',
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              zIndex: '1',
              backgroundColor: 'black',
              animation: `sparkle-${i} ${random() * 2 + 4}s linear infinite`,
              _dark: {
                backgroundColor: 'white',
              },
            })}
            style={{
              top: `${random() * 100}%`,
              left: `${random() * 100}%`,
            }}
          />
        )}
      </For>
      <style>{`
        ${Array.from(
          { length: 12 },
          (_, i) => `
          @keyframes sparkle-${i} {
            0% {
              opacity: ${randomOpacity()};
              transform: scale(1) translate(${randomMove()}px, ${randomMove()}px);
            }
            50% {
              opacity: ${randomOpacity()};
              transform: scale(1.2) translate(${randomMove()}px, ${randomMove()}px);
            }
            100% {
              opacity: 0;
              transform: scale(0) translate(${randomMove()}px, ${randomMove()}px);
            }
          }
        `
        ).join('')}
      `}</style>
    </div>
  );
};

// Icon components
const ClaudeLogo: Component<{ className?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
      image-rendering="optimizeQuality"
      fill-rule="evenodd"
      clip-rule="evenodd"
      viewBox="0 0 512 512"
      class={props.className}
    >
      <rect fill="#CC9B7A" width="512" height="512" rx="104.187" ry="105.042" />
      <path
        fill="#1F1F1E"
        fill-rule="nonzero"
        d="M318.663 149.787h-43.368l78.952 212.423 43.368.004-78.952-212.427zm-125.326 0l-78.952 212.427h44.255l15.932-44.608 82.846-.004 16.107 44.612h44.255l-79.126-212.427h-45.317zm-4.251 128.341l26.91-74.701 27.083 74.701h-53.993z"
      />
    </svg>
  );
};

const OpenAILogo: Component<{ className?: string }> = (props) => {
  return (
    <svg
      class={props.className}
      width="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.153 11.46a6.888 6.888 0 0 0-.608-5.73 7.117 7.117 0 0 0-3.29-2.93 7.238 7.238 0 0 0-4.41-.454 7.065 7.065 0 0 0-2.41-1.742A7.15 7.15 0 0 0 12.514 0a7.216 7.216 0 0 0-4.217 1.346 7.061 7.061 0 0 0-2.603 3.539 7.12 7.12 0 0 0-2.734 1.188A7.012 7.012 0 0 0 .966 8.268a6.979 6.979 0 0 0 .88 8.273 6.89 6.89 0 0 0 .607 5.729 7.117 7.117 0 0 0 3.29 2.93 7.238 7.238 0 0 0 4.41.454 7.061 7.061 0 0 0 2.409 1.742c.92.404 1.916.61 2.923.604a7.215 7.215 0 0 0 4.22-1.345 7.06 7.06 0 0 0 2.605-3.543 7.116 7.116 0 0 0 2.734-1.187 7.01 7.01 0 0 0 1.993-2.196 6.978 6.978 0 0 0-.884-8.27Z"
        fill="currentColor"
      />
    </svg>
  );
};

const GeminiLogo: Component<{ className?: string }> = (props) => {
  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class={props.className}>
      <path
        d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"
        fill="url(#prefix__paint0_radial_980_20147)"
      />
      <defs>
        <radialGradient
          id="prefix__paint0_radial_980_20147"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"
        >
          <stop offset=".067" stop-color="#9168C0" />
          <stop offset=".343" stop-color="#5684D1" />
          <stop offset=".672" stop-color="#1BA1E3" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const MetaIconOutline: Component<{ className?: string }> = (props) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 287.56 191"
      class={props.className}
    >
      <path
        fill="#0081fb"
        d="M31.06,126c0,11,2.41,19.41,5.56,24.51A19,19,0,0,0,53.19,160c8.1,0,15.51-2,29.79-21.76,11.44-15.83,24.92-38,34-52l15.36-23.6c10.67-16.39,23-34.61,37.18-47C181.07,5.6,193.54,0,206.09,0c21.07,0,41.14,12.21,56.5,35.11,16.81,25.08,25,56.67,25,89.27,0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191V160c17.63,0,22-16.2,22-34.74,0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13l-9.06,16c-18.2,32.27-22.81,39.62-31.91,51.75C84.74,183,71.12,191,53.19,191c-21.27,0-34.72-9.21-43-23.09C3.34,156.6,0,141.76,0,124.85Z"
      />
    </svg>
  );
};

const CopilotIcon: Component<{ className?: string }> = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class={props.className}>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
      <path d="M12 6c-3.309 0-6 2.691-6 6 0 1.657.673 3.157 1.757 4.243l1.415-1.415C8.636 14.293 8.172 13.207 8.172 12c0-2.136 1.736-3.862 3.862-3.862S15.896 9.864 15.896 12c0 1.207-.464 2.293-1 2.828l1.415 1.415C17.327 15.157 18 13.657 18 12c0-3.309-2.691-6-6-6z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
};

// Skeleton component with animated icons
const Skeleton: Component = () => {
  let animationId: number;

  onMount(() => {
    const elements = document.querySelectorAll(
      '.circle-1, .circle-2, .circle-3, .circle-4, .circle-5'
    );
    const scale = [1, 1.1, 1];
    const transform = ['translateY(0px)', 'translateY(-4px)', 'translateY(0px)'];

    let index = 0;
    const animate = () => {
      elements.forEach((el, i) => {
        if (index === i) {
          (el as HTMLElement).style.transform = transform[1];
          (el as HTMLElement).style.scale = scale[1].toString();
          setTimeout(() => {
            (el as HTMLElement).style.transform = transform[2];
            (el as HTMLElement).style.scale = scale[2].toString();
          }, 400);
        }
      });
      index = (index + 1) % elements.length;
    };

    const interval = setInterval(animate, 800);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div
      class={css({
        padding: '8',
        overflow: 'hidden',
        height: 'full',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div
        class={css({
          display: 'flex',
          flexDirection: 'row',
          flexShrink: '0',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2',
        })}
      >
        <Container className="h-8 w-8 circle-1">
          <ClaudeLogo className={css({ height: '4', width: '4' })} />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <CopilotIcon
            className={css({ height: '6', width: '6', color: 'white', _dark: { color: 'white' } })}
          />
        </Container>
        <Container className="circle-3">
          <OpenAILogo
            className={css({ height: '8', width: '8', color: 'white', _dark: { color: 'white' } })}
          />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <MetaIconOutline className={css({ height: '6', width: '6' })} />
        </Container>
        <Container className="h-8 w-8 circle-5">
          <GeminiLogo className={css({ height: '4', width: '4' })} />
        </Container>
      </div>

      <div
        class={css({
          height: '40',
          width: 'px',
          position: 'absolute',
          top: '20',
          margin: 'auto',
          zIndex: '40',
          background: 'linear-gradient(to bottom, transparent, cyan.500, transparent)',
          animation: 'move 2s ease-in-out infinite alternate',
        })}
      >
        <div
          class={css({
            width: '10',
            height: '32',
            top: '1/2',
            transform: 'translateY(-50%)',
            position: 'absolute',
            left: '-10',
          })}
        >
          <Sparkles />
        </div>
      </div>

      <style>{`
        @keyframes move {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
};

// Main Card Demo component
export const CardDemo: Component = () => {
  return (
    <Card>
      <CardSkeletonContainer>
        <Skeleton />
      </CardSkeletonContainer>
      <CardTitle>Damn good card</CardTitle>
      <CardDescription>
        A card that showcases a set of tools that you use to create your product.
      </CardDescription>
    </Card>
  );
};

// Background Overlay Card Demo
export const BackgroundOverlayCardDemo: Component = () => {
  return (
    <div class={css({ maxWidth: 'xs', width: 'full' })}>
      <div
        class={css({
          width: 'full',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          height: '96',
          borderRadius: 'md',
          boxShadow: 'xl',
          marginX: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'end',
          padding: '4',
          border: '1px solid transparent',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80)',
          backgroundSize: 'cover',
          transition: 'all 0.5s',
          _hover: {
            backgroundImage:
              'url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)',
            _after: {
              content: '""',
              position: 'absolute',
              inset: '0',
              backgroundColor: 'black',
              opacity: '50',
            },
          },
          _dark: {
            borderColor: 'neutral.800',
          },
        })}
      >
        <div class={css({ position: 'relative', zIndex: '50' })}>
          <h1
            class={css({
              fontWeight: 'bold',
              fontSize: 'xl',
              color: 'gray.50',
              position: 'relative',
              md: {
                fontSize: '3xl',
              },
            })}
          >
            Background Overlays
          </h1>
          <p
            class={css({
              fontWeight: 'normal',
              fontSize: 'base',
              color: 'gray.50',
              position: 'relative',
              marginY: '4',
            })}
          >
            This card is for some special elements, like displaying background gifs on hover only.
          </p>
        </div>
      </div>
    </div>
  );
};

// Author Card Demo
export const AuthorCardDemo: Component = () => {
  return (
    <div class={css({ maxWidth: 'xs', width: 'full' })}>
      <div
        class={css({
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          height: '96',
          borderRadius: 'md',
          boxShadow: 'xl',
          maxWidth: 'sm',
          marginX: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '4',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80)',
          backgroundSize: 'cover',
        })}
      >
        <div
          class={css({
            position: 'absolute',
            width: 'full',
            height: 'full',
            top: '0',
            left: '0',
            transition: 'all 0.3s',
            backgroundColor: 'black',
            opacity: '60',
            _groupHover: {
              backgroundColor: 'black',
            },
          })}
        />
        <div
          class={css({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '4',
            zIndex: '10',
          })}
        >
          <img
            height="100"
            width="100"
            alt="Avatar"
            src="/manu.png"
            class={css({
              height: '10',
              width: '10',
              borderRadius: 'full',
              border: '2px solid',
              objectFit: 'cover',
            })}
          />
          <div
            class={css({
              display: 'flex',
              flexDirection: 'column',
            })}
          >
            <p
              class={css({
                fontWeight: 'normal',
                fontSize: 'base',
                color: 'gray.50',
                position: 'relative',
                zIndex: '10',
              })}
            >
              Manu Arora
            </p>
            <p
              class={css({
                fontSize: 'sm',
                color: 'gray.400',
              })}
            >
              2 min read
            </p>
          </div>
        </div>
        <div class={css({ zIndex: '10' })}>
          <h1
            class={css({
              fontWeight: 'bold',
              fontSize: 'xl',
              color: 'gray.50',
              position: 'relative',
              zIndex: '10',
              md: {
                fontSize: '2xl',
              },
            })}
          >
            Author Card
          </h1>
          <p
            class={css({
              fontWeight: 'normal',
              fontSize: 'sm',
              color: 'gray.50',
              position: 'relative',
              zIndex: '10',
              marginY: '4',
            })}
          >
            Card with Author avatar, complete name and time to read - most suitable for blogs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardDemo;
