import { css } from '@sse/ui/styled-system/css';
import { type Component, For, createSignal } from 'solid-js';

// Placeholder toast functionality - this would need to be implemented separately
const toast = {
  success: (message: string) => {
    console.log('Success:', message);
    // In a real implementation, you'd show a toast notification
  },
  error: (message: string) => {
    console.log('Error:', message);
    // In a real implementation, you'd show a toast notification
  },
};

// Placeholder Toaster component
const Toaster: Component<{ position?: string }> = () => null;

// Placeholder ButtonsCard component
const ButtonsCard: Component<{
  children: JSX.Element;
  onClick: () => void;
}> = (props) => {
  return (
    <div
      class={css({
        padding: '6',
        border: '1px solid',
        borderColor: 'gray.200',
        borderRadius: 'lg',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s',
        _hover: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
        _dark: {
          backgroundColor: 'gray.800',
          borderColor: 'gray.700',
        },
      })}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export const TailwindcssButtons: Component = () => {
  const copy = (button: { code?: string; component: JSX.Element }) => {
    if (button.code) {
      copyToClipboard(button.code);
      return;
    }
    // For SolidJS, we'll just copy the JSX as string
    const buttonString = button.component.toString();

    if (buttonString) {
      const textToCopy = buttonString;
      copyToClipboard(textToCopy);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard:', text);
        toast.success('Copied to clipboard');
      })
      .catch((err) => {
        console.error('Error copying text to clipboard:', err);
        toast.error('Error copying to clipboard');
      });
  };

  return (
    <div class={css({ paddingBottom: '40', paddingX: '4', width: 'full' })}>
      <Toaster position="top-center" />
      <div
        class={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          md: { gridTemplateColumns: 'repeat(2, 1fr)' },
          lg: { gridTemplateColumns: 'repeat(3, 1fr)' },
          width: 'full',
          maxWidth: '7xl',
          marginX: 'auto',
          gap: '10',
        })}
      >
        <For each={buttons}>
          {(button, idx) => (
            <ButtonsCard onClick={() => copy(button)}>{button.component}</ButtonsCard>
          )}
        </For>
      </div>
    </div>
  );
};

