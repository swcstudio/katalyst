import { Component, JSX, onMount, onCleanup, createSignal, For } from 'solid-js';
import { animate } from 'motion';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';

export interface CardProps {
  className?: string;
  children: JSX.Element;
}

export interface CardTitleProps {
  children: JSX.Element;
  className?: string;
}

export interface CardDescriptionProps {
  children: JSX.Element;
  className?: string;
}

export interface CardSkeletonContainerProps {
  className?: string;
  children: JSX.Element;
  showGradient?: boolean;
}

export interface ContainerProps {
  className?: string;
  children: JSX.Element;
}

export interface LogoProps {
  className?: string;
}

export const CardDemo: Component = () => {
  return (
    <Card>
      <CardSkeletonContainer>
        <Skeleton />
      </CardSkeletonContainer>
      <CardTitle>Damn good card</CardTitle>
      <CardDescription>
        A card that showcases a set of tools that you use to create your
        product.
      </CardDescription>
    </Card>
  );
};

const Skeleton: Component = () => {
  onMount(() => {
    const sequence = [
      [
        ".circle-1",
        {
          scale: [1, 1.1, 1],
          y: [0, -4, 0],
        },
        { duration: 0.8 },
      ],
      [
        ".circle-2",
        {
          scale: [1, 1.1, 1],
          y: [0, -4, 0],
        },
        { duration: 0.8 },
      ],
      [
        ".circle-3",
        {
          scale: [1, 1.1, 1],
          y: [0, -4, 0],
        },
        { duration: 0.8 },
      ],
      [
        ".circle-4",
        {
          scale: [1, 1.1, 1],
          y: [0, -4, 0],
        },
        { duration: 0.8 },
      ],
      [
        ".circle-5",
        {
          scale: [1, 1.1, 1],
          y: [0, -4, 0],
        },
        { duration: 0.8 },
      ],
    ];

    const controls = animate(sequence, {
      repeat: Infinity,
      repeatDelay: 1,
    });

    onCleanup(() => {
      controls.stop();
    });
  });

  return (
    <div class={css({
      padding: '32px',
      overflow: 'hidden',
      height: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })}>
      <div class={css({
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
      })}>
        <Container className="h-8 w-8 circle-1">
          <ClaudeLogo className="h-4 w-4" />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <CopilotLogo className="h-6 w-6 dark:text-white" />
        </Container>
        <Container className="circle-3">
          <OpenAILogo className="h-8 w-8 dark:text-white" />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <MetaIconOutline className="h-6 w-6" />
        </Container>
        <Container className="h-8 w-8 circle-5">
          <GeminiLogo className="h-4 w-4" />
        </Container>
      </div>

      <div class={css({
        height: '160px',
        width: '1px',
        position: 'absolute',
        top: '80px',
        margin: 'auto',
        zIndex: 40,
        background: 'linear-gradient(to bottom, transparent, #06b6d4, transparent)',
        animation: 'move 4s linear infinite'
      })}>
        <div class={css({
          width: '40px',
          height: '128px',
          top: '50%',
          transform: 'translateY(-50%)',
          position: 'absolute',
          left: '-40px'
        })}>
          <Sparkles />
        </div>
      </div>

      <style>
        {`
          @keyframes move {
            0% { transform: translateY(-20px); }
            100% { transform: translateY(20px); }
          }
        `}
      </style>
    </div>
  );
};

const Sparkles: Component = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  
  const [sparkles] = createSignal(Array.from({ length: 12 }, (_, i) => i));

  onMount(() => {
    sparkles().forEach((i) => {
      const element = document.querySelector(`.star-${i}`);
      if (element) {
        animate(
          element,
          {
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: [randomOpacity(), randomOpacity(), 0],
            scale: [1, 1.2, 0],
          },
          {
            duration: random() * 2 + 4,
            repeat: Infinity,
            easing: "linear",
          }
        );
      }
    });
  });

  return (
    <div class={css({ position: 'absolute', inset: 0 })}>
      <For each={sparkles()}>
        {(i) => (
          <span
            class={cx(
              `star-${i}`,
              css({
                position: 'absolute',
                width: '2px',
                height: '2px',
                borderRadius: '50%',
                zIndex: 1,
                backgroundColor: 'black',
                _dark: { backgroundColor: 'white' }
              })
            )}
            style={{
              top: `${random() * 100}%`,
              left: `${random() * 100}%`
            }}
          />
        )}
      </For>
    </div>
  );
};

