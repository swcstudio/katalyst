import { css } from '@sse/ui/styled-system/css';
import {
  type Component,
  For,
  type JSX,
  Show,
  children,
  createContext,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
  useContext,
} from 'solid-js';

interface ModalContextType {
  isOpen: () => boolean;
  setIsOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType>();

export interface ModalProps {
  children?: JSX.Element;
  className?: string;
}

export interface ModalTriggerProps {
  children?: JSX.Element;
  className?: string;
  onClick?: () => void;
}

export interface ModalBodyProps {
  children?: JSX.Element;
  className?: string;
}

export interface ModalContentProps {
  children?: JSX.Element;
  className?: string;
}

export interface ModalFooterProps {
  children?: JSX.Element;
  className?: string;
}

export const Modal: Component<ModalProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const resolved = children(() => props.children);

  const contextValue = {
    isOpen,
    setIsOpen,
  };

  return <ModalContext.Provider value={contextValue}>{resolved()}</ModalContext.Provider>;
};

export const ModalTrigger: Component<ModalTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'className', 'onClick']);
  const context = useContext(ModalContext);
  const resolved = children(() => local.children);

  const handleClick = () => {
    context?.setIsOpen(true);
    local.onClick?.();
  };

  return (
    <button
      class={css(
        {
          backgroundColor: 'black',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          _dark: {
            backgroundColor: 'white',
            color: 'black',
          },
        },
        local.className
      )}
      onClick={handleClick}
      {...others}
    >
      {resolved()}
    </button>
  );
};

export const ModalBody: Component<ModalBodyProps> = (props) => {
  const context = useContext(ModalContext);
  const resolved = children(() => props.children);
  let backdropRef: HTMLDivElement;

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === backdropRef) {
      context?.setIsOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      context?.setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <Show when={context?.isOpen()}>
      <div
        ref={backdropRef!}
        class={css({
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '4',
          animation: 'fadeIn 0.3s ease-out',
        })}
        onClick={handleBackdropClick}
      >
        <div
          class={css(
            {
              backgroundColor: 'white',
              borderRadius: 'xl',
              maxWidth: '2xl',
              width: 'full',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              animation: 'scaleIn 0.3s ease-out',
              _dark: {
                backgroundColor: 'gray.900',
              },
            },
            props.className
          )}
        >
          <button
            class={css({
              position: 'absolute',
              top: '4',
              right: '4',
              width: '8',
              height: '8',
              borderRadius: 'full',
              backgroundColor: 'gray.200',
              color: 'gray.600',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              _hover: {
                backgroundColor: 'gray.300',
              },
              _dark: {
                backgroundColor: 'gray.700',
                color: 'gray.300',
              },
            })}
            onClick={() => context?.setIsOpen(false)}
          >
            ×
          </button>
          {resolved()}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </Show>
  );
};

export const ModalContent: Component<ModalContentProps> = (props) => {
  const resolved = children(() => props.children);

  return (
    <div
      class={css(
        {
          padding: '6',
        },
        props.className
      )}
    >
      {resolved()}
    </div>
  );
};

export const ModalFooter: Component<ModalFooterProps> = (props) => {
  const resolved = children(() => props.children);

  return (
    <div
      class={css(
        {
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '6',
          paddingTop: '0',
          gap: '4',
        },
        props.className
      )}
    >
      {resolved()}
    </div>
  );
};

const PlaneIcon: Component<{ className?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
    </svg>
  );
};

const VacationIcon: Component<{ className?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
      <path d="M18 3.804a6 6 0 0 0 -8.196 2.196l10.392 6a6 6 0 0 0 -2.196 -8.196z" />
      <path d="M16.732 10c1.658 -2.87 2.225 -5.644 1.268 -6.196c-.957 -.552 -3.075 1.326 -4.732 4.196" />
      <path d="M15 9l-3 5.196" />
      <path d="M3 19.25a2.4 2.4 0 0 1 1 -.25a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 1 .25" />
    </svg>
  );
};

const ElevatorIcon: Component<{ className?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
      <path d="M10 10l2 -2l2 2" />
      <path d="M10 14l2 2l2 -2" />
    </svg>
  );
};

const FoodIcon: Component<{ className?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 20c0 -3.952 -.966 -16 -4.038 -16s-3.962 9.087 -3.962 14.756c0 -5.669 -.896 -14.756 -3.962 -14.756c-3.065 0 -4.038 12.048 -4.038 16" />
    </svg>
  );
};

const MicIcon: Component<{ className?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
      <path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" />
    </svg>
  );
};

const ParachuteIcon: Component<{ className?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 12a10 10 0 1 0 -20 0" />
      <path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
      <path d="M2 12l10 10l-3.5 -10" />
      <path d="M15.5 12l-3.5 10l10 -10" />
    </svg>
  );
};

export interface AnimatedModalDemoProps {
  className?: string;
}