export const buttons = [
  {
    name: 'Sketch',
    description: 'Sketch button for your website',
    component: (
      <button
        class={css({
          paddingX: '4',
          paddingY: '2',
          borderRadius: 'md',
          border: '1px solid black',
          backgroundColor: 'white',
          color: 'black',
          fontSize: 'sm',
          transition: 'all 0.2s',
          _hover: {
            boxShadow: '4px 4px 0px 0px rgba(0,0,0)',
          },
        })}
      >
        Sketch
      </button>
    ),
  },
  {
    name: 'Simple',
    description: 'Elegant button for your website',
    component: (
      <button
        class={css({
          paddingX: '4',
          paddingY: '2',
          borderRadius: 'md',
          border: '1px solid',
          borderColor: 'neutral.300',
          backgroundColor: 'neutral.100',
          color: 'neutral.500',
          fontSize: 'sm',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: 'md',
          },
        })}
      >
        Simple
      </button>
    ),
  },
  {
    name: 'Invert',
    description: 'Simple button that inverts on hover',
    component: (
      <button
        class={css({
          paddingX: '8',
          paddingY: '2',
          borderRadius: 'md',
          backgroundColor: 'teal.500',
          color: 'white',
          fontWeight: 'bold',
          transition: 'all 0.2s',
          border: '2px solid transparent',
          _hover: {
            backgroundColor: 'white',
            color: 'black',
            borderColor: 'teal.500',
          },
        })}
      >
        Invert it
      </button>
    ),
  },
  {
    name: 'Tailwindcss Connect',
    description: 'Button featured on Tailwindcss Connect website',
    showDot: false,
    component: (
      <button
        class={css({
          backgroundColor: 'slate.800',
          textDecoration: 'none',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: 'full',
          padding: '1px',
          fontSize: 'xs',
          fontWeight: 'semibold',
          lineHeight: '6',
          color: 'white',
          display: 'inline-block',
          group: true,
        })}
      >
        <span
          class={css({
            position: 'absolute',
            inset: '0',
            overflow: 'hidden',
            borderRadius: 'full',
          })}
        >
          <span
            class={css({
              position: 'absolute',
              inset: '0',
              borderRadius: 'full',
              backgroundImage:
                'radial-gradient(75% 100% at 50% 0%, rgba(56,189,248,0.6) 0%, rgba(56,189,248,0) 75%)',
              opacity: '0',
              transition: 'opacity 0.5s',
              _groupHover: { opacity: '100' },
            })}
          />
        </span>
        <div
          class={css({
            position: 'relative',
            display: 'flex',
            gap: '2',
            alignItems: 'center',
            zIndex: '10',
            borderRadius: 'full',
            backgroundColor: 'zinc.950',
            paddingY: '0.5',
            paddingX: '4',
            ring: '1px',
            ringColor: 'rgba(255,255,255,0.1)',
          })}
        >
          <span>Tailwind Connect</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M10.75 8.75L14.25 12L10.75 15.25"
            />
          </svg>
        </div>
        <span
          class={css({
            position: 'absolute',
            bottom: '0',
            left: '1.125rem',
            height: '1px',
            width: 'calc(100% - 2.25rem)',
            background:
              'linear-gradient(to right, rgba(52,211,153,0) 0%, rgba(52,211,153,0.9) 50%, rgba(52,211,153,0) 100%)',
            transition: 'opacity 0.5s',
            opacity: '0',
            _groupHover: { opacity: '40' },
          })}
        />
      </button>
    ),
  },
  {
    name: 'Gradient',
    description: 'Simple Gradient button with rounded corners',
    component: (
      <button
        class={css({
          paddingX: '8',
          paddingY: '2',
          borderRadius: 'full',
          background: 'linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235))',
          color: 'white',
          transition: 'all 0.2s',
          _focus: {
            ring: '2px',
            ringColor: 'blue.400',
          },
          _hover: {
            boxShadow: 'xl',
          },
        })}
      >
        Gradient
      </button>
    ),
  },
  {
    name: 'Unapologetic',
    description: 'Unapologetic button with perfect corners',
    component: (
      <button
        class={css({
          paddingX: '8',
          paddingY: '2',
          border: '1px solid black',
          backgroundColor: 'transparent',
          color: 'black',
          position: 'relative',
          transition: 'all 0.2s',
          group: true,
          _dark: { borderColor: 'white' },
        })}
      >
        <div
          class={css({
            position: 'absolute',
            bottom: '-8px',
            right: '-8px',
            backgroundColor: 'yellow.300',
            height: 'full',
            width: 'full',
            zIndex: '-10',
            transition: 'all 0.2s',
            _groupHover: {
              bottom: '0',
              right: '0',
            },
          })}
        />
        <span class={css({ position: 'relative' })}>Unapologetic</span>
      </button>
    ),
  },
  {
    name: 'Lit up borders',
    description: 'Gradient button with perfect corners',
    component: (
      <button class={css({ padding: '3px', position: 'relative' })}>
        <div
          class={css({
            position: 'absolute',
            inset: '0',
            background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247))',
            borderRadius: 'lg',
          })}
        />
        <div
          class={css({
            paddingX: '8',
            paddingY: '2',
            backgroundColor: 'black',
            borderRadius: '6px',
            position: 'relative',
            transition: 'all 0.2s',
            color: 'white',
            group: true,
            _groupHover: {
              backgroundColor: 'transparent',
            },
          })}
        >
          Lit up borders
        </div>
      </button>
    ),
  },
  {
    name: 'Border Magic',
    description: 'Border Magic button for your website',
    showDot: false,
    component: (
      <button
        class={css({
          position: 'relative',
          display: 'inline-flex',
          height: '12',
          overflow: 'hidden',
          borderRadius: 'full',
          padding: '1px',
          _focus: {
            outline: 'none',
            ring: '2px',
            ringColor: 'slate.400',
            ringOffset: '2px',
            ringOffsetColor: 'slate.50',
          },
        })}
      >
        <span
          class={css({
            position: 'absolute',
            inset: '-1000%',
            animation: 'spin 2s linear infinite',
            background:
              'conic-gradient(from 90deg at 50% 50%, #E2CBFF 0%, #393BB2 50%, #E2CBFF 100%)',
          })}
        />
        <span
          class={css({
            display: 'inline-flex',
            height: 'full',
            width: 'full',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'full',
            backgroundColor: 'slate.950',
            paddingX: '3',
            paddingY: '1',
            fontSize: 'sm',
            fontWeight: 'medium',
            color: 'white',
            backdropFilter: 'blur(3xl)',
          })}
        >
          Border Magic
        </span>
      </button>
    ),
  },
  {
    name: 'Brutal',
    description: 'Brutal button for your website',
    component: (
      <button
        class={css({
          paddingX: '8',
          paddingY: '0.5',
          border: '2px solid black',
          textTransform: 'uppercase',
          backgroundColor: 'white',
          color: 'black',
          transition: 'all 0.2s',
          fontSize: 'sm',
          boxShadow:
            '1px 1px rgba(0,0,0), 2px 2px rgba(0,0,0), 3px 3px rgba(0,0,0), 4px 4px rgba(0,0,0), 5px 5px 0px 0px rgba(0,0,0)',
          _dark: {
            borderColor: 'white',
            boxShadow:
              '1px 1px rgba(255,255,255), 2px 2px rgba(255,255,255), 3px 3px rgba(255,255,255), 4px 4px rgba(255,255,255), 5px 5px 0px 0px rgba(255,255,255)',
          },
        })}
      >
        Brutal
      </button>
    ),
  },
  {
    name: 'Favourite',
    description: 'Favourite button for your website',
    component: (
      <button
        class={css({
          paddingX: '8',
          paddingY: '2',
          backgroundColor: 'black',
          color: 'white',
          fontSize: 'sm',
          borderRadius: 'md',
          fontWeight: 'semibold',
          transition: 'all 0.2s',
          _hover: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            boxShadow: 'lg',
          },
        })}
      >
        Favourite
      </button>
    ),
  },
];

export default TailwindcssButtons;
