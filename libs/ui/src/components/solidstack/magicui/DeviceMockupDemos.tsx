import { css } from '@sse/ui/styled-system/css';
import type { Component } from 'solid-js';

// Placeholder Safari component - this would need to be implemented separately
const Safari: Component<{
  url: string;
  className?: string;
  imageSrc?: string;
  videoSrc?: string;
  mode?: 'default' | 'simple';
}> = (props) => {
  return (
    <div
      class={css(
        {
          backgroundColor: 'gray.100',
          borderRadius: 'lg',
          border: '1px solid',
          borderColor: 'gray.300',
          overflow: 'hidden',
          boxShadow: 'lg',
          _dark: {
            backgroundColor: 'gray.800',
            borderColor: 'gray.600',
          },
        },
        props.className
      )}
    >
      {/* Safari header */}
      {props.mode !== 'simple' && (
        <div
          class={css({
            backgroundColor: 'gray.200',
            padding: '3',
            display: 'flex',
            alignItems: 'center',
            gap: '2',
            borderBottom: '1px solid',
            borderColor: 'gray.300',
            _dark: {
              backgroundColor: 'gray.700',
              borderColor: 'gray.600',
            },
          })}
        >
          {/* Traffic lights */}
          <div class={css({ display: 'flex', gap: '1' })}>
            <div
              class={css({
                width: '3',
                height: '3',
                borderRadius: 'full',
                backgroundColor: 'red.500',
              })}
            />
            <div
              class={css({
                width: '3',
                height: '3',
                borderRadius: 'full',
                backgroundColor: 'yellow.500',
              })}
            />
            <div
              class={css({
                width: '3',
                height: '3',
                borderRadius: 'full',
                backgroundColor: 'green.500',
              })}
            />
          </div>

          {/* Address bar */}
          <div
            class={css({
              flex: '1',
              backgroundColor: 'white',
              borderRadius: 'md',
              padding: '2',
              fontSize: 'sm',
              color: 'gray.600',
              border: '1px solid',
              borderColor: 'gray.300',
              marginX: '4',
              _dark: {
                backgroundColor: 'gray.900',
                color: 'gray.400',
                borderColor: 'gray.600',
              },
            })}
          >
            {props.url}
          </div>
        </div>
      )}

      {/* Content area */}
      <div
        class={css({
          aspectRatio: '16/9',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          _dark: {
            backgroundColor: 'gray.900',
          },
        })}
      >
        {props.videoSrc ? (
          <video
            src={props.videoSrc}
            autoplay
            loop
            muted
            class={css({
              width: 'full',
              height: 'full',
              objectFit: 'cover',
            })}
          />
        ) : props.imageSrc ? (
          <img
            src={props.imageSrc}
            alt="Safari content"
            class={css({
              width: 'full',
              height: 'full',
              objectFit: 'cover',
            })}
          />
        ) : (
          <div
            class={css({
              color: 'gray.500',
              fontSize: 'lg',
              fontWeight: 'medium',
            })}
          >
            {props.url}
          </div>
        )}
      </div>
    </div>
  );
};

// Placeholder iPhone 15 Pro component
const Iphone15Pro: Component<{
  className?: string;
  src?: string;
  videoSrc?: string;
}> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          width: '250px',
          height: '500px',
          backgroundColor: 'black',
          borderRadius: '3xl',
          padding: '2',
          _dark: {
            backgroundColor: 'gray.900',
          },
        },
        props.className
      )}
    >
      {/* Notch */}
      <div
        class={css({
          position: 'absolute',
          top: '2',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '32',
          height: '6',
          backgroundColor: 'black',
          borderRadius: 'full',
          zIndex: '10',
        })}
      />

      {/* Screen */}
      <div
        class={css({
          width: 'full',
          height: 'full',
          backgroundColor: 'white',
          borderRadius: '2xl',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          _dark: {
            backgroundColor: 'gray.800',
          },
        })}
      >
        {props.videoSrc ? (
          <video
            src={props.videoSrc}
            autoplay
            loop
            muted
            class={css({
              width: 'full',
              height: 'full',
              objectFit: 'cover',
            })}
          />
        ) : props.src ? (
          <img
            src={props.src}
            alt="iPhone content"
            class={css({
              width: 'full',
              height: 'full',
              objectFit: 'cover',
            })}
          />
        ) : (
          <div
            class={css({
              color: 'gray.500',
              fontSize: 'sm',
              textAlign: 'center',
            })}
          >
            iPhone 15 Pro
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div
        class={css({
          position: 'absolute',
          bottom: '4',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20',
          height: '1',
          backgroundColor: 'white',
          borderRadius: 'full',
          opacity: '50',
        })}
      />
    </div>
  );
};