export const AnimatedModalDemo: Component<AnimatedModalDemoProps> = (props) => {
  const images = [
    'https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  return (
    <div
      class={css(
        {
          paddingY: '40',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.className
      )}
    >
      <Modal>
        <ModalTrigger
          class={css({
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            _dark: {
              backgroundColor: 'white',
              color: 'black',
            },
          })}
        >
          <span
            class={css({
              transition: 'transform 0.5s',
              textAlign: 'center',
              _groupHover: {
                transform: 'translateX(10rem)',
              },
            })}
          >
            Book your flight
          </span>
          <div
            class={css({
              transform: 'translateX(-10rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              inset: 0,
              transition: 'transform 0.5s',
              color: 'white',
              zIndex: 20,
              _groupHover: {
                transform: 'translateX(0)',
              },
            })}
          >
            ✈️
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4
              class={css({
                fontSize: 'lg',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '8',
                color: 'neutral.600',
                _md: {
                  fontSize: '2xl',
                },
                _dark: {
                  color: 'neutral.100',
                },
              })}
            >
              Book your trip to{' '}
              <span
                class={css({
                  paddingX: '1',
                  paddingY: '0.5',
                  borderRadius: 'md',
                  backgroundColor: 'gray.100',
                  border: '1px solid',
                  borderColor: 'gray.200',
                  _dark: {
                    backgroundColor: 'neutral.800',
                    borderColor: 'neutral.700',
                  },
                })}
              >
                Bali
              </span>{' '}
              now! ✈️
            </h4>
            <div
              class={css({
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2',
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
                      flexShrink: 0,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      transform: `rotate(${Math.random() * 20 - 10}deg)`,
                      _hover: {
                        transform: 'scale(1.1) rotate(0deg)',
                        zIndex: 100,
                      },
                      _dark: {
                        backgroundColor: 'neutral.800',
                        borderColor: 'neutral.700',
                      },
                    })}
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
                        flexShrink: 0,
                        _md: {
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
                paddingY: '10',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                maxWidth: 'sm',
                marginX: 'auto',
              })}
            >
              <div class={css({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                <PlaneIcon
                  class={css({
                    marginRight: '1',
                    color: 'neutral.700',
                    height: '4',
                    width: '4',
                    _dark: { color: 'neutral.300' },
                  })}
                />
                <span
                  class={css({
                    color: 'neutral.700',
                    fontSize: 'sm',
                    _dark: { color: 'neutral.300' },
                  })}
                >
                  5 connecting flights
                </span>
              </div>
              <div class={css({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                <ElevatorIcon
                  class={css({
                    marginRight: '1',
                    color: 'neutral.700',
                    height: '4',
                    width: '4',
                    _dark: { color: 'neutral.300' },
                  })}
                />
                <span
                  class={css({
                    color: 'neutral.700',
                    fontSize: 'sm',
                    _dark: { color: 'neutral.300' },
                  })}
                >
                  12 hotels
                </span>
              </div>
              <div class={css({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                <VacationIcon
                  class={css({
                    marginRight: '1',
                    color: 'neutral.700',
                    height: '4',
                    width: '4',
                    _dark: { color: 'neutral.300' },
                  })}
                />
                <span
                  class={css({
                    color: 'neutral.700',
                    fontSize: 'sm',
                    _dark: { color: 'neutral.300' },
                  })}
                >
                  69 visiting spots
                </span>
              </div>
              <div class={css({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                <FoodIcon
                  class={css({
                    marginRight: '1',
                    color: 'neutral.700',
                    height: '4',
                    width: '4',
                    _dark: { color: 'neutral.300' },
                  })}
                />
                <span
                  class={css({
                    color: 'neutral.700',
                    fontSize: 'sm',
                    _dark: { color: 'neutral.300' },
                  })}
                >
                  Good food everyday
                </span>
              </div>
              <div class={css({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                <MicIcon
                  class={css({
                    marginRight: '1',
                    color: 'neutral.700',
                    height: '4',
                    width: '4',
                    _dark: { color: 'neutral.300' },
                  })}
                />
                <span
                  class={css({
                    color: 'neutral.700',
                    fontSize: 'sm',
                    _dark: { color: 'neutral.300' },
                  })}
                >
                  Open Mic
                </span>
              </div>
              <div class={css({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                <ParachuteIcon
                  class={css({
                    marginRight: '1',
                    color: 'neutral.700',
                    height: '4',
                    width: '4',
                    _dark: { color: 'neutral.300' },
                  })}
                />
                <span
                  class={css({
                    color: 'neutral.700',
                    fontSize: 'sm',
                    _dark: { color: 'neutral.300' },
                  })}
                >
                  Paragliding
                </span>
              </div>
            </div>
          </ModalContent>
          <ModalFooter class={css({ gap: '4' })}>
            <button
              class={css({
                paddingX: '2',
                paddingY: '1',
                backgroundColor: 'gray.200',
                color: 'black',
                border: '1px solid',
                borderColor: 'gray.300',
                borderRadius: 'md',
                fontSize: 'sm',
                width: '28',
                _dark: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                },
              })}
            >
              Cancel
            </button>
            <button
              class={css({
                backgroundColor: 'black',
                color: 'white',
                fontSize: 'sm',
                paddingX: '2',
                paddingY: '1',
                borderRadius: 'md',
                border: '1px solid',
                borderColor: 'black',
                width: '28',
                _dark: {
                  backgroundColor: 'white',
                  color: 'black',
                },
              })}
            >
              Book Now
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AnimatedModalDemo;
