import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  For,
  type JSX,
  children,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

export interface BackgroundBeamsProps {
  className?: string;
  style?: JSX.CSSProperties;
}

export const BackgroundBeams: Component<BackgroundBeamsProps> = (props) => {
  const merged = mergeProps({}, props);

  const beamPaths = [
    'M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875',
    'M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867',
    'M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859',
    'M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851',
    'M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843',
    'M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835',
  ];

  return (
    <div
      class={css(
        {
          position: 'absolute',
          inset: 0,
          width: 'full',
          height: 'full',
          overflow: 'hidden',
          pointerEvents: 'none',
        },
        merged.className
      )}
      style={merged.style}
    >
      <svg
        class={css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'full',
          height: 'full',
        })}
        viewBox="0 0 1200 1200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(56, 189, 248, 0);stop-opacity:0" />
            <stop offset="50%" style="stop-color:rgba(56, 189, 248, 0.8);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(56, 189, 248, 0);stop-opacity:0" />
          </linearGradient>
          <linearGradient id="beam-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(168, 85, 247, 0);stop-opacity:0" />
            <stop offset="50%" style="stop-color:rgba(168, 85, 247, 0.6);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(168, 85, 247, 0);stop-opacity:0" />
          </linearGradient>
        </defs>

        <For each={beamPaths}>
          {(path, index) => (
            <g>
              <path
                d={path}
                stroke={index() % 2 === 0 ? 'url(#beam-gradient)' : 'url(#beam-gradient-2)'}
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                opacity="0.7"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 1000;50 950;100 900;50 950;0 1000"
                  dur={`${4 + index() * 0.5}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;-100;-200;-300;-400"
                  dur={`${6 + index() * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.7;1;0.7;0"
                  dur={`${3 + index() * 0.2}s`}
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}
        </For>

        {/* Additional floating particles */}
        <For each={Array.from({ length: 20 }, (_, i) => i)}>
          {(index) => (
            <circle
              cx={Math.random() * 1200}
              cy={Math.random() * 1200}
              r="1"
              fill="rgba(56, 189, 248, 0.6)"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur={`${2 + Math.random() * 3}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 2}s`}
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0,0;${Math.random() * 100 - 50},${Math.random() * 100 - 50};0,0`}
                dur={`${4 + Math.random() * 2}s`}
                repeatCount="indefinite"
              />
            </circle>
          )}
        </For>
      </svg>
    </div>
  );
};

export interface BackgroundBeamsDemoProps {
  className?: string;
}

export const BackgroundBeamsDemo: Component<BackgroundBeamsDemoProps> = (props) => {
  const [inputValue, setInputValue] = createSignal('');

  return (
    <div
      class={css(
        {
          height: '40rem',
          width: 'full',
          borderRadius: 'md',
          backgroundColor: 'neutral.950',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSmoothing: 'antialiased',
        },
        props.className
      )}
    >
      <div
        class={css({
          maxWidth: '2xl',
          marginX: 'auto',
          padding: '4',
        })}
      >
        <h1
          class={css({
            position: 'relative',
            zIndex: 10,
            fontSize: 'lg',
            backgroundClip: 'text',
            color: 'transparent',
            background: 'linear-gradient(to bottom, #e5e5e5, #737373)',
            textAlign: 'center',
            fontFamily: 'sans',
            fontWeight: 'bold',
            _md: {
              fontSize: '7xl',
            },
          })}
        >
          Join the waitlist
        </h1>
        <p
          class={css({
            color: 'neutral.500',
            maxWidth: 'lg',
            marginX: 'auto',
            marginY: '2',
            fontSize: 'sm',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
          })}
        >
          Welcome to MailJet, the best transactional email service on the web. We provide reliable,
          scalable, and customizable email solutions for your business. Whether you're sending order
          confirmations, password reset emails, or promotional campaigns, MailJet has got you
          covered.
        </p>
        <input
          type="text"
          placeholder="hi@manuarora.in"
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          class={css({
            borderRadius: 'lg',
            border: '1px solid',
            borderColor: 'neutral.800',
            width: 'full',
            position: 'relative',
            zIndex: 10,
            marginTop: '4',
            backgroundColor: 'neutral.950',
            color: 'white',
            padding: '3',
            _placeholder: {
              color: 'neutral.700',
            },
            _focus: {
              outline: 'none',
              ring: '2px',
              ringColor: 'teal.500',
            },
          })}
        />
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default BackgroundBeamsDemo;
