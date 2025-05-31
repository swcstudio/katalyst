import { Component, JSX, mergeProps, children, createSignal, For } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

export interface SafariTab {
  id: string;
  title: string;
  url: string;
  active?: boolean;
  favicon?: string;
}

export interface SafariProps {
  children?: JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
  url?: string;
  title?: string;
  tabs?: SafariTab[];
  showBookmarks?: boolean;
  darkMode?: boolean;
}

const Safari: Component<SafariProps> = (props) => {
  const merged = mergeProps(
    {
      size: 'md' as const,
      url: 'https://example.com',
      title: 'Example Website',
      tabs: [
        {
          id: '1',
          title: 'Example Website',
          url: 'https://example.com',
          active: true,
          favicon: '🌐',
        },
      ],
      showBookmarks: false,
      darkMode: false,
    },
    props
  );

  const resolved = children(() => props.children);
  const [activeTab, setActiveTab] = createSignal(merged.tabs.find(tab => tab.active)?.id || merged.tabs[0]?.id);

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        width: '600px',
        height: '400px',
        borderRadius: '8px',
      },
      md: {
        width: '800px',
        height: '600px',
        borderRadius: '12px',
      },
      lg: {
        width: '1200px',
        height: '800px',
        borderRadius: '16px',
      },
    };

    return sizes[merged.size];
  };

  const sizeStyles = getSizeStyles();

  const getThemeStyles = () => {
    if (merged.darkMode) {
      return {
        background: '#1c1c1e',
        border: '1px solid #38383a',
        color: '#ffffff',
      };
    }
    return {
      background: '#ffffff',
      border: '1px solid #d1d5db',
      color: '#000000',
    };
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: sizeStyles.borderRadius,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }, merged.className)}
      style={{
        ...sizeStyles,
        ...themeStyles,
        ...merged.style,
      }}
    >
      {/* Title bar */}
      <div
        class={css({
          display: 'flex',
          alignItems: 'center',
          height: '40px',
          padding: '0 16px',
          backgroundColor: merged.darkMode ? '#2c2c2e' : '#f5f5f7',
          borderBottom: merged.darkMode ? '1px solid #38383a' : '1px solid #d1d5db',
        })}
      >
        {/* Traffic lights */}
        <div class={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
          <div
            class={css({
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ff5f57',
              cursor: 'pointer',
              _hover: { backgroundColor: '#ff3b30' },
            })}
          />
          <div
            class={css({
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ffbd2e',
              cursor: 'pointer',
              _hover: { backgroundColor: '#ff9500' },
            })}
          />
          <div
            class={css({
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#28ca42',
              cursor: 'pointer',
              _hover: { backgroundColor: '#30d158' },
            })}
          />
        </div>

        {/* Window title */}
        <div
          class={css({
            flex: 1,
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '500',
            color: merged.darkMode ? '#ffffff' : '#1d1d1f',
          })}
        >
          {merged.title}
        </div>
      </div>

      {/* Tab bar */}
      <div
        class={css({
          display: 'flex',
          alignItems: 'center',
          height: '36px',
          backgroundColor: merged.darkMode ? '#2c2c2e' : '#f5f5f7',
          borderBottom: merged.darkMode ? '1px solid #38383a' : '1px solid #d1d5db',
          overflow: 'hidden',
        })}
      >
        <For each={merged.tabs}>
          {(tab) => (
            <div
              class={css({
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                padding: '0 12px',
                minWidth: '120px',
                maxWidth: '240px',
                flex: 1,
                cursor: 'pointer',
                backgroundColor: tab.id === activeTab() 
                  ? (merged.darkMode ? '#1c1c1e' : '#ffffff')
                  : 'transparent',
                borderRight: merged.darkMode ? '1px solid #38383a' : '1px solid #d1d5db',
                _hover: {
                  backgroundColor: tab.id === activeTab() 
                    ? (merged.darkMode ? '#1c1c1e' : '#ffffff')
                    : (merged.darkMode ? '#38383a' : '#e5e5e7'),
                },
              })}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.favicon && (
                <span class={css({ marginRight: '6px', fontSize: '12px' })}>
                  {tab.favicon}
                </span>
              )}
              <span
                class={css({
                  fontSize: '12px',
                  color: merged.darkMode ? '#ffffff' : '#1d1d1f',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                })}
              >
                {tab.title}
              </span>
            </div>
          )}
        </For>
        
        {/* Add tab button */}
        <div
          class={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '100%',
            cursor: 'pointer',
            fontSize: '16px',
            color: merged.darkMode ? '#8e8e93' : '#8e8e93',
            _hover: {
              backgroundColor: merged.darkMode ? '#38383a' : '#e5e5e7',
            },
          })}
        >
          +
        </div>
      </div>

      {/* Navigation bar */}
      <div
        class={css({
          display: 'flex',
          alignItems: 'center',
          height: '44px',
          padding: '0 12px',
          backgroundColor: merged.darkMode ? '#2c2c2e' : '#f5f5f7',
          borderBottom: merged.darkMode ? '1px solid #38383a' : '1px solid #d1d5db',
          gap: '8px',
        })}
      >
        {/* Navigation buttons */}
        <div class={css({ display: 'flex', alignItems: 'center', gap: '4px' })}>
          <button
            class={css({
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: merged.darkMode ? '#8e8e93' : '#8e8e93',
              _hover: {
                backgroundColor: merged.darkMode ? '#38383a' : '#e5e5e7',
              },
            })}
          >
            ←
          </button>
          <button
            class={css({
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: merged.darkMode ? '#8e8e93' : '#8e8e93',
              _hover: {
                backgroundColor: merged.darkMode ? '#38383a' : '#e5e5e7',
              },
            })}
          >
            →
          </button>
        </div>

        {/* Address bar */}
        <div
          class={css({
            flex: 1,
            height: '28px',
            backgroundColor: merged.darkMode ? '#1c1c1e' : '#ffffff',
            border: merged.darkMode ? '1px solid #38383a' : '1px solid #d1d5db',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            fontSize: '13px',
            color: merged.darkMode ? '#ffffff' : '#1d1d1f',
          })}
        >
          🔒 {merged.url}
        </div>

        {/* Reload button */}
        <button
          class={css({
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: merged.darkMode ? '#8e8e93' : '#8e8e93',
            _hover: {
              backgroundColor: merged.darkMode ? '#38383a' : '#e5e5e7',
            },
          })}
        >
          ↻
        </button>
      </div>

      {/* Bookmarks bar */}
      {merged.showBookmarks && (
        <div
          class={css({
            display: 'flex',
            alignItems: 'center',
            height: '32px',
            padding: '0 12px',
            backgroundColor: merged.darkMode ? '#2c2c2e' : '#f5f5f7',
            borderBottom: merged.darkMode ? '1px solid #38383a' : '1px solid #d1d5db',
            gap: '12px',
            fontSize: '12px',
            color: merged.darkMode ? '#8e8e93' : '#8e8e93',
          })}
        >
          <div class={css({ cursor: 'pointer', _hover: { color: merged.darkMode ? '#ffffff' : '#1d1d1f' } })}>
            📁 Favorites
          </div>
          <div class={css({ cursor: 'pointer', _hover: { color: merged.darkMode ? '#ffffff' : '#1d1d1f' } })}>
            🔖 Work
          </div>
          <div class={css({ cursor: 'pointer', _hover: { color: merged.darkMode ? '#ffffff' : '#1d1d1f' } })}>
            💻 Dev
          </div>
        </div>
      )}

      {/* Content area */}
      <div
        class={css({
          flex: 1,
          width: '100%',
          backgroundColor: merged.darkMode ? '#1c1c1e' : '#ffffff',
          overflow: 'auto',
        })}
      >
        {resolved()}
      </div>
    </div>
  );
};

export default Safari;