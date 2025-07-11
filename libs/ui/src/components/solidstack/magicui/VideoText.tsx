import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  createSignal,
  type JSX,
  mergeProps,
  onMount,
  type ParentComponent,
} from 'solid-js';

export interface VideoTextProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export const VideoText: ParentComponent<VideoTextProps> = (props) => {
  const merged = mergeProps(
    {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
    },
    props
  );

  const [videoRef, setVideoRef] = createSignal<HTMLVideoElement>();

  onMount(() => {
    const video = videoRef();
    if (video && merged.autoPlay) {
      video.play().catch(() => {
        // Auto-play was prevented, handle silently
      });
    }
  });

  return (
    <div
      class={css(
        {
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        merged.class
      )}
      style={merged.style}
    >
      {/* Background video */}
      <video
        ref={setVideoRef}
        class={css({
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
        })}
        src={merged.src}
        autoplay={merged.autoPlay}
        loop={merged.loop}
        muted={merged.muted}
        playsinline={merged.playsInline}
      />

      {/* Text with video mask */}
      <div
        class={css({
          position: 'relative',
          zIndex: 1,
          fontSize: '8rem',
          fontWeight: '900',
          letterSpacing: '-0.05em',
          textAlign: 'center',
          lineHeight: 0.8,
          background: `url(${merged.src})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
        })}
      >
        {props.children}
      </div>

      {/* Video element for masking */}
      <video
        class={css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          mask: 'url(#text-mask)',
          WebkitMask: 'url(#text-mask)',
        })}
        src={merged.src}
        autoplay={merged.autoPlay}
        loop={merged.loop}
        muted={merged.muted}
        playsinline={merged.playsInline}
      />

      {/* SVG mask definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <mask id="text-mask">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="white"
              font-size="8rem"
              font-weight="900"
              letter-spacing="-0.05em"
            >
              {props.children}
            </text>
          </mask>
        </defs>
      </svg>
    </div>
  );
};

export interface VideoTextDemoProps {
  class?: string;
}

export const VideoTextDemo: Component<VideoTextDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          height: '200px',
          width: '100%',
          overflow: 'hidden',
        },
        props.class
      )}
    >
      <VideoText src="https://cdn.magicui.design/ocean-small.webm">OCEAN</VideoText>
    </div>
  );
};

export type { VideoTextProps, VideoTextDemoProps };