export const Card: Component<CardProps> = (props) => {
  return (
    <div
      class={cx(
        css({
          maxWidth: '384px',
          width: '100%',
          marginX: 'auto',
          padding: '32px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.10)',
          backgroundColor: 'gray.100',
          boxShadow: '2px 4px 16px 0px rgba(248,248,248,0.06) inset',
          _dark: {
            backgroundColor: 'rgba(40,40,40,0.70)'
          }
        }),
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

export const CardTitle: Component<CardTitleProps> = (props) => {
  return (
    <h3
      class={cx(
        css({
          fontSize: '18px',
          fontWeight: '600',
          color: 'gray.800',
          paddingY: '8px',
          _dark: { color: 'white' }
        }),
        props.className
      )}
    >
      {props.children}
    </h3>
  );
};

export const CardDescription: Component<CardDescriptionProps> = (props) => {
  return (
    <p
      class={cx(
        css({
          fontSize: '14px',
          fontWeight: '400',
          color: 'neutral.600',
          maxWidth: '384px',
          _dark: { color: 'neutral.400' }
        }),
        props.className
      )}
    >
      {props.children}
    </p>
  );
};

export const CardSkeletonContainer: Component<CardSkeletonContainerProps> = (props) => {
  const showGradient = props.showGradient ?? true;
  
  return (
    <div
      class={cx(
        css({
          height: '240px',
          borderRadius: '12px',
          zIndex: 40,
          md: { height: '320px' }
        }),
        showGradient && css({
          backgroundColor: 'neutral.300',
          maskImage: 'radial-gradient(50% 50% at 50% 50%, white 0%, transparent 100%)',
          _dark: { backgroundColor: 'rgba(40,40,40,0.70)' }
        }),
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const Container: Component<ContainerProps> = (props) => {
  return (
    <div
      class={cx(
        css({
          height: '64px',
          width: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(248,248,248,0.01)',
          boxShadow: '0px 0px 8px 0px rgba(248,248,248,0.25) inset, 0px 32px 24px -16px rgba(0,0,0,0.40)'
        }),
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

export const ClaudeLogo: Component<LogoProps> = (props) => {
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

export const OpenAILogo: Component<LogoProps> = (props) => {
  return (
    <svg
      class={props.className}
      width="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.153 11.46a6.888 6.888 0 0 0-.608-5.73 7.117 7.117 0 0 0-3.29-2.93 7.238 7.238 0 0 0-4.41-.454 7.065 7.065 0 0 0-2.41-1.742A7.15 7.15 0 0 0 12.514 0a7.216 7.216 0 0 0-4.217 1.346 7.061 7.061 0 0 0-2.603 3.539 7.12 7.12 0 0 0-2.734 1.188A7.012 7.012 0 0 0 .966 8.268a6.979 6.979 0 0 0 .88 8.273 6.89 6.89 0 0 0 .607 5.729 7.117 7.117 0 0 0 3.29 2.93 7.238 7.238 0 0 0 4.41.454 7.061 7.061 0 0 0 2.409 1.742c.92.404 1.916.61 2.923.604a7.215 7.215 0 0 0 4.22-1.345 7.06 7.06 0 0 0 2.605-3.543 7.116 7.116 0 0 0 2.734-1.187 7.01 7.01 0 0 0 1.993-2.196 6.978 6.978 0 0 0-.884-8.27Zm-10.61 14.71c-1.412 0-2.505-.428-3.46-1.215.043-.023.119-.064.168-.094l5.65-3.22a.911.911 0 0 0 .464-.793v-7.86l2.389 1.36a.087.087 0 0 1 .046.065v6.508c0 2.952-2.491 5.248-5.257 5.248ZM4.062 21.354a5.17 5.17 0 0 1-.635-3.516c.042.025.115.07.168.1l5.65 3.22a.928.928 0 0 0 .928 0l6.898-3.93v2.72a.083.083 0 0 1-.034.072l-5.711 3.255a5.386 5.386 0 0 1-4.035.522 5.315 5.315 0 0 1-3.23-2.443ZM2.573 9.184a5.283 5.283 0 0 1 2.768-2.301V13.515a.895.895 0 0 0 .464.793l6.897 3.93-2.388 1.36a.087.087 0 0 1-.08.008L4.52 16.349a5.262 5.262 0 0 1-2.475-3.185 5.192 5.192 0 0 1 .527-3.98Zm19.623 4.506-6.898-3.93 2.388-1.36a.087.087 0 0 1 .08-.008l5.713 3.255a5.28 5.28 0 0 1 2.054 2.118 5.19 5.19 0 0 1-.488 5.608 5.314 5.314 0 0 1-2.39 1.742v-6.633a.896.896 0 0 0-.459-.792Zm2.377-3.533a7.973 7.973 0 0 0-.168-.099l-5.65-3.22a.93.93 0 0 0-.928 0l-6.898 3.93V8.046a.083.083 0 0 1 .034-.072l5.712-3.251a5.375 5.375 0 0 1 5.698.241 5.262 5.262 0 0 1 1.865 2.28c.39.92.506 1.93.335 2.913ZM9.631 15.009l-2.39-1.36a.083.083 0 0 1-.046-.065V7.075c.001-.997.29-1.973.832-2.814a5.297 5.297 0 0 1 2.231-1.935 5.382 5.382 0 0 1 5.659.72 4.89 4.89 0 0 0-.168.093l-5.65 3.22a.913.913 0 0 0-.465.793l-.003 7.857Zm1.297-2.76L14 10.5l3.072 1.75v3.5L14 17.499l-3.072-1.75v-3.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const GeminiLogo: Component<LogoProps> = (props) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      class={props.className}
    >
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

export const MetaIconOutline: Component<LogoProps> = (props) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 287.56 191"
      class={props.className}
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="62.34"
          y1="101.45"
          x2="260.34"
          y2="91.45"
          gradientTransform="matrix(1, 0, 0, -1, 0, 192)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#0064e1" />
          <stop offset="0.4" stop-color="#0064e1" />
          <stop offset="0.83" stop-color="#0073ee" />
          <stop offset="1" stop-color="#0082fb" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1="41.42"
          y1="53"
          x2="41.42"
          y2="126"
          gradientTransform="matrix(1, 0, 0, -1, 0, 192)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#0082fb" />
          <stop offset="1" stop-color="#0064e0" />
        </linearGradient>
      </defs>
      <path
        fill="#0081fb"
        d="M31.06,126c0,11,2.41,19.41,5.56,24.51A19,19,0,0,0,53.19,160c8.1,0,15.51-2,29.79-21.76,11.44-15.83,24.92-38,34-52l15.36-23.6c10.67-16.39,23-34.61,37.18-47C181.07,5.6,193.54,0,206.09,0c21.07,0,41.14,12.21,56.5,35.11,16.81,25.08,25,56.67,25,89.27,0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191V160c17.63,0,22-16.2,22-34.74,0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13l-9.06,16c-18.2,32.27-22.81,39.62-31.91,51.75C84.74,183,71.12,191,53.19,191c-21.27,0-34.72-9.21-43-23.09C3.34,156.6,0,141.76,0,124.85Z"
      />
      <path
        fill="url(#linear-gradient)"
        d="M24.49,37.3C38.73,15.35,59.28,0,82.85,0c13.65,0,27.22,4,41.39,15.61,15.5,12.65,32,33.48,52.63,67.81l7.39,12.32c17.84,29.72,28,45,33.93,52.22,7.64,9.26,13,12,19.94,12,17.63,0,22-16.2,22-34.74l27.4-.86c0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191c-12.8,0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71L146.08,93.6c-12.94-21.62-24.81-37.74-31.68-45C107,40.71,97.51,31.23,82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78Z"
      />
      <path
        fill="url(#linear-gradient-2)"
        d="M82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78C38.61,71.62,31.06,99.34,31.06,126c0,11,2.41,19.41,5.56,24.51L10.14,167.91C3.34,156.6,0,141.76,0,124.85,0,94.1,8.44,62.05,24.49,37.3,38.73,15.35,59.28,0,82.85,0Z"
      />
    </svg>
  );
};

export const CopilotLogo: Component<LogoProps> = (props) => {
  return (
    <svg
      class={props.className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.998 2c-4.963 0-8.999 4.038-8.999 9.001 0 1.393.32 2.708.889 3.882L2 19.001l4.136-1.888c1.174.569 2.489.889 3.881.889h.963c-.001-.33-.001-.66.018-.989C10.999 13.003 11.998 2 11.998 2z"/>
      <circle cx="8.5" cy="11.5" r="1.5"/>
      <circle cx="15.5" cy="11.5" r="1.5"/>
      <path d="M12 15.5c-1.5 0-2.7-.8-3.2-2h6.4c-.5 1.2-1.7 2-3.2 2z"/>
    </svg>
  );
};