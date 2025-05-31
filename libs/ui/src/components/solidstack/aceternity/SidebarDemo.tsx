import { Component, createSignal, For, Show } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder Icon components
const IconBrandTabler: Component<{ class?: string }> = (props) => (
  <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect width="4" height="4" x="4" y="4" rx="1" />
    <rect width="4" height="4" x="4" y="12" rx="1" />
    <rect width="4" height="4" x="4" y="20" rx="1" />
    <rect width="4" height="4" x="12" y="4" rx="1" />
    <rect width="4" height="4" x="12" y="12" rx="1" />
    <rect width="4" height="4" x="12" y="20" rx="1" />
    <rect width="4" height="4" x="20" y="4" rx="1" />
    <rect width="4" height="4" x="20" y="12" rx="1" />
    <rect width="4" height="4" x="20" y="20" rx="1" />
  </svg>
);

const IconUserBolt: Component<{ class?: string }> = (props) => (
  <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
    <path d="M19 14l-2 4h4l-2 4" />
  </svg>
);

const IconSettings: Component<{ class?: string }> = (props) => (
  <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconArrowLeft: Component<{ class?: string }> = (props) => (
  <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

// Placeholder Sidebar components
const Sidebar: Component<{
  open: boolean;
  setOpen: (open: boolean) => void;
  children: any;
}> = (props) => {
  return (
    <div class={css({
      position: 'relative',
      zIndex: '20',
      backgroundColor: 'white',
      borderRight: '1px solid',
      borderColor: 'neutral.200',
      transition: 'all 0.3s ease',
      width: props.open ? '300px' : '80px',
      flexShrink: 0,
      _dark: {
        backgroundColor: 'neutral.800',
        borderColor: 'neutral.700',
      },
    })}>
      <button
        class={css({
          position: 'absolute',
          top: '4',
          right: '-3',
          zIndex: '30',
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'neutral.200',
          borderRadius: 'full',
          padding: '1',
          _dark: {
            backgroundColor: 'neutral.800',
            borderColor: 'neutral.700',
          },
        })}
        onClick={() => props.setOpen(!props.open)}
      >
        <svg
          class={css({
            width: '4',
            height: '4',
            transition: 'transform 0.3s ease',
            transform: props.open ? 'rotate(0deg)' : 'rotate(180deg)',
          })}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      {props.children}
    </div>
  );
};

const SidebarBody: Component<{
  className?: string;
  children: any;
}> = (props) => {
  return (
    <div class={css({
      display: 'flex',
      flexDirection: 'column',
      height: 'full',
      padding: '4',
    }, props.className)}>
      {props.children}
    </div>
  );
};

const SidebarLink: Component<{
  link: {
    label: string;
    href: string;
    icon: any;
  };
}> = (props) => {
  return (
    <a
      href={props.link.href}
      class={css({
        display: 'flex',
        alignItems: 'center',
        gap: '3',
        padding: '3',
        borderRadius: 'md',
        transition: 'all 0.2s',
        color: 'neutral.600',
        _hover: {
          backgroundColor: 'neutral.100',
          color: 'neutral.900',
        },
        _dark: {
          color: 'neutral.400',
          _hover: {
            backgroundColor: 'neutral.700',
            color: 'neutral.100',
          },
        },
      })}
    >
      <span class={css({
        flexShrink: 0,
      })}>
        {props.link.icon}
      </span>
      <span class={css({
        fontSize: 'sm',
        fontWeight: 'medium',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      })}>
        {props.link.label}
      </span>
    </a>
  );
};

// Logo components
const Logo: Component = () => {
  return (
    <a
      href="#"
      class={css({
        position: 'relative',
        zIndex: '20',
        display: 'flex',
        alignItems: 'center',
        gap: '2',
        paddingY: '1',
        fontSize: 'sm',
        fontWeight: 'normal',
        color: 'black',
        _dark: { color: 'white' },
      })}
    >
      <div class={css({
        height: '5',
        width: '6',
        flexShrink: 0,
        borderTopLeftRadius: 'lg',
        borderTopRightRadius: 'sm',
        borderBottomRightRadius: 'lg',
        borderBottomLeftRadius: 'sm',
        backgroundColor: 'black',
        _dark: { backgroundColor: 'white' },
      })} />
      <span class={css({
        fontWeight: 'medium',
        whiteSpace: 'pre',
        color: 'black',
        opacity: 0,
        animation: 'fadeIn 0.3s ease-in-out 0.1s forwards',
        _dark: { color: 'white' },
      })}>
        Acet Labs
      </span>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </a>
  );
};

const LogoIcon: Component = () => {
  return (
    <a
      href="#"
      class={css({
        position: 'relative',
        zIndex: '20',
        display: 'flex',
        alignItems: 'center',
        gap: '2',
        paddingY: '1',
        fontSize: 'sm',
        fontWeight: 'normal',
        color: 'black',
        _dark: { color: 'white' },
      })}
    >
      <div class={css({
        height: '5',
        width: '6',
        flexShrink: 0,
        borderTopLeftRadius: 'lg',
        borderTopRightRadius: 'sm',
        borderBottomRightRadius: 'lg',
        borderBottomLeftRadius: 'sm',
        backgroundColor: 'black',
        _dark: { backgroundColor: 'white' },
      })} />
    </a>
  );
};

// Dashboard component
const Dashboard: Component = () => {
  return (
    <div class={css({ display: 'flex', flex: '1' })}>
      <div class={css({
        display: 'flex',
        height: 'full',
        width: 'full',
        flex: '1',
        flexDirection: 'column',
        gap: '2',
        borderTopLeftRadius: '2xl',
        border: '1px solid',
        borderColor: 'neutral.200',
        backgroundColor: 'white',
        padding: '2',
        md: { padding: '10' },
        _dark: {
          borderColor: 'neutral.700',
          backgroundColor: 'neutral.900',
        },
      })}>
        <div class={css({ display: 'flex', gap: '2' })}>
          <For each={Array.from({ length: 4 })}>
            {(_, idx) => (
              <div
                class={css({
                  height: '20',
                  width: 'full',
                  animation: 'pulse',
                  borderRadius: 'lg',
                  backgroundColor: 'gray.100',
                  _dark: { backgroundColor: 'neutral.800' },
                })}
              />
            )}
          </For>
        </div>
        <div class={css({ display: 'flex', flex: '1', gap: '2' })}>
          <For each={Array.from({ length: 2 })}>
            {(_, idx) => (
              <div
                class={css({
                  height: 'full',
                  width: 'full',
                  animation: 'pulse',
                  borderRadius: 'lg',
                  backgroundColor: 'gray.100',
                  _dark: { backgroundColor: 'neutral.800' },
                })}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export const SidebarDemo: Component = () => {
  const [open, setOpen] = createSignal(false);
  
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler class={css({
          height: '5',
          width: '5',
          flexShrink: 0,
          color: 'neutral.700',
          _dark: { color: 'neutral.200' },
        })} />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt class={css({
          height: '5',
          width: '5',
          flexShrink: 0,
          color: 'neutral.700',
          _dark: { color: 'neutral.200' },
        })} />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings class={css({
          height: '5',
          width: '5',
          flexShrink: 0,
          color: 'neutral.700',
          _dark: { color: 'neutral.200' },
        })} />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft class={css({
          height: '5',
          width: '5',
          flexShrink: 0,
          color: 'neutral.700',
          _dark: { color: 'neutral.200' },
        })} />
      ),
    },
  ];

  return (
    <div class={css({
      marginX: 'auto',
      display: 'flex',
      width: 'full',
      maxWidth: '7xl',
      flex: '1',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: 'md',
      border: '1px solid',
      borderColor: 'neutral.200',
      backgroundColor: 'gray.100',
      height: '60vh', // for your use case, use h-screen instead
      md: { flexDirection: 'row' },
      _dark: {
        borderColor: 'neutral.700',
        backgroundColor: 'neutral.800',
      },
    })}>
      <Sidebar open={open()} setOpen={setOpen}>
        <SidebarBody className={css({
          justifyContent: 'space-between',
          gap: '10',
        })}>
          <div class={css({
            display: 'flex',
            flex: '1',
            flexDirection: 'column',
            overflowX: 'hidden',
            overflowY: 'auto',
          })}>
            <Show when={open()} fallback={<LogoIcon />}>
              <Logo />
            </Show>
            <div class={css({
              marginTop: '8',
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}>
              <For each={links}>
                {(link) => <SidebarLink link={link} />}
              </For>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    class={css({
                      height: '7',
                      width: '7',
                      flexShrink: 0,
                      borderRadius: 'full',
                    })}
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
};

export default SidebarDemo;