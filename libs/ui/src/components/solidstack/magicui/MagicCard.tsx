import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  type JSX,
  type ParentComponent,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

export interface MagicCardProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  gradientColor?: string;
  gradientSize?: number;
  gradientOpacity?: number;
}

export const MagicCard: ParentComponent<MagicCardProps> = (props) => {
  const merged = mergeProps(
    {
      gradientColor: '#262626',
      gradientSize: 200,
      gradientOpacity: 0.8,
    },
    props
  );

  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = createSignal(false);
  let cardRef: HTMLDivElement | undefined;

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef) return;

    const rect = cardRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  onMount(() => {
    if (cardRef) {
      cardRef.addEventListener('mousemove', handleMouseMove);
      cardRef.addEventListener('mouseenter', handleMouseEnter);
      cardRef.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  onCleanup(() => {
    if (cardRef) {
      cardRef.removeEventListener('mousemove', handleMouseMove);
      cardRef.removeEventListener('mouseenter', handleMouseEnter);
      cardRef.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  return (
    <div
      ref={cardRef}
      class={css(
        {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'border',
          backgroundColor: 'background',
          transition: 'all 0.3s ease',
          cursor: 'pointer',

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
            padding: '1px',
            background: `radial-gradient(${merged.gradientSize}px circle at ${mousePosition().x}px ${mousePosition().y}px, ${merged.gradientColor}, transparent 40%)`,
            maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            opacity: isHovered() ? merged.gradientOpacity : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          },
        },
        merged.class
      )}
      style={{
        '--gradient-color': merged.gradientColor,
        '--gradient-size': `${merged.gradientSize}px`,
        '--gradient-opacity': merged.gradientOpacity,
        ...merged.style,
      }}
    >
      <div
        class={css({
          position: 'relative',
          zIndex: 1,
          borderRadius: '7px',
          backgroundColor: 'background',
          overflow: 'hidden',
        })}
      >
        {props.children}
      </div>
    </div>
  );
};

export interface MagicCardDemoProps {
  class?: string;
  gradientColor?: string;
}

export const MagicCardDemo: Component<MagicCardDemoProps> = (props) => {
  return (
    <div
      class={css(
        {
          padding: '0',
          maxWidth: '384px',
          width: '100%',
          boxShadow: 'none',
          border: 'none',
        },
        props.class
      )}
    >
      <MagicCard gradientColor={props.gradientColor || '#D9D9D955'} class={css({ padding: '0' })}>
        <div
          class={css({
            borderBottom: '1px solid',
            borderColor: 'border',
            padding: '16px',
          })}
        >
          <h3
            class={css({
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '8px',
            })}
          >
            Login
          </h3>
          <p
            class={css({
              fontSize: '14px',
              color: 'muted.foreground',
            })}
          >
            Enter your credentials to access your account
          </p>
        </div>

        <div class={css({ padding: '16px' })}>
          <form>
            <div
              class={css({
                display: 'grid',
                gap: '16px',
              })}
            >
              <div
                class={css({
                  display: 'grid',
                  gap: '8px',
                })}
              >
                <label
                  for="email"
                  class={css({
                    fontSize: '14px',
                    fontWeight: 'medium',
                  })}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  class={css({
                    padding: '8px 12px',
                    border: '1px solid',
                    borderColor: 'border',
                    borderRadius: '6px',
                    fontSize: '14px',
                    '&:focus': {
                      outline: 'none',
                      borderColor: 'primary',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
                    },
                  })}
                />
              </div>

              <div
                class={css({
                  display: 'grid',
                  gap: '8px',
                })}
              >
                <label
                  for="password"
                  class={css({
                    fontSize: '14px',
                    fontWeight: 'medium',
                  })}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  class={css({
                    padding: '8px 12px',
                    border: '1px solid',
                    borderColor: 'border',
                    borderRadius: '6px',
                    fontSize: '14px',
                    '&:focus': {
                      outline: 'none',
                      borderColor: 'primary',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
                    },
                  })}
                />
              </div>
            </div>
          </form>
        </div>

        <div
          class={css({
            padding: '16px',
            borderTop: '1px solid',
            borderColor: 'border',
          })}
        >
          <button
            class={css({
              width: '100%',
              padding: '8px 16px',
              backgroundColor: 'primary',
              color: 'primary.foreground',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'medium',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'primary/90',
              },
            })}
          >
            Sign In
          </button>
        </div>
      </MagicCard>
    </div>
  );
};

export type { MagicCardProps, MagicCardDemoProps };