// Placeholder Android component
const Android: Component<{
  className?: string;
  src?: string;
  videoSrc?: string;
}> = (props) => {
  return (
    <div
      class={css(
        {
          position: 'relative',
          width: '250px',
          height: '500px',
          backgroundColor: 'black',
          borderRadius: '2xl',
          padding: '3',
          _dark: {
            backgroundColor: 'gray.900',
          },
        },
        props.className
      )}
    >
      {/* Camera hole */}
      <div
        class={css({
          position: 'absolute',
          top: '4',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '4',
          height: '4',
          backgroundColor: 'black',
          borderRadius: 'full',
          zIndex: '10',
        })}
      />

      {/* Screen */}
      <div
        class={css({
          width: 'full',
          height: 'full',
          backgroundColor: 'white',
          borderRadius: 'xl',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          _dark: {
            backgroundColor: 'gray.800',
          },
        })}
      >
        {props.videoSrc ? (
          <video
            src={props.videoSrc}
            autoplay
            loop
            muted
            class={css({
              width: 'full',
              height: 'full',
              objectFit: 'cover',
            })}
          />
        ) : props.src ? (
          <img
            src={props.src}
            alt="Android content"
            class={css({
              width: 'full',
              height: 'full',
              objectFit: 'cover',
            })}
          />
        ) : (
          <div
            class={css({
              color: 'gray.500',
              fontSize: 'sm',
              textAlign: 'center',
            })}
          >
            Android Device
          </div>
        )}
      </div>

      {/* Navigation bar */}
      <div
        class={css({
          position: 'absolute',
          bottom: '4',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '4',
          backgroundColor: 'gray.800',
          paddingX: '4',
          paddingY: '2',
          borderRadius: 'full',
          opacity: '80',
        })}
      >
        <div
          class={css({
            width: '2',
            height: '2',
            backgroundColor: 'white',
            borderRadius: 'full',
          })}
        />
        <div
          class={css({
            width: '4',
            height: '2',
            backgroundColor: 'white',
            borderRadius: 'full',
          })}
        />
        <div
          class={css({
            width: '2',
            height: '2',
            backgroundColor: 'white',
            borderRadius: 'full',
          })}
        />
      </div>
    </div>
  );
};

// Demo Components
export const SafariDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        width: 'full',
        maxWidth: '4xl',
        marginX: 'auto',
      })}
    >
      <Safari url="magicui.design" className={css({ width: 'full', height: 'full' })} />
    </div>
  );
};

export const SafariImageDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        width: 'full',
        maxWidth: '4xl',
        marginX: 'auto',
      })}
    >
      <Safari
        url="magicui.design"
        className={css({ width: 'full', height: 'full' })}
        imageSrc="https://via.placeholder.com/1200x750"
      />
    </div>
  );
};

export const SafariVideoDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        width: 'full',
        maxWidth: '4xl',
        marginX: 'auto',
      })}
    >
      <Safari
        url="magicui.design"
        className={css({ width: 'full', height: 'full' })}
        videoSrc="https://videos.pexels.com/video-files/27180348/12091515_2560_1440_50fps.mp4"
      />
    </div>
  );
};

