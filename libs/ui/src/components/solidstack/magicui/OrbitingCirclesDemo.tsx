import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, For, onCleanup, onMount } from 'solid-js';

// Placeholder OrbitingCircles component - this would need to be implemented separately
const OrbitingCircles: Component<{
  iconSize?: number;
  radius?: number;
  reverse?: boolean;
  speed?: number;
  children: JSX.Element | JSX.Element[];
}> = (props) => {
  const iconSize = props.iconSize || 30;
  const radius = props.radius || 80;
  const speed = props.speed || 1;

  return (
    <div
      class={css({
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'full',
        height: 'full',
      })}
    >
      <div
        class={css({
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          borderRadius: 'full',
          border: '1px solid rgba(255,255,255,0.1)',
        })}
      >
        <For each={Array.isArray(props.children) ? props.children : [props.children]}>
          {(child, index) => (
            <div
              class={css({
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                borderRadius: 'full',
                backgroundColor: 'white',
                boxShadow: 'md',
                border: '1px solid rgba(0,0,0,0.1)',
                animation: `orbit-${index()} ${20 / speed}s linear infinite ${props.reverse ? 'reverse' : ''}`,
                _dark: {
                  backgroundColor: 'gray.800',
                  borderColor: 'gray.700',
                },
              })}
              style={{
                '--orbit-radius': `${radius}px`,
                transform: `rotate(${(360 / (Array.isArray(props.children) ? props.children.length : 1)) * index()}deg) translateX(var(--orbit-radius)) rotate(${props.reverse ? '' : '-'}${(360 / (Array.isArray(props.children) ? props.children.length : 1)) * index()}deg)`,
              }}
            >
              {child}
            </div>
          )}
        </For>

        <style>{`
          ${Array.from(
            { length: Array.isArray(props.children) ? props.children.length : 1 },
            (_, i) => `
            @keyframes orbit-${i} {
              from { transform: rotate(${(360 / (Array.isArray(props.children) ? props.children.length : 1)) * i}deg) translateX(${radius}px) rotate(-${(360 / (Array.isArray(props.children) ? props.children.length : 1)) * i}deg); }
              to { transform: rotate(${(360 / (Array.isArray(props.children) ? props.children.length : 1)) * i + 360}deg) translateX(${radius}px) rotate(-${(360 / (Array.isArray(props.children) ? props.children.length : 1)) * i + 360}deg); }
            }
          `
          ).join('')}
        `}</style>
      </div>
    </div>
  );
};

// Icon Components
const Icons = {
  whatsapp: () => (
    <svg width="20" height="20" viewBox="0 0 175.216 175.552" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient
          id="b"
          x1="85.915"
          x2="86.535"
          y1="32.567"
          y2="137.092"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#57d163" />
          <stop offset="1" stop-color="#23b33a" />
        </linearGradient>
      </defs>
      <path
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
        fill="url(#b)"
      />
      <path
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
        fill="#ffffff"
        fill-rule="evenodd"
      />
    </svg>
  ),
  notion: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
        fill="#ffffff"
      />
      <path
        d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917z"
        fill="#000000"
        fill-rule="evenodd"
        clip-rule="evenodd"
      />
    </svg>
  ),
  openai: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      class={css({ fill: 'black', _dark: { fill: 'white' } })}
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729z" />
    </svg>
  ),
  googleDrive: () => (
    <svg width="20" height="20" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  ),
};

export const OrbitingCirclesDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        height: '500px',
        width: 'full',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      })}
    >
      <OrbitingCircles iconSize={40}>
        <Icons.whatsapp />
        <Icons.notion />
        <Icons.openai />
        <Icons.googleDrive />
        <Icons.whatsapp />
      </OrbitingCircles>
      <OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
        <Icons.whatsapp />
        <Icons.notion />
        <Icons.openai />
        <Icons.googleDrive />
      </OrbitingCircles>
    </div>
  );
};

export default OrbitingCirclesDemo;
