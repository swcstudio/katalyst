import { css } from '@sse/ui/styled-system/css';
import { type Component, For, createSignal } from 'solid-js';

// Placeholder ScriptCopyBtn component - this would need to be implemented separately
const ScriptCopyBtn: Component<{
  showMultiplePackageOptions: boolean;
  codeLanguage: string;
  lightTheme: string;
  darkTheme: string;
  commandMap: Record<string, string>;
}> = (props) => {
  const [selectedPackage, setSelectedPackage] = createSignal('npm');
  const [copied, setCopied] = createSignal(false);

  const packageManagers = Object.keys(props.commandMap);

  const handleCopy = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div
      class={css({
        backgroundColor: 'gray.900',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'gray.700',
        overflow: 'hidden',
        fontFamily: 'mono',
        _dark: {
          backgroundColor: 'gray.950',
          borderColor: 'gray.800',
        },
      })}
    >
      {/* Header with package manager tabs */}
      {props.showMultiplePackageOptions && (
        <div
          class={css({
            display: 'flex',
            backgroundColor: 'gray.800',
            borderBottom: '1px solid',
            borderColor: 'gray.700',
            _dark: {
              backgroundColor: 'gray.900',
              borderColor: 'gray.800',
            },
          })}
        >
          <For each={packageManagers}>
            {(pkg) => (
              <button
                class={css({
                  paddingX: '4',
                  paddingY: '2',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  borderRight: '1px solid',
                  borderColor: 'gray.700',
                  backgroundColor: selectedPackage() === pkg ? 'gray.700' : 'transparent',
                  color: selectedPackage() === pkg ? 'white' : 'gray.300',
                  transition: 'all 0.2s',
                  _hover: {
                    backgroundColor: 'gray.700',
                    color: 'white',
                  },
                  _dark: {
                    borderColor: 'gray.800',
                    backgroundColor: selectedPackage() === pkg ? 'gray.800' : 'transparent',
                    _hover: {
                      backgroundColor: 'gray.800',
                    },
                  },
                })}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg}
              </button>
            )}
          </For>
        </div>
      )}

      {/* Code block */}
      <div
        class={css({
          position: 'relative',
          padding: '4',
          backgroundColor: 'gray.900',
          _dark: {
            backgroundColor: 'gray.950',
          },
        })}
      >
        <pre
          class={css({
            fontSize: 'sm',
            color: 'gray.100',
            overflow: 'auto',
            margin: '0',
          })}
        >
          <code>{props.commandMap[selectedPackage()]}</code>
        </pre>

        {/* Copy button */}
        <button
          class={css({
            position: 'absolute',
            top: '2',
            right: '2',
            padding: '2',
            backgroundColor: 'gray.700',
            borderRadius: 'md',
            fontSize: 'xs',
            color: 'white',
            border: '1px solid',
            borderColor: 'gray.600',
            transition: 'all 0.2s',
            _hover: {
              backgroundColor: 'gray.600',
            },
            _dark: {
              backgroundColor: 'gray.800',
              borderColor: 'gray.700',
              _hover: {
                backgroundColor: 'gray.700',
              },
            },
          })}
          onClick={() => handleCopy(props.commandMap[selectedPackage()])}
        >
          {copied() ? (
            <span class={css({ color: 'green.400' })}>✓ Copied</span>
          ) : (
            <span>📋 Copy</span>
          )}
        </button>
      </div>
    </div>
  );
};

export const ScriptCopyBtnDemo: Component = () => {
  const customCommandMap = {
    npm: 'npm run shadcn add button',
    yarn: 'yarn shadcn add button',
    pnpm: 'pnpm dlx shadcn@latest add button',
    bun: 'bun x shadcn@latest add button',
  };

  return (
    <div
      class={css({
        maxWidth: '2xl',
        marginX: 'auto',
        padding: '4',
      })}
    >
      <div
        class={css({
          marginBottom: '4',
          textAlign: 'center',
        })}
      >
        <h3
          class={css({
            fontSize: 'lg',
            fontWeight: 'semibold',
            color: 'gray.900',
            marginBottom: '2',
            _dark: {
              color: 'white',
            },
          })}
        >
          Install Button Component
        </h3>
        <p
          class={css({
            fontSize: 'sm',
            color: 'gray.600',
            _dark: {
              color: 'gray.400',
            },
          })}
        >
          Choose your preferred package manager
        </p>
      </div>

      <ScriptCopyBtn
        showMultiplePackageOptions={true}
        codeLanguage="shell"
        lightTheme="nord"
        darkTheme="vitesse-dark"
        commandMap={customCommandMap}
      />
    </div>
  );
};

export default ScriptCopyBtnDemo;
