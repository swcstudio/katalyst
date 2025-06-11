import { css } from '@sse/ui/styled-system/css';
import { type Component, For, Show, createSignal } from 'solid-js';

interface Tab {
  title: string;
  value: string;
  content: JSX.Element;
}

// Placeholder Tabs component - this would need to be implemented separately
const Tabs: Component<{
  tabs: Tab[];
  className?: string;
}> = (props) => {
  const [activeTab, setActiveTab] = createSignal(props.tabs[0]?.value || '');

  return (
    <div
      class={css(
        {
          width: 'full',
          height: 'full',
        },
        props.className
      )}
    >
      {/* Tab Headers */}
      <div
        class={css({
          display: 'flex',
          gap: '1',
          marginBottom: '6',
          backgroundColor: 'gray.100',
          padding: '1',
          borderRadius: 'xl',
          _dark: {
            backgroundColor: 'gray.800',
          },
        })}
      >
        <For each={props.tabs}>
          {(tab) => (
            <button
              class={css({
                paddingX: '6',
                paddingY: '3',
                borderRadius: 'lg',
                fontSize: 'sm',
                fontWeight: 'medium',
                transition: 'all 0.2s',
                backgroundColor: activeTab() === tab.value ? 'white' : 'transparent',
                color: activeTab() === tab.value ? 'gray.900' : 'gray.600',
                boxShadow: activeTab() === tab.value ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                _hover: {
                  color: 'gray.900',
                },
                _dark: {
                  backgroundColor: activeTab() === tab.value ? 'gray.700' : 'transparent',
                  color: activeTab() === tab.value ? 'white' : 'gray.400',
                  _hover: {
                    color: 'white',
                  },
                },
              })}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.title}
            </button>
          )}
        </For>
      </div>

      {/* Tab Content */}
      <div
        class={css({
          width: 'full',
          height: 'full',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2xl',
          perspective: '1000px',
        })}
      >
        <For each={props.tabs}>
          {(tab) => (
            <Show when={activeTab() === tab.value}>
              <div
                class={css({
                  width: 'full',
                  height: 'full',
                  position: 'absolute',
                  inset: '0',
                  animation: 'fadeInScale 0.3s ease-out',
                })}
              >
                {tab.content}
              </div>
            </Show>
          )}
        </For>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateX(0deg);
          }
        }
      `}</style>
    </div>
  );
};

const DummyContent: Component = () => {
  return (
    <img
      src="/linear.webp"
      alt="dummy image"
      width="1000"
      height="1000"
      class={css({
        objectFit: 'cover',
        objectPosition: 'left top',
        height: '60%',
        position: 'absolute',
        bottom: '-10',
        insetX: '0',
        width: '90%',
        borderRadius: 'xl',
        marginX: 'auto',
        md: {
          height: '90%',
        },
      })}
    />
  );
};

export const TabsDemo: Component = () => {
  const tabs: Tab[] = [
    {
      title: 'Product',
      value: 'product',
      content: (
        <div
          class={css({
            width: 'full',
            overflow: 'hidden',
            position: 'relative',
            height: 'full',
            borderRadius: '2xl',
            padding: '10',
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(to bottom right, rgb(126, 34, 206), rgb(109, 40, 217))', // from-purple-700 to-violet-900
            md: {
              fontSize: '4xl',
            },
          })}
        >
          <p>Product Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: 'Services',
      value: 'services',
      content: (
        <div
          class={css({
            width: 'full',
            overflow: 'hidden',
            position: 'relative',
            height: 'full',
            borderRadius: '2xl',
            padding: '10',
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(to bottom right, rgb(126, 34, 206), rgb(109, 40, 217))', // from-purple-700 to-violet-900
            md: {
              fontSize: '4xl',
            },
          })}
        >
          <p>Services tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: 'Playground',
      value: 'playground',
      content: (
        <div
          class={css({
            width: 'full',
            overflow: 'hidden',
            position: 'relative',
            height: 'full',
            borderRadius: '2xl',
            padding: '10',
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(to bottom right, rgb(126, 34, 206), rgb(109, 40, 217))', // from-purple-700 to-violet-900
            md: {
              fontSize: '4xl',
            },
          })}
        >
          <p>Playground tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: 'Content',
      value: 'content',
      content: (
        <div
          class={css({
            width: 'full',
            overflow: 'hidden',
            position: 'relative',
            height: 'full',
            borderRadius: '2xl',
            padding: '10',
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(to bottom right, rgb(126, 34, 206), rgb(109, 40, 217))', // from-purple-700 to-violet-900
            md: {
              fontSize: '4xl',
            },
          })}
        >
          <p>Content tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: 'Random',
      value: 'random',
      content: (
        <div
          class={css({
            width: 'full',
            overflow: 'hidden',
            position: 'relative',
            height: 'full',
            borderRadius: '2xl',
            padding: '10',
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(to bottom right, rgb(126, 34, 206), rgb(109, 40, 217))', // from-purple-700 to-violet-900
            md: {
              fontSize: '4xl',
            },
          })}
        >
          <p>Random tab</p>
          <DummyContent />
        </div>
      ),
    },
  ];

  return (
    <div
      class={css({
        height: '20rem',
        perspective: '1000px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '5xl',
        marginX: 'auto',
        width: 'full',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginY: '40',
        md: {
          height: '40rem',
        },
      })}
    >
      <Tabs tabs={tabs} />
    </div>
  );
};

export default TabsDemo;