export const SafariSimpleDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        width: 'full',
        maxWidth: '4xl',
        marginX: 'auto',
      })}
    >
      <Safari
        url="magicui.design"
        mode="simple"
        className={css({ width: 'full', height: 'full' })}
      />
    </div>
  );
};

export const Iphone15ProDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8',
      })}
    >
      <Iphone15Pro className={css({ width: 'full', height: 'full' })} />
    </div>
  );
};

export const Iphone15ProImageDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8',
      })}
    >
      <Iphone15Pro
        className={css({ width: 'full', height: 'full' })}
        src="https://via.placeholder.com/430x880"
      />
    </div>
  );
};

export const Iphone15ProVideoDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8',
      })}
    >
      <Iphone15Pro
        className={css({ width: 'full', height: 'full' })}
        videoSrc="https://videos.pexels.com/video-files/8946986/8946986-uhd_1440_2732_25fps.mp4"
      />
    </div>
  );
};

export const AndroidDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8',
      })}
    >
      <Android className={css({ width: 'full', height: 'full' })} />
    </div>
  );
};

export const AndroidImageDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8',
      })}
    >
      <Android
        className={css({ width: 'full', height: 'full' })}
        src="https://images.unsplash.com/photo-1730326405863-c6fa7e499a6e?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    </div>
  );
};

export const AndroidVideoDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8',
      })}
    >
      <Android
        className={css({ width: 'full', height: 'full' })}
        videoSrc="https://videos.pexels.com/video-files/14993748/14993748-uhd_1296_2304_30fps.mp4"
      />
    </div>
  );
};

// Comprehensive Device Showcase
export const DeviceMockupShowcase: Component = () => {
  return (
    <div
      class={css({
        padding: '8',
        backgroundColor: 'gray.50',
        minHeight: '100vh',
        _dark: {
          backgroundColor: 'gray.900',
        },
      })}
    >
      <div
        class={css({
          maxWidth: '7xl',
          marginX: 'auto',
          gap: '12',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {/* Header */}
        <div
          class={css({
            textAlign: 'center',
            marginBottom: '8',
          })}
        >
          <h1
            class={css({
              fontSize: '4xl',
              fontWeight: 'bold',
              color: 'gray.900',
              marginBottom: '4',
              _dark: {
                color: 'white',
              },
            })}
          >
            Device Mockups
          </h1>
          <p
            class={css({
              fontSize: 'lg',
              color: 'gray.600',
              _dark: {
                color: 'gray.400',
              },
            })}
          >
            Showcase your content in realistic device frames
          </p>
        </div>

        {/* Safari Section */}
        <section
          class={css({
            marginBottom: '16',
          })}
        >
          <h2
            class={css({
              fontSize: '2xl',
              fontWeight: 'semibold',
              marginBottom: '6',
              color: 'gray.900',
              _dark: {
                color: 'white',
              },
            })}
          >
            Safari Browser
          </h2>
          <div
            class={css({
              display: 'grid',
              gap: '6',
              gridTemplateColumns: '1',
              lg: {
                gridTemplateColumns: '2',
              },
            })}
          >
            <SafariDemo />
            <SafariSimpleDemo />
          </div>
        </section>

        {/* Mobile Devices Section */}
        <section>
          <h2
            class={css({
              fontSize: '2xl',
              fontWeight: 'semibold',
              marginBottom: '6',
              color: 'gray.900',
              _dark: {
                color: 'white',
              },
            })}
          >
            Mobile Devices
          </h2>
          <div
            class={css({
              display: 'grid',
              gap: '8',
              gridTemplateColumns: '1',
              md: {
                gridTemplateColumns: '2',
              },
              lg: {
                gridTemplateColumns: '3',
              },
              justifyItems: 'center',
            })}
          >
            <Iphone15ProDemo />
            <AndroidDemo />
            <Iphone15ProImageDemo />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeviceMockupShowcase;
