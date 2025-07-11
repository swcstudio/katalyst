import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { type Component, For, JSX, createSignal } from 'solid-js';

export interface CodeBlockProps {
  language: string;
  filename?: string;
  highlightLines?: number[];
  code: string;
  className?: string;
}

export const CodeBlockDemo: Component = () => {
  const code = `const DummyComponent = () => {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Fights Counter</h2>
      <p className="mb-2">Fight Club Fights Count: {count}</p>
      <button 
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment
      </button>
    </div>
  );
};
`;

  return (
    <div class={css({ maxWidth: '768px', marginX: 'auto', width: '100%' })}>
      <CodeBlock
        language="jsx"
        filename="DummyComponent.jsx"
        highlightLines={[9, 13, 14, 18]}
        code={code}
      />
    </div>
  );
};

export const CodeBlock: Component<CodeBlockProps> = (props) => {
  const [copied, setCopied] = createSignal(false);

  const lines = () => props.code.split('\n');
  const highlightSet = () => new Set(props.highlightLines || []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div
      class={cx(
        css({
          border: '1px solid',
          borderColor: 'gray.200',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'gray.50',
          _dark: {
            borderColor: 'gray.800',
            backgroundColor: 'gray.900',
          },
        }),
        props.className
      )}
    >
      {/* Header */}
      {props.filename && (
        <div
          class={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingX: '16px',
            paddingY: '12px',
            backgroundColor: 'gray.100',
            borderBottom: '1px solid',
            borderBottomColor: 'gray.200',
            _dark: {
              backgroundColor: 'gray.800',
              borderBottomColor: 'gray.700',
            },
          })}
        >
          <div class={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
            <div class={css({ display: 'flex', gap: '4px' })}>
              <div
                class={css({
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'red.400',
                })}
              />
              <div
                class={css({
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'yellow.400',
                })}
              />
              <div
                class={css({
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'green.400',
                })}
              />
            </div>
            <span
              class={css({
                fontSize: 'sm',
                fontWeight: '500',
                color: 'gray.700',
                _dark: { color: 'gray.300' },
              })}
            >
              {props.filename}
            </span>
          </div>

          <button
            onClick={copyToClipboard}
            class={css({
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              paddingX: '8px',
              paddingY: '4px',
              fontSize: 'xs',
              fontWeight: '500',
              color: 'gray.600',
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'gray.300',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              _hover: {
                backgroundColor: 'gray.50',
                borderColor: 'gray.400',
              },
              _dark: {
                color: 'gray.400',
                backgroundColor: 'gray.700',
                borderColor: 'gray.600',
                _hover: {
                  backgroundColor: 'gray.600',
                  borderColor: 'gray.500',
                },
              },
            })}
          >
            {copied() ? (
              <>
                <CheckIcon />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon />
                Copy
              </>
            )}
          </button>
        </div>
      )}

      {/* Code Content */}
      <div
        class={css({
          position: 'relative',
          overflow: 'auto',
          maxHeight: '500px',
        })}
      >
        <pre
          class={css({
            margin: 0,
            padding: '16px',
            fontSize: 'sm',
            lineHeight: '1.5',
            fontFamily: 'mono',
            backgroundColor: 'transparent',
            color: 'gray.800',
            _dark: { color: 'gray.200' },
          })}
        >
          <code class={css({ display: 'block' })}>
            <For each={lines()}>
              {(line, index) => {
                const lineNumber = index() + 1;
                const isHighlighted = highlightSet().has(lineNumber);

                return (
                  <div
                    class={css({
                      display: 'flex',
                      minHeight: '24px',
                      paddingX: '8px',
                      paddingY: '1px',
                      backgroundColor: isHighlighted ? 'blue.50' : 'transparent',
                      borderLeft: isHighlighted ? '3px solid' : '3px solid transparent',
                      borderLeftColor: isHighlighted ? 'blue.400' : 'transparent',
                      _dark: {
                        backgroundColor: isHighlighted ? 'blue.900/20' : 'transparent',
                        borderLeftColor: isHighlighted ? 'blue.500' : 'transparent',
                      },
                    })}
                  >
                    {/* Line number */}
                    <span
                      class={css({
                        display: 'inline-block',
                        width: '32px',
                        flexShrink: 0,
                        textAlign: 'right',
                        marginRight: '16px',
                        color: 'gray.400',
                        fontSize: 'xs',
                        userSelect: 'none',
                        _dark: { color: 'gray.600' },
                      })}
                    >
                      {lineNumber}
                    </span>

                    {/* Code line */}
                    <span class={css({ flex: 1, whiteSpace: 'pre' })}>{line || ' '}</span>
                  </div>
                );
              }}
            </For>
          </code>
        </pre>
      </div>
    </div>
  );
};

const CopyIcon: Component = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon: Component = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);
