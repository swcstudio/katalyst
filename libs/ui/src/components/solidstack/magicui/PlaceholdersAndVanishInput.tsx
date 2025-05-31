import { Component, JSX, createSignal, onMount, onCleanup, For } from 'solid-js';
import { cx } from '@sse/ui/styled-system/css';
import { css } from '@sse/ui/styled-system/css';
import { animate } from 'motion';

export interface PlaceholdersAndVanishInputProps {
  placeholders: string[];
  onChange?: (e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => void;
  onSubmit?: (e: Event & { currentTarget: HTMLFormElement; target: HTMLFormElement }) => void;
  className?: string;
}

export const PlaceholdersAndVanishInputDemo: Component = () => {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => {
    console.log(e.target.value);
  };
  
  const onSubmit = (e: Event & { currentTarget: HTMLFormElement; target: HTMLFormElement }) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div class={css({
      height: '640px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingX: '16px'
    })}>
      <h2 class={css({
        marginBottom: '40px',
        fontSize: 'xl',
        textAlign: 'center',
        color: 'black',
        sm: { marginBottom: '80px', fontSize: '5xl' },
        _dark: { color: 'white' }
      })}>
        Ask Aceternity UI Anything
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export const PlaceholdersAndVanishInput: Component<PlaceholdersAndVanishInputProps> = (props) => {
  const [currentPlaceholder, setCurrentPlaceholder] = createSignal(0);
  const [inputValue, setInputValue] = createSignal('');
  const [animating, setAnimating] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);
  
  let inputRef: HTMLInputElement;
  let placeholderRef: HTMLDivElement;
  let intervalId: number;

  const cyclePlaceholders = () => {
    if (animating()) return;
    
    setAnimating(true);
    
    if (placeholderRef) {
      animate(
        placeholderRef,
        {
          y: [0, -40],
          opacity: [1, 0],
        },
        {
          duration: 0.3,
          easing: 'ease-in',
        }
      ).then(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % props.placeholders.length);
        
        animate(
          placeholderRef,
          {
            y: [40, 0],
            opacity: [0, 1],
          },
          {
            duration: 0.3,
            easing: 'ease-out',
          }
        ).then(() => {
          setAnimating(false);
        });
      });
    }
  };

  const handleSubmit = (e: Event & { currentTarget: HTMLFormElement; target: HTMLFormElement }) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (inputRef) {
      animate(
        inputRef,
        {
          scale: [1, 0.8, 0],
          opacity: [1, 0.5, 0],
        },
        {
          duration: 0.8,
          easing: 'ease-in-out',
        }
      );
    }
    
    if (placeholderRef) {
      animate(
        placeholderRef,
        {
          scale: [1, 0.8, 0],
          opacity: [1, 0.5, 0],
        },
        {
          duration: 0.8,
          easing: 'ease-in-out',
        }
      );
    }
    
    props.onSubmit?.(e);
    
    setTimeout(() => {
      setSubmitted(false);
      setInputValue('');
      if (inputRef) {
        animate(
          inputRef,
          {
            scale: [0, 1],
            opacity: [0, 1],
          },
          {
            duration: 0.5,
            easing: 'ease-out',
          }
        );
      }
      if (placeholderRef) {
        animate(
          placeholderRef,
          {
            scale: [0, 1],
            opacity: [0, 1],
          },
          {
            duration: 0.5,
            easing: 'ease-out',
          }
        );
      }
    }, 2000);
  };

  const handleChange = (e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => {
    setInputValue(e.target.value);
    props.onChange?.(e);
  };

  onMount(() => {
    intervalId = setInterval(cyclePlaceholders, 3000);
    
    onCleanup(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });
  });

  return (
    <form
      class={cx(
        css({
          position: 'relative',
          width: '100%',
          maxWidth: '512px',
          marginX: 'auto'
        }),
        props.className
      )}
      onSubmit={handleSubmit}
    >
      <div class={css({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'gray.300',
        backgroundColor: 'white',
        _dark: {
          borderColor: 'gray.700',
          backgroundColor: 'gray.900'
        }
      })}>
        <input
          ref={inputRef!}
          value={inputValue()}
          onInput={handleChange}
          class={css({
            width: '100%',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            paddingX: '20px',
            paddingY: '16px',
            fontSize: 'base',
            color: 'gray.900',
            _dark: { color: 'gray.100' },
            _placeholder: {
              color: 'transparent'
            }
          })}
          placeholder=""
        />
        
        <div
          ref={placeholderRef!}
          class={css({
            position: 'absolute',
            left: '20px',
            top: '16px',
            pointerEvents: 'none',
            fontSize: 'base',
            color: 'gray.500',
            transition: 'all 0.3s ease',
            _dark: { color: 'gray.400' }
          })}
          style={{
            opacity: inputValue() ? 0 : 1
          }}
        >
          {props.placeholders[currentPlaceholder()]}
        </div>

        <button
          type="submit"
          class={css({
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'gray.900',
            color: 'white',
            borderRadius: '8px',
            paddingX: '12px',
            paddingY: '8px',
            fontSize: 'sm',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            _hover: {
              backgroundColor: 'gray.700',
              transform: 'translateY(-50%) scale(1.05)'
            },
            _dark: {
              backgroundColor: 'white',
              color: 'gray.900',
              _hover: {
                backgroundColor: 'gray.200'
              }
            }
          })}
        >
          →
        </button>
      </div>

      {submitted() && (
        <div class={css({
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'green.50',
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'green.200',
          _dark: {
            backgroundColor: 'green.900',
            borderColor: 'green.700'
          }
        })}>
          <span class={css({
            color: 'green.700',
            fontWeight: '500',
            _dark: { color: 'green.300' }
          })}>
            ✓ Submitted!
          </span>
        </div>
      )}
    </form>
  );
};

export default PlaceholdersAndVanishInputDemo;